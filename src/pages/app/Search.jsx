import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Search as SearchIcon, X, RotateCcw, History, AlertCircle } from 'lucide-react';
import searchService from '@services/search.service';
import SearchResultCard from '@features/search/SearchResultCard';
import SearchResultCardSkeleton from '@features/search/SearchResultCardSkeleton';
import { SearchIdleIllustration, SearchNoResultIllustration } from '@features/search/SearchIllustrations';

const RECENT_SEARCHES_KEY = 'lopon_recent_searches';

const toPersianDigits = (num) => {
  if (num === null || num === undefined) return '۰';
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x, 10)]);
};

export default function Search() {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Track latest request and abort controller to prevent race conditions
  const abortControllerRef = useRef(null);
  const latestQueryRef = useRef('');

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Save query to recent searches
  const saveRecentSearch = useCallback((term) => {
    const clean = term?.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== clean);
      const updated = [clean, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Perform search with Request Cancellation
  const executeSearch = useCallback(
    async (searchTerm) => {
      const trimmed = searchTerm.trim();
      latestQueryRef.current = trimmed;

      // Abort previous in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (!trimmed) {
        setResults([]);
        setIsLoading(false);
        setIsError(false);
        setHasSearched(false);
        return;
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setIsError(false);
      setHasSearched(true);

      try {
        const response = await searchService.search(trimmed, { limit: 30 }, controller.signal);

        // Ensure response corresponds to the latest query
        if (latestQueryRef.current === trimmed) {
          const data = response?.data?.data || [];
          setResults(Array.isArray(data) ? data : []);
          setIsLoading(false);

          if (data.length > 0) {
            saveRecentSearch(trimmed);
          }
        }
      } catch (err) {
        // If request was aborted by subsequent search, ignore silently
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || controller.signal.aborted) {
          return;
        }
        if (latestQueryRef.current === trimmed) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    },
    [saveRecentSearch]
  );

  // Debounced search trigger (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(query);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [query, executeSearch]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setIsError(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSelectRecent = (term) => {
    setQuery(term);
    executeSearch(term);
  };

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen bg-[#FAF7F2] flex flex-col font-kal-2 select-none max-w-[480px] mx-auto text-right"
    >
      {/* 1. Header Bar: Back Button & Expanded Search Box */}
      <div className="sticky top-0 z-30 w-full bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-3.5 sm:py-4 border-b border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-3xs cursor-pointer shrink-0 border border-slate-200/80"
            aria-label="بازگشت"
          >
            <ChevronRight className="w-6 h-6 text-slate-700 stroke-[2.3]" />
          </button>

          {/* Larger & Modern Search Input Box */}
          <div className="relative flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی خدمات، سالن‌ها یا آدرس..."
              className="w-full h-11 sm:h-12 bg-white rounded-2xl pr-11 pl-10 text-slate-800 text-[14.5px] sm:text-[15.5px] font-kal-3 border border-slate-200/90 shadow-3xs focus:border-[#F47A20] focus:ring-4 focus:ring-[#F47A20]/15 focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-kal-2"
              dir="rtl"
            />

            {/* Magnifying Glass Icon inside input */}
            <SearchIcon className="absolute right-3.5 sm:right-4 w-5 h-5 text-slate-400 pointer-events-none stroke-[2.2]" />

            {/* Clear (X) Button */}
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute left-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 cursor-pointer transition-colors active:scale-90"
                aria-label="پاک کردن"
              >
                <X size={13} className="stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 px-4 py-5 overflow-y-auto no-scrollbar pb-14">
        {/* Loading State: Skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <SearchResultCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State with Retry Button */}
        {!isLoading && isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-3 shadow-3xs">
              <AlertCircle size={28} />
            </div>
            <h3 className="font-kal-3 font-bold text-slate-800 text-base mb-1.5">
              خطا در برقراری ارتباط
            </h3>
            <p className="text-xs text-slate-500 font-kal-2 max-w-xs mb-5 leading-relaxed">
              متأسفانه در دریافت اطلاعات خطایی رخ داده است. لطفاً اتصال اینترنت خود را بررسی و مجدداً تلاش کنید.
            </p>
            <button
              type="button"
              onClick={() => executeSearch(query)}
              className="flex items-center gap-2 bg-[#F47A20] hover:bg-[#d66311] text-white px-5 py-2.5 rounded-xl font-kal-3 font-bold text-xs shadow-md shadow-[#F47A20]/25 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              <span>تلاش مجدد</span>
            </button>
          </motion.div>
        )}

        {/* Dedicated No Results State: Clean, Minimal, No Unnecessary Badges */}
        {!isLoading && !isError && hasSearched && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center px-4 py-8 select-none"
          >
            <SearchNoResultIllustration />

            <h2 className="text-base sm:text-lg font-kal-3 font-bold text-slate-800 mt-4 mb-2 tracking-tight">
              نتیجه‌ای یافت نشد
            </h2>

            <p className="text-xs sm:text-[13px] text-slate-500 font-kal-2 leading-relaxed max-w-xs mb-6">
              هیچ موردی مطابق با عبارت <span className="font-kal-3 font-bold text-slate-700">«{query}»</span> پیدا نشد. لطفاً املای کلمات را بررسی کنید یا عبارت دیگری را جستجو نمایید.
            </p>

            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-2 bg-[#F47A20] hover:bg-[#d66311] text-white px-5 py-2.5 rounded-xl font-kal-3 font-bold text-xs sm:text-sm shadow-md shadow-[#F47A20]/25 transition-all cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} />
              <span>پاک کردن جستجو</span>
            </button>
          </motion.div>
        )}

        {/* Success Results State */}
        {!isLoading && !isError && hasSearched && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Results Count Header */}
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs text-slate-500 font-kal-2">
                نتایج جستجو برای <span className="font-kal-3 font-bold text-slate-800">«{query}»</span>
              </span>
              <span className="text-[11.5px] font-kal-3 font-bold text-[#F47A20] bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5">
                {toPersianDigits(results.length)} نتیجه
              </span>
            </div>

            {/* Cards List */}
            {results.map((item) => (
              <SearchResultCard key={`${item.resultType}-${item.id}`} item={item} />
            ))}
          </motion.div>
        )}

        {/* Initial Idle State: Exclusive Search Illustration & Message (No Categories Box) */}
        {!isLoading && !hasSearched && query.trim() === '' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-center px-4 py-8 select-none"
          >
            {/* Exclusive Lopon Search Illustration */}
            <SearchIdleIllustration />

            {/* Clean Title & Description */}
            <h2 className="text-base sm:text-lg font-kal-3 font-bold text-slate-800 mt-4 mb-2 tracking-tight">
              هنوز چیزی را جستجو نکرده‌اید
            </h2>

            <p className="text-xs sm:text-[13px] text-slate-500 font-kal-2 leading-relaxed max-w-xs">
              نام سالن زیبایی، خدمات مراقبتی یا منطقه مورد نظر خود را در کادر بالا بنویسید تا نتایج را مشاهده کنید.
            </p>

            {/* Optional Recent Searches (clean chip list beneath, if user searched before) */}
            {recentSearches.length > 0 && (
              <div className="w-full mt-8 pt-6 border-t border-slate-200/70 text-right">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-kal-3 font-bold text-xs sm:text-[13px]">
                    <History size={15} className="text-slate-400 stroke-[2.2]" />
                    <span>جستجوهای اخیر شما</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors font-kal-2 cursor-pointer"
                  >
                    پاک کردن تاریخچه
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectRecent(item)}
                      className="bg-white hover:bg-orange-50/60 hover:border-orange-200 border border-slate-200/80 text-slate-700 hover:text-[#F47A20] text-xs font-kal-2 py-2 px-3.5 rounded-xl transition-all shadow-3xs cursor-pointer active:scale-95 flex items-center gap-1.5"
                    >
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
