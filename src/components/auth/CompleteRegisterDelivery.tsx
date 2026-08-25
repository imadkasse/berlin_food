"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { register } from "@/api/auth"; // افترض وجود الدالة هنا
import { Database } from "@/types/database.types";
import { deleteRequestById } from "@/api/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

type VehicleType = "motorcycle" | "car" | "bicycle" | "scooter";
type UserRole = "customer" | "delivery";

// ─── Header ───────────────────────────────────────────────────────────────────

function RegisterHeader({ role }: { role: UserRole }) {
  return (
    <header className="w-full flex justify-center pointer-events-none z-50">
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-black italic text-on-surface tracking-tighter">
          Berlin Food
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mt-1 bg-primary-container/20 px-3 py-1 rounded-full pointer-events-auto">
          {role === "delivery" ? "إنشاء حساب سائق" : "إنشاء حساب جديد"}
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
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
}

// ─── Editorial Image Row ──────────────────────────────────────────────────────

const BRAND_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHACG752m5fwcvgqQFaBwdx6Ca-2XF1dUPJ5Ig4ZpZ5Q3BY4wDvDPTLntjtD3pbfGJ2YLfQLczd0Z8C9vaGL8RxN5q_gmRZznXaK8u9yt7nMSpuoDeLIqmeImfFtLt66S6wUfwLH9c_zrc_Pr1yXsRIhM8EbGblo9N3J3wOgmTYUfOVEJnsE4IMx1m0io5EsDJxu-m5FP3Vh0kAeZPcEiLWjKwPnFvRc4iBZyyNb_dG-Hs8S6xHGBoljEsNaU5P_3v9okYwzYkppp7",
    alt: "توصيل طلبات برلين",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBd2ivg2ijHSj8yBzcKC7TTZbrwy_gEcLP0oHoIidAKCvpOuTORXxz2qb-ih6pCXL6Ilmo-287yN08AIUIFaZsMgKSAMR4pgXHRBtRxe3SE3rfNMldCtNYI_Jxc_bQu8bgM5R4XWjmIqTAkr1Gq3xxgBlRP3LLkjJvSD8GicRBbRKhh0u3QbZkswuR9aELIwjVuv2ag_qqYcR8Yy7j_-aD5TiIlnuYUYEIvU2pqBH41gTI8FSCJKW0uO9FM3dXBFp7egquO3xg8zEOv",
    alt: "قيادة التوصيل",
  },
];

function EditorialAvatarRow() {
  return (
    <div className="mt-12 flex items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-outline-variant to-transparent" />
      <div className="flex -space-x-4">
        {BRAND_IMAGES.map((img, i) => (
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

// ─── Main Registration Component ─────────────────────────────────────────────
type DeliveryRequest = Database["public"]["Tables"]["delivery_requests"]["Row"];

export default function CompleteRegistrationPage({
  requestData,
}: {
  requestData: DeliveryRequest;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: requestData.full_name,
    email: requestData.email,
    phone_number: requestData.phone_number,
    password: "",
    address: "",
    role: "delivery",
    vehicle_type: "motorcycle" as VehicleType,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !form.email ||
      !form.password ||
      !form.full_name ||
      !form.phone_number ||
      !form.address
    ) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    if (form.password.length < 6) {
      toast.warning("يجب أن تكون كلمة المرور 6 أرقام/رموز على الأقل.");
      return;
    }

    setLoading(true);

    try {
      await register(
        {
          email: form.email,
          password: form.password,
        },
        {
          full_name: form.full_name,
          phone_number: form.phone_number,
          role: "delivery",
          address: form.address,
          vehicle_type: form.vehicle_type,
          availability_status: true,
        },
      );

      toast.success(
        "تم إنشاء حسابك بنجاح! تفقد بريدك الإلكتروني لتأكيد الحساب.",
      );
      // after register successfully
      await deleteRequestById(requestData.id);
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(
        error?.message || "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Main Card Container */}
      <main className="w-full max-w-xl mt-10 mb-16">
        <div className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-[40px_0_40px_-20px_rgba(28,27,27,0.04)] relative overflow-hidden">
          {/* Decorative Glow Effect */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

          <section className="relative z-10 space-y-8">
            {/* Page Headline */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3 leading-tight">
                أكمل <span className="text-primary italic">خطوات التسجيل</span>.
              </h1>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="full_name">الاسم الكامل</FieldLabel>
                <TextInput
                  id="full_name"
                  name="full_name"
                  placeholder="Lukas Schmidt"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="lukas@example.com"
                  className="bidi-ltr"
                  value={form.email!}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="password">كلمة المرور</FieldLabel>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="bidi-ltr"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="phone_number">رقم الهاتف</FieldLabel>
                <TextInput
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+213 555 12 34 56"
                  className="bidi-numeric"
                  value={form.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <FieldLabel htmlFor="address">العنوان</FieldLabel>
                <TextInput
                  id="address"
                  name="address"
                  placeholder="المدينة، الشارع، رقم البناية"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Vehicle Type Selection (Only for Delivery Role) */}

              <div className="flex flex-col gap-1.5 pt-1 animate-in fade-in duration-300">
                <FieldLabel htmlFor="vehicle_type">
                  نوع وسيلة التوصيل
                </FieldLabel>
                <select
                  id="vehicle_type"
                  name="vehicle_type"
                  value={form.vehicle_type}
                  onChange={handleChange}
                  className="
                      w-full bg-surface-container-low border-none rounded-md
                      px-6 py-4 text-on-surface outline-none
                      focus:ring-2 focus:ring-primary-container
                      transition-all duration-200 cursor-pointer
                    ">
                  <option value="motorcycle">دراجة نارية (Motorcycle)</option>
                  <option value="car">سيارة (Car)</option>
                  <option value="bicycle">دراجة هوائية (Bicycle)</option>
                  <option value="scooter">سكوتر كهربائي (Scooter)</option>
                </select>
              </div>

              {/* Actions Section */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                  لديك حساب بالفعل؟ تسجيل الدخول
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full md:w-auto px-9 py-3.5
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
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    <>
                      إنشاء الحساب
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Editorial Decorative Avatars */}
        <EditorialAvatarRow />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-8 text-outline text-xs tracking-wide">
        © 2024 Berlin Food · إنشاء حساب جديد
      </footer>
    </div>
  );
}
