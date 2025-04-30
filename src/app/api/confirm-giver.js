// /api/confirm-giver.js
import{createClient} from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();
  const { giver_id } = req.body;
  const { data: giver, error } = await supabase
    .from('merge_givers')
    .update({ confirmed: true })
    .eq('id', giver_id)
    .select()
    .single();

  if (error || !giver) return res.status(400).json(error);

  const roi = giver.original_amount * 1.45;

  const { error: insertErr } = await supabase.from('merge_receivers').insert({
    user_id: giver.user_id,
    amount: roi,
    amount_remaining: roi,
    source_giver_id: giver.id
  });

  res.status(insertErr ? 400 : 200).json(insertErr || { success: true });
}