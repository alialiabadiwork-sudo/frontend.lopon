import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ALL_WEEK_DAYS = [
  { dayNum: 0, day: 'شنبه' },
  { dayNum: 1, day: 'یکشنبه' },
  { dayNum: 2, day: 'دوشنبه' },
  { dayNum: 3, day: 'سه‌شنبه' },
  { dayNum: 4, day: 'چهارشنبه' },
  { dayNum: 5, day: 'پنج‌شنبه' },
  { dayNum: 6, day: 'جمعه' },
];

export default function ConfidenceCard({ workingDays }) {
  const [isOpen, setIsOpen] = useState(true);

  let hoursList = [];
  if (workingDays && Array.isArray(workingDays) && workingDays.length > 0) {
    const daysMap = new Map();
    workingDays.forEach((w) => {
      const d = Number(w.day);
      if (d >= 0 && d <= 6) {
        const timeStr = w.from && w.to ? `${w.from} – ${w.to}` : (w.time || 'تعطیل');
        daysMap.set(d, timeStr);
      }
    });

    hoursList = ALL_WEEK_DAYS.map((d) => ({
      day: d.day,
      time: daysMap.has(d.dayNum) ? daysMap.get(d.dayNum) : 'تعطیل',
    }));
  } else {
    hoursList = [
      { day: 'شنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'یکشنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'دوشنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'سه‌شنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'چهارشنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'پنج‌شنبه', time: '۱۰:۰۰ – ۲۱:۰۰' },
      { day: 'جمعه', time: '۱۲:۰۰ – ۱۸:۰۰' },
    ];
  }

  return (
    <div className="mx-4 space-y-4 font-kal-2" dir="rtl">
      {/* Collapsible Confidence Banner */}
      <div className="filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.06)]">
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl overflow-hidden transition-all">
          {/* Banner Header Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3.5 text-right cursor-pointer select-none"
          >
            {/* Right side: Title */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span className="font-kal-3 font-bold text-sm text-emerald-950">
                با اطمینان خرید کنید!
              </span>
            </div>

            {/* Left side: Chevron icon */}
            <div className="text-emerald-700">
              {isOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {/* Collapsible Content */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="px-3.5 pb-3.5 pt-0 text-xs text-emerald-900/90 leading-relaxed font-medium">
                  در صورت عدم استفاده از کوپن خریداری شده در مدت زمان مقرر و یا وجود مغایرت بین خدمات دریافتنی با توضیحات و شرایط موجود در سایت، پس از تایید کارشناس،
                  <span className="font-kal-3 font-extrabold text-emerald-950 mx-1">بازگشت ۱۰۰٪ وجه تضمین می‌گردد.</span>
                  تمدید کوپن منقضی شده فقط درصورت عدم تغییر قیمت خدمات مورد نظر امکان پذیر می‌باشد.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Working Hours Section */}
      <div className="space-y-2 pt-1">
        <h3 className="text-[15px] font-kal-3 font-bold text-slate-800 text-right pr-1">
          ساعت های کاری
        </h3>

        {/* Horizontal Scrollable Row for Days */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-right">
          {hoursList.map((item, index) => (
            <div
              key={index}
              className="w-[72px] min-w-[72px] h-[68px] bg-slate-50 border border-slate-200/70 rounded-xl flex flex-col justify-center items-center text-center p-1.5 flex-shrink-0 select-none shadow-2xs"
            >
              <span className="text-[11px] text-slate-500 font-normal mb-0.5">
                {item.day}
              </span>
              <span className="text-[11px] font-medium text-slate-900 leading-tight">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
