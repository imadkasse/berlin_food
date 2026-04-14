import { deleteProfile } from "@/api/profiles";
import { ApiError } from "@/types/Error";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();

    const cookiesSotre = await cookies();
    const supabase = createClient(
      cookiesSotre,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
    console.log(process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    await deleteProfile(supabase, id);

    return NextResponse.json({
      message: "User deleted successfully",
      id,
    });
  } catch (err: unknown) {
    console.error("Error in delete-user route:", err);
    const errorMessage = 
          (err as ApiError)?.error?.message || 
          (err instanceof Error ? err.message : "An unexpected error occurred");
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 },
    );
  }
}
