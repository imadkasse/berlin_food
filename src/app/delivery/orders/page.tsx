import { getAllOrders } from "@/api/orders";
import Orders from "@/components/delivery/Order";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);
  const orders = await getAllOrders(supabase);
  return (
    <>
      <Orders ordersData={orders} />
    </>
  );
};

export default page;
