import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function getProfile(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createProfile(
  supabase: SupabaseClient<Database>,
  profile: ProfileInsert,
): Promise<Profile> {
  // create auth.user firstly
  const { data, error } = await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  id: string,
  profile: ProfileUpdate,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfileRole(
  supabase: SupabaseClient<Database>,
  id: string,
  role: "admin" | "customer" | "delivery" | "support",
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllProfiles(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) throw error;
  return data;
}

export async function deleteProfile(
  supabase: SupabaseClient<Database>,
  id: string,
) {
  // this function will delete user from auth.users table and run trigger to delete user from profiles table
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) throw error;
}

export async function rateDelivery(
  supabase: SupabaseClient<Database>,
  deliveryId: string,
  rating: number,
) {
  const { error } = await supabase.rpc("add_delivery_rating", {
    delivery_id: deliveryId,
    new_rating: rating,
  });
  if (error) throw error;
}
