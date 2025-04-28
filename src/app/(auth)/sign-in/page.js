"use client";

import AuthComponent from "@/components/auth/sign-in-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/super-base-client";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import Spinner from "@/components/auth/spinner";

export default function AuthPage() {
 
  const router = useRouter();
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

  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className=" lg:block w-11/12 text-right h-auto  lg:text-base">
        <span className="mr-1 lg:mr-1 text-[12px]">
          Don&apos;t have an account?
        </span>
        <span className=" ml-0 lg:ml-1 text-primary cursor-pointer font-bold">
          <Link href={"/sign-up"} className={"text-[12px]"}>
            Sign Up
          </Link>
        </span>
      </div>
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 lg:w-5/12 max-w-2xl flex flex-col">
          <div className="font-bold text-4xl mb-6 lg:my-3">Sign In</div>
          <Suspense fallback={<Spinner />}>
            <AuthComponent />
          </Suspense>
          <div className="flex items-center my-5">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-4 text-[12px] text-[#878E99]">or</span>
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
              className={
                "w-5/12 rounded-3xl cursor-pointer bg-white text-black border-gray-400 border-1 hover:bg-white"
              }
            >
              Apple
            </Button>
          </div>
          <div className="text-center mt-2">
            <span className="text-accent-foreground font-medium cursor-pointer">
              <Link href="/recover">forgot password</Link>
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-auto mb-3.5 landscape:my-4 lg:landscape:mb-3.5 text-[12px] flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 text-center lg:text-left lg:w-5/12 text-[#878E99]">
          Protected by reCAPTCHA and subject to the Prism
          <span className="text-primary  inline cursor-pointer mx-1.5">
            Privacy Policy
          </span>
          and
          <span className="ml-1.5 text-primary inline cursor-pointer">
            Terms of Service.
          </span>
        </div>
      </div>
    </div>
  );
}
