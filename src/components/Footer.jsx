"use client";

import React, { useState } from "react";
import Image from "next/image";

const TermsAndConditionsModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
        aria-label="Close Terms and Conditions"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
      <p className="text-gray-700 whitespace-pre-line flex-grow overflow-auto">
        1. Overview <br />
        NodalCircle is a decentralized, peer-to-peer (P2P) cryptocurrency-based
        contribution platform. It facilitates community-driven support cycles
        without offering financial advice, guaranteed outcomes, or custody of
        funds. NodalCircle is not a bank, investment firm, or financial product
        provider. Participation is voluntary and intended solely for individuals
        seeking to engage in cyclical digital support. <br />
        <br />
        2. Eligibility <br />
        Participants from the following regions are strictly prohibited from
        using NodalCircle: United States, United Kingdom, Canada, Australia,
        European Union member states, Singapore, South Korea, China, Russia,
        Belarus, Iran, North Korea, Syria, Cuba, Ukraine, Israel, Japan, India,
        United Arab Emirates (UAE), Turkey, Brazil, New Zealand, South Africa,
        Afghanistan, and any region listed under OFAC or similar international
        sanctions. Users located in or acting on behalf of individuals or
        entities in these jurisdictions are strictly prohibited from
        participating. Attempts to bypass restrictions through VPNs, proxies, or
        false declarations will result in access termination without notice.{" "}
        <br /> <br />
        3. Restricted Jurisdictions
        <br /> NodalCircle restricts access from countries and jurisdictions
        with regulatory frameworks that prohibit or conflict with decentralized
        digital contribution platforms. Users located in or acting on behalf of
        individuals or entities in the following locations may not participate:
        United States, Canada, United Kingdom, European Union member states,
        Australia, Singapore, China, South Korea, Iran, North Korea, Syria,
        Russia, Belarus, and any region listed under OFAC sanctions or related
        international blacklists. Attempts to bypass these restrictions may
        result in immediate suspension of access or loss of eligibility. <br />{" "}
        <br />
        4. Participation & Contribution Cycle <br /> Participation in
        NodalCircle involves voluntarily contributing digital assets (currently
        supported: USDT-TRC20/BEP20) to another participant in the network. Upon
        completion of a cycle, users may become eligible to receive support from
        others in the system. Cycle progression depends on overall user
        participation, recommitment activity, and availability of contributors.
        <br />
        <br />
        5. Activation & Recommitment <br />
        All users are required to pay a one-time activation fee upon joining.
        This fee is utilized to facilitate access and maintain platform
        operations. Following every completed contribution cycle, participants
        must recommit by contributing an equal amount to re-enter the system.
        Recommitment is mandatory for continued participation and to maintain
        eligibility for future cycles. <br />
        <br />
        6. Matching & Contribution Logic <br /> When a participant enters the
        system, they are placed in a queue to be paired with another participant
        for contribution. The system automatically handles pairing based on
        internal logic designed to ensure fairness and flow. Participants who do
        not complete assigned contributions within the expected system timeframe
        may be removed from the cycle or reassigned. NodalCircle makes no
        promises regarding specific timing or speed of support receipt. All
        merges and contributions occur directly between users in a peer-to-peer
        format. <br /> <br />
        7. Platform Integrity <br />
        To ensure the integrity and stability of NodalCircle, participants are
        expected to act honestly, follow community rules, and avoid engaging in
        manipulation or abuse of the cycle system. Behavior such as duplicate
        accounts, fraudulent wallets, circumvention of contribution logic, or
        any action deemed harmful to the platform or other users may result in
        removal or permanent suspension. <br />
        <br /> 8. User Responsibility <br />
        You understand and agree that NodalCircle does not guarantee outcomes,
        manage individual contributions, or promise receipt of support. All
        actions taken through the platform are voluntary, and users assume full
        responsibility for their participation, including any potential delays,
        unresponsive contributors, or incomplete cycles. <br /> <br />
        9. No Financial Claims or Guarantees <br /> NodalCircle is not intended
        as an income opportunity or investment program. The platform does not
        guarantee profits, returns, or earnings of any kind. Use of phrases such
        as &rsquo;earnings&rsquo;, &rsquo;profits&rsquo;,
        &rsquo;interest&rsquo;, or &rsquo;returns&rsquo; in relation to this
        platform by users or affiliates is strictly prohibited and not endorsed
        by NodalCircle. Participation should be understood as a cyclical
        contribution model between consenting individuals. <br /> <br />
        10. Limitation of Liability <br /> NodalCircle, its creators, community
        managers, or affiliates are not liable for any loss, damage, delay, or
        disruption experienced by participants, including but not limited to
        financial loss, emotional distress, or indirect damages resulting from
        use of the platform. Use of the system is at your own discretion and
        risk. <br />
        <br /> 11. Changes to These Terms <br /> These Terms and Conditions are
        subject to change at any time, without prior notice. Users are
        responsible for reviewing the latest version of the Terms before
        continuing use. By continuing to access NodalCircle, you accept the
        updated Terms and acknowledge your continued compliance.
      </p>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-[#1860d9] text-white hover:bg-blue-700 transition"
        >
          Agree
        </button>
      </div>
    </div>
  </div>
);

const PrivacyPolicyModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6 relative flex flex-col">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
        aria-label="Close Privacy Policy"
      >
        &times;
      </button>
      <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
      <p className="text-gray-700 whitespace-pre-line flex-grow overflow-auto">
        Effective Date: April 2025 <br />
        <br />
        NodalCircle is committed to safeguarding your privacy and anonymity. As
        a decentralized, peer-to-peer contribution platform, we operate without
        collecting identifiable user data. This Privacy Policy explains what
        limited information may be used to facilitate the platform and how we
        maintain your privacy throughout your participation. <br /> <br />
        1. No Personal Data Collection <br />
        NodalCircle does not collect, request, or require personal data. This
        includes but is not limited to: - Full names, phone numbers, or
        addresses - Government-issued identification documents - Email addresses
        or biometric data - Social media accounts or real-world profiles The
        platform is designed to function without tying activity to real-world
        identities. <br />
        <br />
        2. Cryptocurrency Wallets <br />
        Participation on NodalCircle requires a cryptocurrency wallet address
        (TRC20 or BEP20 USDT). These addresses are used solely for peer-to-peer
        contribution purposes and are never linked to your identity. We do not
        store private keys or have access to wallet funds. <br />
        <br /> 3. Temporary Operational Data To maintain platform cycles, <br />{" "}
        the system may temporarily handle: <br /> - Contribution timing and
        merge status <br /> - Recommitment history <br /> - Participation cycles{" "}
        <br />
        This data is used to maintain system logic only and is never analyzed or
        sold. No personal identifiers are ever collected or stored with this
        information. <br />
        <br /> 4. No Cookies or Trackers NodalCircle does not use cookies,
        device tracking, analytics, or hidden scripts to monitor user behavior.
        We do not log IP addresses, browser sessions, or location data. Your use
        of the platform is not tracked across sessions or devices. <br />
        <br />
        5. Third-Party Services <br /> We avoid integrating external services
        that require or track user identities. There are no embedded marketing
        tools, no external logins, and no third-party data processors. All
        system logic is kept internal and anonymized by design. <br />
        <br />
        6. Your Responsibility <br /> We strongly advise participants to take
        steps to protect their own anonymity: <br />- Use wallets not connected
        to KYC exchanges <br /> - Avoid accessing the platform through
        identifiable devices or accounts <br />
        - Refrain from disclosing personal information during interactions Your
        privacy begins with the tools and habits you choose. <br />
        <br />
        7. Legal Limitations <br /> As an anonymous and decentralized platform,
        we are unable to disclose, share, or verify user identity under any
        circumstance. We do not comply with requests for user data that we do
        not possess. Participation is entirely at your own discretion and risk.{" "}
        <br />
        <br /> 8. Changes to this Policy <br />
        This Privacy Policy may be updated periodically. Changes will be made
        with the intention of strengthening user privacy. Continued use of the
        platform after updates indicates acceptance of the revised policy.{" "}
        <br />
        <br />
        9. Contact Support brinquiries can be directed through the appropriate
        section of the platform interface. Due to the nature of the system,
        traditional support channels such as email or phone are not provided.
        Users are encouraged to consult available resources and updates shared
        through the platform environment.
      </p>
      <div className="mt-4 flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-full bg-[#1860d9] text-white hover:bg-blue-700 transition"
        >
          Agree
        </button>
      </div>
    </div>
  </div>
);

const Footer = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
                  <span
                    className="text-[#1860d9] underline cursor-pointer"
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </span>{" "}
                  and{" "}
                  <span
                    className="text-[#1860d9] underline cursor-pointer"
                    onClick={() => setShowPrivacyModal(true)}
                  >
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
              src="/images/logo31.png"
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
              © 2025 NodalCircle. All rights reserved.
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

      {showTermsModal && (
        <TermsAndConditionsModal onClose={() => setShowTermsModal(false)} />
      )}
      {showPrivacyModal && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyModal(false)} />
      )}
    </div>
  );
};

export default Footer;
