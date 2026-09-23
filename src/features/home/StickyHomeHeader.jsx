import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { BiSupport } from 'react-icons/bi';
import LoponLogo from '@assets/images/lopon-logo.png';

export default function StickyHomeHeader({ onOpenSupport }) {
  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -70, opacity: 0 }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full max-w-[480px] bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] px-4 py-2.5 flex items-center gap-2.5 border-x border-slate-200"
      dir="rtl"
    >
      {/* Search Bar (Interactive input box to /search) */}
      <Link
        to="/search"
        className="flex-1 flex items-center justify-between h-[48px] px-3.5 bg-slate-50 hover:bg-slate-100/90 active:scale-[0.99] transition-all rounded-[18px] border border-slate-200 hover:border-[#F47A20]/50 group cursor-pointer select-none"
        aria-label="جستجوی خدمات زیبایی و سالن‌ها"
      >
        {/* Right Section in RTL: Lopon Brand Icon & Text */}
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <img
            src={LoponLogo}
            alt="لوپُن"
            className="w-8 h-8 object-contain shrink-0 drop-shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="flex items-center text-[12.5px] sm:text-[13.5px] font-kal-2 text-slate-400 group-hover:text-slate-500 transition-colors truncate">
            <span>جستجوی خدمات زیبایی و سالن‌ها</span>
          </div>
        </div>

        {/* Left Section in RTL: Clean Integrated Search Icon (no detached bubble/knob) */}
        <div className="flex items-center justify-center pl-1 text-slate-400 group-hover:text-[#F47A20] transition-colors shrink-0">
          <LuSearch size={21} className="stroke-[2.2]" />
        </div>
      </Link>

      {/* Quick Support Action Button */}
      {onOpenSupport && (
        <button
          type="button"
          onClick={onOpenSupport}
          className="w-[48px] h-[48px] rounded-[18px] bg-slate-50 hover:bg-slate-100/90 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#F47A20] active:scale-95 transition-all cursor-pointer shrink-0"
          aria-label="پشتیبانی لوپُن"
          title="پشتیبانی"
        >
          <BiSupport size={22} />
        </button>
      )}
    </motion.header>
  );
}
