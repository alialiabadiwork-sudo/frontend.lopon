import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Controller } from 'react-hook-form';
import { RotateCw, Timer, Loader2, ArrowLeft } from 'lucide-react';
import Button from '@components/common/Button';
import useTimer from '@hooks/animations/useTimerOtp';
import LoginHeader from '../components/LoginHeader';

// Normalize Persian/Arabic digits and extract up to 5 digits
const cleanOtp = (raw) => {
  if (!raw) return '';
  return String(raw)
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[^0-9]/g, '')
    .slice(0, 5);
};

const PhoneOtp = ({
  control,
  watch,
  setValue,
  onResend,
  phone,
  loading,
  resending,
  onSubmit,
}) => {
  const { isTimeUp, resetTimer, minutes, seconds } = useTimer(1);

  const otpVal = watch ? watch('otp') : '';
  const [localOtp, setLocalOtp] = useState(cleanOtp(otpVal) || '');
  const localOtpRef = useRef(localOtp);
  localOtpRef.current = localOtp;

  const inputRef = useRef(null);
  const fieldRef = useRef(null);
  const abortControllerRef = useRef(null);
  const submittedRef = useRef(false);

  // Synchronize local state with external form value if changed from outside
  useEffect(() => {
    if (otpVal !== undefined && otpVal !== null) {
      const clean = cleanOtp(otpVal);
      if (clean !== localOtpRef.current) {
        setLocalOtp(clean);
        localOtpRef.current = clean;
      }
    }
  }, [otpVal]);

  // Synchronize OTP value across React local state, React Hook Form, and native DOM element
  const applyOtpValue = useCallback(
    (code) => {
      const cleanCode = cleanOtp(code);
      if (!cleanCode && cleanCode !== '') return;

      // 1. Immediate React state update to guarantee boxes render immediately
      setLocalOtp(cleanCode);
      localOtpRef.current = cleanCode;

      // 2. Update Controller field
      if (fieldRef.current?.onChange) {
        fieldRef.current.onChange(cleanCode);
      }

      // 3. Update React Hook Form
      if (setValue) {
        setValue('otp', cleanCode, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      // 4. Update DOM element if needed
      if (inputRef.current && inputRef.current.value !== cleanCode) {
        inputRef.current.value = cleanCode;
      }
    },
    [setValue]
  );

  // WebOTP API implementation with persistent abort controller (not aborted on every re-render)
  const startWebOtp = useCallback(() => {
    if (typeof window === 'undefined' || !('OTPCredential' in window)) return;

    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) {}
    }

    const ac = new AbortController();
    abortControllerRef.current = ac;

    navigator.credentials
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      })
      .then((otpCredential) => {
        if (otpCredential?.code) {
          const cleanCode = cleanOtp(otpCredential.code);
          if (cleanCode) {
            applyOtpValue(cleanCode);
          }
        }
      })
      .catch((err) => {
        // Ignored gracefully on abort or user dismiss
      });
  }, [applyOtpValue]);

  // Start WebOTP on mount
  useEffect(() => {
    startWebOtp();
    return () => {
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {}
      }
    };
  }, [startWebOtp]);

  // Multi-tier listener for Android Chrome / Google Play Services SMS Autofill:
  // 1) Object.defineProperty descriptor hook for direct C++ property injection
  // 2) Fast polling interval (100ms) while OTP is incomplete
  // 3) Native DOM event listeners ('input', 'change', 'focus', 'blur')
  useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;

    // 1. Intercept DOM value setter
    try {
      const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
      if (descriptor && descriptor.set) {
        const originalSet = descriptor.set;
        Object.defineProperty(inputEl, 'value', {
          get() {
            return descriptor.get.call(this);
          },
          set(newVal) {
            originalSet.call(this, newVal);
            if (newVal) {
              const cleaned = cleanOtp(newVal);
              if (cleaned && cleaned !== localOtpRef.current) {
                applyOtpValue(cleaned);
              }
            }
          },
          configurable: true,
        });
      }
    } catch (e) {
      // Ignore if descriptor override is restricted
    }

    // 2. High-frequency polling to catch silent autofill
    const pollInterval = setInterval(() => {
      if (inputEl.value) {
        const cleaned = cleanOtp(inputEl.value);
        if (cleaned && cleaned !== localOtpRef.current) {
          applyOtpValue(cleaned);
        }
      }
    }, 100);

    // 3. Native DOM event handlers
    const handleNative = (e) => {
      const raw = e?.target?.value ?? inputEl.value;
      if (raw) {
        const cleaned = cleanOtp(raw);
        if (cleaned && cleaned !== localOtpRef.current) {
          applyOtpValue(cleaned);
        }
      }
    };

    inputEl.addEventListener('input', handleNative);
    inputEl.addEventListener('change', handleNative);
    inputEl.addEventListener('focus', handleNative);
    inputEl.addEventListener('blur', handleNative);

    return () => {
      clearInterval(pollInterval);
      inputEl.removeEventListener('input', handleNative);
      inputEl.removeEventListener('change', handleNative);
      inputEl.removeEventListener('focus', handleNative);
      inputEl.removeEventListener('blur', handleNative);
    };
  }, [applyOtpValue]);

  // Active OTP value for validation and display
  const effectiveOtp = localOtp || otpVal || '';

  // Auto-submit when OTP reaches 5 digits (only once per entry)
  useEffect(() => {
    if (effectiveOtp && effectiveOtp.length === 5 && onSubmit && !loading && !submittedRef.current) {
      submittedRef.current = true;
      const timer = setTimeout(() => {
        onSubmit();
      }, 100);
      return () => clearTimeout(timer);
    }
    if (!effectiveOtp || effectiveOtp.length < 5) {
      submittedRef.current = false;
    }
  }, [effectiveOtp, onSubmit, loading]);

  // Resend OTP handler
  const handleResend = () => {
    resetTimer();
    setLocalOtp('');
    applyOtpValue('');
    startWebOtp(); // Re-arm WebOTP for the new SMS
    if (onResend) {
      onResend();
    }
  };

  const formattedMinutes = String(minutes).padStart(2, '۰');
  const formattedSeconds = String(seconds).padStart(2, '۰');

  return (
    <>
      <LoginHeader
        head="کد تأیید را وارد کنید"
        description={
          phone
            ? `کد ۵ رقمی به شماره ${phone} ارسال شد`
            : 'کد ۵ رقمی ارسال‌شده را وارد کنید'
        }
      />

      {/* OTP Input Fields */}
      <div className="my-5" dir="ltr">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => {
            fieldRef.current = field;
            return (
              <div className="relative w-full max-w-[280px] mx-auto h-12 flex justify-between gap-3.5" dir="ltr">
                <input
                  ref={(el) => {
                    field.ref(el);
                    inputRef.current = el;
                  }}
                  id="otp"
                  name={field.name || 'otp'}
                  value={effectiveOtp}
                  onChange={(e) => applyOtpValue(e.target.value)}
                  onInput={(e) => applyOtpValue(e.target.value)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData?.getData('text');
                    if (pasted) {
                      e.preventDefault();
                      applyOtpValue(pasted);
                    }
                  }}
                  maxLength={10}
                  autoFocus
                  type="tel"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {[0, 1, 2, 3, 4].map((index) => {
                  const char = effectiveOtp[index] || '';
                  const isFocused = effectiveOtp.length === index || (effectiveOtp.length === 5 && index === 4);
                  return (
                    <div
                      key={index}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-lg transition-all duration-200 ${
                        isFocused
                          ? 'border-[#F47A20] bg-white ring-2 ring-[#F47A20]/10 shadow-xs'
                          : char
                          ? 'border-slate-300 bg-slate-50 text-slate-900'
                          : 'border-slate-200 bg-slate-50/60 text-slate-300'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </div>

      {/* Timer & Resend Button */}
      <div className="flex justify-center mb-4">
        {!isTimeUp ? (
          <Button disabled={true} className="h-9 text-xs disabled:bg-slate-100 disabled:text-slate-400 border border-slate-200/80 shadow-none font-normal">
            <Timer className="w-3.5 h-3.5 text-slate-400" />
            <span>ارسال مجدد تا</span>
            <span className="font-mono font-medium text-slate-600 dir-ltr">
              {formattedMinutes}:{formattedSeconds}
            </span>
          </Button>
        ) : (
          <Button onClick={handleResend} disabled={resending} className="h-9 text-xs">
            {resending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RotateCw className="w-3.5 h-3.5" />
            )}
            <span>ارسال مجدد کد</span>
          </Button>
        )}
      </div>

      {/* Submit / Login Button */}
      <div className="w-full mt-4">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={loading || !effectiveOtp || effectiveOtp.length < 5}
          className="h-11 text-xs sm:text-sm w-full cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>درحال بررسی...</span>
            </>
          ) : (
            <>
              <span>تأیید و ورود</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default PhoneOtp;
