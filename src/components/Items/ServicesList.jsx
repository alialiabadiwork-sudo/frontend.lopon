import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice } from '@utils/formatters';
import { normalizeImageUrl } from '@utils/imageUtils';

// Sub-component for individual service item row
function ServiceItemRow({ service, qty, onAddToCart, onRemoveFromCart, onImageClick }) {
  const [imgError, setImgError] = useState(false);
  const rawImg = service.imageUrl || service.image;
  const hasImage = Boolean(
    rawImg &&
    typeof rawImg === 'string' &&
    rawImg.trim().length > 0 &&
    !rawImg.includes('header.webp')
  );
  const serviceImgUrl = hasImage ? normalizeImageUrl(rawImg, 'service') : null;
  const showImage = hasImage && !imgError && serviceImgUrl;

  const origPrice = Number(service.originalPrice || 0);
  const discPrice = Number(service.discountedPrice || 0);
  const discPct = Number(service.discountPercent || 0);
  const hasDiscount =
    origPrice > 0 &&
    discPrice > 0 &&
    origPrice > discPrice &&
    (discPct > 0 || origPrice !== discPrice);
  const displayPrice = hasDiscount ? discPrice : (origPrice || discPrice);

  return (
    <div className="flex items-center justify-between py-2.5 gap-3">
      {/* Right side: Clickable rounded visual thumbnail or Disabled Gray Placeholder + Product Name */}
      <div className="flex-1 flex items-center gap-3 text-right min-w-0">
        {showImage ? (
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 relative cursor-pointer border border-slate-100 shadow-2xs active:scale-95 transition-all group bg-slate-50"
            onClick={() => onImageClick(serviceImgUrl, service.name, service.images, service)}
          >
            <img
              src={serviceImgUrl}
              alt={service.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
          </div>
        ) : (
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 relative bg-slate-100/90 border border-slate-200/70 flex flex-col items-center justify-center text-slate-400 select-none shadow-2xs cursor-default"
            title="تصویری برای این خدمت ثبت نشده است"
          >
            <ImageIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-slate-400 stroke-[1.6]" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] sm:text-[14px] font-kal-3 font-bold text-slate-800 leading-snug break-words">
            {service.name}
          </h3>
        </div>
      </div>

      {/* Left side: Prices & Add Button container */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <div className="flex flex-col items-end justify-center text-left leading-tight shrink-0">
          {hasDiscount && (
            <div className="relative inline-block text-[11px] font-kal-2 font-normal text-slate-400 leading-tight">
              <span>{formatPrice(origPrice)}</span>
              <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
                <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="#94a3b8" strokeWidth="1.5" />
              </svg>
            </div>
          )}
          <span className="flex items-center gap-0.5 text-[13.5px] sm:text-[14.5px] font-kal-3 font-bold text-slate-800 leading-tight">
            {formatPrice(displayPrice)}
            <div className="flex flex-col items-center justify-center leading-none text-slate-400 font-kal-2 select-none shrink-0 ms-0.5">
              <span className="text-[6.5px] font-normal leading-none mb-[1px]">ن</span>
              <span className="text-[7.5px] font-normal leading-none">تـوما</span>
            </div>
          </span>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          {qty > 0 ? (
            <div className="flex items-center justify-between w-[86px] sm:w-[92px] h-[36px] sm:h-[38px] bg-orange-50 border border-orange-200 rounded-[10px] px-1.5 font-kal-2">
              <button
                id={`inc-${service.id}`}
                type="button"
                onClick={() => onAddToCart(service.id)}
                className="w-7 h-7 flex items-center justify-center bg-[#F47A20] hover:bg-[#d66311] text-white rounded-md cursor-pointer active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <span className="text-sm font-kal-3 font-bold text-slate-800 select-none px-1">
                {qty}
              </span>
              <button
                id={`dec-${service.id}`}
                type="button"
                onClick={() => onRemoveFromCart(service.id)}
                className="w-7 h-7 flex items-center justify-center bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-md cursor-pointer active:scale-95 shrink-0"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              id={`add-btn-${service.id}`}
              type="button"
              onClick={() => onAddToCart(service.id)}
              className="w-[86px] sm:w-[92px] h-[36px] sm:h-[38px] bg-[#F47A20] hover:bg-[#d66311] text-white text-xs sm:text-sm font-kal-3 font-bold rounded-[10px] transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
            >
              افزودن
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// Dashed Divider line between service items
const DashedDivider = () => (
  <div className="w-full pt-1.5 pb-1 h-[1px] flex items-center">
    <svg className="w-full h-[2px] overflow-visible" preserveAspectRatio="none">
      <line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke="#e2e8f0"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export default function ServicesList({
  services = [],
  cart = {},
  onAddToCart,
  onRemoveFromCart,
  onOpenTermsModal,
  onImageClick,
}) {
  const [showOtherServices, setShowOtherServices] = useState(false);

  // Initial 4 services are always visible, remaining are expanded with smooth animation
  const initialServices = services.slice(0, 4);
  const extraServices = services.slice(4);
  const hasMoreServices = extraServices.length > 0;

  const handleImageClick = (img, title, images, service) => {
    if (onImageClick) {
      onImageClick(img, title, images, service);
    }
  };

  return (
    <div id="services-list-section" className="relative mx-4 z-20 filter drop-shadow-[0_8px_20px_rgba(15,23,42,0.08)]" dir="rtl">
      <div
        className="bg-white rounded-[16px] border border-slate-100/80 p-4 pt-4 px-4"
        style={{
          WebkitMaskImage: `
            radial-gradient(circle 9px at 0px 52px, transparent 8.5px, black 9px),
            radial-gradient(circle 9px at 100% 52px, transparent 8.5px, black 9px)
          `,
          maskImage: `
            radial-gradient(circle 9px at 0px 52px, transparent 8.5px, black 9px),
            radial-gradient(circle 9px at 100% 52px, transparent 8.5px, black 9px)
          `,
          WebkitMaskComposite: 'destination-in',
          maskComposite: 'intersect',
        }}
      >
        {/* Services Header: 'خدمات:' on Right, 'شرایط استفاده' on Left */}
        <div className="flex justify-between items-center h-[36px] px-1 mb-2">
          {/* Right side (RTL first child): Title 17px normal */}
          <h2 className="text-[17px] font-kal-3 font-medium text-slate-800 tracking-tight">
            خدمات:
          </h2>

          {/* Left side (RTL second child): Terms trigger with ChevronLeft on the left */}
          <button
            id="terms-conditions-btn"
            type="button"
            onClick={onOpenTermsModal}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-kal-2 font-normal cursor-pointer transition-colors"
          >
            <span>شرایط استفاده</span>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Punch Card Top Divider */}
        <div className="w-full px-1 mb-4 h-[1px] flex items-center">
          <svg className="w-full h-[2px] overflow-visible" preserveAspectRatio="none">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="15 10"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Initial Always-Visible Services List */}
        <div className="space-y-1">
          {initialServices.map((service, index) => (
            <div key={service.id} className="text-right">
              <ServiceItemRow
                service={service}
                qty={cart[service.id] || 0}
                onAddToCart={onAddToCart}
                onRemoveFromCart={onRemoveFromCart}
                onImageClick={handleImageClick}
              />
              {(index < initialServices.length - 1 || (showOtherServices && hasMoreServices)) && (
                <DashedDivider />
              )}
            </div>
          ))}

          {/* Smooth Expanding Extra Services */}
          <AnimatePresence initial={false}>
            {showOtherServices && (
              <motion.div
                key="extra-services-container"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pt-0">
                  {extraServices.map((service, index) => (
                    <div key={service.id} className="text-right">
                      <ServiceItemRow
                        service={service}
                        qty={cart[service.id] || 0}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                        onImageClick={handleImageClick}
                      />
                      {index < extraServices.length - 1 && <DashedDivider />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Services Button with smooth animated chevron */}
        {hasMoreServices && (
          <button
            id="other-services-btn"
            type="button"
            onClick={() => setShowOtherServices(!showOtherServices)}
            className="w-full py-2.5 mt-4 border border-slate-700 rounded-[8px] text-xs font-kal-2 font-normal text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
          >
            <span>{showOtherServices ? 'بستن خدمات' : 'سایر خدمات'}</span>
            <motion.div
              animate={{ rotate: showOtherServices ? 180 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-slate-600" />
            </motion.div>
          </button>
        )}
      </div>
    </div>
  );
}