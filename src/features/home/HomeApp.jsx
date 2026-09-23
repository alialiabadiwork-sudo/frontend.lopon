import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { LuSearch } from 'react-icons/lu';
import { BiSupport } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';
import StickyHomeHeader from './StickyHomeHeader';
import { CarouselDealCard, CarouselDealCardSkeleton } from '@components/Items/DealCard';
import SupportDrawer from '@components/global/Drawers/SupportDrawer';
import WelcomeGiftModal from '@components/modals/WelcomeGiftModal';
import { useGetCarousel } from '@hooks/server/carousel/useGetCarousel';
import {
  CreditCard,
  Award,
  Store,
  Headphones,
} from "lucide-react";
import cx from 'clsx';
import LoponLogo from '@assets/images/lopon-logo.png';
import HeaderWebp from '@assets/images/header.webp';
import NewVendorWebp from '@assets/images/newVendor.webp';
import ReferralWebp from '@assets/images/refral.webp';


/* ================= IconButton ================= */
const IconButton = ({
  to,
  onClick,
  icon: Icon,
  label,
  className
}) => {
  const baseClass = cx(
    "w-[48px] h-[48px] border border-gray-200 rounded-[8px]",
    "flex items-center justify-center text-gray-700",
    "hover:bg-gray-50 transition-colors bg-white",
    className
  );

  if (to) {
    return (
      <Link to={to} className={baseClass} aria-label={label}>
        <Icon size={20} />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass} aria-label={label}>
      <Icon size={20} />
    </button>
  );
};


/* ================= Banner ================= */
const Banner = ({ src, alt, className, href, to }) => {
  const content = (
    <div className="relative -my-2 overflow-hidden rounded-xl">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover rounded-xl transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
      />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx("block px-4 my-6 mb-4 z-20 cursor-pointer", className)}
      >
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link
        to={to}
        className={cx("block px-4 my-6 mb-4 z-20 cursor-pointer", className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={cx("px-4 my-6 mb-4 z-20", className)}>
      {content}
    </div>
  );
};


/* ================= FeatureItem ================= */
const FeatureItem = ({ title, desc, Icon, className }) => (
  <div className={cx("px-3.5 flex items-center", className)}>
    <div className="grid grid-cols-[1fr_45px] items-center w-full">
      <div className="text-center">
        <h3 className="text-[10.5px] font-bold">{title}</h3>
        <p className="mt-1 text-[9.5px] text-gray-500">{desc}</p>
      </div>

      <div className="w-[45px] h-[45px] flex items-center justify-center rounded-full bg-orange-50">
        <Icon className="w-5 h-5 text-[#F47A20]" />
      </div>
    </div>
  </div>
);


/* ================= FeaturesGrid ================= */
const FeaturesGrid = ({ className }) => {
  const features = [
    {
      title: "پرداخت امن",
      desc: "با درگاه بانکی معتبر",
      Icon: CreditCard,
    },
    {
      title: "دارای نماد اعتماد",
      desc: "مطمئن و امن",
      Icon: Award,
    },
    {
      title: "مجموعه‌ معتبر",
      desc: "بررسی و تایید شده",
      Icon: Store,
    },
    {
      title: "پشتیبانی سریع",
      desc: "همیشه کنار شما",
      Icon: Headphones,
    },
  ];

  return (
    <div className={cx("flex justify-center pt-4 pb-5 z-20", className)}>
      <div className="relative w-[93%] h-[155px] rounded-2xl bg-[#FFFFFF] overflow-hidden shadow border border-gray-200">

        <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-[#FDF2F8]" />
        <div className="absolute left-1/2 top-5 h-[42px] w-px -translate-x-1/2 bg-[#FDF2F8]" />
        <div className="absolute left-1/2 bottom-5 h-[42px] w-px -translate-x-1/2 bg-[#FDF2F8]" />

        <div className="grid grid-cols-2 grid-rows-2 h-full">
          {features.map((item, i) => (
            <FeatureItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};


/* ================= SectionCarousel ================= */
function SectionCarousel({
  title,
  deals,
  id,
  className,
  isLoading
}) {
  if (isLoading) {
    return (
      <section id={id} className={cx("bg-white overflow-hidden text-right py-4 pt-2", className)}>
        <div className="px-4">
          <div className="flex flex-col mb-3">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="w-12 h-1 bg-[#F47A20]/30 rounded-full mt-1" />
          </div>
          <div className="relative -mx-4">
            <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar">
              {[1, 2, 3].map((n) => (
                <CarouselDealCardSkeleton key={n} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const safeDeals = Array.isArray(deals) ? deals : [];
  if (!safeDeals.length) return null;

  return (
    <section
      id={id}
      className={cx(
        "bg-white overflow-hidden text-right py-4 pt-2",
        className
      )}
    >
      <div className="px-4">
        <div className="flex flex-col mb-3">
          <h2 className="text-base font-bold text-gray-900 font-kal-3">
            {title}
          </h2>
          <div className="w-12 h-1 bg-[#F47A20] rounded-full mt-1" />
        </div>

        <div className="relative -mx-4">
          <div className="flex overflow-x-auto gap-3 px-4 pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth">
            {safeDeals.map((deal) => (
              <CarouselDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================= HomeApp ================= */
function HomeApp() {
  const location = useLocation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isHeaderImageLoaded, setIsHeaderImageLoaded] = useState(false);
  const [welcomeGiftModal, setWelcomeGiftModal] = useState({
    isOpen: false,
    code: 'lopon',
  });

  const heroRef = useRef(null);
  const [isStickyHeaderVisible, setIsStickyHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        // Show sticky header once the hero banner bottom passes top of screen
        if (rect.bottom <= 60) {
          setIsStickyHeaderVisible(true);
        } else {
          setIsStickyHeaderVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    const scrollContainer = heroRef.current?.closest('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    // Check if user came from a successful referral registration
    const shouldShowState = location.state?.showWelcomeGiftModal;
    const shouldShowSession = sessionStorage.getItem('lopon_show_welcome_gift') === 'true';

    if (shouldShowState || shouldShowSession) {
      const code = location.state?.discountCode || sessionStorage.getItem('lopon_welcome_gift_code') || 'lopon';
      setWelcomeGiftModal({ isOpen: true, code });

      // Clean up sessionStorage flags
      sessionStorage.removeItem('lopon_show_welcome_gift');
      sessionStorage.removeItem('lopon_welcome_gift_code');

      // Clean up location state without triggering a re-render/reload
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, location.pathname);
      }
    }
  }, [location]);

  const carousel1 = useGetCarousel(1);
  const carousel2 = useGetCarousel(2);
  const carousel3 = useGetCarousel(3);
  const carousel4 = useGetCarousel(4);

  return (
    <div className="flex flex-col min-h-screen w-full max-w-md md:max-w-xl mx-auto shadow-xl relative bg-white">
      {/* Animated Sticky Top Header with Search Pill & Brand on Scroll */}
      <AnimatePresence>
        {isStickyHeaderVisible && (
          <StickyHomeHeader onOpenSupport={() => setIsSupportOpen(true)} />
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-4 md:px-6 pt-1">

        <Link to="/" className="flex items-center">
          <img src={LoponLogo} alt="logo" className="h-[52px] w-[52px] md:h-[64px] md:w-[64px] object-contain drop-shadow-md transition-transform active:scale-95" />
        </Link>

        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => setIsSupportOpen(true)}
            icon={BiSupport}
            label="پشتیبانی"
          />
          <IconButton
            to="/search"
            icon={LuSearch}
            label="جستجو"
          />
        </div>
      </div>

      <div
        ref={heroRef}
        className={`relative w-full mb-4 h-[calc(100dvh-150px)] -mt-14 transition-all duration-300 ${!isHeaderImageLoaded ? 'bg-slate-100/80 animate-pulse' : 'bg-gray-100'}`}
      >
        <img
          src={HeaderWebp}
          onLoad={() => setIsHeaderImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isHeaderImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          alt="Lopon Header"
        />
        {isHeaderImageLoaded && (
          <div className="absolute -bottom-2 left-0 w-full h-12 bg-gradient-to-t from-[#F47A20]/35 via-black/5 to-transparent blur-sm transition-opacity duration-300" />
        )}
      </div>

      <SectionCarousel
        title={carousel1.title}
        deals={carousel1.deals}
        isLoading={carousel1.isLoading}
        id="1"
        className="pt-5 pb-3"
      />

      <div className="w-32 h-32 rounded-full bg-[#F47A20]/20 blur-2xl mt-[-7.5rem] z-10"></div>

      <FeaturesGrid />

      <SectionCarousel
        title={carousel2.title}
        deals={carousel2.deals}
        isLoading={carousel2.isLoading}
        id="2"
        className="mt-[5px]"
      />

      <SectionCarousel
        title={carousel3.title}
        deals={carousel3.deals}
        isLoading={carousel3.isLoading}
        id="3"
        className="mt-[5px]"
      />

      <Banner
        src={NewVendorWebp}
        alt="ثبت نام سالن‌ها و کسب‌وکارها"
        href="https://script.google.com/macros/s/AKfycbwZihRZJP7LiZ3K-nwL7OntyZddaXUzmxNzjp4f1ooCPo-unWf6YE7W6DyXSubKlLZpQQ/exec"
      />

      <div className="w-32 h-32 rounded-full bg-[#F47A20]/30 blur-2xl mt-[-7.5rem] ms-auto z-10"></div>

      <SectionCarousel
        title={carousel4.title}
        deals={carousel4.deals}
        isLoading={carousel4.isLoading}
        id="4"
        className="pt-6"
      />

      <Banner
        to="/referral"
        src={ReferralWebp}
        alt="دوستاتو دعوت کن و جایزه بگیر !"
        className={"pt-4"}
      />

      {/* Welcome / Congratulations Gift Modal with Confetti */}
      <WelcomeGiftModal
        isOpen={welcomeGiftModal.isOpen}
        onClose={() => setWelcomeGiftModal({ isOpen: false, code: 'lopon' })}
        discountCode={welcomeGiftModal.code}
        discountAmount="۱۵۰ هزار تومان"
      />

      {/* Support */}
      <SupportDrawer
        isOpen={isSupportOpen}
        setIsOpen={setIsSupportOpen}
      />
    </div>
  );
};

export default HomeApp;
