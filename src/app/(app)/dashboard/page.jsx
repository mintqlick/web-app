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
import Link from "next/link";
import Image from "next/image";
import SenderModal from "@/components/sender-detail";

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
  const [openRcv, setOpenRcv] = useState(false);
  const [withdrawLoading, setWithDrawLoading] = useState(false);
  const [matchedData, setMatchedData] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [receiverArr, setReceiverArr] = useState([]); // To hold receiver data
  const [confirmReceiverLoading, setConfirmReceiverLoading] = useState(false);
  const [currentMatched, setCurrentMatched] = useState(null);
  const [withDrawCommitment, setWithDrawCommitment] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [activeCommitment, setActiveCommitment] = useState([]);
  const [mergedUser, setMergedUser] = useState(null);
  const [showMergedUser, setShowMergedUser] = useState(false);
  const [unMatchedReceiver, setUnMatched] = useState(null);

  const handleShowReceiverModal = (url) => {
    setScreenshotUrl(url);
    setShowReceiverModal(true);
  };

  const profit = amount ? (parseFloat(amount) * 0.45).toFixed(2) : "0.00";
  const totalReceive = amount
    ? (parseFloat(amount) + parseFloat(profit)).toFixed(2)
    : "0.00";

  const toggleCommitmentBox = () => {
    setShowCommitmentBox(!showCommitmentBox);
  };

  const handleCommit = async () => {
    if (!canCommit) {
      toast.warning("resolve all commitment to continue");
      return;
    }
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
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
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    const supabase = createClient();

    const { error: deleteErr } = await supabase
      .from("merge_givers")
      .delete()
      .eq("id", id);

    if (deleteErr) return;
    location.reload();

    // Later, you will write the real cancel logic here (like deleting the record from database)
  };

  const receiverDetailHelper = async (el) => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    const supabase = createClient();

    const {
      data: { receiver_id, matched_amount, id },
      error: giver_error,
    } = await supabase
      .from("merge_matches")
      .select("*")
      .eq("id", el?.id)
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

    const { name, phone, telegram } = profile_data;
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
      orderId: id,
      telegram,
    });
  };

  const handleViewReceiverDetails = async (el) => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    await receiverDetailHelper(el);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    setShowModal(false);
  };

  const upload = async (formdata) => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
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
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    if (!canWithdraw) {
      toast.warning("You are not eligible to withdraw at this time.");
      return;
    }
    setWithDrawLoading(true);
    const supabase = createClient();

    console.log(withDrawCommitment, "withDrawCommitment in withdraw");

    try {
      const res = await fetch("/api/join-receiver", {
        method: "POST",
        body: JSON.stringify({
          user_id: userId,
          id: withDrawCommitment.id, // the id of the commitment to withdraw
          amount: withDrawCommitment.original_amount * 1.45, // amount to withdraw
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

  const handleConfirmPayment = (el) => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    setPay(true);
    setCurrentMatched(el);
  };

  const confirmHandler = async (rcv_detailVal) => {
    if (blocked) {
      toast.warning(
        "⚠️ You've been blocked from giving or receiving due to not completing payment in 24hrs, contact support to resolve this issue"
      );
      return;
    }
    console.log(rcv_detailVal);
    setConfirmReceiverLoading(true);
    const response = await fetch("/api/confirm-receiver", {
      method: "POST",
      body: JSON.stringify({
        receiver_id: rcv_detailVal?.receiver_id,
        giver_id: rcv_detailVal?.giver_id,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.error || "Failed to confirm receiver");
      setConfirmReceiverLoading(false);
      return;
    }
    const result = await response.json();

    toast.success("Receiver confirmed successfully!");
    setOpenRcv(false);
    setConfirmReceiverLoading(false);
  };

  const fetchSenderDetail = async (el) => {
    const supabase = createClient();
    const {
      data: { user_id },
      error,
    } = await supabase
      .from("merge_givers")
      .select("*")
      .eq("id", el.giver_id)
      .single();
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("*")
      .eq("id", user_id)
      .single();

    setMergedUser({ ...user, amount: el.matched_amount, orderId: el.id });
    setShowMergedUser(true);
  };

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
          setBlocked(userData?.blocked);
          console.log(userData, "user Data");
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
        .eq("status", "waiting");

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
          .eq("confirmed", true)
          .neq("status", "completed")
          .single();

        // Log any error
        setRcvDetail(rcr);

        // Uncomment this if needed
        const {
          data: { receiver_id, giver_id, image_url },
          error: receiver_error,
        } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("receiver_id", rcr?.id)
          .neq("status", "completed")
          .single();
        console.log("Here");

        if (receiver_error) {
          alert("error", rcr_error.message);
          return;
        }
        console.log(receiver_id, giver_id, "Adempola");

        setScreenshotUrl(image_url);
        setReceiverId(receiver_id);

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
    // const fetchMergeMatches = async () => {
    //   if (commitmentsArr.length > 0) {
    //     const supabase = createClient();
    //     const firstCommitment = commitmentsArr[0];

    //     const { data, error } = await supabase
    //       .from("merge_matches")
    //       .select("*")
    //       .eq("giver_id", firstCommitment.id)
    //       .neq("status", "completed")
    //       .single();

    //     if (data) {
    //       setMatchedData(data);
    //     } else if (error) {
    //       console.error("Error fetching merge matches:", error);
    //     }
    //   }
    // };

    const fetchMergeMatches = async () => {
      const supabase = createClient();

      // Step 1: Get all confirmed and not completed givers for the user
      const { data: givers, error: giverError } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", userId)
        .eq("confirmed", true)
        .neq("status", "completed");

      if (!givers || givers.length === 0) {
        console.log("No eligible givers found.");
        return;
      }
      if (giverError) {
        console.error("Error fetching merge_givers:", giverError);
        return;
      }

      // Step 2: Fetch merge_matches for each giver
      const matchPromises = givers.map(async (giver) => {
        const { data: match, error: matchError } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("giver_id", giver.id)
          .eq("giver_checked", false)
          .single();

        if (matchError) {
          console.warn(`No match found for giver ID ${giver.id}`);
          return null;
        }
        if (!match) {
          console.warn(`No match found for giver ID ${giver.id}`);
          return null;
        }

        return match;
      });

      // Step 3: Wait for all matches to resolve
      const allMatches = await Promise.all(matchPromises);
      const validMatches = allMatches.filter(Boolean);

      setMatchedData(validMatches);
      // Optionally set state: setMatchedData(validMatches)
    };

    fetchMergeMatches();
  }, [userId]);

  useEffect(() => {
    const fetchDetail = async () => {
      // fetch data from merge_giver where the userId is userId and status is completed and condition is received
      const supabase = createClient();
      const { data, error } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "completed")
        .eq("received", false);

      if (!data || data.length === 0) {
        setCanWithdraw(false);
        setWithDrawCommitment(null);
        return;
      }

      if (error) {
        console.error("Error fetching merge_givers12:", error);
      }

      setCanWithdraw(data.length > 1);
      setWithDrawCommitment(data.length > 1 ? data[0] : null);
    };

    fetchDetail();
  }, [userId]);

  useEffect(() => {
    const excutioner = async () => {
      const supabase = createClient();
      const { data: giver_data, error: giver_error } = await supabase
        .from("merge_givers")
        .select("*")
        .eq("user_id", userId)
        .eq("received", false)
        .eq("status", "completed")
        .eq("matched", true);

      console.log(giver_error, "giver error");
      setActiveCommitment(giver_data);
      console.log(giver_data, "giver recommitment data");
    };
    if (userId) {
      excutioner();
    }
  }, [userId]);

  // fetch receiver matches
  useEffect(() => {
    const check_receiver = async () => {
      const supabase = createClient();

      try {
        const { data, error: receiverErr } = await supabase
          .from("merge_receivers")
          .select("*")
          .eq("user_id", userId)
          .neq("status", "completed")
          .eq("confirmed", true)
          .eq("touched", true)
          .single();

        // console.log(userId, error, data, "running");

        // const res = data.find((el) => el.status === "pending");
        // console.log(res);

        if (receiverErr) {
          console.log("Error fetching receiver data:", receiverErr);
          return; // Early return if there's an error fetching data
        }

        const { data: result, error: matcherr } = await supabase
          .from("merge_matches")
          .select("*")
          .eq("receiver_id", data.id)
          .neq("status", "completed");
        if (matcherr) {
          console.log(matcherr, ",err");
          return;
        }
        console.log(result, "result here");

        setReceiverArr(result);

        if (data) {
          setCanWithdraw(true);
        } else {
          setCanWithdraw(false); // In case there's no data
        }
      } catch (error) {}
    };

    if (userId) {
      check_receiver();
      // alert(userId)
    }
    // Only call if userId is available
  }, [userId]);

  useEffect(() => {
    const check_receiver = async () => {
      const supabase = createClient();

      try {
        const { data, error: receiverErr } = await supabase
          .from("merge_receivers")
          .select("*")
          .eq("user_id", userId)
          .eq("status", "waiting")
          .single();

        // console.log(userId, error, data, "running");

        // const res = data.find((el) => el.status === "pending");
        // console.log(res);
        if (receiverErr) {
          console.log("error occured", receiverErr);
          return;
        }
        setUnMatched(data);

        console.log(data, receiverErr, "here");
      } catch (error) {}
    };

    if (userId) {
      check_receiver();
      // alert(userId)
    }
    // Only call if userId is available
  }, [userId]);

  return (
    <div className="flex w-full h-full ">
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
                  <span>Add Contribution:</span>
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
          {!withDrawCommitment && activeCommitment.length > 0 && (
            <ActiveCommitment
              loading={withdrawLoading}
              onWithdraw={withDraw}
              // amount={
              //   commitmentsArr.find((item) => item.status === "completed")
              //     ?.original_amount
              // }
              amount={activeCommitment[0].original_amount}
              countdown={
                activeCommitment[1]?.eligible_as_receiver
                  ? activeCommitment[1]?.eligible_as_receiver
                  : 0
              }
              recommitProcess={toggleCommitmentBox}
              eligible={
                activeCommitment[1]?.eligible_time
                  ? new Date(activeCommitment[1]?.eligible_time)
                  : 0
              }
              // cmtData={commitmentsArr.find(
              //   (item) => item.status === "completed"
              // )}
              cmtData={activeCommitment[0]}
            />
          )}

          {withDrawCommitment && (
            <ActiveCommitment
              loading={withdrawLoading}
              onWithdraw={withDraw}
              amount={withDrawCommitment.original_amount}
              countdown={7 * 24 * 3600}
              recommitProcess={toggleCommitmentBox}
              isEligible={true}
              cmtData={withDrawCommitment}
            />
          )}

          {/* this is for recommitment */}
          {activeCommitment.length > 1 &&
            activeCommitment
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
          {matchedData.map((el) => {
            const cmtdetail = {
              amount: el.matched_amount,
              orderId: el.id,
              id: userId,
              expires_in: el.expires_in,
            };

            return (
              <>
                <MatchedCommitment
                  key={el.id}
                  newCommitment={cmtdetail}
                  receiverId={receiverId}
                  handleViewReceiverDetails={() =>
                    handleViewReceiverDetails(el)
                  }
                  handleConfirmPayment={() => handleConfirmPayment(el)}
                  confirmed={el.confirmed}
                  status={el.status}
                />
              </>
            );
          })}

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
            matchedData={currentMatched}
            uploadLoading={uploadLoading}
            onConfirm={() => setPay(false)}
          />

          <SenderModal
            showModal={showMergedUser}
            handleCloseModal={() => setShowMergedUser((prev) => false)}
            receive_data={mergedUser}
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
              screenshotUrl={screenshotUrl}
              matchedItem={rcv_detail}
              onConfirm={() => confirmHandler(rcv_detail)}
              onClose={() => setOpenRcv(false)}
              loading={confirmReceiverLoading}
            />
          )}
          {/* {console.log(receiverArr, rcv_detail)} */}
          {/* {unMatchedReceiver && (
            <CommitmentSuccessfullCard
              giver_id={null}
              clicked={() => {}}
              newCommitment={{
                amount: unMatchedReceiver.amount_remaining,
                orderId: unMatchedReceiver.id,
              }}
              receiver_data={rcv_detail}
            />
          )} */}

          {receiverArr.length > 0 &&
            receiverArr.map((el, i) => {
              console.log(el, "el");
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
                  matchedItem={el}
                  receiver_data={rcv_detail}
                  fetchSenderDetail={() => fetchSenderDetail(el)}
                  status={el.status}
                />
              );
            })}
        </div>
      </div>

      <RightSideBar />

      <div className="flex gap-4 fixed bottom-5 right-5">
        {[
          {
            src: "/images/telegram.png",
            alt: "LinkedIn",
            link: "https://t.me/nodalcircles",
          },
        ].map((icon, index) => (
          <div
            key={index}
            className="bg-[#1860d9] h-[50px] w-[50px] rounded-full flex justify-center items-center"
          >
            <Link href={icon.link}>
              <Image
                src={icon.src}
                alt={icon.alt}
                width={24}
                height={24}
                className="object-contain"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
