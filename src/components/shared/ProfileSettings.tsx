"use client";

import { useState } from "react";
import {
  MapPin,
  Home,
  Plus,
  User,
  X,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Globe,
} from "lucide-react";
import { User as UserType } from "@/types/User";
import { MapPicker } from "@/components/shared/Map";
import { updateProfile } from "@/api/profiles";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/user.store";
import { toast } from "sonner";
import { updatePassword, logout } from "@/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ProfileSettings({ user }: { user: UserType | null }) {
  // loadings
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    full_name: string;
    phone_number: string;
  }>({
    full_name: user?.full_name!,
    phone_number: user?.phone_number!,
  });
  const { setUser, user: userState, clearUser } = useUserStore();

  // Parse the Address JSON safely
  // Assuming address JSON structure: { type: 'home' | 'work', text: string }
  const addressData = user?.address as any;
  const [userAddress, setUserAddress] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: addressData?.lat,
    lng: addressData?.lng,
  });

  const supabase = createClient();
  const handleUpdatePersonalInfo = async () => {
    setIsLoadingInfo(true);
    try {
      // call func
      const data = await updateProfile(supabase, user?.id!, userInfo);
      // update state
      setUser(data);
      // toast
      toast.success("تم تحديث بيانات المستخدم بنجاح", {
        description: `تم تحديث بيانات المستخدم ذي المعرّف: ${user?.id} بنجاح`,
      });
    } catch (error: any) {
      console.log(error);
      toast.error("حدث خطأ أثناء تعديل بيانات المستخدم", {
        description: `الخطأ: ${error.message}`,
      });
    } finally {
      setIsLoadingInfo(false);
    }
  };
  const handleUpdateAddressInfo = async () => {
    setIsLoadingAddress(true);
    try {
      // call func
      const data = await updateProfile(supabase, user?.id!, userInfo);

      // update state
      setUser(data);
      // toast
      toast.success("تم تحديث بيانات العنوان بنجاح", {
        description: `تم تحديث بيانات العنوان للمستخدم ذي المعرّف: ${user?.id} بنجاح`,
      });
      setIsMapModalOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error("حدث خطأ أثناء تعديل بيانات العنوان", {
        description: `الخطأ: ${error.message}`,
      });
      setIsMapModalOpen(false);
    } finally {
      setIsLoadingAddress(false);
      setIsMapModalOpen(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.new || !passwords.confirm) {
      toast.error("يرجى ملء حقلي كلمة المرور");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      return;
    }

    setIsLoadingPassword(true);
    try {
      await updatePassword(passwords.new);
      toast.success("تم تحديث كلمة المرور بنجاح");
      setPasswords({ new: "", confirm: "" });
    } catch (error: any) {
      console.error(error);
      toast.error("خطأ أثناء تحديث كلمة المرور", {
        description: error.message,
      });
    } finally {
      setIsLoadingPassword(false);
    }
  };

  const [deviceInfo, setDeviceInfo] = useState({
    browser: "",
    os: "",
    isMobile: false,
  });

  useState(() => {
    if (typeof window !== "undefined") {
      const ua = navigator.userAgent;
      const browser = ua.includes("Chrome")
                       ? "كروم"
        : ua.includes("Firefox")
           ? "فايرفوكس"
           : "سفاري";
      const os = ua.includes("Windows")
         ? "ويندوز"
        : ua.includes("Mac")
           ? "ماك أو إس"
           : "لينكس";
      setDeviceInfo({
        browser,
        os,
        isMobile: /iPhone|iPad|iPod|Android/i.test(ua),
      });
    }
  });

  const router = useRouter();
  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      toast.success("تم تسجيل الخروج بنجاح");
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error);
      toast.error("خطأ أثناء تسجيل الخروج", {
        description: error.message,
      });
    }
  };

  return (
    <main className="flex-1 p-8 md:p-16 w-full min-h-screen pt-8 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-black text-on-surface tracking-tight uppercase italic">
            إعدادات الملف الشخصي
          </h1>
          <p className="text-on-surface-variant font-medium text-lg mt-1">
            إدارة حسابك وتفضيلات التوصيل.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-10">
            {/* Personal Details Section */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-10 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-on-surface">
                  البيانات الشخصية
                </h2>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ms-1">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={userInfo.full_name || ""}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          full_name: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ms-1">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      dir="ltr"
                      value={userInfo?.phone_number || ""}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>

                  {/* Vehicle Type (Conditional for Delivery Role) */}
                  {user?.role === "delivery" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ms-1">
                        نوع المركبة
                      </label>
                      <select
                        value={user?.vehicle_type || ""}
                        // onChange={(e) =>
                        //   handleInputChange("vehicle_type", e.target.value)
                        // }
                        className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option value="bike">دراجة هوائية</option>
                        <option value="moto">دراجة نارية</option>
                        <option value="car">سيارة</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdatePersonalInfo}
                    disabled={isLoadingInfo}
                    className="bg-primary text-on-primary px-10 py-4 rounded-full font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {isLoadingInfo ? (
                      <Loader2 className="animate-spin " size={20} />
                    ) : (
                      <>حفظ التغييرات</>
                    )}
                  </button>
                </div>
              </form>
            </section>

            {/* Delivery Addresses Section */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-10 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-2xl">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-on-surface">
                    المواقع المحفوظة
                  </h2>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:bg-primary/5 px-4 py-2 rounded-full transition-all">
                  <Plus size={18} /> تعديل الخريطة
                </button>
              </div>

              {/* Displaying Address from JSON */}
              <div className="p-6 rounded-2xl border border-outline-variant/10 bg-surface-container-low/50 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary text-on-primary">
                    <Home size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-on-surface">
                      العنوان الأساسي
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                      {/* Edit in next feature */}
                      {"لم يتم تعيين عنوان. استخدم الخريطة لتحديد موقعك."}
                    </p>
                    {userAddress?.lat && (
                      <p className="text-[10px] font-mono mt-2 text-primary/60">
                         الإحداثيات: <span dir="ltr">{userAddress.lat}, {userAddress.lng}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section (Password Update) */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-10 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="p-3 bg-error/10 rounded-2xl">
                  <Lock className="w-6 h-6 text-error" />
                </div>
                <h2 className="text-xl font-bold text-on-surface">الأمان</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* New Password */}
                  <div className="space-y-2 relative">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ms-1">
                       كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passwords.new}
                        onChange={(e) =>
                          setPasswords({ ...passwords, new: e.target.value })
                        }
                        className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all pe-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute end-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ms-1">
                       تأكيد كلمة المرور
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isLoadingPassword}
                    className="bg-on-surface text-surface px-10 py-4 rounded-full font-black uppercase italic tracking-tighter shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                    {isLoadingPassword ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>تحديث كلمة المرور</>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-10">
            {/* Availability Status (For Delivery Role) */}
            {/* <section className="bg-primary text-on-primary rounded-3xl p-8 shadow-xl shadow-primary/10">
              <h2 className="text-lg font-black uppercase italic tracking-tighter mb-4">
                Account Status
              </h2>
              <div className="flex items-center justify-between">
                <span className="font-bold opacity-90">Available for Work</span>
                <button
                  onClick={() =>
                    handleInputChange(
                      "availability_status",
                      !user?.availability_status,
                    )
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative ${user?.availability_status ? "bg-white" : "bg-white/30"}`}>
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all ${user?.availability_status ? "end-1 bg-primary" : "start-1 bg-white"}`}
                  />
                </button>
              </div>
            </section> */}

            {/* Profile Picture Placeholder */}
            <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl group relative border-4 border-white">
              <Image
                src={`https://ui-avatars.com/api/?name=${userState?.full_name}&background=random&size=512`}
                 alt={userState?.full_name || "الصورة الشخصية"}
                unoptimized
                width={40}
                height={40}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Active Sessions Section */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-on-surface">
                  الجلسات النشطة
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/5">
                  <div className="p-3 rounded-xl bg-surface-container-highest">
                    {deviceInfo.isMobile ? (
                      <Smartphone
                        className="text-on-surface-variant"
                        size={24}
                      />
                    ) : (
                      <Monitor className="text-on-surface-variant" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-on-surface truncate">
                         {deviceInfo.browser} على {deviceInfo.os}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">
                        الحالي
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                       برلين، ألمانيا • نشط الآن
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-on-surface-variant/60 text-center italic px-2">
                  لحماية حسابك، يمكنك تسجيل الخروج من جميع الجلسات من لوحة التحكم الرئيسية.
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 lg:mt-16 pt-8 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container-low rounded-3xl border border-outline-variant/10">
            <div>
              <h3 className="text-on-surface font-bold text-lg text-center md:text-start">
                تسجيل الخروج
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 text-center md:text-start">
                سيتم مسح بيانات الجلسة من هذا الجهاز.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-10 py-4 rounded-full bg-on-surface text-surface font-black uppercase italic tracking-tighter hover:bg-on-surface/90 transition-all">
              تسجيل الخروج
            </button>
          </div>
        </footer>
      </div>

      {/* Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-3xl w-full max-w-3xl h-[600px] shadow-2xl flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/10 bg-surface-container-lowest z-10">
              <h3 className="text-xl font-black text-on-surface uppercase tracking-tight">
                اختر الموقع
              </h3>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="p-2 hover:bg-surface-container-low rounded-full text-on-surface-variant transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 w-full h-full bg-surface-variant/20 p-4">
              <MapPicker
                onLocationSelect={(lat, lng) => {
                  console.log("Location selected:", lat, lng);
                  setUserAddress({
                    lat,
                    lng,
                  });
                }}
              />
            </div>
            <div className="p-4 border-t border-outline-variant/10 bg-surface-container-lowest flex justify-end">
              <button
                onClick={handleUpdateAddressInfo}
                disabled={isLoadingAddress}
                className="bg-primary text-on-primary px-8 py-3 rounded-full font-black uppercase italic tracking-tighter hover:scale-[1.02] active:scale-95 transition-all">
                {isLoadingAddress ? (
                  <Loader2 className="animate-spin " size={20} />
                ) : (
                  <>تم</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
