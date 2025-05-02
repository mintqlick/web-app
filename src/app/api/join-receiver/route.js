// /api/join-receiver.js
import { createClient } from "@/utils/supabase/server";

import { NextResponse } from "next/server";

export async function POST(req) {
  const supabase = await createClient();
  const { user_id, amount,amount_remaining } = await req.json();
  const { data, error } = await supabase.from("merge_receivers").insert({
    user_id,
    amount,
    amount_remaining: amount,
  }).select("*");

  console.log(error,"error");

  return NextResponse.json(error || data);
}
