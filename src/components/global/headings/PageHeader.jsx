import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SupportDrawer from '@components/global/Drawers/SupportDrawer';
import { BiSupport } from 'react-icons/bi';
import { ChevronRight } from 'lucide-react';

function PageHeader({ title, onBack, showSupportIcon = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (["/faq", "/about-us", "/profile/orders", "/profile/myPaymentList"].includes(location.pathname)) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <div className="relative flex items-center justify-between w-full py-3 px-4 mb-1 bg-white border-b border-slate-100 shrink-0">
        {/* Right Side in RTL: Back Chevron Button */}
        <button
          type="button"
          onClick={handleBack}
          className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer z-10 shadow-3xs"
          aria-label="بازگشت"
        >
          <ChevronRight className="w-6 h-6 text-slate-700 stroke-[2.4]" />
        </button>

        {/* Center Title - Absolutely Centered */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-center">
          <h1 className="font-kal-3 font-bold text-slate-800 text-base sm:text-lg tracking-tight pointer-events-auto">
            {title}
          </h1>
        </div>

        {/* Left Side in RTL: Support Icon (Profile icon is removed) */}
        <div className="flex items-center gap-2 z-10">
          {showSupportIcon && (
            <button
              type="button"
              onClick={() => setIsSupportOpen(true)}
              className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shadow-3xs"
              aria-label="پشتیبانی"
            >
              <BiSupport size={22} className="text-slate-700" />
            </button>
          )}
        </div>
      </div>

      <SupportDrawer isOpen={isSupportOpen} setIsOpen={setIsSupportOpen} />
    </>
  );
}

export default PageHeader;
