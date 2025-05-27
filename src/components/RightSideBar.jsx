import React, { useEffect, useState } from "react";
import { Calendar, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const RightSideBar = () => {
  const supabase = createClient();
  const [History, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const excution = async () => {
      const { data: historyData, error: historyError } = await supabase
        .from("merge_receivers")
        .select("*")
        .eq("status", "completed");
      if (historyError) {
        return;
      }

      setHistory(historyData);

      setLoading(false);
    };

    excution();
  }, []);

  return (
    <>
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
            {(Array.isArray(History) ? History : []).map((el, i) => (
              <tr key={i}>
                <td className="py-2 px-2">#{el?.id.split("-")[1]}</td>
                <td className="py-2 px-2">${el.amount}</td>
                <td className="py-2 px-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full bg-blue-500"
                    title="Completed"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RightSideBar;
