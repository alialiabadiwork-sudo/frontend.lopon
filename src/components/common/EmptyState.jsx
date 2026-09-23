import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, ShieldCheck, Tag, Clock, ArrowRight } from 'lucide-react';

// Custom high-craft SVG Illustration for Empty Cart
const EmptyCartIllustration = () => (
  <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
    {/* Soft glowing ambient circles */}
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 via-amber-50 to-orange-200/50 rounded-full blur-2xl opacity-70 animate-pulse" />
    <div className="absolute w-36 h-36 bg-orange-50 rounded-full border border-orange-100/80 shadow-inner flex items-center justify-center" />

    {/* SVG Vector Elements */}
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-36 h-36">
      {/* Decorative background grid / particles */}
      <circle cx="28" cy="36" r="4" fill="#F47A20" fillOpacity="0.25" />
      <circle cx="135" cy="48" r="6" fill="#FFB800" fillOpacity="0.35" />
      <circle cx="22" cy="118" r="5" fill="#F47A20" fillOpacity="0.15" />
      <circle cx="130" cy="122" r="3" fill="#F47A20" fillOpacity="0.3" />

      {/* Floating Sparkle 1 */}
      <path d="M128 30L130 36L136 38L130 40L128 46L126 40L120 38L126 36L128 30Z" fill="#F47A20" />

      {/* Floating Sparkle 2 */}
      <path d="M34 92L35.5 96.5L40 98L35.5 99.5L34 104L32.5 99.5L28 98L32.5 96.5L34 92Z" fill="#FFB800" />

      {/* Modern Shopping Bag */}
      <g filter="url(#shadow-bag)">
        {/* Bag Body */}
        <rect x="42" y="58" width="76" height="70" rx="20" fill="url(#bag-grad)" />

        {/* Bag Top Fold Line */}
        <path d="M42 74C42 65.1634 49.1634 58 58 58H102C110.837 58 118 65.1634 118 74V76H42V74Z" fill="#FFF0F3" opacity="0.6" />

        {/* Bag Handles */}
        <path d="M60 62V46C60 37.1634 67.1634 30 76 30H84C92.8366 30 100 37.1634 100 46V62" stroke="#F47A20" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M66 62V46C66 40.4772 70.4772 36 76 36H84C89.5228 36 94 40.4772 94 46V62" stroke="#FFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />

        {/* Front Pocket / Coupon Tag on Bag */}
        <rect x="58" y="80" width="44" height="32" rx="10" fill="#FFFFFF" fillOpacity="0.95" />
        <path d="M68 91H92" stroke="#F47A20" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M68 101H84" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

        {/* Heart/Tag badge on bag */}
        <circle cx="100" cy="96" r="12" fill="#F47A20" />
        <path d="M96 96C96 93.8 98 92 100 94C102 92 104 93.8 104 96C104 98.5 100 101 100 101C100 101 96 98.5 96 96Z" fill="#FFFFFF" />
      </g>

      <defs>
        <linearGradient id="bag-grad" x1="42" y1="58" x2="118" y2="128" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF" />
          <stop offset="0.5" stopColor="#FFF0F3" />
          <stop offset="1" stopColor="#FFE4E9" />
        </linearGradient>
        <filter id="shadow-bag" x="30" y="24" width="100" height="112" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#F47A20" floodOpacity="0.12" />
        </filter>
      </defs>
    </svg>
  </div>
);

// Custom high-craft SVG Illustration for Empty Orders
const EmptyOrdersIllustration = () => (
  <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
    {/* Soft glowing ambient background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 via-sky-50 to-pink-100 rounded-full blur-2xl opacity-70 animate-pulse" />
    <div className="absolute w-32 h-32 bg-slate-50/80 rounded-full border border-slate-200/60 shadow-inner flex items-center justify-center" />

    {/* SVG Vector Elements */}
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-32 h-32">
      <circle cx="30" cy="30" r="5" fill="#3B82F6" fillOpacity="0.2" />
      <circle cx="138" cy="42" r="5" fill="#F47A20" fillOpacity="0.25" />
      <circle cx="24" cy="120" r="4" fill="#FFB800" fillOpacity="0.3" />

      {/* Floating Sparkle */}
      <path d="M125 115L127 121L133 123L127 125L125 131L123 125L117 123L123 121L125 115Z" fill="#3B82F6" />

      <g filter="url(#shadow-receipt)">
        {/* Main Receipt Voucher Card */}
        <rect x="42" y="32" width="76" height="100" rx="14" fill="url(#receipt-grad)" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Receipt Header Banner */}
        <path d="M42 46C42 38.268 48.268 32 56 32H104C111.732 32 118 38.268 118 46V54H42V46Z" fill="#F47A20" />
        <circle cx="80" cy="43" r="5" fill="#FFFFFF" fillOpacity="0.9" />

        {/* Receipt Dashed Line Cutout */}
        <line x1="46" y1="74" x2="114" y2="74" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" />

        {/* Placeholder Voucher Text Skeleton Lines */}
        <rect x="54" y="62" width="52" height="5" rx="2.5" fill="#94A3B8" opacity="0.3" />
        <rect x="54" y="84" width="36" height="5" rx="2.5" fill="#94A3B8" opacity="0.35" />
        <rect x="54" y="95" width="44" height="5" rx="2.5" fill="#94A3B8" opacity="0.25" />
        <rect x="54" y="106" width="28" height="5" rx="2.5" fill="#F47A20" opacity="0.4" />

        {/* Success Verified Seal / Badge */}
        <circle cx="102" cy="100" r="14" fill="#F47A20" />
        <path d="M96 100L100 104L108 96" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <defs>
        <linearGradient id="receipt-grad" x1="42" y1="32" x2="118" y2="132" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#F8FAFC" />
        </linearGradient>
        <filter id="shadow-receipt" x="32" y="24" width="96" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="8" stdDeviation="5" floodColor="#0F172A" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  </div>
);

export default function EmptyState({
  type = 'cart',
  badgeText,
  title,
  description,
  actionLabel,
  onAction,
}) {
  const isCart = type === 'cart';

  const defaultBadge = isCart ? 'کد تخفیف زیبایی لوپُن' : 'تاریخچه سفارشات شما';
  const defaultTitle = isCart ? 'سبد خرید شما خالی است' : 'هنوز سفارشی ثبت نشده است';
  const defaultDesc = isCart
    ? 'هنوز تخفیفی به سبد خرید خود اضافه نکرده‌اید! پرطرفدارترین خدمات زیبایی و مراقبتی شهر کرمان را بررسی و با تخفیف رزرو کنید.'
    : 'پس از خرید هر کد تخفیف یا رزرو خدمات زیبایی، کوپن اختصاصی و جزئیات سفارش شما در این بخش قابل مشاهده خواهد بود.';
  const defaultAction = isCart ? 'مشاهده پیشنهادهای تخفیف‌دار' : 'جستجوی خدمات زیبایی';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center px-4 pt-1 pb-6 mt-1 mb-auto w-full max-w-sm mx-auto select-none"
    >
      {/* SVG Illustration */}
      {isCart ? <EmptyCartIllustration /> : <EmptyOrdersIllustration />}

      {/* Title */}
      <h2 className="text-base md:text-lg font-extrabold text-slate-800 font-kal-3 mt-2 mb-1.5 tracking-tight">
        {title || defaultTitle}
      </h2>

      {/* Description */}
      <p className="text-xs md:text-sm text-slate-500 font-kal-2 leading-relaxed max-w-xs mb-4">
        {description || defaultDesc}
      </p>

      {/* Feature Value Props / Guarantees list */}
      <div className="grid grid-cols-2 gap-2 w-full mb-4 text-right">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100">
          <div className="w-5 h-5 rounded-lg bg-orange-100/70 text-[#F47A20] flex items-center justify-center shrink-0">
            <Tag size={12} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 font-kal-3">تخفیف ویژه تا ۷۰٪</span>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/90 border border-slate-100">
          <div className="w-5 h-5 rounded-lg bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={12} />
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 font-kal-3">تضمین کیفیت خدمات</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onAction}
        className="w-full flex items-center justify-center gap-2.5 bg-[#F47A20] hover:bg-[#d66311] text-white py-3.5 px-6 rounded-2xl font-bold font-kal-3 text-sm sm:text-base shadow-[0_8px_20px_rgba(244,122,32,0.28)] transition-all cursor-pointer"
      >
        <span>{actionLabel || defaultAction}</span>
        <ArrowLeft size={18} className="shrink-0" />
      </motion.button>
    </motion.div>
  );
}
