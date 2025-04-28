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
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { signInAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function AuthComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [errorMess, setErrorMessage] = useState("");
  const [successMess, setSuccessMess] = useState();
  const router = useRouter();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) {
      setMessage(msg);
      // Remove the query param from the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("message");

      const basePath = window.location.pathname;
      const updatedUrl = `${basePath}${
        newParams.toString() ? `?${newParams}` : ""
      }`;

      router.replace(updatedUrl, { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (message) {
      setSuccessMess(message);
    }
    return () => setSuccessMess("");
  }, [message]);

  const changeSetPassword = () => {
    setShowPass((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      const result = await signInAction(data.email, data.password);
      if (result.error) {
        setErrorMessage(result.message);
        setSuccessMess("");
        return;
      }
      setSuccessMess(result.message);
      setErrorMessage("");
    } catch (error) {
      if (error.message) {
        if (error.message === "NEXT_REDIRECT") {
          setErrorMessage("");
          setSuccessMess("successfully authentocated");
          return;
        }
        setSuccessMess("");
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {errorMess && (
          <p className="text-red-400 font-bold text-sm my-1">{errorMess}</p>
        )}
        {successMess && (
          <p className="text-green-400 font-bold text-sm my-1">{successMess}</p>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  required
                  type={"email"}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                    required
                    className={
                      "bg-none h-14 lg:h-12 mb-5 pr-8 bg-white border-[#98AAC8] border-2"
                    }
                  />
                  <button
                    type="button"
                    onClick={changeSetPassword}
                    className="absolute top-3 right-3 cursor-pointer"
                  >
                    {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`w-full rounded-3xl mt-3 font-bold text-[12px] cursor-pointer h-14 lg:h-12
            ${
              form.formState.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }
            `}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
