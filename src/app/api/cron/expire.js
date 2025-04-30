// import { createClient } from '@/utils/supabase/client';

// export default async function handler(req, res) {
//   const supabase = createClient();
  
//   // Handle expired givers
//   const { data: expiredGivers } = await supabase
//     .from('merge_givers')
//     .select('*')
//     .lte('expires_at', new Date())  // Check if the giver's expiration time has passed
//     .eq('status', 'waiting');  // Only consider those in the 'waiting' state

//   for (const giver of expiredGivers) {
//     // Mark the expired giver as 'pending' instead of deleting them
//     await supabase.from('merge_givers')
//       .update({ status: 'pending' })
//       .eq('id', giver.id);
//   }

//   // Handle expired receivers
//   const { data: expiredReceivers } = await supabase
//     .from('merge_receivers')
//     .select('*')
//     .lte('expires_at', new Date())  // Check if the receiver's expiration time has passed
//     .eq('status', 'waiting');  // Only consider those in the 'waiting' state

//   for (const receiver of expiredReceivers) {
//     // Mark the expired receiver as 'pending' instead of deleting them
//     await supabase.from('merge_receivers')
//       .update({ status: 'pending' })
//       .eq('id', receiver.id);
//   }

//   res.status(200).json({ success: true });
// }

import { createClient } from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();

  // Handle expired givers (7-day maturity)
  const { data: expiredGivers } = await supabase
    .from('merge_givers')
    .select('*')
    .lte('expires_at', new Date())  // Check if the giver's expiration time has passed
    .eq('status', 'waiting');  // Only consider those in the 'waiting' state

  for (const giver of expiredGivers) {
    // Update expired givers' status to 'eligible'
    await supabase.from('merge_givers')
      .update({ status: 'eligible' })
      .eq('id', giver.id);
  }

  // Handle receivers in the 24-hour queue
  const { data: queuedReceivers } = await supabase
    .from('merge_receivers')
    .select('*')
    .eq('status', 'queued') // Consider those in the 'queued' state
    .lte('queued_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000)); // Check for 24-hour wait

  for (const receiver of queuedReceivers) {
    // Update receivers' status to 'ready'
    await supabase.from('merge_receivers')
      .update({ status: 'ready' })
      .eq('id', receiver.id);
  }

  // Handle givers in the 24-hour queue (optional if applicable)
  const { data: queuedGivers } = await supabase
    .from('merge_givers')
    .select('*')
    .eq('status', 'queued') // Consider those in the 'queued' state
    .lte('queued_at', new Date(new Date().getTime() - 24 * 60 * 60 * 1000)); // Check for 24-hour wait

  for (const giver of queuedGivers) {
    // Update givers' status to 'ready'
    await supabase.from('merge_givers')
      .update({ status: 'ready' })
      .eq('id', giver.id);
  }

  res.status(200).json({ success: true });
}
