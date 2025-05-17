import { createClient } from '@/utils/supabase/client';

export async function GET(request) {
  const supabase = createClient();

  try {
    // Handle expired givers (7-day maturity)
    const { data: expiredGivers, error: expiredGiversError } = await supabase
      .from('merge_givers')
      .select('*')
      .lte('expires_at', new Date().toISOString())
      .eq('status', 'waiting');

    if (expiredGiversError) {
      throw new Error(`Expired Givers Error: ${expiredGiversError.message}`);
    }

    for (const giver of expiredGivers || []) {
      await supabase
        .from('merge_givers')
        .update({ status: 'eligible' })
        .eq('id', giver.id);

      await supabase.from('notifications').insert({
        user_id: giver.user_id,
        message: 'You are now eligible to withdraw.',
        is_read: false,
      });
    }

    // Handle receivers in the 24-hour queue
    const { data: queuedReceivers, error: receiverError } = await supabase
      .from('merge_receivers')
      .select('*')
      .eq('status', 'queued')
      .lte('queued_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (receiverError) {
      throw new Error(`Queued Receivers Error: ${receiverError.message}`);
    }

    for (const receiver of queuedReceivers || []) {
      await supabase
        .from('merge_receivers')
        .update({ status: 'ready' })
        .eq('id', receiver.id);

      await supabase.from('notifications').insert({
        user_id: receiver.user_id,
        message: 'You have been assigned a giver.',
        is_read: false,
      });
    }

    // Handle givers in the 24-hour queue
    const { data: queuedGivers, error: queuedGiversError } = await supabase
      .from('merge_givers')
      .select('*')
      .eq('status', 'queued')
      .lte('queued_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (queuedGiversError) {
      throw new Error(`Queued Givers Error: ${queuedGiversError.message}`);
    }

    for (const giver of queuedGivers || []) {
      await supabase
        .from('merge_givers')
        .update({ status: 'ready' })
        .eq('id', giver.id);

      await supabase.from('notifications').insert({
        user_id: giver.user_id,
        message: 'You have been assigned a receiver.',
        is_read: false,
      });
    }

    // ✅ MATCHING LOGIC (Option 1: partial merging allowed)
    const { data: receivers } = await supabase
      .from("merge_receivers")
      .select("*")
      .eq("status", "ready")
      .gt("amount_remaining", 0)
      .order("created_at");

    const { data: givers } = await supabase
      .from("merge_givers")
      .select("*")
      .eq("status", "ready")
      .gt("amount_remaining", 0)
      .order("created_at");

    for (const receiver of receivers || []) {
      let receiverNeed = receiver.amount_remaining;

      for (const giver of givers || []) {
        if (receiverNeed <= 0) break;
        if (giver.amount_remaining <= 0) continue;

        const matchAmount = Math.min(receiverNeed, giver.amount_remaining);

        await supabase.from("merge_matches").insert({
          giver_id: giver.id,
          receiver_id: receiver.id,
          matched_amount: matchAmount,
        });

        // Update giver
        const newGiverAmt = giver.amount_remaining - matchAmount;
        await supabase
          .from("merge_givers")
          .update({
            amount_remaining: newGiverAmt,
            status: newGiverAmt === 0 ? "matched" : "pending",
          })
          .eq("id", giver.id);
        giver.amount_remaining = newGiverAmt;

        // Update receiver
        receiverNeed -= matchAmount;
      }

      const newReceiverAmt = receiver.amount_remaining - (receiver.amount_remaining - receiverNeed);
      await supabase
        .from("merge_receivers")
        .update({
          amount_remaining: newReceiverAmt,
          status: newReceiverAmt === 0 ? "matched" : "pending",
        })
        .eq("id", receiver.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cron job failed:', error.message);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Cron job failed',
        error: error.message,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
