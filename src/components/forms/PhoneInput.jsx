import React, { useRef, useEffect } from 'react';
import Iran from "@assets/images/iran.png";

function PhoneInput({ validation }) {
  const localRef = useRef(null);

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    // Bulletproof listener for system/mobile autofill modal "Allow" click
    const handleAutofill = (e) => {
      if (validation && validation.onChange) {
        validation.onChange({
          target: {
            name: validation.name || 'mobile',
            value: el.value,
          },
        });
      }
    };

    el.addEventListener('input', handleAutofill);
    el.addEventListener('change', handleAutofill);

    return () => {
      el.removeEventListener('input', handleAutofill);
      el.removeEventListener('change', handleAutofill);
    };
  }, [validation]);

  return (
    <div className="relative mt-2 w-full">
      <label className="block text-right text-xs font-kal-3 font-bold text-slate-500 mb-2 pr-1">
        شماره همراه شما
      </label>
      <div className="relative w-full border border-slate-200/80 rounded-2xl px-4 py-3.5 flex items-center bg-slate-50 hover:bg-slate-50/80 focus-within:bg-white focus-within:border-[#F47A20] focus-within:ring-2 focus-within:ring-[#F47A20]/10 transition-all duration-200" dir="ltr">
        
        {/* Country Code & Flag */}
        <div className="flex items-center gap-2 pr-3 mr-0 border-r border-slate-200/80 h-6">
          <img src={Iran} alt="Iran Flag" className="w-6 h-6 rounded-full object-cover shadow-2xs" />
          <span className="text-sm font-semibold text-slate-500 font-mono tracking-tight">+98</span>
        </div>

        {/* Input Field */}
        <div className="flex-1 pl-3">
          <input
            id="username"
            name="username"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
            {...validation}
            ref={(el) => {
              localRef.current = el;
              if (validation && validation.ref) {
                validation.ref(el);
              }
            }}
            onInput={(e) => {
              if (validation && validation.onChange) {
                validation.onChange(e);
              }
            }}
            className="w-full bg-transparent py-0.5 text-base text-slate-800 font-kal-2 tracking-wider focus:outline-none placeholder:text-slate-300 text-left"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}

export default PhoneInput;

