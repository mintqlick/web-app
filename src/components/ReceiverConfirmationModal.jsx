import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { set } from "zod";

export default function ReceiverConfirmationModal({
  show,
  onClose,
  screenshotUrl,
  giver_id,
  loading,
  onConfirm,
}) {
  if (!show) return null;
  {
    screenshotUrl;
  }

  const [userId, setUserId] = useState(giver_id.user_id);
  useEffect(() => {
    // fetch user based on giver_id.giver_id  if giver_id.user_id is not null from supabase merge_givers table
    const fetchGiverData = async () => {
      const supabase = createClient();

      const {
        data: { user_id },
      } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("id", giver_id.giver_id)
        .single();

      setUserId(user_id);
    };
    if (!userId) {
      fetchGiverData();
    }
  },[]);
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Receipt</h2>
        <p className="mb-2 flex gap-4">User ID: {userId}</p>
        {screenshotUrl && (
          <img
            src={screenshotUrl}
            alt="Proof of Payment"
            className="mb-4 rounded max-h-64 object-contain"
          />
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Confirm Received
          </button>
        </div>
      </div>
    </div>
  );
}
