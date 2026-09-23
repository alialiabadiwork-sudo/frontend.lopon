import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Copy, Check, Calendar, Phone, Share2, Printer } from 'lucide-react';
import { useRegisterModal } from '@core/backButtonManager';

export default function ReceiptModal({
  isOpen,
  onClose,
  cart,
  services,
  totalDiscounted,
}) {
  const [copied, setCopied] = useState(false);
  const voucherCode = 'ZB-1405-9274';

  useRegisterModal(isOpen, onClose);

  if (!isOpen) return null;

  const safeServices = Array.isArray(services) ? services : [];
  const safeCart = cart && typeof cart === 'object' ? cart : {};
  const purchasedItems = safeServices.filter((s) => (safeCart[s?.id] || 0) > 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucherCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 text-right relative shadow-2xl scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Success Header */}
        <div className="flex flex-col items-center justify-center text-center mt-2 mb-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3 border border-emerald-100 animate-scale-up">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-black text-gray-800">خرید با موفقیت انجام شد!</h3>
          <p className="text-xs text-gray-400 mt-1">کوپن شما با موفقیت صادر و فعال گردید.</p>
        </div>

        {/* Coupon Code Section */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 text-center">
          <span className="text-[10px] text-gray-400 font-bold block mb-1">کد اختصاصی کوپن شما:</span>
          
          <div className="flex items-center justify-center gap-3">
            <button
              id="copy-voucher-btn"
              onClick={handleCopy}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-50 text-emerald-500' 
                  : 'bg-white text-gray-400 hover:text-gray-600 border border-slate-200'
              }`}
              title="کپی کردن کد"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <span className="text-xl font-black text-gray-800 tracking-wider font-mono">
              {voucherCode}
            </span>
          </div>
          {copied && (
            <span className="text-[10px] text-emerald-600 font-black mt-1 block animate-fade-in">
              کد با موفقیت کپی شد.
            </span>
          )}
        </div>

        {/* Invoice details */}
        <div className="space-y-3 mb-6 bg-slate-50/50 rounded-2xl p-4 border border-dashed border-slate-200">
          <h4 className="text-xs font-black text-gray-750 border-b border-dashed border-slate-200 pb-2 mb-2">
            جزئیات فاکتور خرید:
          </h4>

          {purchasedItems.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div key={item.id} className="flex justify-between items-center text-xs font-medium">
                <span className="text-slate-600">
                  ({qty.toLocaleString('fa-IR')} عدد) × {item.name}
                </span>
                <span className="font-bold text-gray-800">
                  {(item.discountedPrice * qty).toLocaleString('fa-IR')} ریال
                </span>
              </div>
            );
          })}

          <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between items-center text-sm">
            <span className="font-black text-emerald-700">مجموع پرداختی:</span>
            <span className="font-extrabold text-slate-800">
              {totalDiscounted.toLocaleString('fa-IR')} ریال
            </span>
          </div>
        </div>

        {/* Instructions */}
        {/* <div className="space-y-2.5 text-xs text-slate-500 font-bold mb-6">
          <div className="flex gap-2 items-center justify-end">
            <span>تاریخ خرید: امروز (شبیه‌سازی شده)</span>
            <Calendar className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex gap-2 items-center justify-end">
            <span>تلفن تماس هماهنگی: ۰۳۴-۳۲۲۲XXXX</span>
            <Phone className="w-4 h-4 text-gray-400" />
          </div>
        </div> */}

        {/* Helper Action Buttons */}
        <div className="flex gap-3 mb-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id="print-invoice-btn"
            onClick={() => alert('چاپ فاکتور و کوپن')}
            className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-gray-650 text-xs font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>دانلود PDF</span>
            <Printer className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            id="share-invoice-btn"
            onClick={() => alert('ارسال جزئیات کوپن برای مخاطب از طریق پیام کوتاه')}
            className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-gray-650 text-xs font-black rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>اشتراک‌گذاری</span>
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          id="close-receipt-btn"
          onClick={onClose}
          className="w-full py-3.5 bg-[#F47A20] hover:bg-[#d66311] text-white text-xs font-black rounded-2xl transition-all shadow-[0_6px_18px_rgba(244,122,32,0.25)] cursor-pointer text-center"
        >
          خروج و بازگشت به خانه
        </motion.button>

      </div>
    </div>
  );
}
