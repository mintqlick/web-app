// /api/merge.js
import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: givers } = await supabase
    .from("merge_givers")
    .select("*")
    // .eq("confirmed", true)
    .gt("amount_remaining", 0)
    .order("created_at");

  const { data: receivers } = await supabase
    .from("merge_receivers")
    .select("*")
    .gt("amount_remaining", 0)
    .order("created_at");

  for (const receiver of receivers) {
    let receiverNeed = receiver.amount_remaining;

    for (const giver of givers) {
      if (receiverNeed <= 0) break;
      if (giver.amount_remaining <= 0) continue;

      const matchAmount = Math.min(receiverNeed, giver.amount_remaining);

      await supabase.from("merge_matches").insert({
        giver_id: giver.id,
        receiver_id: receiver.id,
        matched_amount: matchAmount,
      });

      await supabase
        .from("merge_givers")
        .update({
          amount_remaining: giver.amount_remaining - matchAmount,
          status: "pending",
        })
        .eq("id", giver.id);

      await supabase
        .from("merge_receivers")
        .update({
          amount_remaining: receiver.amount_remaining - matchAmount,
          status: "pending",
        })
        .eq("id", receiver.id);

      receiverNeed -= matchAmount;
      giver.amount_remaining -= matchAmount;
    }
  }

  return NextResponse.json({ success: true });
}
