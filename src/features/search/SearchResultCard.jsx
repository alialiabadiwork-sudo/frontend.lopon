import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { Star, Image as ImageIcon, Store } from 'lucide-react';
import { normalizeImageUrl } from '@utils/imageUtils';
import { getShortBusinessUrl } from '@utils/slugUtils';
import { cleanDealAddress } from '@components/Items/DealCard';

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export default function SearchResultCard({ item }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const isService = item.resultType === 'service';
  const rawImage = item.imageUrl || item.image;
  const hasImage = Boolean(
    rawImage &&
    typeof rawImage === 'string' &&
    rawImage.trim().length > 0 &&
    !rawImage.includes('header.webp')
  );

  const normalizedImage = hasImage
    ? normalizeImageUrl(rawImage, isService ? 'vendor-service' : 'vendor')
    : null;

  const showImage = hasImage && !imgError && normalizedImage;

  // Clean address
  const cleanAddress = cleanDealAddress(item.address || item.city || 'کرمان');

  // Subtitle formatting (matching design: حضوری | زیبایی و آرایشی or Vendor | Category)
  const categoryName = item.categoryTitle || 'زیبایی و آرایشی';
  const subtitle = isService && item.vendorTitle
    ? `${item.vendorTitle} | ${categoryName}`
    : `حضوری | ${categoryName}`;

  // Rating formatting
  const rawRating = item.rating || 4.8;
  const formattedRating = toPersianDigits(
    Number.isInteger(rawRating) ? rawRating.toString() : rawRating.toFixed(1)
  );

  // Discount
  const hasDiscount = Boolean(item.hasDiscount && item.discountPercent > 0);
  const discountPercentStr = toPersianDigits(item.discountPercent);

  const handleClick = () => {
    const targetUrl = isService
      ? getShortBusinessUrl(item.vendorId, item.vendorTitle, item.vendorServiceId, item.title)
      : getShortBusinessUrl(item.vendorId, item.vendorTitle);

    navigate(targetUrl, {
      state: {
        selectedServiceId: item.vendorServiceId,
        selectedImage: normalizedImage,
        serviceTitle: item.title,
      },
    });
  };

  return (
    <div
      onClick={handleClick}
      dir="rtl"
      className="w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md active:scale-[0.99] transition-all flex items-center justify-between gap-3 cursor-pointer select-none text-right group"
    >
      {/* Right Side in RTL: Image Thumbnail or Placeholder */}
      <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-3xs shrink-0 flex items-center justify-center">
        {showImage ? (
          <img
            src={normalizedImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 select-none">
            {isService ? (
              <ImageIcon className="w-6 h-6 text-slate-400 stroke-[1.6]" />
            ) : (
              <Store className="w-6 h-6 text-slate-400 stroke-[1.6]" />
            )}
          </div>
        )}
      </div>

      {/* Middle in RTL: Details (Title, Subtitle, Location) */}
      <div className="flex flex-col justify-between self-stretch flex-1 min-w-0 py-0.5">
        {/* Title */}
        <h3 className="font-kal-3 font-bold text-slate-900 text-[14.5px] sm:text-[15px] leading-snug line-clamp-1 group-hover:text-[#F47A20] transition-colors">
          {item.title}
        </h3>

        {/* Subtitle */}
        <p className="text-[11.5px] sm:text-xs text-slate-500 font-kal-2 mt-0.5 line-clamp-1">
          {subtitle}
        </p>

        {/* Address with Pin Icon */}
        <div className="flex items-center gap-1 mt-1 text-slate-600">
          <FiMapPin size={12} className="text-slate-400 shrink-0 stroke-[2.2]" />
          <span className="text-[11px] sm:text-xs font-kal-2 text-slate-600 line-clamp-1">
            {cleanAddress || 'کرمان'}
          </span>
        </div>
      </div>

      {/* Left Side in RTL: Rating at top, Discount Pill at bottom */}
      <div className="flex flex-col justify-between items-end self-stretch shrink-0 py-0.5 pl-0.5">
        {/* Rating Row (e.g. ۵ ⭐) */}
        <div className="flex items-center gap-1 text-[13px] font-bold font-kal-3 text-slate-700">
          <span>{formattedRating}</span>
          <Star size={14} className="fill-amber-400 text-amber-400" />
        </div>

        {/* Discount Badge Pill (e.g. ٪۴۵ تخفیف) */}
        {hasDiscount ? (
          <div className="bg-[#FFF0F3] text-[#E11D48] border border-rose-100/80 rounded-full px-2.5 py-0.5 text-[11px] sm:text-[12px] font-bold font-kal-3 flex items-center justify-center shadow-3xs">
            <span>٪{discountPercentStr} تخفیف</span>
          </div>
        ) : (
          <div className="h-5" />
        )}
      </div>
    </div>
  );
}
