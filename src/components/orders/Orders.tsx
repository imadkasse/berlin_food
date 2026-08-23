"use client";
import { Json } from "@/types/database.types";
import { useState } from "react";
import { updateOrderStatus } from "@/api/orders";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  ChefHat,
  Bike,
  MapPin,
  RotateCcw,
  Clock,
  PackageCheck,
  PersonStanding,
  CheckCircle2,
  Star,
  X,
} from "lucide-react";
import { rateDelivery } from "@/api/profiles";
import Image from "next/image";
// import { Json } from "@/types/supabase"; // adjust path if needed

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  category_id: string | null;
  description: string | null;
  id: string;
  image_url: string | null;
  is_available: boolean | null;
  name: string;
  price: number;
}

export interface OrderItem {
  created_at: string;
  id: string;
  menu_item_id: string | null;
  order_id: string | null;
  price: number | null;
  quantity: number | null;
  updated_at: string | null;
  menu_item: MenuItem | null; // joined via Supabase select
}

export interface Order {
  created_at: string | null;
  customer_id: string | null;
  delivery_address: Json | null;
  delivery_id: string | null;
  id: string;
  status: string;
  total_price: number;
  updated_at: string | null;
  order_items: OrderItem[]; // joined via Supabase select
  progress?: number; // 0–100, for "preparing" orders
  eta?: string; // e.g. "12–15 MINS"
}

interface MyOrdersProps {
  ordersData: Order[] | null;
}

interface ActiveOrderCardProps {
  statusVariant: "pending" | "preparing" | "delivery" | "ready";
  orderId: string;
  title: string;
  price: string;
  items: string[];
  image: string;
  progress?: number;
  eta?: string;
  isDelivery?: boolean;
  status: string;
  id: string;
  deliveryId: string | null;
  onStatusUpdate: (id: string, newStatus: string) => Promise<void>;
}

interface HistoryItemProps {
  image: string;
  title: string;
  date: string;
  address: string;
  price: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES = [
  "pending",
  "preparing",
  "on_the_way",
  "out_for_delivery",
  "ready_for_pickup",
  "ready",
];

const toStatusVariant = (
  status: string,
): "pending" | "preparing" | "delivery" | "ready" => {
  if (status === "pending") return "pending";
  if (status === "out_for_delivery") return "delivery";
  if (status === "ready") return "ready";
  return "preparing";
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
};

const STATUS_LABELS: Record<string, string> = {
  pending: "قيد الانتظار",
  preparing: "قيد التحضير",
  on_the_way: "في الطريق",
  out_for_delivery: "في الطريق",
  ready_for_pickup: "جاهز للاستلام",
  ready: "جاهز",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
};

const extractAddress = (addr: Json | null): string => {
  if (!addr || typeof addr !== "object" || Array.isArray(addr)) return "";
  const a = addr as Record<string, unknown>;
  return (a.street as string) ?? (a.address as string) ?? "";
};

/** Use the first item's menu_item image as the card hero */
const getPrimaryImage = (items: OrderItem[]): string =>
  items[0]?.menu_item?.image_url ?? "";

/** Single item → its name; multiple → "Burger +2 more" */
const getPrimaryTitle = (items: OrderItem[]): string => {
  if (items.length === 0) return "طلبك";
  const first = items[0]?.menu_item?.name ?? "عنصر";
  return items.length === 1 ? first : `${first} و${items.length - 1} أكثر`;
};

/** Format each item as "2× Truffle Fries" */
const formatItems = (items: OrderItem[]): string[] =>
  items
    .filter((item) => item.menu_item)
    .map((item) => `${item.quantity ?? 1}× ${item.menu_item!.name}`);

// ─── Status config ─────────────────────────────────────────────────────────────

const statusConfig = {
  pending: {
    icon: PersonStanding,
    label: "قيد الانتظار",
    colors: "bg-purple-50 text-purple-700 border-purple-200 shadow-purple-100",
  },
  preparing: {
    icon: ChefHat,
    label: "قيد التحضير",
    colors: "bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100",
  },
  delivery: {
    icon: Bike,
    label: "في الطريق إليك",
    colors: "bg-sky-50 text-sky-700 border-sky-200 shadow-sky-100",
  },
  ready: {
    icon: PackageCheck,
    label: "جاهز",
    colors:
      "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-emerald-100",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const MyOrders = ({ ordersData }: MyOrdersProps) => {
  const [orders, setOrders] = useState(ordersData);
  const supabase = createClient();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const updatedOrder = await updateOrderStatus(supabase, id, newStatus);
      setOrders(
        (prev) =>
          prev &&
          prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)),
      );
      toast.success(
        `تم تحديث حالة الطلب إلى ${STATUS_LABELS[newStatus] ?? "حالة غير معروفة"}`,
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("فشل تحديث حالة الطلب. يرجى المحاولة مرة أخرى.");
    }
  };

  const activeOrders = orders?.filter((o) =>
    ACTIVE_STATUSES.includes(o.status),
  );
  const pastOrders = orders?.filter((o) => !ACTIVE_STATUSES.includes(o.status));

  return (
    <main className="w-full min-h-screen pb-28 px-5 sm:px-10 pt-10 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <header className="mb-14">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9F4200] mb-3">
          برلين فود
        </p>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tighter text-[#1C1B1B] leading-none mb-4">
          طلباتي
        </h1>
        <p className="text-[#6B6867] font-medium text-base max-w-md">
          من مطبخنا إلى طاولتك — تتبع كل لحظة من الرحلة.
        </p>
      </header>

      {/* ── Active Orders ── */}
      {activeOrders && activeOrders.length > 0 && (
        <section className="mb-20">
          <SectionDivider label="الطلبات الحالية" accent />
          <div className="space-y-6 mt-8">
            {activeOrders?.map((order) => {
              const variant = toStatusVariant(order.status);
              const isDelivery = variant === "delivery";
              return (
                <ActiveOrderCard
                  key={order.id}
                  id={order.id}
                  status={order.status}
                  statusVariant={variant}
                  orderId={`#${order.id.slice(0, 8).toUpperCase()}`}
                  title={getPrimaryTitle(order.order_items)}
                  price={order.total_price.toFixed(2)}
                  items={formatItems(order.order_items)}
                  image={getPrimaryImage(order.order_items)}
                  progress={isDelivery ? undefined : (order.progress ?? 0)}
                  eta={order.eta}
                  isDelivery={isDelivery}
                  deliveryId={order.delivery_id}
                  onStatusUpdate={handleUpdateStatus}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* ── Order History ── */}
      {pastOrders && pastOrders.length > 0 && (
        <section>
          <SectionDivider label="سجل الطلبات" />
          <div className="mt-8 flex flex-col gap-3">
            {pastOrders.map((order) => (
              <HistoryItem
                key={order.id}
                image={getPrimaryImage(order.order_items)}
                title={getPrimaryTitle(order.order_items)}
                date={formatDate(order.created_at)}
                address={extractAddress(order.delivery_address)}
                price={order.total_price.toFixed(2)}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

// ─── Section Divider ──────────────────────────────────────────────────────────

const SectionDivider = ({
  label,
  accent,
}: {
  label: string;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-4">
    <span
      className={`text-[10px] font-black uppercase tracking-[0.22em] whitespace-nowrap ${
        accent ? "text-[#9F4200]" : "text-[#B5B0AE]"
      }`}>
      {label}
    </span>
    <div className="h-px flex-1 bg-[#EDE9E8]" />
  </div>
);

// ─── Active Order Card ────────────────────────────────────────────────────────

const ActiveOrderCard = ({
  statusVariant,
  orderId,
  title,
  price,
  progress,
  eta,
  isDelivery,
  items,
  image,
  status,
  id,
  deliveryId,
  onStatusUpdate,
}: ActiveOrderCardProps) => {
  const { icon: StatusIcon, label, colors } = statusConfig[statusVariant];
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const supabase = createClient();

  const handleMarkAsDone = async () => {
    setShowRating(true);
  };

  const completeOrder = async (rating?: number) => {
    setIsUpdating(true);
    try {
      if (rating && deliveryId) {
        await rateDelivery(supabase, deliveryId, rating);
      }
      await onStatusUpdate(id, "delivered");
    } catch (error) {
      console.error("Error completing order:", error);
    } finally {
      setIsUpdating(false);
      setShowRating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(28,27,27,0.07)] flex flex-col md:flex-row group hover:shadow-[0_16px_48px_rgba(28,27,27,0.12)] transition-shadow duration-300">
      <div className="relative w-full md:w-64 h-52 md:h-auto flex-shrink-0 overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            unoptimized
            width={40}
            height={40}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden" />
      </div>

      <div className="flex-1 p-7 flex flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#B5B0AE]">
              {orderId}
            </p>
            <h3 className="text-xl font-bold text-[#1C1B1B] leading-snug">
              {title}
            </h3>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm flex-shrink-0 ${colors}`}>
            <StatusIcon size={12} strokeWidth={2.5} aria-hidden="true" />
            {label}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="text-xs font-semibold text-[#6B6867] bg-[#F6F3F2] px-3 py-1.5 rounded-full">
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#F0EDED]">
          <p className="text-2xl font-black text-[#F27121]">{price} د.ج</p>
          {isDelivery ? (
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 bg-[#F6F3F2] text-[#1C1B1B] text-sm font-bold px-5 py-3 rounded-full hover:bg-[#EDE9E8] active:scale-95 transition-all">
                <MapPin size={14} aria-hidden="true" />
                تتبع
              </button>
              {status === "out_for_delivery" && (
                <button
                  onClick={handleMarkAsDone}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 bg-[#1C1B1B] text-white text-sm font-bold px-5 py-3 rounded-full hover:bg-[#333] active:scale-95 transition-all shadow-md shadow-black/10 disabled:opacity-50">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  {isUpdating ? "جاري التحديث..." : "تأكيد الاستلام"}
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center gap-3">
              <div className="flex-1 bg-[#F0EDED] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#F27121] to-[#F5A623] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${progress ?? 0}%` }}
                />
              </div>
              {eta && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#F27121] bg-orange-50 px-3 py-1 rounded-full whitespace-nowrap border border-orange-100">
                  <Clock size={10} aria-hidden="true" />
                  {eta}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {showRating && (
        <RatingModal
          onClose={() => setShowRating(false)}
          onConfirm={(rating) => completeOrder(rating)}
          onSkip={() => completeOrder()}
          isSubmitting={isUpdating}
        />
      )}
    </div>
  );
};

// ─── Rating Modal ─────────────────────────────────────────────────────────────

interface RatingModalProps {
  onClose: () => void;
  onConfirm: (rating: number) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

const RatingModal = ({
  onClose,
  onConfirm,
  onSkip,
  isSubmitting,
}: RatingModalProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-white w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <button
          onClick={onClose}
          className="absolute end-6 top-6 p-2 text-[#B5B0AE] hover:text-[#1C1B1B] transition-colors">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
            <Star className="text-[#F27121] fill-[#F27121]" size={32} />
          </div>

          <h2 className="text-2xl font-black text-[#1C1B1B] mb-2">
            قيّم التوصيل
          </h2>
          <p className="text-[#6B6867] font-medium text-sm mb-8">
            كيف كان التوصيل لطلبك؟ تقييمك يساعدنا على التحسن.
          </p>

          <div className="flex gap-2 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="p-1 transition-transform active:scale-90">
                <Star
                  size={36}
                  className={`transition-colors duration-200 ${
                    (hover || rating) >= star
                      ? "fill-[#F27121] text-[#F27121]"
                      : "text-[#EDE9E8] fill-transparent"
                  }`}
                  strokeWidth={2.5}
                />
              </button>
            ))}
          </div>

          <div className="w-full flex flex-col gap-3">
            <button
              onClick={() => rating > 0 && onConfirm(rating)}
              disabled={rating === 0 || isSubmitting}
              className="w-full bg-[#1C1B1B] text-white font-black text-sm py-4 rounded-2xl hover:bg-[#333] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100">
              {isSubmitting ? "جاري التحديث..." : "إرسال التقييم"}
            </button>
            <button
              onClick={onSkip}
              disabled={isSubmitting}
              className="w-full text-[#1C1B1B] font-bold text-sm py-4 rounded-2xl hover:bg-[#F6F3F2] active:scale-[0.98] transition-all">
              ربما لاحقًا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── History Item ─────────────────────────────────────────────────────────────

const HistoryItem = ({
  image,
  title,
  date,
  address,
  price,
}: HistoryItemProps) => (
  <div className="flex items-center gap-5 p-4 rounded-2xl border border-[#EDE9E8] bg-white/60 hover:bg-white hover:shadow-md hover:border-[#E0DAD8] transition-all duration-200 group">
    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border border-[#EDE9E8]">
      {image && (
        <Image
          src={image}
          alt={title}
          unoptimized
          width={40}
          height={40}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-[#1C1B1B] text-base truncate">{title}</h4>
      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
        <span className="text-xs font-medium text-[#9B9593]">{date}</span>
        {address && (
          <>
            <span className="text-[#D4CECC] text-xs">•</span>
            <span className="text-xs font-medium text-[#9B9593] flex items-center gap-1">
              <MapPin size={10} aria-hidden="true" />
              {address}
            </span>
          </>
        )}
      </div>
    </div>
    <div className="flex flex-col items-end gap-2 flex-shrink-0">
      <p className="font-black text-[#1C1B1B] text-lg">{price} د.ج</p>
      <button className="inline-flex items-center gap-1.5 text-[#F27121] text-[11px] font-bold px-4 py-1.5 rounded-full border border-[#F27121]/25 hover:bg-[#FFF5EE] active:scale-95 transition-all">
        <RotateCcw size={11} aria-hidden="true" />
        إعادة الطلب
      </button>
    </div>
  </div>
);

export default MyOrders;
