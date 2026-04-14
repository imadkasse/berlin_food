import { getDeliveryQueueByDeliveryId } from "@/api/orders";
import ForDelivery from "@/components/delivery/ForDelivery";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async () => {
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allOrders = await getDeliveryQueueByDeliveryId(
    supabase,
    user?.id as string,
  );

  return (
    <>
      <ForDelivery orders={allOrders || []} />
    </>
  );
};

export default page;
