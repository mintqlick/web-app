"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MdOutlineCreditScore } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default function MatchedCommitment({
  newCommitment,
  receiverId,
  handleViewReceiverDetails,
  handleConfirmPayment,
  confirmed,
  status,
}) {
  const [countdown, setCountdown] = React.useState(500 * 1000);
  const [eligibleTime, setEligibleTime] = React.useState("0h 0m 0s");
  const now = new Date();

  useEffect(() => {
    const eligibleAsReceiverDate = newCommitment?.expires_in
      ? new Date(newCommitment?.expires_in)
      : new Date(now.getTime() + 24 * 60 * 60 * 1000); // Default to 7 days ahead

    const diffMs = eligibleAsReceiverDate - now;

    setCountdown(Math.floor(diffMs / 1000)); // Convert milliseconds to seconds

    setEligibleTime(formatCountdown(Math.floor(diffMs / 1000))); // Convert milliseconds to seconds for countdown display

    if (diffMs < 0) {
      setEligibleTime("0h 0m 0s");
    }
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

  const completed = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("merge_matches")
      .update({ giver_checked: true })
      .eq("id", newCommitment.orderId);

    if (error) {
      console.log(error);
      return;
    }
    toast.success("confirmed");
    window.location.reload();
  };

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
              to Contribution ID: NC-{receiverId && receiverId.split("-")[0]}
            </span>
          </p>

          <p className="text-xs md:text-sm font-bold text-gray-500 mb-2">
            you have been matched to a user
          </p>
        </div>
      </div>

      <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
        Time left to make payment:
        {eligibleTime}
      </p>

      {/* Buttons */}
      {status === "completed" ? (
        <button
          className="w-full bg-blue-600 cursor-pointer text-white font-semibold px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
          onClick={completed}
        >
          Completed
        </button>
      ) : (
        <>
          <button
            className="w-full bg-white cursor-pointer text-gray-800 font-semibold border border-gray-400 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-4 hover:bg-gray-100 transition text-sm md:text-base"
            onClick={handleViewReceiverDetails}
          >
            View Receiver Details
          </button>
          <button
            className="w-full bg-blue-600 cursor-pointer text-white font-semibold px-3 md:px-4 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
            onClick={handleConfirmPayment}
          >
            I&apos;ve paid
          </button>
        </>
      )}
    </motion.div>
  );
}

function formatCountdown(seconds) {
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return ` ${hours}h ${minutes}m ${secs}s`;
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
