"use client";
import React from "react";
import { motion } from "framer-motion";
import { MdOutlineCreditScore } from "react-icons/md";

export default function NewCommitmentDetails({
  newCommitment,
  phase,
  countdown,
  receiverId,
  userId,
  handleViewReceiverDetails,
  handleConfirmPayment,
  handleCancelCommitment,
  handleUploadProof,
  handleWithdraw,
  handleConfirmReceived,
  screenshotUrl,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4"
    >
      <div className="bg-white p-3 md:p-4 rounded-2xl text-sm mb-4 flex flex-col md:flex-row items-start gap-4">
        <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] flex items-center justify-center bg-white rounded-2xl border-2 border-gray-400">
          <MdOutlineCreditScore className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
        </div>

        <div className="flex flex-col justify-start w-full">
          {phase === "queued" && (
            <>
              <h4 className="font-bold mb-2">You requested to commit</h4>
              <p className="text-lg font-bold text-blue-600">
                {newCommitment.amount} USDT
              </p>
              <p className="text-sm text-gray-500">
                You will be merged with a receiver soon. Please wait.
              </p>
            </>
          )}

          {phase === "merged" && (
            <>
              <h4 className="font-bold mb-2 text-gray-800">
                You are assigned to pay
              </h4>
              <p className="text-lg font-bold text-blue-600">
                {newCommitment.amount} USDT to Contribution ID: {receiverId}
              </p>
            </>
          )}

          {phase === "payment_confirmed" && (
            <>
              <h4 className="font-bold mb-2 text-gray-800">You paid</h4>
              <p className="text-lg font-bold text-green-700">
                Awaiting 7-day maturity period
              </p>
            </>
          )}

          {phase === "matured" && (
            <>
              <h4 className="font-bold mb-2 text-gray-800">Your profit is ready!</h4>
              <p className="text-lg font-bold text-green-700">
                {newCommitment.amount * 1.45} USDT
              </p>
            </>
          )}

          {phase === "withdraw_queued" && (
            <>
              <h4 className="font-bold mb-2 text-gray-800">
                Waiting for givers to be assigned
              </h4>
              <p className="text-sm text-gray-500">Please be patient.</p>
            </>
          )}

          {phase === "receiver_assigned" && (
            <>
              <h4 className="font-bold mb-2 text-gray-800">
                Confirm you've received payment
              </h4>
              <img src={screenshotUrl} alt="Proof" className="w-full h-auto rounded mt-2" />
            </>
          )}

          {phase === "completed" && (
            <p className="text-green-600 font-bold text-center">
              Transaction Complete ✅
            </p>
          )}
        </div>
      </div>

      <p className="text-2xl md:text-4xl text-gray-900 mb-4 text-center">
        Time left: {formatCountdown(countdown)}
      </p>

      {/* Action Buttons */}
      {phase === "queued" && (
        <button
          className="mt-4 w-full bg-red-600 text-white text-sm font-bold py-2 rounded-md hover:bg-red-700"
          onClick={handleCancelCommitment}
        >
          Cancel
        </button>
      )}

      {phase === "merged" && (
        <>
          <button
            className="w-full bg-white text-gray-800 font-semibold border border-gray-400 py-2 rounded-lg mb-2 hover:bg-gray-100"
            onClick={handleViewReceiverDetails}
          >
            View Receiver Details
          </button>
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
            onClick={handleConfirmPayment}
          >
            Confirm Payment
          </button>
        </>
      )}

      {phase === "matured" && (
        <button
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700"
          onClick={handleWithdraw}
        >
          Withdraw
        </button>
      )}

      {phase === "receiver_assigned" && (
        <button
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700"
          onClick={handleConfirmReceived}
        >
          Confirm Received
        </button>
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
