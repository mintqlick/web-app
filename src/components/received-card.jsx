"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdOutlineCreditScore } from "react-icons/md";

export default function CommitmentSuccessfull({
  newCommitment,
  giver_id,
  clicked,
  receiver_data,
  fetchSenderDetail,
  matchedItem,
  status,
}) {
  const [countdown, setCountdown] = React.useState(24 * 60 * 60 * 1000);
  const [eligibleTime, setEligibleTime] = React.useState("0d 0h 0m 0s");
  const now = new Date();
  const [canWithdraw, setCanWithdraw] = useState(false);
  console.log(status);

  useEffect(() => {
    const eligibleAsReceiverDate = matchedItem?.expires_in
      ? new Date(matchedItem?.expires_in)
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4"
    >
      <div className="bg-white p-3 md:p-4 rounded-2xl text-sm mb-4 flex flex-col md:flex-row items-start gap-4">
        {/* Icon Section */}
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-white rounded-2xl border-2 border-gray-400">
          <MdOutlineCreditScore className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-start">
          <>
            <h4 className="text-sm md:text-base font-bold mb-2 text-gray-800">
              {giver_id
                ? `You've been sent USD`
                : `${newCommitment.amount}USDT will be sent to you soon stay tuned`}
            </h4>
            {newCommitment.amount && giver_id ? (
              <p className="text-base md:text-lg font-bold text-gray-700 mb-2">
                <span className="text-blue-600">
                  {newCommitment.amount} USDT
                </span>
                <span className="text-blue-800"> by #{giver_id}</span>
              </p>
            ) : (
              ""
            )}
          </>
          <>
            <p className="text-base md:text-lg font-bold text-gray-700 mb-2">
              {newCommitment.orderId ? (
                <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
                  Order ID: #{newCommitment.orderId}
                </p>
              ) : (
                ""
              )}
            </p>
          </>
        </div>
      </div>
      {/* {console.log(receiver_data?.original_amount)} */}
      {/* Buttons statement */}

      {giver_id && (
        <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
          Time left to confirm payment:
          {eligibleTime}
        </p>
      )}

      {giver_id && (
        <>
          <button
            onClick={fetchSenderDetail}
            // disabled={loading}
            className="mt-4 w-full bg-blue-500 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2 rounded-md cursor-pointer"
          >
            View Sender Detail
          </button>

          <button
            // disabled={!receiver_data?.original_amount}
            type="button"
            className="mt-4 w-full bg-green-500 disabled:bg-green-300 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2 rounded-md cursor-pointer disabled:cursor-not-allowed"
            onClick={clicked}
            disabled={status === "waiting"}
          >
            Confirm
          </button>
        </>
      )}
    </motion.div>
  );
}

function formatCountdown(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}
