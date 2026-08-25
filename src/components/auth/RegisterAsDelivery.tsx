"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createRequest } from "@/api/admin";
import { toast } from "sonner";

// ─── Header ───────────────────────────────────────────────────────────────────

function DeliveryHeader() {
  return (
    <header className=" w-full flex justify-center pointer-events-none z-50">
      <div className="flex flex-col items-center gap-1">
        <span className="text-2xl font-black italic text-on-surface tracking-tighter">
          Berlin Food
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mt-1 bg-primary-container/20 px-3 py-1 rounded-full pointer-events-auto">
          انضم لفريق التوصيل
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

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function RegisterAsDeliveryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.phone_number) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setLoading(true);

    try {
      // TODO: قم باستدعاء API الخاص بك هنا لإرسال البيانات
      await createRequest(form);

      // إظهار الرسالة المطلوبة
      toast.success("تم إستلام طلبك سيتم مراجعته");

      // التوجيه إلى الصفحة الرئيسية أو صفحة الانتظار
      router.push("/");
    } catch (error) {
      console.error("Failed to register delivery user:", error);
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-mesh text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <DeliveryHeader />

      {/* Main Card Container */}
      <main className="w-full max-w-xl mt-10 mb-16">
        <div className="bg-surface-container-lowest rounded-lg p-10 md:p-16 shadow-[40px_0_40px_-20px_rgba(28,27,27,0.04)] relative overflow-hidden">
          {/* Decorative Glow Effect */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

          <section className="relative z-10">
            {/* Page Headline */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-4 leading-tight">
                انضم إلى فريق <br />
                <span className="text-primary italic">التوصيل لدينا</span>.
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                ابدأ الكسب بشروطك الخاصة. قدّم طلبك الآن للانضمام إلى شبكة
                التوصيل في برلين.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="email">البريد الإلكتروني</FieldLabel>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="lukas@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="phone_number">رقم الهاتف</FieldLabel>
                <div className="relative" dir="ltr">
                  <div className="absolute start-6 top-1/2 -translate-y-1/2 flex items-center gap-2 pe-4 border-e border-outline-variant/30 pointer-events-none">
                    <span className="text-on-surface-variant font-medium text-sm">
                      +213
                    </span>
                  </div>
                  <TextInput
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    dir="ltr"
                    placeholder="176 1234 5678"
                    className="ps-24"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-[11px] text-outline mt-1 ms-1 leading-tight">
                  سنقوم بالتواصل معك عبر هذا الرقم لتأكيد الحساب.
                </p>
              </div>

              {/* Actions Section */}
              <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <Link
                  href="/auth/register"
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                  التسجيل كعميل عادي؟
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full md:w-auto px-10 py-4
                    bg-gradient-to-br from-primary to-primary-container
                    text-on-primary font-bold rounded-full
                    shadow-lg shadow-primary-container/20
                    flex items-center justify-center gap-3
                    transition-all duration-200
                    hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                    active:scale-95 disabled:opacity-50
                  ">
                  {loading ? (
                    "جاري الإرسال..."
                  ) : (
                    <>
                      تقديم الطلب
                      <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
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
        © 2024 Berlin Food · طلبات التوصيل · الانضمام للفريق
      </footer>
    </div>
  );
}
