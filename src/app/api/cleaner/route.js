
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request) {
  const supabase = createClient();
  const now = new Date();
  const twentyFourHoursLater = new Date(
    now.getTime() + 24 * 60 * 60 * 1000
  ).toISOString();

  // 1. Delete unmatched contributions after 24hrs
  const { data: dltedRes, error: deleteError } = await supabase
    .from("merge_givers")
    .delete()
    .lt("expires_at", now.toISOString())
    .eq("status", "waiting")
    .eq("confirmed", false)
    .select("*");

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  // block user that did this
  for (const users of dltedRes) {
    await supabase
      .from("users")
      .update({ blocked: true })
      .eq("id", users.user_id);
  }

  // 2. Re-enter unmatched receivers to queue with new expiry time
  const { error: receiverQueError } = await supabase
    .from("merge_receivers")
    .update({ expires_at: twentyFourHoursLater })
    .eq("matched", false)
    .eq("confirmed", false)
    .lt("expires_at", now.toISOString())
    .eq("status", "waiting");

  if (receiverQueError) {
    return NextResponse.json(
      { error: receiverQueError.message },
      { status: 400 }
    );
  }

  // 3. Get expired, matched records that are not completed
  const { data: matches, error: matchError } = await supabase
    .from("merge_matches")
    .select("*")
    .lt("expires_in", now.toISOString())
    .neq("status", "completed");

  if (matchError) {
    console.log("match", matchError.message);
    return NextResponse.json({ error: matchError.message }, { status: 400 });
  }

  const withImageUrl = matches.filter((el) => el.image_url);
  const withoutImageUrl = matches.filter((el) => !el.image_url);

  // 4. Extend expiry for matches with image_url
  for (const match of withImageUrl) {
    const { error: updateErr } = await supabase
      .from("merge_matches")
      .update({ expires_in: twentyFourHoursLater })
      .eq("id", match.id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }
  }

  // 5. For matches without image_url, revert the match
  for (const match of withoutImageUrl) {
    const { receiver_id, giver_id, matched_amount } = match;

    // a. Fetch receiver
    const { data: receiverData, error: receiverErr } = await supabase
      .from("merge_receivers")
      .select("*")
      .eq("id", receiver_id)
      .single();

    if (receiverErr || !receiverData) {
      return NextResponse.json(
        { error: receiverErr?.message || "Receiver not found" },
        { status: 400 }
      );
    }

    // b. Update receiver
    const { error: receiverUpdateErr } = await supabase
      .from("merge_receivers")
      .update({
        amount_remaining: receiverData.amount_remaining + matched_amount,
        matched: false,
        confirmed: false,
        status: "waiting",
        expires_at: twentyFourHoursLater,
      })
      .eq("id", receiver_id);

    if (receiverUpdateErr) {
      return NextResponse.json(
        { error: receiverUpdateErr.message },
        { status: 400 }
      );
    }

    // c. Fetch giver
    const { data: giverData, error: giverErr } = await supabase
      .from("merge_givers")
      .select("*")
      .eq("id", giver_id)
      .single();

    if (giverErr || !giverData) {
      return NextResponse.json(
        { error: giverErr?.message || "Giver not found" },
        { status: 400 }
      );
    }

    // d. Update giver
    const { error: giverUpdateErr } = await supabase
      .from("merge_givers")
      .update({
        amount_remaining: giverData.amount_remaining + matched_amount,
        matched: false,
        confirmed: false,
        status: "waiting",
        expires_at: twentyFourHoursLater,
      })
      .eq("id", giver_id);

    if (giverUpdateErr) {
      return NextResponse.json(
        { error: giverUpdateErr.message },
        { status: 400 }
      );
    }

    // block the giver user
    const { error: giverUpdateBlockErr } = await supabase
      .from("users")
      .update({
        blocked: true,
      })
      .eq("user_id", giverData.user_id);

    if (giverUpdateBlockErr) {
      return NextResponse.json(
        { error: giverUpdateBlockErr.message },
        { status: 400 }
      );
    }

    // e. Delete match
    const { error: deleteMatchErr } = await supabase
      .from("merge_matches")
      .delete()
      .eq("id", match.id);

    if (deleteMatchErr) {
      return NextResponse.json(
        { error: deleteMatchErr.message },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ message: "Cleanup completed successfully." });
}
