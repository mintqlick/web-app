import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  try {
    // Fetch active givers
    const { data: givers, error: giversError } = await supabase
      .from("merge_givers")
      .select("*")
      .gt("amount_remaining", 0)
      .order("created_at", { ascending: true });

    if (giversError) throw new Error("Failed to fetch givers: " + giversError.message);

    // Fetch active receivers
    const { data: receivers, error: receiversError } = await supabase
      .from("merge_receivers")
      .select("*")
      .gt("amount_remaining", 0)
      .order("created_at", { ascending: true });

    if (receiversError) throw new Error("Failed to fetch receivers: " + receiversError.message);

    for (const receiver of receivers) {
      let receiverNeed = receiver.amount_remaining;

      for (const giver of givers) {
        if (receiverNeed <= 0) break;
        if (giver.amount_remaining <= 0) continue;

        const matchAmount = Math.min(receiverNeed, giver.amount_remaining);

        // Double check again to prevent negative values (safety net)
        if (matchAmount <= 0) continue;

        // Insert match record
        const { error: matchError } = await supabase.from("merge_matches").insert({
          giver_id: giver.id,
          receiver_id: receiver.id,
          matched_amount: matchAmount,
        });

        if (matchError) throw new Error("Failed to insert match: " + matchError.message);

        const newGiverAmount = giver.amount_remaining - matchAmount;
        const newReceiverAmount = receiverNeed - matchAmount;

        // Update giver
        const { error: giverUpdateError } = await supabase
          .from("merge_givers")
          .update({
            amount_remaining: newGiverAmount,
            status: newGiverAmount === 0 ? "matched" : "pending",
          })
          .eq("id", giver.id);

        if (giverUpdateError) throw new Error("Failed to update giver: " + giverUpdateError.message);

        // Update receiver
        const { error: receiverUpdateError } = await supabase
          .from("merge_receivers")
          .update({
            amount_remaining: newReceiverAmount,
            status: newReceiverAmount === 0 ? "matched" : "pending",
          })
          .eq("id", receiver.id);

        if (receiverUpdateError) throw new Error("Failed to update receiver: " + receiverUpdateError.message);

        // Notify both users
        const { error: notifyError } = await supabase.from("notifications").insert([
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

        if (notifyError) throw new Error("Failed to send notifications: " + notifyError.message);

        // Reduce in-memory values to avoid re-fetch
        receiverNeed -= matchAmount;
        giver.amount_remaining = newGiverAmount;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
