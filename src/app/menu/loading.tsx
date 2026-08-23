import React from "react";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full flex-grow min-h-[80vh] flex flex-col items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 bg-[#F27121] rounded-[2rem] flex items-center justify-center animate-bounce shadow-xl shadow-[#F27121]/40 relative z-10">
            <UtensilsCrossed className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-4 start-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 rounded-full blur-sm animate-pulse" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#F27121]" />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-[#1c1b1b]">
              جارٍ التحميل...
            </h2>
          </div>
          <p className="text-[#584237] font-medium text-sm text-center">
            جارٍ جلب أحدث التفاصيل
          </p>
        </div>
      </div>
    </div>
  );
}
