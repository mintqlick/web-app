"use client";

import React from "react";
import Box from "./Box/Box"; // Make sure path is correct
import Spinner from "./auth/spinner"; // Adjust path if necessary

const Referral = ({ item: referral }) => {
  if (!referral || !referral.user) {
    return <p className="text-red-600 text-center">Invalid referral data</p>;
  }

  const {
    referral_code,
    balance,
    created_at,
    user: { user_id, name },
  } = referral;

  return (
    <Box
      variant="card"
      className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp w-full overflow-x-auto"
    >
      <div className="flex flex-col gap-6 text-center">
        {/* Section Heading */}
        <div className="flex items-center justify-center">
          <p className="text-sm md:text-xl text-gray-900">Referred Accounts:</p>
        </div>

        {/* Inline Info Section */}
        <div className="min-w-[600px] flex flex-row items-center justify-between gap-6 border-t border-gray-300 pt-4 text-sm text-gray-700 whitespace-nowrap">
          <p>
            <span className="font-semibold">User ID:</span> NC-{user_id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {name}
          </p>
          <p>
            <span className="font-semibold">Referral Code:</span> {referral_code}
          </p>
          <p className="text-xs text-gray-500">
            Created: {new Date(created_at).toLocaleString()}
          </p>
        </div>
      </div>
    </Box>
  );
};

export default Referral;
