import {
  getOrderWithItems,
} from "@/api/orders";
import OrderManager from "@/components/admin/OrderManagment";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
  }>;
}) => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  // Fetch data and total count
  const { orders, count } = await getOrderWithItems(supabase, currentPage);

  return (
    <>
      <OrderManager
        key={(await searchParams).page} // to change the data after change the page number
        ordersData={orders}
        totalCount={count}
        currentPage={currentPage}
      />
    </>
  );
};

export default page;
