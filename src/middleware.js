import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req) {
  const res = NextResponse.next();

  const publicUrls = ["/", "/recover", "/sign-up","/success"];

  if (publicUrls.includes(req.nextUrl.pathname)) {
    return res;
  }

  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.rewrite(new URL("/sign-in", req.url));
  }

  return res;
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
