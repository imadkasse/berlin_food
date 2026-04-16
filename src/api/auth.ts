import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
const supabase = createClient();
export async function login(data: { email: string; password: string }) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) throw error;
  return authData;
}

export async function register(
  registerData: { email: string; password: string },
  profileData: Omit<ProfileInsert, "id">,
) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: registerData.email,
    password: registerData.password,
    options: {
      data: {
        full_name: profileData.full_name,
        phone_number: profileData.phone_number,
        role: profileData.role || "customer",
        address: profileData.address,
        vehicle_type:
          profileData.role === "customer"
            ? null
            : profileData.vehicle_type || "motorcycle",
        availability_status: profileData.availability_status ?? true,
      },
    },
  });
  if (error) throw error;

  return authData;
}

export async function signupWithGoogle() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  console.log('site url:',siteUrl);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    // options: {
    //   redirectTo: `${siteUrl}/auth/callback`,
    // },
  });

  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// create user from auth.users table
export async function createUser(
  supabaseAdmin: SupabaseClient<Database>,
  data: {
    profile: ProfileInsert;
    auth: {
      email: string;
      password: string;
    };
  },
) {
  const { data: authData, error } = await supabaseAdmin.auth.admin.createUser({
    email: data.auth.email,
    password: data.auth.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.profile.full_name,
      phone_number: data.profile.phone_number,
      role: data.profile.role || "customer",
      address: data.profile.address,
      vehicle_type:
        data.profile.role === "customer"
          ? null
          : data.profile.vehicle_type || "motorcycle",
      availability_status: data.profile.availability_status ?? true,
    },
  });
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData?.user?.id)
    .single();
  if (error) throw error;
  if (profileError) throw profileError;

  return {
    auth: authData,
    profile: profileData,
  };
}

export async function forgotPassword(
  supabaseAuth: SupabaseClient<Database>, // just for pass supabase clinet bettewn server and client
  email: string,
) {
  const { error } = await supabaseAuth.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
}

export async function resetPassword(
  supabaseAuth: SupabaseClient<Database>, // just for pass supabase clinet bettewn server and client
  password: string,
) {
  const { error } = await supabaseAuth.auth.updateUser({
    password,
  });
  if (error) throw error;
}
