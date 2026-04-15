"use client";

import { useState } from "react";
import { MapPin, Home, Plus, User, X, Loader2 } from "lucide-react";
import { User as UserType } from "@/types/User";
import { MapPicker } from "@/components/shared/Map";
import { updateProfile } from "@/api/profiles";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/user.store";
import { toast } from "sonner";
import Image from "next/image";

export function ProfileSettings({ user }: { user: UserType | null }) {
  // loadings
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState<boolean>(false);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    full_name: string;
    phone_number: string;
  }>({
    full_name: user?.full_name!,
    phone_number: user?.phone_number!,
  });
  const { setUser, user: userState } = useUserStore();

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
      toast.success("Updating user info successfully", {
        description: `Update user info with Id :${user?.id} Successfull`,
      });
    } catch (error: any) {
      console.log(error);
      toast.error("error when editing user info", {
        description: `error : ${error.message}`,
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
      toast.success("Updating address info successfully", {
        description: `Update address info with user Id :${user?.id} Successfull`,
      });
      setIsMapModalOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error("error when editing address info", {
        description: `error : ${error.message}`,
      });
      setIsMapModalOpen(false);
    } finally {
      setIsLoadingAddress(false);
      setIsMapModalOpen(false);
    }
  };

  return (
    <main className="flex-1 p-8 md:p-16 w-full min-h-screen pt-8 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-black text-on-surface tracking-tight uppercase italic">
            Profile Settings
          </h1>
          <p className="text-on-surface-variant font-medium text-lg mt-1">
            Manage your {user?.role} account and delivery preferences.
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
                  Personal Details
                </h2>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                      Full Name
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
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70 ml-1">
                        Vehicle Type
                      </label>
                      <select
                        value={user?.vehicle_type || ""}
                        // onChange={(e) =>
                        //   handleInputChange("vehicle_type", e.target.value)
                        // }
                        className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary/20 transition-all">
                        <option value="bike">Bicycle</option>
                        <option value="moto">Motorcycle</option>
                        <option value="car">Car</option>
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
                      <>Save Changes</>
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
                    Saved Location
                  </h2>
                </div>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:bg-primary/5 px-4 py-2 rounded-full transition-all">
                  <Plus size={18} /> Edit Map
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
                      Primary Address
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                      {/* Edit in next feature */}
                      {"No address set. Use the map to select your location."}
                    </p>
                    {userAddress?.lat && (
                      <p className="text-[10px] font-mono mt-2 text-primary/60">
                        GPS: {userAddress.lat}, {userAddress.lng}
                      </p>
                    )}
                  </div>
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
                    className={`absolute top-1 w-4 h-4 rounded-full transition-all ${user?.availability_status ? "right-1 bg-primary" : "left-1 bg-white"}`}
                  />
                </button>
              </div>
            </section> */}

            {/* Profile Picture Placeholder */}
            <div className="rounded-3xl overflow-hidden aspect-square shadow-2xl group relative border-4 border-white">
              <Image
                src={`https://ui-avatars.com/api/?name=${userState?.full_name}&background=random&size=512`}
                alt={userState?.full_name || "Profile"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 lg:mt-16 pt-8 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-surface-container-low rounded-3xl border border-outline-variant/10">
            <div>
              <h3 className="text-on-surface font-bold text-lg text-center md:text-left">
                Sign Out
              </h3>
              <p className="text-sm text-on-surface-variant mt-1 text-center md:text-left">
                Your session data will be cleared from this device.
              </p>
            </div>
            <button
              // onClick={clearUser}
              className="px-10 py-4 rounded-full bg-on-surface text-surface font-black uppercase italic tracking-tighter hover:bg-on-surface/90 transition-all">
              Log Out
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
                Select Location
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
                  <>Done</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
