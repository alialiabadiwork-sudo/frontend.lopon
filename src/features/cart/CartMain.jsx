import React, { useState, useEffect, useMemo } from 'react';
import CartItemCard from './components/CartItemCard';
import CartSummary from './components/CartSummary';
import VisitTimeDrawer, { getUpcomingDays, TIME_RANGE_OPTIONS } from './components/VisitTimeDrawer';
import EmptyState from '@components/common/EmptyState';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@utils/formatters';
import {
  getCart,
  updateQuantity,
  removeFromCart,
  saveCart,
} from '@utils/cartCookie';
import { businessService } from '@services/business.service';
import { DEALS } from '@core/constants';
import { paymentService } from '@services/payment.service';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { useTopAlert } from '@hooks/useTopAlert';
import { getCookie } from '../../utils/cookie';

function CartMain() {
  const [items, setItems] = useState(() => {
    const c = getCart();
    return Array.isArray(c) ? c : [];
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(null);

  // Preferred Visit Date & Time states (start unselected)
  const availableDays = useMemo(() => getUpcomingDays(14), []);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [isVisitTimeDrawerOpen, setIsVisitTimeDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useTopAlert();

  const safeItems = Array.isArray(items) ? items : [];

  // Keep state synchronized with storage and cartChange events
  useEffect(() => {
    const handleSync = (e) => {
      const updated = e?.detail || getCart();
      setItems(Array.isArray(updated) ? updated : []);
    };

    window.addEventListener('cartChange', handleSync);
    window.addEventListener('storage', handleSync);

    const initial = getCart();
    setItems(Array.isArray(initial) ? initial : []);

    return () => {
      window.removeEventListener('cartChange', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Web service check: verify price updates & active status for items in cart
  useEffect(() => {
    if (safeItems.length === 0) return;

    let isMounted = true;

    const checkPricesAndStatus = async () => {
      const itemsByBusiness = {};
      safeItems.forEach((item) => {
        const bId = item.businessId || item.vendorId || item.vendorSlug || 'b1';
        if (!itemsByBusiness[bId]) {
          itemsByBusiness[bId] = [];
        }
        itemsByBusiness[bId].push(item);
      });

      let cartChanged = false;
      const updatedCart = [...safeItems];

      for (const bId of Object.keys(itemsByBusiness)) {
        try {
          const res = await businessService.getVendorDetails(bId);
          const rawData = res?.data?.data || res?.data || res;
          const vendorServices = rawData?.vendorServices || [];

          itemsByBusiness[bId].forEach((cartItem) => {
            const cartItemId = cartItem.id || cartItem.vendorServiceId || cartItem._id;

            const liveService = vendorServices.find(
              (s) =>
                String(s.id || s._id || s.vendorServiceId) === String(cartItemId) ||
                String(s.name || s.title) === String(cartItem.title)
            );

            const indexInCart = updatedCart.findIndex(
              (ci) => String(ci.id || ci.vendorServiceId || ci._id) === String(cartItemId)
            );

            if (indexInCart === -1) return;

            if (liveService) {
              const isActive =
                liveService.isActive !== false &&
                liveService.active !== false &&
                liveService.status !== 'inactive' &&
                liveService.isAvailable !== false;

              if (!isActive) {
                if (!updatedCart[indexInCart].isExpired) {
                  updatedCart[indexInCart] = {
                    ...updatedCart[indexInCart],
                    isExpired: true,
                    isActive: false,
                  };
                  cartChanged = true;
                }
              } else {
                const orig = Number(liveService.price || liveService.originalPrice || 0);
                const disc = Number(liveService.finalPrice || liveService.discountedPrice || liveService.price || 0);
                const origFormatted = orig > 0 ? formatPrice(orig) : cartItem.originalPrice;
                const discFormatted = disc > 0 ? formatPrice(disc) : cartItem.discountedPrice;
                let percent = liveService.discount || liveService.discountPercent || 0;
                if (!percent && orig > 0 && disc < orig) {
                  percent = Math.round(((orig - disc) / orig) * 100);
                }

                const priceChanged =
                  (discFormatted && cartItem.discountedPrice !== discFormatted) ||
                  (origFormatted && cartItem.originalPrice !== origFormatted);

                if (priceChanged || updatedCart[indexInCart].isExpired) {
                  updatedCart[indexInCart] = {
                    ...updatedCart[indexInCart],
                    isExpired: false,
                    isActive: true,
                    originalPrice: origFormatted,
                    discountedPrice: discFormatted,
                    discountPercent: percent || cartItem.discountPercent,
                  };
                  cartChanged = true;
                }
              }
            } else {
              const deal = DEALS.find(
                (d) =>
                  String(d.id) === String(cartItemId) ||
                  (String(d.businessId) === String(bId) && String(d.serviceTitle) === String(cartItem.title))
              );

              if (deal) {
                if (deal.isActive === false) {
                  if (!updatedCart[indexInCart].isExpired) {
                    updatedCart[indexInCart] = {
                      ...updatedCart[indexInCart],
                      isExpired: true,
                      isActive: false,
                    };
                    cartChanged = true;
                  }
                } else {
                  const dealDiscFormatted = formatPrice(deal.discountedPrice);
                  const dealOrigFormatted = formatPrice(deal.originalPrice);
                  if (cartItem.discountedPrice !== dealDiscFormatted) {
                    updatedCart[indexInCart] = {
                      ...updatedCart[indexInCart],
                      discountedPrice: dealDiscFormatted,
                      originalPrice: dealOrigFormatted,
                      discountPercent: deal.discountPercentage,
                    };
                    cartChanged = true;
                  }
                }
              } else if (vendorServices.length > 0) {
                if (!updatedCart[indexInCart].isExpired) {
                  updatedCart[indexInCart] = {
                    ...updatedCart[indexInCart],
                    isExpired: true,
                    isActive: false,
                  };
                  cartChanged = true;
                }
              }
            }
          });
        } catch (err) {
          console.warn('Could not verify service prices with backend:', err);
          itemsByBusiness[bId].forEach((cartItem) => {
            const cartItemId = cartItem.id || cartItem.vendorServiceId || cartItem._id;
            const deal = DEALS.find((d) => String(d.id) === String(cartItemId));
            if (deal && deal.isActive === false) {
              const indexInCart = updatedCart.findIndex(
                (ci) => String(ci.id || ci.vendorServiceId || ci._id) === String(cartItemId)
              );
              if (indexInCart !== -1 && !updatedCart[indexInCart].isExpired) {
                updatedCart[indexInCart] = {
                  ...updatedCart[indexInCart],
                  isExpired: true,
                  isActive: false,
                };
                cartChanged = true;
              }
            }
          });
        }
      }

      if (isMounted && cartChanged) {
        saveCart(updatedCart);
        setItems(updatedCart);
      }
    };

    checkPricesAndStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleIncrement = (id) => {
    const item = safeItems.find(
      (i) =>
        String(i.id) === String(id) ||
        String(i.vendorServiceId) === String(id) ||
        String(i._id) === String(id)
    );
    const targetId = item?.id || id;
    const currentQty = Number(item?.quantity) || 1;
    const updated = updateQuantity(targetId, currentQty + 1);
    setItems(Array.isArray(updated) ? updated : []);
  };

  const handleDecrement = (id) => {
    const item = safeItems.find(
      (i) =>
        String(i.id) === String(id) ||
        String(i.vendorServiceId) === String(id) ||
        String(i._id) === String(id)
    );
    const targetId = item?.id || id;
    const currentQty = Number(item?.quantity) || 1;
    let updated;
    if (currentQty > 1) {
      updated = updateQuantity(targetId, currentQty - 1);
      setItems(Array.isArray(updated) ? updated : []);
    } else {
      updated = removeFromCart(targetId);
      if (safeItems.length === 1 && item) {
        const businessId = item.businessId || item.vendorId || item.vendorSlug || 'b1';
        navigate(`/business/${businessId}`);
      } else {
        setItems(Array.isArray(updated) ? updated : []);
      }
    }
  };

  const handleRemove = (id) => {
    const item = safeItems.find(
      (i) =>
        String(i.id) === String(id) ||
        String(i.vendorServiceId) === String(id) ||
        String(i._id) === String(id)
    );
    const targetId = item?.id || id;
    const updated = removeFromCart(targetId);
    if (safeItems.length === 1 && item) {
      const businessId = item.businessId || item.vendorId || item.vendorSlug || 'b1';
      navigate(`/business/${businessId}`);
    } else {
      setItems(Array.isArray(updated) ? updated : []);
    }
  };

  const handleCheckout = async (appliedCode, customDate = null, customTime = null) => {
    // 1. Authentication check
    const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      showAlert({
        type: 'error',
        message: 'برای ادامه فرایند پرداخت، لطفاً ابتدا وارد حساب کاربری خود شوید.',
        duration: 3000,
      });
      sessionStorage.setItem('redirect_after_login', '/cart');
      navigate('/login', { state: { fromCheckout: true } });
      return;
    }

    // 2. Validate Cart Items
    if (safeItems.length === 0) {
      showAlert({
        type: 'error',
        message: 'سبد خرید شما خالی است.',
        duration: 3000,
      });
      return;
    }

    const finalDate = customDate || selectedDate;
    const finalTime = customTime || selectedTimeRange;

    // 3. Prepare payload format with preferred visit date & time
    const visitDateString = finalDate?.formattedPersian || finalDate?.isoJalali || 'ثبت شده';
    const visitTimeRangeString = finalTime?.canonical || '09:00-12:00';

    const payloadItems = safeItems.map((item) => ({
      id: item.id || item.serviceId || item._id,
      quantity: Number(item.quantity) || 1,
      preferredVisitDate: visitDateString,
      preferredVisitTimeRange: visitTimeRangeString,
    }));

    const payload = {
      items: payloadItems,
      preferredVisitDate: visitDateString,
      preferredVisitTimeRange: visitTimeRangeString,
    };

    if (appliedCode && typeof appliedCode === 'string' && appliedCode.trim() !== '') {
      payload.discountCode = appliedCode.trim();
    }

    setIsSubmittingPayment(true);

    try {
      const res = await paymentService.createPayment(payload);
      setIsSubmittingPayment(false);

      if (res?.data?.status === 'success' || res?.data?.data?.paymentLink) {
        const paymentData = res?.data?.data;
        const paymentLink = paymentData?.paymentLink;

        if (paymentLink) {
          window.location.href = paymentLink;
        }
      } else {
        const errorMsg = res?.data?.message || 'خطا در ساخت لینک پرداخت';
        showAlert({ type: 'error', message: errorMsg, duration: 3000 });
      }
    } catch (err) {
      setIsSubmittingPayment(false);
      const errorMsg =
        err?.response?.data?.message ||
        'خطا در ساخت لینک پرداخت. لطفاً مجدداً تلاش کنید.';
      showAlert({ type: 'error', message: errorMsg, duration: 3000 });
    }
  };

  const handleProceedToPayment = async (date, time) => {
    setSelectedDate(date);
    setSelectedTimeRange(time);
    setIsVisitTimeDrawerOpen(false);
    await handleCheckout(appliedDiscount?.code || '', date, time);
  };

  const parseNum = (val) => {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (typeof val === 'string') {
      const cleaned = val
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[^0-9]/g, '');
      const num = parseInt(cleaned, 10);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Filter active items for summary
  const activeItems = safeItems.filter(
    (i) => !i.isExpired && i.isActive !== false && i.active !== false
  );

  const totalOriginalNum = activeItems.reduce((acc, item) => {
    const qty = Number(item?.quantity) || 1;
    const orig =
      item?.originalPriceVal !== undefined
        ? Number(item.originalPriceVal) || 0
        : parseNum(item?.originalPrice);
    return acc + orig * qty;
  }, 0);

  const totalDiscountedNum = activeItems.reduce((acc, item) => {
    const qty = Number(item?.quantity) || 1;
    const disc =
      item?.discountedPriceVal !== undefined
        ? Number(item.discountedPriceVal) || 0
        : parseNum(item?.discountedPrice);
    return acc + disc * qty;
  }, 0);

  const totalDiscountNum = Math.max(0, totalOriginalNum - totalDiscountedNum);

  const summaryData = {
    totalOriginal: formatPrice(totalOriginalNum),
    totalDiscount: formatPrice(totalDiscountNum),
    totalPayable: formatPrice(totalDiscountedNum),
  };

  const vendorGroups = useMemo(() => {
    const map = new Map();
    safeItems.forEach((item) => {
      const bId = String(item.businessId || item.vendorId || item.vendorSlug || item.vendor_id || item.salonId || 'b1');
      if (!map.has(bId)) {
        map.set(bId, {
          businessId: bId,
          vendorName: item.businessName || item.vendorTitle || item.vendorName || item.salonName || 'مجموعه زیبایی',
          vendorAddress: item.businessAddress || item.address || item.vendorAddress || item.location || '',
          vendorLogo: item.businessLogo || item.vendorLogo || item.logo,
          items: [],
        });
      }
      map.get(bId).items.push(item);
    });
    return Array.from(map.values());
  }, [safeItems]);

  return (
    <div dir="rtl" className="w-full max-w-md md:max-w-xl mx-auto px-3.5 py-3 flex flex-col font-kal-2 text-right">
      {safeItems.length === 0 ? (
        <EmptyState
          type="cart"
          badgeText="سبد خرید شما"
          title="سبد خرید شما خالی است!"
          description="هنوز هیچ خدمات تخفیف‌داری به سبد خرید اضافه نکرده‌اید. برترین پیشنهادهای زیبایی را بررسی و رزرو کنید."
          actionLabel="مشاهده پیشنهادهای تخفیف‌دار"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="space-y-3.5 pb-[170px]">
          {/* 1. Cart Items Cards Grouped by Vendor */}
          <div className="space-y-3.5">
            {vendorGroups.map((group) => (
              <CartItemCard
                key={group.businessId}
                group={group}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* 2. Cart Summary & Discount Code Card */}
          <CartSummary
            items={items}
            summaryData={summaryData}
            onCheckout={handleCheckout}
            onOpenVisitDrawer={() => setIsVisitTimeDrawerOpen(true)}
            isSubmittingPayment={isSubmittingPayment}
            appliedDiscount={appliedDiscount}
            setAppliedDiscount={setAppliedDiscount}
          />

          {/* 3. Preferred Visit Date & Time Vaul Drawer */}
          <VisitTimeDrawer
            isOpen={isVisitTimeDrawerOpen}
            setIsOpen={setIsVisitTimeDrawerOpen}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeRange={selectedTimeRange}
            setSelectedTimeRange={setSelectedTimeRange}
            onProceedToPayment={handleProceedToPayment}
            isSubmittingPayment={isSubmittingPayment}
          />
        </div>
      )}
    </div>
  );
}

export default CartMain;
