import { createClient } from '@/utils/supabase/client';

export async function GET(request) {
  const supabase = createClient();

  try {
    const now = new Date().toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // === 1. Handle Expired Givers ===
    const { data: expiredGivers, error: expiredGiversError } = await supabase
      .from('merge_givers')
      .select('*')
      .lte('expires_at', now)
      .eq('status', 'waiting');

    if (expiredGiversError) throw new Error(`Expired Givers Error: ${expiredGiversError.message}`);

    for (const giver of expiredGivers || []) {
      await supabase.from('merge_givers').update({ status: 'eligible' }).eq('id', giver.id);
      await supabase.from('notifications').insert({
        user_id: giver.user_id,
        message: 'You are now eligible to withdraw.',
        is_read: false,
      });
    }

    // === 2. Handle Queued Receivers ===
    const { data: queuedReceivers, error: receiverError } = await supabase
      .from('merge_receivers')
      .select('*')
      .eq('status', 'queued')
      .lte('queued_at', oneDayAgo);

    if (receiverError) throw new Error(`Queued Receivers Error: ${receiverError.message}`);

    for (const receiver of queuedReceivers || []) {
      await supabase.from('merge_receivers').update({ status: 'ready' }).eq('id', receiver.id);
      await supabase.from('notifications').insert({
        user_id: receiver.user_id,
        message: 'You have been assigned a giver.',
        is_read: false,
      });
    }

    // === 3. Handle Queued Givers ===
    const { data: queuedGivers, error: queuedGiversError } = await supabase
      .from('merge_givers')
      .select('*')
      .eq('status', 'queued')
      .lte('queued_at', oneDayAgo);

    if (queuedGiversError) throw new Error(`Queued Givers Error: ${queuedGiversError.message}`);

    for (const giver of queuedGivers || []) {
      await supabase.from('merge_givers').update({ status: 'ready' }).eq('id', giver.id);
      await supabase.from('notifications').insert({
        user_id: giver.user_id,
        message: 'You have been assigned a receiver.',
        is_read: false,
      });
    }

    // === 4. Start Matching Logic ===
    const { data: receivers, error: receiversError } = await supabase
      .from('merge_receivers')
      .select('*')
      .eq('status', 'ready')
      .gt('amount_remaining', 0)
      .order('created_at');

    if (receiversError) throw new Error(`Receivers Fetch Error: ${receiversError.message}`);

    const { data: givers, error: giversError } = await supabase
      .from('merge_givers')
      .select('*')
      .eq('status', 'ready')
      .gt('amount_remaining', 0)
      .order('created_at');

    if (giversError) throw new Error(`Givers Fetch Error: ${giversError.message}`);

    for (const receiver of receivers) {
      let receiverNeed = receiver.amount_remaining;

      for (const giver of givers) {
        if (receiverNeed <= 0) break;
        if (giver.amount_remaining <= 0) continue;

        const matchAmount = Math.min(receiverNeed, giver.amount_remaining);

        // Avoid 0 match inserts
        if (matchAmount <= 0) continue;

        await supabase.from("merge_matches").insert({
          giver_id: giver.id,
          receiver_id: receiver.id,
          matched_amount: matchAmount,
        });

        const newGiverAmt = Math.max(giver.amount_remaining - matchAmount, 0);
        const newReceiverAmt = Math.max(receiverNeed - matchAmount, 0);

        await supabase
          .from("merge_givers")
          .update({
            amount_remaining: newGiverAmt,
            status: newGiverAmt === 0 ? "matched" : "pending",
          })
          .eq("id", giver.id);

        await supabase
          .from("merge_receivers")
          .update({
            amount_remaining: newReceiverAmt,
            status: newReceiverAmt === 0 ? "matched" : "pending",
          })
          .eq("id", receiver.id);

        await supabase.from("notifications").insert([
          {
            user_id: giver.user_id,
            message: `You have been matched to a receiver for ₦${matchAmount}.`,
            is_read: false,
          },
          {
            user_id: receiver.user_id,
            message: `You have been matched to a giver for ₦${matchAmount}.`,
            is_read: false,
          },
        ]);

        // Update loop variables
        receiverNeed = newReceiverAmt;
        giver.amount_remaining = newGiverAmt;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Cron job failed:', error.message);
    return new Response(JSON.stringify({
      success: false,
      message: 'Cron job failed',
      error: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
