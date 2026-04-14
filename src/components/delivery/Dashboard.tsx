"use client";

import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  MapPin,
  Bike,
  ToggleLeft,
  ToggleRight,
  Banknote,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import Link from "next/link";
import { Order } from "@/types/Order";

// ─── Types ────────────────────────────────────────────────────────────────────

type Json = Record<string, string>;

interface OrderRow {
  created_at: string | null;
  customer_id: string | null;
  delivery_address: Json | null;
  delivery_id: string | null;
  id: string;
  status: string;
  total_price: number;
  updated_at: string | null;
}

interface ProfileRow {
  address: string | null;
  availability_status: boolean | null;
  full_name: string | null;
  id: string;
  phone_number: string | null;
  role: string | null;
  updated_at: string | null;
  vehicle_type: string | null;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROFILE: ProfileRow = {
  id: "usr_01",
  full_name: "Lukas Schmidt",
  phone_number: "+49 30 1234 5678",
  address: "Mitte, Berlin",
  role: "delivery",
  vehicle_type: "bicycle",
  availability_status: true,
  updated_at: new Date().toISOString(),
};

const WEEK_BARS = [
  { day: "Mon", deliveries: 8 },
  { day: "Tue", deliveries: 12 },
  { day: "Wed", deliveries: 7 },
  { day: "Thu", deliveries: 15 },
  { day: "Fri", deliveries: 10 },
  { day: "Sat", deliveries: 18 },
  { day: "Sun", deliveries: 14 },
];

const STATUS_CFG: Record<string, { label: string; dot: string; pill: string }> =
  {
    delivered: {
      label: "Delivered",
      dot: "bg-green-500",
      pill: "bg-green-50 text-green-700 border-green-100",
    },
    out_for_delivery: {
      label: "Out for Delivery",
      dot: "bg-[#F27121] animate-pulse",
      pill: "bg-orange-50 text-[#9F4200] border-orange-100",
    },
    pending: {
      label: "Pending",
      dot: "bg-blue-400",
      pill: "bg-blue-50 text-blue-700 border-blue-100",
    },
    cancelled: {
      label: "Cancelled",
      dot: "bg-red-400",
      pill: "bg-red-50 text-red-600 border-red-100",
    },
  };

const DeliveriesTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1b1b] text-white px-4 py-3 rounded-xl shadow-xl text-xs">
      <p className="font-black mb-1">{label}</p>
      <p className="text-[#F27121] font-bold">{payload[0].value} deliveries</p>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Dashboard({
  activeOrderData,
  recentOrdersData,
}: {
  activeOrderData: Order | null;
  recentOrdersData: Order[];
}) {
  const [available, setAvailable] = useState(
    PROFILE.availability_status ?? false,
  );

  const completedToday = recentOrdersData.filter(
    (o: Order) => o.status === "delivered",
  ).length;
  const earningsToday = recentOrdersData
    .filter((o: Order) => o.status === "delivered")
    .reduce((s: number, o: Order) => s + o.total_price * 0.12, 0);
  const activeOrder = activeOrderData;

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 pb-28 lg:pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          <span className="text-[10px] font-black text-[#F27121] tracking-[0.25em] uppercase mb-2 block">
            Berlin Food · Delivery
          </span>
          <h1 className="text-5xl font-extrabold tracking-tighter leading-none">
            Dashboard
          </h1>
          <p className="text-[#584237] mt-3 font-medium text-base">
            Welcome back, {PROFILE.full_name?.split(" ")[0]} 👋
          </p>
        </div>

        <button
          onClick={() => setAvailable((v) => !v)}
          className={`flex items-center gap-3 px-6 py-4 rounded-full font-bold text-sm transition-all active:scale-95 shadow-sm border ${
            available
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-[#f0eded] text-[#584237] border-[#e5e2e1]"
          }`}>
          {available ? (
            <ToggleRight size={20} className="text-green-600" />
          ) : (
            <ToggleLeft size={20} className="text-[#584237]" />
          )}
          {available ? "Available for Deliveries" : "Set as Unavailable"}
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={<Package size={20} />}
          label="Active Order"
          value="1"
          sub="In transit now"
          accent
        />
        <StatCard
          icon={<CheckCircle size={20} />}
          label="Completed Today"
          value={String(completedToday)}
          sub="Out of 3 assigned"
        />
        <StatCard
          icon={<Banknote size={20} />}
          label="Today's Earnings"
          value={`€${earningsToday.toFixed(2)}`}
          sub="12% per delivery"
        />
        <StatCard
          icon={<Clock size={20} />}
          label="Avg. Delivery"
          value="18 min"
          sub="This week"
        />
      </div>

      {/* Active order banner */}
      {activeOrder && <ActiveOrderBanner order={activeOrder} />}

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        {/* Bar chart */}
        <div className="lg:col-span-7 bg-[#f6f3f2] p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">
              Weekly Deliveries
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F27121] inline-block" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#584237]">
                Last 7 Days
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={WEEK_BARS}
              barCategoryGap="38%"
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid
                vertical={false}
                stroke="#e5e2e1"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fontWeight: 700, fill: "#584237" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#584237" }}
                width={28}
              />
              <Tooltip
                content={<DeliveriesTooltip  />}
                cursor={{ fill: "#F27121", opacity: 0.06 }}
              />
              <Bar dataKey="deliveries" fill="#F27121" radius={[8, 8, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-5 bg-[#f6f3f2] p-8 rounded-2xl">
          <h3 className="text-xl font-bold tracking-tight mb-6">
            Recent Orders
          </h3>
          <div className="space-y-3">
            {recentOrdersData.map((order: Order) => {
              const cfg = STATUS_CFG[order.status] ?? STATUS_CFG.pending;
              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#e5e2e1] hover:border-[#F27121]/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`}
                    />
                    <div>
                      <p className="text-sm font-black">
                        #{order.id.split("-")[0].toUpperCase()}
                      </p>
                      {/* <p className="text-[10px] text-[#584237] font-medium mt-0.5">
                        {order.delivery_address?.street as string}
                      </p> */}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#F27121]">
                      €{order.total_price.toFixed(2)}
                    </p>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border mt-1 inline-block ${cfg.pill}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-2xl flex flex-col justify-between transition-colors duration-300 ${accent ? "bg-[#9F4200] text-white" : "bg-[#f6f3f2] hover:bg-[#e5e2e1]"}`}>
      <div className="flex justify-between items-start mb-6">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm ${accent ? "bg-white/20 text-white" : "bg-white text-[#F27121]"}`}>
          {icon}
        </div>
        <TrendingUp
          size={14}
          className={accent ? "text-white/30" : "text-[#F27121]/30"}
        />
      </div>
      <div>
        <p
          className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${accent ? "text-white/70" : "text-[#584237]"}`}>
          {label}
        </p>
        <p
          className={`text-2xl font-extrabold tracking-tighter ${accent ? "text-white" : "text-[#1c1b1b]"}`}>
          {value}
        </p>
        <p
          className={`text-[10px] font-medium mt-1 ${accent ? "text-white/60" : "text-[#584237]"}`}>
          {sub}
        </p>
      </div>
    </div>
  );
}

function ActiveOrderBanner({ order }: { order: Order }) {
  return (
    <div className="bg-[#9F4200] rounded-2xl p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xl shadow-orange-900/10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <Bike size={22} className="text-white" />
        </div>
        <div>
          <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">
            Active Delivery · #{order.id.split("-")[0].toUpperCase()}
          </p>
          <h3 className="text-white font-black text-xl ">
            {/* {order.delivery_address?.street}, {order.delivery_address?.city}  */}
            {/* we working about this feature */}
          </h3>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href={`/delivery/for-delivery/${order.id}`}
          className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2.5 rounded-full">
          <MapPin size={14} className="text-white" />
          <span className="text-white text-xs font-bold">Navigate</span>
        </Link>
        <div className="flex items-center gap-2 bg-white text-[#9F4200] px-4 py-2.5 rounded-full">
          <CheckCircle size={14} />
          <span className="text-xs font-black">Mark Delivered</span>
        </div>
      </div>
    </div>
  );
}
