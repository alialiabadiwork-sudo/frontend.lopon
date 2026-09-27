import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  X,
  Scissors,
  Lock,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  Filter,
  Check,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorOfflineBookings() {
  const offlineBookings = useVendorStore((s) => s.offlineBookings);
  const coupons = useVendorStore((s) => s.coupons);
  const staffList = useVendorStore((s) => s.staff);
  const vendorServices = useVendorStore((s) => s.services);
  const crmCustomers = useVendorStore((s) => s.crmCustomers);
  const addOfflineBooking = useVendorStore((s) => s.addOfflineBooking);
  const updateOfflineBooking = useVendorStore((s) => s.updateOfflineBooking);
  const deleteOfflineBooking = useVendorStore((s) => s.deleteOfflineBooking);

  // Filter state: 'all' | 'online' | 'offline' | 'empty'
  const [filterType, setFilterType] = useState('all');

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);

  // New Booking Form State
  const [formState, setFormState] = useState({
    customerType: 'new',
    existingCustomerId: '',
    customerName: '',
    customerPhone: '',
    serviceId: '',
    staffId: '',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۰:۰۰',
    duration: 60,
    amount: 0,
    paidAmount: 0,
    paymentMethod: 'pos',
    notes: '',
  });
  const [formFeedback, setFormFeedback] = useState(null);

  // Edit Booking Form State
  const [editFormState, setEditFormState] = useState({
    id: '',
    customerName: '',
    customerPhone: '',
    serviceTitle: '',
    staffId: '',
    staffName: '',
    time: '',
    amount: 0,
    paymentMethod: 'pos',
    status: 'confirmed',
    notes: '',
  });

  // Hours definition for daily schedule (09:00 to 21:00)
  const HOURS = [
    '۰۹:۰۰', '۱۰:۰۰', '۱۱:۰۰', '۱۲:۰۰', '۱۳:۰۰', '۱۴:۰۰',
    '۱۵:۰۰', '۱۶:۰۰', '۱۷:۰۰', '۱۸:۰۰', '۱۹:۰۰', '۲۰:۰۰', '۲۱:۰۰'
  ];

  // Map Online Coupons that have an appointment today into unified schedule format
  const onlineAppointments = useMemo(() => {
    // Map existing active coupons to slots
    return [
      {
        id: 'online_1',
        type: 'online',
        customerName: 'مریم منصوری',
        customerPhone: '۰۹۱۳۴۵۶۹۸۷۴',
        serviceTitle: 'رنگ و لایت بالیاژ اروپایی',
        staffName: 'نازنین ابراهیمی',
        time: '۰۹:۰۰',
        duration: 90,
        amount: 3500000,
        paymentStatus: 'پرداخت آنلاین در لوپُن',
        status: 'confirmed',
        canEdit: false,
      },
      {
        id: 'online_2',
        type: 'online',
        customerName: 'علی علی آبادی',
        customerPhone: '۰۹۳۸۱۷۷۸۹۲۰',
        serviceTitle: 'براشینگ و حالت‌دهی مو',
        staffName: 'نازنین ابراهیمی',
        time: '۱۳:۰۰',
        duration: 60,
        amount: 1500000,
        paymentStatus: 'پرداخت آنلاین در لوپُن',
        status: 'confirmed',
        canEdit: false,
      },
      {
        id: 'online_3',
        type: 'online',
        customerName: 'نگین شجاعی',
        customerPhone: '۰۹۳۶۹۸۷۱۲۳۴',
        serviceTitle: 'فیشیال تخصصی پوست و هیدرودرمی',
        staffName: 'یلدا رحیمی',
        time: '۱۷:۰۰',
        duration: 60,
        amount: 1100000,
        paymentStatus: 'پرداخت آنلاین در لوپُن',
        status: 'confirmed',
        canEdit: false,
      },
      {
        id: 'online_4',
        type: 'online',
        customerName: 'سحر تهرانی',
        customerPhone: '۰۹۱۲۳۴۵۶۷۸۹',
        serviceTitle: 'احیا و کراتین مو',
        staffName: 'نازنین ابراهیمی',
        time: '۲۰:۰۰',
        duration: 90,
        amount: 2800000,
        paymentStatus: 'پرداخت آنلاین در لوپُن',
        status: 'confirmed',
        canEdit: false,
      },
    ];
  }, []);

  // Map Offline Bookings into unified schedule format
  const offlineAppointments = useMemo(() => {
    return offlineBookings.map((b) => ({
      id: b.id,
      type: 'offline',
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      serviceTitle: b.serviceTitle,
      staffName: b.staffName || 'پرسنل سالن',
      time: b.time,
      duration: b.duration || 60,
      amount: b.amount,
      paymentStatus: b.paymentMethod === 'pos' ? 'کارتخوان سالن' : b.paymentMethod === 'cash' ? 'نقدی' : 'کارت‌به‌کارت',
      status: b.status || 'confirmed',
      canEdit: true,
      originalBooking: b,
    }));
  }, [offlineBookings]);

  // Combine both Online and Offline into full schedule
  const allAppointments = useMemo(() => {
    return [...onlineAppointments, ...offlineAppointments];
  }, [onlineAppointments, offlineAppointments]);

  // Key Calculations for Top Metrics
  const onlineCount = onlineAppointments.length;
  const offlineCount = offlineAppointments.length;
  const totalOccupiedSlots = allAppointments.length;
  const totalSlotsCount = HOURS.length; // 13 slots
  const emptySlotsCount = Math.max(0, totalSlotsCount - totalOccupiedSlots);

  // Hours calculation: 8.5 hours occupied, 3.5 hours idle
  const occupiedHours = (totalOccupiedSlots * 0.9).toFixed(1);
  const idleHours = (emptySlotsCount * 0.9).toFixed(1);
  const occupancyPercent = Math.min(100, Math.round((totalOccupiedSlots / totalSlotsCount) * 100));

  // Build the hourly table rows
  const scheduleRows = useMemo(() => {
    return HOURS.map((hour) => {
      // Find appointment starting around this hour
      const hourPrefix = hour.split(':')[0];
      const match = allAppointments.find((a) => a.time.startsWith(hourPrefix));

      return {
        hour,
        appointment: match || null,
        isOccupied: !!match,
      };
    }).filter((row) => {
      if (filterType === 'all') return true;
      if (filterType === 'online') return row.appointment?.type === 'online';
      if (filterType === 'offline') return row.appointment?.type === 'offline';
      if (filterType === 'empty') return !row.isOccupied;
      return true;
    });
  }, [HOURS, allAppointments, filterType]);

  // Open Customer Detail Modal
  const handleOpenCustomerDetail = (customerName, customerPhone) => {
    const found = crmCustomers.find(
      (c) => c.phone === customerPhone || c.name === customerName
    );

    if (found) {
      setSelectedCustomer(found);
    } else {
      // Temporary object if not in CRM store
      setSelectedCustomer({
        name: customerName,
        phone: customerPhone,
        tier: 'bronze',
        totalLtv: 0,
        onlineOrdersCount: 1,
        offlineVisitsCount: 0,
        staffNotes: ['مشتری جدید ثبت‌شده در سیستم نوبت‌دهی.'],
        customerReviews: [
          {
            id: 'temp_rev',
            text: 'خدمات سالن تمیز و منظم بود.',
            rating: 5,
            date: 'امروز',
          },
        ],
      });
    }
    setCustomerModalOpen(true);
  };

  // Open Edit Offline Booking Modal
  const handleOpenEditBooking = (apt) => {
    if (!apt.canEdit) return;
    setEditingBooking(apt);
    setEditFormState({
      id: apt.id,
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      serviceTitle: apt.serviceTitle,
      staffId: apt.originalBooking?.staffId || '',
      staffName: apt.staffName,
      time: apt.time,
      amount: apt.amount,
      paymentMethod: apt.originalBooking?.paymentMethod || 'pos',
      status: apt.status,
      notes: apt.originalBooking?.notes || '',
    });
    setEditModalOpen(true);
  };

  // Save Edit Offline Booking
  const handleSaveEditBooking = (e) => {
    e.preventDefault();
    if (updateOfflineBooking && editingBooking) {
      updateOfflineBooking(editingBooking.id, {
        customerName: editFormState.customerName,
        customerPhone: editFormState.customerPhone,
        serviceTitle: editFormState.serviceTitle,
        time: editFormState.time,
        amount: Number(editFormState.amount),
        paidAmount: Number(editFormState.amount),
        paymentMethod: editFormState.paymentMethod,
        status: editFormState.status,
        notes: editFormState.notes,
      });
    }
    setEditModalOpen(false);
  };

  // Delete/Cancel Offline Booking
  const handleDeleteBooking = (id) => {
    if (window.confirm('آیا از لغو و حذف این نوبت اطمینان دارید؟')) {
      if (deleteOfflineBooking) {
        deleteOfflineBooking(id);
      }
      setEditModalOpen(false);
    }
  };

  // Open New Booking for specific empty slot
  const handleSlotBooking = (hour) => {
    setFormState((prev) => ({
      ...prev,
      time: hour,
    }));
    setCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title and Create Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-kal-4 font-bold text-lg text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#F47A20]" />
            <span>مدیریت جامع نوبت‌ها و سفارشات (آنلاین و حضوری)</span>
          </h2>
          <p className="font-kal-1 text-xs text-slate-400 mt-1">
            جدول ساعتی نوبت‌ها، کنترل ساعت‌های پر و ظرفیت‌های خالی سالن، مشاهده پرونده CRM مراجعین
          </p>
        </div>

        <button
          onClick={() => {
            setFormState((prev) => ({ ...prev, time: '۱۰:۰۰' }));
            setCreateModalOpen(true);
          }}
          className="h-11 px-5 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ ثبت نوبت جدید حضوری (آفلاین)</span>
        </button>
      </div>

      {/* 2. Top Intelligent Metric Cards (ساعت‌های کارکرد، بیکاری و نوبت‌ها) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: ساعت‌های کار مفید امروز */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-kal-3 text-slate-600">ساعت کار مفید سالن:</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="font-kal-4 font-black text-xl text-slate-900">{occupiedHours}</span>
            <span className="text-xs font-kal-2 text-slate-400">ساعت پر</span>
          </div>
          <span className="text-[10px] font-kal-2 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block w-fit">
            نوبت‌های در حال ارائه
          </span>
        </div>

        {/* Card 2: ساعت‌های خالی و بیکاری (کم آورده) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-kal-3 text-slate-600">ظرفیت خالی و بیکاری:</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="font-kal-4 font-black text-xl text-amber-600">{idleHours}</span>
            <span className="text-xs font-kal-2 text-slate-400">ساعت خالی</span>
          </div>
          <span className="text-[10px] font-kal-2 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md inline-block w-fit">
            {emptySlotsCount} اسلات آماده پذیرش
          </span>
        </div>

        {/* Card 3: نوبت‌های آنلاین لوپُن */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-kal-3 text-slate-600">سفارشات آنلاین لوپُن:</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
              <img src="/lopon-logo-icon.png" alt="لوپُن" className="h-3.5 w-auto object-contain" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="font-kal-4 font-black text-xl text-[#F47A20]">{onlineCount}</span>
            <span className="text-xs font-kal-2 text-slate-400">نوبت آنلاین</span>
          </div>
          <span className="text-[10px] font-kal-2 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block w-fit">
            غیرقابل ویرایش از سالن
          </span>
        </div>

        {/* Card 4: نوبت‌های آفلاین سالن */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-kal-3 text-slate-600">نوبت‌های حضوری سالن:</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-2 flex items-baseline gap-1">
            <span className="font-kal-4 font-black text-xl text-blue-600">{offlineCount}</span>
            <span className="text-xs font-kal-2 text-slate-400">نوبت حضوری</span>
          </div>
          <span className="text-[10px] font-kal-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block w-fit">
            دارای قابلیت ویرایش
          </span>
        </div>

        {/* Card 5: درصد اشغال و بهره‌وری سالن */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-kal-3 text-slate-600">اشغال ظرفیت سالن:</span>
            <span className="text-xs font-kal-4 font-bold text-slate-900">{occupancyPercent}٪</span>
          </div>
          <div className="my-2">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-[#F47A20] rounded-full transition-all duration-500"
                style={{ width: `${occupancyPercent}%` }}
              />
            </div>
          </div>
          <span className="text-[10px] font-kal-2 text-slate-500">
            {totalOccupiedSlots} از {totalSlotsCount} ساعت پر است
          </span>
        </div>
      </div>

      {/* 3. Filter Bar and Date Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-kal-3 text-slate-400 ml-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            نمایش:
          </span>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-kal-3 font-bold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه ساعت‌ها ({HOURS.length})
          </button>
          <button
            onClick={() => setFilterType('online')}
            className={`px-3 py-1.5 rounded-xl text-xs font-kal-3 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterType === 'online'
                ? 'bg-[#F47A20] text-white shadow-2xs'
                : 'bg-orange-50 text-[#F47A20] hover:bg-orange-100'
            }`}
          >
            <img src="/lopon-logo-icon.png" alt="" className="h-3 w-auto object-contain" />
            فقط آنلاین لوپُن ({onlineCount})
          </button>
          <button
            onClick={() => setFilterType('offline')}
            className={`px-3 py-1.5 rounded-xl text-xs font-kal-3 font-bold transition-all cursor-pointer ${
              filterType === 'offline'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            فقط حضوری سالن ({offlineCount})
          </button>
          <button
            onClick={() => setFilterType('empty')}
            className={`px-3 py-1.5 rounded-xl text-xs font-kal-3 font-bold transition-all cursor-pointer ${
              filterType === 'empty'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            ساعت‌های خالی و آزاد ({emptySlotsCount})
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 text-xs font-kal-3 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <CalendarIcon className="w-3.5 h-3.5 text-[#F47A20]" />
          <span>شنبه ۱۸ خرداد ۱۴۰۵ (امروز)</span>
        </div>
      </div>

      {/* 4. Hourly Schedule Table (جدول زمانی ساعتی نوبت‌ها) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-kal-3">
                <th className="py-3.5 px-4 font-bold w-24">ساعت نوبت</th>
                <th className="py-3.5 px-4 font-bold w-36">نوع نوبت</th>
                <th className="py-3.5 px-4 font-bold">مشتری (کلیک جهت مشاهده پرونده)</th>
                <th className="py-3.5 px-4 font-bold">خدمت سالن</th>
                <th className="py-3.5 px-4 font-bold">پرسنل ارائه‌دهنده</th>
                <th className="py-3.5 px-4 font-bold">مبلغ خدمت</th>
                <th className="py-3.5 px-4 font-bold text-center w-36">عملیات / وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-kal-2">
              {scheduleRows.map(({ hour, appointment, isOccupied }) => {
                if (!isOccupied) {
                  return (
                    <tr key={hour} className="bg-slate-50/30 hover:bg-amber-50/30 transition-colors">
                      {/* Hour */}
                      <td className="py-3 px-4 font-kal-4 font-bold text-slate-700">
                        {hour}
                      </td>

                      {/* Status / Type */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-kal-3 font-bold bg-slate-100 text-slate-500 border border-slate-200">
                          ظرفیت خالی
                        </span>
                      </td>

                      {/* Customer column (Empty slot message) */}
                      <td colSpan={4} className="py-3 px-4 text-slate-400 text-[11px] italic">
                        ساعت آزاد برای پذیرش و ثبت نوبت تلفنی یا حضوری سالن...
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleSlotBooking(hour)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-kal-3 font-bold border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>رزرو این ساعت</span>
                        </button>
                      </td>
                    </tr>
                  );
                }

                const isOnline = appointment.type === 'online';

                return (
                  <tr
                    key={hour}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isOnline ? 'bg-orange-50/20' : 'bg-white'
                    }`}
                  >
                    {/* Hour */}
                    <td className="py-3.5 px-4">
                      <span className="font-kal-4 font-bold text-sm text-slate-900 block">
                        {appointment.time}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {appointment.duration} دقیقه
                      </span>
                    </td>

                    {/* Type Badge */}
                    <td className="py-3.5 px-4">
                      {isOnline ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-100/70 text-[#F47A20] border border-orange-200 text-[11px] font-kal-3 font-bold">
                          <img src="/lopon-logo-icon.png" alt="" className="h-3 w-auto object-contain" />
                          <span>آنلاین لوپُن</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-kal-3 font-bold">
                          <Scissors className="w-3 h-3" />
                          <span>حضوری سالن</span>
                        </div>
                      )}
                    </td>

                    {/* Customer Info (Clickable for full CRM Profile) */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() =>
                          handleOpenCustomerDetail(appointment.customerName, appointment.customerPhone)
                        }
                        className="text-right group cursor-pointer"
                        title="مشاهده پرونده و اطلاعات مشتری"
                      >
                        <div className="flex items-center gap-1.5 font-kal-3 font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                          <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600" />
                          <span className="underline decoration-dotted decoration-purple-300 underline-offset-4">
                            {appointment.customerName}
                          </span>
                          <Eye className="w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10.5px] font-kal-1 text-slate-400 block font-mono mt-0.5" dir="ltr">
                          {appointment.customerPhone}
                        </span>
                      </button>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <strong className="text-slate-800 font-kal-3 text-xs block">
                        {appointment.serviceTitle}
                      </strong>
                      <span className="text-[10px] text-slate-400">
                        {appointment.paymentStatus}
                      </span>
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#F47A20]" />
                        <span className="font-kal-3 text-slate-700 text-xs">
                          {appointment.staffName}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-kal-4 font-bold text-slate-900">
                      {appointment.amount ? `${appointment.amount.toLocaleString('fa-IR')} تومان` : '—'}
                    </td>

                    {/* Actions Column */}
                    <td className="py-3.5 px-4 text-center">
                      {isOnline ? (
                        <div
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-400 rounded-xl text-[10.5px] font-kal-3 font-medium cursor-not-allowed border border-slate-200"
                          title="نوبت‌های آنلاین لوپُن به دلیل اتصال به اپ مشتری غیرقابل ویرایش از سالن هستند."
                        >
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>غیرقابل ویرایش</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenEditBooking(appointment)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-slate-700 rounded-xl text-xs font-kal-3 font-bold border border-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>ویرایش نوبت</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: CUSTOMER CRM PROFILE QUICK VIEW ================= */}
      <AnimatePresence>
        {customerModalOpen && selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-lg">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-kal-4 font-bold text-slate-900 text-base">
                        {selectedCustomer.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-kal-3 font-bold bg-purple-100 text-purple-800">
                        {selectedCustomer.tier === 'VIP' ? 'مشتری VIP' : selectedCustomer.tier === 'silver' ? 'مشتری نقره‌ای' : 'مشتری برنز'}
                      </span>
                    </div>
                    <p className="text-xs font-kal-1 text-slate-400 font-mono mt-0.5" dir="ltr">
                      {selectedCustomer.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setCustomerModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
                {/* LTV & Visits stats */}
                <div className="grid grid-cols-2 gap-3 bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100">
                  <div>
                    <span className="text-[10.5px] font-kal-2 text-slate-500 block">ارزش طول عمر (LTV):</span>
                    <strong className="text-sm font-kal-4 font-black text-purple-700">
                      {selectedCustomer.totalLtv ? `${selectedCustomer.totalLtv.toLocaleString('fa-IR')} تومان` : '۵,۰۰۰,۰۰۰ تومان'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10.5px] font-kal-2 text-slate-500 block">مراجعات ثبت‌شده:</span>
                    <strong className="text-xs font-kal-3 font-bold text-slate-800">
                      {selectedCustomer.onlineOrdersCount || 2} آنلاین • {selectedCustomer.offlineVisitsCount || 1} حضوری
                    </strong>
                  </div>
                </div>

                {/* Staff Notes */}
                <div>
                  <label className="font-kal-3 font-bold text-amber-800 text-xs flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#F47A20]" />
                    <span>یادداشت پرسنلی و نکات سالن:</span>
                  </label>
                  <div className="bg-amber-50/80 text-amber-950 p-3 rounded-2xl border border-amber-200/70 text-[11.5px] leading-relaxed">
                    {selectedCustomer.staffNotes && selectedCustomer.staffNotes.length > 0
                      ? selectedCustomer.staffNotes[0]
                      : 'ترجیح می‌دهند نوبت‌های عصر رزرو شود؛ مشتری با دقت و وقت‌شناس.'}
                  </div>
                </div>

                {/* Customer Reviews & Feedback */}
                <div>
                  <label className="font-kal-3 font-bold text-purple-800 text-xs flex items-center gap-1.5 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>نظر و بازخورد ثبت‌شده توسط مشتری:</span>
                  </label>
                  <div className="bg-purple-50/60 text-purple-950 p-3 rounded-2xl border border-purple-200/70 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500 text-xs tracking-wider">★★★★★ (۵ ستاره)</span>
                      <span className="text-[10px] text-slate-400">۱۴۰۵/۰۳/۱۵</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed">
                      {selectedCustomer.customerReviews && selectedCustomer.customerReviews.length > 0
                        ? selectedCustomer.customerReviews[0].text
                        : 'کار خانوم مرادی عالی بود یکی از بهترین های کرمان که میشه رفت پیشون.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button
                  onClick={() => setCustomerModalOpen(false)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-kal-3 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  بستن پرونده
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: EDIT OFFLINE BOOKING MODAL ================= */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-900 text-sm">
                      ویرایش نوبت حضوری (آفلاین)
                    </h3>
                    <p className="text-[10.5px] font-kal-1 text-slate-400">
                      تغییر ساعت، خدمت، پرسنل یا لغو نوبت
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditBooking} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-kal-3 mb-1">نام مشتری:</label>
                  <input
                    type="text"
                    required
                    value={editFormState.customerName}
                    onChange={(e) => setEditFormState({ ...editFormState, customerName: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">شماره موبایل:</label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      value={editFormState.customerPhone}
                      onChange={(e) => setEditFormState({ ...editFormState, customerPhone: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-left focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">ساعت نوبت:</label>
                    <input
                      type="text"
                      required
                      value={editFormState.time}
                      onChange={(e) => setEditFormState({ ...editFormState, time: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-4 text-center focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-kal-3 mb-1">عنوان خدمت سالن:</label>
                  <input
                    type="text"
                    required
                    value={editFormState.serviceTitle}
                    onChange={(e) => setEditFormState({ ...editFormState, serviceTitle: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2 focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">مبلغ خدمت (تومان):</label>
                    <input
                      type="number"
                      value={editFormState.amount}
                      onChange={(e) => setEditFormState({ ...editFormState, amount: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-4 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">روش پرداخت:</label>
                    <select
                      value={editFormState.paymentMethod}
                      onChange={(e) => setEditFormState({ ...editFormState, paymentMethod: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2"
                    >
                      <option value="pos">کارتخوان (POS)</option>
                      <option value="cash">نقدی</option>
                      <option value="card_to_card">کارت به کارت</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-kal-3 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(editFormState.id)}
                    className="px-3 h-11 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-kal-3 font-bold border border-rose-200 transition-colors cursor-pointer"
                    title="لغو و حذف نوبت"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: CREATE NEW OFFLINE BOOKING ================= */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F47A20] flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-800 text-sm">
                      ثبت نوبت حضوری جدید (ساعت {formState.time})
                    </h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">
                      ثبت نوبت تلفنی یا حضوری و افزودن به جدول زمان‌بندی
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const serviceObj = vendorServices.find((s) => s.id === formState.serviceId);
                  const staffObj = staffList.find((s) => s.id === formState.staffId);

                  if (!formState.customerName || !formState.customerPhone || !serviceObj || !staffObj) {
                    setFormFeedback({
                      success: false,
                      message: 'لطفاً نام مشتری، شماره تماس، خدمت و پرسنل را کامل وارد نمایید.',
                    });
                    return;
                  }

                  const res = addOfflineBooking({
                    customerName: formState.customerName,
                    customerPhone: formState.customerPhone,
                    serviceTitle: serviceObj.title,
                    serviceLine: serviceObj.category,
                    staffId: staffObj.id,
                    staffName: staffObj.name,
                    date: formState.date,
                    time: formState.time,
                    duration: Number(formState.duration) || 60,
                    amount: Number(formState.amount),
                    paidAmount: Number(formState.paidAmount),
                    paymentMethod: formState.paymentMethod,
                    notes: formState.notes,
                  });

                  setFormFeedback(res);
                  if (res.success) {
                    setTimeout(() => {
                      setFormFeedback(null);
                      setCreateModalOpen(false);
                    }, 1200);
                  }
                }}
                className="p-5 space-y-3.5 text-xs overflow-y-auto"
              >
                <div>
                  <label className="block text-slate-700 font-kal-3 mb-1">نام مشتری:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سمیرا رستمی"
                    value={formState.customerName}
                    onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2 focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">شماره تماس:</label>
                    <input
                      type="text"
                      dir="ltr"
                      required
                      placeholder="۰۹۱۲..."
                      value={formState.customerPhone}
                      onChange={(e) => setFormState({ ...formState, customerPhone: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-mono text-left focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-kal-3 mb-1">ساعت نوبت:</label>
                    <input
                      type="text"
                      value={formState.time}
                      onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-4 text-center focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-kal-3 mb-1">انتخاب خدمت:</label>
                  <select
                    value={formState.serviceId}
                    onChange={(e) => {
                      const found = vendorServices.find((s) => s.id === e.target.value);
                      setFormState({
                        ...formState,
                        serviceId: e.target.value,
                        amount: found?.price || 0,
                        paidAmount: found?.price || 0,
                      });
                    }}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2"
                  >
                    <option value="">انتخاب خدمت...</option>
                    {vendorServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.price.toLocaleString('fa-IR')} تومان)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-kal-3 mb-1">آرایشگر / پرسنل:</label>
                  <select
                    value={formState.staffId}
                    onChange={(e) => setFormState({ ...formState, staffId: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-kal-2"
                  >
                    <option value="">انتخاب پرسنل...</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {formFeedback && (
                  <div
                    className={`p-3 rounded-xl text-xs font-kal-3 font-bold flex items-center gap-2 ${
                      formFeedback.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {formFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{formFeedback.message}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ثبت در جدول نوبت‌ها
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-kal-3 text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
