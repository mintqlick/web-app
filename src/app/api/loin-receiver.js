// /api/join-receiver.js
import{createClient} from '@/utils/supabase/client';

export default async function handler(req, res) {
const supabase = createClient();
  const { user_id, amount } = req.body;
  const { data, error } = await supabase.from('merge_receivers').insert({
    user_id,
    amount,
    amount_remaining: amount
  });
  res.status(error ? 400 : 200).json(error || data);
}