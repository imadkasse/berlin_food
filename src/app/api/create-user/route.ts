import { createUser } from "@/api/auth";
import { ApiError } from "@/types/Error";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { profile, auth } = await req.json();

    const cookiesSotre = await cookies();
    const supabase = createClient(
      cookiesSotre,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    const { auth: userAuth, profile: profileData } = await createUser(
      supabase,
      {
        profile,
        auth: {
          email: auth.email,
          password: auth.password,
        },
      },
    );

    return NextResponse.json({
      userAuth,
      profileData,
    });
  } catch (err: unknown) {
    console.error("Error in create-user route:", err);
    
    const errorMessage = 
      (err as ApiError)?.error?.message || 
      (err instanceof Error ? err.message : "An unexpected error occurred");

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
