"use client";

import React from "react";

export default function CommitmentNote({ profit, totalReceive }) {
  return (
    <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4">
      <h4 className="text-base text-red-600 font-semibold mb-1">Note:</h4>
      <div className="flex flex-col gap-2 text-sm mb-4">
        <p><span className="font-semibold">Duration:</span> 7 days</p>
        <p><span className="font-semibold">Interest Rate:</span> 45%</p>
        <p><span className="font-semibold">Profit:</span> {profit} USDT</p>
        <p><span className="font-semibold">Amount to be received:</span> {totalReceive} USDT</p>
      </div>
    </div>
  );
}
