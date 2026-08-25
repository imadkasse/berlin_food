"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { APIProvider, AdvancedMarker, Map, Pin } from "@vis.gl/react-google-maps";
import {
  ArrowLeft,
  ArrowUpLeft,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import styles from "./LandingV1.module.css";

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=1000&fit=crop",
  bowl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&h=700&fit=crop",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&h=700&fit=crop",
  sushi: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=700&h=700&fit=crop",
  pizza: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=700&h=700&fit=crop",
  delivery: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&h=700&fit=crop",
  testimonial: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop",
};

const restaurants = [
  { name: "Burger Atelier", cuisine: "برغر حرفي · نويكولن", time: "30–35 دقيقة", rating: "4.8", image: IMAGES.burger },
  { name: "Sakura Sushi", cuisine: "ياباني · طازج", time: "25–30 دقيقة", rating: "4.9", image: IMAGES.sushi },
  { name: "Pizza Napoli", cuisine: "إيطالي · فرن حجري", time: "35–40 دقيقة", rating: "4.7", image: IMAGES.pizza },
];

const steps = [
  { number: "01", title: "حدد عنوانك", text: "نرسم لك دائرة التوصيل حول بابك." },
  { number: "02", title: "اختر مطبخك", text: "وجوه محلية، قوائم منتقاة، ووقت واضح." },
  { number: "03", title: "اترك الباقي لنا", text: "من الموقد إلى عتبتك، بلا تخمين." },
];

const MAP_CENTER = { lat: 34.66473579859306, lng: 3.2504286095392754 };

export default function LandingV1() {
  const router = useRouter();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) router.push("/menu");
  }, [router]);

  return (
    <div dir="rtl" className={`${styles.page} ${styles.motion}`}>
      <a className={styles.skipLink} href="#main-content">تخطى إلى المحتوى الرئيسي</a>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="التنقل الرئيسي">
          <Link href="/" className={styles.brand} aria-label="برلين فود، الصفحة الرئيسية">
            <span className={styles.brandMark}><UtensilsCrossed size={19} aria-hidden="true" /></span>
            <span>برلين<span className={styles.orange}>فود</span></span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#restaurants">المطاعم</Link>
            <Link href="#map">خريطة التوصيل</Link>
            <Link href="#how-it-works">كيف نعمل</Link>
          </div>
          <div className={styles.navActions}>
            <Link href="/auth/login" className={styles.login}>تسجيل الدخول</Link>
            <Link href="/auth/register" className={styles.navCta}>ابدأ طلبك <ArrowLeft size={16} aria-hidden="true" /></Link>
          </div>
          <Link href="/menu" className={styles.menuButton} aria-label="فتح قائمة الطعام"><Menu size={21} /></Link>
        </nav>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <div className={styles.kicker}><span className={styles.liveDot} /> برلين، الليلة / 18:42</div>
            <p className={styles.eyebrow}>الطعام كما يجب أن يصل</p>
            <h1 id="hero-title">المدينة<br /><em>على طبق.</em></h1>
            <p className={styles.heroIntro}>مطابخ برلين المفضلة، مرتبة بعناية وتصل دافئة إلى بابك. اختر مزاج الليلة، ونحن نتكفل بالطريق.</p>
            <form className={styles.addressForm} action="/menu">
              <label htmlFor="hero-address" className={styles.srOnly}>عنوان التوصيل</label>
              <MapPin size={20} aria-hidden="true" />
              <input id="hero-address" name="address" type="text" placeholder="أدخل عنوان التوصيل" autoComplete="street-address" />
              <button type="submit">اعثر على عشاءك <ArrowLeft size={17} aria-hidden="true" /></button>
            </form>
            <div className={styles.heroNote}><span>توصيل كهربائي</span><span>•</span><span>متوسط 22 دقيقة</span><span>•</span><span>بدون رسوم مخفية</span></div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.imageFrame}>
              <Image src={IMAGES.hero} alt="مائدة طعام متنوعة من مطاعم برلين" fill preload sizes="(max-width: 800px) 100vw, 52vw" className={styles.coverImage} />
              <div className={styles.imageCaption}><span>01 / 04</span><span>اختيار المحرر</span></div>
            </div>
            <div className={styles.routeBoard}>
              <div className={styles.routeTop}><span>ROUTE / BF–017</span><Navigation size={17} aria-hidden="true" /></div>
              <strong>من Kreuzberg<br />إلى عتبتك</strong>
              <div className={styles.routeLine}><span /><span /><span /><span /></div>
              <small>المطبخ مفتوح · آخر طلب 23:30</small>
            </div>
            <span className={styles.heroIndex}>B–01</span>
          </div>
        </section>

        <section id="offers" className={styles.offerStrip} aria-label="العرض الحالي">
          <span className={styles.offerNumber}>02</span>
          <div><p className={styles.offerLabel}>عرض الليلة</p><h2>نصف السعر على أول جولة</h2></div>
          <p className={styles.offerDetails}>استخدم الرمز <b>WELCOME50</b> عند التسجيل. صالح للطلبات الأولى حتى منتصف الليل.</p>
          <Link href="/auth/register" className={styles.offerAction}>احصل عليه <ArrowUpLeft size={19} aria-hidden="true" /></Link>
        </section>

        <section id="restaurants" className={styles.restaurantsSection} aria-labelledby="restaurants-title">
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>03 / مختارات التحرير</p><h2 id="restaurants-title">ما يُطلب<br /><em>الليلة.</em></h2></div><Link href="/menu" className={styles.textLink}>استكشف القائمة كاملة <ArrowLeft size={17} aria-hidden="true" /></Link></div>
          <div className={styles.restaurantLayout}>
            <Link href="/menu" className={`${styles.leadRestaurant} ${styles.reveal}`}>
              <div className={styles.leadImage}><Image src={IMAGES.bowl} alt="طبق صحي من Pure Bowl Berlin" fill loading="lazy" sizes="(max-width: 800px) 100vw, 48vw" className={styles.coverImage} /></div>
              <div className={styles.leadInfo}><div><span className={styles.tag}>الأكثر طلباً</span><h3>Pure Bowl Berlin</h3><p>نظيف وصحي · Mitte</p></div><div className={styles.restaurantMeta}><span><Star size={14} fill="currentColor" aria-hidden="true" /> 4.9</span><span><Clock3 size={14} aria-hidden="true" /> 15–20 دقيقة</span></div></div>
            </Link>
            <div className={styles.supportingPicks}>{restaurants.map((restaurant, index) => <Link href="/menu" key={restaurant.name} className={styles.pick}><span className={styles.pickNumber}>0{index + 1}</span><div className={styles.pickImage}><Image src={restaurant.image} alt={restaurant.name} fill loading="lazy" sizes="96px" className={styles.coverImage} /></div><div className={styles.pickCopy}><h3>{restaurant.name}</h3><p>{restaurant.cuisine}</p><span><Star size={13} fill="currentColor" aria-hidden="true" /> {restaurant.rating} · {restaurant.time}</span></div><ArrowUpLeft size={18} aria-hidden="true" /></Link>)}</div>
          </div>
        </section>

        <section id="map" className={styles.mapSection} aria-labelledby="map-title">
          <div className={styles.mapCopy}><p className={styles.eyebrow}>04 / نرسم الطريق</p><h2 id="map-title">كل برلين،<br /><em>أقرب مما تظن.</em></h2><p>نربطك بمطابخ الحي ونوصلها بدراجات كهربائية. تتبع مسار طلبك من أول شارع حتى بابك.</p><div className={styles.mapFacts}><span><b>22</b> دقيقة متوسط التوصيل</span><span><b>48</b> حي داخل النطاق</span></div><Link href="/menu" className={styles.darkButton}>تصفح مطاعم منطقتك <ArrowLeft size={17} aria-hidden="true" /></Link></div>
          <div className={styles.mapWrap}><APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}><Map center={MAP_CENTER} zoom={15} gestureHandling="greedy" disableDefaultUI mapId="909e5a3128684855b10ab66a6bc3fef5"><AdvancedMarker position={MAP_CENTER}><Pin background="#F27121" glyphColor="#F9F1E8" borderColor="#9F4200" /></AdvancedMarker></Map></APIProvider><div className={styles.mapLabel}><MapPin size={17} aria-hidden="true" /><span>نطاق التوصيل الآن<br /><b>متاح في Alexanderplatz</b></span></div></div>
        </section>

        <section className={styles.testimonialSection} aria-labelledby="testimonial-title"><div className={styles.quoteMark}>“</div><div><p className={styles.eyebrow}>05 / من أهل المدينة</p><h2 id="testimonial-title">“أخيراً، تطبيق يفهم<br />أن <em>الطريق</em> جزء من الوجبة.”</h2><div className={styles.person}><Image src={IMAGES.testimonial} alt="لوكا فيبر" width={52} height={52} loading="lazy" /><span><b>لوكا فيبر</b><small>عضو منذ 2023 · برلين</small></span><span className={styles.stars}>★★★★★</span></div></div></section>

        <section id="how-it-works" className={styles.stepsSection} aria-labelledby="steps-title"><div className={styles.sectionHead}><div><p className={styles.eyebrow}>06 / طقس بسيط</p><h2 id="steps-title">من الرغبة<br /><em>إلى الباب.</em></h2></div><p className={styles.sectionLead}>ثلاث خطوات تفصل بينك وبين وجبتك التالية.</p></div><div className={styles.steps}>{steps.map((step) => <div className={styles.step} key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div></section>

        <section className={styles.partnerSection} aria-labelledby="partner-title"><div><p className={styles.eyebrow}>07 / للمطابخ والركاب</p><h2 id="partner-title">لديك نكهة<br /><em>تستحق أن تُعرف؟</em></h2><p>انضم إلى شبكة برلين الغذائية. أدوات واضحة، جمهور جائع، وطريق أفضل للجميع.</p><Link href="/auth/register" className={styles.lightButton}>اكتشف الشراكة <ArrowLeft size={17} aria-hidden="true" /></Link></div><div className={styles.partnerImage}><Image src={IMAGES.delivery} alt="مندوب توصيل يحمل حقيبة طعام" fill loading="lazy" sizes="(max-width: 800px) 100vw, 40vw" className={styles.coverImage} /></div></section>
      </main>

      <footer className={styles.footer}><div className={styles.footerTop}><Link href="/" className={styles.brand}><span className={styles.brandMark}><UtensilsCrossed size={19} aria-hidden="true" /></span><span>برلين<span className={styles.orange}>فود</span></span></Link><p>صُنع في برلين، لياليك القادمة.</p><div className={styles.socials}><a href="tel:+49123456789" aria-label="اتصل ببرلين فود"><Phone size={18} /></a><a href="mailto:hello@berlinfood.com" aria-label="راسل برلين فود"><Mail size={18} /></a><a href="https://www.instagram.com/berlincheese17/" target="_blank" rel="noopener noreferrer" aria-label="برلين فود على إنستغرام"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg></a></div></div><div className={styles.footerBottom}><span>© 2024 Berlin Food Inc.</span><span>خصوصيتك · شروط الخدمة</span></div></footer>
    </div>
  );
}
