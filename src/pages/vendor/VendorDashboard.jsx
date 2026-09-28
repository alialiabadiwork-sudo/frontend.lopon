import React, { useState, useMemo } from 'react';
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
  ChevronRight,
  Sparkles,
  DollarSign,
  Gift,
  CalendarDays,
  Plus,
  Store,
  Globe,
  Phone,
  User,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';
import LoponLogo from '@assets/images/lopon-logo.png';

const faToEnDigits = (str) => {
  if (!str) return '';
  return String(str).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
};

const SCHEDULE_DAYS = [
  { id: '1405-03-18', dateStr: '۱۴۰۵/۰۳/۱۸', dayNum: '۱۸', dayName: 'شنبه', fullDate: 'شنبه ۱۸ خرداد (امروز)' },
  { id: '1405-03-19', dateStr: '۱۴۰۵/۰۳/۱۹', dayNum: '۱۹', dayName: 'یکشنبه', fullDate: 'یکشنبه ۱۹ خرداد' },
  { id: '1405-03-20', dateStr: '۱۴۰۵/۰۳/۲۰', dayNum: '۲۰', dayName: 'دوشنبه', fullDate: 'دوشنبه ۲۰ خرداد' },
  { id: '1405-03-21', dateStr: '۱۴۰۵/۰۳/۲۱', dayNum: '۲۱', dayName: 'سه‌شنبه', fullDate: 'سه‌شنبه ۲۱ خرداد' },
  { id: '1405-03-22', dateStr: '۱۴۰۵/۰۳/۲۲', dayNum: '۲۲', dayName: 'چهارشنبه', fullDate: 'چهارشنبه ۲۲ خرداد' },
  { id: '1405-03-23', dateStr: '۱۴۰۵/۰۳/۲۳', dayNum: '۲۳', dayName: 'پنج‌شنبه', fullDate: 'پنج‌شنبه ۲۳ خرداد' },
  { id: '1405-03-24', dateStr: '۱۴۰۵/۰۳/۲۴', dayNum: '۲۴', dayName: 'جمعه', fullDate: 'جمعه ۲۴ خرداد' },
];

const TIMELINE_HOURS = [
  { hour: 9, label: '۰۹:۰۰' },
  { hour: 10, label: '۱۰:۰۰' },
  { hour: 11, label: '۱۱:۰۰' },
  { hour: 12, label: '۱۲:۰۰' },
  { hour: 13, label: '۱۳:۰۰' },
  { hour: 14, label: '۱۴:۰۰' },
  { hour: 15, label: '۱۵:۰۰' },
  { hour: 16, label: '۱۶:۰۰' },
  { hour: 17, label: '۱۷:۰۰' },
  { hour: 18, label: '۱۸:۰۰' },
  { hour: 19, label: '۱۹:۰۰' },
  { hour: 20, label: '۲۰:۰۰' },
];

const OTHER_DAYS_APPOINTMENTS = {
  '1405-03-19': [
    {
      id: 'od_19_1',
      type: 'online',
      serviceTitle: 'رنگ و لایت بالیاژ اروپایی',
      categoryName: 'رنگ و مو',
      customerName: 'مریم منصوری',
      customerPhone: '۰۹۱۳۴۵۶۹۸۷۴',
      staffName: 'نازنین ابراهیمی',
      timeString: '۱۰:۰۰ تا ۱۳:۰۰',
      startHour: 10,
      code: '357159',
      amount: 2800000,
      status: 'pending',
    },
    {
      id: 'od_19_2',
      type: 'offline',
      serviceTitle: 'کاشت ناخن با ژل و مانیکور روسی',
      categoryName: 'ناخن و پدیکور',
      customerName: 'نگار صادقی',
      customerPhone: '۰۹۱۳۲۲۴۵۱۸۰',
      staffName: 'مهسا مرادی',
      timeString: '۱۴:۰۰ تا ۱۵:۳۰',
      startHour: 14,
      amount: 700000,
      status: 'confirmed',
    },
    {
      id: 'od_19_3',
      type: 'offline',
      serviceTitle: 'میکاپ لایت اروپایی و شینیون',
      categoryName: 'میکاپ و گریم',
      customerName: 'الهام رستمی',
      customerPhone: '۰۹۱۹۳۳۴۵۶۷۸',
      staffName: 'سارا حسینی',
      timeString: '۱۷:۰۰ تا ۱۸:۳۰',
      startHour: 17,
      amount: 1800000,
      status: 'confirmed',
    },
  ],
  '1405-03-20': [
    {
      id: 'od_20_1',
      type: 'online',
      serviceTitle: 'پدیکور و کفسابی VIP با جکوزی',
      categoryName: 'ناخن و پدیکور',
      customerName: 'آرزو کمالی',
      customerPhone: '۰۹۱۹۸۷۶۵۴۳۲',
      staffName: 'مهسا مرادی',
      timeString: '۱۱:۰۰ تا ۱۲:۳۰',
      startHour: 11,
      code: '159753',
      amount: 550000,
      status: 'pending',
    },
    {
      id: 'od_20_2',
      type: 'offline',
      serviceTitle: 'لیفت و لمینت ابرو با کراتین طبیعی',
      categoryName: 'مژه و ابرو',
      customerName: 'مهسا صبوری',
      customerPhone: '۰۹۳۷۴۴۵۱۲۸۰',
      staffName: 'سارا حسینی',
      timeString: '۱۵:۰۰ تا ۱۶:۰۰',
      startHour: 15,
      amount: 420000,
      status: 'confirmed',
    },
    {
      id: 'od_20_3',
      type: 'online',
      serviceTitle: 'کراتینه و احیای ابریشمی مو',
      categoryName: 'مو و کراتین',
      customerName: 'سحر تهرانی',
      customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
      staffName: 'نازنین ابراهیمی',
      timeString: '۱۷:۰۰ تا ۱۹:۳۰',
      startHour: 17,
      code: '963852',
      amount: 1650000,
      status: 'pending',
    },
  ],
  '1405-03-21': [
    {
      id: 'od_21_1',
      type: 'offline',
      serviceTitle: 'پاکسازی و لیفت جوانسازی پلاژن',
      categoryName: 'پوست و فیشیال',
      customerName: 'طاهره مرادی',
      customerPhone: '۰۹۱۳۱۴۵۶۷۲۲',
      staffName: 'یلدا رحیمی',
      timeString: '۰۹:۳۰ تا ۱۱:۰۰',
      startHour: 9,
      amount: 1500000,
      status: 'confirmed',
    },
    {
      id: 'od_21_2',
      type: 'online',
      serviceTitle: 'اکستنشن مژه اسپایکی و والیوم روسی',
      categoryName: 'مژه و ابرو',
      customerName: 'زهرا حیدری',
      customerPhone: '۰۹۳۵۴۴۵۱۱۲۰',
      staffName: 'سارا حسینی',
      timeString: '۱۳:۰۰ تا ۱۴:۳۰',
      startHour: 13,
      code: '654321',
      amount: 850000,
      status: 'pending',
    },
    {
      id: 'od_21_3',
      type: 'offline',
      serviceTitle: 'ترمیم ناخن با ژل و دیزاین',
      categoryName: 'ناخن و پدیکور',
      customerName: 'کیمیا باقری',
      customerPhone: '۰۹۱۲۷۷۸۹۹۰۰',
      staffName: 'مهسا مرادی',
      timeString: '۱۶:۰۰ تا ۱۷:۳۰',
      startHour: 16,
      amount: 450000,
      status: 'confirmed',
    },
  ],
  '1405-03-22': [
    {
      id: 'od_22_1',
      type: 'offline',
      serviceTitle: 'ترمیم کاشت ناخن و لمینت استحکام‌بخش',
      categoryName: 'ناخن و پدیکور',
      customerName: 'مبینا کاربخش',
      customerPhone: '۰۹۱۳۸۸۲۴۵۹۰',
      staffName: 'مهسا مرادی',
      timeString: '۱۰:۰۰ تا ۱۱:۳۰',
      startHour: 10,
      amount: 350000,
      status: 'confirmed',
    },
    {
      id: 'od_22_2',
      type: 'online',
      serviceTitle: 'فیشیال تخصصی پوست و هیدرودرمی',
      categoryName: 'پوست و فیشیال',
      customerName: 'بهاره کریمی',
      customerPhone: '۰۹۱۳۶۶۷۸۹۰۱',
      staffName: 'یلدا رحیمی',
      timeString: '۱۴:۰۰ تا ۱۵:۳۰',
      startHour: 14,
      code: '452178',
      amount: 770000,
      status: 'pending',
    },
    {
      id: 'od_22_3',
      type: 'offline',
      serviceTitle: 'براشینگ هالیوودی و حالت‌دهی مو',
      categoryName: 'مو و کراتین',
      customerName: 'نازنین ابراهیمی',
      customerPhone: '۰۹۱۳۱۲۳۴۵۶۷',
      staffName: 'سارا حسینی',
      timeString: '۱۸:۰۰ تا ۱۹:۰۰',
      startHour: 18,
      amount: 450000,
      status: 'confirmed',
    },
  ],
  '1405-03-23': [
    {
      id: 'od_23_1',
      type: 'offline',
      serviceTitle: 'رنگ و لایت فویلی و آمبره',
      categoryName: 'مو و کراتین',
      customerName: 'نیلوفر افشار',
      customerPhone: '۰۹۳۹۱۱۲۲۳۳۴',
      staffName: 'نازنین ابراهیمی',
      timeString: '۱۰:۰۰ تا ۱۳:۰۰',
      startHour: 10,
      amount: 3200000,
      status: 'confirmed',
    },
    {
      id: 'od_23_2',
      type: 'online',
      serviceTitle: 'مانیکور روسی و ژلیش ناخن دست',
      categoryName: 'ناخن و پدیکور',
      customerName: 'شیوا ابراهیمی',
      customerPhone: '۰۹۱۳۳۴۰۵۵۲۱',
      staffName: 'مهسا مرادی',
      timeString: '۱۲:۰۰ تا ۱۳:۰۰',
      startHour: 12,
      code: '882190',
      amount: 280000,
      status: 'pending',
    },
    {
      id: 'od_23_3',
      type: 'offline',
      serviceTitle: 'بوتاکس و احیای ابریشمی مو',
      categoryName: 'مو و کراتین',
      customerName: 'مریم منصوری',
      customerPhone: '۰۹۱۳۴۵۶۹۸۷۴',
      staffName: 'نازنین ابراهیمی',
      timeString: '۱۵:۰۰ تا ۱۷:۰۰',
      startHour: 15,
      amount: 2100000,
      status: 'confirmed',
    },
  ],
  '1405-03-24': [
    {
      id: 'od_24_1',
      type: 'offline',
      serviceTitle: 'میکاپ و گریم تخصصی عروس و همراهان',
      categoryName: 'میکاپ و گریم',
      customerName: 'پریسا نامدار',
      customerPhone: '۰۹۳۹۵۵۴۱۲۳۱',
      staffName: 'سارا حسینی',
      timeString: '۱۱:۰۰ تا ۱۴:۰۰',
      startHour: 11,
      amount: 4500000,
      status: 'confirmed',
    },
    {
      id: 'od_24_2',
      type: 'offline',
      serviceTitle: 'شینیون کلاسیک اروپایی',
      categoryName: 'مو و کراتین',
      customerName: 'شبنم اکبری',
      customerPhone: '۰۹۱۲۹۹۸۸۷۷۶',
      staffName: 'نازنین ابراهیمی',
      timeString: '۱۴:۰۰ تا ۱۵:۳۰',
      startHour: 14,
      amount: 1200000,
      status: 'confirmed',
    },
  ],
};

export default function VendorDashboard() {
  const vendor = useVendorStore((s) => s.vendor);
  const coupons = useVendorStore((s) => s.coupons);
  const offlineBookings = useVendorStore((s) => s.offlineBookings);
  const crmCustomers = useVendorStore((s) => s.crmCustomers);
  const services = useVendorStore((s) => s.services);
  const redeemCoupon = useVendorStore((s) => s.redeemCoupon);
  const dailyMissions = useVendorStore((s) => s.dailyMissions || []);
  const toggleDailyMission = useVendorStore((s) => s.toggleDailyMission);
  const quickRedeemModalOpen = useVendorStore((s) => s.quickRedeemModalOpen);
  const setQuickRedeemModalOpen = useVendorStore((s) => s.setQuickRedeemModalOpen);

  const [quickCode, setQuickCode] = useState('');
  const [quickResult, setQuickResult] = useState(null);

  // Modal States
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editBookingModalOpen, setEditBookingModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [createBookingModalOpen, setCreateBookingModalOpen] = useState(false);
  const [targetSlotHour, setTargetSlotHour] = useState('۱۰:۰۰');

  const updateOfflineBooking = useVendorStore((s) => s.updateOfflineBooking);
  const deleteOfflineBooking = useVendorStore((s) => s.deleteOfflineBooking);
  const addOfflineBooking = useVendorStore((s) => s.addOfflineBooking);

  const openCustomerModal = (name, phone) => {
    const found = crmCustomers.find((c) => c.phone === phone || c.name === name);
    if (found) {
      setSelectedCustomer(found);
    } else {
      setSelectedCustomer({
        name,
        phone,
        tier: 'silver',
        totalLtv: 5000000,
        staffNotes: ['مشتری خوش‌برخورد و وقت‌شناس سالن'],
        customerReviews: [
          {
            id: 'rev_1',
            text: 'کار خانوم مرادی عالی بود یکی از بهترین های کرمان که میشه رفت پیشون',
            rating: 5,
            date: 'امروز',
          },
        ],
      });
    }
    setCustomerModalOpen(true);
  };

  // Selected Schedule Day State (defaults to 18th Saturday / Today)
  const [selectedScheduleDayId, setSelectedScheduleDayId] = useState('1405-03-18');
  const selectedDayObj = SCHEDULE_DAYS.find((d) => d.id === selectedScheduleDayId) || SCHEDULE_DAYS[0];

  // Process today's mixed appointments (offline bookings + online coupons)
  const todayAppointments = useMemo(() => {
    const list = [];

    // Offline bookings
    offlineBookings.forEach((b) => {
      let hour = 10;
      if (b.time) {
        const enTime = faToEnDigits(b.time);
        const parts = enTime.split(':');
        const parsed = parseInt(parts[0], 10);
        if (!isNaN(parsed)) hour = parsed;
      }
      list.push({
        id: b.id,
        type: 'offline',
        serviceTitle: b.serviceTitle,
        categoryName: b.serviceLine || 'ناخن و پدیکور',
        customerName: b.customerName,
        customerPhone: b.customerPhone,
        staffName: b.staffName,
        timeString: `ساعت ${b.time} (${b.duration} دقیقه)`,
        startHour: hour,
        amount: b.amount,
        status: b.status,
      });
    });

    // Online coupons ready/pending for visit
    coupons.forEach((c) => {
      let hour = 15;
      if (c.preferredTimeSlot) {
        const enSlot = faToEnDigits(c.preferredTimeSlot);
        const match = enSlot.match(/\d+/);
        if (match) hour = parseInt(match[0], 10);
      }
      list.push({
        id: c.id,
        type: 'online',
        serviceTitle: c.serviceTitle,
        categoryName: c.serviceCategory === 'ناخن' ? 'ناخن و پدیکور' : c.serviceCategory === 'پوست' ? 'پوست و فیشیال' : 'رنگ و مو',
        customerName: c.customerName,
        customerPhone: c.customerPhone,
        staffName: 'لاین تخصصی سالن',
        timeString: `بازه ترجیحی ${c.preferredTimeSlot || '۱۵:۰۰ تا ۱۸:۰۰'}`,
        startHour: hour,
        code: c.code,
        amount: c.salonShare || c.customerPaid,
        status: c.status,
      });
    });

    return list;
  }, [offlineBookings, coupons]);

  // Active appointments for selected day
  const activeDayAppointments = useMemo(() => {
    if (selectedScheduleDayId === '1405-03-18') {
      return todayAppointments;
    }
    return OTHER_DAYS_APPOINTMENTS[selectedScheduleDayId] || [];
  }, [selectedScheduleDayId, todayAppointments]);

  const getAppointmentsForHour = (h) => {
    return activeDayAppointments.filter((item) => item.startHour === h);
  };

  // Daily Missions Calculations
  const completedMissionsCount = dailyMissions.filter((m) => m.completed).length;
  const missionsProgressPercent = dailyMissions.length > 0
    ? Math.round((completedMissionsCount / dailyMissions.length) * 100)
    : 0;

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
            <div className="bg-[#F4F5F7] rounded-2xl py-2.5 px-2 flex flex-col items-center justify-center text-center gap-1.5 border border-slate-100/80">
              <div className="h-6 flex items-center justify-center">
                <img src="/lopon-logo-icon.png" alt="لوپُن" className="h-5 w-auto object-contain mx-auto" />
              </div>
              <div className="font-kal-4 font-bold text-xs sm:text-sm text-slate-800">
                {displayOnlineToday.toLocaleString('fa-IR')} تومان
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

      {/* 4. Intelligent Schedule Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-kal-2 text-slate-500">
            <span>ساعت کار مفید سالن:</span>
            <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><Clock className="w-3.5 h-3.5" /></span>
          </div>
          <div className="font-kal-4 font-black text-xl text-slate-900">۷.۵ <span className="text-xs font-normal text-slate-400">ساعت پر</span></div>
          <span className="text-[10px] font-kal-3 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">نوبت‌های در حال ارائه</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-kal-2 text-slate-500">
            <span>ظرفیت خالی و بیکاری:</span>
            <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center"><Clock className="w-3.5 h-3.5" /></span>
          </div>
          <div className="font-kal-4 font-black text-xl text-amber-600">۳.۵ <span className="text-xs font-normal text-slate-400">ساعت خالی</span></div>
          <span className="text-[10px] font-kal-3 text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-bold">آماده پذیرش و رزرو سریع</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-kal-2 text-slate-500">
            <span>سفارشات آنلاین لوپُن:</span>
            <img src="/lopon-logo-icon.png" alt="" className="h-3.5 w-auto object-contain" />
          </div>
          <div className="font-kal-4 font-black text-xl text-[#F47A20]">۴ <span className="text-xs font-normal text-slate-400">نوبت</span></div>
          <span className="text-[10px] font-kal-3 text-orange-700 bg-orange-50 px-2 py-0.5 rounded font-bold">غیرقابل ویرایش از سالن</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-kal-2 text-slate-500">
            <span>نوبت‌های حضوری سالن:</span>
            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><Scissors className="w-3.5 h-3.5" /></span>
          </div>
          <div className="font-kal-4 font-black text-xl text-blue-600">۵ <span className="text-xs font-normal text-slate-400">نوبت</span></div>
          <span className="text-[10px] font-kal-3 text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">دارای امکان ویرایش</span>
        </div>
      </div>

      {/* 5. Two Columns: Today's Appointments Timeline & Quick Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Right (8 cols): Interactive Timeline Schedule (Days strip + Hourly axis + Service Event Cards) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-kal-3 font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span>برنامه مراجعات و نوبت‌های سالن</span>
                    <span className="text-[11px] font-kal-4 px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] font-bold">
                      {activeDayAppointments.length.toLocaleString('fa-IR')} نوبت
                    </span>
                  </h3>
                  <p className="text-[11px] font-kal-1 text-slate-400 mt-0.5">
                    {selectedDayObj.fullDate} • ساعات کاری: ۰۹:۰۰ الی ۲۰:۰۰
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                to="/vendor/bookings"
                className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ثبت نوبت جدید</span>
              </Link>
              <Link
                to="/vendor/bookings"
                className="h-9 px-3 text-[#2563EB] hover:bg-blue-50 text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <span>تقویم کامل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Top Days & Date Strip (Categorization like the reference image) */}
          <div className="bg-slate-50/70 p-1.5 sm:p-2 rounded-2xl border border-slate-100">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {SCHEDULE_DAYS.map((day) => {
                const isSelected = selectedScheduleDayId === day.id;
                const count = day.id === '1405-03-18'
                  ? todayAppointments.length
                  : (OTHER_DAYS_APPOINTMENTS[day.id]?.length || 0);

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedScheduleDayId(day.id)}
                    className={`py-2 px-1 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none text-center ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/25 scale-[1.03]'
                        : 'bg-white hover:bg-slate-100/90 text-slate-700 border border-slate-200/60 shadow-2xs'
                    }`}
                  >
                    <span
                      className={`text-sm sm:text-lg font-kal-4 font-black leading-tight ${
                        isSelected ? 'text-white' : 'text-slate-800'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                    <span
                      className={`text-[10px] sm:text-xs font-kal-2 mt-0.5 ${
                        isSelected ? 'text-blue-100 font-medium' : 'text-slate-500'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    {count > 0 && (
                      <span
                        className={`mt-1 text-[9px] px-1.5 py-0.2 rounded-full font-kal-4 font-bold ${
                          isSelected
                            ? 'bg-white/25 text-white'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {count.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary / Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-kal-2 pt-1 pb-1 px-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F47A20]"></span>
                <span>سفارشات آنلاین لوپُن: <strong>{activeDayAppointments.filter((a) => a.type === 'online').length.toLocaleString('fa-IR')}</strong></span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
                <span>نوبت‌های حضوری سالن: <strong>{activeDayAppointments.filter((a) => a.type === 'offline').length.toLocaleString('fa-IR')}</strong></span>
              </span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-kal-3 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span>سالن در این روز باز است</span>
            </div>
          </div>

          {/* Timeline Operating Hours & Appointments */}
          <div className="relative max-h-[620px] overflow-y-auto pr-1 pl-1 space-y-4">
            {TIMELINE_HOURS.map((slot) => {
              const hourAppointments = getAppointmentsForHour(slot.hour);
              const isCurrentTimeHour = selectedScheduleDayId === '1405-03-18' && slot.hour === 11;

              return (
                <div key={slot.hour} className="relative">
                  {/* Current Time Indicator line at 11:30 */}
                  {isCurrentTimeHour && (
                    <div className="relative my-2.5 flex items-center gap-2 z-10">
                      <div className="w-14 sm:w-16 shrink-0 flex items-center justify-end pl-2">
                        <span className="text-[10px] font-kal-4 font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200/60">
                          ۱۱:۳۰
                        </span>
                      </div>
                      <div className="relative flex-1 flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-blue-100 shrink-0"></div>
                        <div className="h-[2px] bg-[#2563EB] flex-1"></div>
                        <span className="text-[10px] font-kal-3 font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded-full shadow-2xs mr-2 shrink-0">
                          اکنون
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hour Row */}
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    {/* Time Label Column (Right side in RTL) */}
                    <div className="w-14 sm:w-16 shrink-0 pt-2 text-left pl-2 select-none">
                      <span className="font-kal-4 font-bold text-xs sm:text-sm text-slate-500 block">
                        {slot.label}
                      </span>
                    </div>

                    {/* Timeline Content (Left side in RTL) */}
                    <div className="flex-1 relative pb-2 border-r-2 border-slate-100 pr-3 sm:pr-4">
                      {hourAppointments.length > 0 ? (
                        <div className="space-y-2.5">
                          {hourAppointments.map((app) => {
                            const isOnline = app.type === 'online';
                            const accentColorClass = isOnline
                              ? 'border-r-[#F47A20]'
                              : app.categoryName?.includes('ناخن')
                              ? 'border-r-[#06B6D4]'
                              : app.categoryName?.includes('پوست')
                              ? 'border-r-[#8B5CF6]'
                              : 'border-r-[#2563EB]';

                            return (
                              <div
                                key={app.id}
                                className={`group rounded-2xl bg-white p-3.5 sm:p-4 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all border-r-[5px] ${accentColorClass}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                  {/* Right side info */}
                                  <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      {/* Origin Badge */}
                                      {isOnline ? (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-orange-50 text-[#F47A20] text-[10px] font-kal-3 font-bold border border-orange-200/70">
                                          <Globe className="w-3 h-3 text-[#F47A20]" />
                                          <span>سفارش آنلاین سایت (لوپُن)</span>
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-kal-3 font-bold border border-cyan-200/70">
                                          <Store className="w-3 h-3 text-cyan-600" />
                                          <span>نوبت سالن (حضوری/تلفنی)</span>
                                        </span>
                                      )}

                                      {/* Category */}
                                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-kal-2">
                                        {app.categoryName}
                                      </span>

                                      {/* Status Badge */}
                                      {app.status === 'completed' || app.status === 'used' ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-kal-3 font-bold">
                                          تکمیل شده
                                        </span>
                                      ) : app.status === 'in_progress' ? (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-kal-3 font-bold animate-pulse">
                                          در حال انجام
                                        </span>
                                      ) : (
                                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-kal-3 font-bold">
                                          در انتظار مراجعه
                                        </span>
                                      )}
                                    </div>

                                    {/* Service Title */}
                                    <h4 className="font-kal-3 font-bold text-slate-900 text-xs sm:text-sm">
                                      {app.serviceTitle}
                                    </h4>

                                    {/* Metadata: Customer, Phone, Staff */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-kal-2 text-slate-500 pt-0.5">
                                      <span className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-slate-400" />
                                        <span>مشتری: <strong className="font-kal-3 text-slate-800">{app.customerName}</strong></span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-slate-400" />
                                        <span>تلفن: <strong className="font-kal-4 text-slate-600 dir-ltr inline-block">{app.customerPhone}</strong></span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Scissors className="w-3 h-3 text-slate-400" />
                                        <span>پرسنل: <strong className="font-kal-3 text-slate-800">{app.staffName}</strong></span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Left side: Time & Action/Price */}
                                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                    <div className="inline-flex items-center gap-1 text-[11px] font-kal-4 text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span>{app.timeString}</span>
                                    </div>

                                    {isOnline ? (
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-kal-4 font-bold text-[11px] bg-orange-100/70 text-[#F47A20] px-2 py-0.5 rounded-md">
                                          کد: {app.code}
                                        </span>
                                        {app.status === 'pending' ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const res = redeemCoupon(app.code);
                                              setQuickResult(res);
                                            }}
                                            className="px-2.5 py-1 bg-[#F47A20] hover:bg-[#d66311] text-white text-[11px] font-kal-3 font-bold rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                                          >
                                            ثبت استفاده
                                          </button>
                                        ) : (
                                          <span className="text-[10px] font-kal-3 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                            تسویه شده
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-left font-kal-2">
                                        <span className="font-kal-4 font-bold text-slate-900 text-xs sm:text-sm">
                                          {app.amount ? app.amount.toLocaleString('fa-IR') : '۰'} تومان
                                        </span>
                                        <span className="block text-[10px] text-slate-400">
                                          {app.status === 'completed' ? 'تسویه کامل' : 'در انتظار پرداخت'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Empty Hour Slot */
                        <div className="group/empty flex items-center justify-between py-2 px-3 rounded-xl hover:bg-slate-50 border border-dashed border-slate-200 hover:border-blue-200 transition-all text-xs font-kal-2">
                          <span className="flex items-center gap-2 text-slate-400 group-hover/empty:text-slate-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/empty:bg-blue-500"></span>
                            <span>ساعت آزاد سالن - آماده پذیرش و رزرو نوبت</span>
                          </span>
                          <Link
                            to="/vendor/bookings"
                            className="opacity-0 group-hover/empty:opacity-100 text-[11px] font-kal-3 text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-opacity"
                          >
                            <Plus className="w-3 h-3" />
                            <span>رزرو این ساعت</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left (4 cols): Quick Management Shortcuts & Revenue Split */}
        <div className="lg:col-span-4 space-y-6">
          {/* ماموریت‌های امروز */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#F47A20]" />
                <span>ماموریت‌های امروز</span>
              </h3>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">بروزرسانی قیمت‌ها</span>
                <Link
                  to="/vendor/services"
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">آپدیت کردن عکس‌ها</span>
                <Link
                  to="/vendor/profile"
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">پاسخ به نظرات</span>
                <Link
                  to="/vendor/crm"
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">ارسال پیامک انبوه</span>
                <Link
                  to="/vendor/crm"
                  className="h-8 px-4 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>
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

      {/* Quick Redeem Modal for Admission (ثبت پذیرش مشتری) */}
      {quickRedeemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-kal-3 font-bold text-sm text-slate-800 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#F47A20]" />
                <span>استعلام و ثبت پذیرش کوپن مشتری</span>
              </h3>
              <button
                type="button"
                onClick={() => setQuickRedeemModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-kal-3 font-bold text-slate-700 mb-2">
                  کد ۶ رقمی کوپن لوپُن:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="مثال: ۵۸۲۹۱۴"
                  className="w-full h-14 text-center font-kal-4 font-bold text-2xl tracking-widest bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#F47A20] focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (quickCode.length >= 5) {
                      const res = redeemCoupon(quickCode);
                      setQuickResult(res);
                    }
                  }}
                  disabled={quickCode.length < 5}
                  className="h-12 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 text-white font-kal-3 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  استعلام و ثبت
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuickCode('582914');
                    const res = redeemCoupon('582914');
                    setQuickResult(res);
                  }}
                  className="h-12 bg-slate-100 hover:bg-slate-200 text-slate-700 font-kal-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  کد تستی (۵۸۲۹۱۴)
                </button>
              </div>

              {quickResult && (
                <div
                  className={`p-3 rounded-xl text-xs font-kal-2 text-center border ${
                    quickResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {quickResult.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
