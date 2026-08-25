"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { updateRequestStatusById } from "@/api/admin";
import { Database } from "@/types/database.types";
import { useRouter } from "next/navigation";

type DeliveryRequest = Database["public"]["Tables"]["delivery_requests"]["Row"];
type DeliveryRequestStatus = Database["public"]["Enums"]["delivery_status"];

const STATUS_LABELS: Record<DeliveryRequestStatus, string> = {
  pending: "قيد المراجعة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
};

const STATUS_STYLES: Record<DeliveryRequestStatus, string> = {
  pending: "bg-[#fff1e8] text-[#9f4200]",
  approved: "bg-[#e8f5ed] text-[#176b3a]",
  rejected: "bg-[#fdebea] text-[#a52a2a]",
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "تاريخ غير متاح";
  return new Intl.DateTimeFormat("ar-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export default function DeliveryRequests({
  requests: initialRequests,
  totalCount,
  currentPage,
  pageSize,
}: {
  requests: DeliveryRequest[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}) {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | DeliveryRequestStatus>(
    "",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);
  const router = useRouter();
  const pageNumbers = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = new Set<number>([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    const sorted = Array.from(pages).sort((a, b) => a - b);
    const result: (number | "ellipsis")[] = [];
    sorted.forEach((page, index) => {
      if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
      result.push(page);
    });
    return result;
  })();
  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);
  const filteredRequests = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return requests.filter((request) => {
      const matchesSearch =
        !query ||
        request.full_name.toLocaleLowerCase().includes(query) ||
        (request.email ?? "").toLocaleLowerCase().includes(query) ||
        request.phone_number.toLocaleLowerCase().includes(query) ||
        request.id.toLocaleLowerCase().includes(query);
      return (
        matchesSearch && (!statusFilter || request.status === statusFilter)
      );
    });
  }, [requests, search, statusFilter]);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((request) => request.status === "pending")
        .length,
      approved: requests.filter((request) => request.status === "approved")
        .length,
      rejected: requests.filter((request) => request.status === "rejected")
        .length,
    }),
    [requests],
  );

  const handleStatusChange = async (
    id: DeliveryRequest["id"],
    status: DeliveryRequestStatus,
  ) => {
    setUpdatingId(id);
    try {
      await updateRequestStatusById(id, status);
      setRequests((current) =>
        current.map((request) =>
          request.id === id ? { ...request, status } : request,
        ),
      );
      toast.success("تم تحديث حالة الطلب بنجاح");
    } catch (error) {
      toast.error("تعذر تحديث حالة الطلب", {
        description:
          error instanceof Error ? error.message : "حاول مرة أخرى لاحقًا",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f6f3f2] px-4 py-6 text-[#1c1b1b] sm:px-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3 text-xs font-bold tracking-wider text-[#f27121]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#f27121]" />
            برلين فود · لوحة الإدارة
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
            طلبات الانضمام للتوصيل
          </h1>
          <p className="mt-2 text-sm text-[#5c5b5b]">
            راجع طلبات مندوبي التوصيل وحدّث حالتها من مكان واحد.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["إجمالي الطلبات", counts.total, "text-[#1c1b1b]"],
            ["قيد المراجعة", counts.pending, "text-[#9f4200]"],
            ["تمت الموافقة", counts.approved, "text-[#176b3a]"],
            ["مرفوضة", counts.rejected, "text-[#a52a2a]"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs font-bold text-[#706968]">{label}</p>
              <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search
              size={18}
              className="absolute start-4 top-1/2 -translate-y-1/2 text-[#706968]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث بالاسم أو البريد أو الهاتف أو المعرّف..."
              className="w-full rounded-xl bg-white px-4 py-3 ps-11 text-sm font-medium shadow-sm outline-none ring-[#f27121]/20 placeholder:text-[#706968] focus:ring-2"
              aria-label="البحث في طلبات التوصيل"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "" | DeliveryRequestStatus)
            }
            className="rounded-xl bg-white px-4 py-3 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-[#f27121]/20"
            aria-label="تصفية حسب الحالة">
            <option value="">جميع الحالات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">تمت الموافقة</option>
            <option value="rejected">مرفوض</option>
          </select>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {filteredRequests.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <FileSearch size={40} className="mb-3 text-[#f27121]" />
              <h2 className="text-lg font-black">لا توجد طلبات مطابقة</h2>
              <p className="mt-1 text-sm text-[#706968]">
                جرّب تغيير كلمات البحث أو الفلتر المحدد.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-start">
                <thead className="bg-[#f6f3f2] text-xs font-bold text-[#706968]">
                  <tr>
                    <th className="px-6 py-4">المتقدم</th>
                    <th className="px-6 py-4">التواصل</th>
                    <th className="px-6 py-4">المعرّف</th>
                    <th className="px-6 py-4">تاريخ الطلب</th>
                    <th className="px-6 py-4">الحالة</th>
                    <th className="px-6 py-4">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const isUpdating = updatingId === request.id;
                    return (
                      <tr
                        key={request.id}
                        className="border-t border-[#f0eded] align-middle hover:bg-[#fcf9f8]">
                        <td className="px-6 py-5 font-bold">
                          {request.full_name}
                        </td>
                        <td className="px-6 py-5 text-sm">
                          <div>{request.email ?? "بدون بريد إلكتروني"}</div>
                          <div className="mt-1 text-[#706968]" dir="ltr">
                            {request.phone_number}
                          </div>
                        </td>
                        <td
                          className="px-6 py-5 font-mono text-xs text-[#706968]"
                          dir="ltr">
                          {request.id}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#706968]">
                          {formatDate(request.created_at)}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_STYLES[request.status]}`}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {STATUS_LABELS[request.status]}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <select
                              value={request.status}
                              disabled={isUpdating}
                              onChange={(event) =>
                                void handleStatusChange(
                                  request.id,
                                  event.target.value as DeliveryRequestStatus,
                                )
                              }
                              className="rounded-lg bg-[#f6f3f2] px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#f27121]/20"
                              aria-label={`تحديث حالة طلب ${request.full_name}`}>
                              <option value="pending">قيد المراجعة</option>
                              <option value="approved">تمت الموافقة</option>
                              <option value="rejected">مرفوض</option>
                            </select>
                            {isUpdating && (
                              <Loader2
                                size={16}
                                className="animate-spin text-[#f27121]"
                                aria-label="جار التحديث"
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {totalCount > 0 && (
                  <footer
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between bg-[#F6F3F2]/30"
                    dir="rtl">
                    {requests.length > 0 && (
                      <p className="text-sm font-medium text-[#5c5b5b]">
                        عرض {(currentPage - 1) * pageSize + 1} إلى{" "}
                        {(currentPage - 1) * pageSize + requests.length} من{" "}
                        {totalCount} مستخدم
                      </p>
                    )}
                    {totalPages > 1 && (
                      <nav
                        aria-label="التنقل بين صفحات المستخدمين"
                        className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="الصفحة السابقة"
                          disabled={currentPage <= 1}
                          onClick={() =>
                            router.push(`?page=${currentPage - 1}`)
                          }
                          className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#5c5b5b] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                          <ChevronRight size={16} />
                          <span className="hidden sm:inline">السابق</span>
                        </button>
                        {pageNumbers.map((page, index) =>
                          page === "ellipsis" ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-2 text-[#9A9694]"
                              aria-hidden="true">
                              …
                            </span>
                          ) : (
                            <button
                              type="button"
                              key={page}
                              aria-label={`الصفحة ${page}`}
                              aria-current={
                                page === currentPage ? "page" : undefined
                              }
                              onClick={() => router.push(`?page=${page}`)}
                              className={`h-9 min-w-9 rounded-lg px-2 text-sm font-bold transition-colors ${page === currentPage ? "bg-[#F27121] text-white" : "text-[#5c5b5b] hover:bg-white"}`}>
                              {page}
                            </button>
                          ),
                        )}
                        <button
                          type="button"
                          aria-label="الصفحة التالية"
                          disabled={currentPage >= totalPages}
                          onClick={() =>
                            router.push(`?page=${currentPage + 1}`)
                          }
                          className="flex h-9 items-center gap-1 rounded-lg px-2 text-sm font-bold text-[#5c5b5b] hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">
                          <span className="hidden sm:inline">التالي</span>
                          <ChevronLeft size={16} />
                        </button>
                      </nav>
                    )}
                  </footer>
                )}
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
