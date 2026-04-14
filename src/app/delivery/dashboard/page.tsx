import Dashboard from "@/components/delivery/Dashboard";
import { createClient } from "@/utils/supabase/server";
import {
  getActiveOrderDeliver,
  getRecantOrdersDeliverd,
} from "@/api/delivery.dashboard";
import { cookies } from "next/headers";

const page = async () => {
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const activeOrder = await getActiveOrderDeliver(supabase, user?.id!);
  const recentOrders = await getRecantOrdersDeliverd(supabase, user?.id!);

  return (
    <>
      <Dashboard
        activeOrderData={activeOrder}
        recentOrdersData={recentOrders}
      />
    </>
  );
};

export default page;
