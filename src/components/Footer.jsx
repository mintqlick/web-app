"use client";

import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="w-full h-auto max-w-7xl overflow-hidden mt-[128px] mx-auto px-4">
      {/* Heading */}
      <h2 className="text-3xl lg:text-6xl font-bold text-gray-800 text-center mb-8">
        Invest Smart. <span className="text-[#1860d9]">Archieve More.</span>
      </h2>

      {/* Background Container */}
      <div className="w-full bg-gray-200 rounded-2xl p-6">
        {/* Newsletter CTA */}
        <div className="w-full flex justify-center">
          <div className="w-full flex flex-col gap-6">
            {/* Mail Icon at the top left */}
            <div className="flex justify-start">
              <div className="bg-[#1860d9] h-[100px] w-[100px] rounded-full flex justify-center items-center">
                <Image
                  src="/images/mail-02.svg"
                  alt="newsletter"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom Section with Text (left) and Form (right) */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 w-full">
              {/* Left - Text Content */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-2xl lg:text-5xl  text-black">
                  Keep up with the latest
                </h3>
                <p className="mt-2 text-gray-600 text-base lg:text-lg">
                  Join our newsletter to stay up to date on features and
                  releases.
                </p>
              </div>

              {/* Right - Newsletter Form */}
              <div className="w-full lg:w-1/2">
                <h3 className="text-[#1860d9] mb-2">Stay up to date</h3>
                <form className="flex flex-col lg:flex-row items-center gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 p-4 rounded-2xl border bg-white w-[300px]"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1860d9] text-white rounded-full hover:bg-blue-700 transition w-full lg:w-auto"
                  >
                    Subscribe
                  </button>
                </form>
                <p className="mt-4 text-sm text-gray-500 text-center lg:text-left">
                  By subscribing, you agree to our{" "}
                  <span className="text-[#1860d9] underline cursor-pointer">
                    Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="bg-[#1860d9] h-[2px] mt-12" />

        {/* Footer Bottom */}
        <div className="w-full flex flex-col gap-6 mt-8">
          {/* Logo on Top Left */}
          <div className="flex justify-start">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Bottom Row: Copyright (Left) and Social Icons (Right) */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 w-full">
            {/* Left - Copyright */}
            <p className=" text-[#1860d9] text-sm lg:text-base">
              © 2025 MintQlick. All rights reserved.
            </p>

            {/* Right - Social Icons */}
            <div className="flex gap-4">
              {[
                { src: "/images/instagram.svg", alt: "Instagram" },
                { src: "/images/Facebook.svg", alt: "Facebook" },
                { src: "/images/Twitter.svg", alt: "Twitter" },
                { src: "/images/Linkedin.svg", alt: "LinkedIn" },
              ].map((icon, index) => (
                <div
                  key={index}
                  className="bg-[#1860d9] h-[50px] w-[50px] rounded-full flex justify-center items-center"
                >
                  <Image
                    src={icon.src}
                    alt={icon.alt}
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
