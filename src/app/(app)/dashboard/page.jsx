"use client";
import { Calendar, Plus } from "lucide-react";
import React, { useState } from "react";

export default function MainPage() {
  const [showCommitmentBox, setShowCommitmentBox] = useState(false);

  const toggleCommitmentBox = () => {
    setShowCommitmentBox(!showCommitmentBox);
  };
  return (
    <div className="flex w-full h-full">
      {/* Center Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Top Card */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              {/* Contribution ID */}
              <h3 className="text-sm font-medium">
                Contribution ID: <span className="font-bold">#1234556</span>
              </h3>

              {/* Buttons (side-by-side on sm+, stacked on mobile) */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={toggleCommitmentBox}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  <div className="bg-white p-1 rounded-full">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Add Commitment</span>
                </button>

                <button
                  onClick={toggleCommitmentBox}
                  className="flex items-center justify-center gap-2 bg-white text-black px-3 py-1.5 rounded-md text-sm"
                >
                  <div className="bg-gray-600 p-1 rounded-full">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <span>Recommitment</span>
                </button>
              </div>
            </div>
          </div>

          {/* New Commitment Box */}
          {showCommitmentBox && (
            <>
              <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border">
                <h4 className="text-base font-semibold mb-1">New Commitment</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Specify the amount to be committed.
                </p>

                <div className="flex flex-col gap-2 text-sm mb-4">
                  <p>
                    <span className="font-semibold">Maximum Commitment:</span>{" "}
                    100.0 USDT
                  </p>
                  <p>
                    <span className="font-semibold">Minimum Commitment:</span>{" "}
                    10.0 USDT
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="amount"
                  >
                    Enter Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    placeholder="Enter amount"
                    className="w-full bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button className="bg-blue-600 text-white text-sm w-full px-4 py-2 rounded-md">
                  Commit Amount
                </button>
              </div>
              <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border">
                <h4 className="text-base text-red-600 font-semibold mb-1">
                  Note:
                </h4>

                <div className="flex flex-col gap-2 text-sm mb-4">
                  <p>
                    <span className="font-semibold">Duraton:</span> 5days
                  </p>
                  <p>
                    <span className="font-semibold">Interest Rate:</span> 50%
                  </p>
                  <p>
                    <span className="font-semibold">Profit:</span> 5.0 USDT
                  </p>
                  <p>
                    <span className="font-semibold">
                      Amount to be received:
                    </span>{" "}
                    50.0 USDT
                  </p>
                </div>
              </div>
            </>
          )}

          {/* You can add the second box here if needed */}
        </div>
      </div>

      {/* Right Sidebar - visible only on desktop */}
      <div className="hidden md:block md:w-1/3 lg:w-1/4 border-l border-gray-200 p-4 bg-[#EDF2FC] rounded-2xl overflow-y-auto">
        {/* Header row with title and filter */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Transaction History</h2>
          <div className="relative inline-flex items-center">
            <Calendar className="absolute left-2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select className=" pl-7  py-1 text-sm border bg-white rounded text-gray-700">
              <option>April</option>
              <option>March</option>
              <option>February</option>
            </select>
          </div>
        </div>

        {/* History Table */}
        <table className="w-full text-left text-sm border-separate [border-spacing:0]">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-2">ID</th>
              <th className="py-2 px-2">Price</th>
              <th className="py-2 px-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2">#12345</td>
              <td className="py-2 px-2">$50</td>
              <td className="py-2 px-2">
                <span
                  className="inline-block w-3 h-3 rounded-full bg-blue-500"
                  title="Completed"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2 px-2">#12346</td>
              <td className="py-2 px-2">$30</td>
              <td className="py-2 px-2">
                <span
                  className="inline-block w-3 h-3 rounded-full bg-black"
                  title="Pending"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
