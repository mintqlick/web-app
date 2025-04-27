"use client";

import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UpdateUserPassword } from "@/actions/auth-actions";
import { createClient } from "@/utils/supabase/super-base-client";

export default function ResetPassword({ code }) {
  const form = useForm({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [equal, setEqual] = useState(false);
  const [errorMess, setErrorMessage] = useState("");

  const [successMess, setSuccessMessage] = useState("");

  useEffect(() => {
    const getSessionFromUrl = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setErrorMessage("Session error: " + error.message);
      }
    };
    getSessionFromUrl();
  }, []);

  const changeSeePassword = () => {
    setShowPass((prev) => !prev);
  };
  const changeSeeConfirmPassword = () => {
    setShowConfirmPass((prev) => !prev);
  };

  const handlePasswordChange = (e, fieldOnChange) => {
    const password = e.target.value;
    fieldOnChange(password);

    if (password.trim() === "") {
      setPasswordTouched(false);
      setPasswordStrength(0);

      setPasswordFeedback("");
      return;
    }

    setPasswordTouched(true);
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
    setPasswordFeedback(result.feedback.suggestions.join(" "));

    const isEqual = password === form.getValues().confirm_password;
    setEqual(isEqual);
  };
  const handleConfirmPasswordChange = (e, fieldOnChange) => {
    const password = e.target.value;
    fieldOnChange(password);

    if (passwordTouched && password.trim() === "") {
      setConfirmPasswordTouched(false);
      return;
    }

    setConfirmPasswordTouched(true);
    const isEqual = password === form.getValues().password;
    setEqual(isEqual);
  };

  const submitForm = async (data) => {
    try {
      const result = await UpdateUserPassword(data, passwordStrength, code);
      if (result.error) {
        setSuccessMessage("");
        setErrorMessage(result.message);
        return;
      }
      setErrorMessage("");
      setSuccessMessage("password reset successfull");
      form.reset();
      setPasswordTouched(false);
      setPasswordStrength(0);
      router.replace("/sign-in");
    } catch (error) {
      if (error.message === "NEXT_REDIRECT") {
        setErrorMessage("");
        setSuccessMessage("password reset successful");
        return;
      }
      setSuccessMessage("");
      if (error.message) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="w-full">
        {errorMess && (
          <p className="text-red-400 font-bold text-sm my-1">{errorMess}</p>
        )}
        {successMess && (
          <p className="text-green-400 font-bold text-sm my-1">{successMess}</p>
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="New Password"
                    {...field}
                    required
                    className={
                      "bg-none h-14 lg:h-12 mb-5 pr-8 bg-white border-[#98AAC8] border-2"
                    }
                    onChange={(e) => handlePasswordChange(e, field.onChange)}
                  />
                  <button
                    type="button"
                    onClick={changeSeePassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {/* Password strength progress bar */}
                  {passwordTouched && (
                    <div className="">
                      <div className="relative">
                        <div
                          className="flex items-center justify-between"
                          style={{
                            width: `${(passwordStrength + 1) * 25}%`, // Progress bar width based on strength
                            maxWidth: "100%",
                          }}
                        >
                          <div
                            className={`flex-1 px-1 transition-all duration-300 ease-in-out h-3 rounded-xl ${
                              passwordStrength === 0
                                ? "bg-red-500"
                                : passwordStrength === 1
                                ? "bg-yellow-500"
                                : passwordStrength === 2
                                ? "bg-blue-500 "
                                : "bg-green-500"
                            }`}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold inline-block">
                            {passwordStrength > 2 && (
                              <p className="text-[12px] mt-1 font-normal text-[#878E99]">
                                Your password is great. Nice work!
                              </p>
                            )}
                          </span>
                          <span
                            className={`text-xs font-semibold inline-block
                            ${
                              passwordStrength === 0
                                ? "text-red-500"
                                : passwordStrength === 1
                                ? "text-yellow-500"
                                : passwordStrength === 2
                                ? "text-blue-500 "
                                : "text-green-500"
                            }

                            `}
                          >
                            {
                              ["Weak", "Fair", "Good", "Strong", "Strong"][
                                passwordStrength
                              ]
                            }
                          </span>
                        </div>
                      </div>
                      {/* Password feedback */}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="mb-5 relative">
                  <Input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm New Password"
                    required
                    {...field}
                    className={
                      "bg-none h-14 lg:h-12 mb-1 border-[#98AAC8] border-2"
                    }
                    onChange={(e) =>
                      handleConfirmPasswordChange(e, field.onChange)
                    }
                  />
                  <button
                    type="button"
                    onClick={changeSeeConfirmPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {confirmPasswordTouched && passwordTouched && (
                    <span className="text-[#98AAC8] text-sm">
                      {equal ? "password match" : "password do not match"}
                    </span>
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        ></FormField>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`w-full rounded-3xl mt-3 font-bold text-[12px] cursor-pointer h-14 lg:h-12
            ${
              form.formState.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }
            `}
        >
          Set new password
        </Button>
      </form>
    </Form>
  );
}
