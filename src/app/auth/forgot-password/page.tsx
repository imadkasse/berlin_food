"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Loader2, Mail, ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/api/auth";
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgotPassword(supabase, email);
      setIsSubmitted(true);
       toast.success("تم إرسال رابط إعادة التعيين", {
         description: "يرجى التحقق من بريدك الإلكتروني للعثور على رابط إعادة تعيين كلمة المرور.",
      });
    } catch (err: unknown) {
       toast.error("حدث خطأ", {
         description: err instanceof Error ? err.message : "تعذر إرسال رسالة إعادة التعيين",
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
               {isSubmitted ? "تحقق من صندوق بريدك" : "هل نسيت كلمة المرور؟"}
            </h2>
            <p className="text-secondary mt-2 text-lg">
              {isSubmitted 
                 ? "أرسلنا رابط استرداد إلى عنوان بريدك الإلكتروني."
                 : "أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور."}
            </p>
          </div>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold tracking-wide text-on-surface-variant ms-1"
              >
                 عنوان البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
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
                <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
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
               {isLoading ? "جارٍ إرسال الرابط..." : "إرسال رابط إعادة التعيين"}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full h-14 rounded-full flex gap-2 items-center justify-center bg-surface-container-high text-on-surface font-bold text-lg transition-all duration-200 hover:bg-surface-container-highest"
            >
               تجربة بريد إلكتروني آخر
            </button>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-container transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
             العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    </main>
  );
}
