"use client";

import { useSearchParams } from "next/navigation";
import ResetPassword from "./reset-password";
import RecoverFullPassword from "./recover-form";

export default function ResetPasswordLogicHandler() {
  const searchParams = useSearchParams();
  console.log(searchParams);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");
  return (
    <>
      {!error && code ? (
        <ResetPassword code={code} />
      ) : (
        <RecoverFullPassword errordsc={error ? error_description : ""} />
      )}
    </>
  );
}
