import React, { useState, useMemo, useEffect } from 'react';
import { Drawer } from 'vaul';
import { Sun, SunMedium, Sunset, Moon, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import moment from 'moment-jalaali';
import { useRegisterModal } from '@core/backButtonManager';

// Initialize Persian locale for moment-jalaali
moment.loadPersian({ dialect: 'persian-modern' });

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export const TIME_RANGE_OPTIONS = [
  {
    id: 'morning',
    title: 'صبح',
    subtitle: '۹ تا ۱۲',
    canonical: '09:00-12:00',
    displaySuffix: 'صبح',
    displayRange: '۹ تا ۱۲ ظهر',
    icon: Sun,
    iconColor: 'text-amber-500',
    startHour: 9,
    endHour: 12,
  },
  {
    id: 'noon',
    title: 'ظهر',
    subtitle: '۱۲ تا ۱۵',
    canonical: '12:00-15:00',
    displaySuffix: 'ظهر',
    displayRange: '۱۲ تا ۱۵ ظهر',
    icon: SunMedium,
    iconColor: 'text-orange-500',
    startHour: 12,
    endHour: 15,
  },
  {
    id: 'afternoon',
    title: 'عصر',
    subtitle: '۱۵ تا ۱۸',
    canonical: '15:00-18:00',
    displaySuffix: 'عصر',
    displayRange: '۱۵ تا ۱۸ عصر',
    icon: Sunset,
    iconColor: 'text-amber-600',
    startHour: 15,
    endHour: 18,
  },
  {
    id: 'night',
    title: 'شب',
    subtitle: '۱۸ تا ۲۱',
    canonical: '18:00-21:00',
    displaySuffix: 'شب',
    displayRange: '۱۸ تا ۲۱ شب',
    icon: Moon,
    iconColor: 'text-indigo-400',
    startHour: 18,
    endHour: 21,
  },
  {
    id: 'no_preference',
    title: 'فرقی ندارد',
    subtitle: 'هر ساعتی که مجموعه هماهنگ کند',
    canonical: 'NO_PREFERENCE',
    displaySuffix: '',
    displayRange: 'فرقی ندارد',
    icon: null,
    iconColor: '',
  },
];

export const isDateToday = (dateObj) => {
  if (!dateObj) return false;
  if (dateObj.isToday) return true;
  const todayIso = moment().format('jYYYY/jMM/jDD');
  return dateObj.isoJalali === todayIso;
};

export const isTimeOptionDisabled = (timeOption, selectedDate) => {
  if (!selectedDate || !timeOption) return false;
  if (!isDateToday(selectedDate)) return false;

  const currentHour = moment().hour();

  // If no_preference: disabled if all specific slots (morning, noon, afternoon, night) are disabled
  if (timeOption.id === 'no_preference' || timeOption.canonical === 'NO_PREFERENCE') {
    return TIME_RANGE_OPTIONS
      .filter((opt) => opt.id !== 'no_preference' && opt.canonical !== 'NO_PREFERENCE')
      .every((opt) => currentHour >= opt.startHour);
  }

  if (typeof timeOption.startHour === 'number') {
    return currentHour >= timeOption.startHour;
  }

  return false;
};

export const getUpcomingDays = (count = 14) => {
  const days = [];
  let offset = 0;
  while (days.length < count && offset < 60) {
    const d = moment().add(offset, 'days');
    offset++;

    // Exclude Friday (day 5 in standard moment / 'جمعه')
    if (d.day() === 5 || d.format('dddd') === 'جمعه') {
      continue;
    }

    const dayOfWeek = d.format('dddd');
    const dayNumber = d.format('jD');
    const monthName = d.format('jMMMM');
    const formattedPersian = `${dayOfWeek} ${toPersianDigits(dayNumber)} ${monthName}`;
    const isoJalali = d.format('jYYYY/jMM/jDD');
    const isToday = d.isSame(moment(), 'day');

    days.push({
      index: days.length,
      dayOfWeek,
      dayNumber: toPersianDigits(dayNumber),
      rawDayNumber: dayNumber,
      monthName,
      formattedPersian,
      isoJalali,
      isToday,
    });
  }
  return days;
};

function VisitTimeDrawer({
  isOpen,
  setIsOpen,
  selectedDate,
  setSelectedDate,
  selectedTimeRange,
  setSelectedTimeRange,
  onProceedToPayment,
  onSave,
  isSubmittingPayment = false,
}) {
  useRegisterModal(isOpen, () => setIsOpen(false));

  const availableDays = useMemo(() => getUpcomingDays(14), []);

  // Local draft states inside drawer - start unselected if not already selected
  const [draftDate, setDraftDate] = useState(() => selectedDate || null);
  const [draftTime, setDraftTime] = useState(() => selectedTimeRange || null);

  // Sync draft states when drawer opens
  useEffect(() => {
    if (isOpen) {
      let targetDate = null;
      if (selectedDate) {
        const found = availableDays.find(
          (d) => d.isoJalali === selectedDate.isoJalali || d.formattedPersian === selectedDate.formattedPersian
        );
        targetDate = found || selectedDate;
        setDraftDate(targetDate);
      } else {
        setDraftDate(null);
      }

      if (selectedTimeRange) {
        const foundTime = TIME_RANGE_OPTIONS.find(
          (t) => t.canonical === selectedTimeRange.canonical || t.canonical === selectedTimeRange
        );
        const resolvedTime = foundTime || selectedTimeRange;
        // Check if resolvedTime is disabled for targetDate
        if (targetDate && isTimeOptionDisabled(resolvedTime, targetDate)) {
          setDraftTime(null);
        } else {
          setDraftTime(resolvedTime);
        }
      } else {
        setDraftTime(null);
      }
    }
  }, [isOpen, selectedDate, selectedTimeRange, availableDays]);

  const handleSelectDate = (day) => {
    setDraftDate(day);
    // If draftTime is already selected, clear it if it's disabled for the newly selected date
    if (draftTime && isTimeOptionDisabled(draftTime, day)) {
      setDraftTime(null);
    }
  };

  const isSelectionValid = Boolean(
    draftDate &&
    draftTime &&
    !isTimeOptionDisabled(draftTime, draftDate)
  );

  const isTodaySelected = isDateToday(draftDate);
  const areAllTimesDisabled = useMemo(() => {
    if (!isTodaySelected) return false;
    return TIME_RANGE_OPTIONS.every((opt) => isTimeOptionDisabled(opt, draftDate));
  }, [draftDate, isTodaySelected]);

  const handleConfirm = () => {
    if (!isSelectionValid || isSubmittingPayment) return;
    if (setSelectedDate) setSelectedDate(draftDate);
    if (setSelectedTimeRange) setSelectedTimeRange(draftTime);
    if (onProceedToPayment) {
      onProceedToPayment(draftDate, draftTime);
    } else if (onSave) {
      onSave(draftDate, draftTime);
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <Drawer.Root dismissible={true} open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs transition-opacity" />
        <Drawer.Content
          dir="rtl"
          className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[92vh] rounded-t-[24px] z-50 p-3.5 sm:p-4 shadow-2xl border-t border-slate-100 outline-none max-w-md md:max-w-lg mx-auto overflow-hidden font-kal-2 select-none text-right transition-all duration-300 ease-out"
        >
          {/* Grab Handle */}
          <div className="w-10 h-1 bg-[#F47A20] rounded-full mx-auto mb-2 opacity-90" />

          {/* Drawer Title */}
          <Drawer.Title className="text-center font-kal-3 font-bold text-slate-800 text-sm sm:text-base mb-3">
            تعیین روز و زمان مراجعه
          </Drawer.Title>

          <div className="overflow-y-auto no-scrollbar space-y-3.5 px-0.5 pb-2 flex-1">
            {/* 1. Date Selection Section */}
            <div>
              <h4 className="font-kal-3 font-bold text-slate-800 text-xs sm:text-[13.5px] mb-2 text-right">
                انتخاب روز
              </h4>

              {/* Horizontal Scrollable Days Cards */}
              <div dir="rtl" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
                {availableDays.map((day) => {
                  const isSelected =
                    draftDate &&
                    (draftDate.isoJalali === day.isoJalali ||
                      draftDate.formattedPersian === day.formattedPersian);

                  return (
                    <button
                      key={day.isoJalali}
                      type="button"
                      onClick={() => handleSelectDate(day)}
                      className={`shrink-0 w-[62px] sm:w-[64px] h-[80px] sm:h-[84px] rounded-xl flex flex-col items-center justify-between py-2 px-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F47A20] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                          : 'bg-slate-50/90 text-slate-600 hover:bg-slate-100/90 border border-slate-100'
                      }`}
                    >
                      {/* Day of Week */}
                      <span
                        className={`text-[11.5px] font-kal-2 truncate max-w-[56px] ${
                          isSelected
                            ? 'text-white font-medium'
                            : day.isToday
                            ? 'text-[#F47A20] font-bold'
                            : 'text-slate-500 font-normal'
                        }`}
                      >
                        {day.isToday ? 'امروز' : day.dayOfWeek}
                      </span>

                      {/* Day Number */}
                      <span
                        className={`text-[17px] font-kal-3 font-bold leading-none ${
                          isSelected ? 'text-white' : 'text-slate-800'
                        }`}
                      >
                        {day.dayNumber}
                      </span>

                      {/* Month Name */}
                      <span
                        className={`text-[11px] font-kal-2 ${
                          isSelected ? 'text-orange-100' : 'text-slate-400'
                        }`}
                      >
                        {day.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Time Range Selection Section (Smoothly revealed after a day is selected) */}
            <AnimatePresence>
              {draftDate && (
                <motion.div
                  key="time-range-section"
                  initial={{ opacity: 0, height: 0, y: 15 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 15 }}
                  transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                  className="space-y-3.5 pt-2 border-t border-slate-100 overflow-hidden"
                >
                  <div>
                    <h4 className="font-kal-3 font-bold text-slate-800 text-xs sm:text-[13.5px] mb-2 text-right">
                      انتخاب بازه زمانی
                    </h4>

                    {areAllTimesDisabled && (
                      <div
                        dir="rtl"
                        className="mb-2.5 p-2.5 sm:p-3 rounded-xl bg-amber-50 border border-amber-200/80 flex items-start gap-2 text-right text-amber-800 text-xs font-kal-2"
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="leading-relaxed">
                          تمامی بازه‌های زمانی برای امروز به پایان رسیده‌اند. لطفاً روز دیگری را جهت مراجعه انتخاب نمایید.
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5 sm:space-y-2">
                      {TIME_RANGE_OPTIONS.map((timeOption) => {
                        const isDisabled = isTimeOptionDisabled(timeOption, draftDate);
                        const isSelected =
                          !isDisabled &&
                          draftTime &&
                          (draftTime.id === timeOption.id || draftTime.canonical === timeOption.canonical);
                        const Icon = timeOption.icon;

                        return (
                          <div
                            key={timeOption.id}
                            dir="rtl"
                            onClick={() => {
                              if (isDisabled) return;
                              setDraftTime(timeOption);
                            }}
                            className={`w-full rounded-xl p-2.5 sm:p-3 flex items-center justify-between transition-all ${
                              isDisabled
                                ? 'border border-slate-200/70 bg-slate-50/75 opacity-55 cursor-not-allowed select-none'
                                : isSelected
                                ? 'border-2 border-[#F47A20] bg-orange-50/20 shadow-2xs cursor-pointer'
                                : 'border border-slate-200/90 bg-white hover:bg-slate-50/70 cursor-pointer'
                            }`}
                          >
                            {/* Right in RTL: Title, Subtitle, & Optional Icon */}
                            <div className="flex items-center gap-2 text-right">
                              {Icon && (
                                <div
                                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                    isDisabled ? 'opacity-40 grayscale' : ''
                                  }`}
                                >
                                  <Icon
                                    className={`w-4.5 h-4.5 ${
                                      isDisabled ? 'text-slate-400' : timeOption.iconColor || 'text-amber-500'
                                    }`}
                                  />
                                </div>
                              )}

                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-kal-3 font-bold text-xs sm:text-[13.5px] leading-tight ${
                                      isDisabled
                                        ? 'text-slate-400'
                                        : isSelected
                                        ? 'text-slate-900'
                                        : 'text-slate-800'
                                    }`}
                                  >
                                    {timeOption.title}
                                  </span>
                                  {isDisabled && (
                                    <span className="text-[10px] font-kal-2 px-1.5 py-0.5 rounded bg-rose-50 text-rose-500 border border-rose-100/80 leading-none">
                                      ساعت گذشته
                                    </span>
                                  )}
                                </div>
                                <span
                                  className={`text-[11px] font-kal-2 mt-0.5 ${
                                    isDisabled ? 'text-slate-400' : 'text-slate-400'
                                  }`}
                                >
                                  {timeOption.subtitle}
                                </span>
                              </div>
                            </div>

                            {/* Left in RTL: Custom Radio Circle */}
                            <div className="flex items-center justify-center pl-1">
                              <div
                                className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all ${
                                  isDisabled
                                    ? 'border-slate-200 bg-slate-100'
                                    : isSelected
                                    ? 'border-[#F47A20] bg-[#F47A20]'
                                    : 'border-slate-300 bg-white'
                                }`}
                              >
                                {isSelected && !isDisabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Alert Note Box */}
                    <div
                      dir="rtl"
                      className="mt-2.5 p-2.5 sm:p-3 rounded-xl bg-[#FFF4EB] border border-[#FFE7D6]/70 flex items-start gap-2 text-right"
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertCircle className="w-4 h-4 text-[#A06138]" />
                      </div>
                      <p className="text-[11px] sm:text-[11.5px] leading-relaxed text-[#A06138] font-kal-2 flex-1">
                        روز و زمان انتخابی فقط ترجیح شماست و قطعی نیست. پس از ثبت سفارش، مجموعه حداکثر تا ۳۰ دقیقه با شما تماس می‌گیرند و زمان دقیق مراجعه را هماهنگ می‌کنند.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Confirm Button */}
          <div className="pt-2.5 border-t border-slate-100 mt-1">
            <button
              type="button"
              disabled={!isSelectionValid || isSubmittingPayment}
              onClick={handleConfirm}
              className={`w-full py-3 rounded-xl font-kal-3 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isSelectionValid && !isSubmittingPayment
                  ? 'bg-[#F47A20] hover:bg-[#d66311] text-white shadow-[0_4px_16px_rgba(244,122,32,0.25)] active:scale-[0.99] cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmittingPayment ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span className="text-xs">درحال انتقال به درگاه پرداخت...</span>
                </>
              ) : (
                <span>ادامه فرایند پرداخت</span>
              )}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default VisitTimeDrawer;
