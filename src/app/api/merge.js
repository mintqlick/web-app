// /api/merge.js
import supabase from '@/utils/supabase/admin';

export default async function handler(req, res) {
  const { data: givers } = await supabase
    .from('merge_givers')
    .select('*')
    .eq('confirmed', true)
    .gt('amount_remaining', 0)
    .order('created_at');

  const { data: receivers } = await supabase
    .from('merge_receivers')
    .select('*')
    .gt('amount_remaining', 0)
    .order('created_at');

  for (const receiver of receivers) {
    let receiverNeed = receiver.amount_remaining;

    for (const giver of givers) {
      if (receiverNeed <= 0) break;
      if (giver.amount_remaining <= 0) continue;

      const matchAmount = Math.min(receiverNeed, giver.amount_remaining);

      await supabase.from('merge_matches').insert({
        giver_id: giver.id,
        receiver_id: receiver.id,
        matched_amount: matchAmount,
      });

      await supabase.from('merge_givers')
        .update({ amount_remaining: giver.amount_remaining - matchAmount })
        .eq('id', giver.id);

      await supabase.from('merge_receivers')
        .update({ amount_remaining: receiver.amount_remaining - matchAmount })
        .eq('id', receiver.id);

      receiverNeed -= matchAmount;
      giver.amount_remaining -= matchAmount;
    }
  }

  res.status(200).json({ success: true });
}
