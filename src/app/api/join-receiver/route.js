// /api/join-receiver.js
import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient();
  const { user_id, amount } = await req.json();
  const { data, error } = await supabase
    .from("merge_receivers")
    .insert({
      user_id,
      amount,
      amount_remaining: amount,
    })
    .select("*");

  console.log("here");
  console.log(error, "error");

  return NextResponse.json(error || data);
}
