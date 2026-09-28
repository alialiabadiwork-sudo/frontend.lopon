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
  Edit3,
  Star,
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

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch items-center">
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

      {/* 3. Quick Action & Redemption Inline Card (ابطال کوپن لوپُن - کاملاً جمع‌وجور و سریع) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F47A20] flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5 text-[#F47A20]" />
          </div>
          <div>
            <h3 className="font-kal-3 font-bold text-slate-900 text-sm flex items-center gap-2">
              <span>ابطال کوپن لوپُن</span>
            </h3>
            <p className="font-kal-1 text-[11px] text-slate-400 mt-0.5">
              ثبت پذیرش و تسویه با کد ۶ رقمی مشتری:
            </p>
          </div>
        </div>

        {/* Quick inline code form */}
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            maxLength={6}
            value={quickCode}
            onChange={(e) => setQuickCode(e.target.value.replace(/\D/g, ''))}
            placeholder="کد ۶ رقمی کوپن..."
            className="h-10 w-40 px-3 text-center font-kal-4 font-bold tracking-widest text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#F47A20] focus:bg-white text-xs"
          />
          <button
            type="submit"
            disabled={quickCode.length < 5}
            className="h-10 px-5 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 text-white font-kal-3 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          >
            ثبت پذیرش
          </button>
        </form>
      </div>

      {quickResult && (
        <div
          className={`p-3.5 rounded-2xl flex items-center gap-3 text-xs font-kal-2 ${
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
            type="button"
            onClick={() => setQuickResult(null)}
            className="font-kal-3 underline cursor-pointer text-slate-600"
          >
            بستن
          </button>
        </div>
      )}

      {/* 4. Two Columns: Today's Scheduled Appointments & Daily Missions (بدون اسکرول، کاملاً هم‌تراز در پایین) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Right (8 cols): Today's Scheduled Appointments (نوبت‌های امروز با ارتفاع متناسب و بدون اسکرول) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-kal-3 font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5 text-[#F47A20]" />
                  <span>برنامه نوبت‌ها و مراجعین امروز</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-kal-3 font-bold">
                    ۶ نوبت امروز
                  </span>
                </h3>
                <p className="text-[11px] font-kal-1 text-slate-400 mt-0.5">
                  شنبه ۱۸ خرداد (امروز) • ساعات کاری سالن: ۰۹:۰۰ الی ۲۰:۰۰
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSlotBooking('۱۱:۰۰')}
                  className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت نوبت جدید</span>
                </button>
                <Link
                  to="/vendor/bookings"
                  className="h-9 px-3 text-[#2563EB] hover:bg-blue-50 text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>تقویم کامل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* List of today's key upcoming visits (Online & Offline) + 1 Empty Slot with 2 CTAs */}
            <div className="space-y-3 pt-0.5">
              
              {/* Item 1: 09:00 - Online Booking (مریم منصوری) */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-r-4 border-r-[#F47A20] shadow-2xs hover:shadow-xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-kal-3 font-bold bg-orange-50 text-[#F47A20] border border-orange-200/60 inline-flex items-center gap-1">
                        <img src="/lopon-logo-icon.png" alt="" className="h-2.5 w-auto object-contain" />
                        <span>آنلاین لوپُن (غیرقابل ویرایش)</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-kal-2">
                        رنگ و مو
                      </span>
                    </div>
                    <h4 className="font-kal-3 font-bold text-xs sm:text-sm text-slate-900">
                      رنگ و لایت بالیاژ اروپایی
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-kal-2 text-slate-500">
                      <button
                        type="button"
                        onClick={() => openCustomerDetail({
                          name: 'مریم منصوری',
                          phone: '09134569874',
                          tier: 'bronze',
                          totalSpend: 3500000,
                          staffNotes: 'اولین مراجعه جهت رنگ و لایت بالیاژ، تست حساسیت انجام شد.',
                          latestFeedback: 'رنگ مو دقیقاً همون چیزی شد که می‌خواستم، خیلی راضی هستم.',
                          rating: 5,
                        })}
                        className="font-kal-3 font-bold text-slate-800 hover:text-[#F47A20] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <User className="w-3 h-3 text-slate-400" />
                        <span>مریم منصوری</span>
                      </button>
                      <span>• پرسنل: نازنین ابراهیمی</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-[11px] font-kal-4 font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                      ۰۹:۰۰ تا ۱۰:۳۰
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-kal-4 font-bold bg-orange-100 text-[#F47A20] px-2 py-0.5 rounded">
                        کد: ۳۵۷۱۵۹
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const res = redeemCoupon('357159');
                          setQuickResult(res);
                        }}
                        className="px-2.5 py-1 bg-[#F47A20] hover:bg-[#d66311] text-white text-[11px] font-kal-3 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                      >
                        ثبت استفاده
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 2: 10:00 - Offline Booking (زهرا کاظمی) */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-r-4 border-r-cyan-500 shadow-2xs hover:shadow-xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-kal-3 font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/60 inline-flex items-center gap-1">
                        <Scissors className="w-2.5 h-2.5 text-cyan-600" />
                        <span>حضوری سالن</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-kal-2">
                        ناخن
                      </span>
                    </div>
                    <h4 className="font-kal-3 font-bold text-xs sm:text-sm text-slate-900">
                      کاشت ناخن با ژل و پلی‌ژل
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-kal-2 text-slate-500">
                      <button
                        type="button"
                        onClick={() => openCustomerDetail({
                          name: 'زهرا کاظمی',
                          phone: '09131408899',
                          tier: 'silver',
                          totalSpend: 2400000,
                          staffNotes: 'فرم ناخن بادامی متوسط؛ لاک ژل شاین‌دار.',
                          latestFeedback: 'کاشت ناخن ژل ماندگاری فوق‌العاده‌ای داشت.',
                          rating: 5,
                        })}
                        className="font-kal-3 font-bold text-slate-800 hover:text-[#F47A20] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <User className="w-3 h-3 text-slate-400" />
                        <span>زهرا کاظمی</span>
                      </button>
                      <span>• پرسنل: مهسا مرادی</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-[11px] font-kal-4 font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                      ۱۰:۰۰ تا ۱۱:۳۰
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-kal-4 font-bold text-slate-900">
                        ۷۰۰,۰۰۰ تومان
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditBooking({
                          id: 'off-1',
                          customerName: 'زهرا کاظمی',
                          customerPhone: '09131408899',
                          time: '۱۰:۰۰',
                          serviceTitle: 'کاشت ناخن با ژل و پلی‌ژل',
                          staffName: 'مهسا مرادی',
                          amount: 700000,
                        })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-kal-3 font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        <span>ویرایش نوبت</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 3: 13:00 - Offline Booking (علی علی آبادی) */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-r-4 border-r-cyan-500 shadow-2xs hover:shadow-xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-kal-3 font-bold bg-cyan-50 text-cyan-700 border border-cyan-200/60 inline-flex items-center gap-1">
                        <Scissors className="w-2.5 h-2.5 text-cyan-600" />
                        <span>حضوری سالن</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-kal-2">
                        مو
                      </span>
                    </div>
                    <h4 className="font-kal-3 font-bold text-xs sm:text-sm text-slate-900">
                      براشینگ و حالت‌دهی حرفه‌ای مو
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-kal-2 text-slate-500">
                      <button
                        type="button"
                        onClick={() => openCustomerDetail({
                          name: 'علی علی آبادی',
                          phone: '09381778920',
                          tier: 'gold',
                          totalSpend: 4200000,
                          staffNotes: 'مشتری ثابت هفتگی، اولویت نوبت‌های عصرگاهی.',
                          latestFeedback: 'براشینگ بسیار مرتب و با ماندگاری بالا، کادر محترم.',
                          rating: 5,
                        })}
                        className="font-kal-3 font-bold text-slate-800 hover:text-[#F47A20] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <User className="w-3 h-3 text-slate-400" />
                        <span>علی علی آبادی</span>
                      </button>
                      <span>• پرسنل: نازنین ابراهیمی</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-[11px] font-kal-4 font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                      ۱۳:۰۰ تا ۱۴:۰۰
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-kal-4 font-bold text-slate-900">
                        ۴۵۰,۰۰۰ تومان
                      </span>
                      <button
                        type="button"
                        onClick={() => openEditBooking({
                          id: 'off-2',
                          customerName: 'علی علی آبادی',
                          customerPhone: '09381778920',
                          time: '۱۳:۰۰',
                          serviceTitle: 'براشینگ و حالت‌دهی حرفه‌ای مو',
                          staffName: 'نازنین ابراهیمی',
                          amount: 450000,
                        })}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-kal-3 font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        <span>ویرایش نوبت</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 4: 15:00 - Online Booking (مبینا کاربخش) */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 border-r-4 border-r-[#F47A20] shadow-2xs hover:shadow-xs transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-kal-3 font-bold bg-orange-50 text-[#F47A20] border border-orange-200/60 inline-flex items-center gap-1">
                        <img src="/lopon-logo-icon.png" alt="" className="h-2.5 w-auto object-contain" />
                        <span>آنلاین لوپُن (غیرقابل ویرایش)</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-kal-2">
                        پوست
                      </span>
                    </div>
                    <h4 className="font-kal-3 font-bold text-xs sm:text-sm text-slate-900">
                      فیشیال تخصصی پوست و هیدرودرمی
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-kal-2 text-slate-500">
                      <button
                        type="button"
                        onClick={() => openCustomerDetail({
                          name: 'مبینا کاربخش',
                          phone: '09138824590',
                          tier: 'vip',
                          totalSpend: 6850000,
                          staffNotes: 'حساسیت پوستی خفیف، همیشه محصولات بدون عطر و ارگانیک استفاده شود.',
                          latestFeedback: 'کیفیت خدمات فیشیال و برخورد پرسنل فوق‌العاده بود.',
                          rating: 5,
                        })}
                        className="font-kal-3 font-bold text-slate-800 hover:text-[#F47A20] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <User className="w-3 h-3 text-slate-400" />
                        <span>مبینا کاربخش</span>
                      </button>
                      <span>• پرسنل: یلدا رحیمی</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-[11px] font-kal-4 font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                      ۱۵:۰۰ تا ۱۶:۳۰
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-kal-4 font-bold bg-orange-100 text-[#F47A20] px-2 py-0.5 rounded">
                        کد: ۵۸۲۹۱۴
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const res = redeemCoupon('582914');
                          setQuickResult(res);
                        }}
                        className="px-2.5 py-1 bg-[#F47A20] hover:bg-[#d66311] text-white text-[11px] font-kal-3 font-bold rounded-lg cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                      >
                        ثبت استفاده
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item 5: 18:00 - Empty Slot with TWO CTA buttons (رزرو این ساعت + افزایش فروش) */}
              <div className="p-3 rounded-2xl bg-amber-50/20 hover:bg-amber-50/40 border border-dashed border-amber-200 transition-all flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs font-kal-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-kal-3 font-bold bg-amber-100 text-amber-800">
                    ۱۸:۰۰
                  </span>
                  <span className="text-slate-600 font-kal-3 font-medium">
                    ساعت آزاد سالن - آماده پذیرش و رزرو نوبت تلفنی یا حضوری
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSlotBooking('۱۸:۰۰')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-kal-3 font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>رزرو این ساعت</span>
                  </button>
                  <Link
                    to="/vendor/catalog"
                    className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-[#F47A20] hover:from-orange-600 hover:to-[#d66311] text-white rounded-xl text-xs font-kal-3 font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>افزایش فروش</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Card Footer: Summary strip (هم‌تراز‌کننده ارتفاع) */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-kal-2 text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>وضعیت شیفت امروز: <strong>۴ نوبت فعال</strong> • <strong>۱ ساعت خالی</strong></span>
            </div>
            <Link
              to="/vendor/bookings"
              className="text-[#2563EB] hover:underline font-kal-3 font-bold flex items-center gap-1"
            >
              <span>مشاهده و ویرایش جدول کامل نوبت‌ها</span>
              <ChevronLeft className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Left (4 cols): Daily Missions & Revenue Split (کاملاً هم‌تراز با ستون راست) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          
          {/* Card 1: ماموریت‌های امروز (کاملاً مینیمال طبق دستور کاربر) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#F47A20]" />
                <span>ماموریت‌های امروز</span>
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">بروزرسانی قیمت‌ها</span>
                <Link
                  to="/vendor/services"
                  className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">آپدیت کردن عکس‌ها</span>
                <Link
                  to="/vendor/profile"
                  className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">پاسخ به نظرات</span>
                <Link
                  to="/vendor/crm"
                  className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                <span className="font-kal-3 text-xs font-bold text-slate-800">ارسال پیامک انبوه</span>
                <Link
                  to="/vendor/crm"
                  className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-kal-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors shadow-2xs whitespace-nowrap"
                >
                  انجام ماموریت
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: تفکیک درآمد لاین‌های خدمات (با ۴ لاین و رضایت مشتریان) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-kal-3 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">
                تفکیک درآمد لاین‌های خدمات
              </h3>

              <div className="space-y-2.5 text-xs font-kal-2 pt-1.5">
                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>لاین مو، رنگ و احیا</span>
                    <span className="font-kal-3 font-bold text-slate-800">۵۲٪ (۸,۲۰۰,۰۰۰ ت)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F47A20] rounded-full" style={{ width: '52%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>لاین ناخن و پدیکور</span>
                    <span className="font-kal-3 font-bold text-slate-800">۲۶٪ (۴,۱۰۰,۰۰۰ ت)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '26%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>لاین پوست و فیشیال</span>
                    <span className="font-kal-3 font-bold text-slate-800">۱۴٪ (۲,۲۰۰,۰۰۰ ت)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 mb-1">
                    <span>میکاپ، مژه و ابرو</span>
                    <span className="font-kal-3 font-bold text-slate-800">۸٪ (۱,۳۰۰,۰۰۰ ت)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-kal-2 text-slate-500">
              <span>میانگین رضایت مشتریان:</span>
              <span className="font-kal-3 font-bold text-amber-500 flex items-center gap-1">
                <span>۴.۹ از ۵</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              </span>
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
