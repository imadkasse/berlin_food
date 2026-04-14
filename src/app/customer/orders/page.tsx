import { getAllOrderByUserId } from "@/api/orders";
import MyOrders from "@/components/orders/Orders";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const orders = await getAllOrderByUserId(supabase, user?.id!);
  return (
    <>
      <MyOrders ordersData={orders} />
    </>
  );
};

export default page;
