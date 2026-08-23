"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  CreditCard,
  UtensilsCrossed,
  BarChart2,
  UserPlus,
  Calendar,
  Bell,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  badge: string;
  badgePositive: boolean;
}

interface DishProps {
  image: string;
  name: string;
  sold: number;
  pct: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: StatCardProps[] = [
  {
    icon: <CreditCard size={22} />,
    label: "إجمالي الإيرادات",
    value: "€42,850.00",
    badge: "+12.5%",
    badgePositive: true,
  },
  {
    icon: <UtensilsCrossed size={22} />,
    label: "إجمالي الطلبات",
    value: "1,284",
    badge: "+8.2%",
    badgePositive: true,
  },
  {
    icon: <BarChart2 size={22} />,
    label: "متوسط قيمة الطلب",
    value: "€33.40",
    badge: "-2.1%",
    badgePositive: false,
  },
  {
    icon: <UserPlus size={22} />,
    label: "العملاء الجدد",
    value: "412",
    badge: "+24.0%",
    badgePositive: true,
  },
];

const CHART_BARS = [
  { day: "الاثنين", revenue: 6200 },
  { day: "الثلاثاء", revenue: 8100 },
  { day: "الأربعاء", revenue: 5500 },
  { day: "الخميس", revenue: 9400 },
  { day: "الجمعة", revenue: 4200 },
  { day: "السبت", revenue: 10800 },
  { day: "الأحد", revenue: 8600 },
];

// 75 out of 100 — represents 75% efficiency on the gauge
const GAUGE_DATA = [{ name: "الكفاءة", value: 75 }];

const TOP_DISHES: DishProps[] = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYVmR-LFwdIEzpynsMRvCx8ost3NGYNNwRuYcRlobOZO_W8O0FtwuzJ3Yvzwht_tEQXwO_3tIIaUPmIfPryFYqybocKLvIErVIMRzavoeE1ouyx3B_cUNqgJPixDJYoPXiLIfhFIVBIeU08OXhdHhseVmxfOY6HXUd_Hmm83BuHilngHB1bzu8f3HCnME4cWnSZsJwdnr07kCIKfdu5eUpzQuerpin73rrOQa-16dxW3GB-4PrRUHhzoidKnJwAQgp0I1aj_7R5hQt",
    name: "كاري فورست برلين المميز",
    sold: 342,
    pct: 85,
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUyHShj6bBvTEspzdh9lIqHA-ioAobEM55DGmytGF3wuMR9mgxQvMwljz1-oA2NU10NAJVXvfhjdKyTPFFDdTnN326DiVOAWX0kObXVgyvIKvykd3I_JZ6A_z2nz0TMreD6ypQ3u2ZNVMzZUA6Knx0Q6n92wmUC2ozmmE067QU94RJDtOGYTwK3SfKDPHxRcPmqaSFV8Rek-oXUHtqPz9mTOaDhlJaUx0GvyigzpZ-WE7HGVBJ4-I-ZOvt7yjeW0b-yeXYnLQ8i-eH",
    name: "برغر واغيو ميته",
    sold: 284,
    pct: 70,
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDINSzbDYNtsKAilR2pFx8DbadOYqn7UHa3H8lw8QFihw30GJWGYX0UNOtDBQsryrgWjlmOpaqa3Hpl01XzmrCU48WjcYkJUKUkdX42l93xEcUlgUrF4fvfFN6ee5attAws4oFoIP5CPJGi6HJSrQJD0G1VRwqNvsxrIOpaBBJdZrwSic860auLCHbGXhD7ZFpW3vhIw3d3E-6vt399WrinLUauLHE6jm_cPB3ZKKp9lQHQ1lpKhCCP4pu3jeCebjzPfAfAhV3cNC1v",
    name: "طبق سبري النباتي",
    sold: 198,
    pct: 55,
  },
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const RevenueTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: { value: number }[];
  label: React.ReactNode;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1c1b1b] text-white px-4 py-3 rounded-xl shadow-xl text-xs">
      <p className="font-black mb-1">{label}</p>
      <p className="text-[#F27121] font-bold">
        €{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10">
      {/* ── Header ── */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
        <div>
          <span className="text-sm font-bold text-[#F27121] tracking-[0.2em] uppercase mb-2 block">
            منظومة برلين فود
          </span>
          <h2 className="text-5xl font-extrabold tracking-tighter text-[#1c1b1b] leading-none">
            أداء المطبخ
          </h2>
        </div>

        <div className="flex gap-3 items-center">
          <div className="px-5 py-3 bg-[#f6f3f2] rounded-full flex items-center gap-2 border border-[#e5e2e1]">
            <Calendar size={16} className="text-[#F27121]" />
            <span className="font-bold text-sm">24 أكتوبر – 30 أكتوبر 2023</span>
          </div>
          <button className="w-11 h-11 bg-[#e5e2e1] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Bell size={18} className="text-[#1c1b1b]" />
          </button>
        </div>
      </header>

      {/* ── Stats Bento ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-8 bg-[#f6f3f2] p-8 rounded-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">
              اتجاهات الإيرادات الأسبوعية
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#F27121] inline-block" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#584237]">
                آخر 7 أيام
              </span>
            </div>
          </div>

          <div dir="ltr">
            <ResponsiveContainer width="100%" height={210}>
              <BarChart
              data={CHART_BARS}
              barCategoryGap="35%"
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
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
                width={38}
              />
              <Tooltip
                content={
                  <RevenueTooltip active={false} payload={[]} label="" />
                }
                cursor={{ fill: "#F27121", opacity: 0.06 }}
              />
              <Bar dataKey="revenue" fill="#F27121" radius={[8, 8, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Orders */}
        <div className="lg:col-span-4 bg-[#e5e2e1] p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-7">
              الطلبات المباشرة
            </h3>
            <div className="space-y-5">
              <LiveOrderRow
                dot="bg-green-500 animate-pulse"
                label="قيد التحضير"
                count="12"
              />
              <LiveOrderRow
                dot="bg-orange-400"
                label="جاهزة للاستلام"
                count="08"
              />
              <LiveOrderRow
                dot="bg-stone-300"
                label="المكتملة (اليوم)"
                count="142"
              />
            </div>
          </div>
          <button className="w-full mt-8 py-4 bg-white rounded-full text-[#9f4200] font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-transform shadow-sm">
            عرض شاشة المطبخ
          </button>
        </div>
      </div>

      {/* ── Efficiency + Top Sellers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kitchen Efficiency Gauge */}
        <div className="lg:col-span-5 bg-[#f6f3f2] p-8 rounded-2xl flex flex-col items-center">
          <h3 className="text-xl font-bold tracking-tight self-start mb-2">
            كفاءة المطبخ
          </h3>

          <div className="relative w-52 h-52">
            <div dir="ltr" className="w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="100%"
                startAngle={210}
                endAngle={-30}
                data={GAUGE_DATA}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar
                  background={{ fill: "#e5e2e1" }}
                  dataKey="value"
                  cornerRadius={10}
                  fill="#F27121"
                />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Centre label — sits on top of the chart */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black tracking-tighter">18.4</span>
              <span className="text-[10px] font-bold text-[#584237] uppercase tracking-widest mt-0.5">
                متوسط دقائق التحضير
              </span>
            </div>
          </div>

          <p className="text-sm font-medium text-[#584237] text-center max-w-[220px] mt-2">
            أداؤك أسرع بنسبة{" "}
            <span className="text-green-600 font-bold inline-flex items-center gap-1">
              <TrendingUp size={13} />
              12%
            </span>{" "}
            من متوسط الأسبوع الماضي.
          </p>
        </div>

        {/* Top Selling Dishes */}
        <div className="lg:col-span-7 bg-[#f6f3f2] p-8 rounded-2xl">
          <h3 className="text-xl font-bold tracking-tight mb-7">
            الأطباق الأكثر مبيعًا
          </h3>
          <div className="space-y-6">
            {TOP_DISHES.map((dish) => (
              <DishRow key={dish.name} {...dish} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, badge, badgePositive }: StatCardProps) {
  return (
    <div className="bg-[#f6f3f2] p-7 rounded-2xl flex flex-col justify-between group hover:bg-[#e5e2e1] transition-colors duration-300">
      <div className="flex justify-between items-start mb-7">
        <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#F27121] shadow-sm">
          {icon}
        </div>
        <span
          className={`text-xs font-black px-2 py-1 rounded-md ${
            badgePositive
              ? "text-green-700 bg-green-50"
              : "text-red-600 bg-red-50"
          }`}>
          {badge}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-[#584237] uppercase tracking-widest mb-1">
          {label}
        </p>
        <p className="text-2xl font-extrabold tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function LiveOrderRow({
  dot,
  label,
  count,
}: {
  dot: string;
  label: string;
  count: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${dot}`} />
        <span className="font-semibold text-sm">{label}</span>
      </div>
      <span className="text-2xl font-extrabold">{count}</span>
    </div>
  );
}

function DishRow({ image, name, sold, pct }: DishProps) {
  return (
    <div className="flex items-center gap-5">
      <Image
        src={image}
        alt={name}
        unoptimized
        width={40}
        height={40}
        className="w-14 h-14 rounded-2xl object-cover shadow-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-2 gap-2">
          <h4 className="font-bold text-sm truncate">{name}</h4>
          <span className="text-xs font-bold text-[#584237] flex-shrink-0">
            بيع {sold}
          </span>
        </div>
        <div
          className="w-full h-2 bg-[#e5e2e1] rounded-full overflow-hidden"
          dir="rtl">
          <div
            className="h-full bg-[#F27121] rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
