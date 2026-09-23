import React from 'react';
import { MapPin, ShieldCheck, Star, Tag, Phone } from 'lucide-react';

export default function SalonInfoCard({ name, address, rate, discount, category, phone }) {
  return (
    <div id="salon-info-card-container" className="relative -mt-[88px] sm:-mt-[100px] mx-4 z-20 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.13)]" dir="rtl">
      <div
        className="bg-white rounded-[18px] overflow-hidden border border-slate-100/90"
        style={{
          WebkitMaskImage: `
            radial-gradient(circle 10px at 0px 64px, transparent 9px, black 9.5px),
            radial-gradient(circle 10px at 100% 64px, transparent 9px, black 9.5px)
          `,
          maskImage: `
            radial-gradient(circle 10px at 0px 64px, transparent 9px, black 9.5px),
            radial-gradient(circle 10px at 100% 64px, transparent 9px, black 9.5px)
          `,
          WebkitMaskComposite: 'destination-in',
          maskComposite: 'intersect',
        }}
      >
        {/* Section 1: Salon Name */}
        <div className="text-center py-3 px-4 min-h-[64px] flex flex-col items-center justify-center font-kal-2">
          <h1 className="text-lg sm:text-xl font-kal-3 font-bold text-slate-800 tracking-tight select-none">
            {name || 'مجموعه زیبایی بیوتی کرمان'}
          </h1>
        </div>

        {/* Divider 1 (Horizontal Perforated Dashed Line) */}
        <div className="w-full px-3 h-[1px] flex items-center">
          <svg className="w-full h-[2px] overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="14 9"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Section 2: Address & Phone */}
        <div className="space-y-2.5 py-3.5 px-4 text-xs font-kal-2 text-slate-600 text-right flex flex-col justify-center">
          <div className="flex items-start gap-2.5 justify-start">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="font-kal-2 font-medium text-slate-700 leading-relaxed text-xs sm:text-sm">
              {address || 'خیابان قرنی کوچه شماره ۲۲'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 justify-start">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="font-kal-2 font-medium text-slate-600 text-xs">
              تضمین کیفیت و اصالت لوپُن
            </span>
          </div>
        </div>

        {/* Divider 2 */}
        <div className="w-full px-3 h-[1px] flex items-center">
          <svg className="w-full h-[2px] overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="14 9"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Section 3: Bottom Rating & Discount */}
        {(() => {
          const discountNum = Number(discount || 0);
          const hasDiscount = discountNum > 0;

          return (
            <div className="relative flex justify-between items-center py-3 px-2 text-center min-h-[58px]">
              {/* Vertical Dashed Line Divider (only if discount exists) */}
              {hasDiscount && (
                <div className="absolute inset-y-0 right-1/2 translate-x-1/2 w-[2px] pointer-events-none">
                  <svg className="w-full h-full" preserveAspectRatio="none">
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="100%"
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="10 8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}

              {/* Right side (RTL): Rating */}
              <div className={`flex-1 flex items-center justify-center gap-2 ${hasDiscount ? 'pr-2' : ''}`}>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 opacity-90" />
                <span className="text-2xl font-kal-4 font-bold text-slate-500">
                  {rate ? (typeof rate === 'number' ? rate.toLocaleString('fa-IR') : rate) : '۴.۵'}
                </span>
              </div>

              {/* Left side (RTL): Discount (only when discount > 0) */}
              {hasDiscount && (
                <div className="flex-1 flex flex-col justify-center items-center text-[#F47A20] pl-2 font-kal-3">
                  <div className="flex gap-1 items-center leading-none text-2xl font-black">
                    <span className="text-sm">تا</span>
                    <span>{discountNum.toLocaleString('fa-IR')}٪</span>
                  </div>
                  <span className="text-xs font-bold mt-0.5">
                    تخفیف
                  </span>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

