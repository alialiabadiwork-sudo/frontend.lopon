import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Phone, MapPin, Map, House, Clock, Ticket, Navigation, X, ExternalLink, Compass, Calendar } from 'lucide-react';

function CompletedOrderItemCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [fetchedVendor, setFetchedVendor] = useState(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isLoadingVendor, setIsLoadingVendor] = useState(false);

  const title =
    order.serviceTitle ||
    order.serviceId?.title ||
    order.vendorService?.service?.title ||
    order.vendorService?.title ||
    order.title ||
    'سرویس زیبایی';

  const orderCode =
    order.code ||
    order.couponCode ||
    order.admissionCode ||
    order.payment?.orderCode ||
    order.orderCode ||
    'نامشخص';

  const vendorIdToFetch =
    (typeof order.vendorId === 'string' ? order.vendorId : order.vendorId?._id) ||
    order.vendor?._id ||
    order.vendorService?.vendor?._id ||
    order.vendorServices?.vendor?._id ||
    (typeof order.serviceId === 'object' && order.serviceId?.vendor?._id) ||
    (typeof order.serviceId === 'object' && order.serviceId?.vendor);

  useEffect(() => {
    if (vendorIdToFetch && typeof vendorIdToFetch === 'string') {
      setIsLoadingVendor(true);
      fetch(`/api/v1/vendors/details/${vendorIdToFetch}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.status === 'success' && data?.data?.vendor) {
            setFetchedVendor(data.data.vendor);
          } else if (data?.data && !data.data.vendor) {
            setFetchedVendor(data.data);
          }
          setIsLoadingVendor(false);
        })
        .catch((err) => {
          console.log('Error fetching vendor:', err);
          setIsLoadingVendor(false);
        });
    }
  }, [vendorIdToFetch]);

  const baseVendor =
    order.vendor ||
    (typeof order.vendorId === 'object' && order.vendorId !== null ? order.vendorId : null) ||
    order.vendorService?.vendor ||
    order.vendorServices?.vendor ||
    (typeof order.serviceId === 'object' && order.serviceId?.vendor ? order.serviceId.vendor : null) ||
    {};

  const vendorObj = {
    ...baseVendor,
    ...(fetchedVendor || {})
  };

  const salonName =
    vendorObj.title ||
    fetchedVendor?.title ||
    order.vendorTitle ||
    order.salonName ||
    order.vendorName ||
    'مجموعه زیبایی';

  let expiryDays = order.expiryDays;
  if (!expiryDays && order.expireAt) {
    const diffMs = new Date(order.expireAt) - new Date();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      expiryDays = `${diffDays.toLocaleString('fa-IR')} روز باقی مانده`;
    } else {
      expiryDays = 'منقضی شده';
    }
  }

  const visitDate =
    order.preferredVisitDate ||
    order.payment?.preferredVisitDate ||
    order.vendorService?.preferredVisitDate ||
    null;

  const rawTimeRange =
    order.preferredVisitTimeRange ||
    order.payment?.preferredVisitTimeRange ||
    order.vendorService?.preferredVisitTimeRange ||
    null;

  const formatTimeRange = (raw) => {
    if (!raw) return null;
    if (raw === 'NO_PREFERENCE' || raw === 'no_preference' || raw === 'فرقی ندارد') {
      return 'فرقی ندارد';
    }
    return raw.replace('-', ' تا ');
  };

  const visitTimeRange = formatTimeRange(rawTimeRange);

  const admissionCode = order.code || order.couponCode || order.admissionCode || '-';

  const getStatusBadge = () => {
    const s = order.status;
    if (s === 'used') {
      return {
        text: 'استفاده شده',
        className: 'bg-emerald-50 text-emerald-600 border border-emerald-100/75',
      };
    }
    if (s === 'cancelled' || s === 'canceled') {
      return {
        text: 'لغو شده',
        className: 'bg-slate-50 text-slate-500 border border-slate-200/75',
      };
    }
    if (s === 'expired') {
      return {
        text: 'منقضی شده',
        className: 'bg-rose-50 text-rose-500 border border-rose-100/75',
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  const auxPhone =
    vendorObj.auxiliaryPhone ||
    fetchedVendor?.auxiliaryPhone ||
    baseVendor.auxiliaryPhone ||
    vendorObj.secondaryPhone ||
    fetchedVendor?.secondaryPhone ||
    '';

  const ownerPhone =
    (typeof order.vendorId === 'object' && order.vendorId?.owner?.mobile) ||
    (typeof order.vendorID === 'object' && order.vendorID?.owner?.mobile) ||
    (typeof order.vendorId === 'object' && order.vendorId?.owner?.phone) ||
    (typeof order.vendorID === 'object' && order.vendorID?.owner?.phone) ||
    fetchedVendor?.owner?.mobile ||
    fetchedVendor?.owner?.phone ||
    vendorObj.owner?.mobile ||
    vendorObj.owner?.phone ||
    baseVendor.owner?.mobile ||
    baseVendor.owner?.phone ||
    '';

  const directPhone =
    vendorObj.phone ||
    fetchedVendor?.phone ||
    baseVendor.phone ||
    order.phone ||
    '';

  const displayPhone1 = directPhone || ownerPhone || auxPhone;

  let address = order.address;
  const vendorAddr = vendorObj.address || fetchedVendor?.address || baseVendor.address;
  if (!address && vendorAddr) {
    if (typeof vendorAddr === 'object') {
      const parts = [];
      if (vendorAddr.city) parts.push(vendorAddr.city);
      if (vendorAddr.address) parts.push(vendorAddr.address);
      address = parts.join('، ');
    } else if (typeof vendorAddr === 'string') {
      address = vendorAddr;
    }
  }

  const lat = vendorObj.address?.location?.lat || fetchedVendor?.address?.location?.lat || baseVendor.address?.location?.lat || order.lat || order.latitude || null;
  const lng = vendorObj.address?.location?.lng || fetchedVendor?.address?.location?.lng || baseVendor.address?.location?.lng || order.lng || order.longitude || null;

  const DAY_MAP = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];

  let rawWorkingDays =
    fetchedVendor?.workingDays ||
    order.workingDays ||
    order.vendor?.workingDays ||
    vendorObj?.workingDays ||
    baseVendor?.workingDays;

  let workingDays = [];

  if (Array.isArray(rawWorkingDays) && rawWorkingDays.length > 0) {
    workingDays = rawWorkingDays.map((item) => {
      if (typeof item === 'string') {
        const parts = item.trim().split(/\s+/);
        return { day: parts[0] || 'روز کاری', time: parts.slice(1).join(' ') || '' };
      }
      if (typeof item === 'object' && item !== null) {
        let dayName = 'روز کاری';
        if (typeof item.day === 'number' || (typeof item.day === 'string' && !isNaN(item.day))) {
          const dayIndex = Number(item.day);
          dayName = DAY_MAP[dayIndex] || 'روز کاری';
        } else if (typeof item.day === 'string') {
          dayName = item.day;
        }

        let timeStr = '';
        if (item.from && item.to) {
          timeStr = `${item.from} الی ${item.to}`;
        } else if (item.time) {
          timeStr = item.time;
        }

        return { day: dayName, time: timeStr };
      }
      return { day: 'روز کاری', time: '' };
    });
  }

  if (workingDays.length === 0) {
    workingDays = [
      { day: 'شنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
      { day: 'یکشنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
      { day: 'دوشنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
      { day: 'سه‌شنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
      { day: 'چهارشنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
      { day: 'پنج‌شنبه', time: '۱۰:۰۰ الی ۲۱:۰۰' },
    ];
  }

  const rawPrice = order.price ?? order.serviceId?.price ?? order.vendorService?.price ?? order.payment?.totalPrice ?? 0;
  const rawFinalPrice = order.finalPrice ?? order.serviceId?.finalPrice ?? order.vendorService?.finalPrice ?? order.payment?.payablePrice ?? 0;
  const discountVal = Math.max(0, rawPrice - rawFinalPrice);

  const totalAmountRaw = order.totalAmountRaw || (rawPrice ? Number(rawPrice).toLocaleString('fa-IR') : '۰');
  const discountProfitRaw = order.discountProfitRaw || (discountVal ? Number(discountVal).toLocaleString('fa-IR') : '۰');
  const payableAmountRaw = order.payableAmountRaw || (rawFinalPrice ? Number(rawFinalPrice).toLocaleString('fa-IR') : '۰');

  const handleCall = () => {
    const targetPhone = displayPhone1;
    if (targetPhone) {
      const cleanPhone = targetPhone.replace(/[^0-9+]/g, '');
      if (cleanPhone) {
        window.location.href = `tel:${cleanPhone}`;
        return;
      }
    }
    alert('شماره تماسی برای این مجموعه در سیستم ثبت نشده است.');
  };

  const handleMap = () => {
    if (lat && lng) {
      const label = encodeURIComponent(salonName || 'مقصد');
      window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
      return;
    }
    if (salonName || address) {
      const query = encodeURIComponent(`${salonName} ${address || ''}`.trim());
      window.location.href = `geo:0,0?q=${query}`;
      return;
    }
    alert('موقعیت جغرافیایی یا آدرسی برای این مجموعه ثبت نشده است.');
  };

  const toggleAccordion1 = (e) => {
    e.stopPropagation();
    setIsDetailsOpen(!isDetailsOpen);
  };

  const toggleAccordion2 = (e) => {
    e.stopPropagation();
    setIsInvoiceOpen(!isInvoiceOpen);
  };

  return (
    <div dir="rtl" className="bg-white border border-slate-200/90 rounded-2xl p-4 my-2.5 shadow-2xs transition-all duration-300 font-kal-2 text-right">
      {/* Top Header Section */}
      <div className="flex items-start justify-between gap-2.5 mb-3">
        {/* Title */}
        <h3 className="font-kal-3 font-bold text-slate-800 text-sm sm:text-base text-right leading-snug">
          {title}
        </h3>

        {/* Order Code Badge (Visible in All States) */}
        <div className="bg-[#fde8d8] text-[#F47A20] px-2.5 py-1 rounded-md text-[9px] font-kal-3 whitespace-nowrap shrink-0">
          <span>کد سفارش: </span>
          <span className="font-bold text-xs mr-0.5">{orderCode}</span>
        </div>
      </div>

      {/* Salon Name, Phone & Expiry Date */}
      <div className="space-y-2 text-right text-xs sm:text-sm text-slate-700 font-kal-2 mb-3">
        <div className="flex items-center gap-2 justify-start flex-wrap">
          <House className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{salonName}</span>
        </div>
        {isLoadingVendor && !displayPhone1 ? (
          <div className="flex items-center gap-2 justify-start text-slate-400 animate-pulse">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>شماره تماس: </span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F47A20] animate-ping" />
              در حال دریافت شماره تماس...
            </span>
          </div>
        ) : displayPhone1 ? (
          <div className="flex items-center gap-2 justify-start">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>شماره تماس: </span>
            <a href={`tel:${displayPhone1}`} className="font-medium text-slate-800 hover:text-[#F47A20] transition-colors dir-ltr">
              {displayPhone1}
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-start text-slate-400">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>شماره تماس: </span>
            <span className="text-xs text-slate-400">ثبت نشده</span>
          </div>
        )}
        {expiryDays && (
          <div className="flex items-center gap-2 justify-start">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <span>مهلت استفاده: </span>
            <span className="font-medium text-slate-800">{expiryDays}</span>
          </div>
        )}
      </div>

      {/* زمان انتخابی شما (Preferred Visit Date & Time Display) */}
      {(visitDate || visitTimeRange) && (
        <div className="bg-[#fff8f2] border border-[#fde2cb] rounded-xl p-3 mb-3 text-right space-y-1.5 font-kal-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#F47A20] font-kal-3 font-bold text-xs">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>زمان انتخابی شما</span>
            </div>
            {visitTimeRange && (
              <span className="bg-white/90 text-slate-700 px-2 py-0.5 rounded-md border border-orange-200 text-[11px] font-medium">
                بازه: {visitTimeRange}
              </span>
            )}
          </div>
          {visitDate && (
            <div className="text-xs text-slate-700 font-kal-2 flex items-center gap-1.5 pr-5">
              <span className="text-slate-500 text-[11.5px]">تاریخ مراجعه:</span>
              <span className="font-bold text-slate-800">{visitDate}</span>
            </div>
          )}
        </div>
      )}

      {/* EXPANDED CONTENT (State 2 & 3) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-100 my-2.5" />

            {/* Ticket Voucher Block */}
            <div className="my-3">
              <div className="relative bg-[#fde8d8] rounded-xl px-3 py-2.5 flex items-center justify-between font-kal-3 overflow-hidden">
                {/* Top & Bottom cutout notches (~70% from right = 30% from left in LTR/RTL) */}
                <div className="absolute -top-2 left-[30%] -translate-x-1/2 w-4 h-4 rounded-full bg-white" />
                <div className="absolute -bottom-2 left-[30%] -translate-x-1/2 w-4 h-4 rounded-full bg-white" />

                {/* Right Side in RTL: Label and Ticket Icon */}
                <div className="flex items-center gap-1.5 text-[#F47A20] font-bold text-xs sm:text-sm">
                  <Ticket className="w-4 h-4 shrink-0" />
                  <span>کد ارائه هنگام پذیرش:</span>
                </div>

                {/* Left Side in RTL: Admission Code */}
                <div className="text-[#F47A20] font-bold text-sm sm:text-base tracking-wider">
                  {admissionCode}
                </div>
              </div>

              {/* Notice text below the punch card */}
              <p className="text-[10px] text-slate-500 font-kal-2 text-center mt-2 leading-relaxed max-w-xs mx-auto">
                هنگام مراجعه به مجموعه {salonName} این کد سفارش را جهت استعلام به مسئول پذیرش نشان دهید
              </p>
            </div>

            <div className="border-t border-slate-100 my-2.5" />

            {/* Accordion 1: مشخصات مجموعه */}
            <div className="py-0.5">
              <button
                type="button"
                onClick={toggleAccordion1}
                className="w-full flex items-center justify-between py-1.5 text-right cursor-pointer"
              >
                <span className="font-kal-3 font-bold text-slate-800 text-xs sm:text-sm">
                  مشخصات مجموعه:
                </span>
                <motion.div
                  animate={{ rotate: isDetailsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isDetailsOpen && (
                  <motion.div
                    key="details-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1.5 space-y-2.5 pt-0.5 pb-1">
                      {/* Fallback if no working days, phone, or address */}
                      {workingDays.length === 0 && !displayPhone1 && !address && (
                        <div className="text-[11px] sm:text-xs text-slate-500 font-kal-2 text-center py-2 bg-slate-50 rounded-md">
                          اطلاعات تماس و نشانی این مجموعه ثبت نشده است.
                        </div>
                      )}

                      {/* Working Days Horizontal Scroll */}
                      {workingDays.length > 0 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 mb-1.5">
                          {workingDays.map((item, idx) => (
                            <div
                              key={idx}
                              className="px-2.5 py-1.5 bg-white border border-slate-200/90 rounded-[6px] text-center flex flex-col items-center justify-center min-w-[90px] shrink-0"
                            >
                              <span className="text-[10px] text-slate-400 font-kal-2 mb-0.5">{item.day}</span>
                              {item.time && (
                                <span className="text-[10px] sm:text-[11px] text-slate-800 font-normal font-kal-2 whitespace-nowrap">
                                  {item.time}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Phone Numbers */}
                      {isLoadingVendor && !displayPhone1 ? (
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500 font-kal-2 animate-pulse py-1">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-400">شماره‌های تماس:</span>
                          </div>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F47A20] animate-ping" />
                            در حال استعلام از حساب کاربری وندور...
                          </span>
                        </div>
                      ) : displayPhone1 ? (
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-700 font-kal-2 py-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="font-medium text-slate-800">شماره تماس:</span>
                          </div>
                          <a href={`tel:${displayPhone1}`} className="font-normal text-slate-800 hover:text-[#F47A20] transition-colors dir-ltr">
                            {displayPhone1}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-kal-2">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            <span className="font-medium text-slate-400">شماره تماس:</span>
                          </div>
                          <span className="text-xs text-slate-400">ثبت نشده</span>
                        </div>
                      )}

                      {/* Address */}
                      {address && (
                        <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-700 font-kal-2">
                          <div className="flex items-center gap-1.5 text-slate-700 shrink-0">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="font-medium text-slate-800">نشانی مجموعه:</span>
                          </div>
                          <span className="font-normal text-slate-800 text-left mr-2 truncate">{address}</span>
                        </div>
                      )}

                      {/* Preferred Visit Date & Time in details */}
                      {(visitDate || visitTimeRange) && (
                        <>
                          <div className="border-t border-dashed border-slate-200 my-1" />
                          {visitDate && (
                            <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-700 font-kal-2">
                              <span className="font-medium text-slate-800">تاریخ مراجعه:</span>
                              <span className="font-normal text-slate-800">{visitDate}</span>
                            </div>
                          )}
                          {visitTimeRange && (
                            <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-700 font-kal-2">
                              <span className="font-medium text-slate-800">بازه مراجعه:</span>
                              <span className="font-normal text-slate-800">{visitTimeRange}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="border-t border-slate-100 my-1.5" />

            {/* Accordion 2: صورت حساب ها */}
            <div className="py-0.5">
              <button
                type="button"
                onClick={toggleAccordion2}
                className="w-full flex items-center justify-between py-1.5 text-right cursor-pointer"
              >
                <span className="font-kal-3 font-bold text-slate-800 text-xs sm:text-sm">
                  صورت حساب ها:
                </span>
                <motion.div
                  animate={{ rotate: isInvoiceOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isInvoiceOpen && (
                  <motion.div
                    key="invoice-content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1.5 space-y-2 pt-0.5 pb-1 font-kal-2">
                      {/* Total */}
                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-600 py-0.5">
                        <span className="text-slate-700">جمع کل سفارشات:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-normal text-slate-800 text-xs sm:text-sm">
                            {totalAmountRaw}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">تومان</span>
                        </div>
                      </div>

                      {/* Savings / Discount in Green Box (only if discount exists) */}
                      {discountVal > 0 && (
                        <div className="bg-[#e8f8ee] rounded-[6px] px-2.5 py-1.5 flex items-center justify-between text-[11px] sm:text-xs text-[#1e8e4a] my-1">
                          <span className="font-medium">سود شما از خرید:</span>
                          <div className="flex items-center gap-1">
                            <span className="font-normal text-[#1e8e4a] text-xs sm:text-sm">
                              {discountProfitRaw}
                            </span>
                            <span className="text-[10px] text-[#1e8e4a]/70 font-normal">تومان</span>
                          </div>
                        </div>
                      )}

                      {/* Dashed line */}
                      <div
                        className="my-2 h-[1px] w-full"
                        style={{
                          backgroundImage: 'linear-gradient(to right, #cbd5e1 50%, rgba(255,255,255,0) 0%)',
                          backgroundSize: '12px 1px',
                          backgroundRepeat: 'repeat-x',
                        }}
                      />

                      {/* Payable Amount */}
                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-800 py-0.5">
                        <span className="font-medium text-slate-800">مبلغ قابل پرداخت:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-normal text-slate-900 text-sm sm:text-base">
                            {payableAmountRaw}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">تومان</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons Row: تماس با مجموعه & مسیریابی مجموعه */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-1">
        {/* Right (in RTL): Contact Salon */}
        <button
          type="button"
          disabled={isLoadingVendor && !displayPhone1}
          onClick={handleCall}
          className={`flex-1 py-2 px-2.5 rounded-[6px] text-[11px] sm:text-xs font-kal-3 font-medium flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
            isLoadingVendor && !displayPhone1
              ? 'bg-slate-100 text-slate-400 border-slate-200/50 cursor-not-allowed animate-pulse'
              : 'bg-[#f4f5f7] hover:bg-slate-200 text-slate-700 border-slate-100/60'
          }`}
        >
          <Phone className={`w-3.5 h-3.5 ${isLoadingVendor && !displayPhone1 ? 'text-slate-400' : 'text-slate-700'}`} />
          <span>{isLoadingVendor && !displayPhone1 ? 'در حال دریافت شماره...' : 'تماس با مجموعه'}</span>
        </button>

        {/* Left (in RTL): Navigation */}
        <button
          type="button"
          onClick={handleMap}
          className="flex-1 text-slate-700 hover:text-slate-900 py-2 px-2.5 rounded-xl text-[11px] sm:text-xs font-kal-3 font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Map className="w-3.5 h-3.5 text-slate-600" />
          <span>مسیریابی مجموعه</span>
        </button>
      </div>

      {/* Full Width Collapse/Expand Button */}
      <button
        type="button"
        onClick={() => {
          const nextExpanded = !isExpanded;
          setIsExpanded(nextExpanded);
          if (nextExpanded) {
            setIsDetailsOpen(true);
            setIsInvoiceOpen(false);
          } else {
            setIsDetailsOpen(false);
            setIsInvoiceOpen(false);
          }
        }}
        className="w-full mt-2.5 py-1.5 px-3 border border-slate-200/90 rounded-[6px] text-slate-600 hover:text-slate-900 font-kal-3 text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span>{isExpanded ? 'جزئیات کمتر' : 'جزئیات بیشتر'}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
        </motion.div>
      </button>
    </div>
  );
}

export default CompletedOrderItemCard;
