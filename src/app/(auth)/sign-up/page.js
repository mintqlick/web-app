"use client";

import SignUpForm from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function AuthPage() {
  const appleClicked = async () => {
    console.log("Ademola");
  };

  const [isChecked, setIsChecked] = useState(false);

  const NEXT_PUBLIC_APP_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://mintqlick.vercel.app";

  const googleClicked = async () => {
    const supabase = createClient();
    const result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${NEXT_PUBLIC_APP_URL}/dashboard`,
      },
    });
    if (result.error) {
    }
    window.location.href = result.data.url;
  };
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
          <SignUpForm checked={isChecked} />
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>
          <div className="flex justify-between">
            <Button
              onClick={googleClicked}
              className={
                "w-5/12 rounded-3xl bg-white cursor-pointer text-black border-gray-400 border-1 hover:bg-white"
              }
            >
              Google
            </Button>
            <Button
              onClick={appleClicked}
              className={
                "w-5/12 rounded-3xl cursor-pointer bg-white text-black border-gray-400 border-1 hover:bg-white"
              }
            >
              Apple
            </Button>
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
          <span className="text-primary  inline cursor-pointer mx-1.5 ">
            Privacy Policy
          </span>
          and
          <span className="text-primary inline cursor-pointer ml-1.5">
            Terms of Service.
          </span>
        </div>
      </div>
    </div>
  );
}
