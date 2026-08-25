"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getRequestByEmail } from "@/api/admin";
import { toast } from "sonner";
import { Database } from "@/types/database.types";

type DeliveryRequest = Database["public"]["Tables"]["delivery_requests"]["Row"];
type DeliveryStatus = Database["public"]["Enums"]["delivery_status"];

// ─── Header ───────────────────────────────────────────────────────────────────

function TrackHeader() {
  return (
    <header className="w-full flex justify-center pointer-events-none z-50">
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-black italic text-on-surface tracking-tighter">
          Berlin Food
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mt-1 bg-primary-container/20 px-3 py-1 rounded-full pointer-events-auto">
          تتبع طلب الانضمام
        </span>
      </div>
    </header>
  );
}

// ─── Reusable Components ──────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ms-1">
      {children}
    </label>
  );
}

function TextInput({
  id,
  type = "text",
  placeholder,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      className={`
        w-full bg-surface-container-low border-none rounded-md
        px-6 py-4 text-on-surface placeholder:text-outline
        outline-none focus:ring-2 focus:ring-primary-container
        transition-all duration-200 bidi-ltr
        ${className}
      `}
      {...props}
    />
  );
}

// ─── Editorial Image Row ──────────────────────────────────────────────────────

const DELIVERY_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHACG752m5fwcvgqQFaBwdx6Ca-2XF1dUPJ5Ig4ZpZ5Q3BY4wDvDPTLntjtD3pbfGJ2YLfQLczd0Z8C9vaGL8RxN5q_gmRZznXaK8u9yt7nMSpuoDeLIqmeImfFtLt66S6wUfwLH9c_zrc_Pr1yXsRIhM8EbGblo9N3J3wOgmTYUfOVEJnsE4IMx1m0io5EsDJxu-m5FP3Vh0kAeZPcEiLWjKwPnFvRc4iBZyyNb_dG-Hs8S6xHGBoljEsNaU5P_3v9okYwzYkppp7",
    alt: "عامل توصيل طلبات",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd2ivg2ijHSj8yBzcKC7TTZbrwy_gEcLP0oHoIidAKCvpOuTORXxz2qb-ih6pCXL6Ilmo-287yN08AIUIFaZsMgKSAMR4pgXHRBtRxe3SE3rfNMldCtNYI_Jxc_bQu8bgM5R4XWjmIqTAkr1Gq3xxgBlRP3LLkjJvSD8GicRBbRKhh0u3QbZkswuR9aELIwjVuv2ag_qqYcR8Yy7j_-aD5TiIlnuYUYEIvU2pqBH41gTI8FSCJKW0uO9FM3dXBFp7egquO3xg8zEOv",
    alt: "قيادة الدراجة النارية والتوصيل",
  },
];

function EditorialAvatarRow() {
  return (
    <div className="mt-12 flex items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
      <div className="flex -space-x-4">
        {DELIVERY_IMAGES.map((img, i) => (
          <div
            key={i}
            className="relative w-12 h-12 rounded-full border-4 border-background overflow-hidden">
            <Image
              src={img.src}
              alt={img.alt}
              unoptimized
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
    </div>
  );
}

// ─── Status Badge Component ───────────────────────────────────────────────────

function StatusBadge({ status }: { status: DeliveryStatus }) {
  const config = {
    pending: {
      label: "قيد الانتظار",
      icon: Clock,
      style: "bg-primary-fixed text-on-primary-fixed border-outline-variant",
    },
    approved: {
      label: "تمت الموافقة",
      icon: CheckCircle2,
      style:
        "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary-container",
    },
    rejected: {
      label: "مرفوض",
      icon: XCircle,
      style: "bg-error-container text-on-error-container border-error",
    },
  };

  const current = config[status] || config.pending;
  const Icon = current.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${current.style}`}>
      <Icon className="w-4 h-4" />
      <span>{current.label}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TrackDeliveryRequest() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [trackData, setTrackData] = useState<DeliveryRequest | null>(null);

  const handleTrack = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.warning("أدخل البريد الإلكتروني");
      return;
    }

    setLoading(true);

    try {
      const data = await getRequestByEmail(email);
      setTrackData(data);
      if (data) {
        toast.success("تم جلب بياناتك بنجاح");
      } else {
        toast.error("لم يتم العثور على طلب مرتبط بهذا البريد الإلكتروني.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <TrackHeader />

      {/* Main Card Container */}
      <main className="w-full max-w-xl mt-10 mb-16">
        <div className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-[40px_0_40px_-20px_rgba(28,27,27,0.04)] relative overflow-hidden space-y-8">
          {/* Decorative Glow Effect */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

          <section className="relative z-10 space-y-8">
            {/* Page Headline */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3 leading-tight">
                تابع حالة <br />
                <span className="text-primary italic">طلب الانضمام</span>.
              </h1>
              <p className="text-on-surface-variant text-base leading-relaxed">
                أدخل البريد الإلكتروني الذي استخدمته للتقديم لمتابعة مستجدات
                طلبك.
              </p>
            </div>

            {/* Tracking Search Form */}
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="track_email">البريد الإلكتروني</FieldLabel>
                <div className="relative">
                  <TextInput
                    id="track_email"
                    type="email"
                    placeholder="lukas@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
                <Link
                  href="/register-delivery"
                  className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                  لم تقدم طلبك بعد؟ سجل هنا
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full md:w-auto px-8 py-3.5
                    bg-gradient-to-br from-primary to-primary-container
                    text-on-primary font-bold rounded-full
                    shadow-lg shadow-primary-container/20
                    flex items-center justify-center gap-2
                    transition-all duration-200
                    hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                    active:scale-95 disabled:opacity-50
                  ">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      تتبع الطلب
                      <Search className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Display Tracked Request Data */}
            {trackData && (
              <div className="pt-6 border-t border-outline-variant/40 space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between gap-4 bg-surface-container-low p-4 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-surface-container-highest rounded-full text-primary">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block">
                        رقم الطلب
                      </span>
                      <span className="font-mono text-xs font-semibold text-on-surface bidi-ltr">
                        #{trackData.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={trackData.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-surface-container-low p-4 rounded-md">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                      الاسم الكامل
                    </span>
                    <p className="text-sm font-semibold text-on-surface">
                      {trackData.full_name}
                    </p>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-md">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant block mb-1">
                      رقم الهاتف
                    </span>
                    <p className="text-sm font-semibold text-on-surface bidi-numeric">
                      {trackData.phone_number}
                    </p>
                  </div>
                </div>

                {/* Continue Registration Call to Action for Approved Requests */}
                {trackData.status === "approved" && (
                  <div className="p-5 rounded-md bg-tertiary-fixed/30 border border-tertiary-container/40 space-y-3">
                    <div className="flex items-center gap-2 text-on-tertiary-fixed-variant font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-tertiary" />
                      <span>تهانينا! تم قبول طلبك للانضمام للفريق</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      يرجى إكمال بقية الخطوات المطلوبة لتأكيد حسابك والبدء في
                      تلقي طلبات التوصيل.
                    </p>
                    <Link
                      href={`/auth/complete-registration/${trackData.id}`}
                      className="
                        w-full mt-2 py-3.5 px-6
                        bg-tertiary text-on-tertiary font-bold rounded-full
                        shadow-md shadow-tertiary/20
                        flex items-center justify-center gap-2
                        transition-all duration-200
                        hover:scale-[1.01] hover:bg-tertiary-container hover:text-on-tertiary-container
                        active:scale-95 text-sm
                      ">
                      مواصلة خطوات التسجيل
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between text-xs text-outline px-1">
                  <span>
                    تاريخ التقديم:{" "}
                    <strong className="bidi-numeric text-on-surface-variant">
                      {new Date(trackData.created_at).toLocaleDateString(
                        "ar-EG",
                      )}
                    </strong>
                  </span>
                  <span>
                    آخر تحديث:{" "}
                    <strong className="bidi-numeric text-on-surface-variant">
                      {new Date(trackData.updated_at).toLocaleDateString(
                        "ar-EG",
                      )}
                    </strong>
                  </span>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Editorial Decorative Avatars */}
        <EditorialAvatarRow />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 text-outline text-xs tracking-wide">
        © 2024 Berlin Food · طلبات التوصيل · متابعة الطلبات
      </footer>
    </div>
  );
}
