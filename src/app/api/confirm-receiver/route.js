// /api/confirm-receiver.js
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createClient();
  const { receiver_id, giver_id } = await req.json();

  // Step 1: Mark receiver as completed
  const { data: receiver, error: receiverError } = await supabase
    .from("merge_receivers")
    .update({ status: "completed" })
    .eq("user_id", receiver_id)
    .select()
    .single();

  if (receiverError || !receiver) return NextResponse.json(receiverError);

  // Step 2: Reduce giver's amount_remaining in merge_givers

 

  const { error: updateGiverError } = await supabase
    .from("merge_givers")
    .update({
      eligible_time: new Date(Date.now()),
    })
    .eq("id", giver_id  );

  if (updateGiverError) return NextResponse.json(updateGiverError);
  // 💰 Step 2: Check if the user was referred
  const { data: referralData, error: referralError } = await supabase
    .from("referrals")
    .select("referred_by")
    .eq("user_id", giver_id)
    .single();

  if (referralData?.referred_by) {
    const referrerId = referralData.referred_by;
    const bonusAmount = parseFloat((receiver.amount * 0.05).toFixed(2)); // 5% bonus

    // 💵 Step 3: Update referrer's balance
    const { error: bonusError } = await supabase.rpc("increment_balance", {
      user_id_param: referrerId,
      amount: bonusAmount,
    });

    if (bonusError) {
      console.error("Failed to reward referrer:", bonusError.message);
    } else {
      console.log(`Referrer rewarded with $${bonusAmount}`);
    }
  }

  return NextResponse.json({ success: true });
}
