import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, PhoneCall, ShieldCheck, Users } from 'lucide-react';
import { useRegisterModal } from '@core/backButtonManager';

export default function TermsModal({ isOpen, onClose }) {
  useRegisterModal(isOpen, onClose);

  if (!isOpen) return null;

  const termsList = [
    {
      id: 1,
      title: 'مدت اعتبار کوپن‌ها',
      description: 'کوپن‌ها تا تاریخ درج‌شده در فاکتور معتبر می‌باشند.',
      icon: Calendar,
    },
    {
      id: 2,
      title: 'رزرو نوبت تلفنی',
      description: 'حداقل ۲۴ ساعت پیش جهت رزرو قطعی نوبت تماس بگیرید.',
      icon: PhoneCall,
    },
    {
      id: 3,
      title: 'ضمانت بازگشت وجه',
      description: 'در صورت عدم ارائه خدمت، وجه به حساب شما عودت داده می‌شود.',
      icon: ShieldCheck,
    },
    {
      id: 4,
      title: 'انتقال به دیگران',
      description: 'ارائه کد پیگیری کوپن توسط سایر افراد جهت دریافت خدمت بلامانع است.',
      icon: Users,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="bg-white rounded-3xl w-full max-w-sm p-5 text-right relative shadow-2xl border border-slate-100 flex flex-col"
        >
          {/* Close Button */}
          <button
            type="button"
            id="close-terms-btn"
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Modal Header without Icon */}
          <div className="mb-4 pr-1">
            <h3 className="text-base font-kal-3 font-bold text-slate-800">قوانین و شرایط استفاده</h3>
            <p className="text-[11px] font-kal-2 text-slate-400 mt-0.5">لوپُن - سامانه تخفیف و رزرو آنلاین</p>
          </div>

          {/* Terms Content */}
          <div className="space-y-2.5 my-1">
            {termsList.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-slate-50/80 border border-slate-100 rounded-2xl p-2.5 flex items-start gap-2.5 transition-all hover:bg-white hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-xl border bg-orange-50 text-[#F47A20] border-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-kal-3 font-bold text-slate-800 text-xs mb-0.5">
                      {item.title}
                    </h4>
                    <p className="font-kal-2 text-slate-500 text-[11px] leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-100 mt-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              id="accept-terms-btn"
              onClick={onClose}
              className="w-full py-3 bg-[#F47A20] hover:bg-[#d66311] text-white text-xs font-kal-3 font-bold rounded-2xl transition-all shadow-[0_4px_16px_rgba(244,122,32,0.2)] cursor-pointer text-center"
            >
              متوجه شدم و می‌پذیرم
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

