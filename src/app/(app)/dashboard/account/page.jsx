"use client";
import Box from "@/components/Box/Box";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Copy, Plus } from "lucide-react"; // ensure this is imported
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

const AccountPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    telegram: "",
    email: "",
    nick_name: "",
    gender: "",
    phone: "",
    wallets: [{ network: "", address: "" }], // changed to wallets array with network and address
    exchange: "",
    uid: "",
    country: "",
    timezone: "",
    language: "English",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [addressCount, setAddressCount] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw new Error(userError.message);

        if (user?.id) {
          setUserId(user.id);

          const { data: userData, error: userDataError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

          if (userDataError) throw new Error(userDataError.message);

          const { data: accountData, error: accountError } = await supabase
            .from("account")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

          if (accountError) throw new Error(accountError.message);

          setUserData({ ...userData, account: accountData });
          console.log("Fetched user data:", userData.name);
          console.log("Fetched account data:", accountData);
        }
      } catch (error) {
        console.error("Error fetching user or account data:", error.message);
        setError("Failed to fetch user or account data.");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      if (!userId) return;

      const supabase = createClient();
      try {
        const { data: user, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        const { data: account, error: accountError } = await supabase
          .from("account")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (userError || accountError) throw userError || accountError;

        // Parse wallets from stored network and address strings
        const wallets = [];
        if (account?.network && account?.address) {
          const networks = account.network.split(",");
          const addresses = account.address.split(",");
          setAddressCount(addresses.length);
          for (
            let i = 0;
            i < Math.max(networks.length, addresses.length);
            i++
          ) {
            wallets.push({
              network: networks[i] || "",
              address: addresses[i] || "",
            });
          }
        } else {
          wallets.push({ network: "", address: "" });
        }

        setFormData({
          name: user?.name || "",
          telegram: user?.telegram || "",
          email: user?.email || "",
          nick_name: user?.nick_name || "",
          gender: user?.gender || "",
          phone: user?.phone || "",
          country: user?.country || "",
          timezone: user?.timezone || "",
          language: user?.language || "English",
          wallets: wallets,
          exchange: account?.exchange || "",
          uid: account?.uid || "",
        });

        console.log("Form data populated successfully.");
      } catch (error) {
        console.error("Error fetching form data:", error.message);
        setError("Failed to fetch user form data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("wallet-network-")) {
      const index = parseInt(name.split("-")[2], 10);
      setFormData((prev) => {
        const newWallets = [...prev.wallets];
        newWallets[index] = { ...newWallets[index], network: value };
        return { ...prev, wallets: newWallets };
      });
    } else if (name.startsWith("wallet-address-")) {
      const index = parseInt(name.split("-")[2], 10);
      setFormData((prev) => {
        const newWallets = [...prev.wallets];
        newWallets[index] = { ...newWallets[index], address: value };
        return { ...prev, wallets: newWallets };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.wallets ||
      formData.wallets.length === 0 ||
      formData.wallets.some(
        (wallet) => wallet.network.trim() === "" || wallet.address.trim() === ""
      )
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase
        .from("account")
        .select("updated")
        .eq("user_id", userId)
        .single();

      if (data && data.updated) {
        toast.warning("not allowed");
        return;
      }

      const { error: userError } = await supabase.from("users").upsert(
        {
          id: userId, // ✅ FIXED HERE
          name: formData.name,
          email: formData.email,
          nick_name: formData.nick_name || null,
          gender: formData.gender || null,
          country: formData.country || null,
          timezone: formData.timezone || null,
          language: formData.language || null,
          phone: formData.phone || null,
          telegram: formData.telegram || null,
        },
        { onConflict: ["id"] }
      );

      const { error: accountError } = await supabase.from("account").upsert(
        {
          user_id: userId,
          updated: true,
          network: formData.wallets.map((w) => w.network).join(","), // join networks array to string
          address: formData.wallets.map((w) => w.address).join(","), // join addresses array to string
          exchange: formData.exchange || null,
          uid: formData.uid || null,
        },
        { onConflict: ["user_id"] }
      );

      if (userError || accountError) throw userError || accountError;

      setSuccess("User updated successfully!");
    } catch (err) {
      
      setError("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <Box
          variant="card"
          className="bg-[#EDF2FC]"
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between h-full w-full">
            {/* Left section: User Info */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* User Icon */}
              <div className="w-20 h-20 md:w-16 md:h-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl md:text-2xl font-bold text-white">
                  {userData?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "?"}
                </span>
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                <h2 className="text-lg font-bold">
                  {userData?.name || "Loading..."}
                </h2>
                <p className="text-sm text-gray-600">
                  Contribution ID: {userData?.id || "N/A"}
                </p>
              </div>
            </div>

            {/* Right section: Save Changes button */}
            <div className="mt-4 md:mt-0">
              <button
                type="submit"
                className="bg-[#1860d9] text-white text-lg rounded-2xl px-6 py-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Box>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">{success}</p>}
        <Box
          variant="card"
          className="bg-[#EDF2FC]"
          style={{
            width: "100%",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col h-full w-full">
            <h2 className="text-[25px] font-bold mb-4 text-left">
              Personal Information
            </h2>

            {/* Form Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Full Name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
              </div>

              {/* Nick Name */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Nick Name</label>
                <input
                  type="text"
                  name="nick_name"
                  value={formData.nick_name}
                  onChange={handleChange}
                  className="bg-white border-gray-300 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
              </div>

              {/* Gender */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="bg-white border-gray-300 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Country */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="bg-white border-gray-300 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                >
                  <option value="">Select Country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Estonia">Estonia</option>
                </select>
              </div>

              {/* Time Zone */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Time Zone</label>
                <select
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="bg-white border-gray-300 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                >
                  <option value="">Select Time Zone</option>
                  <option value="PST">PST</option>
                  <option value="GMT">GMT</option>
                  <option value="CET">CET</option>
                  <option value="EST">EST</option>
                </select>
              </div>

              {/* Language */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Language</label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="bg-white border-gray-300 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>
          </div>
        </Box>
        <Box
          variant="card"
          className="bg-[#EDF2FC]"
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col h-full w-full">
            <h2 className="text-[25px] font-bold mb-4 text-left">
              Contact Information
            </h2>

            {/* Form Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
              </div>

              {/* Telegram Username/Link */}
              <div className="flex flex-col">
                <label className="text-sm text-gray-600">
                  Telegram Username/Link
                </label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
              </div>
            </div>
          </div>
        </Box>

        <Box
          variant="card"
          className="bg-[#EDF2FC]"
          style={{
            width: "100%",
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex flex-col h-full w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[25px] font-bold text-left">
                Wallets Details
              </h2>
              <button
                type="button"
                className="bg-[#1860d9] text-white rounded-full p-2 hover:bg-blue-700"
                onClick={() => {
                  setAddressCount((prev) => prev + 1);
                  if (addressCount > 2) {
                    toast.warning("maximum of 3 addresses");
                    return;
                  }
                  setFormData((prev) => ({
                    ...prev,
                    wallets: [...prev.wallets, { network: "", address: "" }],
                  }));
                }}
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="flex flex-wrap w-full gap-4 mb-4">
              {formData.wallets.map((wallet, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col w-full lg:w-[40%]">
                    <label className="text-sm text-gray-600">
                      Crypto Network
                    </label>
                    <select
                      name={`wallet-network-${index}`}
                      value={wallet.network}
                      onChange={handleChange}
                      className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                    >
                      <option value="">Select Crypto Network</option>
                      <option value="TRC-20">TRC-20</option>
                      <option value="TON">TON</option>
                      <option value="APTOS">APTOS</option>
                      <option value="BEP 20">BEP 20</option>
                    </select>
                  </div>
                  <div className="flex flex-col w-full lg:w-[58%] relative mb-4">
                    <label className="text-sm text-gray-600">
                      Wallet Address {index + 1}
                    </label>
                    <input
                      type="text"
                      name={`wallet-address-${index}`}
                      value={wallet.address}
                      onChange={handleChange}
                      className="w-full bg-white border-gray-300 text-gray-500 border p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(wallet.address);
                        alert("Wallet Address copied!");
                      }}
                      className="absolute right-2 top-8 text-[#1860d9]"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="flex flex-wrap w-full gap-4">
              <div className="flex flex-col w-full lg:w-[40%]">
                <label className="text-sm text-gray-600">
                  Exchange User ID
                </label>
                <select
                  name="exchange"
                  value={formData.exchange}
                  onChange={handleChange}
                  className="bg-white border-gray-300 text-gray-500 border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                >
                  <option value="">Select Exchange</option>
                  <option value="Binance">Binance</option>
                  <option value="Bybit">Bybit</option>
                  <option value="KuCoin">KuCoin</option>
                </select>
              </div>

              <div className="flex flex-col w-full lg:w-[58%] relative">
                <label className="text-sm text-gray-600">Enter UID</label>
                <input
                  type="text"
                  name="uid"
                  value={formData.uid}
                  onChange={handleChange}
                  className="w-full bg-white border-gray-300 border p-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1860d9]"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formData.uid);
                    alert("UID copied!");
                  }}
                  className="absolute right-2 top-8 text-[#1860d9]"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>
        </Box>
      </form>
    </div>
  );
};

export default AccountPage;
