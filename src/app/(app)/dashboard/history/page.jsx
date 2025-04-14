import Box from "@/components/Box/Box";
import React from "react";

const HistoryPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-0 animate-fadeIn">
      <div className="w-full  space-y-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold mb-4 transition-all duration-300">
          Transaction History
        </h2>
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-[#1860d9] text-white rounded-md hover:bg-[#154db1] transition">
              All
            </button>
            <button className="px-4 py-2 bg-[#EDF2FC] text-black border-2 border-gray-600 rounded-md hover:bg-blue-200 transition">
              Completed
            </button>
            <button className="px-4 py-2 bg-[#EDF2FC] text-black rounded-md border-2  border-gray-600 hover:bg-blue-200 transition">
              Pending
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate [border-spacing:0]">
              <thead>
                <tr className="border-b-[3px] border-black">
                  <th className="py-3 px-4 font-semibold">Order ID</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Amount</th>
                  <th className="py-3 px-4 font-semibold">Receiver Name</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className=" border-gray-200">
                  <td className="py-3 px-4">#12345</td>
                  <td className="py-3 px-4">2025-04-13</td>
                  <td className="py-3 px-4">$50</td>
                  <td className="py-3 px-4">John Doe</td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-500 text-white w-[200px] px-3 py-1 rounded-md text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-3 px-4">#12346</td>
                  <td className="py-3 px-4">2025-04-12</td>
                  <td className="py-3 px-4">$30</td>
                  <td className="py-3 px-4">Jane Smith</td>
                  <td className="py-3 px-4">
                    <span className="bg-black text-white px-3 py-1 w-[200px] rounded-md text-sm underline">
                      Pending
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default HistoryPage;
