import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";
import { Order_Items } from "@/types/Order";

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
// type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

// type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type OrderItemInsert = Database["public"]["Tables"]["order_items"]["Insert"];

export async function getOrders(
  supabase: SupabaseClient<Database>,
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCustomerOrders(
  supabase: SupabaseClient<Database>,
  customerId: string,
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrderById(
  supabase: SupabaseClient<Database>,
  id: string,
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function createOrder(
  supabase: SupabaseClient<Database>,
  order: OrderInsert,
  items: Omit<OrderItemInsert, "order_id">[],
): Promise<Order> {
  // Create the order
  const { data: createdOrder, error: orderError } = await supabase
    .from("orders")
    .insert(order)
    .select()
    .single();

  if (orderError) throw orderError;

  // Create order items
  if (items && items.length > 0) {
    const orderItemsToInsert: OrderItemInsert[] = items.map((item) => ({
      ...item,
      order_id: createdOrder.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      throw itemsError;
    }
  }

  return createdOrder;
}

export async function updateOrderStatus(
  supabase: SupabaseClient<Database>,
  id: string,
  status: string,
): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrderItemsDetails(
  supabase: SupabaseClient<Database>,
  orderId: string,
) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*, menu_items(*)")
    .eq("order_id", orderId);

  if (error) throw error;

  return (data || []).map((item: Order_Items) => ({
    ...(item.menu_items || {}),
    quantity: item.quantity,
    order_item_id: item.id,
    price: item.price,
  }));
}

export async function getAllOrderByUserId(
  supabase: SupabaseClient<Database>,
  customer_id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_item:menu_items(*))")
    .eq("customer_id", customer_id);

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// for admins and deliverys
export async function getAllOrders(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_item:menu_items(*))");

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function takeOrderToDelivery(
  supabase: SupabaseClient<Database>,
  delivery_id: string,
  order_id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .update({
      delivery_id,
      status: "out_for_delivery",
      // updated_at: new Date().toLocaleTimeString(),
    })
    .eq("id", order_id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
export async function getOrderByDeliverId(
  supabase: SupabaseClient<Database>,
  delivery_id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("delivery_id", delivery_id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}
export async function getDeliveryQueueByDeliveryId(
  supabase: SupabaseClient<Database>,
  delivery_id: string,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, menu_item:menu_items(*))")
    .eq("status", "out_for_delivery")
    .eq("delivery_id", delivery_id);

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

// Views

// api/orders.ts
export async function getOrderWithItems(
  supabase: SupabaseClient<Database>,
  page: number = 1,
  pageSize: number = 3,
) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Added { count: 'exact' } to get total rows
  const { data, error, count } = await supabase
    .from("order_info")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false }) // Good practice to keep order consistent
    .range(from, to);

  if (error && error.code !== "PGRST116") throw error;

  return {
    orders: data || [],
    count: count || 0,
  };
}
