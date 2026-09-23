import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Users, Share2 } from 'lucide-react';
import { BiSupport } from 'react-icons/bi';
import ReferralGiftImg from '@assets/images/referral-gift.jpg';
import SupportDrawer from '@components/global/Drawers/SupportDrawer';
import { userService } from '@services/user.service';
import { getCookie } from '@utils/cookie';
import { STORAGE_KEYS } from '@core/constants/storage-keys';
import { useTopAlert } from '@hooks/useTopAlert';

function Referral() {
  const navigate = useNavigate();
  const { showAlert } = useTopAlert();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [user, setUser] = useState(null);

  const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);

  // Fetch current user data safely ONLY if token exists
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    userService
      .getMe()
      .then((res) => {
        if (isMounted && res?.data?.data) {
          setUser(res.data.data);
        }
      })
      .catch(() => {
        // Silently ignore if unauthorized without looping
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const referralCode = user?.referralCode || user?.mobile || '';

  // Generate invitation link (always use production domain https://lopon.ir unless in valid non-local origin)
  const origin =
    typeof window !== 'undefined' &&
    window.location.hostname &&
    !window.location.hostname.includes('localhost') &&
    !window.location.hostname.includes('127.0.0.1')
      ? window.location.origin
      : 'https://lopon.ir';

  const inviteLink = referralCode
    ? `${origin}/login?ref=${referralCode}`
    : `${origin}/login`;

  const shareText = `🎁 هدیه ۱۵۰ هزار تومانی در لوپُن!
دوست عزیز، با ثبت‌نام از طریق لینک اختصاصی من در لوپُن، تخفیف‌های ویژه خدمات کرمان رو دریافت کن:`;

  const copyToClipboard = async (text) => {
    let copied = false;

    // 1. Try Modern Clipboard API (works on HTTPS/localhost)
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (e) {
        // Continue to fallback
      }
    }

    // 2. Universal textarea + execCommand fallback (works on Mobile HTTP IP, WebViews, Safari/Chrome)
    if (!copied && typeof document !== 'undefined') {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.style.opacity = '0.01';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.warn('execCommand copy error:', err);
      }
    }

    return copied;
  };

  const handleShare = async () => {
    const fullText = `${shareText}\n\n${inviteLink}`;

    // 1. Trigger Native Mobile System Share Sheet first (preserving user gesture token)
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        const shareData = {
          title: 'دعوت به لوپُن',
          text: shareText,
          url: inviteLink,
        };

        if (navigator.canShare && !navigator.canShare(shareData)) {
          await navigator.share({
            title: 'دعوت به لوپُن',
            text: fullText,
          });
        } else {
          await navigator.share(shareData);
        }
        return;
      } catch (err) {
        // User dismissed native share sheet
        if (err?.name === 'AbortError') {
          return;
        }
        console.warn('Native share failed or rejected, falling back to clipboard:', err);
      }
    }

    // 2. Fallback: Copy to clipboard if Web Share API is not supported or failed
    const copied = await copyToClipboard(fullText);
    if (copied) {
      showAlert({
        type: 'success',
        message: 'لینک اختصاصی دعوت کپی شد!',
      });
    } else {
      showAlert({
        type: 'error',
        message: 'امکان اشتراک‌گذاری در این مرورگر وجود ندارد',
      });
    }
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="w-full h-full min-h-[100dvh] max-h-[100dvh] flex flex-col justify-between items-center px-4 sm:px-5 py-3 sm:py-4 pb-6 sm:pb-8 bg-[#FAF7F2] select-none overflow-hidden max-w-[460px] mx-auto box-border" dir="rtl">

      {/* 1. Header (Back button on Right, Title in Center, Support Drawer button on Left) */}
      <div className="w-full relative flex items-center justify-between pt-0.5 pb-1 shrink-0">
        {/* Right in RTL: Circular Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-3xs cursor-pointer z-10 border border-slate-100/60"
          aria-label="بازگشت"
        >
          <ChevronRight className="w-5 h-5 text-slate-700 stroke-[2.4]" />
        </button>

        {/* Center: Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="font-kal-3 font-bold text-[#222E42] text-[16.5px] sm:text-[18px]">
            دعوت دوستان
          </h1>
        </div>

        {/* Left in RTL: Support Drawer Button */}
        <button
          type="button"
          onClick={() => setIsSupportOpen(true)}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-3xs cursor-pointer z-10 border border-slate-100/60"
          aria-label="پشتیبانی"
        >
          <BiSupport size={20} className="text-slate-700" />
        </button>
      </div>

      {/* 2. Main Content (Evenly and generously spaced) */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full flex-1 flex flex-col items-center justify-evenly py-1 sm:py-3 my-auto overflow-hidden"
      >
        {/* Item 1: 3D Gift Box Illustration (Enlarged) */}
        <div className="relative flex items-center justify-center shrink-0 my-1">
          <img
            src={ReferralGiftImg}
            alt="هدیه لوپُن"
            className="h-[27vh] max-h-[235px] min-h-[150px] w-auto aspect-square object-contain mix-blend-multiply pointer-events-none border-none outline-none"
          />
        </div>

        {/* Item 2: Headlines (Bolder & Larger Headline with comfortable spacing) */}
        <div className="text-center px-2 shrink-0 my-1.5 sm:my-2.5">
          <h2 className="text-[22px] sm:text-[25px] font-black text-[#222E42] font-kal-3 tracking-tight mb-2 leading-snug">
            دوستاتو دعوت کن،
          </h2>
          <p className="text-[16px] sm:text-[18px] font-black text-[#222E42] font-kal-3 leading-relaxed">
            تا سقف <span className="text-[#F47A20] font-black">۳ میلیون تومان هدیه</span> بگیر !
          </p>
        </div>

        {/* Item 3: Feature / Benefit Card */}
        <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 shadow-[0_4px_25px_rgba(0,0,0,0.025)] border border-white flex items-center gap-3.5 text-right shrink-0 my-1.5 sm:my-2.5">
          {/* Right side in RTL: Icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#FFF6F0] flex items-center justify-center shrink-0 border border-orange-50">
            <Users className="w-6 h-6 text-[#F47A20] stroke-[2.2]" />
          </div>

          {/* Left side in RTL: Text */}
          <div className="flex flex-col gap-0.5 flex-1 pr-0.5">
            <h3 className="text-[14px] sm:text-[15px] font-black text-[#222E42] font-kal-3">
              دعوت و ثبت نام دوستان
            </h3>
            <p className="text-[11.5px] sm:text-[12px] text-[#64748B] font-kal-2 leading-relaxed">
              به ازای هر خرید و ثبت نام موفق دوستان،{' '}
              <span className="text-[#F47A20] font-bold font-kal-3">۱۵۰ هزار تومان هدیه</span>{' '}
              بگیر
            </p>
          </div>
        </div>
      </motion.div>

      {/* 3. Bottom Action Button */}
      <div className="w-full pt-3 pb-2 sm:pb-3 shrink-0">
        <button
          type="button"
          onClick={handleShare}
          className="w-full py-3.5 sm:py-4 bg-[#F47A20] hover:bg-[#d66311] active:scale-[0.98] text-white rounded-2xl flex items-center justify-center gap-2.5 font-kal-3 font-black text-[15px] sm:text-[16px] shadow-md shadow-[#F47A20]/25 transition-all cursor-pointer"
        >
          <Share2 className="w-5 h-5 stroke-[2.4]" />
          <span>اشتراک گذاری</span>
        </button>
      </div>

      {/* Support Drawer */}
      <SupportDrawer
        isOpen={isSupportOpen}
        setIsOpen={setIsSupportOpen}
      />
    </div>
  );
}

export default Referral;
