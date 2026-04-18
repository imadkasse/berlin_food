"use client";

import { CartItem } from "@/types/Cart";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  CreditCard,
  Wallet,
  Wifi,
  MapPin,
  X,
  Construction,
  StickyNote,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { useUserStore } from "@/stores/user.store";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/api/orders";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
// read about this
// import { createPortal } from "react-dom";

// --- Types ---
type Address = {
  id: string;
  label: string;
  lat: number;
  lng: number;
  formatted?: string;
};

// --- Cart Item Component ---
const CartItemCard = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}) => (
  <div className="flex flex-col sm:flex-row gap-5 items-start group">
    <div className="w-full sm:w-36 md:w-44 h-52 sm:h-36 md:h-44 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low transition-all duration-500 group-hover:scale-[1.02]">
      <Image
        src={item.image_url}
        alt={item.name}
        unoptimized
        width={40}
        height={40}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-grow flex flex-col justify-between w-full py-1">
      <div className="flex justify-between items-start gap-4 mb-2">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight leading-tight">
          {item.name}
        </h3>
        <span className="text-base sm:text-lg md:text-xl font-medium text-primary whitespace-nowrap">
          {item.price.toFixed(2)} د.ج
        </span>
      </div>
      <p className="text-secondary text-sm leading-relaxed line-clamp-2 mb-1">
        {item.description}
      </p>
      <p className="text-[10px] text-outline tracking-widest uppercase mb-4">
        ID: {item.id} • {item.order_id}
      </p>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1">
          <button
            onClick={() => onDecrement(item.id)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <Minus size={13} />
          </button>
          <span className="px-4 font-bold text-base">{item.quantity}</span>
          <button
            onClick={() => onIncrement(item.id)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <Plus size={13} />
          </button>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-error/60 hover:text-error transition-colors flex items-center gap-1.5 text-sm font-medium">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

// --- Address Modal (centered, portaled to body) ---
const AddressModal = ({
  addresses,
  selectedId,
  note,
  onSelectAddress,
  onNoteChange,
  onConfirm,
  onClose,
  loading,
}: {
  addresses: Address[];
  selectedId: string | null;
  note: string;
  onSelectAddress: (id: string) => void;
  onNoteChange: (val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}) => {
  const modal = (
    // Full-screen backdrop — rendered into document.body via portal,
    // so overflow:hidden on the layout has zero effect on it.
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      {/* Modal card */}
      <div className="bg-surface w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Drag handle (cosmetic, keeps bottom-sheet feel) */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-outline/30" />
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
                تأكيد عنوانك
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                إلى أين تريد توصيل طلبك؟
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant ms-4 flex-shrink-0">
              <X size={20} />
            </button>
          </div>

          {/* Addresses */}
          <div className="space-y-3 mb-5">
            {addresses.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                <MapPin size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">لم يتم العثور على عناوين محفوظة.</p>
              </div>
            ) : (
              addresses.map((addr) => {
                const isSelected = selectedId === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => onSelectAddress(addr.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-start ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-outline/20 bg-surface-container-lowest hover:border-outline/40"
                    }`}>
                    {/* Radio dot */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-outline/40"
                      }`}>
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-on-primary" />
                      )}
                    </div>

                    <MapPin
                      size={18}
                      className={`flex-shrink-0 ${
                        isSelected ? "text-primary" : "text-outline"
                      }`}
                    />

                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm text-on-surface">
                        {addr.label}
                      </p>
                      {addr.formatted && (
                        <p className="text-xs text-on-surface-variant truncate mt-0.5">
                          {addr.formatted}
                        </p>
                      )}
                      <p className="text-[10px] text-outline mt-0.5 tracking-wider">
                        {addr.lat.toFixed(4)}, {addr.lng.toFixed(4)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Coming-soon banner */}
          <div className="flex items-start gap-3 bg-surface-container-low rounded-xl p-4 mb-5 border border-outline/10">
            <Construction
              size={18}
              className="text-primary flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-on-surface">
                عناوين متعددة
              </span>{" "}
              — ميزة حفظ واختيار عدة عناوين توصيل قيد التطوير حاليًا.
            </p>
          </div>

          {/* Note */}
          <div className="mb-7">
            <label className="flex items-center gap-2 text-sm font-semibold text-on-surface mb-2">
              <StickyNote size={15} />
              أضف ملاحظة{" "}
              <span className="font-normal text-on-surface-variant">
                (اختياري)
              </span>
            </label>
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="مثال: رن الجرس، اترك الطلب عند الباب، بدون بصل..."
              rows={3}
              className="w-full bg-surface-container-low border border-outline/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* CTA */}
          <button
            disabled={!selectedId || loading}
            onClick={onConfirm}
            className="w-full bg-gradient-to-br from-[#9F4200] to-[#F27121] text-white py-5 rounded-full font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                تأكيد وإتمام الطلب
                <ArrowRight size={20} className="rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  // Portal to body — escapes all overflow:hidden/overflow-y:auto ancestors
  return modal;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const DELIVERY_FEE = 150;
const VAT_RATE = 0;

// ─── Main Cart Component ──────────────────────────────────────────────────────

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const handleIncrement = useCartStore((state) => state.incrementQuantity);
  const handleDecrement = useCartStore((state) => state.decrementQuantity);
  const handleRemove = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user } = useUserStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [orderNote, setOrderNote] = useState("");

  // Parse addresses from user — handles single object or array
  const addresses: Address[] = (() => {
    try {
      if (!user?.address) return [];
      const raw =
        typeof user.address === "string"
          ? JSON.parse(user.address)
          : user.address;
      const arr = Array.isArray(raw) ? raw : [raw];
      return arr.map(
        (
          a: {
            id: string;
            label: string;
            lat: number;
            lng: number;
            formatted: string;
            address: {
              lat: number;
              lng: number;
            };
          },
          i: number,
        ) => ({
          id: a.id ?? String(i),
          label: a.label ?? `Address ${i + 1}`,
          lat: a.lat,
          lng: a.lng,
          formatted: a.formatted ?? a.address ?? undefined,
        }),
      );
    } catch {
      return [];
    }
  })();

  const handleOpenModal = () => {
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
    setModalOpen(true);
  };

  const handlePlaceOrder = async () => {
    const supabase = createClient();
    const address = addresses.find((a) => a.id === selectedAddressId);
    const itemsWithoutDesc = items.map((item) => {
      return {
        menu_item_id: item.id,
        price: item.price,
        quantity: item.quantity,
      };
    });
    setIsLoading(true);
    // TODO: wire up your order submission
    try {
      const data = await createOrder(
        supabase,
        {
          total_price: Number(total.toFixed(2)),
          customer_id: user?.id,
          delivery_address: {
            lat: address?.lat,
            lng: address?.lng,
          },
          status: "pending",
        },
        itemsWithoutDesc,
      );
      // cleard cart
      clearCart();
      toast.success("تم إتمام الطلب بنجاح", {
        description: `تم إنشاء الطلب بنجاح، رقمه: ${data.id.slice(0, 6)}...`,
      });
    } catch (error: unknown) {
      console.log(error);
      toast.error("خطأ أثناء إنشاء الطلب", {
        description: `الخطأ: ${error instanceof Error ? error.message : "خطأ غير معروف"}`,
      });
    } finally {
      setIsLoading(false);
      setModalOpen(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxes = subtotal * VAT_RATE;
  const total = subtotal + DELIVERY_FEE + taxes;

  return (
    <>
      <main className="min-h-screen pt-12 pb-24 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <section className="mb-12 sm:mb-16">
          <span className="uppercase tracking-[0.2em] text-primary font-semibold mb-3 block text-xs sm:text-sm">
            اختيارك
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-on-surface leading-none">
            سلة <br />
            <span className="text-primary-container">التسوق.</span>
          </h1>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            {items.length === 0 ? (
              <div className="text-center py-20 text-on-surface-variant">
                <p className="text-xl font-semibold mb-2">
                  سلتك فارغة.
                </p>
                <p className="text-sm opacity-60">
                  عد وأضف بعض العناصر اللذيذة!
                </p>
              </div>
            ) : (
              items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))
            )}
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-8 lg:p-10 shadow-[0_40px_80px_-20px_rgba(28,27,27,0.06)] lg:sticky lg:top-32">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
                ملخص الطلب
              </h2>

              <div className="space-y-5 mb-8">
                <div className="flex justify-between items-center text-secondary">
                  <span className="text-base sm:text-lg">المجموع الفرعي</span>
                  <span className="font-semibold text-on-surface">
                    {subtotal.toFixed(2)} د.ج
                  </span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span className="text-base sm:text-lg">رسوم التوصيل</span>
                  <span className="font-semibold text-on-surface">
                    {DELIVERY_FEE.toFixed(2)} د.ج
                  </span>
                </div>
                {VAT_RATE > 0 && (
                  <div className="flex justify-between items-center text-secondary">
                    <span className="text-base sm:text-lg">
                      الضرائب (قيمة مضافة 19%)
                    </span>
                    <span className="font-semibold text-on-surface">
                      {taxes.toFixed(2)} د.ج
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-surface-container-high mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg sm:text-xl font-bold tracking-tight">
                    السعر الإجمالي
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-primary-container">
                    {total.toFixed(2)} د.ج
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleOpenModal}
                  disabled={items.length === 0}
                  className="w-full bg-gradient-to-br from-[#9F4200] to-[#F27121] text-white py-5 rounded-full font-bold text-lg sm:text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
                  إتمام الطلب
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <Link
                  href="/menu"
                  className="w-full py-5 rounded-full font-bold text-on-surface/60 hover:text-on-surface transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                  أضف المزيد من العناصر
                </Link>
              </div>

              <div className="mt-10 flex justify-center gap-6 grayscale opacity-40">
                <CreditCard size={28} />
                <Wallet size={28} />
                <Wifi size={28} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Portal modal — lives outside the layout's overflow:hidden container */}
      {modalOpen && (
        <AddressModal
          addresses={addresses}
          selectedId={selectedAddressId}
          note={orderNote}
          onSelectAddress={setSelectedAddressId}
          onNoteChange={setOrderNote}
          onConfirm={handlePlaceOrder}
          onClose={() => setModalOpen(false)}
          loading={isLoading}
        />
      )}
    </>
  );
}
