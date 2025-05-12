"use client";

import SignUpForm from "@/components/auth/sign-up-form";
import Spinner from "@/components/auth/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/super-base-client";
import Link from "next/link";

import { Suspense, useState } from "react";

export default function AuthPage() {
  const appleClicked = async () => {
    console.log("Ademola");
  };

  const [isChecked, setIsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const NEXT_PUBLIC_APP_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://www.nodalcircles.com";

  const checked = (e) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className=" lg:block w-11/12 text-right h-auto txet-sm lg:text-base">
        <span className="mr-1 lg:mr-1 text-[12px]">
          Already have an account?
        </span>
        <span className="ml-0 lg:ml-1 text-primary cursor-pointer font-bold text-[12px]">
          <Link href={"/sign-in"}>Sign In</Link>
        </span>
      </div>
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 lg:w-5/12 max-w-2xl flex flex-col">
          <div className="font-bold text-4xl mb-6 lg:my-3">Sign Up</div>

          <Suspense fallback={<Spinner />}>
            <SignUpForm checked={isChecked} />
          </Suspense>
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="text-center mt-4 flex items-center gap-2">
            <span>
              <Input type={"checkbox"} onChange={checked} />
            </span>
            <span className="text-left text-sm text-gray-400 leading-4">
              By clicking Create account, I agree that I have read and accepted
              the Terms of Use and Privacy Policy.
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-auto mb-3.5 landscape:my-4 lg:landscape:mb-3.5 text-sm flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 text-center lg:text-left lg:w-5/12 text-gray-400">
          Protected by reCAPTCHA and subject to the Prism
          <span
            className="text-[#1860d9] underline cursor-pointer"
            onClick={() => setShowPrivacyModal(true)}
          >
            Privacy Policy
          </span>
          and
          <span
            className="text-[#1860d9] underline cursor-pointer"
            onClick={() => setShowTermsModal(true)}
          >
            Terms and Conditions
          </span>{" "}
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
}

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
