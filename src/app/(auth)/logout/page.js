"use client";

import Spinner from "@/components/auth/spinner";
import { supabase } from "@/utils/supabase/super-base-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.replace("/sign-in");
    }
    logout();
  }, []);
  return (
    <div className="w-full h-full bg-white flex flex-col pt-9 items-center ">
      <div className="w-full h-full flex justify-center items-center max-w-md lg:max-w-6xl">
        <div className="w-11/12 lg:w-5/12 max-w-2xl flex flex-col">
          <Spinner size={50} />
        </div>
      </div>
    </div>
  );
}
