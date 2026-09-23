/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRegisterModal } from '@core/backButtonManager';
import { normalizeImageUrl, getCanonicalImageKey } from '@utils/imageUtils';

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

export default function ImageGalleryModal({
  isOpen,
  onClose,
  title = 'گالری تصاویر',
  images = [],
  initialIndex = 0,
  onIndexChange,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
  const [direction, setDirection] = useState(0);
  const thumbnailsRef = useRef(null);

  // Extract and normalize image list with strict canonical deduplication
  const inputList = Array.isArray(images) && images.length > 0 ? images : [];
  const seenKeys = new Set();
  const cleanImages = [];

  for (const item of inputList) {
    if (!item || typeof item !== 'string' || item.includes('header.webp')) continue;
    const normalized = normalizeImageUrl(item, 'vendor-service');
    const key = getCanonicalImageKey(normalized);
    if (key && !seenKeys.has(key)) {
      seenKeys.add(key);
      cleanImages.push(normalized);
    }
  }

  const finalImages = cleanImages;
  const activeImage = finalImages[currentIndex] || finalImages[0];
  const imagesKey = finalImages.join('|');

  // Reset index when modal opens or images change
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.min(Math.max(0, initialIndex || 0), Math.max(0, finalImages.length - 1));
      setCurrentIndex(validIndex);
      setDirection(0);
    }
  }, [isOpen, imagesKey, initialIndex, finalImages.length]);

  // Keep index within bounds if array size changes
  useEffect(() => {
    if (currentIndex >= finalImages.length) {
      setCurrentIndex(0);
    }
  }, [finalImages.length, currentIndex]);

  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentIndex(newIndex);
      if (onIndexChange) onIndexChange(newIndex);
    },
    [onIndexChange]
  );

  // Register modal with global back button manager (closes modal on Back button without navigating away)
  useRegisterModal(isOpen, () => {
    if (onClose) onClose();
  });

  // Prevent body scrolling while fullscreen modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Smoothly scroll active thumbnail into center of thumbnail strip
  useEffect(() => {
    if (isOpen && thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex];
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex, isOpen]);

  // Navigation handlers with inverted slide direction for Persian RTL preference
  const handleNext = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      setDirection(-1);
      handleIndexChange((currentIndex + 1) % finalImages.length);
    },
    [currentIndex, finalImages.length, handleIndexChange]
  );

  const handlePrev = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      setDirection(1);
      handleIndexChange((currentIndex - 1 + finalImages.length) % finalImages.length);
    },
    [currentIndex, finalImages.length, handleIndexChange]
  );

  const handleSelectIndex = (idx, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (idx === currentIndex) return;
    setDirection(idx > currentIndex ? -1 : 1);
    handleIndexChange(idx);
  };

  const handleClose = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (onClose) onClose();
    },
    [onClose]
  );

  // Keyboard navigation for fullscreen gallery
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose, handleNext, handlePrev]);

  if (!isOpen || !finalImages.length || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[99999] bg-black/95 sm:bg-black/98 backdrop-blur-2xl flex flex-col overflow-hidden h-[100dvh] w-screen max-w-full select-none box-border cursor-default font-kal-2 m-0 p-0"
      dir="rtl"
      onClick={handleClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full shrink-0 border-b border-white/10 bg-black/50 backdrop-blur-md z-30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 pr-1">
            <span className="text-white font-extrabold text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
            <span className="text-[11px] font-bold text-slate-200 bg-white/15 px-2.5 py-0.5 rounded-full shrink-0 border border-white/15">
              {toPersianDigits(currentIndex + 1)} از {toPersianDigits(finalImages.length)}
            </span>
          </div>

          <button
            id="close-gallery-modal-btn"
            type="button"
            onClick={handleClose}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 active:scale-90 text-white rounded-full transition-all cursor-pointer backdrop-blur-md border border-white/15 shrink-0 shadow-sm"
            title="بستن"
            aria-label="بستن گالری"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage (flex-1 min-h-0 so it never overflows or pushes the thumbnails) */}
      <div
        className="relative flex-1 min-h-0 w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden px-2 sm:px-6 py-2 cursor-pointer z-20"
        onClick={handleClose}
      >
        {/* Prev Arrow Button (Desktop / Tablet) */}
        {finalImages.length > 1 && (
          <button
            id="gallery-modal-slide-prev"
            type="button"
            onClick={handlePrev}
            className="absolute right-3 sm:right-6 z-30 hidden sm:flex items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-black/60 hover:bg-[#F47A20] active:scale-90 text-white rounded-full transition-all backdrop-blur-md border border-white/20 cursor-pointer shadow-xl"
            title="تصویر قبلی"
            aria-label="تصویر قبلی"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}

        {/* Centered Image Slide Stage with absolute containment */}
        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`gallery-slide-${currentIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                const swipeThreshold = 35;
                const velocityThreshold = 250;
                if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
                  handlePrev();
                } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
                  handleNext();
                }
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none p-1 sm:p-2"
            >
              <img
                src={activeImage}
                alt={`${title} - عکس ${currentIndex + 1}`}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 select-none pointer-events-none"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Arrow Button (Desktop / Tablet) */}
        {finalImages.length > 1 && (
          <button
            id="gallery-modal-slide-next"
            type="button"
            onClick={handleNext}
            className="absolute left-3 sm:left-6 z-30 hidden sm:flex items-center justify-center w-11 h-11 md:w-12 md:h-12 bg-black/60 hover:bg-[#F47A20] active:scale-90 text-white rounded-full transition-all backdrop-blur-md border border-white/20 cursor-pointer shadow-xl"
            title="تصویر بعدی"
            aria-label="تصویر بعدی"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Compact Thumbnails Strip */}
      {finalImages.length > 1 && (
        <div
          className="w-full shrink-0 border-t border-white/10 bg-black/60 backdrop-blur-md z-30 cursor-default py-2 sm:py-2.5 px-3"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={thumbnailsRef}
            className={`w-full max-w-xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth snap-x ${
              finalImages.length <= 6 ? 'justify-center' : 'justify-start sm:justify-center'
            }`}
          >
            {finalImages.map((thumbUrl, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`thumb-${thumbUrl}-${idx}`}
                  id={`gallery-thumb-btn-${idx}`}
                  type="button"
                  onClick={(e) => handleSelectIndex(idx, e)}
                  className={`relative w-11 h-11 sm:w-13 sm:h-13 aspect-square shrink-0 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-200 snap-center ${
                    isActive
                      ? 'ring-2 ring-[#F47A20] ring-offset-2 ring-offset-black scale-105 opacity-100 shadow-md shadow-[#F47A20]/40 z-10'
                      : 'opacity-40 hover:opacity-85 scale-95 border border-white/15'
                  }`}
                  title={`مشاهده تصویر ${idx + 1}`}
                  aria-label={`مشاهده تصویر ${idx + 1}`}
                >
                  <img
                    src={thumbUrl}
                    alt={`بند انگشتی ${idx + 1}`}
                    className="w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {isActive && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#F47A20] shadow-xs" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
