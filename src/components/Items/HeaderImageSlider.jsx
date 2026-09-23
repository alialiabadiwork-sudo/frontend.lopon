/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Share2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SupportDrawer from '../global/Drawers/SupportDrawer';
import ImageGalleryModal from './ImageGalleryModal';
import HeaderWebp from '@assets/images/header.webp';
import { normalizeImageUrl, getCanonicalImageKey } from '@utils/imageUtils';
export { normalizeImageUrl, getCanonicalImageKey };

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

// Smooth and snappy slide transition variants for individual slides
const slideVariants = {
  enter: (direction) => ({
    x: direction >= 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction >= 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const slideTransition = {
  x: { type: 'tween', ease: [0.25, 1, 0.5, 1], duration: 0.26 },
  opacity: { duration: 0.18 },
};

export default function HeaderImageSlider({
  image,
  images = [],
  title = 'مجموعه لوپُن',
  isFullscreen: externalIsFullscreen,
  onFullscreenChange,
  currentIndex: externalCurrentIndex,
  onIndexChange,
}) {
  const navigate = useNavigate();
  const [isFullscreenState, setIsFullscreenState] = useState(externalIsFullscreen || false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [currentIndexState, setCurrentIndexState] = useState(externalCurrentIndex || 0);
  const [direction, setDirection] = useState(0);

  // Sync external controlled props if provided
  useEffect(() => {
    if (typeof externalIsFullscreen === 'boolean') {
      setIsFullscreenState(externalIsFullscreen);
    }
  }, [externalIsFullscreen]);

  useEffect(() => {
    if (typeof externalCurrentIndex === 'number') {
      setCurrentIndexState(externalCurrentIndex);
    }
  }, [externalCurrentIndex]);

  const isFullscreen = isFullscreenState;
  const currentIndex = currentIndexState;

  const setIsFullscreen = useCallback(
    (val) => {
      setIsFullscreenState(val);
      if (onFullscreenChange) onFullscreenChange(val);
    },
    [onFullscreenChange]
  );

  const setCurrentIndex = useCallback(
    (val) => {
      setCurrentIndexState((prev) => {
        const next = typeof val === 'function' ? val(prev) : val;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    },
    [onIndexChange]
  );

  const handleBack = (e) => {
    if (e) {
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
      if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleShare = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `مشاهده مجموعه ${title} در سامانه لوپُن`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch {
        // ignore
      }
    }
  };

  // Extract and normalize image list with strict canonical deduplication
  const inputList = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
  const seenKeys = new Set();
  const cleanImages = [];

  for (const item of inputList) {
    if (!item || typeof item !== 'string') continue;
    const normalized = normalizeImageUrl(item, 'vendor');
    const key = getCanonicalImageKey(normalized);
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      cleanImages.push(normalized);
    }
  }

  const finalImages = cleanImages.length > 0 ? cleanImages : [HeaderWebp];
  const activeImage = finalImages[currentIndex] || finalImages[0];
  const imagesKey = finalImages.join('|');

  // Reset index to 0 whenever images or title changes
  useEffect(() => {
    setCurrentIndex(0);
    setDirection(0);
  }, [imagesKey, title, setCurrentIndex]);

  // Keep index within bounds if array size changes
  useEffect(() => {
    if (currentIndex >= finalImages.length) {
      setCurrentIndex(0);
    }
  }, [finalImages.length, currentIndex, setCurrentIndex]);

  const openGalleryModal = useCallback(() => {
    setIsFullscreen(true);
  }, [setIsFullscreen]);

  // Navigation handlers with inverted slide direction for Persian RTL preference
  const handleNext = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      setDirection(-1);
      setCurrentIndex((prev) => (prev + 1) % finalImages.length);
    },
    [finalImages.length, setCurrentIndex]
  );

  const handlePrev = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      setDirection(1);
      setCurrentIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
    },
    [finalImages.length, setCurrentIndex]
  );

  const handleSelectIndex = (idx, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? -1 : 1);
    setCurrentIndex(idx);
  };

  return (
    <>
      {/* HEADER BANNER SLIDER */}
      <div
        id="header-image-slider-container"
        className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] max-w-full overflow-hidden bg-slate-950 select-none cursor-pointer"
        dir="rtl"
        onClick={openGalleryModal}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={`banner-slide-${currentIndex}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_, info) => {
              const swipeThreshold = 35;
              const velocityThreshold = 250;
              if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                handlePrev();
              } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                handleNext();
              }
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          >
            <img
              src={activeImage}
              alt={title}
              className="w-full h-full object-cover brightness-95 pointer-events-none"
              referrerPolicy="no-referrer"
              loading="eager"
              onError={(e) => {
                e.target.src = HeaderWebp;
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Visual gradient overlays */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Fluid Dynamic Pagination Dots */}
        {finalImages.length > 1 && (
          <div
            id="banner-slide-dots-container"
            className="absolute bottom-[87px] sm:bottom-[95px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-md transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {finalImages.map((_, idx) => {
              const total = finalImages.length;
              const isActive = idx === currentIndex;

              if (total <= 4) {
                return (
                  <button
                    key={`banner-dot-${idx}`}
                    id={`banner-dot-${idx}`}
                    type="button"
                    onClick={(e) => handleSelectIndex(idx, e)}
                    aria-label={`اسلاید ${idx + 1}`}
                    title={`اسلاید ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                      isActive
                        ? 'w-5 h-2 bg-[#F47A20] shadow-sm shadow-[#F47A20]/50'
                        : 'w-2 h-2 bg-white/60 hover:bg-white/95 scale-90 hover:scale-100'
                    }`}
                  />
                );
              }

              // Dynamic sliding window (Instagram style)
              let windowStart = 0;
              if (currentIndex <= 1) {
                windowStart = 0;
              } else if (currentIndex >= total - 2) {
                windowStart = total - 4;
              } else {
                windowStart = currentIndex - 1;
              }

              const distance = idx - windowStart;

              // Hide dots outside visible dynamic range
              if (distance < -1 || distance > 4) {
                return null;
              }

              // Tiny edge dots indicating continuation
              if (distance === -1 || distance === 4) {
                return (
                  <button
                    key={`banner-dot-${idx}`}
                    id={`banner-dot-${idx}`}
                    type="button"
                    onClick={(e) => handleSelectIndex(idx, e)}
                    aria-label={`اسلاید ${idx + 1}`}
                    title={`اسلاید ${idx + 1}`}
                    className="w-1 h-1 bg-white/30 rounded-full transition-all duration-300 cursor-pointer scale-75 opacity-50 shrink-0 hover:scale-100 hover:opacity-80"
                  />
                );
              }

              // Smaller boundary dots
              if ((distance === 0 && windowStart > 0) || (distance === 3 && windowStart + 3 < total - 1)) {
                return (
                  <button
                    key={`banner-dot-${idx}`}
                    id={`banner-dot-${idx}`}
                    type="button"
                    onClick={(e) => handleSelectIndex(idx, e)}
                    aria-label={`اسلاید ${idx + 1}`}
                    title={`اسلاید ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 focus:outline-none ${
                      isActive
                        ? 'w-4 h-1.5 bg-[#F47A20]'
                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                );
              }

              // Standard / Active dot
              return (
                <button
                  key={`banner-dot-${idx}`}
                  id={`banner-dot-${idx}`}
                  type="button"
                  onClick={(e) => handleSelectIndex(idx, e)}
                  aria-label={`اسلاید ${idx + 1}`}
                  title={`اسلاید ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 focus:outline-none ${
                    isActive
                      ? 'w-5 h-2 bg-[#F47A20] shadow-sm shadow-[#F47A20]/50'
                      : 'w-2 h-2 bg-white/70 hover:bg-white/95'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Bottom Left Corner: Photo count badge "از این عدد تا این عدد" */}
        {finalImages.length > 0 && (
          <button
            id="banner-image-count-badge"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openGalleryModal();
            }}
            className="absolute bottom-[96px] sm:bottom-[108px] left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-black/80 active:scale-95 backdrop-blur-md rounded-full border border-white/20 shadow-md text-white text-[11px] sm:text-xs font-kal-2 select-none transition-all cursor-pointer group"
            title="مشاهده تمام تصاویر"
            aria-label="مشاهده تمام تصاویر"
          >
            <span className="font-bold text-white group-hover:text-[#F47A20] transition-colors">
              {toPersianDigits(currentIndex + 1)}
            </span>
            <span className="text-white/60 text-[10px]">از</span>
            <span className="font-bold text-white/90">
              {toPersianDigits(finalImages.length)}
            </span>
          </button>
        )}

        {/* Top Right: Back Button (> chevron pointing right) */}
        <button
          id="header-back-btn"
          type="button"
          onClick={handleBack}
          className="absolute top-3.5 right-3.5 z-20 flex items-center justify-center w-11 h-11 bg-black/50 hover:bg-black/70 active:scale-90 text-white rounded-full transition-all backdrop-blur-md cursor-pointer border border-white/20 shadow-md"
          title="بازگشت"
          aria-label="بازگشت"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Top Left: Share Button */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
          <button
            id="header-share-btn"
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center w-11 h-11 bg-black/50 hover:bg-black/70 active:scale-90 text-white rounded-full transition-all backdrop-blur-md cursor-pointer border border-white/20 shadow-md"
            title="اشتراکگذاری"
            aria-label="اشتراکگذاری"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Toast Alert when Link is Copied */}
        <AnimatePresence>
          {copiedToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-black/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 pointer-events-none font-kal-2"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>لینک مجموعه کپی شد</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reusable Fullscreen Gallery Modal */}
      <ImageGalleryModal
        isOpen={isFullscreen}
        onClose={() => setIsFullscreen(false)}
        title={title}
        images={finalImages}
        initialIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      <SupportDrawer isOpen={isSupportOpen} setIsOpen={setIsSupportOpen} />
    </>
  );
}
