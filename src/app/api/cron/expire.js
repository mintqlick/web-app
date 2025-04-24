import supabase from '@/utils/supabase/admin';

export default async function handler(req, res) {
  const now = new Date().toISOString();

  await supabase
    .from('merge_givers')
    .update({ status: 'expired' })
    .lt('expires_at', now)
    .eq('status', 'waiting');

  await supabase
    .from('merge_receivers')
    .update({ status: 'expired' })
    .lt('expires_at', now)
    .eq('status', 'waiting');

  res.status(200).json({ message: 'Expired requests updated.' });
}
