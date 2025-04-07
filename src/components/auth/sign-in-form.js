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

export default function AuthComponent() {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPass, setShowPass] = useState(false);

  const changeSetPassword = () => {
    setShowPass((prev) => !prev);
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
                placeholder="Email"
                {...field}
                className={"bg-none h-14 lg:h-12 mb-5 border-[#98AAC8] border-2"}
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
      <Button className={"rounded-3xl font-bold text-[12px] cursor-pointer h-14 lg:h-12"}>
        Login
      </Button>
    </Form>
  );
}
