import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Search,
  Plus,
  CheckCircle2,
  Check,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorCatalog() {
  const systemCatalog = useVendorStore((s) => s.systemCatalog);
  const catalogCategories = useVendorStore((s) => s.catalogCategories);
  const vendorServices = useVendorStore((s) => s.services);
  const addServiceFromCatalog = useVendorStore((s) => s.addServiceFromCatalog);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal for adding a catalog item to vendor
  const [modalItem, setModalItem] = useState(null);
  const [addForm, setAddForm] = useState({
    price: 0,
    discountPercent: 20,
    couponValidityDays: 30,
    purchaseLimit: 50,
  });
  const [successToast, setSuccessToast] = useState('');

  // Check which services are already added to this salon
  const addedCatalogIds = new Set(vendorServices.map((s) => s.catalogId));

  const handleOpenAddModal = (item) => {
    setModalItem(item);
    setAddForm({
      price: item.suggestedPrice || 1000000,
      discountPercent: 20,
      couponValidityDays: 30,
      purchaseLimit: 50,
    });
  };

  const handleConfirmAdd = (e) => {
    e.preventDefault();
    if (!modalItem) return;

    const res = addServiceFromCatalog({
      catalogId: modalItem.id,
      price: addForm.price,
      discountPercent: addForm.discountPercent,
      couponValidityDays: addForm.couponValidityDays,
      purchaseLimit: addForm.purchaseLimit,
    });

    if (res.success) {
      setSuccessToast(`خدمت «${modalItem.title}» با موفقیت به سالن شما اضافه شد.`);
      setModalItem(null);
      setTimeout(() => setSuccessToast(''), 3500);
    }
  };

  const calculatedFinalPrice = Math.round(
    addForm.price * (1 - (addForm.discountPercent || 0) / 100)
  );

  // Filter catalog items
  const filteredCatalog = systemCatalog.filter((item) => {
    if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      const matchCat = item.categoryName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-kal-4 font-bold text-lg text-slate-900">
              خدمات کلی سیستم و کاتالوگ مرجع
            </h2>
            <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
              فهرست استاندارد عناوین زیبایی لوپُن جهت جلوگیری از عناوین تکراری و ارتقای سئو و سرچ مراجعین
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در میان خدمات استاندارد..."
              className="w-full h-11 pr-10 pl-4 text-xs font-kal-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Success toast */}
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs font-kal-3 font-bold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Category Filters Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-kal-3 font-bold transition-all shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#F47A20] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          همه دسته‌بندی‌ها
        </button>

        {catalogCategories.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-kal-3 font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                active
                  ? 'bg-[#F47A20] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Catalog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCatalog.map((item) => {
          const isAdded = addedCatalogIds.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-xs overflow-hidden flex flex-col justify-between transition-all group"
            >
              {/* Image & Category badge */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-kal-3 px-2.5 py-1 rounded-xl">
                  {item.categoryName}
                </span>

                {isAdded && (
                  <div className="absolute top-3 left-3 bg-emerald-600/95 backdrop-blur-xs text-white text-[11px] font-kal-3 font-bold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>در حال ارائه در سالن شما</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-kal-3 font-bold text-slate-900 text-sm">{item.title}</h3>
                  <p className="font-kal-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1 font-kal-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>مدت زمان تقریبی:</span>
                      <strong className="text-slate-700">{item.duration}</strong>
                    </div>

                    <div className="text-[11px] font-kal-1 text-slate-400">
                      میانگین بازار: {item.suggestedPrice.toLocaleString('fa-IR')} ت
                    </div>
                  </div>

                  {/* Add / Added Button */}
                  {isAdded ? (
                    <div className="h-10 rounded-xl bg-slate-100 text-slate-500 text-xs font-kal-3 font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>این خدمت در لیست فعال سالن شماست</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(item)}
                      className="w-full h-10 bg-[#F47A20] hover:bg-[#d66311] text-white text-xs font-kal-3 font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>افزودن به خدمات سالن من</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Add Service Modal */}
      <AnimatePresence>
        {modalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F47A20] flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-800 text-sm">افزودن خدمت به سالن من</h3>
                    <p className="text-[11px] font-kal-1 text-slate-400">{modalItem.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setModalItem(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleConfirmAdd} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">
                    قیمت مصوب سالن شما (price):
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full h-11 px-4 text-xs font-kal-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#F47A20] focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">
                    درصد تخفیف لوپُن (discountPercent):
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={5}
                      max={70}
                      step={1}
                      value={addForm.discountPercent}
                      onChange={(e) =>
                        setAddForm({ ...addForm, discountPercent: parseInt(e.target.value) || 0 })
                      }
                      className="flex-1 accent-[#F47A20]"
                    />
                    <span className="w-14 h-10 rounded-xl bg-orange-50 text-[#F47A20] font-kal-4 font-bold text-center flex items-center justify-center text-sm border border-orange-200">
                      {addForm.discountPercent}٪
                    </span>
                  </div>
                </div>

                {/* Final Price Preview */}
                <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-kal-3 text-slate-700">قیمت فروش در لوپُن (finalPrice):</span>
                  <span className="font-kal-4 font-bold text-base text-[#F47A20]">
                    {calculatedFinalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">
                      مهلت اعتبار پس از صدور:
                    </label>
                    <input
                      type="number"
                      value={addForm.couponValidityDays}
                      onChange={(e) =>
                        setAddForm({ ...addForm, couponValidityDays: parseInt(e.target.value) || 30 })
                      }
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-1 text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">
                      سقف مجاز کوپن (محدودیت):
                    </label>
                    <input
                      type="number"
                      value={addForm.purchaseLimit}
                      onChange={(e) =>
                        setAddForm({ ...addForm, purchaseLimit: parseInt(e.target.value) || 50 })
                      }
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-1 text-center"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 h-11 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    تأیید و افزودن به سالن
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalItem(null)}
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
