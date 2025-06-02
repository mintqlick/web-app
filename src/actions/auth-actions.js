"use server";

import { z } from "zod";
import { createClient as serverCreateClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

const NEXT_PUBLIC_APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.nodalcircles.com";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const SignUpAction = async (data, strength, checked, ref) => {
  const result = signup_schema.safeParse(data);
  if (!result.success) {
    return { message: result.error.errors[0].message, error: true };
  }
  if (!(strength >= 3)) {
    return { message: "password not strong enough", error: true };
  }
  if (!checked) {
    return { message: "Agree to terms and policy to continue", error: true };
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
    let ref_by_id = null;
    if (ref) {
      const { data: referralData, error: referralError } = await supabase
        .from("referrals")
        .select("user_id")
        .eq("referral_code", ref)
        .single();
      if (referralError || !referralData) {
        return { message: "Invalid referral code", error: true }; // If no record is found
      }
      ref_by_id = referralData.user_id;
    }
    const { data: signupData, error: signupEror } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstname} ${lastname}`,
        },
        emailRedirectTo: `${NEXT_PUBLIC_APP_URL}/success`,
      },
    });

    if (signupEror) {
      console.log(signupEror);
      return { message: signupEror.message, error: true };
    }

    const { error: insertReferralError } = await supabase
      .from("referrals")
      .insert([
        {
          user_id: signupData.user.id, // Referred user (new user)
          referred_by: ref_by_id, // Referrer user (from the referral code)
          referral_code: `REF-${signupData.user.id.slice(0, 8)}`, // Unique referral code
        },
      ]);

    if (insertReferralError) {
      console.log(insertReferralError);
      return { message: insertReferralError.message, error: true };
    }

    return { message: "User created successfully", error: false };
  } catch (error) {
    return { message: error.message ? error.message : error, error: true };
  }
};

export const signInAction = async (email, password) => {
  const result = signInschema.safeParse({ email, password });
  if (!result.success) {
    return { message: result.error.errors[0].message, error: true };
  }

  const supabase = await serverCreateClient(); // Pass `req` for server-side
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(data, error);
  if (error) {
    return { message: error.message, error: true };
  }

  const { data: signData, error: signError } = await supabase
    .from("users")
    .select("blocked")
    .eq("email", email)
    .single();

  // if (signData.blocked) {
  //   if (error) {
  //     return { message: "Account blocked", error: true };
  //   }
  // }
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
};

export const sendRecoveryPassword = async (email) => {
  const result = recoverPasswordSchema.safeParse({ email });
  if (!result.success) {
    return { message: result.error.errors[0].message, error: true };
  }
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      email,
    });
    const exist = data.users.find((el) => el.email.toLowerCase() === email);
    if (!exist) {
      return { message: "User with email does not exist", error: true };
    }
    // if (!exist.confirmed_at) {
    //   return {
    //     message:
    //       "Your account has not been confirmed yet. Please check your email to verify your account.",
    //     error: true,
    //   };
    // }

    const supabase = await serverCreateClient();
    const { data: resetData, error: resetErr } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${NEXT_PUBLIC_APP_URL}/recover`,
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
    return { message: result.error.errors[0].message, error: true };
  }

  if (strength < 3) {
    return { message: "Password not strong enough", error: true };
  }

  if (data.password !== data.confirm_password) {
    return { message: "Passwords must match", error: true };
  }

  const supabase = await serverCreateClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return {
      message: "Authentication failed. Please sign in again.",
      error: true,
    };
  }

  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser({
      password: data.password,
    });

  if (updateError) {
    return { message: updateError.message, error: true };
  }

  // ✅ Sign the user out to clear session + cookies
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    console.error("Error signing out:", signOutError.message);
  }

  revalidatePath(`/sign-in`, "layout");
  redirect(`/sign-in?message="password reset successful"`);
};

export async function PrivatePage() {
  const supabase = await serverCreateClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/sign-in");
  }
  return { user: data.user };
}
