"use client";

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
import { useState } from "react";
import { Button } from "../ui/button";
import zxcvbn from "zxcvbn";
import { SignUpAction } from "@/actions/auth-actions";
import { useRouter, useSearchParams } from "next/navigation";



export default function SignUpForm({ checked }) {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
  });

  const param = useSearchParams();
  const ref = param.get("ref");
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [errorMess, setErrorMessage] = useState("");
  const [sucessMess, setSuccessMessage] = useState("");
  

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

  const onSubmit = async (data) => {
    try {
      const result = await SignUpAction(data, passwordStrength, checked, ref);
      if (result.error) {
        setSuccessMessage("");
        if (
          result.message ===
          `duplicate key value violates unique constraint "profiles_pkey"`
        ) {
          setErrorMessage("Email address already exists");
          return;
        } else {
          setErrorMessage(result.message);
          return;
        }
      }
      setErrorMessage("");
      setSuccessMessage(
        "Account created successfully, check your mail to continue"
      );
      setPasswordTouched(false);
      form.reset();
      router.push("/dashboard");
    } catch (error) {
      setSuccessMessage("");
      if (error.message) {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      {/* Success / Error Message */}
      {errorMess && (
        <p className="text-red-500 mt-2 text-sm font-medium">{errorMess}</p>
      )}
      {sucessMess && (
        <p className="text-green-600 mt-2 text-sm font-medium">{sucessMess}</p>
      )}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Email Address"
                  {...field}
                  required
                  type="email"
                  className="bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Firstname + Lastname */}
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="First Name"
                    {...field}
                    required
                    className="bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Last Name"
                    {...field}
                    required
                    className="bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password Field with Strength */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                    required
                    className="bg-none h-14 lg:h-12 mb-5 pr-8 bg-white border-[#98AAC8] border-2"
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
                    <div>
                      <div className="relative mb-1">
                        <div
                          className={`
                            ${
                              [
                                "bg-red-500",
                                "bg-yellow-500",
                                "bg-blue-500",
                                "bg-green-500",
                              ][Math.min(passwordStrength, 3)]
                            }
                            transition-all duration-300 ease-in-out h-3 rounded-xl flex items-center justify-between`}
                          style={{
                            width: `${(passwordStrength + 1) * 25}%`,
                            maxWidth: "100%",
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs font-semibold">
                          {passwordStrength > 2 && (
                            <p className="text-[12px] mt-1 font-normal text-[#878E99]">
                              Your password is great. Nice work!
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs font-semibold ${
                            [
                              "text-red-500",
                              "text-yellow-500",
                              "text-blue-500",
                              "text-green-500",
                            ][Math.min(passwordStrength, 3)]
                          }`}
                        >
                          {
                            ["Weak", "Fair", "Good", "Strong", "Strong"][
                              passwordStrength
                            ]
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`w-full rounded-3xl mt-3 font-bold text-[12px] cursor-pointer h-14 lg:h-12 ${
            form.formState.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Create an account
        </Button>
      </form>
    </Form>
  );
}

