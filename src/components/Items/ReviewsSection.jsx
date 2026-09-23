import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Star, User, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRegisterModal } from '@core/backButtonManager';

const toPersianDigits = (num) => {
  return String(num).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
};

const getRatingLabel = (score) => {
  switch (score) {
    case 5:
      return 'خیلی عالی!';
    case 4:
      return 'عالی!';
    case 3:
      return 'معمولی';
    case 2:
      return 'ضعیف';
    case 1:
      return 'خیلی بد';
    default:
      return 'خیلی عالی!';
  }
};

export default function ReviewsSection({ reviews = [], onAddReview, isLoading = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useRegisterModal(isOpen, () => setIsOpen(false));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      toast.error('لطفاً نام و متن نظر خود را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onAddReview) {
        await onAddReview({
          author,
          rating,
          text,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
        toast.success('نظر شما با موفقیت ثبت شد و پس از بررسی و تایید مدیریت منتشر خواهد شد.');
      }
      // Reset Form and close modal after successful confirmation
      setAuthor('');
      setRating(5);
      setText('');
      setIsOpen(false);
    } catch (err) {
      toast.error('خطا در ثبت نظر. لطفاً مجدداً تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const avgValue = safeReviews.length > 0
    ? (safeReviews.reduce((acc, r) => acc + (Number(r?.rating) || 0), 0) / safeReviews.length)
    : 4.5;
  const averageRating = avgValue.toFixed(1);

  return (
    <div className="relative mx-4 mb-16 z-20 filter drop-shadow-[0_8px_20px_rgba(15,23,42,0.08)] font-kal-2" dir="rtl">
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
        {/* Header: Title on Right, Rating score on Left */}
        <div className="flex justify-between items-center h-[36px] px-1 mb-4">
          {/* Right side (RTL): Title */}
          <div className="flex items-center gap-2">
            <h2 className="text-[17px] font-kal-3 font-medium text-slate-800 tracking-tight">
              امتیاز و نظرات کاربران
            </h2>
          </div>

          {/* Left side (RTL): Rating Score + Star */}
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-kal-3 font-medium text-slate-800">
              {parseFloat(averageRating).toLocaleString('fa-IR')}
            </span>
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
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

        {/* Horizontal Swipeable Reviews Slider / Skeleton Loading */}
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 -mx-1 px-1">
            {[1, 2, 3].map((idx) => (
              <div
                key={`comment-skeleton-${idx}`}
                className="flex-none w-[240px] sm:w-[260px] bg-slate-50 border border-slate-100 rounded-[12px] p-3.5 flex flex-col justify-between animate-pulse"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="h-3.5 bg-slate-200/80 rounded-md w-24"></div>
                    <div className="h-3.5 bg-slate-200/80 rounded-md w-10"></div>
                  </div>
                  <div className="space-y-2 mb-2">
                    <div className="h-3 bg-slate-200/80 rounded-md w-full"></div>
                    <div className="h-3 bg-slate-200/80 rounded-md w-5/6"></div>
                    <div className="h-3 bg-slate-200/80 rounded-md w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 -mx-1 px-1">
            {safeReviews.map((review) => (
              <div
                key={review.id}
                className="flex-none w-[240px] sm:w-[260px] snap-start bg-slate-50/70 border border-slate-200/80 rounded-[12px] p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-kal-3 font-bold text-xs text-slate-800">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-kal-3 font-bold text-slate-700">
                        {review.rating ? Number(review.rating).toLocaleString('fa-IR') : '۵'}
                      </span>
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-1">
                    {review.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Button - Outlined with Black Border & Hollow Center */}
        <div className="mt-1 pt-0">
          <button
            id="open-add-review-modal-btn"
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-slate-900 text-slate-900 hover:text-white border-2 border-slate-900 font-kal-3 font-bold text-xs sm:text-sm rounded-[14px] transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <span>+ ثبت نظر شما</span>
          </button>
        </div>
      </div>

      {/* Add Review Drawer powered by Vaul */}
      <Drawer.Root dismissible={true} open={isOpen} onOpenChange={setIsOpen} repositionInputs={false}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-xs transition-opacity" />
          <Drawer.Content
            className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[85dvh] sm:max-h-[88vh] overflow-y-auto no-scrollbar rounded-t-[28px] z-[10000] p-4 sm:p-6 pb-6 sm:pb-8 shadow-2xl border-t border-slate-100 outline-none max-w-md md:max-w-lg mx-auto font-kal-2 transition-transform duration-200 ease-out"
            dir="rtl"
          >
            {/* Drawer Handle */}
            <Drawer.Handle className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-3 shrink-0" />

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <Drawer.Title className="font-kal-3 font-bold text-base sm:text-lg text-slate-900 tracking-tight">
                  ثبت نظر و امتیاز
                </Drawer.Title>
                <Drawer.Description className="text-xs font-kal-2 text-slate-500 mt-0.5">
                  تجربه شما برای ما و دیگران ارزشمند است.
                </Drawer.Description>
              </div>
              <button
                id="close-add-review-modal-btn"
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4 pb-2">
              {/* Field 1: Name */}
              <div>
                <label className="block text-xs font-kal-3 font-medium text-slate-800 mb-1.5">
                  نام شما
                </label>
                <div className="relative bg-slate-50/80 border border-slate-200 rounded-[14px] p-1.5 px-3 flex items-center gap-2 focus-within:border-[#F47A20] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#F47A20]/10 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-500 shrink-0">
                    <User className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    id="review-author-input"
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="مریم احمدی"
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-kal-3 text-xs sm:text-sm placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[10px] sm:text-[11px] font-kal-2 text-slate-400 mt-1 px-1">
                  این نام به عنوان نام نمایش داده شده ثبت می‌شود.
                </p>
              </div>

              {/* Field 2: Rating */}
              <div>
                <label className="block text-xs font-kal-3 font-medium text-slate-800 mb-1.5">
                  امتیاز شما <span className="text-rose-500">*</span>
                </label>
                {/* LTR star arrangement so fill direction goes from left to right (1 -> 5) */}
                <div className="flex items-center gap-2 sm:gap-2.5 justify-center py-1" dir="ltr">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      id={`star-rating-btn-${star}`}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-0.5 cursor-pointer transition-transform hover:scale-110 active:scale-90"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-9 sm:h-9 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating Score Dotted Line & Badge */}
                <div className="relative flex items-center justify-between w-full mt-2.5 px-1">
                  <span className="text-[10px] sm:text-[11px] font-kal-2 text-slate-400 z-10 bg-white pl-1">
                    ۱ خیلی بد
                  </span>
                  <div className="absolute inset-x-12 sm:inset-x-14 top-1/2 -translate-y-1/2 border-t border-dashed border-slate-200 z-0" />
                  <div className="relative z-10 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-100 text-[#F47A20] font-kal-3 font-bold text-[11px] sm:text-xs shadow-2xs">
                    {getRatingLabel(rating)}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-kal-2 text-slate-400 z-10 bg-white pr-1">
                    ۵ عالی
                  </span>
                </div>
              </div>

              {/* Field 3: Textarea */}
              <div>
                <label className="block text-xs font-kal-3 font-medium text-slate-800 mb-1.5">
                  نظر شما <span className="text-rose-500">*</span>
                </label>
                <div className="relative bg-white border border-slate-200 rounded-[16px] p-3 focus-within:border-[#F47A20] focus-within:ring-2 focus-within:ring-[#F47A20]/10 transition-all shadow-2xs">
                  <textarea
                    id="review-text-input"
                    rows="3"
                    maxLength={500}
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="تجربه خود را از دریافت خدمات بنویسید..."
                    className="w-full bg-transparent border-none focus:outline-none text-slate-800 font-kal-2 text-xs leading-relaxed resize-none placeholder:text-slate-400"
                  />
                  <div className="text-left text-[10px] sm:text-[11px] font-kal-2 text-slate-400 mt-0.5">
                    {toPersianDigits(text.length)}/۵۰۰
                  </div>
                </div>
              </div>

              {/* Submit & Cancel Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  id="submit-review-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#F47A20] hover:bg-[#d66311] active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed text-white font-kal-3 font-bold text-xs sm:text-sm rounded-[14px] transition-all shadow-md shadow-orange-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>در حال ثبت...</span>
                    </>
                  ) : (
                    <span>ثبت نظر</span>
                  )}
                </button>
                <button
                  id="cancel-review-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-white border border-slate-200/90 text-[#F47A20] hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 font-kal-3 font-bold text-xs sm:text-sm rounded-[14px] transition-all cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </form>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}



