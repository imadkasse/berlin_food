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
  ChevronDown,
  Sparkles,
  Wallet,
  Store,
  Award,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Menu,
  Gift,
  Percent,
  Truck,
  Shield,
  Headphones,
  ChefHat,
  Leaf,
  Users,
  Heart,
  ArrowDownUp,
  Play,
  Zap
} from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&h=1000&fit=crop",
  food1: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop",
  food2: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=600&fit=crop",
  food3: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
  food4: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop",
  food5: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop",
  food6: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=600&fit=crop",
  lifestyle: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&h=600&fit=crop",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop",
  app: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop",
};

const categories = [
  { name: "Artisan Pizza", emoji: "🍕", count: "120+", color: "from-orange-100 to-orange-50" },
  { name: "Super Bowls", emoji: "🥗", count: "85+", color: "from-green-100 to-green-50" },
  { name: "Craft Burger", emoji: "🍔", count: "90+", color: "from-amber-100 to-amber-50" },
  { name: "Fine Sushi", emoji: "🍣", count: "75+", color: "from-blue-100 to-blue-50" },
  { name: "Asian Fusion", emoji: "🍜", count: "95+", color: "from-red-100 to-red-50" },
  { name: "Sweet Treats", emoji: "🍰", count: "70+", color: "from-pink-100 to-pink-50" },
];

const restaurants = [
  { name: "Green Bowl Co.", rating: 4.9, time: "20 min", cuisine: "Healthy", price: "€", image: IMAGES.food1, tags: ["Popular", "New"] },
  { name: "Pizza Napoli", rating: 4.8, time: "35 min", cuisine: "Italian", price: "€€", image: IMAGES.food4, tags: ["Top Rated"] },
  { name: "Tokyo Sushi", rating: 4.9, time: "25 min", cuisine: "Japanese", price: "€€", image: IMAGES.food5, tags: ["Favorite"] },
  { name: "Thai Garden", rating: 4.7, time: "30 min", cuisine: "Thai", price: "€", image: IMAGES.food2, tags: ["New"] },
  { name: "Burger Bros", rating: 4.8, time: "25 min", cuisine: "American", price: "€", image: IMAGES.food3, tags: ["Trending"] },
  { name: "Sweet Paradise", rating: 4.9, time: "15 min", cuisine: "Desserts", price: "€", image: IMAGES.food6, tags: ["Popular"] },
];

const deals = [
  { title: "25% OFF", subtitle: "First 3 Orders", icon: Percent, color: "bg-orange-500" },
  { title: "Free Delivery", subtitle: "Above €30", icon: Truck, color: "bg-green-500" },
  { title: "VIP Access", subtitle: "Exclusive Events", icon: Gift, color: "bg-purple-500" },
];

const testimonials = [
  { name: "Anna Berg", role: "Food Blogger", text: "Berlin Food has completely transformed how I discover new restaurants. The quality is unmatched!", avatar: "https://ui-avatars.com/api/?name=Anna+Berg&background=F27121&color=fff" },
  { name: "Markus Weber", role: "Regular Customer", text: "Fast delivery, amazing food, and great prices. What more could you ask for?", avatar: "https://ui-avatars.com/api/?name=Markus+Weber&background=1C1B1B&color=fff" },
  { name: "Lisa Schmidt", role: "Restaurant Owner", text: "Our sales have increased 40% since joining Berlin Food. Amazing platform!", avatar: "https://ui-avatars.com/api/?name=Lisa+Schmidt&background=9F4200&color=fff" },
];

export default function LandingV3() {
  return (
    <div className="min-h-screen bg-[#FCF9F8] selection:bg-[#F27121]/20">
      {/* ── Fixed Navigation ── */}
      <nav className="fixed top-0 start-0 end-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#F0EDED] px-6 py-4">
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
            {["Discover", "Restaurants", "Cuisines", "Deals", "About"].map((item) => (
              <Link key={item} href="#" className="text-sm font-semibold text-[#584237] hover:text-[#F27121] transition-colors">
                {item}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 p-2 text-[#584237] hover:text-[#F27121] transition-colors">
              <MapPin size={18} />
            </button>
            <Link href="/auth/login" className="text-sm font-semibold text-[#1C1B1B] hover:text-[#F27121] transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="px-5 py-2.5 bg-gradient-to-br from-[#F27121] to-[#9F4200] text-white rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-orange-900/20">
              Join Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 end-0 w-[60%] h-full bg-[#F6F3F2] -skew-x-12 translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          <div className="lg:col-span-7 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F27121]/10 text-[#F27121] mb-6">
              <Sparkles size={14} fill="#F27121" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Luxury Food Experience in Berlin</span>
            </div>
            
            <h1 className="text-6xl md:text-[9rem] font-black text-[#1C1B1B] leading-[0.85] tracking-tighter mb-6">
              Dining.<br /><span className="text-[#F27121]">Redefined.</span>
            </h1>
            
            <p className="text-2xl text-[#584237] font-medium leading-relaxed max-w-xl mb-10">
              The platform where Berlin's most exclusive kitchens meet your home dining table.
            </p>

            {/* Premium Search Bar */}
            <div className="p-4 bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 max-w-2xl border border-[#F0EDED] flex items-center gap-2 mb-10">
               <div className="flex-1 px-4 flex items-center gap-4 border-e border-[#F0EDED]">
                 <MapPin className="text-[#F27121]" size={20} />
                 <input 
                   type="text" 
                   placeholder="Where are you in Berlin?" 
                   className="w-full py-2 bg-transparent text-[#1C1B1B] font-semibold text-sm focus:outline-none"
                 />
               </div>
               <button className="h-14 w-14 lg:w-48 bg-[#F27121] text-white rounded-[1.8rem] flex items-center justify-center lg:gap-3 hover:bg-[#9F4200] transition-colors overflow-hidden">
                 <Search size={22} />
                 <span className="hidden lg:block font-semibold text-sm">Discover Chefs</span>
               </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-8">
              <div>
                <p className="text-4xl font-black text-[#1C1B1B]">500+</p>
                <p className="text-sm text-[#584237]">Partner Restaurants</p>
              </div>
              <div className="w-px h-12 bg-[#F0EDED]" />
              <div>
                <p className="text-4xl font-black text-[#1C1B1B]">15min</p>
                <p className="text-sm text-[#584237]">Average Delivery</p>
              </div>
              <div className="w-px h-12 bg-[#F0EDED]" />
              <div>
                <p className="text-4xl font-black text-[#1C1B1B]">4.9</p>
                <p className="text-sm text-[#584237]">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-2xl shadow-orange-900/10 transition-transform duration-700 hover:scale-[1.02]">
              <Image 
                src={IMAGES.hero}
                alt="Lifestyle Food"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-8 start-8 end-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-4 w-fit">
                  <Award size={14} className="text-[#F27121]" fill="#F27121" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Editor's Pick</span>
                </div>
                <h4 className="text-4xl font-black text-white leading-none mb-4">Sustainable <br />Gourmet Box</h4>
                <button className="px-6 py-3 bg-white text-[#1C1B1B] rounded-xl text-xs font-semibold hover:bg-[#F27121] hover:text-white transition-colors flex items-center gap-2">
                  Explore Menu
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-8 -end-8 w-40 h-40 bg-white rounded-3xl p-6 shadow-xl pointer-events-none hidden lg:flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#F27121] mb-3">
                  <Sparkles size={24} fill="#F27121" />
               </div>
               <p className="text-[10px] font-semibold text-[#584237] uppercase leading-none">Top Rated</p>
               <p className="text-xs font-bold text-[#1C1B1B] mt-1 tracking-tighter">Kitchens 2024</p>
            </div>

            <div className="absolute -bottom-6 -start-6 p-5 bg-white rounded-2xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                  <Zap size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#584237]">Lightning Fast</p>
                  <p className="text-sm font-black text-[#1C1B1B]">15 min avg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Deals Banner ── */}
      <section className="py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.map((deal, i) => (
              <div key={i} className={`${deal.color} rounded-2xl p-5 flex items-center gap-4 text-white`}>
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <deal.icon size={24} />
                </div>
                <div>
                  <h3 className="font-black text-lg">{deal.title}</h3>
                  <p className="text-sm font-medium opacity-80">{deal.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cuisine Grid ── */}
      <section className="py-20 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-[#1C1B1B] tracking-tighter">Browse Cuisines</h2>
              <p className="text-[#584237] font-medium mt-2">Explore the best of Berlin's food scene</p>
            </div>
            <button className="text-sm font-semibold text-[#F27121] uppercase tracking-[3px] flex items-center gap-2 hover:gap-3 transition-all">
              More Categories
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                href="#"
                className="group bg-white rounded-[2rem] p-6 text-center hover:-translate-y-2 transition-all duration-300 border border-[#F0EDED] hover:border-[#F27121]/30 hover:shadow-xl"
              >
                 <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                   {cat.emoji}
                 </div>
                 <span className="font-bold text-[#1C1B1B] group-hover:text-[#F27121] transition-colors text-sm">{cat.name}</span>
                 <p className="text-xs text-[#584237] mt-1">{cat.count} restaurants</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Restaurants ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">Handpicked</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">Featured Restaurants</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restaurants.map((rest, i) => (
              <Link 
                key={i} 
                href="#"
                className="group bg-white rounded-[2.5rem] overflow-hidden hover:-translate-y-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-900/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image 
                    src={rest.image}
                    alt={rest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 start-4 flex gap-2">
                    {rest.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-semibold text-[#1C1B1B]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-4 end-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F27121" className="text-[#F27121]" />
                      <span className="text-xs font-bold text-[#1C1B1B]">{rest.rating}</span>
                    </div>
                  </div>
                  <button className="absolute bottom-4 end-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#F27121] hover:bg-[#F27121] hover:text-white transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-[#1C1B1B]">{rest.name}</h3>
                    <span className="text-xs font-semibold text-[#584237]">{rest.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#584237]">{rest.cuisine}</p>
                    <div className="flex items-center gap-2 text-[#584237]">
                      <Clock size={14} />
                      <span className="text-sm font-medium">{rest.time}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-[#F6F3F2] text-[#1C1B1B] rounded-2xl text-sm font-semibold hover:bg-[#F27121] hover:text-white transition-all">
              View All Restaurants
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#F27121] to-[#9F4200] relative overflow-hidden">
        <div className="absolute top-0 start-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-60 h-60 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-40 h-40 border-2 border-white rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
              Three Easy Steps
            </h2>
            <p className="text-xl text-white/80 font-medium">
              Get your favorite food delivered in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "1", title: "Choose Location", desc: "Enter your Berlin address" },
              { num: "2", title: "Pick Your Food", desc: "Browse from 500+ restaurants" },
              { num: "3", title: "Enjoy Delivery", desc: "Track in real-time" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#F27121] font-black text-3xl mx-auto mb-6 shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{step.title}</h3>
                <p className="text-white/80 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Partner Section ── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 order-2 lg:order-1 relative">
            <div className="grid grid-cols-2 gap-6 relative z-10">
               <div className="h-64 bg-white rounded-[3rem] p-10 shadow-lg flex flex-col justify-center border border-[#F0EDED]">
                 <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
                   <Wallet size={32} />
                 </div>
                 <h4 className="text-2xl font-black text-[#1C1B1B] mb-2 tracking-tight">Top Earnings</h4>
                 <p className="text-sm font-medium text-[#584237]">For the best couriers in town.</p>
               </div>
               <div className="h-64 bg-[#1C1B1B] text-white rounded-[3rem] p-10 shadow-xl mt-12 flex flex-col justify-center">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-6">
                   <Store size={32} />
                 </div>
                 <h4 className="text-2xl font-black mb-2 tracking-tight">Partner Perks</h4>
                 <p className="text-sm font-medium text-white/50">Grow your business with us.</p>
               </div>
            </div>
            {/* Background Blob */}
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F27121]/5 blur-[80px] rounded-full pointer-events-none" />
          </div>

          <div className="flex-1 order-1 lg:order-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27121]/10 mb-6">
               <Sparkles size={12} fill="#F27121" />
               <span className="text-[10px] font-semibold text-[#F27121] uppercase tracking-widest">Join Our Network</span>
             </div>
             <h2 className="text-5xl md:text-7xl font-black text-[#1C1B1B] tracking-tighter leading-none mb-8">
               Join the <br /><span className="text-[#F27121]">Berlin movement.</span>
             </h2>
             <p className="text-xl text-[#584237] font-medium leading-relaxed mb-10 max-w-lg">
               Whether you're a high-end chef or an elite courier, we provide the platform to showcase the best of Berlin.
             </p>
             <div className="flex flex-col sm:flex-row gap-6">
                <button className="px-10 py-5 bg-[#F27121] text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-[#9F4200] transition-colors shadow-lg shadow-orange-900/20">
                  Become a Partner
                  <ArrowRight size={18} />
                </button>
                <button className="px-10 py-5 bg-white text-[#1C1B1B] rounded-2xl text-sm font-semibold border border-[#F0EDED] hover:bg-[#1C1B1B] hover:text-white transition-all shadow-sm">
                  Corporate Catering
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-[#F6F3F2]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">What People Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 shadow-lg hover:-translate-y-2 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <Image src={test.avatar} alt={test.name} className="w-14 h-14 rounded-full" />
                  <div>
                    <p className="font-black text-[#1C1B1B]">{test.name}</p>
                    <p className="text-xs text-[#584237]">{test.role}</p>
                  </div>
                </div>
                <p className="text-[#584237] font-medium leading-relaxed">"{test.text}"</p>
                <div className="flex items-center gap-1 mt-6">
                  {[1,2,3,4,5].map((_, j) => (
                    <Star key={j} size={14} fill="#F27121" className="text-[#F27121]" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Download ── */}
      <section className="py-24 px-6 bg-[#1C1B1B]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
              Download<br /><span className="text-[#F27121]">the App</span>
            </h2>
            <p className="text-xl text-white/60 font-medium mb-10 max-w-lg">
              Get exclusive deals, faster ordering, and real-time delivery tracking with our mobile app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center gap-4 px-8 py-4 bg-white text-[#1C1B1B] rounded-2xl hover:scale-105 transition-transform">
                <span className="text-3xl">🍎</span>
                <div className="text-start">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Download on the</p>
                  <p className="text-lg font-bold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-4 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-colors">
                <span className="text-3xl">▶</span>
                <div className="text-start">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Get it on</p>
                  <p className="text-lg font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          <div className="relative h-[500px] flex items-center justify-center">
            <div className="w-[280px] h-[560px] bg-[#1C1B1B] rounded-[3rem] p-3 shadow-2xl border border-white/10">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <Image 
                  src={IMAGES.app}
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

      {/* ── Footer ── */}
      <footer className="bg-[#1C1B1B] py-20 px-6 text-white rounded-t-[5rem]">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
              <div className="col-span-2">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-br from-[#F27121] to-[#9F4200] rounded-2xl flex items-center justify-center">
                     <UtensilsCrossed size={28} className="text-white" />
                   </div>
                   <span className="text-3xl font-black tracking-tighter leading-none">BerlinFood</span>
                 </div>
                 <p className="text-white/40 text-sm font-medium max-w-xs leading-relaxed mb-8">
                   Celebrating the art of culinary delivery. Berlin's heartbeat in every meal.
                 </p>
<div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F27121] transition-colors text-lg">
                      📷
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F27121] transition-colors text-lg">
                      📘
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F27121] transition-colors text-lg">
                      🐦
                    </a>
                  </div>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[3px] text-[#F27121] mb-6">Platform</h4>
                <ul className="space-y-4">
                  {["Restaurants", "Courier App", "For Business", "Download App"].map(l => (
                    <li key={l}><a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[3px] text-[#F27121] mb-6">Company</h4>
                <ul className="space-y-4">
                  {["Our Story", "Sustainability", "Careers", "Press"].map(l => (
                    <li key={l}><a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[3px] text-[#F27121] mb-6">Legal</h4>
                <ul className="space-y-4">
                  {["Privacy", "Imprint", "Terms", "Cookies"].map(l => (
                    <li key={l}><a href="#" className="text-sm font-medium text-white/50 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[3px] text-[#F27121] mb-6">Contact</h4>
                <ul className="space-y-4">
                  <li className="flex items-center gap-2 text-sm font-medium text-white/50">
                    <Phone size={16} /> +49 30 12345678
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium text-white/50">
                    <Mail size={16} /> hello@berlinfood.de
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-white/30 text-sm">© 2024 Berlin Food. All rights reserved.</p>
              <p className="text-white/30 text-sm">Made with ❤️ in Berlin</p>
            </div>
         </div>
      </footer>
    </div>
  );
}