import Image from "next/image";
import React from "react";

const WhyChooseUs = () => {
  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto">
      <h2 className="text-3xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        Why choose <span className="text-[#1860d9]">MintQlick</span>
      </h2>
      <div className="flex flex-col lg:flex-row w-full h-full gap-6">
        {/* Left - Image Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-200 rounded-2xl p-6 flex-col">
          <div>
            <h3 className="text-5xl text-black flex items-center">Membership Fee For Sustainability</h3>
            <p className="mt-4 text-lg text-gray-400">
              A #2,500 activation fee ensures long-term platform stability,
              Keeping the system running efficiently for all users.
            </p>
          </div>
          <div>
            <Image
              src="/images/image2.png"
              alt="Hero"
              width={550}
              height={500}
              className="rounded-lg object-contain max-w-full h-auto"
            />
          </div>
        </div>
        {/* Right - Text Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-200 rounded-2xl p-6 flex-col">
          <div className="justify-center">
            <h3  className="text-5xl text-black flex gap-1 items-center">24/7 Support for Seamless communication</h3>
            <p className="mt-4 text-lg text-gray-400">
              Our dedicated support team is available around the clock to assist
              you with any questions or issues.
            </p>
          </div>
          <div>
            <Image
              src="/images/image2.png"
              alt="Hero"
              width={550}
              height={500}
              className="rounded-lg object-contain max-w-full h-auto"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center justify-center bg-gray-200 rounded-2xl p-6 mt-6">
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-1/2">
            <h3  className="text-5xl  text-black flex items-center">Guaranteed Payout</h3>
            <p className="mt-4 text-lg text-gray-400">
              Get merged to pay or received payments within 24-48 hours,
              ensuring a smooth an reliable transaction process.
            </p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/images/image2.png"
              alt="Hero"
              width={550}
              height={400}
              className="rounded-lg object-contain max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
