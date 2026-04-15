"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  TrendingDown,
  UtensilsCrossed,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Timer,
  X,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Clock,
  Loader2,
} from "lucide-react";
import { Order_info, Order_info_items } from "@/types/Order";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/api/orders";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Menu } from "@/types/Menu";

// ─── Types ────────────────────────────────────────────────────────────────────

type KitchenStatus =
  | "pending"
  | "preparing"
  | "ready_for_pickup"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  KitchenStatus,
  {
    label: string;
    dot: string;
    pill: string;
  }
> = {
  pending: {
    label: "Pending",
    dot: "bg-yellow-500",
    pill: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  },
  preparing: {
    label: "Preparing",
    dot: "bg-[#F27121] animate-pulse",
    pill: "bg-orange-50 text-[#9F4200] border border-orange-200",
  },
  ready_for_pickup: {
    label: "Ready for Pickup",
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    dot: "bg-purple-500 animate-pulse",
    pill: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  delivered: {
    label: "Delivered",
    dot: "bg-green-500",
    pill: "bg-green-50 text-green-700 border border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-700 border border-red-200",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderManager({
  ordersData,
  totalCount,
  currentPage,
}: {
  ordersData: Order_info[];
  totalCount: number;
  currentPage: number;
}) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order_info | null>(null);
  const [orders, setOrders] = useState<Order_info[]>(ordersData);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const router = useRouter();
  const pageSize = 3;
  const totalPages = Math.ceil(totalCount / pageSize);
  const filtered = orders.filter(
    (o) =>
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer as { full_name: string })?.full_name
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const handlePageChange = (newPage: number) => {
    // This triggers the server to re-run getOrderWithItems
    router.push(`/admin/orders?page=${newPage}`);
  };
  const handleStatusChange = async (
    orderId: string,
    newStatus: KitchenStatus,
  ) => {
    const supabase = createClient();
    setLoadingOrderId(orderId);
    try {
      await updateOrderStatus(supabase, orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
      // Update selected order if it's the one being modified
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
      toast.success(`updating order status successfully`);
    } catch (error: unknown) {
      console.log(error);
      toast.error("error when accepting order", {
        description: `error : ${error instanceof Error ? error.message : "Unknown error"}`,
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F3F2] mb-16">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#F27121] animate-pulse" />
            <span className="text-xs font-bold text-[#F27121] uppercase tracking-wider">
              Berlin Kitchen Dashboard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#1C1B1B] mb-2">
            Order Manager
          </h1>
          <p className="text-[#5c5b5b] text-sm max-w-2xl">
            Monitor and manage all incoming orders in real-time
          </p>
        </header>

        {/* ── Stats Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Average Prep Time */}
          <div className="bg-[#F27121] text-white p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <Timer size={24} />
              <div className="flex items-center gap-1.5 text-xs bg-white/20 px-3 py-1 rounded-full">
                <TrendingDown size={14} />
                <span className="font-bold">-2m</span>
              </div>
            </div>
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wide mb-1">
              Avg Prep Time
            </p>
            <h3 className="text-3xl font-black">18 min</h3>
          </div>

          {/* In Progress */}
          <StatCard
            icon={<UtensilsCrossed size={24} className="text-[#F27121]" />}
            label="In Progress"
            value="8"
          />

          {/* Completed Today */}
          <StatCard
            icon={<CheckCircle size={24} className="text-[#F27121]" />}
            label="Completed Today"
            value="42"
          />
        </section>

        {/* ── Orders Table ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#F0EDED]">
          {/* Table Controls */}
          <div className="p-6 border-b border-[#F0EDED]">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5c5b5b]"
                />
                <input
                  type="text"
                  placeholder="Search orders or customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm font-medium text-[#1C1B1B] placeholder:text-[#5c5b5b] focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm font-bold text-[#1C1B1B] hover:bg-[#F0EDED] transition-colors">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm font-bold text-[#1C1B1B] hover:bg-[#F0EDED] transition-colors">
                  <Download size={16} />
                  <span>Export</span>
                </button>
                <button className="p-2.5 bg-[#F6F3F2] rounded-xl hover:bg-[#F0EDED] transition-colors">
                  <RefreshCw size={18} className="text-[#1C1B1B]" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-[#F6F3F2]/50 text-[#5c5b5b] text-xs font-bold uppercase tracking-wide">
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Items</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDED]">
                {filtered.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onViewDetails={() => setSelectedOrder(order)}
                    loading={loadingOrderId}
                    onStatusChange={handleStatusChange}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-[#5c5b5b] text-sm">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex items-center justify-between">
            <p className="text-xs text-[#5c5b5b] font-semibold">
              Showing {(currentPage - 1) * pageSize + 1}–
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
              orders
            </p>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 disabled:opacity-30 cursor-pointer">
                <ChevronLeft size={16} />
              </button>

              {/* Generate page numbers dynamically */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => handlePageChange(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer ${
                    currentPage === n
                      ? "bg-[#F27121] text-white"
                      : "hover:bg-white"
                  }`}>
                  {n}
                </button>
              ))}

              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 disabled:opacity-30 cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          loading={loadingOrderId}
        />
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#F0EDED]">
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#F6F3F2] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-[#5c5b5b] text-xs font-semibold uppercase tracking-wide mb-1">
        {label}
      </p>
      <h3 className="text-3xl font-black text-[#1C1B1B]">{value}</h3>
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────

function OrderRow({
  order,
  onViewDetails,
  onStatusChange,
  loading,
}: {
  order: Order_info;
  onViewDetails: () => void;
  onStatusChange: (orderId: string, status: KitchenStatus) => void;
  loading: string | null;
}) {
  const cfg = STATUS_CONFIG[order.status as KitchenStatus];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toDay = new Date().toISOString().split("T")[0];
  return (
    <tr className="hover:bg-[#F6F3F2]/30 transition-colors">
      {/* Order ID */}
      <td className="px-6 py-4">
        <div>
          <span className="text-sm font-bold text-[#1C1B1B] block">
            {`ORD-` + order.id?.split("-")[0].toUpperCase()}
          </span>
          <span className="text-xs text-[#5c5b5b] flex items-center gap-1 mt-0.5">
            <Clock size={12} />
            {toDay === order.created_at
              ? `Today ${new Date(order.created_at as string).toLocaleTimeString()}`
              : new Date(order.created_at as string).toLocaleString()}
          </span>
        </div>
      </td>

      {/* Customer */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold `}>
            <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl group relative border-4 border-white">
              <Image
                src={`https://ui-avatars.com/api/?name=${(order.customer as { full_name: string })?.full_name}&background=random&size=48`}
                alt={
                  (order.customer as { full_name: string })?.full_name ||
                  "Profile"
                }
                unoptimized
                width={40}
                height={40}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div>
            <span className="text-sm font-bold text-[#1C1B1B] block">
              {(order.customer as { full_name: string })?.full_name}
            </span>
            <span className="text-xs text-[#5c5b5b]">
              {(order.customer as { phone_number: string })?.phone_number}
            </span>
          </div>
        </div>
      </td>

      {/* Item thumbnails */}
      <td className="px-6 py-4">
        <div className="flex -space-x-2">
          {(order.items as Order_info_items[])
            ?.slice(0, 3)
            .map((item: Order_info_items, i: number) => {
              return (
                <div
                  key={i}
                  className="w-9 h-9 rounded-lg border-2 border-white overflow-hidden shadow-sm"
                  title={item.menu_item?.name}>
                  <Image
                    src={item.menu_item?.image_url || ""}
                    alt={item.menu_item?.name}
                    width={48}
                    height={48}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          {(order.items as Menu[])?.length > 3 && (
            <div className="w-9 h-9 rounded-lg border-2 border-white bg-[#F0EDED] flex items-center justify-center text-xs font-bold text-[#1C1B1B]">
              +{(order.items as Menu[])?.length - 3}
            </div>
          )}
        </div>
      </td>

      {/* Status - Editable Dropdown */}
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-2 transition-all hover:shadow-sm ${cfg.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#F0EDED] py-2 min-w-[180px] z-20">
                {loading === order.id ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  (
                    Object.entries(STATUS_CONFIG) as [
                      KitchenStatus,
                      (typeof STATUS_CONFIG)[KitchenStatus],
                    ][]
                  ).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(order.id as string, status);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-[#F6F3F2] transition-colors flex items-center gap-2 ${
                        order.status === status ? "bg-[#F6F3F2]" : ""
                      }`}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
                      />
                      {config.label}
                    </button>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </td>

      {/* Total */}
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-[#1C1B1B]">
          €{order.total_price?.toFixed(2)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 bg-[#1C1B1B] text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors">
          View Details
        </button>
      </td>
    </tr>
  );
}

// ─── Order Details Modal ──────────────────────────────────────────────────────

function OrderDetailsModal({
  order,
  onClose,
  onStatusChange,
  loading,
}: {
  order: Order_info;
  onClose: () => void;
  onStatusChange: (orderId: string, status: KitchenStatus) => void;
  loading: string | null;
}) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const cfg = STATUS_CONFIG[currentStatus as KitchenStatus];

  const handleStatusUpdate = (newStatus: KitchenStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(order.id as string, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-[#F0EDED] px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#1C1B1B]">
              Order Details
            </h2>
            <p className="text-sm text-[#5c5b5b] mt-1">
              {`ORD-` + order.id?.split("-")[0].toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F6F3F2] rounded-lg transition-colors">
            <X size={20} className="text-[#1C1B1B]" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-6">
          {/* Order Time & Status */}
          <div className="flex items-center justify-between pb-6 border-b border-[#F0EDED]">
            <div className="flex items-center gap-2 text-sm text-[#5c5b5b]">
              <Clock size={16} />
              <span className="font-semibold">
                {new Date(order.created_at as string).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#5c5b5b] uppercase tracking-wide">
                Status:
              </span>
              {loading === order.id ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <select
                  value={currentStatus as KitchenStatus}
                  onChange={(e) =>
                    handleStatusUpdate(e.target.value as KitchenStatus)
                  }
                  disabled={!!loading}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border-2 cursor-pointer transition-all ${cfg.pill}`}>
                  {(
                    Object.entries(STATUS_CONFIG) as [
                      KitchenStatus,
                      (typeof STATUS_CONFIG)[KitchenStatus],
                    ][]
                  ).map(([status, config]) => (
                    <option key={status} value={status}>
                      {config.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-sm font-bold text-[#1C1B1B] uppercase tracking-wide mb-4">
              Customer Information
            </h3>
            <div className="bg-[#F6F3F2] rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold `}>
                  <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl group relative border-4 border-white">
                    <Image
                      src={`https://ui-avatars.com/api/?name=${(order.customer as { full_name: string })?.full_name}&background=random&size=48`}
                      alt={
                        (order.customer as { full_name: string })?.full_name ||
                        "Profile"
                      }
                      unoptimized
                      width={40}
                      height={40}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-[#1C1B1B]">
                    {(order.customer as { full_name: string })?.full_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5c5b5b]">
                <Mail size={16} />
                <span>{(order.customer as { email: string })?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#5c5b5b]">
                <Phone size={16} />
                <span>
                  {(order.customer as { phone_number: string })?.phone_number}
                </span>
              </div>
              {order.delivery_address && (
                <div className="flex items-start gap-2 text-sm text-[#5c5b5b]">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    {(order.delivery_address as { address: string })?.address ||
                      "only lat and lng provided"}{" "}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-bold text-[#1C1B1B] uppercase tracking-wide mb-4">
              Order Items
            </h3>
            <div className="space-y-3">
              {(order.items as Order_info_items[]).map(
                (item: Order_info_items, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-[#F6F3F2] rounded-xl p-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.menu_item?.image_url || ""}
                        alt={item.menu_item?.name}
                        unoptimized
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#1C1B1B] text-sm">
                        {item.menu_item?.name}
                      </p>
                      <p className="text-xs text-[#5c5b5b] mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C1B1B]">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-xs text-[#5c5b5b] mt-1">
                        €{item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Payment & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#1C1B1B] uppercase tracking-wide mb-3">
                Payment Method
              </h3>
              <div className="bg-[#F6F3F2] rounded-xl p-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#5c5b5b]" />
                <span className="font-semibold text-[#1C1B1B] text-sm">
                  'Cash'
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1C1B1B] uppercase tracking-wide mb-3">
                Total Amount
              </h3>
              <div className="bg-[#F27121] text-white rounded-xl p-4">
                <p className="text-2xl font-black">
                  €{(order as Order_info).total_price?.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Special Notes */}
          {/* {(order as any).notes && (
            <div>
              <h3 className="text-sm font-bold text-[#1C1B1B] uppercase tracking-wide mb-3">
                Special Notes
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Package size={18} className="text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-900 font-medium">
                    {(order as Order_info).notes}
                  </p>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[#F0EDED] px-8 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#F6F3F2] text-[#1C1B1B] font-bold text-sm rounded-lg hover:bg-[#F0EDED] transition-colors">
            Close
          </button>
          <button className="px-6 py-2.5 bg-[#F27121] text-white font-bold text-sm rounded-lg hover:bg-[#9F4200] transition-colors">
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}
