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
import Recommitment from "@/components/recommitment";
import { toast } from "react-toastify";
import MatchedCommitment from "@/components/matched-commitment";

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
  const [isCompleted, setIsCompleted] = useState(false);
  const [matchedData, setMatchedData] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [receiverArr, setReceiverArr] = useState([]); // To hold receiver data
  const [confirmReceiverLoading, setConfirmReceiverLoading] = useState(false);


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
    if (!canCommit) {
      toast.warning("resolve all commitment to continue");
      return;
    }
    if (commitmentsArr.length > 0) {
      const smallest = Math.min(
        ...commitmentsArr.map((el) => el.amount_remaining)
      );
      if (amount < smallest) {
        return toast.warning(
          "You can't commit lower than " + smallest + " USDT"
        );
      }
    }

    const supabase = createClient();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 10 || numAmount > 1000) {
      toast.warning("Please enter an amount between 10 and 1000 USDT.");
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
    const networks = network.split(",");
    const addressArr = address.split(",");
    // map networks and address together
    const networkAddressMap = networks.map((net, index) => ({
      network: net.trim(),
      address: addressArr[index] ? addressArr[index].trim() : "",
    }));
    set_receiver_data({
      name,
      phone,
      network: networkAddressMap,
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
    setUploadLoading(true);
    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formdata,
    });
    if (res.status !== 200) {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to upload screenshot");
      setUploadLoading(false);
      return;
    }
    setUploadLoading(false);
    toast.success("Screenshot uploaded successfully!");
  };

  const withDraw = async (amt) => {
    setWithDrawLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("merge_givers")
      .select("original_amount")
      .eq("user_id", userId)
      .eq("status", "completed")
      .single();

    try {
      const res = await fetch("/api/join-receiver", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          amount: data.original_amount * 1.45, // amount to withdraw
        }),
      });

      await res.json();
      if (res.ok) {
        toast.success("Withdrawal request sent successfully!");
        setWithDrawLoading(false);
        setCanWithdraw(false);
        setRcvDetail(null);
        router.refresh();
      }
    } catch (error) {}
    setWithDrawLoading(false);
  };

  const handleConfirmPayment = () => {
    setPay(true);
  };

  const confirmHandler = async () => {                            
    setConfirmReceiverLoading(true);
    const response = await fetch("/api/confirm-receiver", {
      method: "POST",
      body: JSON.stringify({
        receiver_id: userId,
        giver_id: rcv_detail.user_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || "Failed to confirm receiver");
      return;
      setConfirmReceiverLoading(false);
    }
    const result = await response.json();

    toast.success("Receiver confirmed successfully!");
    setOpenRcv(false);
    setConfirmReceiverLoading(false);
  };
  // useEffect(() => {
  //   let timer;
  //   if (countdown > 0) {
  //     timer = setInterval(() => {
  //       setCountdown((prev) => prev - 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(timer);
  //   }
  //   return () => clearInterval(timer);
  // }, [countdown]);

  useEffect(() => {
    const fetchCommitment = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", userId);

      if (data) {
        setCommitmentArr(data);
        if (data.length < 2) {
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
        const { data: result, error: matcherr } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("receiver_id", data.id)
          .eq("status", "pending");
        if (matcherr) {
          return;
        }

        setReceiverArr(result);

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

  // useEffect(() => {
  //   const handler = async () => {
  //     const supabase = createClient();

  //     // If there are commitments, log them

  //     try {
  //       const { data: gvr, error: gvr_error } = await supabase
  //         .from("merge_givers")
  //         .select("*")
  //         .eq("user_id", userId)
  //         .eq("status", "pending", "waiting")
  //         .single();

  //       if (gvr_error) {
  //       } else {
  //       }

  //       // Log any error

  //       // Uncomment this if needed
  //       const { data, error: giver_error } = await supabase
  //         .from("merge_matches")
  //         .select("*")
  //         .eq("giver_id", gvr?.id)
  //         .single();

  //       setReceiverId(data.receiver_id);
  //     } catch (err) {}
  //   };

  //   if (userId) {
  //     handler();
  //   }
  // }, [userId, commitmentsArr]);

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

        // Log any error
        setRcvDetail(rcr);

        // Uncomment this if needed
        const {
          data: { giver_id, image_url },
          error: receiver_error,
        } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("receiver_id", rcr?.id)
          .single();

        if (receiver_error) {
          alert("error", rcr_error.message);
          return;
        }

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
  //     try {
  //       const supabase = createClient();
  //       const { data: rcr, error: rcr_error } = await supabase
  //         .from("merge_givers")
  //         .select("*")
  //         .eq("user_id", userId)
  //         .eq("status", "completed")
  //         .Single();

  //       if (rcr_error) {
  //         alert("error");
  //       } else {
  //         setIsCompleted(true);
  //       }

  //       setRcvDetail(rcr);
  //     } catch (err) {
  //       console.error("Error fetching receiver data:", err);
  //     }
  //   };
  //   handler()
  // }, [userId]);

  // fetch from merge_matches where the giver_id is the first commitment in commitmentsArr
  useEffect(() => {
    const fetchMergeMatches = async () => {
      if (commitmentsArr.length > 0) {
        const supabase = createClient();
        const firstCommitment = commitmentsArr[0];

        const { data, error } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("giver_id", firstCommitment.id)
          .single();

        if (data) {
          setMatchedData(data);
        } else if (error) {
          console.error("Error fetching merge matches:", error);
        }
      }
    };

    fetchMergeMatches();
  }, [commitmentsArr]);

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
                <span className="font-bold">
                  {userId ? userId.split("-")[0] : "N/A"}
                </span>
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

          {/* Active commitment */}

          {/* {commitmentsArr.some((item) => item.status === "completed") && ( */}
          {commitmentsArr.length > 0 && (
            <ActiveCommitment
              loading={withdrawLoading}
              onWithdraw={withDraw}
              // amount={
              //   commitmentsArr.find((item) => item.status === "completed")
              //     ?.original_amount
              // }
              amount={commitmentsArr[0].original_amount}
              countdown={7 * 24 * 3600}
              recommitProcess={toggleCommitmentBox}
              // cmtData={commitmentsArr.find(
              //   (item) => item.status === "completed"
              // )}
              cmtData={commitmentsArr[0]}
            />
          )}

          {/* this is for recommitment */}
          {commitmentsArr.length > 1 &&
            commitmentsArr
              .slice(1)
              .map((el) => (
                <Recommitment
                  key={el.id}
                  loading={withdrawLoading}
                  onWithdraw={withDraw}
                  amount={el.original_amount}
                  countdown={7 * 24 * 3600}
                  recommitProcess={toggleCommitmentBox}
                  cmtData={el}
                />
              ))}

          {/* {commitmentsArr &&
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
            })} */}
          {!matchedData &&
            commitmentsArr &&
            commitmentsArr.length > 0 &&
            (() => {
              const el = commitmentsArr[0]; // get the first element
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
            })()}
          {matchedData && (
            <MatchedCommitment
              newCommitment={{
                amount: matchedData.matched_amount,
                orderId: matchedData.id,
              }}
              receiverId={matchedData.receiverId}
              handleViewReceiverDetails={handleViewReceiverDetails}
              handleConfirmPayment={handleConfirmPayment}
              status={matchedData.status}
              confirmed={matchedData.confirmed}
            />
          )}

          <ReceiverDetailsModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
            newCommitment={matchedData}
            receive_data={receive_data}
          />

          <UploadScreenshotModal
            show={pay}
            onClose={() => setPay(false)}
            userId={userId}
            upload={upload}
            matchedData={matchedData}
            uploadLoading={uploadLoading}
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
              loading={confirmReceiverLoading}
            />
          )}

          {!(receiverArr.length > 0) && rcv_detail && (
            <CommitmentSuccessfullCard
              giver_id={rcv_detail?.user_id}
              clicked={() => setOpenRcv(true)}
              newCommitment={{
                amount: rcv_detail.amount,
                orderId: rcv_detail.id,
              }}
              receiver_data={rcv_detail}
              
            />
          )}

          {receiverArr.length > 0 &&
            receiverArr.map((el, i) => {
              return (
                <CommitmentSuccessfullCard
                  giver_id={el.giver_id}
                  key={i}
                  clicked={() => {
                    console.log("clicked", el);
                    setRcvDetail({ ...el, success: true });
                    setOpenRcv(true);
                  }}
                  newCommitment={{
                    amount: el.matched_amount,
                    orderId: el.id,
                  }}
                  receiver_data={rcv_detail}
                />
              );
            })}
        </div>
      </div>

      <RightSideBar />
    </div>
  );
}
