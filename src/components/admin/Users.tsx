"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MapPin,
  Clock,
  Loader2,
  Truck,
  X,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { updateProfile } from "@/api/profiles";
import { Database } from "@/types/database.types";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const ROLE_STYLES: Record<string, { dot: string; pill: string }> = {
  admin: {
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-700 border border-red-200",
  },
  delivery: {
    dot: "bg-blue-500",
    pill: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  manager: {
    dot: "bg-green-500",
    pill: "bg-green-50 text-green-700 border border-green-200",
  },
  support: {
    dot: "bg-purple-500",
    pill: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  customer: {
    dot: "bg-gray-500",
    pill: "bg-gray-50 text-gray-700 border border-gray-200",
  },
};

const ROLE_LABELS: Record<string, string> = {
  admin: "مسؤول",
  delivery: "مندوب توصيل",
  manager: "مدير",
  support: "دعم",
  customer: "عميل",
};

const VEHICLE_LABELS: Record<string, string> = {
  bicycle: "دراجة هوائية",
  motorcycle: "دراجة نارية",
  car: "سيارة",
  van: "شاحنة صغيرة",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function UsersPage({ usersData }: { usersData: Profile[] }) {
  const [users, setUsers] = useState<Profile[]>(usersData);
  const [loading, _setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase();
      const matchQ =
        !q ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        (u.phone_number ?? "").toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchR = !roleFilter || u.role === roleFilter;
      const matchS =
        statusFilter === "" || String(u.availability_status) === statusFilter;
      return matchQ && matchR && matchS;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#F6F3F2] p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#F27121] animate-pulse" />
            <span className="text-xs font-bold text-[#F27121] uppercase tracking-wider">
              برلين فود · لوحة الإدارة
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[#1C1B1B] mb-2">
                دليل المستخدمين
              </h1>
              <p className="text-[#5c5b5b] text-sm max-w-2xl">
                إدارة جميع مستخدمي النظام وأدوارهم وموظفي التوصيل
              </p>
            </div>
            <div className="flex gap-3">
              <StatCard value={users.length} label="إجمالي المستخدمين" />
              {/* <StatCard value={onlineCount} label="Active Now" /> */}
            </div>
          </div>
        </header>

        {/* ── Controls ── */}
        <section className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 w-full md:w-auto flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search
                size={18}
                className="absolute start-4 top-1/2 -translate-y-1/2 text-[#5c5b5b]"
              />
              <input
                type="text"
                placeholder="ابحث بالاسم أو الهاتف أو المعرّف..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full ps-11 pe-4 py-2.5 bg-white border border-[#F0EDED] rounded-xl text-sm font-medium text-[#1C1B1B] placeholder:text-[#5c5b5b] focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#F0EDED] rounded-xl text-sm font-bold text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#F27121]/20">
              <option value="">جميع الأدوار</option>
              <option value="admin">مسؤول</option>
              <option value="manager">مدير</option>
              <option value="delivery">توصيل</option>
              <option value="support">دعم</option>
              <option value="customer">عميل</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-[#F0EDED] rounded-xl text-sm font-bold text-[#1C1B1B] focus:outline-none focus:ring-2 focus:ring-[#F27121]/20">
              <option value="">جميع الحالات</option>
              <option value="true">متصل</option>
              <option value="false">غير متصل</option>
            </select>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus size={18} />
            <span>إضافة مستخدم جديد</span>
          </button>
        </section>

        {/* ── Table ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-[#F0EDED] overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-start min-w-[1000px]">
              <thead>
                <tr className="bg-[#F6F3F2]/50 text-[#5c5b5b] text-[10px] font-bold uppercase tracking-wider border-b border-[#F0EDED]">
                  <th className="px-6 py-4">بيانات المستخدم</th>
                  <th className="px-6 py-4">الدور والحالة</th>
                  <th className="px-6 py-4">التواصل</th>
                  <th className="px-6 py-4">المركبة والموقع</th>
                  <th className="px-6 py-4 text-end">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDED]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2
                          className="animate-spin text-[#F27121]"
                          size={32}
                        />
                        <span className="text-sm font-medium text-[#5c5b5b]">
                          جارٍ تحميل المستخدمين...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-20 text-center text-sm font-medium text-[#5c5b5b]">
                      لم يُعثر على مستخدمين يطابقون معايير البحث.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#F6F3F2]/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F27121]/10 to-[#9F4200]/10 flex items-center justify-center border border-[#F27121]/20 group-hover:scale-110 transition-transform">
                            <span className="text-sm font-bold text-[#9F4200]">
                              {user.full_name?.[0]?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#1C1B1B] block group-hover:text-[#F27121] transition-colors">
                              {user.full_name || "مستخدم بلا اسم"}
                            </span>
                            <span className="text-[10px] font-mono text-[#9A9694]">
                              {user.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${ROLE_STYLES[user.role || "customer"].pill}`}>
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${ROLE_STYLES[user.role || "customer"].dot}`}
                            />
                            {ROLE_LABELS[user.role || "customer"] || user.role}
                          </span>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-[#5c5b5b]">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${user.availability_status ? "bg-green-500" : "bg-gray-300"}`}
                            />
                            {user.availability_status ? "متصل" : "غير متصل"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1C1B1B]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[#5c5b5b]">
                            <Phone size={14} />
                            <span className="font-medium">
                              {user.phone_number || "لا يوجد هاتف"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[#9A9694] text-xs">
                            <Clock size={12} />
                            <span>
                              آخر تحديث{" "}
                              {new Date(
                                user.updated_at || "",
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {user.vehicle_type && (
                            <div className="flex items-center gap-2 text-[11px] font-bold text-[#1C1B1B]">
                              <Truck size={14} className="text-[#F27121]" />
                              <span>
                                {VEHICLE_LABELS[user.vehicle_type] ||
                                  user.vehicle_type}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-[11px] text-[#5c5b5b]">
                            <MapPin size={14} className="text-[#F27121]" />
                            <span className="truncate max-w-[150px]">
                              {user.address ? "الموقع محدد" : "لا يوجد موقع"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="تعديل المستخدم">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="حذف المستخدم">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Modals ── */}
      {isAddModalOpen && (
        <AddUserModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(updatedProfile) => {
            setUsers((prev) =>
              prev.map((u) =>
                u.id === updatedProfile.id ? updatedProfile : u,
              ),
            );
            setIsEditModalOpen(false);
          }}
        />
      )}

      {isDeleteModalOpen && selectedUser && (
        <DeleteUserModal
          user={selectedUser}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={() => {
            setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
            setIsDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white px-5 py-3 rounded-2xl border border-[#F0EDED] shadow-sm flex flex-col items-center min-w-[100px]">
      <span className="text-xl font-black text-[#1C1B1B]">{value}</span>
      <span className="text-[10px] font-bold text-[#F27121] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ─── Add User Modal ───────────────────────────────────────────────────────────

function AddUserModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (newUser: Profile) => void;
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    role: "customer",
    vehicle_type: "motorcycle",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth: { email: formData.email, password: formData.password },
          profile: {
            id: "",
            full_name: formData.full_name,
            phone_number: formData.phone_number,
            role: formData.role as string,
            vehicle_type:
              formData.role === "delivery" ? formData.vehicle_type : null,
            availability_status: true,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر إنشاء المستخدم");

      // setUsers((prev) => [...prev, data.profile]); // Add the new user to state
      toast.success("تم إنشاء المستخدم بنجاح");
      onSuccess(data.profile);
    } catch (error: unknown) {
      toast.error("تعذر إنشاء المستخدم", {
        description: error instanceof Error ? error.message : "خطأ غير معروف",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#F0EDED] flex items-center justify-between bg-gradient-to-r from-[#F27121]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F27121] flex items-center justify-center text-white">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1C1B1B]">
                إضافة مستخدم جديد
              </h2>
              <p className="text-xs text-[#5c5b5b]">
                إنشاء حساب وملف شخصي جديدين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F6F3F2] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                الاسم الكامل
              </label>
              <input
                required
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                رقم الهاتف
              </label>
              <input
                required
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C1B1B] uppercase">
              البريد الإلكتروني
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#1C1B1B] uppercase">
              كلمة المرور
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                الدور
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20">
                <option value="customer">عميل</option>
                <option value="delivery">مندوب توصيل</option>
                <option value="manager">مدير</option>
                <option value="support">دعم</option>
                <option value="admin">مسؤول</option>
              </select>
            </div>
            {formData.role === "delivery" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                  المركبة
                </label>
                <select
                  value={formData.vehicle_type}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F27121]/20">
                  <option value="bicycle">دراجة هوائية</option>
                  <option value="motorcycle">دراجة نارية</option>
                  <option value="car">سيارة</option>
                  <option value="van">شاحنة صغيرة</option>
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#F6F3F2] text-[#1C1B1B] font-bold rounded-xl hover:bg-[#F0EDED] transition-colors">
              إلغاء
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>إنشاء المستخدم</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Edit User Modal ──────────────────────────────────────────────────────────

function EditUserModal({
  user,
  onClose,
  onSuccess,
}: {
  user: Profile;
  onClose: () => void;
  onSuccess: (updatedProfile: Profile) => void;
}) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    role: user.role || "customer",
    vehicle_type: user.vehicle_type || "motorcycle",
    availability_status: user.availability_status || false,
  });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateProfile(supabase, user.id, {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        role: formData.role as string,
        vehicle_type:
          formData.role === "delivery" ? formData.vehicle_type : null,
        availability_status: formData.availability_status,
      });
      toast.success("تم تحديث الملف الشخصي بنجاح");
      onSuccess(updated);
    } catch (error: unknown) {
      toast.error("تعذر تحديث الملف الشخصي", {
        description: error instanceof Error ? error.message : "خطأ غير معروف",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-[#F0EDED] flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Edit2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1C1B1B]">
                تعديل الملف الشخصي
              </h2>
              <p className="text-xs text-[#5c5b5b]">
                تحديث بيانات المستخدم وصلاحياته
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F6F3F2] rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                الاسم الكامل
              </label>
              <input
                required
                type="text"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                رقم الهاتف
              </label>
              <input
                required
                type="tel"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                الدور
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="customer">عميل</option>
                <option value="delivery">مندوب توصيل</option>
                <option value="manager">مدير</option>
                <option value="support">دعم</option>
                <option value="admin">مسؤول</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                حالة التوفر
              </label>
              <select
                value={String(formData.availability_status)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    availability_status: e.target.value === "true",
                  })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="true">متصل</option>
                <option value="false">غير متصل</option>
              </select>
            </div>
          </div>

          {formData.role === "delivery" && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1C1B1B] uppercase">
                نوع المركبة
              </label>
              <select
                value={formData.vehicle_type}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_type: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#F6F3F2] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="bicycle">دراجة هوائية</option>
                <option value="motorcycle">دراجة نارية</option>
                <option value="car">سيارة</option>
                <option value="van">شاحنة صغيرة</option>
              </select>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#F6F3F2] text-[#1C1B1B] font-bold rounded-xl hover:bg-[#F0EDED] transition-colors">
              إلغاء
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>حفظ التغييرات</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete User Modal ────────────────────────────────────────────────────────

function DeleteUserModal({
  user,
  onClose,
  onSuccess,
}: {
  user: Profile;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر حذف المستخدم");
      toast.success("تم حذف المستخدم بنجاح");
      onSuccess();
    } catch (error: unknown) {
      toast.error("تعذر حذف المستخدم", {
        description: error instanceof Error ? error.message : "خطأ غير معروف",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <Trash2 size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-[#1C1B1B] mb-2">
            حذف المستخدم؟
          </h2>
          <p className="text-[#5c5b5b] text-sm mb-8">
            هل أنت متأكد من حذف{" "}
            <span className="font-bold text-[#1C1B1B]">
              {user.full_name || "هذا المستخدم"}
            </span>
            ؟ لا يمكن التراجع عن هذا الإجراء، وستُحذف جميع البيانات المرتبطة به.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[#F6F3F2] text-[#1C1B1B] font-bold rounded-xl hover:bg-[#F0EDED] transition-colors">
              إلغاء
            </button>
            <button
              disabled={loading}
              onClick={handleDelete}
              className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <span>حذف الآن</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
