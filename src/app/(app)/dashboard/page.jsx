"use client";
import { Calendar, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
<script src="http://localhost:8097"></script>;
import { MdOutlineCreditScore } from "react-icons/md";
import RightSideBar from "@/components/RightSideBar";
import ReceiverDetailsModal from "@/components/ReceiverDetailsModal";
import CommitmentBox from "@/components/CommitmentBox";
import CommitmentNote from "@/components/CommitmentNote";
import NewCommitmentDetails from "@/components/NewCommitmentDetails";
import { useRouter } from "next/navigation";
import { set } from "zod";
import UploadScreenshotModal from "@/components/UploadScreenshotModal";

export default function MainPage() {
  const [showCommitmentBox, setShowCommitmentBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold user ID
  const [amount, setAmount] = useState("");
  const [newCommitment, setNewCommitment] = useState(null); // To hold the new commitment data
  const [countdown, setCountdown] = useState( 24 * 60 * 60); // 7 days countdown in seconds
  const [showModal, setShowModal] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [receiverId, setReceiverId] = useState(null); // State to hold receiver ID
  const [isConfirmed, setIsConfirmed] = useState(false); // State to hold confirmation status
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [commitmentsArr, setCommitmentArr] = useState([]);
  const router = useRouter();
  const [canCommit, setCanCommit] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [receive_data, set_receiver_data] = useState(null);
  const [pay, setPay] = useState(false);

  const handleShowReceiverModal = (url) => {
    setScreenshotUrl(url);
    setShowReceiverModal(true);
  };

  const profit = amount ? (parseFloat(amount) * 0.45).toFixed(2) : "0.00";
  const totalReceive = amount
    ? (parseFloat(amount) + parseFloat(profit)).toFixed(2)
    : "0.00";

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
      setMessage("Please enter an amount between 10 and 100 USDT.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("merge_givers")
      .insert([
        {
          user_id: userId,
          original_amount: numAmount,
          amount_remaining: numAmount,
        },
      ])
      .select()
      .single(); // <== VERY IMPORTANT: we use `.single()` to get the inserted data immediately

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage(
        "✅ Commitment successful! You have been added to the giver queue."
      );
      setAmount("");
      // Save the new commitment data
      setNewCommitment({
        amount: numAmount,
        orderId: data.id, // This assumes your 'merge_givers' table has 'id' field
      });
      setCountdown( 24 * 60 * 60); // Reset countdown to 7 days
      setShowCommitmentBox(false); // Hide the commitment box after successful commit
    }

    setLoading(false);
  };
  const handleCancelCommitment = async (id) => {
    console.log("Cancel commitment clicked");

    const supabase = createClient();

    const { error: deleteErr } = await supabase
      .from("merge_givers")
      .delete()
      .eq("id", id);
    console.log(deleteErr, "error");
    if (deleteErr) return;
    location.reload();

    // Later, you will write the real cancel logic here (like deleting the record from database)
  };

  const handleViewReceiverDetails = async () => {
    const supabase = createClient();

    const {
      data: { receiver_id, matched_amount },
      error: giver_error,
    } = await supabase
      .from("merge_matches")
      .select("*")
      .eq("giver_id", commitmentsArr[0]?.id)
      .single();

    const { data: receive_data, error: receiver_error } = await supabase
      .from("merge_receivers")
      .select(`*`)
      .eq("id", receiver_id)
      .single();

    const { data: profile_data, error: profile_error } = await supabase
      .from("users")
      .select(`*`)
      .eq("id", receive_data.user_id)
      .single();

    const { data: AccData, error: accErr } = await supabase
      .from("account")
      .select("*")
      .eq("user_id", receive_data.user_id)
      .single();

    const { name, phone } = profile_data;
    const { network, address } = AccData;
    set_receiver_data({
      name,
      phone,
      address,
      network,
      amount: matched_amount,
    });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const withDraw = async () => {
    try {
      const res = await fetch("/api/join-receiver", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify({
          user_id: userId,
          amount: 30,
          amount_remaining: 30,
        }),
      });

      if (res.ok) {
        const result = await fetch("/api/merge", {
          method: "GET",
          "Content-Type": "application/json",
        });
        if (result.ok) {
          console.log("successful");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmPayment = () => {
    setPay(true);
  };

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

  useEffect(() => {
    const fetchCommitment = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", userId)
        .or("status.eq.waiting,status.eq.pending");

      if (data) {
        setCommitmentArr(data);
        console.log(data, "datatatat");
        if (data.length < 1) {
          setCanCommit(true);
        } else {
          setCanCommit(false);
        }
      }
    };

    fetchCommitment();
  }, [userId]);

  useEffect(() => {
    const check_receiver = async () => {
      const supabase = createClient();
      const { data, error: receiverErr } = await supabase
        .from("merge_receivers")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) setCanWithdraw(true);
    };
    check_receiver();
  }, [userId]);

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
                Contribution ID:{" "}
                <span className="font-bold">{userData?.id || "N/A"}</span>
              </h3>

              {/* Buttons (side-by-side on sm+, stacked on mobile) */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  disabled={!canCommit}
                  onClick={toggleCommitmentBox}
                  className="disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  <div className="bg-white p-1 rounded-full">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Add Commitment</span>
                </button>

                <button
                  // disabled={!canWithdraw}
                  onClick={withDraw}
                  className="disabled:bg-red-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm"
                >
                  <div className="bg-white p-1 rounded-full">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>

          {/* New Commitment Box */}
          {showCommitmentBox && (
            <>
              <CommitmentBox
                amount={amount}
                setAmount={setAmount}
                onCommit={handleCommit}
                loading={loading}
              />
              <CommitmentNote profit={profit} totalReceive={totalReceive} />
            </>
          )}
          {newCommitment && (
            <NewCommitmentDetails
              newCommitment={newCommitment}
              isMerged={isMerged}
              receiverId={receiverId}
              userId={userId}
              countdown={countdown}
              handleCancelCommitment={() =>
                handleCancelCommitment(newCommitment.orderId)
              }
              handleViewReceiverDetails={handleViewReceiverDetails}
            />
          )}
          {commitmentsArr &&
            commitmentsArr.map((el) => {
              console.log(el, "This is el");
              const cmtdetail = {
                amount: el.original_amount,
                orderId: el.id,
                id: userId,
              };
              const targetDate = new Date(el.expires_at);
              const now = new Date();
              const diffMs = targetDate - now;
              let timeLeft;
              if (diffMs > 0) {
                const totalSeconds = Math.floor(diffMs / 1000);
                const days = Math.floor(totalSeconds / (3600 * 24));
                const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
              }

              return (
                <NewCommitmentDetails
                  key={el.id}
                  newCommitment={cmtdetail}
                  isMerged={isMerged}
                  receiverId={receiverId}
                  userId={userId}
                  countdown={timeLeft}
                  handleCancelCommitment={() => handleCancelCommitment(el.id)}
                  handleViewReceiverDetails={handleViewReceiverDetails}
                  handleConfirmPayment={handleConfirmPayment}
                  status={el.status}
                />
              );
            })}

          <ReceiverDetailsModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            newCommitment={newCommitment}
            receive_data={receive_data}
          />

          <UploadScreenshotModal
            show={pay}
            onClose={() => setPay(false)}
            userId={userId}
            // onConfirm={}
          />

          {/* You can add the second box here if needed */}
        </div>
      </div>

      <RightSideBar />
    </div>
  );
}
