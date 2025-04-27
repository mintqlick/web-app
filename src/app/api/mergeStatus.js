import { createClient } from "@/utils/supabase/client";

export default async function handler(req, res) {
  const { userId } = req.query; // Get userId from the query parameters
  const supabase = createClient();

  // Fetch the givers and receivers for the user
  const { data: givers } = await supabase
    .from("merge_givers")
    .select("*")
    .eq("id", userId);

  const { data: receivers } = await supabase
    .from("merge_receivers")
    .select("*")
    .eq("id", userId);

  if (givers.length === 0 && receivers.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // Logic to determine if the user has been merged
  const user = givers.length > 0 ? givers[0] : receivers[0];

  if (user && user.merged) {
    return res.status(200).json({ isMerged: true });
  } else if (user && user.amount_remaining > 0) {
    return res.status(200).json({ isMerged: false, isWaiting: true });
  } else {
    return res.status(200).json({ isMerged: false, isWaiting: false });
  }
}
