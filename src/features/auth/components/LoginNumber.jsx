import React, { useState } from 'react';
import PhoneInput from '@components/forms/PhoneInput';
import ErrorText from '@components/forms/errorText';
import Button from '@components/common/Button';
import { ArrowLeft, Loader2, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import LoginHeader from '../components/LoginHeader';
import TermsModal from '@components/Items/TermsModal';

function LoginNumber({ validation, error, phoneLoading, inviterInfo }) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <LoginHeader
        head="ورود یا ثبت‌نام"
        description="برای ادامه شماره همراه خود را وارد کنید"
      />

      {/* Referral Inviter Badge */}
      {inviterInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mb-4 bg-orange-50/90 border border-orange-200/90 rounded-2xl p-3.5 flex items-center gap-3 text-right shadow-2xs"
          dir="rtl"
        >
          <div className="w-10 h-10 rounded-xl bg-white text-[#F47A20] flex items-center justify-center shrink-0 border border-orange-200 shadow-3xs">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-[12.5px] font-bold font-kal-3 text-slate-800">
              شما توسط{' '}
              <span className="text-[#F47A20] font-bold dir-ltr inline-block">
                {(inviterInfo.inviterName && inviterInfo.inviterName !== 'بدون نام کاربری' && inviterInfo.inviterName !== 'کاربر لوپُن')
                  ? inviterInfo.inviterName
                  : (inviterInfo.inviterMobile || inviterInfo.mobile || inviterInfo.inviterName || 'یکی از دوستان')}
              </span>{' '}
              دعوت شده‌اید 🎁
            </span>
            <span className="text-[10.5px] font-kal-2 text-slate-500 mt-0.5">
              با تکمیل ثبت‌نام، هدیه ویژه لوپُن به حسابتان تعلق می‌گیرد.
            </span>
          </div>
        </motion.div>
      )}

      {/* Input Field */}
      <PhoneInput validation={validation} />

      {error && <ErrorText value={error.message} className="text-right mt-1.5 pr-1 text-xs" />}

      {/* Action Button */}
      <div className="mt-5 sm:mt-6 w-full">
        {phoneLoading ? (
          <Button key="loading" disabled={true} className="opacity-80 h-11 text-xs sm:text-sm w-full">
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>ارسال کد...</span>
          </Button>
        ) : (
          <Button type="submit" className="h-11 text-xs sm:text-sm w-full">
            <span>ادامه</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Footer & Terms Link */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() => setIsTermsOpen(true)}
          className="text-[11px] font-kal-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          ورود شما به معنای پذیرش <span className="underline text-slate-500 hover:text-[#F47A20]">شرایط و قوانین</span> است
        </button>
      </div>

      {/* Terms Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}

export default LoginNumber;
