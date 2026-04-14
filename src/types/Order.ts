import { Database } from "./database.types";
import { Menu } from "./Menu";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Order_info = Database["public"]["Views"]["order_info"]["Row"];
export type Order_info_items = {
  menu_item: Menu;
  quantity: number;
  price: number;
};

export type Order_Items = {
  created_at: string;
  id: string;
  menu_item_id: string | null;
  order_id: string | null;
  price: number | null;
  quantity: number | null;
  updated_at: string | null;
  menu_items: {
    category_id: string | null;
    description: string | null;
    id: string;
    image_url: string | null;
    is_available: boolean | null;
    name: string;
    price: number;
  } | null;
};
