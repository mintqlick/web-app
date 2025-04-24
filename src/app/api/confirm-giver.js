// /api/confirm-giver.js
import supabase from '@/utils/supabase/admin';

export default async function handler(req, res) {
  const { giver_id } = req.body;
  const { data: giver, error } = await supabase
    .from('merge_givers')
    .update({ confirmed: true })
    .eq('id', giver_id)
    .select()
    .single();

  if (error || !giver) return res.status(400).json(error);

  const roi = giver.original_amount * 1.4;

  const { error: insertErr } = await supabase.from('merge_receivers').insert({
    user_id: giver.user_id,
    amount: roi,
    amount_remaining: roi,
    source_giver_id: giver.id
  });

  res.status(insertErr ? 400 : 200).json(insertErr || { success: true });
}