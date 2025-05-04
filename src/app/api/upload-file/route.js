import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("screenshot");
    const giver_id = formData.get("giver_id");

    if (!file || !giver_id || typeof giver_id !== "string") {
      return NextResponse.json({ error: "Missing screenshot or giver_id" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${giver_id}-${Date.now()}-${file.name}`;

    const supabase = createClient();

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("screenshots")
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload screenshot" }, { status: 500 });
    }

    const { data: publicURLData } = supabase.storage
      .from("screenshots")
      .getPublicUrl(filename);

    const image_url = publicURLData.publicUrl;

    const { error: dbUpdateError } = await supabase
      .from("merge_givers")
      .update({ image_url })
      .eq("user_id", giver_id);

    if (dbUpdateError) {
      console.error("DB update error:", dbUpdateError);
      return NextResponse.json({ error: "Failed to update giver image URL" }, { status: 500 });
    }

    return NextResponse.json({ success: true, image_url });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
