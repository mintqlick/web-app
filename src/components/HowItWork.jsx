import React from "react";
import Image from "next/image";

const HowItWork = () => {
  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        How <span className="text-[#1860d9]">NodalCircle</span> Operates?
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-full gap-6">
        {/* Left - Image Section */}
        <div className="w-full lg:w-1/2 flex items-start bg-gray-200 rounded-2xl p-6 flex-col">
          <div className="mb-4">
            <div className="bg-[#1860d9] h-[80px] w-[80px] rounded-full flex justify-center items-center mx-auto lg:mx-0">
              <Image
                src="/images/encrypted.svg"
                alt="encrypted"
                width={60}
                height={60}
                className="object-contain max-w-full"
              />
            </div>
          </div>
          <h3 className="text-xl md:text-3xl lg:text-5xl text-black">
          Participants receive up to 45% in redistributed support through our structured peer-to-peer system.
          </h3>
          <p className="mt-4 text-base md:text-lg text-gray-400">
          Your first payout is processed 7 days after your first commitment
          </p>
        </div>
        
        {/* Right - Text Section */}
        <div className="w-full lg:w-1/2 flex items-start bg-gray-200 rounded-2xl p-6 flex-col">
          <div className="mb-4">
            <div className="bg-[#1860d9] h-[80px] w-[80px] rounded-full flex justify-center items-center mx-auto lg:mx-0">
              <Image
                src="/images/encrypted.svg"
                alt="encrypted"
                width={60}
                height={60}
                className="object-contain max-w-full"
              />
            </div>
          </div>
          <div className="justify-start">
            <h3 className="text-xl md:text-3xl lg:text-5xl text-black">
              Participants are matched to and receive funds seamlessly, with payouts processed within 24-48 hours once due.
            </h3>
            <p className="mt-4 text-base md:text-lg text-gray-400">
              To keep earning, users reinvest after each cycle, ensuring continuous returns and platform sustainability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWork;
