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

export default function RecoverFullPassword() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

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

      <Button
        className={"rounded-3xl font-bold text-[12px] cursor-pointer h-14 lg:h-12"}
      >
        send recovery email
      </Button>
    </Form>
  );
}
