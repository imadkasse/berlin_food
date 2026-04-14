"use client";

import { Order } from "@/types/Order";
import Link from "next/link";
import { MapPin, Package, Navigation, ArrowRight } from "lucide-react";

export interface AddressJson {
  lat?: number;
  lng?: number;
  street?: string;
  [key: string]: string | number | boolean | undefined;
}

export default function ForDelivery({ orders }: { orders: Order[] }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 flex flex-col items-center justify-center pb-28">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-orange-100">
          <Package className="w-10 h-10 text-[#F27121]" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">
          No active deliveries
        </h2>
        <p className="text-[#584237] text-center max-w-sm text-lg font-medium">
          You currently don&apos;t have any orders assigned for delivery. Head
          over to the <span className="font-bold text-[#1c1b1b]">Orders</span>{" "}
          tab to pick one up!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] p-8 lg:p-10 pb-28 lg:pb-10">
      <header className="mb-10">
        <span className="text-[10px] font-black text-[#F27121] tracking-[0.25em] uppercase mb-2 block">
          Delivery Queue
        </span>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tighter leading-none mb-3">
          My Routes
        </h1>
        <p className="text-[#584237] font-medium text-base">
          You have {orders.length} active order{orders.length === 1 ? "" : "s"}{" "}
          waiting to be delivered.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order) => {
          const address = order.delivery_address as AddressJson | null;
          return (
            <div
              key={order.id}
              className="bg-white rounded-[2rem] p-6 border border-[#e5e2e1] shadow-sm hover:shadow-md transition-shadow group flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f6f3f2] flex items-center justify-center text-[#F27121] shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-black text-xl tracking-tight">
                      #{order.id.split("-")[0]}
                    </p>
                    <p className="text-xs font-bold text-[#584237] uppercase tracking-wider mt-0.5">
                      €{order.total_price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-[#f6f3f2] p-4 rounded-2xl">
                  <MapPin
                    size={18}
                    className="mt-0.5 text-[#F27121] shrink-0"
                  />
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#584237] tracking-wider mb-1">
                      Destination
                    </p>
                    <p className="text-sm font-semibold leading-relaxed text-[#1c1b1b]">
                      {address?.street || "No street address provided"}
                    </p>
                    {!address?.street && address?.lat && (
                      <p className="text-xs font-mono text-[#584237] mt-1">
                        {address.lat.toFixed(4)}, {address.lng?.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Link
                href={`/delivery/for-delivery/${order.id}`}
                className="w-full py-4 rounded-2xl bg-[#1c1b1b] hover:bg-[#F27121] text-white font-extrabold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-transparent hover:shadow-[#F27121]/30 group/btn">
                <Navigation size={16} />
                See Map & Navigate
                <ArrowRight
                  size={16}
                  className="opacity-50 group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
