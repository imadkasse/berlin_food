import { Database } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient } from "@supabase/supabase-js";

type RequestInsert =
  Database["public"]["Tables"]["delivery_requests"]["Insert"];
type DeliveryRequest = Database["public"]["Tables"]["delivery_requests"]["Row"];
type DeliveryRequestStatus = Database["public"]["Enums"]["delivery_status"];
type AdminSupabaseClient = SupabaseClient<Database>;

export async function createRequest(data: RequestInsert) {
  const supabase: AdminSupabaseClient = createClient();
  const { error } = await supabase.from("delivery_requests").insert(data);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getAllRequests(
  client: AdminSupabaseClient,
  page: number,
  pageSize: number,
): Promise<{ requests: DeliveryRequest[]; count: number }> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = client ?? createClient();
  const { data, error, count } = await supabase
    .from("delivery_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  return { requests: data ?? [], count: count ?? 0 };
}

export async function updateRequestStatusById(
  id: DeliveryRequest["id"],
  status: DeliveryRequestStatus,
) {
  const supabase: AdminSupabaseClient = createClient();
  const { error } = await supabase
    .from("delivery_requests")
    .update({ status })
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function getRequestByEmail(
  email: DeliveryRequest["id"],
  client?: AdminSupabaseClient,
) {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("delivery_requests")
    .select("*")
    .eq("email", email)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function getRequestById(
  id: DeliveryRequest["id"],
  client?: AdminSupabaseClient,
) {
  const supabase = client ?? createClient();
  const { data, error } = await supabase
    .from("delivery_requests")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
export async function deleteRequestById(
  id: DeliveryRequest["id"],
  client?: AdminSupabaseClient,
) {
  const supabase = client ?? createClient();
  const { error } = await supabase
    .from("delivery_requests")
    .delete()
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
}
