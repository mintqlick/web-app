import React from "react";

export default function ReceiverConfirmationModal({
  show,
  onClose,
  screenshotUrl,
  userId,
  loading,
  onConfirm,
}) {
  if (!show) return null;
  {
    screenshotUrl;
  }
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirm Receipt</h2>
        <p className="mb-2">User ID: {userId}</p>
        {screenshotUrl && (
          <img
            src={screenshotUrl}
            alt="Proof of Payment"
            className="mb-4 rounded max-h-64 object-contain"
          />
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!screenshotUrl|loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm Received
          </button>
        </div>
      </div>
    </div>
  );
}
