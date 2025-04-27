import { createClient } from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();
  
  // Handle expired givers
  const { data: expiredGivers } = await supabase
    .from('merge_givers')
    .select('*')
    .lte('expires_at', new Date())  // Check if the giver's expiration time has passed
    .eq('status', 'waiting');  // Only consider those in the 'waiting' state

  for (const giver of expiredGivers) {
    // Mark the expired giver as 'pending' instead of deleting them
    await supabase.from('merge_givers')
      .update({ status: 'pending' })
      .eq('id', giver.id);
  }

  // Handle expired receivers
  const { data: expiredReceivers } = await supabase
    .from('merge_receivers')
    .select('*')
    .lte('expires_at', new Date())  // Check if the receiver's expiration time has passed
    .eq('status', 'waiting');  // Only consider those in the 'waiting' state

  for (const receiver of expiredReceivers) {
    // Mark the expired receiver as 'pending' instead of deleting them
    await supabase.from('merge_receivers')
      .update({ status: 'pending' })
      .eq('id', receiver.id);
  }

  res.status(200).json({ success: true });
}
