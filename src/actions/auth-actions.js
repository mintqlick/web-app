"use server";

import { z } from "zod";
import { serverCreateClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";

const signup_schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password may contain at least one uppercase letter")
    .regex(/[a-z]/, "Password may contain at least one lowercase letter")
    .regex(/[0-9]/, "Password may contain at least one number"),
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
});
const signInschema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
const recoverPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password may contain at least one uppercase letter")
    .regex(/[a-z]/, "Password may contain at least one lowercase letter")
    .regex(/[0-9]/, "Password may contain at least one number"),
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const SignUpAction = async (data, strength) => {
  const result = signup_schema.safeParse(data);
  if (!result.success) {
    throw result.error.errors[0].message;
  }
  if (!(strength >= 3)) {
    throw new Error("password not strong enough");
  }
  const { email, password, firstname, lastname } = data;

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      email,
    });
    const exist = data.users.find((el) => el.email.toLowerCase() === email);
    if (exist) {
      return { message: "email is in use", error: true };
    }

    const supabase = await serverCreateClient();
    const { data: signupData, error: signupEror } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstname, last_name: lastname },
        emailRedirectTo: "http://localhost:3000/success",
      },
    });

    if (signupEror) {
      return { message: signupEror.message, error: true };
    }

    // return user;
    return { message: "User created successfully", error: false };
  } catch (error) {
    return { message: error.message ? error.message : error, error: true };
  }
};

export const signInAction = async (email, password) => {
  const result = signInschema.safeParse({ email, password });
  if (!result.success) {
    throw result.error.errors[0].message;
  }

  const supabase = await serverCreateClient(); // Pass `req` for server-side
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { message: error.message, error: true };
  }
  return { message: "successfully signed in", error: false };
};

export const sendRecoveryPassword = async (email) => {
  const result = recoverPasswordSchema.safeParse({ email });
  if (!result.success) {
    throw result.error.errors[0].message;
  }
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      email,
    });
    const exist = data.users.find((el) => el.email.toLowerCase() === email);
    if (!exist) {
      return { message: "User with email does not exist", error: true };
    }
    if (!exist.confirmed_at) {
      return {
        message:
          "Your account has not been confirmed yet. Please check your email to verify your account.",
        error: true,
      };
    }

    const supabase = await serverCreateClient();
    const { data: resetData, error: resetErr } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/recover",
      });
    return { message: "success", error: false };
  } catch (error) {
    console.log(error);
    return { message: error.message ? error.message : error, error: true };
  }
};

export const UpdateUserPassword = async (data, strength, code) => {
  const result = resetPasswordSchema.safeParse(data);
  if (!result.success) {
    throw result.error.errors[0].message;
  }
  if (!(strength >= 3)) {
    return { message: "password not strong enough", error: true };
  }
  if (data.password !== data.confirm_password) {
    return { message: "passwords must match", error: true };
  }
  try {
    const supabase = await serverCreateClient();
    // const { data: updateData, error } = await supabase.auth.getSession();
    const { data: updateData, error: updateError } =
      await supabase.auth.updateUser({
        password: data.password,
      });
    if (updateError) {
      return { message: updateError.message, error: true };
    }
    return { message: "password updated", error: false };
  } catch (error) {
    return { message: error.message, error: true };
  }
};


