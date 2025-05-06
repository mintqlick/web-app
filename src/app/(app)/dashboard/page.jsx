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
import CommitmentSuccessfull from "@/components/commitment-successful";
import ReceiverConfirmationModal from "@/components/ReceiverConfirmationModal";
import CommitmentSuccessfullCard from "@/components/received-card";
import ActiveCommitment from "@/components/active-commitment";

export default function MainPage() {
  const [showCommitmentBox, setShowCommitmentBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null); // State to hold user ID
  const [amount, setAmount] = useState("");
  const [newCommitment, setNewCommitment] = useState(null); // To hold the new commitment data
  const [countdown, setCountdown] = useState(24 * 60 * 60); // 7 days countdown in seconds
  const [showModal, setShowModal] = useState(false);
  const [isMerged, setIsMerged] = useState(false);
  const [receiverId, setReceiverId] = useState(null); // State to hold receiver ID
  const [Confirmed, setConfirmed] = useState(null); // State to hold confirmation status
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [commitmentsArr, setCommitmentArr] = useState([]);
  const router = useRouter();
  const [canCommit, setCanCommit] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [receive_data, set_receiver_data] = useState(null);
  const [pay, setPay] = useState(false);
  const [rcv_detail, setRcvDetail] = useState(null); // set all needed equiement of reciever i.e giver and receiver for receiver use only
  const [orderId, setOrderId] = useState(null);
  const [openRcv, setOpenRcv] = useState(false);
  const [withdrawLoading, setWithDrawLoading] = useState(false);

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
      } else {
        setUserId(user?.id);
        const { data: userData, error: userDataError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id)
          .single();
        if (userDataError) {
        } else {
          const { data: accountData, error: accountError } = await supabase
            .from("account")
            .select("*")
            .eq("user_id", user?.id)
            .limit(1)
            .single();
          if (accountError) {
          } else {
            setUserData({ ...userData, account: accountData });
          }
        }
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
    if (isNaN(numAmount) || numAmount < 10 || numAmount > 1000) {
      setMessage("Please enter an amount between 10 and 1000 USDT.");
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
      setCountdown(24 * 60 * 60); // Reset countdown to 7 days
      setShowCommitmentBox(false); // Hide the commitment box after successful commit
    }

    setLoading(false);
  };
  const handleCancelCommitment = async (id) => {
    const supabase = createClient();

    const { error: deleteErr } = await supabase
      .from("merge_givers")
      .delete()
      .eq("id", id);

    if (deleteErr) return;
    location.reload();

    // Later, you will write the real cancel logic here (like deleting the record from database)
  };

  const receiverDetailHelper = async () => {
    const supabase = createClient();

    const {
      data: { receiver_id, matched_amount },
      error: giver_error,
    } = await supabase
      .from("merge_matches")
      .select("*")
      .eq("giver_id", commitmentsArr[0]?.id)
      .single();

    setReceiverId(receiver_id);
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
  };

  const handleViewReceiverDetails = async () => {
    await receiverDetailHelper();
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const upload = async (formdata) => {
    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formdata,
    });
    return res;
  };

  const withDraw = async (amt) => {
    setWithDrawLoading(true);
    try {
      const res = await fetch("/api/join-receiver", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          amount: amt, // amount to withdraw
        }),
      });

      if (res.ok) {
        const result = await fetch("/api/merge", {
          method: "GET",
          "Content-Type": "application/json",
        });
        if (result.ok) {
        }
      }
    } catch (error) {}
    setWithDrawLoading(false);
  };

  const handleConfirmPayment = () => {
    setPay(true);
  };

  const confirmHandler = async () => {
    const response = await fetch("/api/confirm-receiver", {
      method: "POST",
      body: JSON.stringify({
        receiver_id: userId,
        giver_id: rcv_detail.user_id,
      }),
    });
    const result = await response.json();
    alert("confirmed");
    setOpenRcv(false);
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

      try {
        const { data, error: receiverErr } = await supabase
          .from("merge_receivers")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (receiverErr) {
          return; // Early return if there's an error fetching data
        }

        if (data) {
          setCanWithdraw(true);
        } else {
          setCanWithdraw(false); // In case there's no data
        }
      } catch (error) {}
    };

    if (userId) {
      check_receiver(); // Only call if userId is available
    }
  }, [userId]);

  useEffect(() => {
    const handler = async () => {
      const supabase = createClient();

      // If there are commitments, log them
      if (commitmentsArr[0]) {
      }

      try {
        const { data: gvr, error: gvr_error } = await supabase
          .from("merge_givers")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (gvr_error) {
        } else {
        }

        // Log any error

        // Uncomment this if needed
        const { data, error: giver_error } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("giver_id", gvr?.id)
          .single();

        setReceiverId(data.receiver_id);
      } catch (err) {}
    };

    if (userId) {
      handler();
    }
  }, [userId, commitmentsArr]);

  useEffect(() => {
    const handler = async () => {
      const supabase = createClient();

      try {
        const { data: rcr, error: rcr_error } = await supabase
          .from("merge_receivers")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "pending")
          .single();

        if (rcr_error) {
        } else {
        }

        // Log any error
        setRcvDetail(rcr);

        // Uncomment this if needed
        const {
          data: { giver_id },
          error: receiver_error,
        } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("receiver_id", rcr?.id)
          .single();

        if (!giver_id) {
          setRcvDetail(rcr);
          return;
        }

        const { data: giver_det, error: giver_error } = await supabase
          .from("merge_givers")
          .select("*")
          .eq("id", giver_id)
          .single();

        setRcvDetail({ ...giver_det, success: true });
      } catch (err) {}
    };

    if (userId) {
      handler();
    }
  }, [userId]);

  // useEffect(() => {
  //   const handler = async () => {
  //     const supabase = createClient();
  //     try {
  //       const { data: rcr, error: rcr_error } = await supabase
  //         .from("merge_receivers")
  //         .select("*")
  //         .eq("user_id", userId)
  //         .eq("status", "waiting")
  //         .maybeSingle();

  //       if (rcr_error || !rcr) {

  //         return;
  //       }

  //       setReceiverId(rcr.user_id);

  //       const { data: match, error: receiver_error } = await supabase
  //         .from("merge_matches")
  //         .select("*")
  //         .eq("receiver_id", rcr.id)
  //         .maybeSingle();
  //       if (receiver_error) {

  //         return;
  //       }

  //       const { data: giver_det, error: giver_error } = await supabase
  //         .from("merge_givers")
  //         .select("*")
  //         .eq("id", match?.giver_id)
  //         .maybeSingle();

  //       if (giver_error) {

  //       }

  //       setRcvDetail({ ...giver_det, ...match });

  //     } catch (err) {

  //     }
  //   };

  //   if (userId) {
  //     handler();
  //   }
  // }, [userId]);

  // check if user has entry in referral table
  
  useEffect(() => {
    const handleReferralInsert = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const isOAuth = user.app_metadata?.provider !== "email";

      if (isOAuth) {
        const { data: existing, error } = await supabase
          .from("referrals")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (!existing) {
          const referralCode = `REF-${user.id.slice(0, 8)}`;

          await supabase.from("referrals").insert([
            {
              user_id: user.id,
              referral_code: referralCode,
              referred_by: null,
            },
          ]);
        }
      }
    };

    handleReferralInsert();
  }, []);

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
                <span className="font-bold">{userId || "N/A"}</span>
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
              </div>
            </div>
          </div>

          {/* Active commitment */}
          {commitmentsArr.some((item) => item.status === "completed") && (
            <ActiveCommitment
              loading={withdrawLoading}
              onWithdraw={withDraw}
              amount={
                commitmentsArr.find((item) => item.status === "completed")
                  ?.original_amount
              }
              countdown={7 * 24 * 3600}
              cmtData={commitmentsArr.find(
                (item) => item.status === "completed"
              )}
             
            />
          )}

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
                const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                timeLeft = `${hours}h ${minutes}m ${seconds}s`;
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
                  confirmed={el.confirmed}
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
            upload={upload}
            onConfirm={() => setPay(false)}
          />

          {/* {commitmentsArr[0]?.confirmed && (
            <CommitmentSuccessfull
              countdown={commitmentsArr[0]?.eligible_as_receiver || ""}
              receiverId={receiverId}
              userId={userId}
              newCommitment={{
                amount: commitmentsArr[0].original_amount,
                orderId: commitmentsArr[0].id,
              }}
            />
          )} */}
          {/* You can add the second box here if needed */}

          {openRcv && (
            <ReceiverConfirmationModal
              show={openRcv}
              screenshotUrl={rcv_detail.image_url}
              userId={rcv_detail.user_id}
              onConfirm={confirmHandler}
              onClose={() => setOpenRcv(false)}
            />
          )}

          {rcv_detail && (
            <CommitmentSuccessfullCard
              giver_id={rcv_detail.success ? rcv_detail.user_id : null}
              clicked={() => setOpenRcv(true)}
              newCommitment={{
                amount: rcv_detail.amount,
                orderId: rcv_detail.id,
              }}
              receiver_data={rcv_detail}
            />
          )}
        </div>
      </div>

      <RightSideBar />
    </div>
  );
}
