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
  Play,
  Zap,
  ChefHat,
  Leaf,
  Award,
  Phone,
  Mail,
  Globe,
  Truck,
  Shield,
  Headphones,
  ChevronRight,
  Sparkles,
  Flame,
  Heart,
  Share2,
  Filter,
  ArrowDownUp,
  Users,
  Gift,
  Percent
} from "lucide-react";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=900&fit=crop",
  food1: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&h=800&fit=crop",
  food2: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=800&fit=crop",
  food3: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=800&fit=crop",
  food4: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=800&fit=crop",
  food5: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=800&fit=crop",
  food6: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=800&fit=crop",
  chef: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&h=600&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=500&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=500&fit=crop",
  lifestyle: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=600&fit=crop",
  testimonial: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  app: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=600&fit=crop",
};

const restaurants = [
  { name: "Michele's Kitchen", cuisine: "Italian · Fine Dining", time: "40-45 min", rating: 4.9, price: "€€€", image: IMAGES.food1, featured: true },
  { name: "Pizza Artesana", cuisine: "Pizza · Wood-fired", time: "25-30 min", rating: 4.8, price: "€€", image: IMAGES.food2 },
  { name: "Sweet Lab Berlin", cuisine: "Desserts · Cakes", time: "20-25 min", rating: 4.9, price: "€€", image: IMAGES.food3 },
  { name: "Green Bowl Co.", cuisine: "Healthy · Vegan", time: "15-20 min", rating: 4.7, price: "€", image: IMAGES.food4 },
  { name: "Sakura Express", cuisine: "Sushi · Japanese", time: "30-35 min", rating: 4.8, price: "€€", image: IMAGES.food5 },
  { name: "Thai Street Food", cuisine: "Thai · Asian", time: "25-30 min", rating: 4.6, price: "€", image: IMAGES.food6 },
];

const testimonials = [
  { name: "Sarah M.", text: "Best food delivery in Berlin! The variety is incredible and the delivery is always on time.", rating: 5, image: "https://ui-avatars.com/api/?name=Sarah+M&background=F27121&color=fff" },
  { name: "James K.", text: "Finally a platform that understands quality. My favorite restaurant is now just a click away.", rating: 5, image: "https://ui-avatars.com/api/?name=James+K&background=1C1B1B&color=fff" },
  { name: "Emma L.", text: "The courier service is amazing. Always friendly and the food arrives perfectly.", rating: 5, image: "https://ui-avatars.com/api/?name=Emma+L&background=9F4200&color=fff" },
];

const stats = [
  { value: "500+", label: "Partner Restaurants" },
  { value: "50K+", label: "Happy Customers" },
  { value: "15min", label: "Avg. Delivery" },
  { value: "4.9", label: "Average Rating" },
];

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-[#1C1B1B] selection:bg-[#F27121]/30">
      {/* ── Background Effects ── */}
      <div className="fixed top-0 start-1/4 w-[50vw] h-[50vh] bg-[#F27121]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[40vw] h-[40vh] bg-[#9F4200]/10 blur-[80px] rounded-full pointer-events-none" />

      {/* ── Fixed Navigation ── */}
      <nav className="fixed top-4 start-1/2 -translate-x-1/2 z-50 bg-[#1C1B1B]/80 backdrop-blur-2xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center text-white">
            <UtensilsCrossed size={18} />
          </div>
          <span className="text-lg font-black text-white tracking-tighter">BerlinFood</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-widest text-white/50">
          <a href="#" className="hover:text-white hover:text-[#F27121] transition-colors">Menu</a>
          <a href="#" className="hover:text-white hover:text-[#F27121] transition-colors">Chefs</a>
          <a href="#" className="hover:text-white hover:text-[#F27121] transition-colors">Deals</a>
          <a href="#" className="hover:text-white hover:text-[#F27121] transition-colors">Corporate</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-white/50 hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <Link href="/auth/login" className="px-5 py-2 bg-white text-[#1C1B1B] rounded-full text-xs font-semibold hover:bg-[#F27121] hover:text-white transition-all">
            LOG IN
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src={IMAGES.hero}
            alt="Hero Background" 
            fill
            className="object-cover opacity-40 brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B] via-[#1C1B1B]/50 to-[#1C1B1B]/30" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-8">
            <Zap size={14} className="text-[#F27121]" fill="#F27121" />
            <span className="text-[10px] font-black text-[#F27121] uppercase tracking-widest">Speed defined: 15min average delivery</span>
          </div>
          
          <h1 className="text-7xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.85] italic">
            CRAVE.<br />ORDER.<br /><span className="text-[#F27121]">FEAST.</span>
          </h1>

          <div className="flex flex-col items-center gap-8 mt-8">
            <p className="text-xl text-white/60 font-medium max-w-xl">
              The city's finest flavors, curated for those who don't settle for mediocre. Direct to your location in record time.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-10 py-5 bg-[#F27121] text-white rounded-2xl text-lg font-bold shadow-2xl shadow-orange-900/40 hover:scale-110 active:scale-95 transition-all">
                GET STARTED
              </button>
              <button className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all flex items-center gap-3">
                <Play size={24} />
                WATCH STORY
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-12 mt-16 pt-8 border-t border-white/10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Search ── */}
      <section className="relative -mt-12 px-6 z-20">
        <div className="max-w-4xl mx-auto bg-[#1C1B1B] border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MapPin size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F27121]" />
            <input 
              type="text" 
              placeholder="Enter delivery address..."
              className="w-full ps-14 pe-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold placeholder:text-white/30 focus:outline-none focus:border-[#F27121] transition-colors"
            />
          </div>
          <button className="px-8 py-4 bg-[#F27121] text-white rounded-2xl font-bold hover:bg-[#9F4200] transition-colors flex items-center justify-center gap-2">
            <Search size={18} />
            Find Food
          </button>
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section className="py-24 px-6 bg-[#FCF9F8] rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F27121]/10 mb-4">
                <Sparkles size={12} fill="#F27121" />
                <span className="text-[10px] font-semibold text-[#F27121] uppercase tracking-widest">Curated Selection</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-[#1C1B1B] tracking-tighter">The Gallery</h2>
            </div>
            <button className="group flex items-center gap-3 text-lg font-black text-[#1C1B1B] hover:text-[#F27121] transition-colors">
              EXPLORE ALL
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Asymmetric Gallery - staggered heights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:row-span-2 relative rounded-[2.5rem] overflow-hidden group">
              <Image 
                src={IMAGES.food1}
                alt="Food Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-8 start-8">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-3 w-fit">
                  <Award size={12} className="text-[#F27121]" />
                  <span className="text-[10px] font-semibold text-white uppercase">Chef's Pick</span>
                </div>
                <h3 className="text-3xl font-black text-white">Michele's<br/>Kitchen</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Star size={14} fill="#F27121" className="text-[#F27121]" />
                  <span className="text-sm font-semibold text-white/70">4.9 · Italian Fine Dining</span>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-[2rem] overflow-hidden group">
              <Image 
                src={IMAGES.food2}
                alt="Food Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 start-6">
                <h3 className="text-xl font-black text-white">Pizza Artesana</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} fill="#F27121" className="text-[#F27121]" />
                  <span className="text-xs font-semibold text-white/70">4.8 · 25-30 min</span>
                </div>
              </div>
              <button className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#F27121] transition-colors">
                <Heart size={18} />
              </button>
            </div>
            
            <div className="relative rounded-[2rem] overflow-hidden group">
              <Image 
                src={IMAGES.food3}
                alt="Food Gallery"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 start-6">
                <h3 className="text-xl font-black text-white">Sweet Lab</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} fill="#F27121" className="text-[#F27121]" />
                  <span className="text-xs font-semibold text-white/70">4.9 · Desserts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Restaurants ── */}
      <section className="py-24 px-6 bg-[#1C1B1B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">Featured</p>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Top Restaurants</h2>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="p-3 bg-white/5 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                <Filter size={20} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-white/50 hover:text-white text-sm font-semibold">
                <ArrowDownUp size={16} />
                Sort
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((rest, i) => (
              <Link 
                key={i} 
                href="#"
                className="group bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:bg-white/10 hover:border-[#F27121]/30 transition-all hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image 
                    src={rest.image}
                    alt={rest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {rest.featured && (
                    <div className="absolute top-4 start-4 px-3 py-1 bg-[#F27121] rounded-full">
                      <span className="text-xs font-semibold text-white">Featured</span>
                    </div>
                  )}
                  <div className="absolute top-4 end-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#F27121" className="text-[#F27121]" />
                      <span className="text-xs font-bold text-[#1C1B1B]">{rest.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-white">{rest.name}</h3>
                    <span className="text-xs font-semibold text-white/40">{rest.price}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-3">{rest.cuisine}</p>
                  <div className="flex items-center gap-2 text-white/40">
                    <Clock size={14} />
                    <span className="text-sm font-medium">{rest.time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-sm font-semibold hover:bg-white/20 transition-colors">
              View All Restaurants
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6 bg-[#1C1B1B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Elite Chefs", desc: "Berlin's most talented kitchens, curated for excellence.", icon: ChefHat },
              { title: "Zero Emissions", desc: "100% electric delivery fleet for sustainable dining.", icon: Leaf },
              { title: "Premium Experience", desc: "White-glove service from order to doorstep.", icon: Award },
            ].map((f, i) => (
              <div key={i} className="group p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-[#F27121]/10 flex items-center justify-center text-[#F27121] mb-6 group-hover:bg-[#F27121] group-hover:text-white transition-colors">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{f.title}</h3>
                <p className="text-white/60 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 px-6 bg-[#FCF9F8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-2">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black text-[#1C1B1B] tracking-tighter">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 shadow-lg hover:-translate-y-2 transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="#F27121" className="text-[#F27121]" />
                  ))}
                </div>
                <p className="text-[#584237] font-medium leading-relaxed mb-6">"{test.text}"</p>
                <div className="flex items-center gap-4">
                  <Image src={test.image} alt={test.name} className="w-12 h-12 rounded-full" />
                  <div>
                    <p className="font-bold text-[#1C1B1B]">{test.name}</p>
                    <p className="text-xs text-[#584237]">Verified User</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── App Promo ── */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#F27121] to-[#9F4200] relative overflow-hidden">
        <div className="absolute top-0 start-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 border-[40px] border-white rounded-full" />
          <div className="absolute bottom-20 left-20 w-40 h-40 border-[20px] border-white rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md mb-6">
              <Sparkles size={12} fill="white" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">New Features</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
              Berlin is in<br />your pocket.
            </h2>
            <p className="text-white/80 text-xl font-medium max-w-md mb-12">
              Order tracking, real-time rewards, and group ordering. All in the Berlin Food app.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-4 px-8 py-4 bg-white text-[#1C1B1B] rounded-2xl transition-transform hover:scale-105 active:scale-95">
                <span className="text-3xl">🍎</span>
                <div className="text-start">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Get it on</p>
                  <p className="text-xl font-bold leading-none">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-4 px-8 py-4 bg-white/10 text-white border border-white/20 rounded-2xl transition-transform hover:scale-105 active:scale-95">
                <span className="text-3xl">▶</span>
                <div className="text-start">
                  <p className="text-[10px] font-semibold opacity-50 uppercase">Available on</p>
                  <p className="text-xl font-bold leading-none">Google Play</p>
                </div>
              </button>
            </div>
          </div>
          
          <div className="relative h-[600px] flex items-center justify-center">
            <div className="w-[300px] h-[600px] bg-[#1C1B1B] rounded-[3.5rem] p-4 shadow-2xl relative z-10 border-[8px] border-white/10">
               <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                 <Image 
                   src={IMAGES.app}
                   alt="App Preview" 
                   fill 
                   className="object-cover"
                 />
                 <div className="absolute inset-x-0 bottom-0 bg-white p-6 pt-10 border-t border-[#F0EDED]">
                   <div className="w-12 h-1 bg-[#F27121] rounded-full mx-auto mb-6" />
                   <h4 className="text-xl font-black text-[#1C1B1B] text-center mb-1">Freshly Prepared</h4>
                   <p className="text-xs text-[#584237] font-semibold text-center uppercase">Delivery in 8 mins</p>
                 </div>
               </div>
            </div>
            {/* Floating elements */}
            <div className="absolute top-20 end-0 w-20 h-20 bg-[#F27121] rounded-2xl shadow-lg animate-bounce hidden lg:block" />
            <div className="absolute bottom-32 start-0 w-16 h-16 bg-white rounded-full shadow-lg hidden lg:block" />
          </div>
        </div>
      </section>

      {/* ── Become a Partner ── */}
      <section className="py-24 px-6 bg-[#1C1B1B]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="relative">
              <Image 
                src={IMAGES.lifestyle}
                alt="Partner"
                width={600}
                height={500}
                className="rounded-[3rem]"
              />
              <div className="absolute -bottom-8 -end-8 p-6 bg-[#F27121] rounded-3xl text-white hidden lg:block">
                <p className="text-4xl font-black">500+</p>
                <p className="text-sm font-semibold">Partner Restaurants</p>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold text-[#F27121] uppercase tracking-wider mb-4">Partner With Us</p>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-6">
                Grow Your Business
              </h2>
              <p className="text-lg text-white/60 font-medium mb-8">
                Join the fastest growing food delivery platform in Berlin. We help restaurants reach more customers and couriers earn more.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F27121]/10 flex items-center justify-center text-[#F27121]">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Become a Restaurant Partner</h4>
                    <p className="text-sm text-white/50">Reach more customers with our platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F27121]/10 flex items-center justify-center text-[#F27121]">
                    <Users size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Join as a Courier</h4>
                    <p className="text-sm text-white/50">Flexible hours, great earnings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F27121]/10 flex items-center justify-center text-[#F27121]">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Corporate Solutions</h4>
                    <p className="text-sm text-white/50">Employee meal programs & events</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <button className="px-8 py-4 bg-[#F27121] text-white rounded-2xl text-sm font-bold hover:bg-[#9F4200] transition-colors">
                  Get Started
                </button>
                <button className="px-8 py-4 bg-white/5 text-white border border-white/20 rounded-2xl text-sm font-semibold hover:bg-white/10 transition-colors">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 bg-[#0F0F0F] border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F27121] to-[#9F4200] flex items-center justify-center text-white">
                  <UtensilsCrossed size={18} />
                </div>
                <span className="text-xl font-black text-white">BerlinFood</span>
              </div>
              <p className="text-sm text-white/40 max-w-xs mb-6">
                The city's finest flavors, delivered to your doorstep in minutes.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#F27121] hover:text-white transition-colors">
                  <Globe size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#F27121] hover:text-white transition-colors">
                  <span className="text-lg">✉</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-[#F27121] hover:text-white transition-colors">
                  <Phone size={18} />
                </a>
              </div>
            </div>
            {[
              { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
              { title: "Support", links: ["Help Center", "Contact Us", "FAQ", "Terms"] },
              { title: "Legal", links: ["Privacy", "Imprint", "Cookies", "Accessibility"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white/20 text-xs font-semibold uppercase">© 2024 Berlin Food Tech · Built for speed</span>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-white/40 text-xs hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}