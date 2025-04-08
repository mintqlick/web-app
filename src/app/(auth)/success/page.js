import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecoverFullPassword from "@/components/auth/recover-form";
import ResetPassword from "@/components/auth/reset-password";
import SuccessComponent from "@/components/auth/success";

export default function SuccessPage() {
  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-10/12  lg:w-4/12 max-w-5xl flex flex-col">
          <div className="w-full flex flex-col justify-center items-center gap-2.5">
            <span className="font-bold text-6xl ">Success</span>
            <div className="text-base text-[#878E99] w-10/12 text-center">
              Account Activated! Start your first investment.
            </div>
          </div>
          <SuccessComponent />
        </div>
      </div>
    </div>
  );
}
