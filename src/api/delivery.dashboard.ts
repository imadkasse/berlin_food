import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Order } from "@/types/Order";

export async function getActiveOrderDeliver(
  supabase: SupabaseClient<Database>,
  delivery_id: string
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("delivery_id", delivery_id)
    .eq("status", "out_for_delivery")
    .maybeSingle();

  if (error) throw error;
  return data as Order | null;
}

export async function getRecantOrdersDeliverd(
  supabase: SupabaseClient<Database>,
  delivery_id: string
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("delivery_id", delivery_id)
    .order("created_at", { ascending: false })
    .limit(50); // Get recent orders to show on dashboard

  if (error) throw error;
  return data as Order[];
}
