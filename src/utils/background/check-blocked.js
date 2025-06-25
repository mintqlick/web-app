import { useEffect, useState } from "react";
import { createClient } from "../supabase/client";
import { useDispatch } from "react-redux";
import { setDisabled } from "@/store/slices/status";

const CheckedStatus = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetcher = async () => {
      const supabase = createClient();

      // Step 1: Get the authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("User auth error:", authError);
        return;
      }

      const userId = user.id;

      // Step 2: Check if already marked disabled in `users` table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("disabled")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("User fetch error:", userError);
        return;
      }

      if (userData?.disabled === true) {
        dispatch(setDisabled(true));
        return;
      }

      // Step 3: Count how many completed receives
      const { count, error: countError } = await supabase
        .from("merge_receivers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed");

      if (countError) {
        console.error("Count error:", countError);
        return;
      }

      const group = Math.floor(count / 4);
      if (group === 0) return; // not due yet

      // Step 4: Check if this milestone has been paid
      const { data: milestone, error: milestoneError } = await supabase
        .from("payment_milestones")
        .select("paid")
        .eq("user_id", userId)
        .eq("group_count", group)
        .maybeSingle(); // safe if it doesn't exist
      console.log("Demola", milestone, userId, group);

      if (milestoneError) {
        console.error("Milestone error:", milestoneError);
        return;
      }

      if (!milestone || !milestone.paid) {
        // No milestone payment found for this group — disable
        dispatch(setDisabled(true));

        // Optional: Also mark the user as disabled in Supabase
        const { data: updateData, error: updateErr } = await supabase
          .from("users")
          .update({ disabled: true })
          .eq("id", userId);
        return;
      }
      setDisabled(false);
    };

    fetcher();
  }, [dispatch]);

  return null; // silent background check
};

export default CheckedStatus;
