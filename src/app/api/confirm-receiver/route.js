// /api/confirm-receiver.js
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createClient();
  const { receiver_id, giver_id } = await req.json();

  if (!receiver_id || !giver_id) {
    return NextResponse.json(
      { error: "Missing receiver_id or giver_id" },
      { status: 400 }
    );
  }
  // Step 1: Mark the match as completed
  const { data: match, error: matchErr } = await supabase
    .from("merge_matches")
    .update({ status: "completed" })
    .eq("giver_id", giver_id)
    .eq("receiver_id", receiver_id)
    .select()
    .single();

  if (matchErr) {
    console.error("Error fetching match data:", matchErr);
    return NextResponse.json(
      { error: "Failed to fetch match data" },
      { status: 500 }
    );
  }

  const { data: giver, error: giverErr } = await supabase
    .from("merge_givers")
    .select("*")
    .eq("id", giver_id)
    .select()
    .single();
  if (giverErr) {
    return NextResponse.json(
      { error: "Failed to fetch giver data" },
      { status: 500 }
    );
  }

  if (giver.amount_remaining === 0 && giver.matched) {
    //update the giver status to completed and eligible_time to current time
    const { error: updateGiverError } = await supabase
      .from("merge_givers")
      .update({
        status: "completed",
        eligible_time: new Date(Date.now()),
        eligible_as_receiver: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        received: false,
      })
      .eq("id", giver_id);

    if (updateGiverError) {
      console.error("Error updating giver status:", updateGiverError);
      return NextResponse.json(
        { error: "Failed to update giver status" },
        { status: 500 }
      );
    }
  }

  // fetch from merge_receiver table where id is receiver_id
  const { data: receiver, error: receiverErr } = await supabase
    .from("merge_receivers")
    .select("*")
    .eq("id", receiver_id)
    .single();
  if (receiverErr) {
    console.error("Error fetching receiver data:", receiverErr);
    return NextResponse.json(
      { error: "Failed to fetch receiver data" },
      { status: 500 }
    );
  }
  const { data: remaining_receiver, error: remaining_error } = await supabase
    .from("merge_matches")
    .select("*")
    .eq("receiver_id", receiver_id);

  if (remaining_error) {
    console.error("Error fetching receiver data:", remaining_error);
    return NextResponse.json(
      { error: "Failed to fetch receiver data" },
      { status: 500 }
    );
  }

  if (
    receiver.amount_remaining === 0 &&
    receiver.matched &&
    remaining_receiver.length === 0
  ) {
    // update the receiver status to completed and eligible_time to current time
    const { error: updateReceiverError } = await supabase
      .from("merge_receivers")
      .update({
        status: "completed",
      })
      .eq("id", receiver_id);
    if (updateReceiverError) {
      console.error("Error updating receiver status:", updateReceiverError);
      return NextResponse.json(
        { error: "Failed to update receiver status" },
        { status: 500 }
      );
    }
  }

  // 💰 Step 2: Check if the user was referred
  const { data: referralData, error: referralError } = await supabase
    .from("referrals")
    .select("referred_by")
    .eq("user_id", giver_id)
    .single();

  if (referralData?.referred_by) {
    // search for the referal and get the balance

    const {
      data: { balance },
      error: referralError,
    } = await supabase
      .from("referrals")
      .select("balance")
      .eq("user_id", referralData.referred_by)
      .single();

    if (referralError) {
      console.error("Error fetching referral balance:", referralError.message);
      return;
    }

    const referrerId = referralData.referred_by;
    const bonusAmount =
      (balance ?? 0) + parseFloat((receiver.amount * 0.05).toFixed(2)); // 5% bonus

    const { error: bonusError } = await supabase
      .from("referrals")
      .update({ balance: bonusAmount })
      .eq("user_id", referrerId);

    if (bonusError) {
      console.error("Error updating bonus balance:", bonusError.message);
      return;
    }

    if (bonusError) {
      console.error("Failed to reward referrer:", bonusError.message);
    } else {
      console.log(`Referrer rewarded with $${bonusAmount}`);
    }
  }

  return NextResponse.json({ success: true });
}
