import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getProfile } from "./api/profiles";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Check the auth token / get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If the user is missing, redirect them to the login page
  if (!user) {
    const url = request.nextUrl.clone();
    // take the previous url and save after login(success) back to your previous url
    url.pathname = `/auth/login`; // Adjust this login route based on your structure
    return NextResponse.redirect(url);
  }
  // redirect user using role-based
  const userProfile = await getProfile(supabase, user.id);

  const pathnameRole = request.nextUrl.pathname.split("/")[1];

  if (pathnameRole !== userProfile?.role) {
    const url = request.nextUrl.clone();
    url.pathname = `/${userProfile?.role}/profile`;
    return NextResponse.redirect(url);
  }
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/customer/profile",
    "/customer/orders",
    "/admin/:path*",
    "/delivery/:path*",
  ],
};
