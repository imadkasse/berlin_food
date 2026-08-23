"use client";

import { useRegisterStore } from "@/stores/register";
import { MapPicker } from "@/components/shared/Map";
import { MapPin, ArrowLeft, ShieldCheck, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { register } from "@/api/auth";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddressStep() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setAddressData, profileData, email, password } = useRegisterStore();
  const isLocked = !!profileData.address.lat;

  const handleLocationSelect = (lat: number, lng: number) => {
    setAddressData({ lat, lng });
    console.log("profile", profileData);
    console.log("hello");
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // console.log(
      //   {
      //     email,
      //     password,
      //   },
      //   profileData,
      // );

     await register(
        {
          email,
          password,
        },
        profileData,
      );
      router.push("/menu");
    } catch (error: unknown) {
       toast.error("حدث خطأ", {
         description: error instanceof Error ? error.message : "حدث خطأ غير معروف",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex items-center justify-center p-6 md:p-12">
      <main className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* --- Left Column: Typography & Info --- */}
        <div className="lg:col-span-5 flex flex-col gap-8 order-2 lg:order-1">
          <header className="flex flex-col gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.1em] text-primary">
               الخطوة 3 من 3
            </span>
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.9] text-on-surface uppercase">
               أين <br /> نوصّل <br /> طلبك؟
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-sm mt-2">
               ثبّت موقعك على الخريطة، وسنضمن وصول وجبتك إليك بدقة.
            </p>
          </header>

          {/* Progress Indicator */}
          <div className="flex gap-2 w-full max-w-xs">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  step <= 3 ? "bg-primary" : "bg-surface-container-highest"
                }`}
                style={
                  step === 3
                    ? { boxShadow: "0 0 12px rgba(242, 113, 33, 0.4)" }
                    : {}
                }
              />
            ))}
          </div>

          {/* Selection Status Card */}
          <div className="flex items-center gap-6 p-6 rounded-3xl bg-surface-container-low border border-outline-variant/10">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                isLocked
                  ? "bg-primary text-on-primary"
                  : "bg-primary-container text-primary"
              }`}>
              <MapPin className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-on-surface text-lg">
                 {isLocked ? "تم تحديد الموقع" : "وسط برلين"}
              </p>
              <p
                className="text-sm text-on-surface-variant"
                dir={isLocked ? "ltr" : undefined}>
                {isLocked
                  ? `${profileData.address.lat?.toFixed(4)}, ${profileData.address.lng?.toFixed(4)}`
                   : "حرّك الخريطة لتحسين موقع التوصيل."}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handleSubmit}
              className="w-full py-5 rounded-full bg-primary text-on-primary font-bold text-xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale"
              disabled={!isLocked || loading}>
               إنهاء التسجيل
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isLocked ? (
                <Check className="w-6 h-6" />
              ) : (
                <ArrowLeft className="w-6 h-6" />
              )}
            </button>
            <Link
              href="/auth/register/contact"
              className="text-center font-bold text-on-surface-variant hover:text-on-surface transition-colors">
               رجوع
            </Link>
          </div>
        </div>

        {/* --- Right Column: The Map --- */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <div className="relative p-2 bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]">
            <div className="overflow-hidden rounded-[32px] h-[500px] md:h-[600px]">
              <MapPicker
                onLocationSelect={handleLocationSelect}
                defaultCenter={
                  profileData.address.lat
                    ? {
                        lat: profileData.address.lat,
                        lng: profileData.address.lng!,
                      }
                    : undefined
                }
              />
            </div>

            {/* Bottom Trust Badge */}
            <div className="absolute -bottom-12 end-0 flex items-center gap-2 px-4 py-2 bg-surface-container-high/50 backdrop-blur-md rounded-full border border-outline-variant/10">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                 معالجة آمنة للبيانات
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
