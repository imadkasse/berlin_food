"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mail, Lock } from "lucide-react";
import { useRegisterStore } from "@/stores/register";
import { useRouter } from "next/navigation";

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function StepProgressBar({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-12">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 w-12 rounded-full transition-colors duration-300"
          style={{
            backgroundColor:
              i < currentStep
                ? "var(--color-primary-container)"
                : "var(--color-surface-container-highest)",
          }}
        />
      ))}
      <span className="ms-4 text-xs font-bold tracking-widest uppercase text-on-surface-variant">
         الخطوة {String(currentStep).padStart(2, "0")} /{" "}
        {String(totalSteps).padStart(2, "0")}
      </span>
    </div>
  );
}

// ─── Labeled Input with left icon ────────────────────────────────────────────

function IconInput({
  id,
  label,
  icon,
  rightSlot,
  hint,
  ...inputProps
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  rightSlot?: React.ReactNode;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-widest text-on-surface-variant ms-1 block">
        {label}
      </label>

      <div className="relative group">
        {/* Left icon */}
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors duration-200">
          {icon}
        </span>

        <input
          id={id}
          className="
            w-full ps-14 pe-6 py-5
            bg-surface-container-low border-none rounded-lg
            text-on-surface placeholder:text-outline/50
            outline-none focus:ring-2 focus:ring-primary-container
            transition-all duration-300 shadow-sm
          "
          style={{ paddingRight: rightSlot ? "3.5rem" : undefined }}
          {...inputProps}
        />

        {/* Right slot (e.g. show/hide password) */}
        {rightSlot && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            {rightSlot}
          </div>
        )}
      </div>

      {hint && (
        <p className="text-xs text-on-surface-variant/70 mt-2 px-1">{hint}</p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OnboardingStep2Page() {
  const router = useRouter();
  const { setAuthData, profileData } = useRegisterStore();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: validate & navigate to step 3
    if (!form.email || !form.password) {
      console.log("error fileds");
      return;
    }
    console.log("profile data", profileData);

    setAuthData(form);
    router.push("/auth/register/address");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col md:flex-row h-screen overflow-hidden">
        {/* ── Left: Hero Image ── */}
        <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-surface-container overflow-hidden">
          {/* Overlay gradient */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-on-surface/40 to-transparent" />

          {/* Photo */}
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk7YU17Z6YpmObRBGCf6432nwq66b6rO_-JNheS14ZeqhHcbGFzCMHAfVqOnJxl9a26SA5OocBZ2QnmaA38x9s3RwORRpzIlvPk86rr0t5h7cz0BvYQb_E7T1uCCdym37lUFHs-Q6Pl6OvX0odRUnvJTFjc9-uBH2e5y5jh0B86RPN2rnuMu4O5wQF0lXBdFLFSJsyvIwR6DCwtwOqDKL8NFIGwnDdoY1ZmGkrba8-IoJj16JeKffNzvbRTO4EjSq9cKtYoTlqsre4"
             alt="تصميم داخلي لمطعم صناعي هادئ في برلين"
            unoptimized
            width={40}
            height={40}
            className="object-cover grayscale-[20%] contrast-[1.1]"
          />

          {/* Text overlay */}
          <div className="relative z-20 p-16 mt-auto">
            <span className="tracking-widest text-white/80 font-bold uppercase mb-4 block text-xs">
              Berlin Food
            </span>
            <h1 className="text-white font-black italic tracking-tighter leading-[0.9] text-6xl">
               صُمم
              <br />
               للباحثين
              <br />
               عن الجديد.
            </h1>
            <p className="text-white/70 text-lg mt-6 max-w-sm leading-relaxed">
               انضم إلى مجتمع من خبراء المدينة الذين يعيدون تعريف مشهد الطهي
               في برلين.
            </p>
          </div>
        </div>

        {/* ── Right: Form Canvas ── */}
        <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 overflow-y-auto bg-surface-bright">
          <StepProgressBar currentStep={2} totalSteps={3} />

          {/* Header */}
          <header className="mb-12">
            <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-4">
               أمّن وصولك
            </h2>
            <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
               أنشئ بيانات دخولك لإدارة الطلبات، وتنسيق القوائم، وحجز أفضل
               الطاولات في المدينة.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 max-w-md">
            {/* Email */}
            <IconInput
              id="email"
              name="email"
              type="email"
               label="عنوان البريد الإلكتروني"
              placeholder="lukas.schmidt@berlin.de"
              autoComplete="email"
              icon={<Mail className="w-5 h-5" />}
              value={form.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <IconInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
               label="كلمة المرور"
              placeholder="••••••••••••"
              autoComplete="new-password"
              icon={<Lock className="w-5 h-5" />}
               hint="يجب أن تتكون من 8 أحرف على الأقل، وتتضمن رقماً ورمزاً واحداً."
              rightSlot={
                <button
                  type="button"
                   aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-outline hover:text-on-surface transition-colors duration-200">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/auth/register"
                className="
                  w-full sm:w-auto px-8 py-4 rounded-full
                  bg-surface-container-high text-on-surface
                  font-bold text-sm tracking-wide text-center
                  transition-all duration-200
                  hover:scale-[1.02] active:scale-95
                ">
                 رجوع
              </Link>

              <button
                type="submit"
                className="
                  w-full sm:flex-1 py-4 px-8 rounded-full
                  bg-gradient-to-br from-primary to-primary-container
                  text-white font-bold text-sm tracking-wide
                  shadow-lg shadow-primary-container/20
                  flex items-center justify-center gap-2
                  transition-all duration-200
                  hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
                  active:scale-95
                ">
                 متابعة
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Security footer note */}
          <footer className="mt-auto pt-16 border-t border-outline-variant/10">
            <div className="flex items-start gap-4 text-on-surface-variant/60">
              <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                 يتم تشفير بياناتك وتخزينها وفق معايير السيادة الرقمية الصارمة
                 في برلين. {" "}
                <Link href="/privacy" className="text-primary hover:underline">
                   تعرّف على المزيد حول سياسة الخصوصية.
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
