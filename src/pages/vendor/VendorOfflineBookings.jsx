import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Phone,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar as CalendarIcon,
  Scissors,
  Check,
  FileSpreadsheet,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorOfflineBookings() {
  const offlineBookings = useVendorStore((s) => s.offlineBookings);
  const staffList = useVendorStore((s) => s.staff);
  const vendorServices = useVendorStore((s) => s.services);
  const crmCustomers = useVendorStore((s) => s.crmCustomers);
  const addOfflineBooking = useVendorStore((s) => s.addOfflineBooking);

  // View state: 'timeline' | 'pos_report'
  const [activeView, setActiveView] = useState('timeline');
  const [reportTimeframe, setReportTimeframe] = useState('daily'); // daily, weekly, monthly

  // New Booking Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    customerType: 'new', // new | existing
    existingCustomerId: '',
    customerName: '',
    customerPhone: '',
    serviceId: '',
    staffId: '',
    date: '۱۴۰۵/۰۳/۱۸',
    time: '۱۵:۰۰',
    duration: 60,
    amount: 0,
    paidAmount: 0,
    paymentMethod: 'pos', // pos, card_to_card, cash, credit
    notes: '',
  });

  const [formFeedback, setFormFeedback] = useState(null);

  // When picking existing customer
  const handleSelectCustomer = (customerId) => {
    const found = crmCustomers.find((c) => c.id === customerId);
    if (found) {
      setFormState({
        ...formState,
        existingCustomerId: found.id,
        customerName: found.name,
        customerPhone: found.phone,
      });
    }
  };

  // When picking service
  const handleSelectService = (serviceId) => {
    const found = vendorServices.find((s) => s.id === serviceId);
    if (found) {
      setFormState({
        ...formState,
        serviceId: found.id,
        amount: found.price,
        paidAmount: found.price,
      });
    }
  };

  const handleCreateBooking = (e) => {
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

    const payload = {
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
    };

    const result = addOfflineBooking(payload);
    setFormFeedback(result);

    if (result.success) {
      setTimeout(() => {
        setFormFeedback(null);
        setModalOpen(false);
        // Reset form
        setFormState({
          customerType: 'new',
          existingCustomerId: '',
          customerName: '',
          customerPhone: '',
          serviceId: '',
          staffId: '',
          date: '۱۴۰۵/۰۳/۱۸',
          time: '۱۵:۰۰',
          duration: 60,
          amount: 0,
          paidAmount: 0,
          paymentMethod: 'pos',
          notes: '',
        });
      }, 1500);
    }
  };

  // Calculations for POS & Offline Sales Report
  const totalPos = offlineBookings
    .filter((b) => b.paymentMethod === 'pos')
    .reduce((acc, b) => acc + (Number(b.paidAmount) || Number(b.amount)), 0);

  const totalCash = offlineBookings
    .filter((b) => b.paymentMethod === 'cash')
    .reduce((acc, b) => acc + (Number(b.paidAmount) || Number(b.amount)), 0);

  const totalCardToCard = offlineBookings
    .filter((b) => b.paymentMethod === 'card_to_card')
    .reduce((acc, b) => acc + (Number(b.paidAmount) || Number(b.amount)), 0);

  const totalCredit = offlineBookings
    .filter((b) => b.paymentMethod === 'credit')
    .reduce((acc, b) => acc + (Number(b.paidAmount) || Number(b.amount)), 0);

  const totalOfflineAmount = totalPos + totalCash + totalCardToCard + totalCredit;

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Booking Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-kal-4 font-bold text-lg text-slate-900">
            سفارشات آفلاین و مدیریت نوبت‌های سالن
          </h2>
          <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
            ثبت نوبت‌های تلفنی و حضوری، کنترل تداخل نوبت پرسنل، تایم‌لاین تقویم و گزارش صندوق سالن
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="h-11 px-5 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت نوبت حضوری یا تلفنی</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-tabs: Calendar Timeline vs POS & Cashier Report */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveView('timeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-kal-3 font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'timeline'
              ? 'bg-white text-[#F47A20] shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>تقویم کاری و تایم‌لاین روزانه پرسنل</span>
        </button>

        <button
          onClick={() => setActiveView('pos_report')}
          className={`px-4 py-2.5 rounded-xl text-xs font-kal-3 font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'pos_report'
              ? 'bg-white text-[#F47A20] shadow-xs border border-slate-200'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>گزارش صندوق و فروش آفلاین</span>
        </button>
      </div>

      {/* VIEW 1: Calendar & Timeline */}
      {activeView === 'timeline' && (
        <div className="space-y-6">
          {/* Day selection header */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-kal-3 font-bold text-slate-800 text-sm">
              <CalendarIcon className="w-4 h-4 text-[#F47A20]" />
              <span>نوبت‌های امروز: شنبه ۱۸ خرداد ۱۴۰۵</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-kal-2">
              <span className="text-slate-400">راهنمای پرسنل:</span>
              {staffList.map((s) => (
                <div key={s.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-slate-700 font-kal-3 text-[11px]">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffList.map((staff) => {
              const staffBookings = offlineBookings.filter((b) => b.staffId === staff.id);

              return (
                <div
                  key={staff.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col"
                >
                  {/* Staff Header */}
                  <div
                    className="p-4 border-b border-slate-100 flex items-center justify-between"
                    style={{ borderTop: `4px solid ${staff.color}` }}
                  >
                    <div>
                      <h3 className="font-kal-3 font-bold text-slate-900 text-sm">{staff.name}</h3>
                      <p className="text-[10.5px] font-kal-1 text-slate-400 mt-0.5">{staff.specialty}</p>
                    </div>
                    <span className="text-[11px] font-kal-4 font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">
                      {staffBookings.length} نوبت
                    </span>
                  </div>

                  {/* Appointments list */}
                  <div className="p-4 space-y-3 flex-1">
                    {staffBookings.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center text-slate-300 text-xs font-kal-2">
                        <span>نوبتی ثبت نشده است</span>
                      </div>
                    ) : (
                      staffBookings.map((b) => (
                        <div
                          key={b.id}
                          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-kal-4 font-bold text-[#F47A20] text-sm">
                              {b.time}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 font-kal-1 text-slate-500">
                              {b.duration} دقیقه
                            </span>
                          </div>

                          <div>
                            <h4 className="font-kal-3 font-bold text-slate-800">{b.customerName}</h4>
                            <p className="text-[11px] text-slate-500 font-kal-2 mt-0.5">
                              {b.serviceTitle}
                            </p>
                          </div>

                          <div className="pt-1 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                            <span className="font-kal-4 font-bold text-slate-800">
                              {b.amount.toLocaleString('fa-IR')} ت
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-kal-3 ${
                                b.paymentMethod === 'pos'
                                  ? 'bg-blue-100 text-blue-700'
                                  : b.paymentMethod === 'cash'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {b.paymentMethod === 'pos'
                                ? 'کارتخوان'
                                : b.paymentMethod === 'cash'
                                ? 'نقدی'
                                : 'کارت‌به‌کارت'}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: POS & Cashier Report */}
      {activeView === 'pos_report' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-kal-2">مجموع فروش صندوق آفلاین:</span>
              <div className="font-kal-4 font-bold text-xl text-slate-900">
                {totalOfflineAmount.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-kal-2">تراکنش‌های کارتخوان (POS):</span>
              <div className="font-kal-4 font-bold text-xl text-blue-600">
                {totalPos.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-kal-2">فروش نقدی (صندوق):</span>
              <div className="font-kal-4 font-bold text-xl text-emerald-600">
                {totalCash.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 font-kal-2">کارت‌به‌کارت و نسیه:</span>
              <div className="font-kal-4 font-bold text-xl text-amber-600">
                {(totalCardToCard + totalCredit).toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown by Service Line */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-kal-3 font-bold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F47A20]" />
              <span>تفکیک درآمد صندوق بر اساس لاین‌های خدمات سالن</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-kal-2">
              <div className="p-4 bg-orange-50/60 rounded-2xl border border-orange-200/70 space-y-1">
                <span className="text-slate-600">لاین رنگ و مو:</span>
                <div className="font-kal-4 font-bold text-base text-[#F47A20]">۱,۴۰۰,۰۰۰ تومان</div>
                <p className="text-[11px] font-kal-1 text-slate-400">۳۸٪ از کل فروش حضوری</p>
              </div>

              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-200/70 space-y-1">
                <span className="text-slate-600">لاین ناخن و پدیکور:</span>
                <div className="font-kal-4 font-bold text-base text-purple-700">۷۰۰,۰۰۰ تومان</div>
                <p className="text-[11px] font-kal-1 text-slate-400">۱۹٪ از کل فروش حضوری</p>
              </div>

              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/70 space-y-1">
                <span className="text-slate-600">لاین پوست، فیشیال و مژه:</span>
                <div className="font-kal-4 font-bold text-base text-blue-700">۱,۵۵۰,۰۰۰ تومان</div>
                <p className="text-[11px] font-kal-1 text-slate-400">۴۳٪ از کل فروش حضوری</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. New Booking Form Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F47A20] flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-800 text-sm">
                      ثبت سریع نوبت و سفارش آفلاین
                    </h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">
                      ثبت نوبت تلفنی یا حضوری همراه با کنترل هوشمند تداخل زمان پرسنل
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreateBooking} className="p-5 overflow-y-auto space-y-4">
                {/* Customer Type Picker */}
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">انتخاب مشتری:</label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, customerType: 'new' })}
                      className={`h-9 rounded-xl text-xs font-kal-3 cursor-pointer transition-colors ${
                        formState.customerType === 'new'
                          ? 'bg-[#F47A20] text-white font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      مشتری جدید
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormState({ ...formState, customerType: 'existing' })}
                      className={`h-9 rounded-xl text-xs font-kal-3 cursor-pointer transition-colors ${
                        formState.customerType === 'existing'
                          ? 'bg-[#F47A20] text-white font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      مشتری عضو باشگاه (CRM)
                    </button>
                  </div>

                  {formState.customerType === 'existing' ? (
                    <select
                      value={formState.existingCustomerId}
                      onChange={(e) => handleSelectCustomer(e.target.value)}
                      className="w-full h-11 px-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    >
                      <option value="">انتخاب از لیست مشتریان سالن...</option>
                      {crmCustomers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) - سطح {c.tier}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="نام و نام خانوادگی..."
                        value={formState.customerName}
                        onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                        className="w-full h-11 px-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      />
                      <input
                        type="text"
                        placeholder="شماره موبایل (۰۹۱۳...)"
                        dir="ltr"
                        value={formState.customerPhone}
                        onChange={(e) => setFormState({ ...formState, customerPhone: e.target.value })}
                        className="w-full h-11 px-3 text-xs font-kal-1 bg-slate-50 border border-slate-200 rounded-xl outline-none text-right"
                      />
                    </div>
                  )}
                </div>

                {/* Service Selection */}
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">
                    انتخاب خدمت سالن:
                  </label>
                  <select
                    value={formState.serviceId}
                    onChange={(e) => handleSelectService(e.target.value)}
                    className="w-full h-11 px-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">انتخاب خدمت...</option>
                    {vendorServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} ({s.price.toLocaleString('fa-IR')} تومان)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Staff Selection */}
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">
                    آرایشگر / پرسنل ارائه‌دهنده:
                  </label>
                  <select
                    value={formState.staffId}
                    onChange={(e) => setFormState({ ...formState, staffId: e.target.value })}
                    className="w-full h-11 px-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  >
                    <option value="">انتخاب پرسنل...</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} - {st.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-3 text-xs font-kal-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">تاریخ نوبت:</label>
                    <input
                      type="text"
                      value={formState.date}
                      onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-1 text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">ساعت نوبت:</label>
                    <input
                      type="text"
                      value={formState.time}
                      onChange={(e) => setFormState({ ...formState, time: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-1 text-center"
                    />
                  </div>
                </div>

                {/* Amount & Settlement Method */}
                <div className="grid grid-cols-2 gap-3 text-xs font-kal-2">
                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">مبلغ کل (تومان):</label>
                    <input
                      type="number"
                      value={formState.amount}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          amount: parseFloat(e.target.value) || 0,
                          paidAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-4"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">روش تسویه حساب:</label>
                    <select
                      value={formState.paymentMethod}
                      onChange={(e) => setFormState({ ...formState, paymentMethod: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-2"
                    >
                      <option value="pos">کارتخوان (POS)</option>
                      <option value="card_to_card">کارت به کارت</option>
                      <option value="cash">نقدی</option>
                      <option value="credit">نسیه / مانده بدهی</option>
                    </select>
                  </div>
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

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ثبت نوبت و بروزرسانی پرونده مشتری
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
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
