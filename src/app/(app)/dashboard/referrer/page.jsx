"use client";
import Spinner from "@/components/auth/spinner";
import Box from "@/components/Box/Box";
import { createClient } from "@/utils/supabase/client";
import { Copy } from "lucide-react";
import React, { useEffect, useState } from "react";

const ReferrerPage = () => {
  const NEXT_PUBLIC_APP_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://mintqlick.vercel.app";

  const [refCode, setRefCode] = useState("");
  const [totalReferrals, setTotalReferrals] = useState(null);

  useEffect(() => {
    const execute = async () => {
      const supabase = createClient();

      // Get active user
      const { data: activeUserData, error: userError } =
        await supabase.auth.getUser();
      const activeUserId = activeUserData?.user?.id;

      if (!activeUserId) {
        console.error("No active user found");
        return;
      }

      // Get the user's referral code
      const { data: referralData, error: referralError } = await supabase
        .from("referrals")
        .select("referral_code")
        .eq("user_id", activeUserId)
        .single();

      if (referralError) {
        console.error("Error fetching referral code:", referralError.message);
        return;
      }

      setRefCode(referralData?.referral_code || "");

      // Get total number of referrals (people they referred)
      const { count, error: countError } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true }) // Only get the count, no data
        .eq("referred_by", activeUserId);

      console.log(count);

      if (countError) {
        console.error("Error fetching total referrals:", countError.message);
        return;
      }

      setTotalReferrals(count || 0);
    };

    execute();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-0 animate-fadeIn">
      <div className="w-full  space-y-5">
        {/* Header Box */}
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[55px] font-bold mb-4 transition-all duration-300">
              Referral Appreciation Program
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-[25px] text-gray-500">
              Refer a friend and receive up to 5% of their contribution.
            </p>
          </div>
        </Box>

        {/* Referral Code Box */}
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <p className="text-xl text-gray-900">Referral code:</p>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${refCode}`);
                  alert("Referral code copied!");
                }}
                className="flex items-center gap-2 bg-[#1860d9] px-4 py-2 rounded-2xl text-white hover:bg-[#154db1] transition-all duration-200"
              >
                <Copy size={18} />
                <span>{refCode ? refCode : <Spinner size={20} />}</span>
              </button>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                placeholder="https://example.com/referral-link"
                value={`${NEXT_PUBLIC_APP_URL}/sign-up?ref=${refCode}`}
                disabled
                className="bg-white w-full border border-gray-300 text-gray-500 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9] transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${NEXT_PUBLIC_APP_URL}/sign-up?ref=${refCode}`
                  );
                  alert("Link copied!");
                }}
                className="absolute top-1/2 -translate-y-1/2 right-4 text-[#1860d9] flex items-center gap-1 hover:text-[#0f3d92] transition-colors duration-200"
              >
                <Copy size={18} />
                <span className="text-sm">Copy Link</span>
              </button>
            </div>
          </div>
        </Box>

        {/* Referrals Count Box */}
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          <div className="flex items-center justify-center">
            {totalReferrals == null ? (
              <Spinner size={30} />
            ) : (
              <>
                <h2 className="text-3xl sm:text-4xl md:text-[40px] lg:text-[55px] font-bold transition-all duration-300">
                  {totalReferrals}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-[25px] text-gray-800 pl-4">
                  {totalReferrals > 1 ? "Referrals" : "Referral"}
                </p>
              </>
            )}
          </div>
        </Box>

        {/* Referral Points Box */}
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-4">
              <p className="text-xl text-gray-900">Referral Point:</p>
              <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl text-black border border-gray-300 hover:bg-gray-100 transition">
                {totalReferrals === null ? (
                  <Spinner size={30} />
                ) : (
                  <span>${totalReferrals * 5} USDT</span>
                )}
              </button>
            </div>

            <div className="flex justify-center">
              <button className="rounded-2xl w-[200px] text-white py-2 bg-[#1860d9] flex items-center justify-center hover:bg-[#154db1] transition-all duration-200">
                Withdraw
              </button>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default ReferrerPage;
