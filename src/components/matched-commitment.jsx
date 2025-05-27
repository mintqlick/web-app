"use client";

import React from "react";
import { motion } from "framer-motion";
import { MdOutlineCreditScore } from "react-icons/md";

export default function MatchedCommitment({
  newCommitment,
  receiverId,
  handleViewReceiverDetails,
  handleConfirmPayment,
  confirmed,
  status
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4 ${
        confirmed ? "hidden" : "block"
      }`}
    >
      <div className="w-[8rem] text-[10px] lg:text-[14px] lg:w-[10rem] rounded-4xl bg-yellow-100 flex justify-center items-center py-3 mb-5 text-gray-600 font-semibold ">
        Status: {status.toUpperCase()}
      </div>
      <div className="bg-white p-3 md:p-4 rounded-2xl text-sm mb-4 flex flex-col md:flex-row items-start gap-4">
        {/* Icon Section */}
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-white rounded-2xl border-2 border-gray-400">
          <MdOutlineCreditScore className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-start">
          <h4 className="text-sm md:text-base font-bold mb-2 text-gray-800">
            You are assigned to pay
          </h4>
          <p className="text-base md:text-lg font-bold text-gray-700 mb-2">
            <span className="text-blue-600">{newCommitment.amount} USDT</span>{" "}
            <span className="text-blue-800">
              to Contribution ID: {receiverId}
            </span>
          </p>

          <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
            you have been matched to a user
          </p>
        </div>
      </div>

      {/* Buttons */}
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
    </motion.div>
  );
}
