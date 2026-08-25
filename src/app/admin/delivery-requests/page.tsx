import { getAllRequests } from "@/api/admin";
import DeliveryRequests from "@/components/admin/DeliveryRequests";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const PAGE_SIZE = 5;
export default async function DeliveryRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const cookieStore = await cookies();
  const { page: pageParam } = await searchParams;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const currentPage = Number.isNaN(parsedPage) ? 1 : Math.max(parsedPage, 1);
  if (
    (pageParam !== undefined && !/^[1-9]\d*$/.test(pageParam)) ||
    !Number.isSafeInteger(currentPage)
  ) {
    redirect("/admin/users?page=1");
  }

  const { requests, count: totalPages } = await getAllRequests(
    createClient(cookieStore),
    currentPage,
    PAGE_SIZE,
  );
  if (currentPage > Math.max(totalPages, 1)) {
    redirect(`/admin/users?page=${Math.max(totalPages, 1)}`);
  }
  return (
    <DeliveryRequests
      requests={requests}
      totalCount={totalPages}
      pageSize={PAGE_SIZE}
      currentPage={currentPage}
    />
  );
}
