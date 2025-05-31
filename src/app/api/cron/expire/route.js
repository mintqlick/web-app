// import { createClient } from "@/utils/supabase/client";

export async function GET(request) {
  //   const supabase = createClient();

  try {
    //     const now = new Date().toISOString();
    //     const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    //     // === 1. Handle Expired Givers ===
    //     const { data: expiredGivers, error: expiredGiversError } = await supabase
    //       .from("merge_givers")
    //       .select("*")
    //       .lte("eligible_as_receiver", now)
    //       .eq("status", "completed");

    //     if (expiredGiversError)
    //       throw new Error(`Expired Givers Error: ${expiredGiversError.message}`);

    //     // for (const giver of expiredGivers || []) {
    //     //   await supabase
    //     //     .from("merge_givers")
    //     //     .update({ status: "completed" })
    //     //     .eq("id", giver.id);
    //     //   await supabase.from("notifications").insert({
    //     //     user_id: giver.user_id,
    //     //     message: "You are now eligible to withdraw.",
    //     //     is_read: false,
    //     //   });
    //     // }

    //     // === 2. Handle Queued Receivers ===
    //     const { data: queuedReceivers, error: receiverError } = await supabase
    //       .from("merge_receivers")
    //       .select("*")
    //       .eq("status", "queued")
    //       .lte("queued_at", oneDayAgo);

    //     if (receiverError)
    //       throw new Error(`Queued Receivers Error: ${receiverError.message}`);

    //     for (const receiver of queuedReceivers || []) {
    //       await supabase
    //         .from("merge_receivers")
    //         .update({ status: "ready" })
    //         .eq("id", receiver.id);
    //       await supabase.from("notifications").insert({
    //         user_id: receiver.user_id,
    //         message: "You have been assigned a giver.",
    //         is_read: false,
    //       });
    //     }

    //     // === 3. Handle Queued Givers ===
    //     const { data: queuedGivers, error: queuedGiversError } = await supabase
    //       .from("merge_givers")
    //       .select("*")
    //       .eq("status", "waiting")
    //       .eq("confirmed", false)
    //       .lte("expired_at", oneDayAgo);

    //     if (queuedGiversError)
    //       throw new Error(`Queued Givers Error: ${queuedGiversError.message}`);

    //     for (const giver of queuedGivers || []) {
    //       await supabase
    //         .from("merge_givers")
    //         .update({
    //           status: "waiting",
    //           expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    //         })
    //         .eq("id", giver.id);
    //       await supabase.from("notifications").insert({
    //         user_id: giver.user_id,
    //         message: "You have been re-commited a receiver.",
    //         is_read: false,
    //       });
    //     }

    //     // check for user that did not make payment after 24hrs and block
    //     const { data: users, error: userFetchError } = await supabase
    //       .from("users")
    //       .select("*")
    //       .eq("blocked", false);

    //     if (userFetchError) {
    //       return res
    //         .status(500)
    //         .json({ error: "Error fetching users", details: userFetchError });
    //     }

    //     for (const user of users || []) {
    //       if (new Date(user.created_at) < oneDayAgo) {
    //         const { data: mergeData, error: mergeErr } = await supabase
    //           .from("merge_givers")
    //           .select("*")
    //           .eq("user_id", user.id);

    //         if (mergeErr) {
    //           console.error(
    //             `Error checking merge_givers for user ${user.id}:`,
    //             mergeErr
    //           );
    //           continue;
    //         }

    //         if (!mergeData || mergeData.length === 0) {
    //           const { error: updateErr } = await supabase
    //             .from("users")
    //             .update({ blocked: true })
    //             .eq("id", user.id);

    //           if (updateErr) {
    //             console.error(`Error blocking user ${user.id}:`, updateErr);
    //           }
    //         }
    //       }

    //       console.log({ message: "User blocking logic executed successfully" });
    //     }

    //     // check for expired merged giver
    //     const { data: mergedGivers, error: mergeGiverErr } = await supabase
    //       .from("merge_givers")
    //       .select("*")
    //       .eq("confirmed", true)
    //       .eq("status", "waiting")
    //       .lte("expires_at", oneDayAgo);

    //     for (const merge_giver of mergedGivers || []) {
    //       // check who they are matched to
    //       if (merge_giver.final) {
    //         const { data: matchesData, error: MatchError } = await supabase
    //           .from("merge_matches")
    //           .select("*")
    //           .eq("giver_id", merge_giver.id)
    //           .eq("status", "pending");

    //         matchesData.forEach(async (el) => {
    //           const { data: receiver, error: receiverErr } = await supabase
    //             .from("merge_receivers")
    //             .select("*")
    //             .eq("id", el.receiver_id)
    //             .single();
    //           const { data: matchesReceiverData, error: ReceiverMatchError } =
    //             await supabase
    //               .from("merge_receivers")
    //               .update({
    //                 amount_remaining: receiver.amount_remaining + el.matched,
    //                 status:"pending",
    //                 merged:false
    //               })
    //               .eq("id", el.receiver_id)
    //               .single();
    //         });
    //       }
    //     }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Cron job failed:", error.message);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Cron job failed",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
