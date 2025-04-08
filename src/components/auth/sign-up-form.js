"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import zxcvbn from "zxcvbn";

export default function SignUpForm() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
  });
  const [showPass, setShowPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);

  const changeSeePassword = () => {
    setShowPass((prev) => !prev);
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
  };

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                placeholder="Email Address"
                {...field}
                className={
                  "bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      ></FormField>
      <div className="flex gap-4 ">
        <FormField
          control={form.control}
          name="fistname"
          render={({ field }) => (
            <FormItem className={"w-full"}>
              <FormControl>
                <Input
                  placeholder="First Name"
                  {...field}
                  className={
                    "bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Last Name"
                  {...field}
                  className={
                    "bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        ></FormField>
      </div>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
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
      <Button
        className={
          "rounded-3xl mt-3 font-bold text-[12px] cursor-pointer h-14 lg:h-12"
        }
      >
        Create an account
      </Button>
    </Form>
  );
}
