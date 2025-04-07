import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecoverFullPassword from "@/components/auth/recover-form";
import ResetPassword from "@/components/auth/reset-password";

export default function RecoverPassword() {
  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 lg:w-5/12 max-w-2xl flex flex-col">
          <div className="font-bold text-4xl ">Forgot password</div>
          <div className="text-base text-[#878E99] my-3.5">
            No worries! Just enter your email and we{"’"}ll send you a reset
            password link.
          </div>
          <RecoverFullPassword />
          {/* <ResetPassword /> */}
          <div className="flex my-4 justify-center gap-2  text-[12px] items-center">
            <span>Just remember?</span>
            <Link
              href="/auth/sign-up"
              className="text-primary text-[12px] font-bold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
