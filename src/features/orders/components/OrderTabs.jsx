import React from 'react';
import { motion } from 'motion/react';

function OrderTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center mb-6 px-2 sm:px-4">
      <div className="relative w-full max-w-sm sm:max-w-md h-[46px] bg-white border border-slate-100 p-1 rounded-full shadow-[0_4px_20px_0px_rgba(0,0,0,0.06)] flex items-center justify-between">
        {/* Right Option in RTL: قابل استفاده */}
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`relative z-10 flex-1 py-2 text-center text-xs sm:text-sm font-kal-3 transition-colors duration-200 cursor-pointer ${
            activeTab === 'active' ? 'text-white font-bold' : 'text-slate-600 font-bold hover:text-slate-900'
          }`}
        >
          {activeTab === 'active' && (
            <motion.div
              layoutId="order-tab-pill"
              className="absolute inset-0 bg-[#F47A20] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">قابل استفاده</span>
        </button>

        {/* Middle Option in RTL: لغو شده */}
        <button
          type="button"
          onClick={() => setActiveTab('canceled')}
          className={`relative z-10 flex-1 py-2 text-center text-xs sm:text-sm font-kal-3 transition-colors duration-200 cursor-pointer ${
            activeTab === 'canceled' ? 'text-white font-bold' : 'text-slate-600 font-bold hover:text-slate-900'
          }`}
        >
          {activeTab === 'canceled' && (
            <motion.div
              layoutId="order-tab-pill"
              className="absolute inset-0 bg-[#F47A20] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">لغو شده</span>
        </button>

        {/* Left Option in RTL: تمام شده */}
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`relative z-10 flex-1 py-2 text-center text-xs sm:text-sm font-kal-3 transition-colors duration-200 cursor-pointer ${
            activeTab === 'completed' ? 'text-white font-bold' : 'text-slate-600 font-bold hover:text-slate-900'
          }`}
        >
          {activeTab === 'completed' && (
            <motion.div
              layoutId="order-tab-pill"
              className="absolute inset-0 bg-[#F47A20] rounded-full shadow-xs"
              transition={{ type: 'spring', stiffness: 450, damping: 35 }}
            />
          )}
          <span className="relative z-10">تمام شده</span>
        </button>
      </div>
    </div>
  );
}

export default OrderTabs;

