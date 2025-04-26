"use client";

import Spinner from "@/components/auth/spinner";
import Box from "@/components/Box/Box";
import supabase from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react/dist/cjs/lucide-react";
import React, { useEffect, useState } from "react";

const HistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [arr, setArrVal] = useState([]);
  const [query, setQuery] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.auth.getUser();
      const active_user = data?.user?.id;

      if (error || !active_user) {
        console.error(error || "No active user found");
        return;
      }

      const { data: giverData, error: giverError } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", active_user);

      const { data: receiverData, error: receiverError } = await supabase
        .from("merge_receivers")
        .select("*")
        .eq("user_id", active_user);

      if (giverError || receiverError) {
        console.error(
          "Error fetching giver or receiver data:",
          giverError || receiverError
        );
        return;
      }

      const combinedData = [
        ...giverData.map((item) => ({ ...item, type: "giver" })),
        ...receiverData.map((item) => ({ ...item, type: "receiver" })),
      ];

      const sortedData = combinedData.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setTransactions(sortedData);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    setLoading(true);
    const from = (page - 1) * pageSize;
    const to = page * pageSize;
    let newTrans = transactions;
    if (query === "pending") {
      newTrans = transactions.filter((el) => el.status === "waiting");
    } else {
      if (query === "completed") {
        newTrans = transactions.filter((el) => el.status !== "waiting");
      }
    }

    console.log(query)

    setVisibleTransactions(newTrans.slice(from, to));
    setLoading(false);
  }, [transactions, page, pageSize,query]);

  useEffect(() => {
    const length = Math.floor(transactions.length / pageSize);
    const arrVal = Array.from({ length: length }, (_, i) => i + 1);
    setArrVal(arrVal);
  }, [pageSize, transactions.length, page,query]);

  const handleMore = (type) => {
    if (type === "back") {
      if (page === 1) {
        return;
      }
      setPage((prev) => prev - 1);
    } else {
      if (page === transactions.length / pageSize) {
        return;
      }
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-0 animate-fadeIn">
      <div className="w-full space-y-5">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[45px] font-bold mb-4 transition-all duration-300">
          Transaction History
        </h2>
        <Box
          variant="card"
          className="bg-[#EDF2FC] p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out animate-slideUp"
        >
          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setQuery("all")}
              className={`px-4 py-2 ${
                query === "all"
                  ? "bg-[#1860d9] text-white"
                  : "bg-[#EDF2FC] border-2 border-gray-600 text-black"
              }  rounded-md hover:bg-[#154db1] transition`}
            >
              All
            </button>
            <button
              onClick={() => setQuery("completed")}
              className={`px-4 py-2 ${
                query === "completed"
                  ? "bg-[#1860d9] text-white"
                  : "bg-[#EDF2FC] border-2 border-gray-600 text-black"
              } rounded-md hover:bg-blue-200 transition`}
            >
              Completed
            </button>
            <button
              onClick={() => setQuery("pending")}
              className={`px-4 py-2 ${
                query === "pending"
                  ? "bg-[#1860d9] text-white"
                  : "bg-[#EDF2FC] border-2 border-gray-600 text-black"
              } rounded-md  hover:bg-blue-200 transition`}
            >
              Pending
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative flex flex-col space-y-3">
            <table className="w-full text-left border-separate [border-spacing:0] text-xs sm:text-sm ">
              <thead>
                <tr className="border-b-[3px] border-black">
                  <th className="py-2 px-2 font-semibold ">Order ID</th>
                  <th className="py-2 px-2 font-semibold">Date</th>
                  <th className="py-2 px-2 font-semibold">Amount</th>
                  <th className="py-2 px-2 font-semibold">Receiver Name</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && !visibleTransactions ? (
                  <Spinner size={80} />
                ) : visibleTransactions.length > 0 ? (
                  visibleTransactions.map((el) => (
                    <tr className="border-b border-gray-200" key={el.id}>
                      <td className="py-2 px-2">#{el.id.slice(0, 8)}...</td>
                      <td className="py-2 px-2">
                        {new Date(el.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2">${el.original_amount}</td>
                      <td className="py-2 px-2">John Doe</td>
                      <td className="py-2 px-2">
                        <span
                          className={`inline-block w-3 h-3 sm:w-auto sm:h-auto sm:px-3 sm:py-1 ${
                            el.status === "waiting"
                              ? "bg-yellow-400"
                              : "bg-blue-500"
                          } rounded-full sm:rounded-md sm:text-white sm:text-xs text-transparent`}
                          title="Completed"
                        >
                          <span className="hidden sm:inline">
                            {el.status === "waiting" ? "Pending" : "Completed"}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="w-full  block text-center ">
                      "No transaction yet"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th className="text-left">
                    <select
                      className="text-sm bg-gray-400 rounded-sm py-1 mr-1"
                      value={pageSize}
                      onChange={(e) => setPageSize(+e.target.value)}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                    <span className="text-gray-500 text-sm">per pages</span>
                  </th>
                  <th className="">
                    <div className="flex justify-end">
                      <select
                        className="text-sm bg-gray-400 rounded-sm py-1 mr-1"
                        onChange={(e) => {
                          setPage(+e.target.value);
                        }}
                        value={page}
                      >
                        {arr.map((el) => (
                          <option key={el} value={el}>
                            {el}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500 text-sm">
                        of {Math.floor(transactions.length / pageSize)} pages
                      </span>
                      <span className="flex">
                        <ChevronLeft
                          className="text-gray-400"
                          onClick={() => handleMore("back")}
                        />
                        <ChevronRight
                          className="text-gray-400"
                          onClick={() => handleMore("forward")}
                        />
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default HistoryPage;
