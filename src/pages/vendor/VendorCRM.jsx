import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Search,
  Filter,
  Star,
  Award,
  Clock,
  Phone,
  MessageSquare,
  Plus,
  Send,
  Calendar,
  Gift,
  Heart,
  ChevronLeft,
  X,
  Sparkles,
  FileText,
  UserCheck,
  Flame,
  CheckCircle2,
  Edit2,
  MessageCircle,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorCRM() {
  const crmCustomers = useVendorStore((s) => s.crmCustomers);
  const addCrmCustomer = useVendorStore((s) => s.addCrmCustomer);
  const updateCrmCustomer = useVendorStore((s) => s.updateCrmCustomer);
  const addCustomerNote = useVendorStore((s) => s.addCustomerNote);
  const addCustomerReview = useVendorStore((s) => s.addCustomerReview);
  const sendMarketingSms = useVendorStore((s) => s.sendMarketingSms);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all'); // all, vip, silver, bronze, inactive45
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Drawer / modal for customer profile
  
  // Note & Review input states
  const [newNoteText, setNewNoteText] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Add Customer Modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    tier: 'bronze',
    birthday: '',
    staffNote: '',
    customerReview: '',
    rating: 5,
  });

  // Edit Customer Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editCustomerForm, setEditCustomerForm] = useState({
    name: '',
    phone: '',
    tier: 'bronze',
    birthday: '',
  });

  // Marketing SMS Modal state
  const [smsModalOpen, setSmsModalOpen] = useState(false);
  const [smsText, setSmsText] = useState(
    'سلام [نام_مشتری] عزیز، دلمون براتون تنگ شده! با کد تخفیف NILA20 از ۲۰٪ تخفیف اختصاصی خدمات مو و ناخن سالن نازنین بهره‌مند شوید.'
  );
  const [smsResult, setSmsResult] = useState(null);

  // Filter customers
  const filteredCustomers = crmCustomers.filter((c) => {
    // 45 days retention filter
    if (selectedTier === 'inactive45') {
      if (c.lastVisitDaysAgo <= 45) return false;
    } else if (selectedTier !== 'all') {
      if (c.tier.toLowerCase() !== selectedTier.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = c.name.toLowerCase().includes(q);
      const matchPhone = c.phone.includes(q);
      return matchName || matchPhone;
    }

    return true;
  });

  const inactive45Count = crmCustomers.filter((c) => c.lastVisitDaysAgo > 45).length;

  // Add Staff Note handler
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedCustomer) return;
    addCustomerNote(selectedCustomer.id, newNoteText.trim());

    setSelectedCustomer((prev) => ({
      ...prev,
      staffNotes: [newNoteText.trim(), ...(prev.staffNotes || [])],
    }));
    setNewNoteText('');
  };

  // Add Customer Review handler
  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewText.trim() || !selectedCustomer) return;
    const reviewData = {
      text: newReviewText.trim(),
      rating: newReviewRating,
      date: 'امروز',
    };
    addCustomerReview(selectedCustomer.id, reviewData);

    setSelectedCustomer((prev) => ({
      ...prev,
      customerReviews: [
        { id: `cr_${Date.now()}`, ...reviewData },
        ...(prev.customerReviews || []),
      ],
    }));
    setNewReviewText('');
    setNewReviewRating(5);
  };

  // Create Customer handler
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerForm.name.trim() || !newCustomerForm.phone.trim()) return;

    addCrmCustomer(newCustomerForm);
    setNewCustomerForm({
      name: '',
      phone: '',
      tier: 'bronze',
      birthday: '',
      staffNote: '',
      customerReview: '',
      rating: 5,
    });
    setAddModalOpen(false);
  };

  // Open Edit Customer Modal
  const handleOpenEdit = (customer) => {
    setEditingCustomerId(customer.id);
    setEditCustomerForm({
      name: customer.name || '',
      phone: customer.phone || '',
      tier: customer.tier || 'bronze',
      birthday: customer.birthday || '',
    });
    setEditModalOpen(true);
  };

  // Save Edit Customer handler
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingCustomerId) return;

    updateCrmCustomer(editingCustomerId, editCustomerForm);

    if (selectedCustomer && selectedCustomer.id === editingCustomerId) {
      setSelectedCustomer((prev) => ({
        ...prev,
        ...editCustomerForm,
      }));
    }

    setEditModalOpen(false);
    setEditingCustomerId(null);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    const targetList = filteredCustomers.map((c) => c.phone);
    const res = sendMarketingSms({
      targetPhones: targetList,
      message: smsText,
      discountCode: 'RETENTION20',
    });
    setSmsResult(res);
    setTimeout(() => {
      setSmsResult(null);
      setSmsModalOpen(false);
    }, 2500);
  };

  const getTierBadge = (tier) => {
    switch (tier.toLowerCase()) {
      case 'vip':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-kal-4 font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>مشتری VIP</span>
          </span>
        );
      case 'silver':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-kal-3 font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
            <Award className="w-3 h-3 text-slate-500" />
            <span>مشتری نقره‌ای</span>
          </span>
        );
      case 'bronze':
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-kal-3 font-bold bg-amber-50 text-amber-900 border border-amber-200">
            مشتری برنز
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Actions */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-kal-4 font-bold text-lg text-slate-900">
            باشگاه مشتریان و مدیریت ارتباط با مشتری (CRM)
          </h2>
          <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
            تبدیل خریداران کوپن لوپُن به مشتریان دائمی سالن، ردیابی ارزش طول عمر (LTV)، یادداشت‌های پرسنلی و نظرات مراجعین
          </p>
        </div>

        {/* Action Buttons: Add Customer & SMS Marketing */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            className="h-11 px-4 bg-purple-600 hover:bg-purple-700 text-white font-kal-3 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن مشتری جدید</span>
          </button>

          <button
            type="button"
            onClick={() => setSmsModalOpen(true)}
            className="h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-kal-3 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap border border-slate-200"
          >
            <MessageSquare className="w-4 h-4 text-purple-600" />
            <span>ارسال پیامک تخفیف</span>
          </button>
        </div>
      </div>

      {/* 2. Customer Retention Alert (45 days inactive) */}
      {inactive45Count > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F47A20] text-white flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm">
                برنامه بازگشت مشتریان: {inactive45Count} مشتری بیش از ۴۵ روز است مراجعه نکرده‌اند!
              </h3>
              <p className="font-kal-2 text-xs text-slate-600 mt-0.5">
                با ارسال پیامک بازگشت همراه با کد تخفیف اختصاصی، این مشتریان را مجدداً به سالن جذب نمایید.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTier('inactive45')}
              className="px-4 py-2 bg-white text-[#F47A20] hover:bg-orange-100/50 border border-orange-300 text-xs font-kal-3 font-bold rounded-xl transition-colors cursor-pointer"
            >
              مشاهده لیست ({inactive45Count} نفر)
            </button>
            <button
              onClick={() => {
                setSelectedTier('inactive45');
                setSmsModalOpen(true);
              }}
              className="px-4 py-2 bg-[#F47A20] hover:bg-[#d66311] text-white text-xs font-kal-3 font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              ارسال پیامک بازگشت
            </button>
          </div>
        </div>
      )}

      {/* 3. Filter Bar & Search */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'همه مشتریان', count: crmCustomers.length },
              { id: 'vip', label: 'سطح VIP', count: crmCustomers.filter((c) => c.tier.toLowerCase() === 'vip').length },
              { id: 'silver', label: 'سطح نقره‌ای', count: crmCustomers.filter((c) => c.tier.toLowerCase() === 'silver').length },
              { id: 'bronze', label: 'سطح برنز', count: crmCustomers.filter((c) => c.tier.toLowerCase() === 'bronze').length },
              { id: 'inactive45', label: 'عدم مراجعه > ۴۵ روز', count: inactive45Count },
            ].map((tab) => {
              const active = selectedTier === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTier(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-kal-3 font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-purple-600 text-white shadow-xs'
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

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو با نام یا موبایل مشتری..."
              className="w-full h-10 pr-9 pl-4 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Customer Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="bg-white rounded-3xl border border-slate-200/80 hover:border-purple-300 shadow-xs p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            {/* Top header with Edit button */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-kal-4 font-bold text-slate-900 text-sm">{cust.name}</h3>
                  {getTierBadge(cust.tier)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-kal-1" dir="ltr">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{cust.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cust)}
                  className="px-2.5 py-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 border border-slate-200 rounded-xl transition-colors cursor-pointer text-xs font-kal-3 flex items-center gap-1"
                  title="ویرایش مشخصات مشتری"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>ویرایش</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(cust)}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-kal-3 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  پرونده
                </button>
              </div>
            </div>

            {/* Metrics: LTV + Visits */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 font-kal-2 block">ارزش طول عمر (LTV):</span>
                <span className="font-kal-4 font-bold text-purple-700 text-sm mt-0.5 block">
                  {cust.totalLtv.toLocaleString('fa-IR')} ت
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 font-kal-2 block">تفکیک مراجعات:</span>
                <span className="font-kal-3 text-slate-700 mt-0.5 block">
                  {cust.onlineOrdersCount} آنلاین • {cust.offlineVisitsCount} آفلاین
                </span>
              </div>
            </div>

            {/* Timing, Staff Notes & Customer Reviews Side-by-Side */}
            <div className="space-y-2 text-xs font-kal-2">
              <div className="flex items-center justify-between text-slate-500 pb-1">
                <span>آخرین مراجعه:</span>
                <span className={`font-kal-3 font-bold ${cust.lastVisitDaysAgo > 45 ? 'text-rose-500' : 'text-slate-800'}`}>
                  {cust.lastVisitDaysAgo} روز پیش ({cust.lastVisitDate})
                </span>
              </div>

              {/* 1. Staff Note Prompt */}
              {cust.staffNotes?.length > 0 ? (
                <div className="bg-amber-50/70 text-amber-950 p-2.5 rounded-xl border border-amber-200/60 text-[11.5px] leading-relaxed">
                  <span className="font-bold text-amber-800 flex items-center gap-1 mb-0.5">
                    <FileText className="w-3.5 h-3.5 text-[#F47A20]" />
                    <span>یادداشت پرسنلی سالن:</span>
                  </span>
                  <p className="line-clamp-2">{cust.staffNotes[0]}</p>
                </div>
              ) : (
                <div className="bg-slate-50 text-slate-400 p-2 rounded-xl text-[11px] border border-dashed border-slate-200 text-center">
                  بدون یادداشت پرسنلی
                </div>
              )}

              {/* 2. Customer Feedback & Review */}
              {cust.customerReviews?.length > 0 ? (
                <div className="bg-purple-50/60 text-purple-950 p-2.5 rounded-xl border border-purple-200/60 text-[11.5px] leading-relaxed">
                  <div className="flex items-center justify-between font-bold text-purple-800 mb-0.5">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                      <span>نظر و بازخورد مشتری:</span>
                    </span>
                    <span className="flex items-center text-amber-500 text-[10px]" dir="ltr">
                      {'★'.repeat(cust.customerReviews[0].rating || 5)}
                    </span>
                  </div>
                  <p className="line-clamp-2">{cust.customerReviews[0].text}</p>
                </div>
              ) : (
                <div className="bg-slate-50 text-slate-400 p-2 rounded-xl text-[11px] border border-dashed border-slate-200 text-center">
                  هنوز نظری از سمت مشتری ثبت نشده است
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 5. Customer Profile Drawer / Modal (پرونده اختصاصی مشتری) */}
      <AnimatePresence>
        {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-kal-4 font-bold text-lg">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-kal-4 font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                      {getTierBadge(selectedCustomer.tier)}
                    </div>
                    <p className="text-xs font-kal-1 text-slate-400 mt-0.5" dir="ltr">{selectedCustomer.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(selectedCustomer)}
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>ویرایش مشتری</span>
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">مجموع هزینه سالن (LTV):</span>
                    <strong className="font-kal-4 text-purple-700 text-sm">
                      {selectedCustomer.totalLtv.toLocaleString('fa-IR')} تومان
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">مراجعات آنلاین / حضوری:</span>
                    <strong className="font-kal-3 text-slate-800">
                      {selectedCustomer.onlineOrdersCount} کوپن • {selectedCustomer.offlineVisitsCount} نوبت
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">تاریخ تولد / سالگرد:</span>
                    <strong className="font-kal-3 text-slate-800">
                      {selectedCustomer.birthday || 'ثبت نشده'}
                    </strong>
                  </div>
                </div>

                {/* Section A: Staff Notes (یادداشت‌های پرسنلی) */}
                <div className="space-y-3 bg-amber-50/30 p-4 rounded-2xl border border-amber-100">
                  <h4 className="font-kal-3 font-bold text-slate-900 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#F47A20]" />
                    <span>یادداشت‌های پرسنلی (فرمول رنگ، حساسیت پوستی، ترجیحات پرسنل)</span>
                  </h4>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="ثبت یادداشت جدید پرسنلی..."
                      className="flex-1 h-10 px-4 text-xs font-kal-2 bg-white border border-slate-200 rounded-xl focus:border-[#F47A20] outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="h-10 px-4 bg-[#F47A20] hover:bg-[#d66311] disabled:opacity-50 text-white text-xs font-kal-3 font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      افزودن یادداشت
                    </button>
                  </form>

                  <div className="space-y-2">
                    {selectedCustomer.staffNotes?.map((note, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-amber-200/80 text-xs font-kal-2 text-amber-950 flex items-start gap-2 shadow-2xs"
                      >
                        <span className="text-[#F47A20] font-bold">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                    {(!selectedCustomer.staffNotes || selectedCustomer.staffNotes.length === 0) && (
                      <p className="text-xs text-slate-400 italic">هیچ یادداشت پرسنلی ثبت نشده است.</p>
                    )}
                  </div>
                </div>

                {/* Section B: Customer Reviews & Feedback (نظرات و بازخوردهای مشتری) */}
                <div className="space-y-3 bg-purple-50/30 p-4 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-kal-3 font-bold text-slate-900 text-xs flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-purple-600" />
                      <span>نظرات و بازخوردهای ثبت‌شده مشتری</span>
                    </h4>
                    <span className="text-[11px] text-purple-700 font-bold font-kal-3">
                      {selectedCustomer.customerReviews?.length || 0} نظر ثبت شده
                    </span>
                  </div>

                  <form onSubmit={handleAddReview} className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="متن نظر یا فیدبک مشتری را وارد کنید..."
                        className="flex-1 h-10 px-4 text-xs font-kal-2 bg-white border border-slate-200 rounded-xl focus:border-purple-500 outline-none"
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-kal-3 text-amber-600 outline-none cursor-pointer"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ (۵ ستاره)</option>
                        <option value={4}>⭐⭐⭐⭐ (۴ ستاره)</option>
                        <option value={3}>⭐⭐⭐ (۳ ستاره)</option>
                        <option value={2}>⭐⭐ (۲ ستاره)</option>
                        <option value={1}>⭐ (۱ ستاره)</option>
                      </select>
                      <button
                        type="submit"
                        disabled={!newReviewText.trim()}
                        className="h-10 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-kal-3 font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                      >
                        ثبت نظر
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {selectedCustomer.customerReviews?.map((rev, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-white border border-purple-200/80 text-xs font-kal-2 text-slate-800 space-y-1 shadow-2xs"
                      >
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span className="text-amber-500 font-bold" dir="ltr">
                            {'★'.repeat(rev.rating || 5)}
                          </span>
                          <span className="font-kal-1">{rev.date}</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed">{rev.text}</p>
                      </div>
                    ))}
                    {(!selectedCustomer.customerReviews || selectedCustomer.customerReviews.length === 0) && (
                      <p className="text-xs text-slate-400 italic">هیچ نظر یا بازخوردی از این مشتری ثبت نشده است.</p>
                    )}
                  </div>
                </div>

                {/* Section C: Full History of Services */}
                <div className="space-y-3">
                  <h4 className="font-kal-3 font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span>تاریخچه کامل خدمات دریافتی مشتری</span>
                  </h4>

                  <div className="space-y-2">
                    {selectedCustomer.history?.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-kal-3 font-bold text-slate-800">{h.service}</span>
                            <span
                              className={`text-[9.5px] px-1.5 py-0.2 rounded font-kal-3 ${
                                h.type === 'online'
                                  ? 'bg-orange-100 text-[#F47A20]'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {h.type === 'online' ? 'کوپن لوپُن' : 'حضوری/تلفنی'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-kal-1">
                            {h.date} • ارائه‌دهنده: {h.staff}
                          </p>
                        </div>

                        <span className="font-kal-4 font-bold text-slate-800">
                          {h.amount.toLocaleString('fa-IR')} ت
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Add Customer Modal (افزودن مشتری جدید) */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-kal-4 font-bold text-slate-900 text-sm">افزودن مشتری جدید به باشگاه</h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">ثبت اطلاعات، یادداشت پرسنلی و نظر اولیه مشتری</p>
                  </div>
                </div>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomer} className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">نام و نام خانوادگی:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: نگار صادقی"
                      value={newCustomerForm.name}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">شماره موبایل:</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      placeholder="۰۹۱۳..."
                      value={newCustomerForm.phone}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">سطح مشتری:</label>
                    <select
                      value={newCustomerForm.tier}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-3 focus:border-purple-500 focus:bg-white outline-none cursor-pointer"
                    >
                      <option value="bronze">برنز (مشتری جدید / عادی)</option>
                      <option value="silver">نقره‌ای (مشتری وفادار)</option>
                      <option value="VIP">طلایی (VIP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">تاریخ تولد / سالگرد (اختیاری):</label>
                    <input
                      type="text"
                      placeholder="مثال: ۱۴۰۵/۰۶/۱۵"
                      value={newCustomerForm.birthday}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, birthday: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Staff Note */}
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">یادداشت پرسنلی (فرمول رنگ، حساسیت):</label>
                  <textarea
                    rows={2}
                    placeholder="نکات مهم برای آرایشگران و پرسنل..."
                    value={newCustomerForm.staffNote}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, staffNote: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none resize-none"
                  />
                </div>

                {/* Customer Review & Rating */}
                <div className="space-y-2 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-kal-3 text-slate-800">نظر و بازخورد اولیه مشتری (اختیاری):</label>
                    <select
                      value={newCustomerForm.rating}
                      onChange={(e) => setNewCustomerForm({ ...newCustomerForm, rating: Number(e.target.value) })}
                      className="h-8 px-2 bg-white border border-slate-200 rounded-lg text-xs font-kal-3 text-amber-600 outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (۵ ستاره)</option>
                      <option value={4}>⭐⭐⭐⭐ (۴ ستاره)</option>
                      <option value={3}>⭐⭐⭐ (۳ ستاره)</option>
                      <option value={2}>⭐⭐ (۲ ستاره)</option>
                      <option value={1}>⭐ (۱ ستاره)</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="بازخورد مشتری از کیفیت کار، محیط یا پرسنل..."
                    value={newCustomerForm.customerReview}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerReview: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ثبت مشتری در باشگاه
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
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

      {/* 7. Edit Customer Modal (ویرایش مشخصات مشتری) */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-4 font-bold text-slate-900 text-sm">ویرایش مشخصات مشتری</h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">به‌روزرسانی نام، سطح و شماره تماس</p>
                  </div>
                </div>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">نام و نام خانوادگی:</label>
                  <input
                    type="text"
                    required
                    value={editCustomerForm.name}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">شماره موبایل:</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editCustomerForm.phone}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                    className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none text-left"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">سطح مشتری:</label>
                    <select
                      value={editCustomerForm.tier}
                      onChange={(e) => setEditCustomerForm({ ...editCustomerForm, tier: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-3 focus:border-purple-500 focus:bg-white outline-none cursor-pointer"
                    >
                      <option value="bronze">برنز</option>
                      <option value="silver">نقره‌ای</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-kal-3 text-slate-700 mb-1">تاریخ تولد / سالگرد:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={editCustomerForm.birthday}
                      onChange={(e) => setEditCustomerForm({ ...editCustomerForm, birthday: e.target.value })}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-kal-2 focus:border-purple-500 focus:bg-white outline-none text-left"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    ذخیره تغییرات
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
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

      {/* 8. Broadcast Marketing SMS Modal */}
      <AnimatePresence>
        {smsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-800 text-sm">
                      ارسال پیامک کد تخفیف به اعضای باشگاه
                    </h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">
                      گیرندگان هدف: {filteredCustomers.length} مشتری در این فیلتر
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSmsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                    متن پیامک بازاریابی / تخفیف سالن:
                  </label>
                  <textarea
                    rows={4}
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full p-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-purple-500 focus:bg-white outline-none resize-none leading-relaxed"
                  />
                  <p className="text-[11px] font-kal-1 text-slate-400 mt-1">
                    نام هر مشتری به صورت هوشمند جایگزین متغیر [نام_مشتری] خواهد شد.
                  </p>
                </div>

                {smsResult && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-kal-3 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{smsResult.message}</span>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال پیامک به {filteredCustomers.length} نفر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSmsModalOpen(false)}
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
