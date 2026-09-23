import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Info } from 'lucide-react';
import { discountService } from '@services/discount.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { getCart } from '@utils/cartCookie';
import { formatPrice } from '@utils/formatters';
import { getCookie } from '../../../utils/cookie';
import { TomanBadge } from './CartItemCard';

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

function CartSummary({
  summaryData,
  onCheckout,
  onOpenVisitDrawer,
  items,
  isSubmittingPayment,
  appliedDiscount,
  setAppliedDiscount,
}) {
  const {
    totalOriginal = '۰',
    totalDiscount = '۰',
    totalPayable = '۰',
  } = summaryData || {};

  const [showDiscount, setShowDiscount] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleApplyDiscount = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedCode = discountCode.trim();
    if (!trimmedCode) {
      setFeedback({
        type: 'error',
        message: 'لطفاً کد تخفیف را وارد کنید.',
      });
      return;
    }

    const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      setFeedback({
        type: 'error',
        message: 'برای استفاده از کد تخفیف باید ابتدا وارد حساب کاربری خود شوید.',
      });
      return;
    }

    const currentItems = items && items.length > 0 ? items : getCart();
    if (!currentItems || currentItems.length === 0) {
      setFeedback({
        type: 'error',
        message: 'سبد خرید شما خالی است.',
      });
      return;
    }

    const payloadItems = currentItems.map((item) => ({
      id: item.id || item.serviceId || item._id,
      serviceId: item.serviceId || item.id || item._id,
      quantity: Number(item.quantity) || 1,
    }));

    setIsLoading(true);

    try {
      const response = await discountService.validateDiscountCode({
        code: trimmedCode,
        items: payloadItems,
      });

      const resData = response?.data;
      if (resData?.status === 'success' || response?.status === 200 || response?.status === 201) {
        const discountInfo = resData?.data || resData;
        const successMsg = resData?.message || 'کد تخفیف با موفقیت اعمال شد';
        setFeedback({
          type: 'success',
          message: successMsg,
          data: discountInfo,
        });
        if (setAppliedDiscount) {
          setAppliedDiscount({ ...discountInfo, code: trimmedCode });
        }
      } else {
        setFeedback({
          type: 'error',
          message: resData?.message || 'اعتبارسنجی کد تخفیف ناموفق بود.',
        });
        if (setAppliedDiscount) setAppliedDiscount(null);
      }
    } catch (err) {
      console.error('Validate discount error:', err);
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'کد تخفیف وارد شده معتبر نیست یا منقضی شده است.';
      setFeedback({
        type: 'error',
        message: errorMsg,
      });
      if (setAppliedDiscount) setAppliedDiscount(null);
    } finally {
      setIsLoading(false);
    }
  };

  const displayPayable =
    appliedDiscount?.newPayablePrice !== undefined
      ? formatPrice(appliedDiscount.newPayablePrice)
      : totalPayable;

  const discountAmount =
    appliedDiscount?.appliedDiscountAmount !== undefined
      ? formatPrice(appliedDiscount.appliedDiscountAmount)
      : totalDiscount;

  const hasDiscountSavings =
    discountAmount !== undefined &&
    discountAmount !== null &&
    discountAmount !== 0 &&
    discountAmount !== '0' &&
    discountAmount !== '۰' &&
    discountAmount !== '';

  return (
    <div dir="rtl" className="w-full space-y-4 font-kal-2 select-none text-right">
      {/* 1. Discount Code Card */}
      <div className="bg-[#f8fafc] border border-slate-200/80 rounded-[20px] p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          {/* Label on Right in RTL (Child 1) */}
          <span className="text-[14px] font-kal-3 font-bold text-slate-800">
            کد تخفیف دارید؟
          </span>

          {/* Toggle Switch on Left in RTL (Child 2) */}
          <button
            type="button"
            dir="ltr"
            onClick={() => {
              setShowDiscount(!showDiscount);
              if (showDiscount) {
                setFeedback(null);
              }
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
              showDiscount ? 'bg-[#334155]' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out transform ${
                showDiscount ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Discount Code Input Box */}
        {showDiscount && (
          <div className="mt-3.5 space-y-2 pt-2 border-t border-slate-200/60">
            {feedback && (
              <div
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-all ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                <span>{feedback.message}</span>
                {feedback.type === 'success' && feedback.data?.discountPercent && (
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {toPersianDigits(feedback.data.discountPercent)}% تخفیف
                  </span>
                )}
              </div>
            )}

            <form onSubmit={handleApplyDiscount} className="flex items-center gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder="کد تخفیف خود را وارد کنید"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-normal text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#F47A20] transition-colors text-right"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#e2e8f0] hover:bg-slate-300 text-slate-700 font-kal-3 font-medium px-6 py-2.5 rounded-xl text-[13px] transition-colors cursor-pointer shrink-0 disabled:opacity-50 flex items-center justify-center min-w-[75px]"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  'اعمال'
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 2. Order Breakdown Section */}
      <div className="space-y-2 px-1 pt-1">
        {/* Row 1: Total Orders (Label on Right, Price on Left) */}
        <div className="flex items-center justify-between text-right py-1">
          <span className="text-slate-600 font-normal text-[13.5px]">
            جمع کل سفارشات:
          </span>
          <div className="flex items-center gap-1">
            <span className="font-kal-3 font-bold text-slate-800 text-[15px]">
              {totalOriginal}
            </span>
            <span className="text-[12px] text-slate-400 font-kal-2">تومان</span>
          </div>
        </div>

        {/* Row 2: Savings Pill */}
        {hasDiscountSavings && (
          <div className="bg-[#e8f8ee] rounded-xl px-3.5 py-2.5 flex items-center justify-between text-[#1e8e4a] my-2">
            <div className="flex items-center gap-1.5 font-normal text-[13px]">
              <Info className="w-4 h-4 text-[#1e8e4a] stroke-[2.2]" />
              <span>سود شما از خرید:</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-kal-3 font-bold text-[#1e8e4a] text-[15px]">
                {discountAmount}
              </span>
              <span className="text-[12px] text-[#1e8e4a]/80 font-normal">تومان</span>
            </div>
          </div>
        )}

        {/* Dashed Line Divider */}
        <div
          className="my-2.5 h-[1px] w-full"
          style={{
            backgroundImage: 'linear-gradient(to right, #cbd5e1 50%, rgba(255,255,255,0) 0%)',
            backgroundSize: '12px 1px',
            backgroundRepeat: 'repeat-x',
          }}
        />

        {/* Row 3: Payable Amount */}
        <div className="flex items-center justify-between text-right py-1">
          <span className="font-normal text-slate-800 text-[14px]">
            مبلغ قابل پرداخت:
          </span>
          <div className="flex items-center gap-1">
            <span className="font-kal-3 font-bold text-slate-900 text-[16px] sm:text-[17px]">
              {displayPayable}
            </span>
            <span className="text-[12px] text-slate-400 font-kal-2">تومان</span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Sticky Checkout Bar (Matching StickyFooterBar in Business Page) */}
      <div
        dir="rtl"
        className="fixed bottom-[68px] left-1/2 -translate-x-1/2 z-40 w-full max-w-[480px] bg-white border-t border-slate-300 rounded-none px-4 py-3 flex items-center justify-between font-kal-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] gap-4 transition-all border-x border-slate-200"
      >
        {/* Right side in RTL (Child 1): Checkout / Open Drawer Button (50% width) */}
        <motion.button
          whileHover={{ scale: isSubmittingPayment ? 1 : 1.02 }}
          whileTap={{ scale: isSubmittingPayment ? 1 : 0.97 }}
          id="checkout-trigger-btn"
          type="button"
          disabled={isSubmittingPayment}
          onClick={() => {
            if (onOpenVisitDrawer) {
              onOpenVisitDrawer();
            } else if (onCheckout) {
              onCheckout(discountCode);
            }
          }}
          className="w-1/2 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-[13px] sm:text-[14px] py-3 px-2 rounded-xl shadow-[0_6px_18px_rgba(244,122,32,0.25)] text-center transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {isSubmittingPayment ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <span className="text-xs">درحال انتقال...</span>
            </>
          ) : (
            <span>تعیین روز و زمان مراجعه</span>
          )}
        </motion.button>

        {/* Left side in RTL (Child 2): Price container (50% width) - aligned to left (justify-end in RTL) */}
        <div className="w-1/2 flex items-center justify-end gap-1.5 overflow-hidden">
          {/* Original Price with diagonal strike-through */}
          {hasDiscountSavings && (
            <span className="relative inline-block text-xs text-slate-300 font-normal shrink-0">
              {totalOriginal}
              <span className="absolute inset-0 top-1/2 -translate-y-1/2 border-b border-slate-300 transform -rotate-[14deg] origin-center pointer-events-none" />
            </span>
          )}

          {/* Payable Price */}
          <span className="text-base sm:text-lg font-bold text-slate-800 shrink-0 font-kal-3">
            {displayPayable}
          </span>

          {/* Custom Toman Word on the far left */}
          <div className="flex flex-col items-center justify-center leading-none text-slate-400 font-kal-2 select-none shrink-0 ms-0.5">
            <span className="text-[8px] font-normal leading-none mb-[1px]">ن</span>
            <span className="text-[9px] font-normal leading-none">تـوما</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSummary;
