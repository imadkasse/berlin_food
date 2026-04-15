"use client";

import Image from "next/image";
import Link from "next/link";
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
  Menu,
  X,
  Coffee,
  Pizza,
  Salad,
  Fish,
  IceCream,
  Wine,
  Users,
  Heart,
  Gift,
  Percent,
  ArrowDownUp
} from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=900&fit=crop",
  food1: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=700&fit=crop",
  food2: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=700&fit=crop",
  food3: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=700&fit=crop",
  food4: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=700&fit=crop",
  food5: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=700&fit=crop",
  food6: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=700&fit=crop",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop",
  delivery: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop",
  testimonial: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
};

const categories = [
  { name: "Pizza", icon: Pizza, count: "120+", color: "bg-orange-100 text-orange-600" },
  { name: "Burgers", icon: Coffee, count: "85+", color: "bg-amber-100 text-amber-600" },
  { name: "Salads", icon: Salad, count: "65+", color: "bg-green-100 text-green-600" },
  { name: "Sushi", icon: Fish, count: "90+", color: "bg-blue-100 text-blue-600" },
  { name: "Desserts", icon: IceCream, count: "75+", color: "bg-pink-100 text-pink-600" },
  { name: "Drinks", icon: Wine, count: "100+", color: "bg-purple-100 text-purple-600" },
];

const restaurants = [
  { name: "Garden Bowl Co.", cuisine: "Healthy · Vegan", time: "20-25 min", rating: 4.9, price: "€", image: IMAGES.food1, tags: ["Popular", "New"] },
  { name: "Burger Atelier", cuisine: "Artisan Burgers", time: "30-35 min", rating: 4.8, price: "€€", image: IMAGES.food2, tags: ["Top Rated"] },
  { name: "Sakura Sushi", cuisine: "Japanese · Fresh", time: "25-30 min", rating: 4.9, price: "€€", image: IMAGES.food3, tags: ["Favorite"] },
  { name: "Pizza Napoli", cuisine: "Italian · Wood-fired", time: "35-40 min", rating: 4.7, price: "€", image: IMAGES.food4, tags: ["Popular"] },
  { name: "Thai Garden", cuisine: "Asian · Spicy", time: "25-30 min", rating: 4.8, price: "€", image: IMAGES.food5, tags: ["New"] },
  { name: "Sweet Paradise", cuisine: "Desserts · Cakes", time: "15-20 min", rating: 4.9, price: "€", image: IMAGES.food6, tags: ["Trending"] },
];

const deals = [
  { title: "50% OFF First Order", desc: "Use code WELCOME50", icon: Percent, bg: "bg-orange-500" },
  { title: "Free Delivery", desc: "Orders above €25", icon: Truck, bg: "bg-green-500" },
  { title: "Buy 1 Get 1 Free", desc: "Selected items", icon: Gift, bg: "bg-purple-500" },
];

const steps = [
  { num: "01", title: "Choose Location", desc: "Enter your Berlin address to find restaurants near you" },
  { num: "02", title: "Pick Your Favorites", desc: "Browse menus from hundreds of local restaurants" },
  { num: "03", title: "Place Order", desc: "Pay securely and track your delivery in real-time" },
];

export default function LandingV1() {
  return (
    <div className="min-h-screen bg-[#FCF9F8] selection:bg-[#F27121]/20">
      {/* ── Fixed Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FCF9F8]/95 backdrop-blur-xl border-b border-[#F0EDED] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="text-xl font-black text-[#1C1B1B] tracking-tight">
              Berlin<span className="text-[#F27121]">Food</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {["Restaurants", "Cuisines", "Deals", "How it Works"].map((item) => (
              <Link key={item} href="#" className="text-sm font-semibold text-[#584237] hover:text-[#F27121] transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#584237] hover:text-[#F27121] transition-colors">
              <MapPin size={16} />
              <span className="truncate max-w-[100px]">Alexanderplatz</span>
            </button>
            <Link href="/auth/login" className="text-sm font-semibold text-[#1C1B1B] hover:text-[#F27121] transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-5 py-2.5 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-20 right-0 w-[45%] h-[600px] bg-[#F6F3F2] -skew-x-12 translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          <div className="lg:col-span-7 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F3F2] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#F27121] animate-pulse" />
              <span className="text-xs font-semibold text-[#F27121] uppercase tracking-wider">Now serving all Berlin districts</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-[#1C1B1B] leading-[0.9] tracking-tighter mb-6">
              Flavor delivered<br />
              <span className="text-[#F27121]">to your doorstep.</span>
            </h1>
            
            <p className="text-xl text-[#584237] font-medium leading-relaxed max-w-lg mb-8">
              Discover the best culinary treasures of Berlin. From local hidden gems to curated high-end dining.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-sm">
                <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F27121]" />
                <input 
                  type="text" 
                  placeholder="Enter your delivery address..."
                  className="w-full pl-14 pr-6 py-5 bg-[#F6F3F2] rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F27121]/20 transition-all"
                />
              </div>
              <button className="px-8 py-5 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-2xl text-sm font-semibold shadow-lg shadow-orange-900/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                Find Food
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-[#F6F3F2] overflow-hidden">
                      <Image src={`https://ui-avatars.com/api/?background=F27121&color=fff&name=${i}`} fill alt="user" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#F27121]">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F27121" />)}
              </div>
              <p className="text-sm font-semibold text-[#584237]">50,000+ happy Berliners</p>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-900/10 rotate-1 hover:rotate-0 transition-transform duration-700">
              <Image 
                src={IMAGES.hero}
                alt="Gourmet Food"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-[#1C1B1B]">Pure Bowl Berlin</h4>
                    <p className="text-xs font-semibold text-[#F27121]">Clean & Healthy · 15-20 min</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F27121] flex items-center justify-center text-white">
                    <Star size={18} fill="white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute top-1/3 -left-6 p-5 bg-white rounded-3xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F27121]">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#584237] uppercase">Fastest</p>
                  <p className="text-sm font-black text-[#1C1B1B]">12 Min Delivery</p>
                </div>
              </div>
            </div>

            {/* Floating Badge 2 */}
            <div className="absolute bottom-20 -right-4 p-4 bg-white rounded-2xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#584237]">Active Users</p>
                  <p className="text-sm font-black text-[#1C1B1B]">10,000+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-16 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#1C1B1B] tracking-tighter">Browse by Category</h2>
            <Link href="#" className="text-sm font-semibold text-[#F27121] flex items-center gap-2 hover:gap-3 transition-all">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href="#"
                className="group bg-white rounded-2xl p-6 text-center hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-orange-900/10"
              >
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <cat.icon size={24} />
                </div>
                <h3 className="font-bold text-[#1C1B1B] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#584237]">{cat.count} restaurants</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deals Banner ── */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deals.map((deal, i) => (
              <div key={i} className={`${deal.bg} rounded-2xl p-6 flex items-center gap-4 text-white`}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <deal.icon size={28} />
                </div>
                <div>
                  <h3 className="font-black text-lg">{deal.title}</h3>
                  <p className="text-sm font-medium opacity-80">{deal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Restaurants ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">The Selection</p>
              <h2 className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">Popular Near You</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#F6F3F2] rounded-xl text-sm font-semibold text-[#1C1B1B] hover:bg-[#F0EDED] transition-colors">
                <ArrowDownUp size={16} />
                Sort
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#F6F3F2] rounded-xl text-sm font-semibold text-[#1C1B1B] hover:bg-[#F0EDED] transition-colors">
                <MapPin size={16} />
                Filter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((rest, i) => (
              <Link 
                key={i} 
                href="#"
                className="group bg-white rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-900/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image 
                    src={rest.image}
                    alt={rest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {rest.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#1C1B1B]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F27121" className="text-[#F27121]" />
                      <span className="text-xs font-bold text-[#1C1B1B]">{rest.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-[#1C1B1B]">{rest.name}</h3>
                    <span className="text-xs font-semibold text-[#584237]">{rest.price}</span>
                  </div>
                  <p className="text-sm text-[#584237] mb-3">{rest.cuisine}</p>
                  <div className="flex items-center gap-2 text-[#584237]">
                    <Clock size={14} />
                    <span className="text-sm font-medium">{rest.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-[#F6F3F2] text-[#1C1B1B] rounded-2xl text-sm font-semibold hover:bg-[#F27121] hover:text-white transition-all">
              Load More Restaurants
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter mb-4">
              How It Works
            </h2>
            <p className="text-lg text-[#584237] font-medium max-w-2xl mx-auto">
              Order your favorite Berlin cuisine in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative bg-white rounded-3xl p-10 text-center group hover:-translate-y-2 transition-all duration-300">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#F27121] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-900/20">
                  {step.num}
                </div>
                <h3 className="text-2xl font-black text-[#1C1B1B] mt-8 mb-4">{step.title}</h3>
                <p className="text-[#584237] font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-[#1C1B1B] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F27121] to-transparent opacity-10 rounded-full -mr-48 -mt-48" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-4">Partner With Us</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                Grow Your Business with Berlin Food
              </h2>
              <p className="text-lg text-white/60 font-medium mb-8">
                Join thousands of restaurants and couriers already delivering excellence across Berlin.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-[#F27121] text-white rounded-2xl text-sm font-semibold hover:scale-105 transition-transform">
                  Become a Restaurant Partner
                </button>
                <button className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl text-sm font-semibold hover:bg-white/20 transition-colors">
                  Join as Courier
                </button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image 
                src={IMAGES.delivery}
                alt="Delivery"
                width={500}
                height={400}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── App Download ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#F6F3F2] to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-black text-[#1C1B1B] tracking-tighter mb-6">
              Get the App
            </h2>
            <p className="text-xl text-[#584237] font-medium mb-8 max-w-lg">
              Order faster, track deliveries in real-time, and get exclusive deals with our mobile app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-4 px-6 py-4 bg-[#1C1B1B] text-white rounded-2xl hover:scale-105 transition-transform">
                <span className="text-3xl">🍎</span>
                <div className="text-left">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Download on the</p>
                  <p className="text-lg font-bold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-4 px-6 py-4 bg-white border-2 border-[#F0EDED] text-[#1C1B1B] rounded-2xl hover:border-[#F27121] transition-colors">
                <span className="text-3xl">▶</span>
                <div className="text-left">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Get it on</p>
                  <p className="text-lg font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="relative h-[400px] flex items-center justify-center">
            <div className="w-[280px] h-[560px] bg-[#1C1B1B] rounded-[3rem] p-3 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <Image 
                  src={IMAGES.food1}
                  alt="App"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-white p-6 pt-12 rounded-t-[2rem]">
                  <div className="w-12 h-1 bg-[#F27121] rounded-full mx-auto mb-4" />
                  <h4 className="text-xl font-black text-[#1C1B1B] text-center">Order Now</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#1C1B1B] tracking-tighter mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-[#584237] font-medium mb-8">
            Get the latest deals and news delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email..."
              className="flex-1 px-6 py-4 bg-[#F6F3F2] rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F27121]/20"
            />
            <button className="px-8 py-4 bg-[#F27121] text-white rounded-2xl text-sm font-semibold hover:bg-[#9F4200] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#F6F3F2] border-t border-[#F0EDED] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center text-white">
                  <UtensilsCrossed size={18} />
                </div>
                <span className="text-xl font-black text-[#1C1B1B]">Berlin Food</span>
              </div>
              <p className="text-sm text-[#584237] font-medium max-w-xs mb-6">
                Elevating the city's food experience, one delivery at a time.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#584237] hover:bg-[#F27121] hover:text-white transition-colors">
                  <Phone size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#584237] hover:bg-[#F27121] hover:text-white transition-colors">
                  <Mail size={18} />
                </a>
              </div>
            </div>
            {[
              { title: "Quick Links", links: ["Browse", "Deals", "Gift Cards", "Referrals"] },
              { title: "For Restaurants", links: ["Partner Login", "Restaurant Sign Up", "Marketing", "Support"] },
              { title: "For Couriers", links: ["Courier App", "Become a Courier", "Earnings", "FAQ"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Blog"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#F27121] mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm font-medium text-[#584237] hover:text-[#F27121] transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-[#F0EDED] flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#584237]">© 2024 Berlin Food. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-[#584237] hover:text-[#F27121] transition-colors">Privacy</a>
              <a href="#" className="text-sm font-medium text-[#584237] hover:text-[#F27121] transition-colors">Terms</a>
              <a href="#" className="text-sm font-medium text-[#584237] hover:text-[#F27121] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}