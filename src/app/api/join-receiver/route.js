// /api/join-receiver.js
import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient();
  const { user_id, amount, id } = await req.json();
  console.log(amount);
  const { data, error } = await supabase
    .from("merge_receivers")
    .insert({
      user_id,
      amount,
      amount_remaining: amount,
    })
    .select("*");

  // check merge giver where the id is equal to the id passed in the request and update the received to true
  const { data: mergeGiverData, error: mergeGiverError } = await supabase
    .from("merge_givers")
    .update({ received: true })
    .eq("id", id)
    .select("*");
  if (mergeGiverError) {
    console.log("Error updating merge giver:", mergeGiverError);
    return NextResponse.json(
      { error: mergeGiverError.message },
      { status: 500 }
    );
  }

  console.log("here");
  console.log(error, "error");

  return NextResponse.json(error || data);
}
