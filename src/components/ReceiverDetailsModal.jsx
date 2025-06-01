// ReceiverDetailsModal.js
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ReceiverDetailsModal = ({
  showModal,
  handleCloseModal,
  receive_data,
}) => {
  if (!showModal) return null;
  const [show, setShow] = useState(false);

  const clicked = (val) => {
    navigator.clipboard.write(val).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-md relative">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={handleCloseModal}
        >
          ❌
        </button>
        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Receiver&apos;s Details
        </h2>
        <div className="space-y-3">
          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Contribution Id:</p>
            <p className="text-gray-800 font-semibold">#123444r34</p>
          </div>
          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">User Name:</p>
            <p className="text-gray-800 font-semibold">{receive_data.name}</p>
          </div>
          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Order ID#:</p>
            <p className="text-gray-800 font-semibold">
              #{receive_data?.orderId.split("-")[0]}
            </p>
          </div>

          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Amount to pay:</p>
            <p className="text-gray-800 font-semibold">
              {receive_data?.amount}
            </p>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-gray-500 text-sm flex">Wallet network:</p>
            {show ? (
              <ChevronDown
                size={15}
                className="text-gray-500"
                onClick={() => setShow((prev) => !prev)}
              />
            ) : (
              <ChevronUp
                size={15}
                className="text-gray-500"
                onClick={() => setShow((prev) => !prev)}
              />
            )}
          </div>
          {show && (
            <Accordion type="single" collapsible className="w-full">
              {receive_data?.network.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="flex justify-between text-left">
                    <span className="font-medium">{item.network}</span>
                  </AccordionTrigger>
                  <AccordionContent className="flex justify-between items-center">
                    <p className="break-all text-sm lg:text-lg">
                      {item.address}
                    </p>
                    <Copy
                      className="ml-2 w-4 h-4 cursor-pointer"
                      onClick={() => clicked(item.address)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Phone Number</p>
            <p className="text-blue-600 font-bold">{receive_data?.phone}</p>
          </div>

          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Telegram ID</p>
            <p className="text-blue-600 font-bold">@{receive_data?.telegram}</p>
          </div>
          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">Exchange</p>
            <p className="text-blue-600 font-bold">{receive_data?.exchange}</p>
          </div>
          <div className="lg:flex w-full justify-between">
            <p className="text-gray-500 text-sm">UUID</p>
            <p className="text-blue-600 font-bold">{receive_data?.uid}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiverDetailsModal;
