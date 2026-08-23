"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/api/auth";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
        <UtensilsCrossed className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-2xl font-extrabold tracking-tighter text-on-surface uppercase">
        Berlin Food
      </span>
    </div>
  );
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
       toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 6) {
       toast.error("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(supabase, password);
       toast.success("تم تحديث كلمة المرور", {
         description: "تمت إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
      });
      router.push("/auth/login");
    } catch (err: unknown) {
       toast.error("حدث خطأ", {
         description: err instanceof Error ? err.message : "تعذر إعادة تعيين كلمة المرور",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface p-6 antialiased relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-0 end-0 w-[50vw] h-[512px] bg-primary-container/5 blur-[120px] -z-10 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-[50vw] w-[30vw] h-[307px] bg-primary/5 blur-[100px] -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-[440px] space-y-10 z-10">
        {/* Branding */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <Logo />
          </div>
          <div className="pt-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">
               إعادة تعيين كلمة المرور
            </h2>
            <p className="text-secondary mt-2 text-lg">
               اختر كلمة مرور قوية لتأمين حسابك.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold tracking-wide text-on-surface-variant ms-1"
            >
               كلمة المرور الجديدة
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="
                  w-full h-14 px-5 ps-12 pe-12 rounded-lg
                  bg-surface-container-low border-none outline-none
                  ring-1 ring-outline-variant/30
                  focus:ring-2 focus:ring-primary-container
                  placeholder:text-outline/50
                  transition-all duration-200
                "
              />
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute end-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold tracking-wide text-on-surface-variant ms-1"
            >
               تأكيد كلمة المرور
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="
                  w-full h-14 px-5 ps-12 rounded-lg
                  bg-surface-container-low border-none outline-none
                  ring-1 ring-outline-variant/30
                  focus:ring-2 focus:ring-primary-container
                  placeholder:text-outline/50
                  transition-all duration-200
                "
              />
              <Lock className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full h-14 rounded-full flex gap-2 items-center justify-center
              bg-gradient-to-br from-primary to-primary-container
              text-on-primary font-bold text-lg
              shadow-lg transition-all duration-200
              hover:scale-[1.02] hover:shadow-[0_10px_25px_-5px_rgba(242,113,33,0.4)]
              active:scale-[0.98]
              ${isLoading ? "opacity-70 pointer-events-none" : ""}
            `}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
             {isLoading ? "جارٍ تحديث كلمة المرور..." : "إعادة تعيين كلمة المرور"}
          </button>
        </form>
      </div>
    </main>
  );
}
