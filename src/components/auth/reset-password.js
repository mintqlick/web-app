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
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
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

  const submitForm = (e) => {
    e.preventDefault();
    router.replace("/auth/success");
  };

  return (
    <Form {...form} onSubmit={(e) => submitForm(e)}>
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
                  <span>
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
        onClick={(e) => submitForm(e)}
        className={"rounded-3xl font-bold text-[12px] cursor-pointer h-14 lg:h-12"}
      >
        Set new password
      </Button>
    </Form>
  );
}
