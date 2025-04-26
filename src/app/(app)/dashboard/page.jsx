"use client";
import { Calendar, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function MainPage() {
  const [showCommitmentBox, setShowCommitmentBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
   const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(null); // State to hold user ID
    const [amount, setAmount] = useState('');
  const profit = amount ? (parseFloat(amount) * 0.45).toFixed(2) : '0.00';
  const totalReceive = amount ? (parseFloat(amount) + parseFloat(profit)).toFixed(2) : '0.00';

  
    useEffect(() => {
      const fetchUserData = async () => {
        const supabase = createClient();
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          setUserId(user?.id);
          const { data: userData, error: userDataError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user?.id)
            .single();
          if (userDataError) {
            console.error("Error fetching user data:", userDataError.message);
          } else {
            const { data: accountData, error: accountError } = await supabase
              .from("account")
              .select("*")
              .eq("user_id", user?.id)
              .limit(1)
              .single();
            if (accountError) {
              console.error("Error fetching account data:", accountError.message);
            } else {
              console.log("Account data:", accountData);
              setUserData({ ...userData, account: accountData });
            }
          }
          console.log("User data:", userData);
        }
      };
      fetchUserData();
    }, []);

  const toggleCommitmentBox = () => {
    setShowCommitmentBox(!showCommitmentBox);
  };


  const handleCommit = async () => {
    const supabase = createClient();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10 || numAmount > 100) {
      setMessage('Please enter an amount between 10 and 100 USDT.');
      return;
    }

    setLoading(true);
    setMessage('');

    const { data, error } = await supabase
      .from('merge_givers')
      .insert([
        {
          user_id: userId,
          original_amount: numAmount,
          amount_remaining: numAmount,
        },
      ]);

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage('✅ Commitment successful! You have been added to the giver queue.');
      setAmount('');
    }

    setLoading(false);
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
                Contribution ID: <span className="font-bold">{userData?.id || "N/A"}</span>
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
                <p><span className="font-semibold">Maximum Commitment:</span> 100.0 USDT</p>
                <p><span className="font-semibold">Minimum Commitment:</span> 10.0 USDT</p>
              </div>
      
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium mb-1">Enter Amount</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="Enter amount"
                  className="w-full bg-white border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
      
              <button className="bg-blue-600 text-white text-sm w-full px-4 py-2 rounded-md">
                Commit Amount
              </button>
            </div>
      
            <div className="bg-[#EDF2FC] p-4 rounded-lg shadow-md border mt-4">
              <h4 className="text-base text-red-600 font-semibold mb-1">Note:</h4>
              <div className="flex flex-col gap-2 text-sm mb-4">
                <p><span className="font-semibold">Duration:</span> 7 days</p>
                <p><span className="font-semibold">Interest Rate:</span> 45%</p>
                <p><span className="font-semibold">Profit:</span> {profit} USDT</p>
                <p><span className="font-semibold">Amount to be received:</span> {totalReceive} USDT</p>
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
