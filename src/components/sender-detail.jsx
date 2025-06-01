// SenderModal.js
import React from "react";

const SenderModal = ({ showModal, handleCloseModal, receive_data }) => {
  if (!showModal) return null;
  console.log("Receiver Details:", receive_data);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={handleCloseModal}
        >
          ❌
        </button>
        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Sender&apos;s Details
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Contribution ID:</p>
            <p className="text-gray-800 font-semibold">
              {receive_data?.id.split("-")[0] || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">User Name:</p>
            <p className="text-gray-800 font-semibold">{receive_data?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Order ID:</p>
            <p className="text-gray-800 font-semibold">
              #{receive_data?.orderId.split("-")[0] || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Amount to be Paid</p>
            <p className="text-gray-800 font-semibold">
              {receive_data?.amount || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone Number</p>
            <p className="text-blue-600 font-bold">
              {receive_data?.phone || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Telegram ID</p>
            <p className="text-blue-600 font-bold">
              @{receive_data?.telegram || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenderModal;
