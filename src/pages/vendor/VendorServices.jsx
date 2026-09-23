import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  AlertCircle,
  Eye,
  Percent,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useVendorStore } from '@store/vendor/vendorStore';

export default function VendorServices() {
  const services = useVendorStore((s) => s.services);
  const toggleServiceStatus = useVendorStore((s) => s.toggleServiceStatus);
  const updateService = useVendorStore((s) => s.updateService);
  const deleteService = useVendorStore((s) => s.deleteService);

  // Quick edit modal
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    price: 0,
    discountPercent: 0,
    couponValidityDays: 30,
    purchaseLimit: 50,
  });

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setEditForm({
      price: svc.price,
      discountPercent: svc.discountPercent,
      couponValidityDays: svc.couponValidityDays || 30,
      purchaseLimit: svc.purchaseLimit || 50,
    });
  };

  const calculatedFinalPrice = Math.round(
    editForm.price * (1 - (editForm.discountPercent || 0) / 100)
  );

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingService) return;
    updateService(editingService.id, {
      price: editForm.price,
      discountPercent: editForm.discountPercent,
      couponValidityDays: editForm.couponValidityDays,
      purchaseLimit: editForm.purchaseLimit,
    });
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Add Service Button */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-kal-4 font-bold text-lg text-slate-900">خدمات مجموعه و قیمت‌گذاری</h2>
          <p className="font-kal-1 text-xs text-slate-400 mt-0.5">
            مدیریت خدمات فعال سالن، ویرایش قیمت مصوب، درصد تخفیف، مهلت اعتبار و توقف موقت عرضه
          </p>
        </div>

        <Link
          to="/vendor/catalog"
          className="h-11 px-5 bg-[#F47A20] hover:bg-[#d66311] text-white font-kal-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن خدمت جدید از کاتالوگ</span>
        </Link>
      </div>

      {/* 2. Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => (
          <div
            key={svc.id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-xs transition-all flex flex-col justify-between ${
              svc.isActive
                ? 'border-slate-200/80 hover:border-slate-300'
                : 'border-slate-200 opacity-75 bg-slate-50/50'
            }`}
          >
            {/* Top image & badges */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={svc.image}
                alt={svc.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* Discount Tag */}
              <div className="absolute top-3 right-3 bg-rose-500 text-white text-[11px] font-kal-4 font-bold px-2.5 py-1 rounded-xl shadow-md">
                {svc.discountPercent}٪ تخفیف
              </div>

              {/* Status Tag */}
              <div className="absolute top-3 left-3">
                <span
                  className={`text-[10.5px] font-kal-3 font-bold px-2.5 py-1 rounded-xl shadow-xs backdrop-blur-md ${
                    svc.isActive
                      ? 'bg-emerald-600/90 text-white'
                      : 'bg-slate-800/90 text-slate-200'
                  }`}
                >
                  {svc.isActive ? 'عرضه فعال' : 'توقف موقت'}
                </span>
              </div>

              <div className="absolute bottom-2 right-3">
                <span className="text-[10px] font-kal-3 px-2 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                  {svc.category}
                </span>
              </div>
            </div>

            {/* Service Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-kal-3 font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {svc.title}
                </h3>

                {/* Price block */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-[11px]">قیمت مصوب سالن (price):</span>
                    <span className="line-through">{svc.price.toLocaleString('fa-IR')} تومان</span>
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                    <span className="font-kal-3 font-bold text-slate-700">قیمت نهایی لوپُن (finalPrice):</span>
                    <span className="font-kal-4 font-bold text-[#F47A20] text-sm">
                      {svc.finalPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                {/* Rules & Limits: validity days & purchase limits */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-kal-2 text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-50/70 p-2 rounded-xl">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>اعتبار: <strong>{svc.couponValidityDays || 30} روز</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50/70 p-2 rounded-xl">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>فروش: <strong>{svc.soldCount}/{svc.purchaseLimit}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Toggle active, Edit, Delete */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {/* Active switch button */}
                <button
                  type="button"
                  onClick={() => toggleServiceStatus(svc.id)}
                  className={`flex-1 h-9 rounded-xl text-xs font-kal-3 font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                    svc.isActive
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-600'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                  }`}
                >
                  <span>{svc.isActive ? 'توقف فروش' : 'فعال‌سازی عرضه'}</span>
                </button>

                {/* Quick Edit */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(svc)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="ویرایش قیمت و شرایط"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => deleteService(svc.id)}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  title="حذف از خدمات سالن"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Quick Edit Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F47A20] flex items-center justify-center">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-kal-3 font-bold text-slate-800 text-sm">ویرایش قیمت و درصد تخفیف</h3>
                    <p className="text-[11px] font-kal-1 text-slate-400 truncate max-w-[240px]">
                      {editingService.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingService(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-kal-3 text-slate-700 mb-1">
                    قیمت مصوب سالن (تومان):
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
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
                      value={editForm.discountPercent}
                      onChange={(e) =>
                        setEditForm({ ...editForm, discountPercent: parseInt(e.target.value) || 0 })
                      }
                      className="flex-1 accent-[#F47A20]"
                    />
                    <span className="w-14 h-10 rounded-xl bg-orange-50 text-[#F47A20] font-kal-4 font-bold text-center flex items-center justify-center text-sm border border-orange-200">
                      {editForm.discountPercent}٪
                    </span>
                  </div>
                </div>

                {/* Auto Calculated Final Price */}
                <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <span className="font-kal-3 text-slate-700">قیمت نهایی قابل پرداخت (finalPrice):</span>
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
                      value={editForm.couponValidityDays}
                      onChange={(e) =>
                        setEditForm({ ...editForm, couponValidityDays: parseInt(e.target.value) || 30 })
                      }
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl font-kal-1 text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-kal-3 text-[11px]">
                      سقف تعداد سفارش:
                    </label>
                    <input
                      type="number"
                      value={editForm.purchaseLimit}
                      onChange={(e) =>
                        setEditForm({ ...editForm, purchaseLimit: parseInt(e.target.value) || 50 })
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
                    ذخیره تغییرات
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingService(null)}
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
