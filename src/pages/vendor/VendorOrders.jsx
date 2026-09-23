import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Phone,
  User,
  Ticket,
  DollarSign,
  ChevronDown,
  Check,
  XCircle,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorOrders() {
  const coupons = useVendorStore((s) => s.coupons);
  const redeemCoupon = useVendorStore((s) => s.redeemCoupon);

  const [activeTab, setActiveTab] = useState('all'); // all, today, pending, used, expired, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Status definition matching Section 2 of PRD
  const TABS = [
    { id: 'all', label: 'همه سفارشات', count: coupons.length },
    {
      id: 'today',
      label: 'نوبت‌های امروز',
      count: coupons.filter((c) => c.preferredVisitDate === '۱۴۰۵/۰۳/۱۸' && c.status === 'pending').length,
    },
    { id: 'pending', label: 'در انتظار مراجعه', count: coupons.filter((c) => c.status === 'pending').length },
    { id: 'used', label: 'استفاده شده', count: coupons.filter((c) => c.status === 'used').length },
    { id: 'expired', label: 'منقضی شده', count: coupons.filter((c) => c.status === 'expired').length },
    { id: 'cancelled', label: 'لغو شده', count: coupons.filter((c) => c.status === 'cancelled').length },
  ];

  const handleRedeem = (code) => {
    const res = redeemCoupon(code);
    setFeedback(res);
    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickInput) return;
    handleRedeem(quickInput);
    setQuickInput('');
  };

  // Filtering
  const filteredCoupons = coupons.filter((c) => {
    // Tab filter
    if (activeTab === 'today') {
      if (c.preferredVisitDate !== '۱۴۰۵/۰۳/۱۸' || c.status !== 'pending') return false;
    } else if (activeTab !== 'all') {
      if (c.status !== activeTab) return false;
    }

    // Search query filter (by code, name, phone, service title)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = c.code.includes(q);
      const matchName = c.customerName.toLowerCase().includes(q);
      const matchPhone = c.customerPhone.includes(q);
      const matchService = c.serviceTitle.toLowerCase().includes(q);
      return matchCode || matchName || matchPhone || matchService;
    }

    return true;
  });

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportExcel = () => {
    const headers = [
      'کد کوپن',
      'نام مشتری',
      'شماره تماس',
      'عنوان خدمت',
      'تاریخ ترجیحی مراجعه',
      'بازه زمانی',
      'قیمت اصلی',
      'درصد تخفیف',
      'مبلغ پرداختی مشتری',
      'سهم خالص سالن',
      'وضعیت',
      'تاریخ ثبت استفاده',
      'مهلت اعتبار',
    ];

    const rows = filteredCoupons.map((c) => [
      c.code,
      c.customerName,
      c.customerPhone,
      c.serviceTitle,
      c.preferredVisitDate,
      c.preferredTimeSlot,
      c.price,
      `${c.discountPercent}%`,
      c.customerPaid,
      c.salonShare,
      c.status === 'pending'
        ? 'در انتظار مراجعه'
        : c.status === 'used'
        ? 'استفاده شده'
        : c.status === 'expired'
        ? 'منقضی شده'
        : 'لغو شده',
      c.usedAt || '-',
      c.expireAt,
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `گزارش_کوپن_های_لوپن_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-kal-3 font-bold bg-amber-50 text-amber-700 border border-amber-200">
            در انتظار مراجعه
          </span>
        );
      case 'used':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-kal-3 font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            استفاده شده
          </span>
        );
      case 'expired':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-kal-3 font-bold bg-slate-100 text-slate-600 border border-slate-200">
            منقضی شده
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-kal-3 font-bold bg-rose-50 text-rose-700 border border-rose-200">
            لغو / مرجوع شده
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Operational Redemption Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-kal-4 font-bold text-lg text-slate-900">سفارشات من و مدیریت کوپن‌ها</h2>
            <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
              مرکز استعلام و ثبت استفاده از مراجعات خریداری‌شده مشتریان از وب‌سایت و اپلیکیشن لوپُن
            </p>
          </div>

          {/* Quick Redemption Box */}
          <form onSubmit={handleQuickSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value.replace(/\D/g, ''))}
                placeholder="کد ۶ رقمی کوپن..."
                className="h-11 px-4 pr-10 text-center font-kal-4 tracking-widest text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F47A20] focus:bg-white text-sm"
              />
              <QrCode className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              disabled={quickInput.length < 5}
              className="h-11 px-4 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 text-white font-kal-3 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              ثبت استفاده
            </button>
          </form>
        </div>

        {/* Operational Feedback alert */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-kal-2 ${
                feedback.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="flex-1 font-kal-3 font-bold">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Tabs & Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-kal-3 font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  active
                    ? 'bg-[#F47A20] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Export bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو با کد، نام مشتری، موبایل یا خدمت..."
              className="w-full h-10 pr-9 pl-4 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F47A20] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-kal-3 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>خروجی اکسل و گزارش مالی (CSV)</span>
          </button>
        </div>
      </div>

      {/* 3. Orders List Table / Cards */}
      {filteredCoupons.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="font-kal-3 font-bold text-slate-700 text-sm">هیچ کوپنی در این بخش یافت نشد</h3>
          <p className="font-kal-1 text-xs text-slate-400">
            با فیلتر یا عبارت جستجوی دیگر بررسی فرمایید.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCoupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Right info (Code + Customer + Service) */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-kal-4 font-bold text-base text-slate-900 bg-slate-100 px-3 py-1 rounded-xl tracking-wider">
                    {coupon.code}
                  </span>
                  {getStatusBadge(coupon.status)}
                  <span className="text-[11px] font-kal-1 text-slate-400">
                    ثبت خرید: {coupon.purchasedAt}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-kal-2 text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F47A20]" />
                    <span className="font-kal-3 font-bold">{coupon.customerName}</span>
                  </div>

                  <div className="flex items-center gap-1.5" dir="ltr">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a
                      href={`tel:${coupon.customerPhone}`}
                      className="text-slate-600 hover:text-[#F47A20] font-kal-1"
                    >
                      {coupon.customerPhone}
                    </a>
                  </div>

                  <div className="text-slate-500">
                    خدمت: <span className="font-kal-3 text-slate-800">{coupon.serviceTitle}</span>
                  </div>
                </div>

                {/* Visit timing & Expiry details */}
                <div className="flex flex-wrap items-center gap-4 text-[11px] font-kal-1 text-slate-500 pt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>تاریخ ترجیحی:</span>
                    <strong className="text-slate-700">{coupon.preferredVisitDate}</strong>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>بازه زمانی ترجیحی:</span>
                    <strong className="text-slate-700">{coupon.preferredTimeSlot}</strong>
                  </div>

                  <div>
                    <span>مهلت استفاده (expireAt):</span>{' '}
                    <strong className="text-slate-700">{coupon.expireAt}</strong>
                  </div>

                  {coupon.usedAt && (
                    <div className="text-emerald-700 font-kal-2">
                      <span>زمان ثبت مراجعه:</span> <strong>{coupon.usedAt}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial summary & Action */}
              <div className="flex items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <div className="text-right lg:text-left space-y-0.5">
                  <div className="text-[11px] text-slate-400 line-through">
                    {coupon.price.toLocaleString('fa-IR')} تومان ({coupon.discountPercent}٪ تخفیف)
                  </div>
                  <div className="text-xs text-slate-600 font-kal-2">
                    پرداخت مشتری: {coupon.customerPaid.toLocaleString('fa-IR')} ت
                  </div>
                  <div className="font-kal-4 font-bold text-sm text-emerald-600">
                    سهم خالص سالن: {coupon.salonShare.toLocaleString('fa-IR')} تومان
                  </div>
                </div>

                {coupon.status === 'pending' && (
                  <button
                    onClick={() => handleRedeem(coupon.code)}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-kal-3 font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>تأیید پذیرش</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
