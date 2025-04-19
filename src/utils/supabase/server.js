import {
  createServerComponentClient,
  createServerActionClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function serverCreateClient() {
  const cookieStore = await cookies(); // Await the cookies() to get the value

  return createServerActionClient({ cookies: () => cookieStore });
}
