import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, QrCode, CheckCircle2, AlertCircle, ArrowLeft, Ticket } from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function QuickRedeemModal({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const redeemCoupon = useVendorStore((s) => s.redeemCoupon);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!code || code.trim().length === 0) return;
    const res = redeemCoupon(code);
    setResult(res);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Simulate scanning one of the pending codes
      setCode('582914');
      setIsScanning(false);
      const res = redeemCoupon('582914');
      setResult(res);
    }, 1200);
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#F47A20]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-kal-3 font-bold text-slate-800 text-base">استعلام و ثبت سریع کوپن</h3>
                <p className="font-kal-1 text-xs text-slate-400">ثبت پذیرش و تغییر وضعیت کوپن به استفاده‌شده</p>
              </div>
            </div>
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {!result ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-kal-3 font-bold text-slate-700 mb-2">
                    کد یکتای ۶ رقمی کوپن:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="مثلاً: ۵۸۲۹۱۴"
                      autoFocus
                      className="w-full h-14 text-center text-2xl tracking-[0.3em] font-kal-4 text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#F47A20] focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-kal-2 placeholder:text-sm"
                    />
                    <Ticket className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11px] font-kal-1 text-slate-400 mt-2">
                    کد ۶ رقمی پیامک شده به مشتری یا موجود در اپلیکیشن خریدار
                  </p>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={code.length < 5}
                    className="h-12 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 disabled:pointer-events-none text-white font-kal-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>استعلام و ثبت</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-kal-3 font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-slate-600" />
                    <span>{isScanning ? 'در حال اسکن...' : 'اسکن بارکد'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                    result.success ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {result.success ? <CheckCircle2 className="w-9 h-9" /> : <AlertCircle className="w-9 h-9" />}
                </div>

                <div className="space-y-1">
                  <h4 className={`font-kal-3 font-bold text-lg ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.success ? 'پذیرش با موفقیت ثبت شد' : 'خطا در ثبت کوپن'}
                  </h4>
                  <p className="font-kal-2 text-xs text-slate-600 px-4 leading-relaxed">{result.message}</p>
                </div>

                {result.coupon && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-right space-y-2 text-xs font-kal-2">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">مشتری:</span>
                      <span className="font-kal-3 font-bold text-slate-800">{result.coupon.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">خدمت:</span>
                      <span className="font-kal-3 text-slate-800">{result.coupon.serviceTitle}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">شماره تماس:</span>
                      <span className="text-slate-800 font-kal-1" dir="ltr">{result.coupon.customerPhone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">مبلغ خالص دریافتی سالن:</span>
                      <span className="font-kal-3 font-bold text-emerald-600">
                        {result.coupon.salonShare.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    ثبت یا استعلام کوپن دیگر
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
