"use client";
import { AlertTriangle } from "lucide-react";

const SuspendedNotice = ({ payLevy }) => {
  return (
    <div className=" flex items-center justify-center bg-red-50 px-4 py-12">
      <div className="bg-white max-w-md w-full shadow-xl rounded-2xl p-8 text-center border border-red-200">
        <div className="flex justify-center mb-4 text-red-600">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Account Suspended
        </h2>
        <p className="text-gray-600 mb-6">
          Your account has been temporarily suspended because you have not paid
          your community levy.
        </p>
        <p className="text-gray-700 font-medium">
          Please complete your payment to regain access.
        </p>
        {/* Optional Pay Button */}
        <button
          onClick={payLevy}
          className="mt-6 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
        >
          Pay Community Levy
        </button>
      </div>
    </div>
  );
};

export default SuspendedNotice;
