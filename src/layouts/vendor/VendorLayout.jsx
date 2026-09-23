import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Scissors,
  Layers,
  Users,
  CalendarDays,
  QrCode,
  ArrowRight,
  Menu,
  X,
  Bell,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';
import QuickRedeemModal from '@components/vendor/QuickRedeemModal';
import LoponLogo from '@assets/images/lopon-logo.png';

export default function VendorLayout() {
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [quickRedeemOpen, setQuickRedeemOpen] = useState(false);

  const vendor = useVendorStore((s) => s.vendor);
  const coupons = useVendorStore((s) => s.coupons);
  const toggleVendorActiveStatus = useVendorStore((s) => s.toggleVendorActiveStatus);

  const pendingCouponsCount = coupons.filter((c) => c.status === 'pending').length;

  const NAV_ITEMS = [
    {
      id: 'dashboard',
      path: '/vendor/dashboard',
      altPath: '/vendor',
      label: 'داشبورد کلی',
      icon: LayoutDashboard,
      desc: 'نمای کلی فروش، کوپن‌ها و نوبت‌ها',
    },
    {
      id: 'orders',
      path: '/vendor/orders',
      label: 'سفارشات من',
      icon: ShoppingBag,
      badge: pendingCouponsCount > 0 ? pendingCouponsCount : null,
      desc: 'مدیریت کوپن‌های آنلاین و مراجعات',
    },
    {
      id: 'profile',
      path: '/vendor/profile',
      label: 'مجموعه من',
      icon: Store,
      desc: 'پروفایل، ساعات کاری، موقعیت و تسویه',
    },
    {
      id: 'services',
      path: '/vendor/services',
      label: 'خدمات مجموعه',
      icon: Scissors,
      desc: 'قیمت‌گذاری، تخفیف و محدودیت فروش',
    },
    {
      id: 'catalog',
      path: '/vendor/catalog',
      label: 'خدمات کلی سیستم',
      icon: Layers,
      desc: 'انتخاب خدمت از کاتالوگ مرجع لوپُن',
    },
    {
      id: 'crm',
      path: '/vendor/crm',
      label: 'باشگاه مشتریان',
      icon: Users,
      desc: 'پرونده مشتری، سوابق و ابزار بازاریابی',
    },
    {
      id: 'bookings',
      path: '/vendor/bookings',
      label: 'سفارشات آفلاین سالن',
      icon: CalendarDays,
      desc: 'نوبت‌های تلفنی، تقویم و گزارش صندوق',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800 font-kal-2" dir="rtl">
      {/* Quick Redeem Modal */}
      <QuickRedeemModal isOpen={quickRedeemOpen} onClose={() => setQuickRedeemOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-slate-200/80 shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          {/* Logo & Brand Header */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <Link to="/vendor/dashboard" className="flex items-center gap-3">
                <img src={LoponLogo} alt="لوپُن" className="w-9 h-9 object-contain" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-kal-4 font-bold text-lg text-slate-900 tracking-tight">لوپُـن</span>
                    <span className="text-[10px] bg-orange-100 text-[#F47A20] px-1.5 py-0.5 rounded font-kal-3 font-bold">
                      وندور
                    </span>
                  </div>
                  <p className="text-[11px] font-kal-1 text-slate-400">پنل مدیریت یکپارچه سالن</p>
                </div>
              </Link>
            </div>

            {/* Salon Active Status Badge & Switch */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    vendor.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                  }`}
                />
                <span className="text-xs font-kal-3 text-slate-700">
                  {vendor.isActive ? 'پذیرش مراجعین: باز' : 'پذیرش مراجعین: متوقف'}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleVendorActiveStatus}
                className={`text-[10.5px] px-2.5 py-1 rounded-lg font-kal-3 font-bold transition-all cursor-pointer ${
                  vendor.isActive
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                }`}
              >
                {vendor.isActive ? 'بستن سالن' : 'بازکردن سالن'}
              </button>
            </div>
          </div>

          {/* Quick Action Button in Sidebar */}
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => setQuickRedeemOpen(true)}
              className="w-full h-11 bg-gradient-to-r from-[#F47A20] to-[#ff8c37] hover:from-[#d66311] hover:to-[#F47A20] text-white rounded-xl font-kal-3 font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>استعلام و ثبت سریع کوپن</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const active =
                location.pathname === item.path ||
                (item.altPath && location.pathname === item.altPath) ||
                (item.path !== '/vendor/dashboard' &&
                  item.path !== '/vendor' &&
                  location.pathname.startsWith(item.path));

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs transition-all ${
                    active
                      ? 'bg-[#F47A20] text-white font-kal-3 font-bold shadow-md shadow-orange-500/15'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-kal-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        active ? 'text-white' : 'text-slate-400 group-hover:text-[#F47A20]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-kal-3 font-bold ${
                        active ? 'bg-white text-[#F47A20]' : 'bg-orange-100 text-[#F47A20]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Salon Card & Client Mode Link */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/60">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 mb-2">
              <img
                src={vendor.coverImage}
                alt={vendor.title}
                className="w-10 h-10 rounded-lg object-cover border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-kal-3 font-bold text-xs text-slate-800 truncate">{vendor.title}</h4>
                <p className="text-[10px] font-kal-1 text-slate-400 truncate">{vendor.city} - {vendor.category}</p>
              </div>
            </div>

            <Link
              to="/"
              className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-kal-3 text-slate-500 hover:text-[#F47A20] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده در نمای کاربران سایت</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </aside>

        {/* ================= MOBILE DRAWER ================= */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileDrawerOpen(false)}
                className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 z-50 w-72 bg-white flex flex-col shadow-2xl lg:hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={LoponLogo} alt="لوپُن" className="w-8 h-8 object-contain" />
                    <div>
                      <span className="font-kal-4 font-bold text-slate-900 text-sm">پنل مدیریت لوپُن</span>
                      <p className="text-[10px] text-slate-400 font-kal-1">{vendor.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3">
                  <button
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      setQuickRedeemOpen(true);
                    }}
                    className="w-full h-11 bg-[#F47A20] text-white rounded-xl font-kal-3 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>استعلام و ثبت سریع کوپن</span>
                  </button>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                  {NAV_ITEMS.map((item) => {
                    const active =
                      location.pathname === item.path ||
                      (item.altPath && location.pathname === item.altPath) ||
                      (item.path !== '/vendor/dashboard' &&
                        item.path !== '/vendor' &&
                        location.pathname.startsWith(item.path));

                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs ${
                          active
                            ? 'bg-[#F47A20] text-white font-kal-3 font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-[#F47A20] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>

                <div className="p-3 border-t border-slate-100">
                  <Link
                    to="/"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between w-full px-3 py-2.5 text-xs font-kal-3 text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl"
                  >
                    <span>مشاهده نمای کاربران سایت</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
            {/* Left in RTL (Menu toggle + Page Title) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-kal-3 font-bold text-slate-900 text-sm sm:text-base">
                  {NAV_ITEMS.find(
                    (n) =>
                      location.pathname === n.path ||
                      (n.altPath && location.pathname === n.altPath) ||
                      (n.path !== '/vendor/dashboard' &&
                        n.path !== '/vendor' &&
                        location.pathname.startsWith(n.path))
                  )?.label || 'پنل وندور'}
                </h1>
                <p className="text-[11px] font-kal-1 text-slate-400 hidden sm:block">
                  {NAV_ITEMS.find(
                    (n) =>
                      location.pathname === n.path ||
                      (n.altPath && location.pathname === n.altPath) ||
                      (n.path !== '/vendor/dashboard' &&
                        n.path !== '/vendor' &&
                        location.pathname.startsWith(n.path))
                  )?.desc}
                </p>
              </div>
            </div>

            {/* Right in RTL (Quick Redeem button + Vendor Status + Public link) */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setQuickRedeemOpen(true)}
                className="h-10 px-3.5 bg-orange-50 hover:bg-orange-100 text-[#F47A20] border border-orange-200 rounded-xl font-kal-3 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">ثبت سریع کوپن</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    vendor.isActive ? 'bg-emerald-500' : 'bg-rose-400'
                  }`}
                />
                <span className="text-slate-600 font-kal-2 text-xs">
                  {vendor.isActive ? 'سالن باز است' : 'سالن بسته است'}
                </span>
              </div>

              <Link
                to="/"
                className="hidden md:flex items-center gap-1.5 text-xs font-kal-3 text-slate-600 hover:text-[#F47A20] px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                title="مشاهده نمای کاربری سایت"
              >
                <span>نمای سایت</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </header>

          {/* Scrollable View Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        {[
          { id: 'dash', to: '/vendor/dashboard', label: 'داشبورد', icon: LayoutDashboard },
          { id: 'orders', to: '/vendor/orders', label: 'سفارشات', icon: ShoppingBag, badge: pendingCouponsCount },
          { id: 'bookings', to: '/vendor/bookings', label: 'نوبت‌ها', icon: CalendarDays },
          { id: 'services', to: '/vendor/services', label: 'خدمات', icon: Scissors },
          { id: 'crm', to: '/vendor/crm', label: 'باشگاه', icon: Users },
        ].map((tab) => {
          const active =
            location.pathname === tab.to ||
            (tab.to === '/vendor/dashboard' && location.pathname === '/vendor');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-colors relative ${
                active ? 'text-[#F47A20]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#F47A20] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-kal-3 ${active ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
