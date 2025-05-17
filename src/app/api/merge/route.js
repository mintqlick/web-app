// /api/merge.js
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const { data: givers, error: giversError } = await supabase
    .from("merge_givers")
    .select("*")
    .gt("amount_remaining", 0)
    .order("created_at", { ascending: true });

  if (giversError) {
    return NextResponse.json({ success: false, message: giversError.message }, { status: 500 });
  }

  const { data: receivers, error: receiversError } = await supabase
    .from("merge_receivers")
    .select("*")
    .gt("amount_remaining", 0)
    .order("created_at", { ascending: true });

  if (receiversError) {
    return NextResponse.json({ success: false, message: receiversError.message }, { status: 500 });
  }

  for (const receiver of receivers) {
    let receiverNeed = receiver.amount_remaining;

    for (const giver of givers) {
      if (giver.amount_remaining <= 0) continue;
      if (receiverNeed <= 0) break;

      const matchAmount = Math.min(receiverNeed, giver.amount_remaining);


      const { data: mergeData, error: mergeError } = await supabase
        .from("merge_matches")
        .insert({
          giver_id: giver.id,
          receiver_id: receiver.id,
          matched_amount: matchAmount,
          matched_at:new Date(Date.now())
        });
        if(mergeError){
          console.log("Error merging", mergeError)
          break;
        }
      

      const newGiverAmount = giver.amount_remaining - matchAmount;
      const newReceiverAmount = receiver.amount_remaining - matchAmount;

      await supabase
        .from("merge_givers")
        .update({
          amount_remaining: newGiverAmount,
          status: newGiverAmount === 0 ? "matched" : "pending",
        })
        .eq("id", giver.id);

      await supabase
        .from("merge_receivers")
        .update({
          amount_remaining: newReceiverAmount,
          status: newReceiverAmount === 0 ? "matched" : "pending",
        })
        .eq("id", receiver.id);

      // Send notifications to giver and receiver about the match
      await supabase.from("notifications").insert([
        {
          user_id: giver.user_id,
          message: `You have been matched to a receiver for ₦${matchAmount}.`,
          is_read: false,
          created_at: new Date().toISOString(),
        },
        {
          user_id: receiver.user_id,
          message: `You have been matched to a giver for ₦${matchAmount}.`,
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      receiverNeed -= matchAmount;
      giver.amount_remaining = newGiverAmount; // update for loop condition
    }
  }

  return NextResponse.json({ success: true });
}
