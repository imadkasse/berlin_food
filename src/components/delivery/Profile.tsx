"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Bike,
  Car,
  Truck,
  CheckCircle,
  Edit3,
  Save,
  X,
  Star,
  Package,
  Banknote,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";
import { Database } from "@/types/database.types";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user.store";
import { updateProfile } from "@/api/profiles";
import { createClient } from "@/utils/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

// ─── Mock data ────────────────────────────────────────────────────────────────

const VEHICLE_OPTIONS: {
  value: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "bicycle", label: "Bicycle", icon: <Bike size={18} /> },
  { value: "scooter", label: "Scooter", icon: <Bike size={18} /> },
  { value: "car", label: "Car", icon: <Car size={18} /> },
  { value: "van", label: "Van", icon: <Truck size={18} /> },
];

const STATS = [
  { label: "Total Deliveries", value: "284", icon: <Package size={18} /> },
  { label: "Total Earnings", value: "€1,420", icon: <Banknote size={18} /> },
  { label: "Rating", value: "4.9 ★", icon: <Star size={18} /> },
  { label: "On-Time Rate", value: "97%", icon: <CheckCircle size={18} /> },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Profile({
  profileData,
}: {
  profileData: ProfileRow | null;
}) {
  const fallbackProfile: ProfileRow = {
    id: "new",
    address: "",
    full_name: "No Name",
    phone_number: "",
    role: "delivery",
    vehicle_type: "bicycle",
    delivery_rating: 3.5,
    availability_status: true,
    updated_at: new Date().toISOString(),
  };

  const initialProfileState = profileData || fallbackProfile;
  const [profile, setProfile] = useState<ProfileRow>(initialProfileState);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileRow>(initialProfileState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUser, user } = useUserStore();
  function startEdit() {
    setDraft({ ...profile });
    setEditing(true);
  }

  function cancelEdit() {
    setDraft({ ...profile });
    setEditing(false);
  }

  async function saveEdit() {
    const supabase = createClient();

    setProfile({ ...draft, updated_at: new Date().toISOString() });
    setIsLoading(true);
    try {
      // call func
      const data = await updateProfile(supabase, user?.id!, {
        full_name: draft.full_name,
        phone_number: draft.phone_number,
        vehicle_type: draft.vehicle_type,
        availability_status: draft.availability_status,
      });
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
      setIsLoading(false);
    }
    setEditing(false);
  }

  // const currentVehicle = VEHICLE_OPTIONS.find(
  //   (v) => v.value === profile.vehicle_type,
  // );

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 pb-28 lg:pb-10">
      {/* Header */}
      <header className="mb-12">
        <span className="text-[10px] font-black text-[#F27121] tracking-[0.25em] uppercase mb-2 block">
          Berlin Food · Delivery
        </span>
        <h1 className="text-5xl font-extrabold tracking-tighter leading-none">
          My Profile
        </h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left: Avatar + stats ── */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Avatar card */}
          <div className="bg-[#9F4200] rounded-2xl p-8 text-white flex flex-col items-center text-center shadow-xl shadow-orange-900/10 relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-8 -start-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            {/* Avatar initials */}
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-black mb-4 relative z-10">
              {profile.full_name
                ?.split(" ")
                .map((n) => n[0])
                .join("") ?? "LS"}
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight relative z-10">
              {profile.full_name}
            </h2>
            <p className="text-white/70 text-sm font-medium mt-1 relative z-10 capitalize">
              {profile.role} · {profile.vehicle_type || "-"}
            </p>

            {/* Rating Pill */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg backdrop-blur-md relative z-10 border border-white/5">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-black text-white">
                {profile.delivery_rating ?? 3.5}
              </span>
            </div>

            {/* Availability badge */}
            <div
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black relative z-10 ${
                profile.availability_status
                  ? "bg-green-500/20 text-green-200"
                  : "bg-white/10 text-white/60"
              }`}>
              <span
                className={`w-2 h-2 rounded-full ${profile.availability_status ? "bg-green-400 animate-pulse" : "bg-white/40"}`}
              />
              {profile.availability_status ? "Available" : "Unavailable"}
            </div>
          </div>

          {/* Stats grid */}
          {/* <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-[#f6f3f2] p-5 rounded-2xl hover:bg-[#e5e2e1] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#F27121] shadow-sm mb-3">
                  {s.icon}
                </div>
                <p className="text-[10px] font-bold text-[#584237] uppercase tracking-widest mb-1">
                  {s.label}
                </p>
                <p className="text-xl font-extrabold tracking-tighter">
                  {s.value}
                </p>
              </div>
            ))}
          </div> */}
        </div>

        {/* ── Right: Edit form ── */}
        <div className="lg:col-span-8 bg-[#f6f3f2] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold tracking-tight">
              Personal Information
            </h3>
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#e5e2e1] text-[#1c1b1b] text-sm font-bold rounded-full hover:bg-[#e5e2e1] transition-all active:scale-95">
                <Edit3 size={14} />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e5e2e1] text-[#584237] text-sm font-bold rounded-full hover:bg-[#e5e2e1] transition-all active:scale-95">
                  <X size={14} />
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#F27121] text-white text-sm font-bold rounded-full hover:bg-[#9F4200] transition-all active:scale-95 shadow-md shadow-[#F27121]/20">
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <>
                      <Save size={14} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Full name */}
            <FieldRow
              icon={<User size={16} />}
              label="Full Name"
              value={
                editing ? (draft.full_name ?? "") : (profile.full_name ?? "—")
              }
              editing={editing}
              onChange={(v) => setDraft((d) => ({ ...d, full_name: v }))}
            />

            {/* Phone */}
            <FieldRow
              icon={<Phone size={16} />}
              label="Phone Number"
              value={
                editing
                  ? (draft.phone_number ?? "")
                  : (profile.phone_number ?? "—")
              }
              editing={editing}
              onChange={(v) => setDraft((d) => ({ ...d, phone_number: v }))}
            />

            {/* Rating - Read Only */}
            <div className="bg-white rounded-2xl p-5 border border-[#e5e2e1]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#584237] mb-3">
                Delivery Rating
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F27121]">
                  <Star size={18} fill="#F27121" />
                </div>
                <div>
                  <span className="font-bold text-lg">
                    {profile.delivery_rating ?? 3.5}
                  </span>
                  <span className="text-sm font-bold text-[#584237] ms-1">
                    / 5.0
                  </span>
                </div>
                <div className="ms-auto flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                    Read Only
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            {/* <FieldRow
              icon={<MapPin size={16} />}
              label="Address"
              value={
                editing
                  ? ((draft.address as AddressJson)?.address ?? "")
                  : ((profile.address as AddressJson)?.address ?? "—")
              }
              editing={editing}
              onChange={(v) => setDraft((d) => ({ ...d, address: v }))}
            /> */}

            {/* Vehicle type */}
            <div className="bg-white rounded-2xl p-5 border border-[#e5e2e1]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#584237] mb-4">
                Vehicle Type
              </p>
              {editing ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {VEHICLE_OPTIONS.map((v) => (
                    <button
                      key={v.value}
                      onClick={() =>
                        setDraft((d) => ({ ...d, vehicle_type: v.value }))
                      }
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                        draft.vehicle_type === v.value
                          ? "border-[#F27121] bg-orange-50 text-[#9F4200]"
                          : "border-[#e5e2e1] hover:border-[#F27121]/40 text-[#584237]"
                      }`}>
                      {v.icon}
                      {v.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#F27121]">
                    {/* {currentVehicle?.icon} */}
                  </div>
                  <span className="font-bold capitalize">
                    {profile.vehicle_type ?? "—"}
                  </span>
                </div>
              )}
            </div>

            {/* Availability toggle */}
            <div className="bg-white rounded-2xl p-5 border border-[#e5e2e1] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#584237] mb-1">
                  Availability
                </p>
                <p className="font-bold text-sm">
                  {(
                    editing
                      ? draft.availability_status
                      : profile.availability_status
                  )
                    ? "Available for deliveries"
                    : "Currently unavailable"}
                </p>
              </div>
              <button
                disabled={!editing}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    availability_status: !d.availability_status,
                  }))
                }
                className={`transition-opacity ${!editing ? "opacity-50 cursor-not-allowed" : ""}`}>
                {(
                  editing
                    ? draft.availability_status
                    : profile.availability_status
                ) ? (
                  <ToggleRight size={36} className="text-green-500" />
                ) : (
                  <ToggleLeft size={36} className="text-[#584237]" />
                )}
              </button>
            </div>

            {/* Last updated */}
            {profile.updated_at && (
              <p className="text-[10px] text-[#584237] font-medium text-end">
                Last updated:{" "}
                {new Date(profile.updated_at).toLocaleString("de-DE")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldRow({
  icon,
  label,
  value,
  editing,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#e5e2e1]">
      <p className="text-[10px] font-black uppercase tracking-widest text-[#584237] mb-3">
        {label}
      </p>
      {editing ? (
        <div className="flex items-center gap-3">
          <span className="text-[#F27121] flex-shrink-0">{icon}</span>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-[#f6f3f2] border-none rounded-xl px-4 py-2.5 text-sm font-bold text-[#1c1b1b] focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-[#F27121] flex-shrink-0">{icon}</span>
          <span className="font-bold text-sm">{value}</span>
        </div>
      )}
    </div>
  );
}
