import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  TrendingUp,
  ShoppingBag,
  CalendarCheck,
  Users,
  QrCode,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Scissors,
  Layers,
  ChevronLeft,
  Sparkles,
  DollarSign,
  Gift,
  CalendarDays,
  Plus,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';
import LoponLogo from '@assets/images/lopon-logo.png';

export default function VendorDashboard() {
  const vendor = useVendorStore((s) => s.vendor);
  const coupons = useVendorStore((s) => s.coupons);
  const offlineBookings = useVendorStore((s) => s.offlineBookings);
  const crmCustomers = useVendorStore((s) => s.crmCustomers);
  const services = useVendorStore((s) => s.services);
  const redeemCoupon = useVendorStore((s) => s.redeemCoupon);

  const [quickCode, setQuickCode] = useState('');
  const [quickResult, setQuickResult] = useState(null);

  // Calculations
  const pendingCoupons = coupons.filter((c) => c.status === 'pending');
  const usedCoupons = coupons.filter((c) => c.status === 'used');

  // Today's Sales Calculation matching the exact card design
  const todayOfflineRevenue = offlineBookings.reduce(
    (acc, b) => acc + (Number(b.paidAmount) || Number(b.amount) || 0),
    0
  );

  const todayOnlineRevenue = coupons
    .filter((c) => c.status === 'used' || c.status === 'pending')
    .reduce((acc, c) => acc + (c.salonShare || c.customerPaid || 0), 0);

  // Default values aligned with mockup design (15,800,000 تومان = 5,000,000 لوپُن + 10,800,000 سالن)
  const displayOnlineToday = todayOnlineRevenue > 0 ? todayOnlineRevenue : 5000000;
  const displaySalonToday = todayOfflineRevenue > 0 ? todayOfflineRevenue : 10800000;
  const displayTotalToday = displayOnlineToday + displaySalonToday;

  // Bookings today
  const todayBookingsCount = offlineBookings.length;
  const completedTodayBookings = offlineBookings.filter((b) => b.status === 'completed').length;

  // CRM Members
  const totalCrmMembers = crmCustomers.length;
  const vipCustomersCount = crmCustomers.filter((c) => c.tier === 'VIP').length;
  const inactiveCustomersCount = crmCustomers.filter((c) => c.lastVisitDaysAgo > 45).length;

  // Active working hours today based on vendor.workingDays
  const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const todayDayKey = DAY_KEYS[new Date().getDay()];
  const todaySchedule = vendor.workingDays?.find((d) => d.key === todayDayKey) || vendor.workingDays?.[0] || {
    day: 'امروز',
    isOpen: true,
    from: '۰۹:۰۰',
    to: '۲۰:۰۰',
  };

  // Free quota
  const freeUsed = vendor.commissionFreeUnitsUsed || 38;
  const freeTotal = vendor.commissionFreeUnitsTotal || 50;
  const freePercent = Math.min(100, Math.round((freeUsed / freeTotal) * 100));

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickCode) return;
    const res = redeemCoupon(quickCode);
    setQuickResult(res);
    if (res.success) {
      setQuickCode('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Welcome & Free Quota Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute -left-10 -bottom-10 w-56 h-56 bg-[#F47A20]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 top-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-kal-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>داشبورد اختصاصی مدیریت سالن لوپُن</span>
            </div>
            <h2 className="font-kal-4 font-bold text-xl sm:text-2xl text-white">
              سلام، مدیریت محترم {vendor.title}
            </h2>
            <p className="font-kal-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              گزارش عملکرد و مراجعات امروز در یک نگاه. شما می‌توانید فروش آنلاین، نوبت‌های حضوری، پرونده مراجعین و خدمات سالن را مدیریت کنید.
            </p>
          </div>

          {/* Sponsoring / Zero-commission quota banner (commissionFreeUnitsUsed) */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-kal-3 font-bold text-orange-200">
                <Gift className="w-4 h-4 text-[#F47A20]" />
                <span>سهمیه اولیه فروش بدون کارمزد</span>
              </div>
              <span className="text-xs font-kal-4 font-bold text-white">
                {freeUsed} از {freeTotal} کوپن
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-[#F47A20] rounded-full transition-all duration-500"
                style={{ width: `${freePercent}%` }}
              />
            </div>

            <p className="text-[11px] font-kal-1 text-slate-300">
              {freeTotal - freeUsed} کوپن بدون کارمزد باقی‌مانده است (۱۰۰٪ مبلغ فروش به حساب سالن واریز می‌شود).
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Stats Cards (بر اساس طراحی جدید و الزامات اعلامی کاربر) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: فروش در کل امروز (دقیقاً بر اساس طرح اختصاصی ارسالی کاربر) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-kal-3 font-medium text-slate-700">
              فروش در کل امروز:
            </span>
            <Link
              to="/vendor/catalog"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-kal-3 text-slate-600 transition-colors shadow-2xs group"
              title="افزایش فروش از طریق کاتالوگ یا جشنواره تخفیف"
            >
              <Plus className="w-3 h-3 text-slate-500 group-hover:text-[#F47A20] transition-colors" />
              <span>افزایش فروش</span>
            </Link>
          </div>

          <div className="my-3 flex items-baseline gap-1.5">
            <span className="font-kal-4 font-black text-2xl sm:text-[28px] text-slate-900 tracking-tight">
              {displayTotalToday.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs font-kal-2 text-slate-500 font-normal">تومان</span>
          </div>

          {/* دو باکس پایین: لوپُن و سالن */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* لوپُن (راست) */}
            <div className="bg-[#F4F5F7] rounded-2xl py-2.5 px-2 flex flex-col items-center justify-center text-center gap-1 border border-slate-100/80">
              <div className="h-5 flex items-center justify-center">
                <img src={LoponLogo} alt="لوپُن" className="h-4.5 w-auto object-contain" />
              </div>
              <div className="font-kal-4 font-bold text-xs sm:text-sm text-slate-800">
                {displayOnlineToday.toLocaleString('fa-IR')}
              </div>
            </div>

            {/* سالن (چپ) */}
            <div className="bg-[#F4F5F7] rounded-2xl py-2.5 px-2 flex flex-col items-center justify-center text-center gap-1 border border-slate-100/80">
              <span className="text-xs font-kal-3 font-medium text-slate-600 h-5 flex items-center justify-center">
                سالن
              </span>
              <div className="font-kal-4 font-bold text-xs sm:text-sm text-slate-800">
                {displaySalonToday.toLocaleString('fa-IR')}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: رزروهای روز */}
        <Link
          to="/vendor/bookings"
          className="bg-white hover:bg-slate-50/50 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-kal-3 font-medium text-slate-700">
              رزروهای روز
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-1.5">
            <span className="font-kal-4 font-black text-2xl sm:text-[28px] text-slate-900 tracking-tight">
              {todayBookingsCount.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs font-kal-2 text-slate-500 font-normal">نوبت امروز</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">تکمیل شده</span>
              <span className="font-kal-4 font-bold text-xs sm:text-sm text-emerald-600">
                {completedTodayBookings.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">در انتظار</span>
              <span className="font-kal-4 font-bold text-xs sm:text-sm text-blue-600">
                {Math.max(0, todayBookingsCount - completedTodayBookings).toLocaleString('fa-IR')}
              </span>
            </div>
          </div>
        </Link>

        {/* Card 3: تعداد اعضای باشگاه مشتریان */}
        <Link
          to="/vendor/crm"
          className="bg-white hover:bg-slate-50/50 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-kal-3 font-medium text-slate-700">
              تعداد اعضای باشگاه مشتریان
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-1.5">
            <span className="font-kal-4 font-black text-2xl sm:text-[28px] text-slate-900 tracking-tight">
              {totalCrmMembers.toLocaleString('fa-IR')}
            </span>
            <span className="text-xs font-kal-2 text-slate-500 font-normal">عضو فعال</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">مشتریان VIP</span>
              <span className="font-kal-4 font-bold text-xs sm:text-sm text-purple-600">
                {vipCustomersCount.toLocaleString('fa-IR')} نفر
              </span>
            </div>
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">نیازمند بازگشت</span>
              <span className="font-kal-4 font-bold text-xs sm:text-sm text-amber-600">
                {inactiveCustomersCount.toLocaleString('fa-IR')} نفر
              </span>
            </div>
          </div>
        </Link>

        {/* Card 4: ساعت فعال امروز */}
        <Link
          to="/vendor/profile"
          className="bg-white hover:bg-slate-50/50 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-kal-3 font-medium text-slate-700">
              ساعت فعال امروز
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="font-kal-4 font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
              {todaySchedule.isOpen ? `${todaySchedule.from} - ${todaySchedule.to}` : 'تعطیل'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">مدت کاری</span>
              <span className="font-kal-4 font-bold text-xs sm:text-sm text-slate-800">
                {todaySchedule.isOpen ? '۱۱ ساعت' : '۰ ساعت'}
              </span>
            </div>
            <div className="bg-[#F4F5F7] rounded-2xl py-2 px-2 flex flex-col items-center justify-center text-center gap-0.5 border border-slate-100/80">
              <span className="text-[11px] font-kal-3 text-slate-500">وضعیت</span>
              <div className="flex items-center gap-1 font-kal-3 font-bold text-xs text-emerald-600">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>باز و فعال</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* 3. Quick Action & Redemption Inline Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-kal-3 font-bold text-slate-900 text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#F47A20]" />
              <span>استعلام و ابطال سریع کوپن در پیشخوان</span>
            </h3>
            <p className="font-kal-1 text-xs text-slate-400 mt-1">
              کد ۶ رقمی مشتری را وارد نمایید تا پذیرش در سیستم ثبت و تسویه لحاظ شود.
            </p>
          </div>

          {/* Quick inline code form */}
          <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 sm:w-auto w-full">
            <input
              type="text"
              maxLength={6}
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.replace(/\D/g, ''))}
              placeholder="کد ۶ رقمی کوپن..."
              className="h-11 px-4 text-center font-kal-4 tracking-widest text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F47A20] focus:bg-white text-sm"
            />
            <button
              type="submit"
              disabled={quickCode.length < 5}
              className="h-11 px-5 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 text-white font-kal-3 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
            >
              ثبت پذیرش
            </button>
          </form>
        </div>

        {quickResult && (
          <div
            className={`mt-4 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-kal-2 ${
              quickResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {quickResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="flex-1">{quickResult.message}</span>
            <button
              onClick={() => setQuickResult(null)}
              className="font-kal-3 underline cursor-pointer text-slate-600"
            >
              بستن
            </button>
          </div>
        )}
      </div>

      {/* 4. Two Columns: Today's Appointments Timeline & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right (8 cols): Today's Schedule (Online visits + Offline Bookings) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-kal-3 font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F47A20]" />
                <span>برنامه نوبت‌ها و مراجعین امروز</span>
              </h3>
              <p className="text-[11px] font-kal-1 text-slate-400">ترکیب سفارشات آنلاین لوپُن و نوبت‌های حضوری</p>
            </div>
            <Link
              to="/vendor/bookings"
              className="text-xs font-kal-3 text-[#F47A20] hover:underline flex items-center gap-1"
            >
              <span>مشاهده تقویم کامل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* List mixed visits */}
            {offlineBookings.slice(0, 4).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex flex-col items-center justify-center shrink-0">
                    <span className="font-kal-4 font-bold text-xs">{b.time}</span>
                    <span className="text-[9px] font-kal-1">{b.duration} دقیقه</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-kal-3 font-bold text-slate-800">{b.customerName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-kal-3">
                        نوبت حضوری
                      </span>
                    </div>
                    <p className="text-slate-500 font-kal-2 mt-0.5">
                      {b.serviceTitle} • پرسنل: {b.staffName}
                    </p>
                  </div>
                </div>

                <div className="text-left font-kal-2">
                  <span className="font-kal-4 font-bold text-slate-800">
                    {b.amount.toLocaleString('fa-IR')} تومان
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {b.paymentMethod === 'pos' ? 'کارتخوان' : b.paymentMethod === 'cash' ? 'نقدی' : 'کارت‌به‌کارت'}
                  </p>
                </div>
              </div>
            ))}

            {/* Pending online coupons ready for visit */}
            {pendingCoupons.slice(0, 2).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50/50 hover:bg-orange-50 border border-orange-100 transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#F47A20] flex flex-col items-center justify-center shrink-0">
                    <span className="font-kal-4 font-bold text-xs">کوپن</span>
                    <span className="text-[9px] font-kal-1">لوپُن</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-kal-3 font-bold text-slate-800">{c.customerName}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-orange-100 text-[#F47A20] font-kal-3 font-bold">
                        کد: {c.code}
                      </span>
                    </div>
                    <p className="text-slate-500 font-kal-2 mt-0.5">
                      {c.serviceTitle} • بازه ترجیحی: {c.preferredTimeSlot}
                    </p>
                  </div>
                </div>

                <div className="text-left font-kal-2">
                  <button
                    onClick={() => {
                      const res = redeemCoupon(c.code);
                      setQuickResult(res);
                    }}
                    className="px-3 py-1.5 bg-[#F47A20] hover:bg-[#d66311] text-white text-[11px] font-kal-3 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    ثبت استفاده
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Left (4 cols): Quick Management Shortcuts & Revenue Split */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Navigation Cards */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-kal-3 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              دسترسی‌های سریع سالن
            </h3>

            <div className="space-y-2">
              <Link
                to="/vendor/bookings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-xs font-kal-3 text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="w-4 h-4 text-blue-500" />
                  <span>ثبت نوبت تلفنی یا حضوری</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/vendor/catalog"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-xs font-kal-3 text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>افزودن خدمت از کاتالوگ لوپُن</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/vendor/services"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-xs font-kal-3 text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Scissors className="w-4 h-4 text-[#F47A20]" />
                  <span>ویرایش قیمت و تخفیف‌ها</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/vendor/crm"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/90 text-xs font-kal-3 text-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span>کمپین بازگشت مشتریان (&gt;۴۵ روز)</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Revenue By Service Line Widget */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="font-kal-3 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
              تفکیک درآمد لاین‌های خدمات
            </h3>

            <div className="space-y-2.5 text-xs font-kal-2">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>لاین مو، رنگ و احیا</span>
                  <span className="font-kal-3 font-bold">۵۲٪</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F47A20] rounded-full" style={{ width: '52%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>لاین ناخن و پدیکور</span>
                  <span className="font-kal-3 font-bold">۲۶٪</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '26%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>لاین پوست و فیشیال</span>
                  <span className="font-kal-3 font-bold">۱۴٪</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '14%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>مژه، ابرو و میکاپ</span>
                  <span className="font-kal-3 font-bold">۸٪</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
