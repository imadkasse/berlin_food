"use client";
import { Menu as MenuType } from "@/types/Menu";
import { Category } from "@/types/Category";

import {
  Search,
  ShoppingCart,
  Menu as MenuIcon,
  Filter,
  PlusCircle,
  Check,
} from "lucide-react";
import { useCartStore } from "@/stores/cart.store";
import { toast } from "sonner";
import Image from "next/image";

// --- Food Card Sub-component ---
const FoodCard = ({ item }: { item: MenuType }) => {
  const { addItem, items } = useCartStore();


  const isInCart =  items.some((i) => i.id === item.id) 
  return (
    <div className="group relative bg-surface-container-lowest rounded-lg p-5 transition-all duration-300 hover:shadow-ambient border border-outline-variant/10">
      <div className="relative overflow-visible mb-6">
        <Image
          src={item.image_url ?? "/placeholder.png"}
          alt={item.name}
          unoptimized
          width={40}
          height={40}
          className="w-full h-64 object-cover rounded-tl-xl rounded-br-xl rounded-se-md rounded-es-md group-hover:scale-[1.02] transition-transform duration-500"
        />
        {item.is_available === false && (
          <span className="absolute top-4 end-4 bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-error shadow-sm">
            غير متوفر
          </span>
        )}
      </div>
      <div className="px-2">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-headline text-xl font-bold text-on-surface leading-tight">
            {item.name}
          </h3>
          <span className="text-lg font-extrabold text-primary">
            ${item.price.toFixed(2)}
          </span>
        </div>
        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2">
          {item.description ?? ""}
        </p>
        <button
          onClick={() => {
            if (isInCart) return;
            addItem({
              id: item.id,
              image_url: item.image_url as string,
              name: item.name,
              description: item.description as string,
              price: item.price,
              order_id: "",
              quantity: 1,
            });
            toast.success("تمت الإضافة للسلة", {
              description: `تمت إضافة ${item.name} إلى سلتك`,
            });
          }}
          disabled={isInCart}
          className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-on-primary rounded-md font-bold transition-all hover:shadow-primary-glow active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
          {isInCart ? <Check size={20} /> : <PlusCircle size={20} />}
          {isInCart ? "موجود في السلة" : "أضف للسلة"}
        </button>
      </div>
    </div>
  );
};

// --- Props Interface ---
interface MenuProps {
  categories: Category[];
  menuItems: MenuType[];
}

// --- Main Content Component ---
export default function Menu({ categories, menuItems }: MenuProps) {
  const allCategory: Category = {
    id: "all",
    name: "كل الأطباق",
    image_url: null,
  };
  const allCategories = [allCategory, ...categories];

  return (
    <main className="min-h-screen pt-8 pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
      {/* Search Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="lg:hidden">
          <span className="text-2xl font-black italic text-on-surface tracking-tighter">
            برلين فود
          </span>
        </div>

        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="ابحث عن المأكولات الشهية..."
            className="w-full bg-surface-container border-none rounded-md py-3 ps-5 pe-12 text-sm focus:ring-2 focus:ring-primary/40 text-on-surface"
          />
          <Search
            className="absolute end-4 top-1/2 -translate-y-1/2 text-outline"
            size={18}
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 bg-surface-container-lowest rounded-md shadow-sm text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/10">
            <ShoppingCart size={22} />
          </button>
          <button className="p-3 lg:hidden bg-surface-container-lowest rounded-md shadow-sm text-on-surface-variant">
            <MenuIcon size={22} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mb-12 relative overflow-hidden rounded-lg bg-surface-container p-8 sm:p-12 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 z-10">
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block font-headline">
            فن الطهي في برلين 2026
          </span>
          <h1 className="text-4xl sm:text-6xl font-headline font-extrabold text-on-surface tracking-tight leading-tight mb-6">
            رحلة منتقاة لـ{" "}
            <span className="text-primary">أصحاب الذوق الرفيع</span>
          </h1>
          <p className="text-on-surface-variant max-w-md text-lg leading-relaxed mb-8">
            اكتشف المكونات المختارة بعناية والتحضيرات المتقنة المصممة للارتقاء بكل وجبة.
          </p>
        </div>
        <div className="flex-1 relative">
          <Image
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"
            alt="الطبق المميز"
            unoptimized
            width={40}
            height={40}
            className="w-full h-80 object-cover rounded-tl-xl rounded-br-xl rounded-se-md rounded-es-md shadow-2xl relative z-10"
          />
          <div className="absolute -top-4 -end-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -start-8 w-40 h-40 bg-tertiary-container/20 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            قائمة اليوم
          </h2>
          <button className="flex items-center gap-2 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-6 py-2.5 rounded-full transition-colors">
            <Filter size={18} />
            تصفية
          </button>
        </div>

        {/* <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {allCategories.map((cat, idx) => (
            <button
              key={cat.id}
              className={`whitespace-nowrap px-8 py-3 rounded-full font-bold transition-all shadow-sm ${
                idx === 0
                  ? "bg-primary text-on-primary shadow-primary/20"
                  : "bg-surface-container-lowest text-on-surface-variant hover:text-primary border border-outline-variant/10"
              }`}>
              {cat.name}
            </button>
          ))}
        </div> */}
      </section>

      {/* Bento Food Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((item) => (
          <FoodCard key={item.id} item={item} />
        ))}
      </section>

      {/* Footer Callout */}
      <footer className="mt-20 border-t border-outline-variant/10 pt-16">
        <div className="bg-surface-container-low rounded-lg p-8 sm:p-16 text-center shadow-inner">
          <h3 className="font-headline text-3xl font-bold mb-4 text-on-surface">
            هل ترغب بتوصية الشيف؟
          </h3>
          <p className="text-on-surface-variant mb-10 max-w-lg mx-auto text-lg">
            انضم إلى دائرتنا الخاصة للحصول على وصول مبكر للقوائم الموسمية وأسرار المطبخ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto bg-surface-container-lowest p-2 rounded-full shadow-lg border border-outline-variant/10">
            <input
              className="flex-1 px-8 py-4 rounded-full bg-transparent border-none focus:ring-0 text-on-surface"
              placeholder="عنوان بريدك الإلكتروني"
              type="email"
            />
            <button className="px-10 py-4 bg-primary text-on-primary font-bold rounded-full transition-all hover:bg-surface-tint shadow-md">
              اشتراك
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
