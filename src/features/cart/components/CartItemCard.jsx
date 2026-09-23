import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus, FiAlertCircle } from 'react-icons/fi';
import { LuTrash2 } from 'react-icons/lu';
import { ChevronLeft, Store, Image as ImageIcon } from 'lucide-react';
import { normalizeImageUrl } from '@utils/imageUtils';

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export const TomanBadge = ({ className = 'text-slate-400' }) => (
  <div className={`inline-flex flex-col items-center justify-center leading-none select-none shrink-0 ${className}`}>
    <span className="text-[7.5px] font-normal leading-none mb-[1px]">ن</span>
    <span className="text-[8.5px] font-normal leading-none">تـوما</span>
  </div>
);

function ServiceItemRow({ item, businessId, onIncrement, onDecrement, onRemove }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const quantity = Number(item.quantity) || 1;
  const itemId = item.id || item.vendorServiceId || item._id;
  const rawImage = item.image || item.imageUrl;
  const hasImage = Boolean(
    rawImage &&
    typeof rawImage === 'string' &&
    rawImage.trim().length > 0 &&
    !rawImage.includes('header.webp')
  );
  const itemImage = hasImage ? normalizeImageUrl(rawImage, 'vendor-service') : null;
  const showImage = hasImage && !imgError && itemImage;
  const expired = item.isExpired || item.isActive === false || item.active === false;

  // Auto-remove item from cart 5 seconds after expired state triggers
  useEffect(() => {
    if (expired) {
      const timer = setTimeout(() => {
        if (onRemove) {
          onRemove(itemId);
        } else if (onDecrement) {
          for (let i = 0; i < quantity; i++) {
            onDecrement(itemId);
          }
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [expired, itemId, quantity, onRemove, onDecrement]);

  const handleItemClick = (e) => {
    if (expired) return;
    if (e.target.closest('button') || e.target.closest('.quantity-controls')) {
      return;
    }
    navigate(`/business/${businessId}?serviceId=${itemId}`);
  };

  if (expired) {
    return (
      <div className="pt-2 flex flex-col gap-2.5 transition-all grayscale opacity-80 select-none font-kal-2 text-right">
        <div className="flex justify-between items-center gap-3.5">
          {/* Image on Right in RTL */}
          <div className="w-[80px] h-[64px] rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 flex items-center justify-center">
            {showImage ? (
              <img
                src={itemImage}
                alt={item.title}
                className="w-full h-full object-cover filter grayscale opacity-60"
                onError={() => setImgError(true)}
              />
            ) : (
              <ImageIcon className="w-5 h-5 text-slate-400 stroke-[1.6]" />
            )}
          </div>

          <div className="flex flex-col justify-between items-start self-stretch min-w-0 flex-1 py-0.5 text-right">
            <div className="w-full">
              <h3 className="font-kal-3 font-medium text-slate-500 text-[14px] leading-snug line-clamp-2 line-through">
                {item.title}
              </h3>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span className="font-kal-3 font-bold text-slate-400 text-[13.5px] line-through">
                {item.discountedPrice}
              </span>
              <TomanBadge className="text-slate-400" />
            </div>
          </div>
        </div>

        <div className="w-full bg-red-50/90 border border-red-200/90 rounded-xl p-2.5 flex flex-col gap-1 text-right">
          <div className="flex items-center justify-between text-[11.5px] font-kal-3 font-medium text-red-600">
            <span className="flex items-center gap-1.5">
              <FiAlertCircle size={15} className="shrink-0 text-red-500" />
              <span>خدمات این سرویس به پایان رسیده است</span>
            </span>
            <span className="text-[10.5px] text-slate-400 font-kal-2">حذف از سبد...</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-0.5">
            <div className="bg-red-500 h-full animate-fill-progress" />
          </div>
        </div>
      </div>
    );
  }

  // Price calculations
  const rawPct = Number(item.discountPercent || 60);
  const origVal = item.originalPriceVal !== undefined ? Number(item.originalPriceVal) : null;
  const discVal = item.discountedPriceVal !== undefined ? Number(item.discountedPriceVal) : null;

  const hasDiscount =
    rawPct > 0 &&
    item.originalPrice &&
    item.discountedPrice &&
    item.originalPrice !== item.discountedPrice &&
    (origVal !== null && discVal !== null ? origVal > discVal : true);

  const displayPrice = hasDiscount ? item.discountedPrice : (item.discountedPrice || item.originalPrice);

  return (
    <div
      onClick={handleItemClick}
      className="pt-1 flex items-start gap-3.5 justify-between cursor-pointer"
    >
      {/* Child 1 (RIGHT in RTL): Service Thumbnail Image or Placeholder */}
      <div className="shrink-0">
        {showImage ? (
          <div className="w-[84px] h-[84px] sm:w-[90px] sm:h-[90px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-3xs">
            <img
              src={itemImage}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-[84px] h-[84px] sm:w-[90px] sm:h-[90px] rounded-2xl overflow-hidden bg-slate-100/90 border border-slate-200/80 shadow-3xs flex items-center justify-center text-slate-400 select-none">
            <ImageIcon className="w-6 h-6 text-slate-400 stroke-[1.6]" />
          </div>
        )}
      </div>

      {/* Child 2 (LEFT of Image in RTL): Title at top, Quantity Pill & Price at bottom */}
      <div className="flex flex-col justify-between self-stretch flex-1 min-w-0 text-right">
        {/* Item Title */}
        <h3 className="font-kal-3 font-bold text-slate-800 text-[14px] leading-snug line-clamp-2">
          {item.title}
        </h3>

        {/* Bottom Row: Quantity Controls & Price Section */}
        <div className="mt-3 flex items-end justify-between gap-2">
          {/* Quantity Pill Counter (Right of bottom sub-row / Child 2.1) */}
          <div className="quantity-controls h-[38px] w-[102px] flex items-center justify-between border border-slate-300 rounded-2xl px-2 bg-white shadow-3xs text-slate-700">
            <button
              id={`cart-inc-${itemId}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onIncrement?.(itemId);
              }}
              className="w-7 h-7 flex items-center justify-center text-slate-700 hover:text-[#F47A20] active:scale-95 transition-colors cursor-pointer"
              aria-label="افزایش"
            >
              <FiPlus size={16} />
            </button>

            <span className="font-kal-3 font-bold text-slate-900 text-[15px] min-w-3 text-center select-none">
              {toPersianDigits(quantity)}
            </span>

            <button
              id={`cart-dec-${itemId}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement?.(itemId);
              }}
              className={`w-7 h-7 flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${quantity <= 1 ? 'text-red-500 hover:text-red-700' : 'text-slate-700 hover:text-red-500'
                }`}
              aria-label={quantity <= 1 ? 'حذف' : 'کاهش'}
              title={quantity <= 1 ? 'حذف از سبد' : 'کاهش تعداد'}
            >
              {quantity <= 1 ? <LuTrash2 size={15} /> : <FiMinus size={16} />}
            </button>
          </div>

          {/* Price Column on Far Left (Child 2.2) */}
          <div className="flex flex-col items-start text-right">
            {/* Row 1: Red discount badge + Crossed original price */}
            {hasDiscount && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="flex justify-center items-center bg-[#f43f5e] min-w-[34px] h-[19px] text-white text-[10.5px] font-bold px-1.5 rounded-full font-kal-3">
                  {toPersianDigits(rawPct)}%
                </span>
                <div className="relative inline-block text-[12.5px] text-slate-400 font-kal-2">
                  <span>{item.originalPrice}</span>
                  <span className="absolute inset-0 flex items-center">
                    <span className="w-full h-px bg-slate-400 -rotate-[16deg]" />
                  </span>
                </div>
              </div>
            )}

            {/* Row 2: Final Price + stacked Toman icon */}
            <div className="flex items-center gap-1">
              <span className="font-kal-3 font-bold text-slate-900 text-[16px] sm:text-[17px]">
                {displayPrice}
              </span>
              <TomanBadge className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemCard({ group, item, onIncrement, onDecrement, onRemove }) {
  const navigate = useNavigate();

  // Normalize group data (support both group object or single item fallback)
  const businessId = group?.businessId || item?.businessId || item?.vendorId || item?.vendorSlug || 'b1';
  const vendorName = group?.vendorName || item?.businessName || item?.vendorTitle || item?.vendorName || item?.salonName || 'مجموعه زیبایی';
  const vendorAddress = group?.vendorAddress || item?.businessAddress || item?.address || item?.vendorAddress || item?.location || '';
  const vendorLogo = group?.vendorLogo || item?.businessLogo || item?.vendorLogo || item?.logo;
  const serviceItems = group?.items || (item ? [item] : []);

  const handleVendorClick = (e) => {
    e.stopPropagation();
    navigate(`/business/${businessId}`);
  };

  return (
    <div
      dir="rtl"
      className="bg-white border border-slate-200/80 rounded-[22px] p-4 shadow-2xs hover:shadow-xs transition-all font-kal-2 select-none text-right"
    >
      {/* 1. Vendor Header Row: Vendor Logo + Vendor Name & Address on RIGHT, Chevron on LEFT */}
      <div
        onClick={handleVendorClick}
        className="vendor-header flex items-center justify-between gap-3 pb-3 group cursor-pointer"
      >
        {/* Right side in RTL (Child 1): Square Logo & Vendor Info */}
        <div className="flex items-center gap-3 text-right min-w-0 flex-1">
          {/* Square Logo Box / Disabled Gray Placeholder */}
          <div className="w-12 h-12 rounded-2xl border border-slate-200/90 flex items-center justify-center bg-slate-100/90 shrink-0 shadow-3xs overflow-hidden">
            {vendorLogo ? (
              <img
                src={normalizeImageUrl(vendorLogo, 'vendor')}
                alt={vendorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full items-center justify-center bg-slate-100 text-slate-400 select-none ${
                vendorLogo ? 'hidden' : 'flex'
              }`}
              title="لوگوی مجموعه"
            >
              <Store className="w-5 h-5 text-slate-400 stroke-[1.8]" />
            </div>
          </div>

          <div className="flex flex-col min-w-0">
            <h4 className="font-kal-3 font-bold text-slate-800 text-[15px] truncate group-hover:text-[#F47A20] transition-colors">
              {vendorName}
            </h4>
            {vendorAddress ? (
              <p className="text-[12.5px] text-slate-400 font-kal-2 truncate mt-0.5">
                {vendorAddress}
              </p>
            ) : null}
          </div>
        </div>

        {/* Left side in RTL (Child 2): Chevron Left */}
        <div className="text-slate-400 group-hover:text-slate-600 transition-colors pl-1">
          <ChevronLeft className="w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* 2. List of Services for this Business */}
      <div className="space-y-3">
        {serviceItems.map((serviceItem, idx) => (
          <React.Fragment key={serviceItem.id || serviceItem.vendorServiceId || serviceItem._id || idx}>
            {/* Dashed Separator Line before each service */}
            <div
              className="h-[1px] w-full"
              style={{
                backgroundImage: 'linear-gradient(to right, #cbd5e1 50%, rgba(255,255,255,0) 0%)',
                backgroundSize: '12px 1px',
                backgroundRepeat: 'repeat-x',
              }}
            />

            <ServiceItemRow
              item={serviceItem}
              businessId={businessId}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default CartItemCard;
