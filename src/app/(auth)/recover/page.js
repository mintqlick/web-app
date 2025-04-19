"use client";

import ResetPasswordLogicHandler from "@/components/auth/reset-password-logic";
import Link from "next/link";
import { Suspense } from "react";

export default function RecoverPassword() {
  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 lg:w-5/12 max-w-2xl flex flex-col">
          <div className="font-bold text-4xl ">Forgot password</div>
          <div className="text-base text-[#878E99] my-3.5">
            No worries! Just enter your email and we&amp;ll send you a reset
            password link.
          </div>
          <Suspense fallback={<div>loading...</div>}>
            <ResetPasswordLogicHandler />
          </Suspense>

          <div className="flex my-4 justify-center gap-2  text-[12px] items-center">
            <span>Just remember?</span>
            <Link
              href="/sign-in"
              className="text-primary text-[12px] font-bold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
