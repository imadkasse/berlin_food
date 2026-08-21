import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError } from "@/types/Error";

export async function GET() {
  try {
    //
    const cookiesSotre = await cookies();
    const supabase = createClient(
      cookiesSotre,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
    const { data, error } = await supabase.rpc("health");
    if (error) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error,
        },
        {
          status: 500,
        },
      );
    }
    // health endpoint
    return NextResponse.json({
      status: data.status,
      time: data.time,
    });
  } catch (err: unknown) {
    console.error("Error in create-user route:", err);

    const errorMessage =
      (err as ApiError)?.error?.message ||
      (err instanceof Error ? err.message : "An unexpected error occurred");

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
