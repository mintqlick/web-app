"use client";

import React, { useEffect, useState } from "react";
import Box from "@/components/Box/Box";
import DashboardHeader from "@/components/DashboardHeader";
import Sidebar from "@/components/SideBar";
import { createClient } from "@/utils/supabase/client";
import Linkify from "linkify-react";

const DashboardLayout = ({ children }) => {
  const supabase = createClient();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setNotifications(data);
      } else {
        console.error("Error fetching notifications:", error.message);
      }
    };

    fetchNotifications();
  }, []);

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const linkifyOptions = {
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-blue-700 underline hover:text-blue-900 break-words",
  };

  return (
    <Box style={{ position: "relative", width: "100vw" }}>
      {/* Notification Banner */}
      {notifications.length > 0 && (
        <div className="fixed top-[10%] z-80 w-[90%] lg:w-full px-3 md:px-6 space-y-2">
          {notifications.map((note) => (
            <div
              key={note.id}
              className="relative bg-blue-100 border border-blue-300 text-blue-800 rounded-md p-4 shadow-md flex flex-col gap-1"
            >
              <button
                onClick={() => dismissNotification(note.id)}
                className="absolute top-2 right-3 text-blue-600 hover:text-red-600 text-xl font-bold"
              >
                ×
              </button>
              <p className="font-semibold text-base sm:text-lg">
                {note.title}
              </p>
              <Linkify options={linkifyOptions}>
                {note.message}
              </Linkify>
            </div>
          ))}
        </div>
      )}

      {/* Main Dashboard Content */}
      <DashboardHeader />
      <div className="flex">
        <Sidebar />
        <main className="main-content w-full mt-[90px] flex-1 lg:p-6 bg-white">
          {children}
        </main>
      </div>
    </Box>
  );
};

export default DashboardLayout;
