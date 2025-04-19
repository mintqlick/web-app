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

import { Button } from "../ui/button";
import { useState } from "react";
import { sendRecoveryPassword } from "@/actions/auth-actions";

export default function RecoverFullPassword({ errordsc }) {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });
  const [errorMess, setErrorMessage] = useState(errordsc);
  const [successMess, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const result = await sendRecoveryPassword(data.email);
      if (result.error) {
        setSuccessMessage("");
        setErrorMessage(result.message);
        return;
      }
      setErrorMessage("");
      setSuccessMessage("check your mail to continue");
      form.reset();
    } catch (error) {
      if (error.message) {
        setSuccessMessage("");
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        {successMess && (
          <p className="text-green-400 font-bold text-sm my-1">{successMess}</p>
        )}

        {errorMess && (
          <p className="text-red-400 font-bold text-sm my-1">{errorMess}</p>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email"
                  required
                  type="email"
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

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={`w-full rounded-3xl mt-3 font-bold text-[12px] cursor-pointer h-14 lg:h-12
            ${
              form.formState.isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }
            `}
        >
          send recovery email
        </Button>
      </form>
    </Form>
  );
}
