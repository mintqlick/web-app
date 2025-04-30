// /api/confirm-receiver.js
import { createClient } from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();
  const { receiver_id } = req.body;

  // Step 1: Mark receiver as completed
  const { data: receiver, error: receiverError } = await supabase
    .from('merge_receivers')
    .update({ status: 'completed' })
    .eq('id', receiver_id)
    .select()
    .single();

  if (receiverError || !receiver) return res.status(400).json(receiverError);

  // Step 2: Reduce giver's amount_remaining in merge_givers
  const { data: giver, error: giverError } = await supabase
    .from('merge_givers')
    .select('id, amount_remaining')
    .eq('id', receiver.source_giver_id)
    .single();

  if (giverError || !giver) return res.status(400).json(giverError);

  const newAmountRemaining = parseFloat(giver.amount_remaining) - parseFloat(receiver.amount);

  const { error: updateGiverError } = await supabase
    .from('merge_givers')
    .update({
      amount_remaining: newAmountRemaining,
      status: newAmountRemaining <= 0 ? 'completed' : 'in_progress'
    })
    .eq('id', giver.id);

  if (updateGiverError) return res.status(400).json(updateGiverError);

  return res.status(200).json({ success: true });
}
