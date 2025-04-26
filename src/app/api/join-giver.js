import{createClient} from '@/utils/supabase/client';

export default async function handler(req, res) {
  const supabase = createClient();
  const { user_id, amount } = req.body;

  const { data, error } = await supabase.from('merge_givers').insert({
    user_id,
    original_amount: amount,
    amount_remaining: amount
  });

  res.status(error ? 400 : 200).json(error || data);
}
