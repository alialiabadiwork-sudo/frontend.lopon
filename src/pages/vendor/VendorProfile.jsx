import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Store,
  Phone,
  MapPin,
  Clock,
  Image as ImageIcon,
  CreditCard,
  Save,
  CheckCircle2,
  Upload,
  Trash2,
  Navigation,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorProfile() {
  const vendor = useVendorStore((s) => s.vendor);
  const updateVendorProfile = useVendorStore((s) => s.updateVendorProfile);

  // Local form state
  const [formData, setFormData] = useState({
    title: vendor.title || '',
    category: vendor.category || '',
    auxiliaryPhone: vendor.auxiliaryPhone || '',
    mobile: vendor.mobile || '',
    isActive: vendor.isActive ?? true,
    city: vendor.city || 'کرمان',
    address: vendor.address || '',
    lat: vendor.lat || 30.28393,
    lng: vendor.lng || 57.07879,
    iban: vendor.iban || '',
    coverImage: vendor.coverImage || '',
    gallery: vendor.gallery || [],
    workingDays: vendor.workingDays || [],
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, schedule, gallery, financial

  const handleWorkingDayChange = (index, field, value) => {
    const updated = [...formData.workingDays];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, workingDays: updated });
  };

  const handleSave = (e) => {
    e?.preventDefault();
    updateVendorProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleAddSampleImage = () => {
    const samples = [
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=800&q=80',
    ];
    const nextImg = samples[formData.gallery.length % samples.length];
    setFormData({ ...formData, gallery: [...formData.gallery, nextImg] });
  };

  const handleRemoveImage = (index) => {
    const updated = formData.gallery.filter((_, i) => i !== index);
    setFormData({ ...formData, gallery: updated });
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Save Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-kal-4 font-bold text-lg text-slate-900">مجموعه من و پروفایل سالن</h2>
          <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
            هویت عمومی سالن، نشانی و نقشه، ساعات کاری، گالری تصاویر و شماره شبا جهت واریز
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-kal-3 font-bold text-emerald-600 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" />
              <span>تغییرات با موفقیت ذخیره شد</span>
            </span>
          )}

          <button
            onClick={handleSave}
            className="h-11 px-6 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره تغییرات سالن</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'basic', label: 'اطلاعات پایه و نقشه', icon: Store },
          { id: 'schedule', label: 'روزها و ساعات کاری', icon: Clock },
          { id: 'gallery', label: 'تصاویر و گالری سالن', icon: ImageIcon },
          { id: 'financial', label: 'اطلاعات مالی و تسویه', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-kal-3 font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                active
                  ? 'bg-white text-[#F47A20] shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Form Sections */}
      {/* SECTION A: Basic Info & Map */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form fields */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-kal-3 font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-[#F47A20]" />
              <span>مشخصات و هویت سالن (Vendor Model)</span>
            </h3>

            <div>
              <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                نام مجموعه یا مرکز زیبایی (title):
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full h-11 px-4 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                دسته‌بندی اصلی فعالیت سالن (category):
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="مثلاً: خدمات تخصصی مو، پوست و ناخن"
                className="w-full h-11 px-4 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                  شماره تماس کمکی یا ثابت (auxiliaryPhone):
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.auxiliaryPhone}
                  onChange={(e) => setFormData({ ...formData, auxiliaryPhone: e.target.value })}
                  placeholder="034-32456789"
                  className="w-full h-11 px-4 text-xs font-kal-1 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                  شماره موبایل مدیریت سالن:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full h-11 px-4 text-xs font-kal-1 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none text-right"
                />
              </div>
            </div>

            {/* Reception Toggle (isActive) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="font-kal-3 font-bold text-xs text-slate-800 block">
                  وضعیت پذیرش سالن (isActive)
                </span>
                <span className="font-kal-1 text-[11px] text-slate-400 block mt-0.5">
                  در صورت غیرفعال بودن، فروش کوپن موقتاً متوقف و سالن تعطیل نمایش داده می‌شود.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  formData.isActive ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.isActive ? '-translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                شهر و آدرس متنی سالن:
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="کرمان، خیابان بهمنیار، کوچه ۸..."
                className="w-full p-3 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none resize-none"
              />
            </div>
          </div>

          {/* Interactive Map Simulation with Coordinates */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F47A20]" />
                <span>موقعیت جغرافیایی روی نقشه تعاملی</span>
              </h3>
              <span className="text-[11px] font-kal-1 text-slate-400">
                مختصات: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}
              </span>
            </div>

            {/* Simulated interactive map box */}
            <div className="flex-1 min-h-[260px] bg-slate-100 rounded-2xl relative overflow-hidden border border-slate-200 group flex items-center justify-center">
              {/* Map background grid simulation */}
              <div
                className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)]"
                style={{ backgroundSize: '16px 16px' }}
              />

              {/* Streets simulation lines */}
              <div className="absolute w-full h-3 bg-slate-200 top-1/3 -rotate-3" />
              <div className="absolute w-full h-4 bg-slate-200 top-2/3 rotate-2" />
              <div className="absolute h-full w-4 bg-slate-200 left-1/3 -rotate-6" />
              <div className="absolute h-full w-3 bg-slate-200 right-1/4 rotate-12" />

              {/* Salon marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#F47A20] text-white rounded-2xl rounded-bl-none -rotate-45 shadow-xl flex items-center justify-center border-2 border-white animate-bounce">
                  <Store className="w-6 h-6 rotate-45" />
                </div>
                <div className="mt-3 px-3 py-1 bg-slate-900 text-white text-[11px] font-kal-3 rounded-full shadow-md">
                  {formData.title}
                </div>
              </div>

              {/* Map controls */}
              <div className="absolute bottom-3 left-3 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      lat: formData.lat + 0.0005,
                      lng: formData.lng + 0.0005,
                    })
                  }
                  className="px-3 py-1.5 bg-white/95 text-slate-800 text-[10px] font-kal-3 rounded-lg shadow-sm border border-slate-200 hover:bg-white cursor-pointer"
                >
                  تنظیم مجدد موقعیت
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-kal-2">
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">عرض جغرافیایی (lat):</label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-kal-1"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 mb-1 block">طول جغرافیایی (lng):</label>
                <input
                  type="number"
                  step="0.00001"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                  className="w-full h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-kal-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: Weekly Working Schedule */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F47A20]" />
                <span>برنامه هفتگی روزها و ساعات کاری (workingDays)</span>
              </h3>
              <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
                تعیین ساعت شروع (from) و ساعت پایان (to) به همراه وضعیت تعطیلی از شنبه تا جمعه
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {formData.workingDays.map((item, idx) => (
              <div
                key={item.key || idx}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                {/* Day name & toggle */}
                <div className="flex items-center gap-3 w-40">
                  <button
                    type="button"
                    onClick={() => handleWorkingDayChange(idx, 'isOpen', !item.isOpen)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      item.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {item.isOpen ? '✓' : '✕'}
                  </button>
                  <span className={`font-kal-3 font-bold ${item.isOpen ? 'text-slate-800' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>

                {/* Status text */}
                <div className="w-28 text-slate-500 font-kal-2">
                  {item.isOpen ? (
                    <span className="text-emerald-600 font-kal-3">روز کاری فعال</span>
                  ) : (
                    <span className="text-rose-500 font-kal-3">تعطیل رسمی سالن</span>
                  )}
                </div>

                {/* Hours inputs */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">از ساعت:</span>
                    <input
                      type="text"
                      disabled={!item.isOpen}
                      value={item.from}
                      onChange={(e) => handleWorkingDayChange(idx, 'from', e.target.value)}
                      className="w-24 h-9 px-2.5 text-center bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-lg text-xs font-kal-1"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">تا ساعت:</span>
                    <input
                      type="text"
                      disabled={!item.isOpen}
                      value={item.to}
                      onChange={(e) => handleWorkingDayChange(idx, 'to', e.target.value)}
                      className="w-24 h-9 px-2.5 text-center bg-slate-50 disabled:bg-slate-100 border border-slate-200 rounded-lg text-xs font-kal-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C: Gallery & Photos */}
      {activeTab === 'gallery' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F47A20]" />
                <span>تصاویر محیط، لاین‌های خدمات و سالن انتظار</span>
              </h3>
              <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
                تصویر شاخص به عنوان کاور اصلی کارت سالن در لوپُن و سایر تصاویر در صفحه اختصاصی نمایش داده می‌شوند.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddSampleImage}
              className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-kal-3 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>افزودن تصویر جدید</span>
            </button>
          </div>

          {/* Cover image highlight */}
          <div>
            <h4 className="text-xs font-kal-3 font-bold text-slate-700 mb-2">تصویر کاور اصلی سالن:</h4>
            <div className="relative w-full max-w-md h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-kal-3 px-2.5 py-1 rounded-lg">
                کاور شاخص سالن
              </span>
            </div>
          </div>

          {/* Gallery grid */}
          <div>
            <h4 className="text-xs font-kal-3 font-bold text-slate-700 mb-2">سایر تصاویر سالن:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-2xl overflow-hidden border border-slate-200 aspect-video shadow-xs"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="حذف تصویر"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION D: Financial & Settlement Information */}
      {activeTab === 'financial' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-kal-3 font-bold text-slate-800 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#F47A20]" />
              <span>اطلاعات مالی، شماره شبا و سهمیه بدون کارمزد</span>
            </h3>
            <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
              درآمدهای حاصل از کوپن‌های استفاده‌شده به این شماره شبا واریز خواهد شد.
            </p>
          </div>

          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-kal-3 text-slate-700 mb-1.5">
                شماره شبا جهت واریز دوره‌ای درآمد (iban):
              </label>
              <div className="relative">
                <input
                  type="text"
                  dir="ltr"
                  value={formData.iban}
                  onChange={(e) => setFormData({ ...formData, iban: e.target.value.toUpperCase() })}
                  placeholder="IR820120000000001234567890"
                  className="w-full h-12 px-4 pl-12 text-sm font-kal-4 tracking-wider bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-kal-4 font-bold text-slate-400">
                  IR
                </span>
              </div>
              <p className="text-[11px] font-kal-1 text-slate-400 mt-1">
                شماره شبا باید به نام صاحب امتیاز سالن یا حساب رسمی مجموعه باشد.
              </p>
            </div>

            {/* Zero-commission status card */}
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-kal-3 font-bold text-orange-900">
                <Gift className="w-4 h-4 text-[#F47A20]" />
                <span>سهمیه فروش اولیه بدون کارمزد (commissionFreeUnitsUsed)</span>
              </div>
              <p className="text-xs font-kal-2 text-slate-600 leading-relaxed">
                تاکنون <strong>{vendor.commissionFreeUnitsUsed} کوپن</strong> از سهمیه ۵۰ تایی بدون کارمزد سالن شما ثبت شده است. پس از پایان ۵۰ سهمیه اول، کارمزد استاندارد پلتفرم اعمال خواهد شد.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
