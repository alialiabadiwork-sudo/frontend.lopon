import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WelcomeGiftImg from '@assets/images/welcome-gift.jpg';
import Confetti from '@components/common/Confetti';
import { useTopAlert } from '@hooks/useTopAlert';

/**
 * Welcome / Congratulations Modal shown upon completing referral registration.
 * Matches Design 2 Pixel-Perfect with Confetti effect.
 */
function WelcomeGiftModal({
  isOpen,
  onClose,
  discountCode = 'lopon',
  discountAmount = '۱۵۰ هزار تومان',
}) {
  const navigate = useNavigate();
  const { showAlert } = useTopAlert();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      showAlert({ type: 'success', message: 'کد تخفیف با موفقیت کپی شد!' });
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      showAlert({ type: 'info', message: `کد تخفیف: ${discountCode}` });
    }
  };

  const handleCtaClick = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <>
      {/* Celebration Confetti Effect */}
      <Confetti duration={3000} particleCount={70} />

      {/* Modal Overlay */}
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[360px] sm:max-w-[380px] bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 text-center shadow-2xl border border-slate-100 overflow-hidden"
            dir="rtl"
          >
            {/* Close Button (Top Corner) */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="بستن"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* 3D Gift Illustration with Confetti Floating */}
            <div className="relative flex justify-center items-center my-1">
              <img
                src={WelcomeGiftImg}
                alt="هدیه خوش‌آمدگویی"
                className="w-36 h-36 sm:w-40 sm:h-40 object-contain drop-shadow-sm pointer-events-none"
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-xl sm:text-[22px] font-black text-[#1E293B] font-kal-3 tracking-tight mt-1">
              به <span className="text-[#F47A20]">لوپُن</span> خوش اومدی!
            </h2>
            <p className="text-[12.5px] sm:text-[13px] text-slate-600 font-kal-2 mt-1.5 leading-relaxed">
              دوستت تو رو به لوپُن دعوت کرده و یه هدیه برات داریم.
            </p>

            {/* Reward Pill Badge */}
            <div className="inline-flex items-center justify-center gap-1.5 bg-[#FFF6F0] border border-orange-100 text-slate-800 rounded-full px-4 py-2 text-[11.5px] sm:text-xs font-kal-3 font-bold mt-4 shadow-3xs">
              <span>🎁</span>
              <span><span className="text-[#F47A20] font-black">{discountAmount}</span> تخفیف هدیه شما</span>
            </div>

            {/* Dashed Coupon Code Box */}
            <div className="mt-3.5 bg-white border-2 border-dashed border-[#F47A20]/40 rounded-2xl p-2 flex items-center justify-between gap-2 shadow-2xs">
              {/* Code */}
              <div className="flex-1 font-mono font-black text-xl sm:text-2xl text-[#F47A20] tracking-widest text-center pl-2 select-all">
                {discountCode}
              </div>

              {/* Divider & Copy Action Button */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-r border-dashed border-orange-200/80 hover:bg-orange-50 text-[#F47A20] transition-colors cursor-pointer shrink-0"
                aria-label="کپی کد تخفیف"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    <span className="text-[11px] font-kal-3 font-bold text-emerald-600">کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 stroke-[2.2]" />
                    <span className="text-[11px] font-kal-3 font-bold">کپی</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full mt-4 py-3.5 bg-[#F47A20] hover:bg-[#d66311] active:scale-[0.98] text-white rounded-2xl font-kal-3 font-bold text-sm sm:text-[15px] shadow-md shadow-[#F47A20]/25 transition-all cursor-pointer"
            >
              دیدن پیشنهادهای لوپُن
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}

export default WelcomeGiftModal;
