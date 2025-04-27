"use client";

import React from "react";

export default function CommitmentBox({ amount, setAmount, onCommit, loading }) {
  return (
    <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border">
      <h4 className="text-base font-semibold mb-1">New Commitment</h4>
      <p className="text-sm text-gray-600 mb-3">
        Specify the amount to be committed.
      </p>

      <div className="flex flex-col gap-2 text-sm mb-4">
        <p><span className="font-semibold">Maximum Commitment:</span> 100.0 USDT</p>
        <p><span className="font-semibold">Minimum Commitment:</span> 10.0 USDT</p>
      </div>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Enter Amount
        </label>
        <input
          type="number"
          id="amount"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={onCommit}
        disabled={loading}
        className="bg-blue-600 text-white text-sm w-full px-4 py-2 rounded-md"
      >
        {loading ? "Committing..." : "Commit Amount"}
      </button>
    </div>
  );
}
