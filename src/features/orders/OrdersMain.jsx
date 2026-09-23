import React, { useState, useEffect } from 'react';
import CompletedOrderItemCard from './components/CompletedOrderItemCard';
import OrderTabs from './components/OrderTabs';
import EmptyState from '@components/common/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, X, Check, ShoppingBag, Receipt, ArrowLeft } from 'lucide-react';
import useGet from '@hooks/server/useGet';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { clearCart } from '@utils/cartCookie';
import { getCookie } from '../../utils/cookie';

function OrdersMain() {
  const [activeTab, setActiveTab] = useState('active');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentResult, setPaymentResult] = useState(null);

  const token = typeof window !== 'undefined' ? getCookie(STORAGE_KEYS.AUTH_TOKEN) : null;
  const isLoggedIn = !!token;

  // Listen to payment callback query parameters
  useEffect(() => {
    const afterPay = searchParams.get('AfterPay');
    const status = searchParams.get('Status');
    const authority = searchParams.get('Authority');

    if (afterPay === 'ok') {
      const isSuccess = status === 'success' || status === 'OK' || status === 'true';
      setPaymentResult({
        status: isSuccess ? 'success' : 'failed',
        authority: authority || '',
      });

      if (isSuccess) {
        // Empty the cart upon successful payment
        clearCart();
      }

      // Instantly change the URL to /orders to keep it clean and prevent modal re-open on refresh
      navigate('/orders', { replace: true });
    }
  }, [searchParams, navigate]);

  const { data: myOrdersData, isLoading } = useGet(
    {},
    'orders/my-orders',
    'orders/my-orders_Get'
  );

  const allOrders = Array.isArray(myOrdersData?.data) ? myOrdersData.data : [];

  const getDisplayedOrders = () => {
    if (!isLoggedIn) return [];
    if (activeTab === 'active') {
      return allOrders.filter((o) => o.status === 'pending');
    }
    if (activeTab === 'canceled') {
      return allOrders.filter((o) => o.status === 'cancelled' || o.status === 'canceled');
    }
    if (activeTab === 'completed') {
      return allOrders.filter((o) => o.status === 'used' || o.status === 'expired');
    }
    return [];
  };

  const displayedOrders = getDisplayedOrders();

  return (
    <div dir="rtl" className="w-full max-w-md md:max-w-xl mx-auto px-3 py-2 flex flex-col relative font-kal-2 text-right">
      <OrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {!isLoggedIn ? (
        <EmptyState
          type="orders"
          badgeText="تاریخچه سفارشات"
          title="هنوز سفارشی ثبت نشده است"
          description="پس از ورود به حساب کاربری و خرید هر کد تخفیف یا کوپن زیبایی، جزئیات سفارش و کدهای اختصاصی شما در این بخش قابل دسترسی خواهد بود."
          actionLabel="ورود به حساب کاربری / ثبت نام"
          onAction={() => navigate('/login')}
        />
      ) : isLoading ? (
        /* Skeleton Loading State */
        <div className="px-1 space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-slate-100 rounded-xl p-3.5 my-2.5 shadow-2xs animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-slate-200 rounded-md w-36"></div>
                <div className="h-5 bg-slate-100 rounded-md w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-100 rounded-md w-48"></div>
                <div className="h-3.5 bg-slate-100 rounded-md w-32"></div>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <div className="h-8 bg-slate-100 rounded-lg flex-1"></div>
                <div className="h-8 bg-slate-100 rounded-lg flex-1"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayedOrders.length === 0 ? (
        <EmptyState
          type="orders"
          badgeText="تاریخچه سفارشات"
          title="هیچ سفارشی در این بخش موجود نیست"
          description="پس از خرید هر کد تخفیف یا کوپن زیبایی، جزئیات سفارش و کدهای اختصاصی شما در این بخش قابل دسترسی خواهد بود."
          actionLabel="جستجوی خدمات و مجموعه‌ها"
          onAction={() => navigate('/')}
        />
      ) : (
        /* Orders List if present */
        <div className="px-1 space-y-3">
          {displayedOrders.map((order) => (
            <CompletedOrderItemCard key={order.id || order._id} order={order} />
          ))}
        </div>
      )}

      {/* Payment Status Modal */}
      <AnimatePresence>
        {paymentResult && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentResult(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              dir="rtl"
              className="relative w-full max-w-[390px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100/80 z-10 p-6 flex flex-col items-center text-center"
            >
              {/* Close Button */}
              <button
                onClick={() => setPaymentResult(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {paymentResult.status === 'success' ? (
                <>
                  {/* Success Header Visuals */}
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-500 border border-emerald-100 relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" />
                    <CheckCircle2 className="w-9 h-9 relative z-10" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    پرداخت با موفقیت انجام شد!
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-5">
                    خرید شما با موفقیت به ثبت رسید و کوپن‌های تخفیف صادر شدند. هم‌اکنون می‌توانید کدهای تخفیف خود را در لیست زیر استفاده فرمایید.
                  </p>

                  {/* Transaction Details */}
                  {paymentResult.authority && (
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5 space-y-2 text-right">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">کد پیگیری تراکنش:</span>
                        <span className="font-mono font-bold text-slate-700 select-all tracking-wider">
                          {paymentResult.authority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">وضعیت پرداخت:</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> موفقیت‌آمیز
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setPaymentResult(null);
                        setActiveTab('active');
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>مشاهده کوپن‌های فعال</span>
                    </button>
                    <button
                      onClick={() => {
                        setPaymentResult(null);
                        navigate('/');
                      }}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>بازگشت به صفحه اصلی</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Failure Header Visuals */}
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4 text-rose-500 border border-rose-100">
                    <XCircle className="w-9 h-9" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    پرداخت ناموفق بود
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mb-5">
                    متأسفانه تراکنش با خطا مواجه شد یا توسط شما لغو گردید. در صورتی که مبلغی از حساب شما کسر شده باشد، تا ۷۲ ساعت آینده به صورت خودکار بازمی‌گردد.
                  </p>

                  {/* Transaction Details */}
                  {paymentResult.authority && (
                    <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 mb-5 space-y-2 text-right">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">کد پیگیری تراکنش:</span>
                        <span className="font-mono font-bold text-slate-600 select-all">
                          {paymentResult.authority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-medium">وضعیت پرداخت:</span>
                        <span className="text-rose-600 font-bold">ناموفق / لغو شده</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="w-full flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setPaymentResult(null);
                        navigate('/cart');
                      }}
                      className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>تلاش مجدد و ورود به سبد خرید</span>
                    </button>
                    <button
                      onClick={() => setPaymentResult(null)}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>بستن پنجره</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrdersMain;

