import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];
type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"];

export async function getMenuItems(
  supabase: SupabaseClient<Database>,
  categoryId?: string,
): Promise<MenuItem[]> {
  let query = supabase.from("menu_items").select("*");

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAvailableMenuItems(
  supabase: SupabaseClient<Database>,
): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true);
  if (error) throw error;
  return data;
}

export async function getMenuItemById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createMenuItem(
  supabase: SupabaseClient<Database>,
  menuItem: MenuItemInsert,
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert(menuItem)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(
  supabase: SupabaseClient<Database>,
  id: string,
  menuItem: MenuItemUpdate,
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from("menu_items")
    .update(menuItem)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}
export async function updateMenuItemStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  is_available: boolean,
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from("menu_items")
    .update({
      is_available,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
