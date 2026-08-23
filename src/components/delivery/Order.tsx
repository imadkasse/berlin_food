"use client";

import { useState } from "react";
import { Search, MapPin, ChevronLeft, Package, Loader2 } from "lucide-react";
import { Order } from "@/types/Order";
import { useUserStore } from "@/stores/user.store";
import { createClient } from "@/utils/supabase/client";
import { takeOrderToDelivery } from "@/api/orders";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AddressJson {
  [key: string]: any;
  lat?: number;
  lng?: number;
}

const STATUS_CFG: Record<
  string,
  {
    label: string;
    dot: string;
    pill: string;
    action?: string;
    actionKey?: "accept" | "pick_up" | "mark_delivered";
    actionStyle?: string;
  }
> = {
  pending: {
    label: "قيد الانتظار",
    dot: "bg-blue-400",
    pill: "bg-blue-50 text-blue-700 border-blue-100",
    action: "قبول",
    actionKey: "accept",
    actionStyle:
      "bg-white border border-[#e5e2e1] text-[#1c1b1b] hover:bg-[#f0eded]",
  },
  preparing: {
    label: "قيد التحضير",
    dot: "bg-yellow-400",
    pill: "bg-yellow-50 text-yellow-700 border-yellow-100",
  },
  ready_for_pickup: {
    label: "جاهز للاستلام",
    dot: "bg-purple-400",
    pill: "bg-purple-50 text-purple-700 border-purple-100",
    action: "استلام",
    actionKey: "pick_up",
    actionStyle: "bg-purple-500 text-white hover:bg-purple-600",
  },
  out_for_delivery: {
    label: "في طريقه للتوصيل",
    dot: "bg-[#F27121] animate-pulse",
    pill: "bg-orange-50 text-[#9F4200] border-orange-100",
    action: "تحديد كمُسلَّم",
    actionKey: "mark_delivered",
    actionStyle: "bg-[#F27121] text-white hover:bg-[#9F4200]",
  },
  delivered: {
    label: "تم التوصيل",
    dot: "bg-green-500",
    pill: "bg-green-50 text-green-700 border-green-100",
  },
  cancelled: {
    label: "ملغى",
    dot: "bg-red-400",
    pill: "bg-red-50 text-red-600 border-red-100",
  },
};

const FILTERS = [
  { value: "all", label: "الكل" },
  { value: "out_for_delivery", label: "في طريقه للتوصيل" },
  { value: "ready_for_pickup", label: "جاهز للاستلام" },
  { value: "preparing", label: "قيد التحضير" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "delivered", label: "تم التوصيل" },
  { value: "cancelled", label: "ملغى" },
];

function formatTime(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Orders({ ordersData }: { ordersData: Order[] }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>(ordersData);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const { user } = useUserStore();
  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    // o.delivery_address?.street?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === "all" || activeFilter === o.status;
    return matchSearch && matchFilter;
  });

  //
  const handleTakeOrderToDelivery = async (orderId: string) => {
    const supabase = createClient();
    setLoadingOrderId(orderId);
    try {
      console.log(orderId);

      const data = await takeOrderToDelivery(supabase, user?.id!, orderId);
      toast.success("تم قبول الطلب بنجاح", {
        description: `تم قبول الطلب ذي المعرّف: ${orderId} بنجاح`,
      });
    } catch (error: any) {
      console.log(error);
      toast.error("حدث خطأ أثناء قبول الطلب", {
        description: `الخطأ: ${error.message}`,
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 pb-28 lg:pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          <span className="text-[10px] font-black text-[#F27121] tracking-[0.25em] uppercase mb-2 block">
            برلين فود · التوصيل
          </span>
          <h1 className="text-5xl font-extrabold tracking-tighter leading-none">
            طلباتي
          </h1>
          <p className="text-[#584237] mt-3 font-medium text-base">
            الإجمالي: {orders.length} · النشطة: {" "}
            {orders.filter((o) => o.status === "out_for_delivery").length}{" "}
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search
            size={15}
            className="absolute start-4 top-1/2 -translate-y-1/2 text-[#584237]"
          />
          <input
            type="text"
            placeholder="ابحث عن طلب أو عنوان..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-11 pe-4 py-3.5 bg-[#f6f3f2] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#F27121]/20 text-sm font-medium placeholder:text-[#584237]"
          />
        </div>
      </header>

      {/* Summary chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          {
            label: "قيد الانتظار",
            count: orders.filter((o) => o.status === "pending").length,
            color: "text-blue-700 bg-blue-50 border-blue-100",
          },
          {
            label: "قيد التحضير",
            count: orders.filter((o) => o.status === "preparing").length,
            color: "text-yellow-700 bg-yellow-50 border-yellow-100",
          },
          {
            label: "جاهز",
            count: orders.filter((o) => o.status === "ready_for_pickup").length,
            color: "text-purple-700 bg-purple-50 border-purple-100",
          },
          {
            label: "قيد التوصيل",
            count: orders.filter((o) => o.status === "out_for_delivery").length,
            color: "text-[#9F4200] bg-orange-50 border-orange-100",
          },
          {
            label: "تم التوصيل",
            count: orders.filter((o) => o.status === "delivered").length,
            color: "text-green-700 bg-green-50 border-green-100",
          },
          {
            label: "ملغى",
            count: orders.filter((o) => o.status === "cancelled").length,
            color: "text-red-600 bg-red-50 border-red-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex items-center justify-between px-5 py-4 rounded-2xl border font-bold text-sm ${s.color}`}>
            <span>{s.label}</span>
            <span className="text-2xl font-extrabold">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-8 scrollbar-none">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeFilter === f.value
                ? "bg-[#F27121] text-white shadow-md shadow-[#F27121]/20"
                : "bg-[#f6f3f2] text-[#584237] hover:bg-[#e5e2e1]"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* orders table */}
      <div className="bg-white rounded-[2rem] overflow-hidden border border-[#e5e2e1] shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[#584237] font-medium text-sm">
            لا توجد طلبات تطابق بحثك.
          </div>
        ) : (
          <div className="divide-y divide-[#f0eded]">
            {filtered.map((order) => {
              const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
              return (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-7 py-6 hover:bg-[#f6f3f2]/50 transition-colors">
                  {/* ID + address */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f6f3f2] flex items-center justify-center flex-shrink-0 text-[#F27121]">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-black text-lg tracking-tight">
                         #<span dir="ltr">{order.id.split("-")[0]}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin size={11} className="text-[#584237]" />
                        <p className="text-xs text-[#584237] font-medium">
                          <span dir="ltr">{(order.delivery_address as AddressJson)?.lat} ·{" "}
                          {(order.delivery_address as AddressJson)?.lng}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time + status */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end lg:flex-row lg:items-center">
                    <span className="text-xs text-[#584237] font-medium italic">
                      {formatTime(order.created_at)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Price + action */}
                  <div className="flex items-center gap-3 sm:ms-auto">
                    <p className="text-lg font-black text-[#F27121]">
                      €{order.total_price.toFixed(2)}
                    </p>
                    {cfg.action && (
                      <button
                        onClick={() => {
                           (cfg.actionKey === "accept" ||
                             cfg.actionKey === "pick_up") &&
                            handleTakeOrderToDelivery(order.id);
                        }}
                        disabled={
                          // when loading
                          !!loadingOrderId ||
                          // if delivery out_for_delivery
                          (order.status === "out_for_delivery" &&
                            order.delivery_id === user?.id) ||
                          // if delivery out_for_delivery , Accept its not allowed for you
                           ((cfg.actionKey === "accept" ||
                             cfg.actionKey === "pick_up") &&
                            orders.some(
                              (o) =>
                                o.delivery_id === user?.id &&
                                o.status === "out_for_delivery",
                            )) ||
                          // if delivery the order of out_for_delivery it`s not for you (another delivery)
                          (!!order.delivery_id &&
                            order.delivery_id !== user?.id)
                        }
                        className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed ${cfg.actionStyle}`}>
                        {loadingOrderId === order.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                           <>{cfg.action}</>
                        )}
                      </button>
                    )}
                    <button className="p-2 rounded-xl hover:bg-[#f0eded] text-[#584237] transition-colors">
                       <ChevronLeft size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
