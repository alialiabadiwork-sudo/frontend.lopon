import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Headset } from 'lucide-react';
import OffImg from '@assets/images/off.png';

function MainButtons({ isAdmin, onSupportClick, onFaqClick, onExitClick }) {
  return (
    <div className="w-full space-y-3.5 my-4">
      {/* Vendor Panel Button */}
      <Link to="/vendor" className="block w-full">
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-3.5 px-5 rounded-2xl flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.12)] transition-all cursor-pointer border border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F47A20] text-white flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className="text-right">
              <span className="font-kal-3 font-bold text-sm text-white block">پنل مدیریت سالن (وندور)</span>
              <span className="font-kal-2 text-[11px] text-slate-300 block">مدیریت کوپن‌ها، نوبت‌ها، خدمات و باشگاه مشتریان</span>
            </div>
          </div>
          <span className="bg-[#F47A20] text-white text-[11px] px-2.5 py-1 rounded-lg font-bold font-kal-3">ورود به پنل</span>
        </motion.div>
      </Link>


      {/* Primary Action Button: سفارشات من */}
      <Link to="/orders" className="block w-full">
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#F47A20] hover:bg-[#d66311] text-white py-3 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-[0_4px_15px_rgba(244,122,32,0.18)] transition-all cursor-pointer"
        >
          <img className="w-[32px] h-[32px] object-contain" src={OffImg} alt="off" />
          <span className="font-kal-3 font-bold text-sm sm:text-base text-white">سفارشات من</span>
        </motion.div>
      </Link>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {/* Top Right: پشتیبانی */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onSupportClick}
          className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl py-4 px-3 flex items-center justify-center gap-2.5 hover:border-orange-100 transition-all cursor-pointer w-full"
        >
          <Headset className="w-5 h-5 text-slate-600 shrink-0" />
          <span className="font-kal-2 text-slate-700 font-medium text-sm sm:text-base">پشتیبانی</span>
        </motion.button>

        {/* Top Left: سوالات متداول */}
        <Link to="/faq" className="block w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl py-4 px-3 flex items-center justify-center gap-2.5 hover:border-orange-100 transition-all cursor-pointer w-full"
          >
            <svg className="w-5 h-5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="font-kal-2 text-slate-700 font-medium text-sm sm:text-base">سوالات متداول</span>
          </motion.div>
        </Link>

        {/* Bottom Right: درباره ما */}
        <Link to="/about-us" className="block w-full">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl py-4 px-3 flex items-center justify-center gap-2.5 hover:border-orange-100 transition-all cursor-pointer w-full"
          >
            <svg className="w-5 h-5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span className="font-kal-2 text-slate-700 font-medium text-sm sm:text-base">درباره ما</span>
          </motion.div>
        </Link>

        {/* Bottom Left: خروجی از حساب */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onExitClick}
          className="bg-white border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-2xl py-4 px-3 flex items-center justify-center gap-2.5 hover:border-orange-200 hover:bg-orange-50/20 transition-all cursor-pointer w-full"
        >
          <svg className="w-5 h-5 text-[#F47A20] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="font-kal-2 text-[#F47A20] font-medium text-sm sm:text-base">خروجی از حساب</span>
        </motion.button>
      </div>
    </div>
  );
}

export default MainButtons;

