import { getDeliveryQueueByDeliveryId } from "@/api/orders";
import ActiveDelivery from "@/components/delivery/ActiveDelivery";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Order } from "@/types/Order";

export default async function ActiveDeliveryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const cookiesStore = await cookies();
  const supabase = createClient(cookiesStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allOrders = await getDeliveryQueueByDeliveryId(supabase, user?.id!);

  // pass to proxy.ts
  const activeOrder = allOrders?.find(
    (o: Order) => o.id === id && o.delivery_id === user?.id,
  );

  if (!activeOrder) {
    redirect("/delivery/for-delivery");
  }

  return <ActiveDelivery order={activeOrder} />;
}
