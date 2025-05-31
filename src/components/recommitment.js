"use client";

import { PlusCircle } from "lucide-react";
import React from "react";

export default function Recommitment({
  onWithdraw,
  loading,
  countdown,
  amount,
  cmtData,
  recommitProcess,
}) {
  const now = new Date();
  const eligibleAsReceiverDate = cmtData?.eligible_as_receiver
    ? new Date(cmtData.eligible_as_receiver)
    : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days ahead

  const diffMs = eligibleAsReceiverDate - now;
  let timeLeft;
  if (diffMs > 0) {
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else {
    timeLeft = "0d 0h 0m 0s"; // already eligible
  }

  const isEligible =
    cmtData?.eligible_as_receiver &&
    new Date(cmtData.eligible_as_receiver) <= new Date();

  return (
    <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4">
      <h4 className="text-base text-blue-600 font-semibold mb-1">
       Recommitment made for: <span className="text-[#878E99]">{cmtData?.id.split("-")[0]}</span>
      </h4>
      <div className="flex flex-col gap-2 text-sm mb-4">
        <p>
          <span className="font-semibold">Amount contributed:</span> {amount} USDT
        </p>
        <p>
          <span className="font-semibold">Amount to be received:</span>{" "}
          {amount * 1.45} USDT
        </p>
        <p>
          <span className="font-semibold">Withdraw time/date: </span>
          {formatDate(cmtData?.eligible_as_receiver) || null}
        </p>
        <p>
          <span className="font-semibold">Cycle Start Date/Time: </span>
          {formatDate(cmtData?.eligible_time) || null}
        </p>

        {isEligible && (
          <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
            Time left to receive payment:
            {timeLeft}
          </p>
        )}

        
      </div>
    </div>
  );
}

function formatCountdown(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

const formatDate = (rawDate) => {
  let formatted = "N/A";

  if (rawDate) {
    const date = new Date(rawDate);
    formatted = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} at ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }
  return formatted; // "5/5/2025 at 00:56" or "N/A"
};
