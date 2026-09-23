import React from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  Send,
  MapPin,
  ChevronLeft,
  Heart,
  Rocket,
  Flag,
  ShieldCheck,
  Headphones,
  Percent,
  Sparkles,
  Scissors
} from 'lucide-react';
import LoponLogo from '@assets/images/lopon-logo.png';
import RubikaImg from '@assets/images/rubika.png';

function AboutUs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full max-w-md md:max-w-xl mx-auto px-4 pt-4 pb-24 flex flex-col gap-6 select-none"
      dir="rtl"
    >
      {/* Hero / Brand Card */}
      <div className="bg-gradient-to-br from-[#fde8d8]/60 via-white to-orange-50/50 border border-orange-100/90 rounded-2xl p-5 sm:p-6 text-center shadow-2xs relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        <img
          src={LoponLogo}
          alt="لوپُن"
          className="w-16 h-16 object-contain mx-auto mb-3.5 drop-shadow-xs relative z-10"
        />
        <h1 className="text-base sm:text-lg font-bold font-kal-3 text-slate-800 leading-snug mb-2.5 relative z-10">
          لوپُن؛ راهی ساده برای پیدا کردن بهترین‌های کرمان
        </h1>
        <p className="text-xs sm:text-sm font-kal-2 text-slate-600 leading-relaxed mb-2 relative z-10">
          لوپُن پلتفرمی برای پیدا کردن و خرید خدمات و تجربه‌های خوب در کرمانه.
        </p>
        <p className="text-xs sm:text-sm font-kal-2 text-slate-600 leading-relaxed relative z-10">
          ما کارمون رو با مجموعه‌های زیبایی شروع کردیم تا پیدا کردن خدمات خوب، مقایسه مجموعه‌ها و خرید با قیمت مناسب رو برای شما ساده‌تر کنیم.
        </p>
      </div>

      {/* Section: داستان لوپُن */}
      <div>
        <div className="text-center my-4">
          <h2 className="text-base sm:text-lg font-bold font-kal-3 text-slate-800">
            داستان لوپُن
          </h2>
          <div className="w-8 h-1 bg-[#F47A20] rounded-full mx-auto mt-1.5" />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-3 text-right font-kal-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            ما لوپُن رو با یک ایده ساده شروع کردیم؛ اینکه پیدا کردن یک مجموعه خوب در کرمان نباید سخت باشه.
          </p>
          <p>
            می‌خواستیم جایی داشته باشیم که بتونید مجموعه‌های مختلف رو راحت‌تر پیدا کنید، خدماتشون رو ببینید، مقایسه کنید و با خیال راحت انتخاب کنید.
          </p>
          <p>
            لوپُن از کرمان شروع شده و هدفمون اینه که بهترین مجموعه‌ها و خدمات شهر رو در یک تجربه ساده و قابل اعتماد در اختیارتون قرار بدیم.
          </p>
        </div>

        {/* 3 Pillars / Objective Pills */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
          {/* Item 1: هدف ما */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-start shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#fde8d8] text-[#F47A20] flex items-center justify-center mb-2 shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800 mb-1">
              هدف ما
            </h3>
            <p className="font-kal-2 text-[10px] sm:text-xs text-slate-500 leading-snug">
              تجربه‌ای ساده و قابل اعتماد برای خدمات خوب در کرمان
            </p>
          </div>

          {/* Item 2: رشد و توسعه */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-start shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#fde8d8] text-[#F47A20] flex items-center justify-center mb-2 shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800 mb-1">
              رشد و توسعه
            </h3>
            <p className="font-kal-2 text-[10px] sm:text-xs text-slate-500 leading-snug">
              با تمرکز روی کیفیت و رضایت شما
            </p>
          </div>

          {/* Item 3: آغاز مسیر */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-start shadow-2xs">
            <div className="w-9 h-9 rounded-full bg-[#fde8d8] text-[#F47A20] flex items-center justify-center mb-2 shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800 mb-1">
              آغاز مسیر
            </h3>
            <p className="font-kal-2 text-[10px] sm:text-xs text-slate-500 leading-snug">
              شروع ما از کرمان با مجموعه‌های زیبایی
            </p>
          </div>
        </div>
      </div>

      {/* Section: چرا لوپُن؟ */}
      <div>
        <div className="text-center my-4">
          <h2 className="text-base sm:text-lg font-bold font-kal-3 text-slate-800">
            چرا لوپُن؟
          </h2>
          <div className="w-8 h-1 bg-[#F47A20] rounded-full mx-auto mt-1.5" />
        </div>

        <div className="space-y-2.5">
          {/* Item 1 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-start gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#fde8d8] text-[#F47A20] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                خرید با خیال راحت
              </h3>
              <p className="font-kal-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                اطلاعات خدمات و مجموعه‌ها رو قبل از خرید ببینید و با اطمینان بیشتری انتخاب کنید.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-start gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#fde8d8] text-[#F47A20] flex items-center justify-center shrink-0 mt-0.5">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                پشتیبانی در کنار شما
              </h3>
              <p className="font-kal-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                اگر در روند خرید یا استفاده از خدمات سوالی داشتید، تیم پشتیبانی لوپُن در کنارتونه.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-start gap-3 text-right">
            <div className="w-10 h-10 rounded-xl bg-[#fde8d8] text-[#F47A20] flex items-center justify-center shrink-0 mt-0.5">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                پیشنهادهای ویژه
              </h3>
              <p className="font-kal-2 text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">
                خدمات و مجموعه‌های منتخب رو با قیمت‌ها و تخفیف‌های ویژه پیدا کنید.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section: راه‌های ارتباطی ما */}
      <div>
        <div className="text-center my-4">
          <h2 className="text-base sm:text-lg font-bold font-kal-3 text-slate-800">
            راه‌های ارتباطی ما
          </h2>
          <div className="w-8 h-1 bg-[#F47A20] rounded-full mx-auto mt-1.5" />
        </div>

        <div className="space-y-2.5">
          {/* Phone */}
          <a
            href="tel:09967911083"
            className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fde8d8] text-[#F47A20] flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                  تماس تلفنی
                </h3>
                <p className="font-kal-2 text-xs text-slate-500 dir-ltr text-right mt-0.5">
                  09967911083
                </p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </a>

          {/* Rubika */}
          <a
            href="https://rubika.ir/lopon11"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#fde8d8] flex items-center justify-center shrink-0 overflow-hidden p-2">
                <img src={RubikaImg} alt="روبیکا" className="w-full h-full object-contain" />
              </div>
              <div className="text-right">
                <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                  کانال روبیکا
                </h3>
                <p className="font-kal-2 text-xs text-slate-500 dir-ltr text-right mt-0.5">
                  lopon11@
                </p>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Section: ما را پیدا کنید */}
      <div>
        <div className="text-center my-4">
          <h2 className="text-base sm:text-lg font-bold font-kal-3 text-slate-800">
            ما را پیدا کنید
          </h2>
          <div className="w-8 h-1 bg-[#F47A20] rounded-full mx-auto mt-1.5" />
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs text-right space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#fde8d8] text-[#F47A20] flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-kal-3 text-xs sm:text-sm text-slate-800">
                کرمان، فرهنگسرای کوثر
              </h3>
              <p className="font-kal-2 text-xs text-slate-500 mt-1 leading-relaxed">
                لوپُن در فرهنگسرای کوثر کرمان فعالیت می‌کند و از همین‌جا در حال ساخت تجربه‌ای بهتر برای خدمات شما هستیم.
              </p>
            </div>
          </div>

          {/* Map Graphic Preview */}
          <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            {/* Styled Map Background Lines */}
            <svg className="absolute inset-0 w-full h-full text-slate-200" xmlns="http://www.w3.org/2000/svg">
              <path d="M-10 40 Q 100 80 200 30 T 400 90" fill="none" stroke="#cbd5e1" strokeWidth="12" />
              <path d="M120 -10 L 120 200" fill="none" stroke="#e2e8f0" strokeWidth="16" />
              <path d="M220 -10 L 220 200" fill="none" stroke="#e2e8f0" strokeWidth="10" />
              <path d="M-10 120 L 400 120" fill="none" stroke="#e2e8f0" strokeWidth="14" />
            </svg>

            {/* Map Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white px-2.5 py-1 rounded-md shadow-md border border-orange-100 text-[10px] font-bold font-kal-3 text-slate-800 mb-1">
                فرهنگسرای کوثر کرمان
              </div>
              <div className="w-8 h-8 rounded-full bg-[#F47A20] text-white flex items-center justify-center shadow-lg animate-bounce">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Card */}
      <div className="bg-[#fff8f2] border border-orange-100 rounded-2xl p-5 text-center shadow-2xs my-2">
        <div className="w-10 h-10 rounded-full bg-white text-[#F47A20] flex items-center justify-center mx-auto mb-3 shadow-2xs border border-orange-100">
          <Heart className="w-5 h-5 fill-current" />
        </div>

        <h3 className="font-bold font-kal-3 text-slate-800 text-sm sm:text-base mb-2">
          لوپُن؛ راهی ساده برای پیدا کردن بهترین‌های کرمان
        </h3>

        <p className="font-kal-2 text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-4">
          ما اینجا هستیم تا تجربه‌ای بهتر، ساده‌تر و مطمئن‌تر از پیدا کردن خدمات خوب در کرمان را برای شما بسازیم.
        </p>

        <img
          src={LoponLogo}
          alt="لوپُن"
          className="w-10 h-10 object-contain mx-auto mb-2"
        />

        <p className="font-kal-2 text-[10px] sm:text-xs text-slate-400">
          حق نشر © 1405 لوپُن. تمامی حقوق محفوظ است.
        </p>
      </div>
    </motion.div>
  );
}

export default AboutUs;

