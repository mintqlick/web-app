import { createClient } from '@/utils/supabase/client';

export async function GET(request) {
  const supabase = createClient();

  // Handle expired givers (7-day maturity)
  const { data: expiredGivers } = await supabase
    .from('merge_givers')
    .select('*')
    .lte('expires_at', new Date())
    .eq('status', 'waiting');

  for (const giver of expiredGivers) {
    await supabase.from('merge_givers')
      .update({ status: 'eligible' })
      .eq('id', giver.id);

    // Add notification
    await supabase.from('notifications').insert({
      user_id: giver.user_id, // assuming there's a user_id column
      message: 'Your are now eligible to withdraw.',
      is_read: false,
    });
  }

  // Handle receivers in the 24-hour queue
  const { data: queuedReceivers } = await supabase
    .from('merge_receivers')
    .select('*')
    .eq('status', 'queued')
    .lte('queued_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000));

  for (const receiver of queuedReceivers) {
    await supabase.from('merge_receivers')
      .update({ status: 'ready' })
      .eq('id', receiver.id);

    await supabase.from('notifications').insert({
      user_id: receiver.user_id,
      message: 'You have been assigned a giver.',
      is_read: false,
    });
  }

  // Handle givers in the 24-hour queue
  const { data: queuedGivers } = await supabase
    .from('merge_givers')
    .select('*')
    .eq('status', 'queued')
    .lte('queued_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000));

  for (const giver of queuedGivers) {
    await supabase.from('merge_givers')
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
}
