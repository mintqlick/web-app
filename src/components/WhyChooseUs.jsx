import Image from "next/image";
import React from "react";

const WhyChooseUs = () => {
  return (
    <div className="w-full h-auto max-w-7xl bg-white overflow-hidden mt-[128px] mx-auto px-4">
      <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        Why choose <span className="text-[#1860d9]">MintQlick</span>
      </h2>

      {/* Section 1 */}
      <div className="flex flex-col lg:flex-row w-full h-full gap-8 mb-6">
        {/* Left - Text + Image */}
        <div className="w-full lg:w-1/2 bg-gray-200 rounded-2xl p-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
          <h3 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-black">
            Membership Fee For Sustainability
          </h3>
          <p className="text-base md:text-lg text-gray-600 max-w-xl">
            A #2,500 activation fee ensures long-term platform stability,
            keeping the system running efficiently for all users.
          </p>
          <Image
            src="/images/edd.png"
            alt="Membership"
            width={550}
            height={500}
            className="rounded-lg object-contain max-w-full h-auto"
          />
        </div>

        {/* Right - Text + Image */}
        <div className="w-full lg:w-1/2 bg-gray-200 rounded-2xl p-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
          <h3 className="text-2xl md:text-3xl lg:text-5xl font-semibold text-black">
            24/7 Support for Seamless Communication
          </h3>
          <p className="text-base md:text-lg text-gray-600 max-w-xl">
            Our dedicated support team is available around the clock to assist
            you with any questions or issues.
          </p>
          <Image
            src="/images/support.jpg"
            alt="Support"
            width={550}
            height={500}
            className="rounded-lg object-contain max-w-full h-auto"
          />
        </div>
      </div>

      {/* Section 2 */}
      <div className="w-full flex items-center justify-center bg-gray-200 rounded-2xl p-6 mt-6">
        <div className="flex flex-col lg:flex-row w-full gap-6">
          {/* Left - Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-black">
              Guaranteed Payout
            </h3>
            <p className="mt-4 text-base md:text-lg text-gray-600">
            Get responsive assistance at any time. Our team ensures your contribution journey remains smooth and stress-free.
            </p>
          </div>

          {/* Right - Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/images/guaranteed_payout.jpg"
              alt="Guaranteed Payout"
              width={550}
              height={500} // Reduced image height
              className="rounded-lg object-contain max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
