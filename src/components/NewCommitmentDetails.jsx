"use client";

import React from "react";
import { motion } from "framer-motion";
import { MdOutlineCreditScore } from "react-icons/md";

export default function NewCommitmentDetails({
  newCommitment,
  isMerged,
  receiverId,
  userId,
  countdown,
  handleViewReceiverDetails,
  handleConfirmPayment,
  handleCancelCommitment,
  status,
  confirmed,
  matched=false
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4 ${
        confirmed&&matched ? "hidden" : "block"
      }`}
    >
      <div className="w-[8rem] text-[10px] lg:text-[14px] lg:w-[10rem] rounded-4xl bg-[#B12018] flex justify-center items-center py-3 mb-5 text-white font-semibold ">
        Status: Not Paid
      </div>
      <div className="bg-white p-3 md:p-4 rounded-2xl text-sm mb-4 flex flex-col md:flex-row items-start gap-4">
        {/* Icon Section */}
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-white rounded-2xl border-2 border-gray-400">
          <MdOutlineCreditScore className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-start">
          {isMerged ? (
            <>
              <h4 className="text-sm md:text-base font-bold mb-2 text-gray-800">
                You are assigned to pay
              </h4>
              <p className="text-base md:text-lg font-bold text-gray-700 mb-2">
                <span className="text-blue-600">
                  {newCommitment.amount} USDT
                </span>{" "}
                <span className="text-blue-800">
                  to Contribution ID: NC-{receiverId.split("-")[0]}
                </span>
              </p>
            </>
          ) : (
            <>
              <h4 className="text-sm md:text-base font-bold mb-2 text-gray-800">
                You requested to commit
              </h4>
              <p className="text-base md:text-lg font-bold text-gray-700 mb-2">
                <span className="text-blue-600">
                  {newCommitment.amount_remaining} USDT
                </span>{" "}
                <span className="text-black">to Contribution ID: {userId}</span>
                <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
                  Order ID: #{newCommitment.orderId}
                </p>
              </p>
              {status !== "pending" ? (
                <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
                  You're in a que. A match will be assigned shortly.
                </p>
              ) : (
                <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
                  you have been matched to a user
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {status !== "pending" && (
        <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
          Time left: {console.log(countdown, "countdown")}
          {!countdown
            ? formatCountdown(0)
            : typeof countdown === "string"
            ? countdown
            : formatCountdown(countdown)}
        </p>
      )}

      {/* Buttons */}
      {status === "pending" ? (
        <>
          <button
            className="w-full bg-white text-gray-800 font-semibold border border-gray-400 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 hover:bg-gray-100 transition text-sm md:text-base"
            onClick={handleViewReceiverDetails}
          >
            View Receiver Details
          </button>
          <button
            className="w-full bg-blue-600 text-white font-semibold px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </button>
        </>
      ) : (
        <button
          className="mt-4 w-full bg-red-600 text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 md:py-2 rounded-md cursor-pointer hover:bg-red-700"
          onClick={handleCancelCommitment}
        >
          Cancel
        </button>
      )}
    </motion.div>
  );
}

function formatCountdown(seconds) {
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}h ${minutes}m ${secs}s`;
}
