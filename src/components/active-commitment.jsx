"use client";

import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { set } from "zod";

export default function ActiveCommitment({
  onWithdraw,
  loading,
  // countdown,
  amount,
  cmtData,
  recommitProcess,
  
}) {
  const [countdown, setCountdown] = React.useState(500 * 1000);
  const [eligibleTime, setEligibleTime] = React.useState("0d 0h 0m 0s");
  const now = new Date();
  const [canWithdraw, setCanWithdraw] = useState(false);

  useEffect(() => {
    const eligibleAsReceiverDate = cmtData?.eligible_as_receiver
      ? new Date(cmtData.eligible_as_receiver)
      : new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Default to 7 days ahead

    const diffMs =
      eligibleAsReceiverDate - now <= 0 ? 0 : eligibleAsReceiverDate - now;

    if (diffMs === 0) {
      setCanWithdraw(true);
    }


    setCountdown(Math.floor(diffMs / 1000)); // Convert milliseconds to seconds

    setEligibleTime(formatCountdown(Math.floor(diffMs / 1000))); // Convert milliseconds to seconds for countdown display
  }, [countdown]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const withdraw = () => {
    if (canWithdraw) {
      onWithdraw();
    } else {
      toast.warning("wait till your time is up");
    }
  };

  return (
    <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4">
      <h4 className="text-base text-blue-600 font-semibold mb-1">
        Active Contribution
      </h4>
      <div className="flex flex-col gap-2 text-sm mb-4">
        <p>
          <span className="font-semibold">Amount Contributed:</span> {amount}{" "}
          USDT
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

        
          <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
            Time left to receive payment:
            {eligibleTime}
          </p>
        

        {canWithdraw ? (
          <button
            onClick={withdraw}
            className="bg-green-600 text-white text-sm w-full px-4 py-2 rounded-md disabled:bg-green-300 disabled:cursor-not-allowed hover:bg-green-400 transition duration-200"
          >
            {!loading ? "Withdraw" : "Withdrawing"}
          </button>
        ) : (
          <button
            onClick={recommitProcess}
            className=" w-[9rem] text-[10px] lg:text-[15px] lg:w-[15rem] flex justify-center items-center rounded-4xl border-dashed border-2 py-2 lg:py-3 border-[#98AAC8] text-[#05132B] font-semibold cursor-pointer "
          >
            <PlusCircle className="w-[2rem] h-[1rem] lg:h-[1.2rem]" />{" "}
            Recontribute
          </button>
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
