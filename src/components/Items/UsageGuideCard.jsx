import React from 'react';

// Handcrafted rich SVG illustrations matching the reference aesthetics
const Step1Illustration = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8.5 h-8.5 sm:w-9 sm:h-9"
  >
    {/* Sparkle rays */}
    <path d="M44 14L46 12" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 18L51 18" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 22L47 24" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />

    {/* Shopping Bag Outline */}
    <rect
      x="12"
      y="17"
      width="28"
      height="30"
      rx="6"
      fill="#FFF7ED"
      stroke="#F47A20"
      strokeWidth="2.2"
    />
    {/* Bag Handle */}
    <path
      d="M20 18V13C20 9.68629 22.6863 7 26 7C29.3137 7 32 9.68629 32 13V18"
      stroke="#F47A20"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Verified Check Badge */}
    <circle cx="36" cy="38" r="8" fill="#1E293B" />
    <path
      d="M32.5 38L35 40.5L39.5 35.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Step2Illustration = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8.5 h-8.5 sm:w-9 sm:h-9"
  >
    {/* Sparkle rays */}
    <path d="M44 28L47 28" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M43 33L45 35" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M43 23L45 21" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />

    {/* Calendar Body */}
    <rect
      x="10"
      y="13"
      width="30"
      height="28"
      rx="6"
      fill="#FFF7ED"
      stroke="#334155"
      strokeWidth="2.2"
    />
    {/* Top Header Bar */}
    <path
      d="M10 19C10 15.6863 12.6863 13 16 13H34C37.3137 13 40 15.6863 40 19V21H10V19Z"
      fill="#F47A20"
    />
    {/* Calendar Rings */}
    <path d="M17 9V14" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M33 9V14" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
    {/* Calendar Inner Grid Dots */}
    <rect x="15" y="26" width="3" height="3" rx="1" fill="#94A3B8" />
    <rect x="22" y="26" width="3" height="3" rx="1" fill="#94A3B8" />
    <rect x="15" y="32" width="3" height="3" rx="1" fill="#94A3B8" />

    {/* Clock Badge */}
    <circle cx="36" cy="38" r="8" fill="#FFF7ED" stroke="#F47A20" strokeWidth="2.2" />
    <path d="M36 34V38L39 39" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const Step3Illustration = () => (
  <svg
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-8.5 h-8.5 sm:w-9 sm:h-9"
  >
    {/* Sparkle rays */}
    <path d="M43 14L45 12" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M47 18L50 18" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />
    <path d="M44 22L46 24" stroke="#F47A20" strokeWidth="2" strokeLinecap="round" />

    {/* Store Roof Awning */}
    <path
      d="M11 20C11 18 12.5 16 15 16H35C37.5 16 39 18 39 20L38 25C38 27.5 35.5 28 34 26C32.5 28 30 28 28.5 26C27 28 24.5 28 23 26C21.5 28 19 28 17.5 26C16 28 13.5 27.5 13.5 25L11 20Z"
      fill="#F47A20"
      stroke="#1E293B"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    {/* Store Body & Door */}
    <path
      d="M13 26V43H37V26"
      stroke="#1E293B"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 43V33C21 31.8954 21.8954 31 23 31H27C28.1046 31 29 31.8954 29 33V43"
      stroke="#1E293B"
      strokeWidth="2.2"
    />

    {/* Location Pin */}
    <path
      d="M38 31C35.2386 31 33 33.2386 33 36C33 39.5 38 46 38 46C38 46 43 39.5 43 36C43 33.2386 40.7614 31 38 31Z"
      fill="#FFF7ED"
      stroke="#F47A20"
      strokeWidth="2.2"
    />
    <circle cx="38" cy="36" r="2" fill="#F47A20" />
  </svg>
);

const STEPS_DATA = [
  {
    stepNumber: '۱',
    title: 'انتخاب سرویس موردنظر',
    description: 'سرویس دلخواهت رو انتخاب و به سفارش اضافه کن.',
    Illustration: Step1Illustration,
  },
  {
    stepNumber: '۲',
    title: 'تعیین زمان مراجعه',
    description: 'تاریخ و بازه زمانی دلخواهت رو برای نوبت ثبت کن.',
    Illustration: Step2Illustration,
  },
  {
    stepNumber: '۳',
    title: 'مراجعه و دریافت خدمت',
    description: 'در زمان انتخابی مراجعه کن و از خدماتت لذت ببر.',
    Illustration: Step3Illustration,
  },
];

export default function UsageGuideCard() {
  return (
    <div className="mx-4 font-kal-2 select-none" dir="rtl">
      {/* Standalone Section Header outside the boxes */}
      <h3 className="text-[15px] font-kal-3 font-bold text-slate-800 text-right mb-2.5 px-1">
        چطور از خدمات این مجموعه استفاده کنم؟
      </h3>

      {/* Refined Horizontal Step Boxes */}
      <div className="space-y-2">
        {STEPS_DATA.map((step, idx) => {
          const { Illustration } = step;

          return (
            <div
              key={idx}
              className="relative bg-white border border-slate-100 rounded-[14px] p-3 sm:p-3.5 flex items-center gap-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
            >
              {/* Right: Illustration container with refined circular number badge */}
              <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-orange-50/60 border border-orange-100/80 flex items-center justify-center shrink-0 shadow-2xs p-1">
                <Illustration />
                <div className="absolute -top-1.5 -right-1.5 w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] min-w-[22px] min-h-[22px] aspect-square rounded-full bg-[#F47A20] text-white text-[11px] sm:text-[11.5px] font-kal-4 font-bold flex items-center justify-center shadow-xs border-2 border-white leading-none shrink-0 select-none">
                  {step.stepNumber}
                </div>
              </div>

              {/* Left: Text Content */}
              <div className="min-w-0 flex-1 text-right">
                <h4 className="text-[13px] sm:text-[13.5px] font-kal-3 font-bold text-slate-800 leading-snug mb-0.5">
                  {step.title}
                </h4>
                <p className="text-[11px] sm:text-[11.5px] font-kal-2 font-normal text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
