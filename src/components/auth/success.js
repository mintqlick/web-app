"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SuccessComponent() {
  const router = useRouter();
  const clicked = () => {
    router.push("/dashboard");
  };
  return (
    <div className=" w-full my-4">
      <Button
        className={"w-full rounded-2xl text-[12px] font-bold cursor-pointer"}
        onClick={clicked}
      >
        Go to homepage
      </Button>
    </div>
  );
}
