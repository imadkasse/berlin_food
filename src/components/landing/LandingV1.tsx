"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import {
  MapPin,
  Search,
  Star,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  Truck,
  Sparkles,
  ChevronRight,
  Phone,
  Mail,
  Coffee,
  Pizza,
  Salad,
  Fish,
  IceCream,
  Wine,
  Users,
  Gift,
  Percent,
  ArrowDownUp,
  ShieldCheck,
  Zap,
  Award,
} from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=900&fit=crop",
  food1:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=700&fit=crop",
  food2:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=700&fit=crop",
  food3:
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=700&fit=crop",
  food4:
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=700&fit=crop",
  food5:
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=700&fit=crop",
  food6:
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=700&fit=crop",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop",
  delivery:
    "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop",
  testimonial:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  testimonial2:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  testimonial3:
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
};

const categories = [
  {
    name: "Pizza",
    icon: Pizza,
    count: "120+",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Burgers",
    icon: Coffee,
    count: "85+",
    color: "bg-amber-100 text-amber-600",
  },
  {
    name: "Salads",
    icon: Salad,
    count: "65+",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Sushi",
    icon: Fish,
    count: "90+",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Desserts",
    icon: IceCream,
    count: "75+",
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Drinks",
    icon: Wine,
    count: "100+",
    color: "bg-purple-100 text-purple-600",
  },
];

const restaurants = [
  {
    name: "Garden Bowl Co.",
    cuisine: "Healthy · Vegan",
    time: "20-25 min",
    rating: 4.9,
    price: "€",
    image: IMAGES.food1,
    tags: ["Popular", "New"],
  },
  {
    name: "Burger Atelier",
    cuisine: "Artisan Burgers",
    time: "30-35 min",
    rating: 4.8,
    price: "€€",
    image: IMAGES.food2,
    tags: ["Top Rated"],
  },
  {
    name: "Sakura Sushi",
    cuisine: "Japanese · Fresh",
    time: "25-30 min",
    rating: 4.9,
    price: "€€",
    image: IMAGES.food3,
    tags: ["Favorite"],
  },
  {
    name: "Pizza Napoli",
    cuisine: "Italian · Wood-fired",
    time: "35-40 min",
    rating: 4.7,
    price: "€",
    image: IMAGES.food4,
    tags: ["Popular"],
  },
  {
    name: "Thai Garden",
    cuisine: "Asian · Spicy",
    time: "25-30 min",
    rating: 4.8,
    price: "€",
    image: IMAGES.food5,
    tags: ["New"],
  },
  {
    name: "Sweet Paradise",
    cuisine: "Desserts · Cakes",
    time: "15-20 min",
    rating: 4.9,
    price: "€",
    image: IMAGES.food6,
    tags: ["Trending"],
  },
];

const features = [
  {
    title: "Eco-Friendly Delivery",
    desc: "We use 100% electric bikes for all our urban deliveries.",
    icon: Truck,
    color: "bg-green-50 text-green-600",
  },
  {
    title: "Hygiene Guaranteed",
    desc: "Strict safety protocols for all our kitchen and delivery partners.",
    icon: ShieldCheck,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Ultra Fast Service",
    desc: "Average delivery time of 22 minutes across Berlin districts.",
    icon: Zap,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Best in Class Cuisine",
    desc: "Curated selection of Michelin-star and local favorites.",
    icon: Award,
    color: "bg-purple-50 text-purple-600",
  },
];

const testimonials = [
  {
    name: "Lukas Weber",
    role: "Local Foodie",
    content:
      "The best food delivery experience in Berlin. The tracking is precise and the selection is unmatched.",
    image: IMAGES.testimonial,
    rating: 5,
  },
  {
    name: "Elena Schmidt",
    role: "Culinary Blogger",
    content:
      "Berlin Food brings the restaurant experience to my living room. Always hot, always fresh.",
    image: IMAGES.testimonial2,
    rating: 5,
  },
  {
    name: "Markus Krause",
    role: "Tech Professional",
    content:
      "Efficient, fast, and the customer support is incredible. My go-to app for every meal.",
    image: IMAGES.testimonial3,
    rating: 4,
  },
];

const deals = [
  {
    title: "50% OFF First Order",
    desc: "Use code WELCOME50",
    icon: Percent,
    bg: "bg-orange-500",
  },
  {
    title: "Free Delivery",
    desc: "Orders above €25",
    icon: Truck,
    bg: "bg-green-500",
  },
  {
    title: "Buy 1 Get 1 Free",
    desc: "Selected items",
    icon: Gift,
    bg: "bg-purple-500",
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Location",
    desc: "Enter your Berlin address to find restaurants near you",
  },
  {
    num: "02",
    title: "Pick Your Favorites",
    desc: "Browse menus from hundreds of local restaurants",
  },
  {
    num: "03",
    title: "Place Order",
    desc: "Pay securely and track your delivery in real-time",
  },
];

export default function LandingV1() {
  const router = useRouter();
  const mapCenter = {
    lat: 34.66473579859306,
    lng: 3.2504286095392754,
  };

  useEffect(() => {
    // Client-side mobile redirect as a fallback for production
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      router.push("/menu");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FCF9F8] selection:bg-[#F27121]/20">
      {/* ── Fixed Navigation ── */}
      <nav className="fixed top-0 start-0 end-0 z-50 bg-[#FCF9F8]/95 backdrop-blur-xl border-b border-[#F0EDED] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-[#1C1B1B] tracking-tight">
              برلين<span className="text-[#F27121]">فود</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {["المطاعم", "المطابخ", "العروض", "كيف نعمل"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-sm font-semibold text-[#584237] hover:text-[#F27121] transition-colors">
                  {item}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#584237] hover:text-[#F27121] transition-colors">
              <MapPin size={16} />
              <span className="truncate max-w-[100px]">Alexanderplatz</span>
            </button>
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-[#1C1B1B] hover:text-[#F27121] transition-colors">
              تسجيل الدخول
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2.5 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
              اطلب الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 px-6 overflow-hidden">
        <div className="absolute top-20 end-0 w-[45%] h-[600px] bg-[#F6F3F2] -skew-x-12 translate-x-1/3 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          <div className="lg:col-span-7 pt-8">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F6F3F2] mb-8">
              <span className="w-2 h-2 rounded-full bg-[#F27121] animate-pulse" />
              <span className="text-xs font-bold text-[#F27121] uppercase tracking-[0.15em]">
                نخدم الآن جميع مناطق برلين
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-black text-[#1C1B1B] leading-[0.85] tracking-tighter mb-8">
              المذاق يصلك
              <br />
              <span className="text-[#F27121]">إلى باب منزلك.</span>
            </h1>

            <p className="text-xl text-[#584237] font-medium leading-relaxed max-w-xl mb-10">
              اكتشف أفضل كنوز برلين في الطهي. من الجواهر المخفية المحلية إلى
              تجارب تناول الطعام الراقية، نصلك بها بكل دقة.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="relative flex-1 max-w-md">
                <MapPin
                  size={22}
                  className="absolute start-6 top-1/2 -translate-y-1/2 text-[#F27121]"
                />
                <input
                  type="text"
                  placeholder="أدخل عنوان التوصيل..."
                  className="w-full ps-16 pe-8 py-6 bg-white shadow-xl shadow-orange-900/5 rounded-2xl text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#F27121]/20 transition-all border border-[#F0EDED]"
                />
              </div>
              <button className="px-10 py-6 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-2xl text-base font-bold shadow-lg shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                ابحث عن الطعام
                <ArrowRight size={20} className="rotate-180" />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full border-4 border-white bg-[#F6F3F2] overflow-hidden relative">
                      <Image
                        src={`https://ui-avatars.com/api/?background=F27121&color=fff&name=${i}`}
                        fill
                        alt="user"
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[#F27121] mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} fill="#F27121" />
                  ))}
                </div>
                <p className="text-sm font-bold text-[#1C1B1B]">
                  50,000+ happy Berliners
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-orange-900/15 rotate-2 hover:rotate-0 transition-all duration-1000 group">
              <Image
                src={IMAGES.hero}
                alt="Gourmet Food"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 start-8 end-8 bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/50 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-[#1C1B1B]">
                      Pure Bowl Berlin
                    </h4>
                    <p className="text-sm font-bold text-[#F27121]">
                      Clean & Healthy · 15-20 min
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#F27121] flex items-center justify-center text-white shadow-lg shadow-orange-900/30">
                    <Star size={20} fill="white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute top-1/4 -left-12 p-6 bg-white rounded-3xl shadow-2xl border border-[#F6F3F2] hidden lg:block animate-bounce-slow">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F27121]">
                  <Truck size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#F27121] uppercase tracking-widest mb-0.5">
                    Fastest
                  </p>
                  <p className="text-base font-black text-[#1C1B1B]">
                    12 Min Delivery
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute -bottom-8 -end-8 p-6 bg-white rounded-3xl shadow-2xl border border-[#F6F3F2] hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-0.5">
                    Active Users
                  </p>
                  <p className="text-base font-black text-[#1C1B1B]">10,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-[#F27121] uppercase tracking-[0.3em] mb-4">
              Our Culinary Promise
            </h2>
            <p className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">
              Why choose Berlin Food?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, i) => (
              <div key={i} className="group relative">
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  <feature.icon size={32} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl font-black text-[#1C1B1B] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#584237] font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter mb-2">
                Explore the Map
              </h2>
              <p className="text-[#584237] font-medium">
                Hundreds of flavors at your fingertips
              </p>
            </div>
            <Link
              href="#"
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#F27121] hover:translate-x-1 transition-transform">
              View All Categories <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                href="#"
                className="group bg-white rounded-3xl p-8 text-center hover:-translate-y-3 transition-all duration-500 shadow-sm border border-transparent hover:border-[#F27121]/10 hover:shadow-2xl hover:shadow-orange-900/5">
                <div
                  className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={28} />
                </div>
                <h3 className="font-bold text-[#1C1B1B] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#584237] font-medium">
                  {cat.count} listings
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals Banner ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deals.map((deal, i) => (
              <div
                key={i}
                className={`${deal.bg} rounded-[2rem] p-8 flex items-center gap-6 text-white shadow-xl shadow-orange-900/10 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden relative group`}>
                <div className="absolute top-0 end-0 w-32 h-32 bg-white/10 rounded-full -me-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md relative z-10">
                  <deal.icon size={32} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-black text-xl leading-tight mb-1">
                    {deal.title}
                  </h3>
                  <p className="text-sm font-bold opacity-75">{deal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Map Section ── */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="h-[500px] md:h-[600px] w-full rounded-[3.5rem] overflow-hidden border-8 border-[#F6F3F2] shadow-2xl relative">
                <APIProvider
                  apiKey={
                    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
                  }>
                  <Map
                    center={mapCenter}
                    zoom={15}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    mapId="909e5a3128684855b10ab66a6bc3fef5">
                    <AdvancedMarker position={mapCenter}>
                      <Pin
                        background={"#F27121"}
                        glyphColor={"#ffffff"}
                        borderColor={"#9F4200"}
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
                <div className="absolute top-6 start-6 end-6 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl z-10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#F27121]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#1C1B1B]">
                      Find Near You
                    </h4>
                    <p className="text-xs font-bold text-[#584237]">
                      Showing restaurants in delivery zone
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-sm font-black text-[#F27121] uppercase tracking-[0.3em] mb-4">
                Precision Delivery
              </h2>
              <h2 className="text-4xl md:text-6xl font-black text-[#1C1B1B] tracking-tighter leading-none mb-8">
                Every corner of Berlin,
                <br />
                <span className="text-[#F27121]">covered in minutes.</span>
              </h2>
              <p className="text-xl text-[#584237] font-medium leading-relaxed mb-10 max-w-lg">
                Our smart routing system ensures your food stays at the perfect
                temperature. Track your order with GPS precision from the
                chef&apos;s hands to your doorstep.
              </p>
              <ul className="space-y-6 mb-10">
                {[
                  "Live GPS tracking for all orders",
                  "Verified restaurants with high ratings",
                  "Fastest routes optimized by AI",
                  "Dedicated support team available 24/7",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <Sparkles size={14} />
                    </div>
                    <span className="text-base font-bold text-[#1C1B1B]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <button className="px-10 py-5 bg-[#1C1B1B] text-white rounded-2xl text-base font-bold shadow-xl shadow-black/10 hover:scale-[1.02] transition-transform">
                Browse Area Restaurants
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Popular Restaurants ── */}
      <section className="py-24 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-xs font-black text-[#F27121] uppercase tracking-[0.2em] mb-3">
                Today&apos;s Highlights
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-[#1C1B1B] tracking-tighter">
                Popular Near You
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-3 bg-white shadow-sm border border-[#F0EDED] rounded-2xl text-sm font-bold text-[#1C1B1B] hover:bg-orange-50 hover:border-[#F27121]/20 transition-all">
                <ArrowDownUp size={18} />
                Sort by Rating
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#F27121] text-white rounded-2xl text-sm font-bold shadow-lg shadow-orange-900/10 hover:scale-105 active:scale-95 transition-all">
                <Search size={18} />
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {restaurants.map((rest, i) => (
              <Link
                key={i}
                href="#"
                className="group bg-white rounded-[3rem] overflow-hidden hover:-translate-y-4 transition-all duration-500 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(242,113,33,0.15)] border border-[#F0EDED]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={rest.image}
                    alt={rest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 start-6 flex flex-wrap gap-2">
                    {rest.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-4 py-1.5 bg-white/95 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-widest text-[#1C1B1B] shadow-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-6 end-6 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50">
                    <div className="flex items-center gap-1.5">
                      <Star
                        size={14}
                        fill="#F27121"
                        className="text-[#F27121]"
                      />
                      <span className="text-sm font-black text-[#1C1B1B]">
                        {rest.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-black text-[#1C1B1B] tracking-tight">
                      {rest.name}
                    </h3>
                    <span className="px-3 py-1 bg-[#F6F3F2] rounded-lg text-xs font-black text-[#584237]">
                      {rest.price}
                    </span>
                  </div>
                  <p className="text-base text-[#584237] font-medium mb-5">
                    {rest.cuisine}
                  </p>
                  <div className="flex items-center gap-6 pt-5 border-t border-[#F0EDED]">
                    <div className="flex items-center gap-2 text-[#584237]">
                      <Clock size={16} className="text-[#F27121]" />
                      <span className="text-sm font-bold uppercase tracking-wide">
                        {rest.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#584237]">
                      <Truck size={16} className="text-green-600" />
                      <span className="text-sm font-bold uppercase tracking-wide">
                        Free Delivery
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <button className="px-12 py-5 bg-white border-2 border-[#F0EDED] text-[#1C1B1B] rounded-2xl text-base font-extrabold hover:border-[#F27121] hover:text-[#F27121] transition-all shadow-sm">
              Load More Culinary Treasures
            </button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-black text-[#F27121] uppercase tracking-[0.3em] mb-4">
              Social Proof
            </h2>
            <p className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">
              Loved by Berliners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testi, i) => (
              <div
                key={i}
                className="bg-[#F6F3F2] p-10 rounded-[3rem] relative group hover:-translate-y-2 transition-all duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden relative border-4 border-white shadow-lg">
                    <Image
                      src={testi.image}
                      alt={testi.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-[#1C1B1B]">{testi.name}</h4>
                    <p className="text-xs font-bold text-[#F27121]">
                      {testi.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testi.rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill="#F27121"
                      className="text-[#F27121]"
                    />
                  ))}
                </div>
                <p className="text-lg text-[#584237] font-medium italic leading-relaxed">
                  &ldquo;{testi.content}&rdquo;
                </p>
                <div className="absolute -bottom-4 -end-4 w-24 h-24 bg-[#F27121]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-32 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-black text-[#F27121] uppercase tracking-[0.3em] mb-3">
              Simple Process
            </p>
            <h2 className="text-5xl md:text-6xl font-black text-[#1C1B1B] tracking-tighter mb-6 underline decoration-[#F27121] decoration-8 underline-offset-8">
              How It Works
            </h2>
            <p className="text-xl text-[#584237] font-medium max-w-2xl mx-auto leading-relaxed">
              Order your favorite Berlin cuisine in just three simple steps,
              with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden lg:block absolute top-1/2 start-0 end-0 h-1 bg-dashed border-t-4 border-dashed border-[#F27121]/20 -translate-y-1/2 z-0" />
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative bg-white rounded-[3rem] p-12 text-center group hover:-translate-y-3 transition-all duration-500 shadow-xl shadow-orange-900/5 z-10 border border-[#F0EDED]">
                <div className="absolute -top-10 start-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-[#F27121] to-[#9F4200] rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-orange-900/30 ring-8 ring-[#F6F3F2] group-hover:rotate-6 transition-transform">
                  {step.num}
                </div>
                <h3 className="text-3xl font-black text-[#1C1B1B] mt-10 mb-5 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-lg text-[#584237] font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-[#1C1B1B] p-16 md:p-24 relative overflow-hidden group">
          <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-[#F27121] opacity-10 rounded-full blur-[100px] -me-48 -mt-48 transition-transform duration-1000 group-hover:scale-125" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-sm font-black text-[#F27121] uppercase tracking-[0.2em] mb-6">
                Partnership Opportunities
              </p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
                Grow Your Business
                <br />
                <span className="text-[#F27121]">with Berlin Food</span>
              </h2>
              <p className="text-xl text-white/50 font-medium mb-12 leading-relaxed">
                Join thousands of restaurants and couriers already delivering
                excellence across Berlin. We provide the tools, you provide the
                flavor.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-10 py-5 bg-[#F27121] text-white rounded-2xl text-base font-bold shadow-2xl shadow-orange-900/40 hover:scale-105 active:scale-95 transition-all">
                  Apply as Restaurant
                </button>
                <button className="px-10 py-5 bg-white/5 text-white border-2 border-white/10 rounded-2xl text-base font-bold hover:bg-white/10 transition-all backdrop-blur-md">
                  Join as Courier
                </button>
              </div>
            </div>
            <div className="relative hidden lg:block aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F27121] to-transparent opacity-20 rounded-full animate-pulse" />
              <Image
                src={IMAGES.delivery}
                alt="Delivery"
                fill
                className="rounded-[3rem] object-cover relative z-10 border-4 border-white/10 shadow-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── App Download ── */}
      <section className="py-32 px-6 bg-[#FCF9F8]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-xs font-black text-[#F27121] uppercase tracking-[0.4em] mb-4">
              Mobile Experience
            </h2>
            <h2 className="text-5xl md:text-7xl font-black text-[#1C1B1B] tracking-tighter mb-8 leading-tight">
              Deliciousness in
              <br />
              <span className="text-[#F27121]">your pocket.</span>
            </h2>
            <p className="text-2xl text-[#584237] font-medium mb-12 max-w-xl leading-relaxed">
              Order faster, track deliveries in real-time, and get exclusive
              rewards with our state-of-the-art mobile app.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button className="flex items-center gap-5 px-8 py-5 bg-[#1C1B1B] text-white rounded-3xl hover:scale-105 transition-all shadow-2xl shadow-black/20">
                <span className="text-4xl">🍎</span>
                <div className="text-start">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                    Download on the
                  </p>
                  <p className="text-xl font-black">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-5 px-8 py-5 bg-white border-2 border-[#F0EDED] text-[#1C1B1B] rounded-3xl hover:border-[#F27121] transition-all shadow-xl shadow-orange-900/5">
                <span className="text-4xl">▶</span>
                <div className="text-start">
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">
                    Get it on
                  </p>
                  <p className="text-xl font-black">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="relative h-[600px] flex items-center justify-center lg:justify-end">
            <div className="relative w-[320px] h-[640px] bg-[#1C1B1B] rounded-[4rem] p-4 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] rotate-3">
              <div className="w-full h-full bg-white rounded-[3.5rem] overflow-hidden relative border border-white/5 shadow-inner">
                <Image
                  src={IMAGES.food1}
                  alt="App UI"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-2xl p-8 pt-12 rounded-t-[3rem] border-t border-[#F0EDED]">
                  <div className="w-16 h-1.5 bg-[#F27121] rounded-full mx-auto mb-6" />
                  <h4 className="text-2xl font-black text-[#1C1B1B] text-center mb-8">
                    Ready to Eat?
                  </h4>
                  <div className="space-y-4">
                    <div className="h-12 bg-[#F6F3F2] rounded-xl w-full flex items-center px-4 gap-3">
                      <Search size={16} className="text-[#F27121]" />
                      <div className="h-2 w-24 bg-[#E5E2E1] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Notch */}
              <div className="absolute top-8 start-1/2 -translate-x-1/2 w-32 h-6 bg-[#1C1B1B] rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center bg-[#F27121] rounded-[4rem] p-16 md:p-24 relative overflow-hidden shadow-2xl shadow-orange-900/30">
          <div className="absolute top-0 start-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Join the Berlin Foodies
            </h2>
            <p className="text-xl text-white/80 font-bold mb-12 max-w-xl mx-auto">
              Get the latest curated deals and secret culinary news delivered
              directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address..."
                className="flex-1 px-8 py-6 bg-white/95 backdrop-blur-md rounded-2xl text-base font-bold focus:outline-none focus:ring-4 focus:ring-black/10 placeholder:text-[#584237]/50"
              />
              <button className="px-10 py-6 bg-[#1C1B1B] text-white rounded-2xl text-base font-black hover:scale-105 active:scale-95 transition-all shadow-2xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#F6F3F2] border-t border-[#F0EDED] pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center text-white shadow-lg">
                  <UtensilsCrossed size={24} />
                </div>
                <span className="text-2xl font-black text-[#1C1B1B] tracking-tight">
                  Berlin Food
                </span>
              </div>
              <p className="text-lg text-[#584237] font-medium max-w-sm mb-8 leading-relaxed">
                Elevating the city&apos;s food experience, one perfect delivery
                at a time. Crafted in the heart of Berlin.
              </p>
              <div className="flex items-center gap-5">
                {[
                  { icon: Phone, url: "tel:+49123456789" },
                  { icon: Mail, url: "mailto:hello@berlinfood.com" },
                  {
                    icon: (props: any) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...props}>
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    ),
                    url: "https://www.instagram.com/berlincheese17/",
                  },
                  {
                    icon: (props: any) => (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        {...props}>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                    url: "https://web.facebook.com/profile.php?id=100063674675398",
                  },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#584237] hover:bg-[#F27121] hover:text-white transition-all shadow-sm hover:shadow-lg">
                    <item.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
            {[
              {
                title: "Quick Links",
                links: [
                  "Browse Menu",
                  "Special Deals",
                  "Gift Cards",
                  "Refer a Friend",
                ],
              },
              {
                title: "For Partners",
                links: [
                  "Partner Login",
                  "Restaurant Sign Up",
                  "Marketing Tools",
                  "Support Center",
                ],
              },
              {
                title: "Working with Us",
                links: [
                  "Courier App",
                  "Become a Courier",
                  "Earnings",
                  "Safety FAQ",
                ],
              },
              {
                title: "Our Story",
                links: [
                  "About Us",
                  "Berlin Careers",
                  "Press Kit",
                  "Foodie Blog",
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#F27121] mb-6">
                  {col.title}
                </h4>
                <ul className="space-y-4">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-base font-bold text-[#584237] hover:text-[#F27121] transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-12 border-t border-[#F0EDED] flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-base font-bold text-[#584237]">
              © 2024 Berlin Food Inc. All culinary rights reserved.
            </p>
            <div className="flex items-center gap-10">
              {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-sm font-bold text-[#584237] hover:text-[#F27121] transition-colors">
                    {item}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
