import React from "react";
import Image from "next/image";
import { RiArrowUpSFill } from "react-icons/ri";

const HeroSection = () => {
  return (
    <div className="w-full min-h-[400px] max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto">
      <div className="flex flex-col lg:flex-row w-full h-auto">
        {/* Left - Image Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
          <Image
            src="/images/heroImage.svg"
            alt="Hero"
            width={550}
            height={500}
            className="rounded-lg object-contain max-w-full h-auto"
          />
        </div>
        {/* Right - Text Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-6xl font-bold text-gray-800">
              A Smarter,
              <span className="hidden md:inline">
                <br />
              </span>{" "}
              Sustainable Way to Grow your Wealth.
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Designed for longevity, our system offers predictable returns and
              a strong foundation of financial success.
            </p>

            <div className="flex flex-row gap-4 mt-8">
              <button className="px-4 py-2 w-[150px] h-[50px] text-[16px] bg-[#1860d9] text-white rounded-full">
                Open Account
              </button>
              <button className="px-4 py-2 w-[150px] h-[50px] text-[16px] border border-gray-800 rounded-full hover:bg-gray-100">
                Login
              </button>
            </div>

            {/* Images and Text Section */}
            <div className="flex flex-row gap-2 mt-8 justify-baseline items-center">
              {/* Images Section */}
              <div className="flex w-1/2">
                <Image
                  src="/images/Ellipse14.svg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-lg object-contain max-w-full h-auto"
                />
                <Image
                  src="/images/Ellipse15.svg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="-ml-3 rounded-lg object-contain max-w-full h-auto"
                />
                <Image
                  src="/images/Ellipse16.svg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="-ml-3 rounded-lg object-contain max-w-full h-auto"
                />
              </div>
              {/* Text Section */}
              <div className="w-1/2">
                <h2 className="text-3xl text-black flex items-center">
                  <RiArrowUpSFill className="mr-2" /> 15 Million+
                </h2>
                <p className="mt-4 text-2xl text-gray-400">
                  Trusted by millions of satisfied users, our financial services
                  have made a real impact on people's lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
