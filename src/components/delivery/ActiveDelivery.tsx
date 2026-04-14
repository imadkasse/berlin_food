"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Order } from "@/types/Order";
import {
  Package,
  MapPin,
  CheckCircle,
  Loader2,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/api/orders";
import { createClient } from "@/utils/supabase/client";

// Safely lazy-load the Leaflet map to prevent "window is not defined" SSR errors.
const RouteMap = dynamic(() => import("./MapDestination"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-[#f6f3f2] rounded-[1.5rem] animate-pulse">
      <Loader2 className="w-8 h-8 animate-spin text-[#F27121] mb-2" />
      <span className="text-[#584237] font-medium text-sm">
        Loading navigation map...
      </span>
    </div>
  ),
});

export interface AddressJson {
  lat?: number;
  lng?: number;
  street?: string;
  [key: string]: string | number | boolean | undefined;
}

export default function ActiveDelivery({ order }: { order: Order | null }) {
  const [isDelivering, setIsDelivering] = useState(false);
  const router = useRouter();

  if (!order) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 flex flex-col items-center justify-center pb-28">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100">
          <Package className="w-10 h-10 text-[#F27121]" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">
          Order Not Found
        </h2>
        <p className="text-[#584237] text-center max-w-sm text-lg font-medium mb-6">
          This order might have been completed or doesn&apos;t exist.
        </p>
        <Link
          href="/delivery/for-delivery"
          className="px-6 py-3 bg-[#1c1b1b] text-white rounded-xl font-bold hover:bg-[#333]">
          Back to Routes
        </Link>
      </div>
    );
  }

  const customerAddress = order.delivery_address as AddressJson | null;
  const hasValidCustomerLocation = customerAddress?.lat && customerAddress?.lng;

  const handleMarkDelivered = async (order_id: string) => {
    const supabase = createClient();
    setIsDelivering(true);
    try {
      // Simulate API call to mark as delivered
      await updateOrderStatus(supabase, order_id, "delivered");

      toast.success("Order Delivered!", {
        description: `Order #${order.id.split("-")[0]} has been successfully dropped off.`,
      });

      // Redirect back to queue
      router.push("/delivery/for-delivery");
    } catch (err: unknown) {
      toast.error("Failed to update status", {
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsDelivering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 pb-28 lg:pb-10">
      <header className="mb-8 relative auto-rows-min">
        <Link
          href="/delivery/for-delivery"
          className="inline-flex items-center gap-2 text-[#584237] hover:text-[#1c1b1b] font-bold text-sm mb-6 transition-colors">
          <ArrowLeft size={16} />
          Back to list
        </Link>
        <span className="text-[10px] font-black text-[#F27121] tracking-[0.25em] uppercase mb-2 block">
          Active Route
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter leading-none">
          Order #{order.id.split("-")[0]}
        </h1>
        <div className="flex items-center gap-2 mt-4 text-[#584237] font-medium text-sm">
          <span className="px-3 py-1 bg-orange-50 text-[#9F4200] border border-orange-100 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F27121] animate-pulse" />
            Out for Delivery
          </span>
          <span>·</span>
          <span className="font-bold text-[#1c1b1b]">
            €{order.total_price.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-[#e5e2e1] overflow-hidden">
            {hasValidCustomerLocation ? (
              <div className="rounded-[1.5rem] overflow-hidden relative group">
                <RouteMap
                  currentLocation={{
                    lat: 34.66473579859306,
                    lng: 3.2504286095392754,
                  }} // Fixed mock
                  customerLocation={{
                    lat: customerAddress.lat as number,
                    lng: customerAddress.lng as number,
                  }}
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold shadow-lg border border-[#e5e2e1] flex items-center gap-2 z-[400] pointer-events-none">
                  <Navigation className="w-4 h-4 text-[#F27121]" />
                  Active Navigation
                </div>
              </div>
            ) : (
              <div className="w-full h-[500px] flex flex-col items-center justify-center bg-[#f6f3f2] rounded-[1.5rem]">
                <MapPin className="w-12 h-12 text-[#584237]/30 mb-3" />
                <p className="text-[#584237] font-medium text-lg">
                  Customer coordinates unavailable.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Check & Delivery Action */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-[#e5e2e1] flex flex-col h-full sticky top-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#1c1b1b]">
              <Package className="text-[#F27121] w-5 h-5" />
              Delivery Manifest
            </h3>

            <div className="space-y-6 flex-grow">
              <div>
                <p className="text-[10px] text-[#584237] font-black uppercase tracking-widest mb-1.5 opacity-70">
                  Customer ID
                </p>
                <p className="font-bold text-lg leading-tight break-all">
                  {order.customer_id || "Guest"}
                </p>
              </div>

              {customerAddress?.street && (
                <div>
                  <p className="text-[10px] text-[#584237] font-black uppercase tracking-widest mb-1.5 opacity-70">
                    Street Address
                  </p>
                  <p className="font-semibold text-[#1c1b1b] bg-[#f6f3f2] p-4 rounded-2xl leading-relaxed">
                    {customerAddress.street}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[10px] text-[#584237] font-black uppercase tracking-widest mb-1.5 opacity-70">
                  GPS Coordinates
                </p>
                <div className="flex gap-2 font-medium text-[#1c1b1b] font-mono text-sm">
                  <span className="bg-[#f6f3f2] px-3 py-2 rounded-xl border border-[#e5e2e1]">
                    Lat: {customerAddress?.lat?.toFixed(5) || "N/A"}
                  </span>
                  <span className="bg-[#f6f3f2] px-3 py-2 rounded-xl border border-[#e5e2e1]">
                    Lng: {customerAddress?.lng?.toFixed(5) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-4 border-t border-[#f0eded]">
              <button
                onClick={() => {
                  handleMarkDelivered(order.id);
                }}
                disabled={isDelivering}
                className="w-full py-4 rounded-2xl bg-[#F27121] hover:bg-[#d8621a] text-white font-extrabold text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-[#F27121]/20 hover:shadow-xl hover:shadow-[#F27121]/30">
                {isDelivering ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Mark as Delivered
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
