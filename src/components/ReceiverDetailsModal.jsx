// ReceiverDetailsModal.js
import React from "react";

const ReceiverDetailsModal = ({
  showModal,
  handleCloseModal,
  receive_data,
}) => {
  if (!showModal) return null;
  console.log(
    "Receiver Details:",
    receive_data?.network,
    receive_data?.address
  );

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
          Receiver Details
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Receiver Name:</p>
            <p className="text-gray-800 font-semibold">{receive_data.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Phone Number:</p>
            <p className="text-gray-800 font-semibold">{receive_data.phone}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Bank Account(s):</p>
            <p className="text-gray-800 font-semibold">
              {receive_data?.network.map((item) => (
                <p>{item.address}  {item.network}</p>
              ))}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Amount to Pay:</p>
            <p className="text-blue-600 font-bold">
              {receive_data.amount} USDT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDetailsModal;
