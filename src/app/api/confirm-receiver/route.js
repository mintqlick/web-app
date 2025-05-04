// /api/confirm-receiver.js
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = createClient();
  const { receiver_id, giver_id } = await req.json();
  const { data: giver, error: giverError } = await supabase
    .from("merge_givers")
    .select("id, amount_remaining")
    .eq("user_id", giver_id)
    .single();
  if (giverError || !giver) return NextResponse.json(giverError);

  console.log(giver_id, receiver_id);

  // Step 1: Mark receiver as completed
  const { data: receiver, error: receiverError } = await supabase
    .from("merge_receivers")
    .update({ status: "completed", source_giver_id: giver.id })
    .eq("user_id", receiver_id)
    .select()
    .single();

  if (receiverError || !receiver) return NextResponse.json(receiverError);

  // Step 2: Reduce giver's amount_remaining in merge_givers

  const newAmountRemaining =
    parseFloat(giver.amount_remaining) - parseFloat(receiver.amount);

  const { error: updateGiverError } = await supabase
    .from("merge_givers")
    .update({
      amount_remaining: newAmountRemaining,
      eligible_as_receiver: new Date(Date.now()),
      status: newAmountRemaining <= 0 ? "completed" : "in_progress",
    })
    .eq("id", giver.id);

  if (updateGiverError) return NextResponse.json(updateGiverError);

  return NextResponse.json({ success: true });
}
