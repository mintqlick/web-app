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
