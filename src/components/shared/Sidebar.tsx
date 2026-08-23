"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  ShoppingBag,
  User,
  LogOut,
  X,
  Loader2,
  LayoutDashboard,
  Motorbike,
  Users2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { logout } from "@/api/auth";
import { toast } from "sonner";
import { useState } from "react";
import { useUserStore } from "@/stores/user.store";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  onClose?: () => void;
  role?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({ onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { clearUser, user } = useUserStore();
  const navItems =
    role === `customer`
      ? [
          { id: "menu", label: "القائمة", icon: UtensilsCrossed, href: "/menu" },
          ...(user
            ? [
                {
                  id: "orders",
                  label: "طلباتي",
                  icon: ShoppingBag,
                  href: "/customer/orders",
                },
                {
                  id: "profile",
                  label: "الملف الشخصي",
                  icon: User,
                  href: "/customer/profile",
                },
              ]
            : []),
          {
            id: "cart",
            label: "السلة",
            icon: ShoppingBag,
            href: "/customer/cart",
          },
        ]
      : role === `delivery`
        ? [
            {
              id: "dashboard",
              label: "لوحة التحكم",
              icon: LayoutDashboard,
              href: "/delivery/dashboard",
            },
            {
              id: "orders",
              label: "الطلبات",
              icon: ShoppingBag,
              href: "/delivery/orders",
            },
            {
              id: "delivery",
              label: "التوصيل",
              icon: Motorbike,
              href: "/delivery/for-delivery",
            },
            {
              id: "profile",
              label: "الملف الشخصي",
              icon: User,
              href: "/delivery/profile",
            },
          ]
        : role === `admin`
          ? [
              {
                id: "dashboard",
                label: "لوحة التحكم",
                icon: LayoutDashboard,
                href: "/admin/dashboard",
              },

              {
                id: "menu",
                label: "محرر القائمة",
                icon: UtensilsCrossed,
                href: "/admin/menu",
              },
              {
                id: "orders",
                label: "الطلبات",
                icon: ShoppingBag,
                href: "/admin/orders",
              },
              {
                id: "users",
                label: "المستخدمين",
                icon: Users2,
                href: "/admin/users",
              },
              {
                id: "profile",
                label: "الملف الشخصي",
                icon: User,
                href: "/admin/profile",
              },
            ]
          : ([] as const);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      // clear user
      clearUser();
      // toast
      // redirect
      router.push("/menu");
    } catch (error: any) {
      toast.error(`خطأ أثناء تسجيل الخروج`, {
        description: `خطأ أثناء تسجيل الخروج: ${error.message}`,
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {/* ── Desktop Sidebar (lg+) ── */}
      <aside
        className="hidden lg:flex flex-col h-screen w-72 fixed inset-y-0 start-0 z-50 bg-surface-container-low border-e border-outline-variant/10"
        style={{ boxShadow: "40px 0 80px -40px rgba(28,27,27,0.08)" }}>
        <div className="flex flex-col h-full p-6">
          {/* ── Brand Header ── */}
          <div className="mb-10 px-4 flex justify-between items-center">
            <span className="text-2xl font-black italic text-on-surface tracking-tighter">
              برلين فود
            </span>

            {onClose && (
              <button
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <X size={20} />
              </button>
            )}
          </div>

          {/* ── Profile Section ── */}
          {user && (
            <div className="flex items-center gap-3 px-4 mb-8">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20 shadow-sm flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-Image-element */}
                <Image
                  src={`https://ui-avatars.com/api/?name=${user?.full_name}&background=random&size=512`}
                  alt={user?.full_name!}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-bold text-on-surface truncate">
                  {user?.full_name!}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium">
                   {user?.role === "customer"
                     ? "عميل"
                     : user?.role === "delivery"
                       ? "مندوب توصيل"
                       : user?.role === "admin"
                         ? "مسؤول"
                         : "مستخدم"}
                </p>
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <nav
            className="flex flex-col gap-1 flex-1"
             aria-label="التنقل الرئيسي">
            {navItems.map(({ id, label, icon: Icon, href }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");

              return (
                <Link
                  key={id}
                  href={href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-full
                    text-sm font-medium
                    transition-all duration-200
                    hover:scale-[1.02] active:scale-95
                    ${
                      isActive
                        ? "bg-primary text-on-primary shadow-lg"
                        : "text-on-surface hover:bg-surface-container-high"
                    }
                  `}
                  style={
                    isActive
                      ? { boxShadow: "0 4px 15px -3px rgba(159, 66, 0, 0.3)" }
                      : undefined
                  }
                  aria-current={isActive ? "page" : undefined}>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Footer CTAs ── */}
          <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-outline-variant/10">
            <button
              className="
                w-full py-4
                bg-gradient-to-br from-primary to-primary-container
                text-on-primary font-bold rounded-full
                shadow-lg
                transition-all duration-200
                hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                active:scale-95
              ">
              احجز طاولة
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                disabled={loading}
                className={`
                  flex items-center justify-center gap-2
                  text-xs font-bold text-on-surface-variant
                  hover:text-error transition-colors duration-200 py-2
                  cursor-pointer
                `}>
                {loading ? (
                  <Loader2
                    size={14}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <>
                    <LogOut size={14} aria-hidden="true" className="rotate-180" />
                    تسجيل الخروج
                  </>
                )}
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-all duration-200 active:scale-95">
                  <LogIn size={18} />
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-primary/20 text-on-surface font-bold text-sm hover:bg-surface-container-high transition-all duration-200 active:scale-95">
                  <UserPlus size={18} />
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation Bar (below lg) ── */}
      <nav
        className="lg:hidden fixed bottom-0 start-0 end-0 z-50
          bg-surface-container-low border-t border-outline-variant/10
          flex items-stretch
          safe-area-pb"
        style={{ boxShadow: "0 -4px 24px -4px rgba(28,27,27,0.10)" }}
         aria-label="التنقل الرئيسي">
        {navItems.map(({ id, label, icon: Icon, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={id}
              href={href}
              className={`
                flex-1 flex flex-col items-center justify-center gap-1
                py-3 px-2
                text-[10px] font-semibold tracking-wide
                transition-all duration-200 active:scale-95
                ${isActive ? "text-primary" : "text-on-surface-variant"}
              `}
              aria-current={isActive ? "page" : undefined}>
              {/* Active pill indicator above icon */}
              <span
                className={`
                  h-1 w-8 rounded-full mb-0.5 transition-all duration-300
                  ${isActive ? "bg-primary opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
                `}
                aria-hidden="true"
              />

              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                aria-hidden="true"
              />
              {label}
            </Link>
          );
        })}

        {!user && (
          <Link
            href="/auth/login"
            className={`
              flex-1 flex flex-col items-center justify-center gap-1
              py-3 px-2
              text-[10px] font-semibold tracking-wide
              transition-all duration-200 active:scale-95
              ${pathname === "/auth/login" ? "text-primary" : "text-on-surface-variant"}
            `}
            aria-label="تسجيل الدخول">
            <span
              className={`
                h-1 w-8 rounded-full mb-0.5 transition-all duration-300
                ${pathname === "/auth/login" ? "bg-primary opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
              `}
              aria-hidden="true"
            />
            <LogIn size={22} strokeWidth={pathname === "/auth/login" ? 2.5 : 1.8} />
            دخول
          </Link>
        )}

        {/* Book a Table CTA as a highlighted center-ish item */}
        <Link
          href="/book"
          className="
            flex-1 flex flex-col items-center justify-center gap-1
            py-3 px-2
            text-[10px] font-bold tracking-wide
            text-primary
            transition-all duration-200 active:scale-95
          "
          aria-label="احجز طاولة">
          <span
            className="
              w-10 h-10 -mt-6 mb-0.5
              rounded-full
              bg-gradient-to-br from-primary to-primary-container
              flex items-center justify-center
              shadow-[0_4px_14px_-2px_rgba(242,113,33,0.45)]
              border-2 border-surface-container-low
            "
            aria-hidden="true">
            {/* Simple table/fork icon using UtensilsCrossed in white */}
            <UtensilsCrossed
              size={18}
              strokeWidth={2.2}
              className="text-on-primary"
            />
          </span>
          حجز
        </Link>
      </nav>
    </>
  );
}
