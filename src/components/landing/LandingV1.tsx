"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
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
  bowl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&h=700&fit=crop", // البيتزا الأساسية
  burger:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&h=700&fit=crop", // الشيز والبرغر
  sushi:
    "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=700&h=700&fit=crop", // التاكوس
  pizza:
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&h=700&fit=crop", // المشروبات والوجبات
  delivery:
    "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&h=700&fit=crop",
  testimonial:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&h=240&fit=crop",
};

// تم تعديل المكونات لتعبر عن أقسام المنيو الخاصة بمحل Berlin Food بدلاً من مطاعم مختلفة
const menuCategories = [
  {
    name: "تاكوس برلين",
    cuisine: "أطباق تاكوس غنية بصلصة الشيدر",
    time: "20–25 دقيقة",
    rating: "4.9",
    image: IMAGES.sushi,
  },
  {
    name: "شيز وبرغر",
    cuisine: "شيز برغر مشوي ولذيذ",
    time: "15–20 دقيقة",
    rating: "4.8",
    image: IMAGES.burger,
  },
  {
    name: "مشروبات غازية",
    cuisine: "باردة وتكمل وجبتك",
    time: "توصيل سريع",
    rating: "5.0",
    image: IMAGES.pizza,
  },
];

// خطوات الطلب مركزة على عدم الحاجة للتنقل والسهولة
const steps = [
  {
    number: "01",
    title: "اختر وجبتك المفضلة",
    text: "تصفح قائمة التاكوس، البيتزا والشيز بضغطة زر.",
  },
  {
    number: "02",
    title: "حدد موقعك الحالي",
    text: "بدون الحاجة للتنقل، نحدد مكانك بدقة لتصلك الوجبة ساخنة.",
  },
  {
    number: "03",
    title: "استلم واستمتع",
    text: "فريق التوصيل في طريقه إليك، اترك الباقي علينا.",
  },
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
      <a className={styles.skipLink} href="#main-content">
        تخطى إلى المحتوى الرئيسي
      </a>
      <header className={styles.header}>
        <nav className={styles.nav} aria-label="التنقل الرئيسي">
          <Link
            href="/"
            className={styles.brand}
            aria-label="برلين فود، الصفحة الرئيسية">
            <span className={styles.brandMark}>
              <UtensilsCrossed size={19} aria-hidden="true" />
            </span>
            <span>
              برلين<span className={styles.orange}>فود</span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="#restaurants">قائمة الطعام</Link>
            <Link href="#map">تغطية التوصيل</Link>
            <Link href="#how-it-works">كيف تطلب</Link>
          </div>
          <div className={styles.navActions}>
            <Link href="/auth/login" className={styles.login}>
              تسجيل الدخول
            </Link>
            <Link href="/auth/register" className={styles.navCta}>
              اطلب الآن <ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </div>
          <Link
            href="/menu"
            className={styles.menuButton}
            aria-label="فتح قائمة الطعام">
            <Menu size={21} />
          </Link>
        </nav>
      </header>

      <main id="main-content">
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <span className={styles.liveDot} /> مطعم برلين فود / مفتوح الآن
            </div>
            <p className={styles.eyebrow}>الأكل السريع كما تحبه</p>
            <h1 id="hero-title">
              أشهى الوجبات
              <br />
              <em>تصلك لباب بيتك.</em>
            </h1>
            <p className={styles.heroIntro}>
              متخصصون في التاكوس، البيتزا، الشيز والمشروبات الغازية. لا داعي
              للتنقل أو الانتظار، منصتنا تجلب لك وجبتك الساخنة بسهولة وسرعة.
            </p>
            <form className={styles.addressForm} action="/menu">
              <label htmlFor="hero-address" className={styles.srOnly}>
                عنوان التوصيل
              </label>
              <MapPin size={20} aria-hidden="true" />
              <input
                id="hero-address"
                name="address"
                type="text"
                placeholder="أدخل عنوانك ليصلك الطلب"
                autoComplete="street-address"
              />
              <button type="submit">
                اطلب وجبتك <ArrowLeft size={17} aria-hidden="true" />
              </button>
            </form>
            <div className={styles.heroNote}>
              <span>بدون الحاجة للتنقل</span>
              <span>•</span>
              <span>توصيل سريع</span>
              <span>•</span>
              <span>وجبات ساخنة وطازجة</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.imageFrame}>
              <Image
                src={IMAGES.hero}
                alt="وجبات برلين فود من تاكوس وبيتزا وشيز"
                fill
                preload
                sizes="(max-width: 800px) 100vw, 52vw"
                className={styles.coverImage}
              />
              <div className={styles.imageCaption}>
                <span>01 / 04</span>
                <span>الأكثر مبيعاً</span>
              </div>
            </div>
            <div className={styles.routeBoard}>
              <div className={styles.routeTop}>
                <span>BERLIN FOOD / DELIVERY</span>
                <Navigation size={17} aria-hidden="true" />
              </div>
              <strong>
                من مطبخنا
                <br />
                إلى عتبتك مباشرة
              </strong>
              <div className={styles.routeLine}>
                <span />
                <span />
                <span />
                <span />
              </div>
              <small>خدمة التوصيل متاح الآن · اطلب الآن</small>
            </div>
            <span className={styles.heroIndex}>B–01</span>
          </div>
        </section>

        <section
          id="offers"
          className={styles.offerStrip}
          aria-label="العرض الحالي">
          <span className={styles.offerNumber}>02</span>
          <div>
            <p className={styles.offerLabel}>عرض خاص</p>
            <h2>خصم على طلبك الأول عبر المنصة</h2>
          </div>
          <p className={styles.offerDetails}>
            استخدم الرمز <b>WELCOME50</b> عند الطلب عبر المنصة واستمتع بتوصيل
            سريع وبدون عناء.
          </p>
          <Link href="/auth/register" className={styles.offerAction}>
            احصل عليه <ArrowUpLeft size={19} aria-hidden="true" />
          </Link>
        </section>

        <section
          id="restaurants"
          className={styles.restaurantsSection}
          aria-labelledby="restaurants-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>03 / قائمة الطعام</p>
              <h2 id="restaurants-title">
                أشهر تشكيلات
                <br />
                <em>برلين فود.</em>
              </h2>
            </div>
            <Link href="/menu" className={styles.textLink}>
              استكشف المنيو الكامل <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.restaurantLayout}>
            <Link
              href="/menu"
              className={`${styles.leadRestaurant} ${styles.reveal}`}>
              <div className={styles.leadImage}>
                <Image
                  src={IMAGES.bowl}
                  alt="بيتزا برلين فود المميزة"
                  fill
                  loading="lazy"
                  sizes="(max-width: 800px) 100vw, 48vw"
                  className={styles.coverImage}
                />
              </div>
              <div className={styles.leadInfo}>
                <div>
                  <span className={styles.tag}>الأنشط مبيعاً</span>
                  <h3>بيتزا برلين المشكلة</h3>
                  <p>جبنة ذائبة · مكونات طازجة · خبز محلي</p>
                </div>
                <div className={styles.restaurantMeta}>
                  <span>
                    <Star size={14} fill="currentColor" aria-hidden="true" />{" "}
                    4.9
                  </span>
                  <span>
                    <Clock3 size={14} aria-hidden="true" /> 20–25 دقيقة
                  </span>
                </div>
              </div>
            </Link>
            <div className={styles.supportingPicks}>
              {menuCategories.map((item, index) => (
                <Link href="/menu" key={item.name} className={styles.pick}>
                  <span className={styles.pickNumber}>0{index + 1}</span>
                  <div className={styles.pickImage}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      loading="lazy"
                      sizes="96px"
                      className={styles.coverImage}
                    />
                  </div>
                  <div className={styles.pickCopy}>
                    <h3>{item.name}</h3>
                    <p>{item.cuisine}</p>
                    <span>
                      <Star size={13} fill="currentColor" aria-hidden="true" />{" "}
                      {item.rating} · {item.time}
                    </span>
                  </div>
                  <ArrowUpLeft size={18} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="map"
          className={styles.mapSection}
          aria-labelledby="map-title">
          <div className={styles.mapCopy}>
            <p className={styles.eyebrow}>04 / نطاق التوصيل</p>
            <h2 id="map-title">
              لا داعي للتنقل،
              <br />
              <em>نحن نصل إليك.</em>
            </h2>
            <p>
              نوفر منصة سهلة ومباشرة لطلب وجباتك السريعة المفضل من Berlin Food
              ليتم إيصالها سريعة وساخنة حتى باب منزلك.
            </p>
            <div className={styles.mapFacts}>
              <span>
                <b>20</b> دقيقة متوسط التوصيل
              </span>
              <span>
                <b>تغطية</b> شاملة للمدينة
              </span>
            </div>
            <Link href="/menu" className={styles.darkButton}>
              اطلب من موقعك الآن <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.mapWrap}>
            <APIProvider
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
              <Map
                center={MAP_CENTER}
                zoom={15}
                gestureHandling="greedy"
                disableDefaultUI
                mapId="909e5a3128684855b10ab66a6bc3fef5">
                <AdvancedMarker position={MAP_CENTER}>
                  <Pin
                    background="#F27121"
                    glyphColor="#F9F1E8"
                    borderColor="#9F4200"
                  />
                </AdvancedMarker>
              </Map>
            </APIProvider>
            <div className={styles.mapLabel}>
              <MapPin size={17} aria-hidden="true" />
              <span>
                موقع مطعم برلين فود
                <br />
                <b>التوصيل متاح لموقعك الآن</b>
              </span>
            </div>
          </div>
        </section>

        <section
          className={styles.testimonialSection}
          aria-labelledby="testimonial-title">
          <div className={styles.quoteMark}>“</div>
          <div>
            <p className={styles.eyebrow}>05 / آراء زبائننا</p>
            <h2 id="testimonial-title">
              “أفضل تاكوس وبيتزا،
              <br />و <em>التوصيل</em> سريع وبدون عناء.”
            </h2>
            <div className={styles.person}>
              <Image
                src={IMAGES.testimonial}
                alt="زبون برلين فود"
                width={52}
                height={52}
                loading="lazy"
              />
              <span>
                <b>زبون وفيل</b>
                <small>تقييم عبر المنصة</small>
              </span>
              <span className={styles.stars}>★★★★★</span>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className={styles.stepsSection}
          aria-labelledby="steps-title">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>06 / سهولة الطلب</p>
              <h2 id="steps-title">
                من المطبخ
                <br />
                <em>إلى بابك.</em>
              </h2>
            </div>
            <p className={styles.sectionLead}>
              ثلاث خطوات بسيطة تفصلك عن وجبتك المفضلة دون أن تغادر مكانك.
            </p>
          </div>
          <div className={styles.steps}>
            {steps.map((step) => (
              <div className={styles.step} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={styles.partnerSection}
          aria-labelledby="partner-title">
          <div>
            <p className={styles.eyebrow}>07 / اطلب الآن</p>
            <h2 id="partner-title">
              تشتهي تاكوس أو شيز؟
              <br />
              <em>جرب طعم برلين فود الأصلي</em>
            </h2>
            <p>
              كل ما تحبه من أطعمة سريعة ومشروبات غازية متاح عبر منصتنا السريعة
              والسهلة.
            </p>
            <Link href="/menu" className={styles.lightButton}>
              تصفح المنيو واطلب <ArrowLeft size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className={styles.partnerImage}>
            <Image
              src={IMAGES.delivery}
              alt="خدمة توصيل طلبات برلين فود"
              fill
              loading="lazy"
              sizes="(max-width: 800px) 100vw, 40vw"
              className={styles.coverImage}
            />
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>
              <UtensilsCrossed size={19} aria-hidden="true" />
            </span>
            <span>
              برلين<span className={styles.orange}>فود</span>
            </span>
          </Link>
          <p>
            محل Berlin Food للأطعمة السريعة - التاكوس، البيتزا، الشيز
            والمشروبات.
          </p>
          <div className={styles.socials}>
            <a href="tel:+49123456789" aria-label="اتصل ببرلين فود">
              <Phone size={18} />
            </a>
            <a href="mailto:hello@berlinfood.com" aria-label="راسل برلين فود">
              <Mail size={18} />
            </a>
            <a
              href="https://www.instagram.com/berlincheese17/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="برلين فود على إنستغرام">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 Berlin Food. جميع الحقوق محفوظة.</span>
          <span>خصوصيتك · شروط الخدمة</span>
        </div>
      </footer>
    </div>
  );
}
