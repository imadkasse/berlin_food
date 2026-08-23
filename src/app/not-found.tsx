import Link from "next/link";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="max-w-xl w-full flex flex-col items-center text-center gap-8">
        {/* Big editorial number */}
        <div className="relative select-none">
          <span className="font-headline font-black text-[clamp(7rem,22vw,11rem)] leading-none tracking-tighter text-on-surface/5 pointer-events-none">
            404
          </span>
          {/* Icon centred over the number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-primary/10 rounded-2xl p-5">
              <UtensilsCrossed size={48} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-3">
          <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-on-surface leading-tight">
             هذا الطبق غير
            <br />
             <span className="text-primary">موجود.</span>
          </h1>
          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
             يبدو أن هذه الصفحة أزيلت من القائمة. عُد لاستكشاف ما يزال يُطهى.
          </p>
        </div>

        {/* Divider line */}
        <div className="w-16 h-px bg-outline/20" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-xs">
          <Link
            href="/menu"
            className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-primary text-on-primary rounded-full font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all">
             تصفح القائمة
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-4 px-8 bg-surface-container-lowest border border-outline/20 text-on-surface-variant hover:text-on-surface rounded-full font-bold text-base transition-all">
            <ArrowLeft size={17} />
             العودة إلى الرئيسية
          </Link>
        </div>

        {/* Subtle footer note */}
        <p className="text-[11px] text-outline tracking-widest uppercase mt-2">
           الخطأ 404 · الصفحة غير موجودة
        </p>
      </div>
    </div>
  );
}
