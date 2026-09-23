import React from 'react';

export default function SearchResultCardSkeleton() {
  return (
    <div
      dir="rtl"
      className="w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 animate-pulse select-none"
    >
      {/* Right Side in RTL: Image Skeleton */}
      <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl bg-slate-200 shrink-0" />

      {/* Middle in RTL: Details Skeleton */}
      <div className="flex flex-col justify-between self-stretch flex-1 min-w-0 py-0.5 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        <div className="h-3 bg-slate-100 rounded-md w-2/3" />
      </div>

      {/* Left Side in RTL: Rating and Badge Skeleton */}
      <div className="flex flex-col justify-between items-end self-stretch shrink-0 py-0.5 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-10" />
        <div className="h-5 bg-rose-50 rounded-full w-16" />
      </div>
    </div>
  );
}
