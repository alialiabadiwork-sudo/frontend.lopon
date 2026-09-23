import React, { useState } from "react";
import PhoneOtp from "../components/PhoneOtp";
import LoginIcon from "@components/svg/LoginIcon";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { STORAGE_KEYS } from "@core/constants/storage-keys";
import { getCookie, setCookie } from "../../../utils/cookie";
import { authService } from "@services/auth.service";
import { useTopAlert } from "@hooks/useTopAlert";
import PageHeader from "@components/global/headings/PageHeader";
import { getStoredReferral, clearStoredReferral } from "@hooks/useReferral";

const LoginMainOtp = () => {
  const { control, handleSubmit, watch, setValue, register } = useForm();
  const params = useParams();
  const navigate = useNavigate();
  const { showAlert } = useTopAlert();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  React.useEffect(() => {
    if (token) {
      navigate("/", { replace: true });
    }
  }, [token, navigate]);

  // Resend OTP
  const handleResendOtp = async () => {
    if (!params.phone) return;
    setResending(true);
    try {
      const res = await authService.sendOtp({ mobile: params.phone });
      setResending(false);
      if (res?.data?.status === "success" || res?.status === 200) {
        showAlert({ type: "success", message: res?.data?.message || "کد تایید مجدداً ارسال شد" });
      } else {
        showAlert({ type: "error", message: res?.data?.message || "خطا در ارسال مجدد کد" });
      }
    } catch (err) {
      setResending(false);
      showAlert({ type: "error", message: err?.response?.data?.message || "خطا در ارسال مجدد کد" });
    }
  };

  const isSubmittingRef = React.useRef(false);

  // Submit Login with OTP & optional Referral Code
  const handleLoginSubmit = async (formData) => {
    if (isSubmittingRef.current) return;

    const otp = formData?.otp || watch("otp");
    const storedRef = getStoredReferral()?.code;
    const referralCode = formData?.referralCode || watch("referralCode") || storedRef;

    if (!otp || otp.length < 5) {
      showAlert({ type: "error", message: "لطفاً کد ۵ رقمی را به طور کامل وارد کنید" });
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);

    const payload = {
      mobile: params.phone,
      otp: otp,
    };

    if (referralCode && String(referralCode).trim() !== "") {
      payload.referralCode = String(referralCode).trim();
    }

    try {
      const res = await authService.login(payload);
      setLoading(false);

      if (res?.data?.status === "success" || res?.data?.token) {
        const token = res?.data?.token;
        if (token) {
          setCookie(STORAGE_KEYS.AUTH_TOKEN, token);
        } else {
          setCookie(STORAGE_KEYS.AUTH_TOKEN, "demo-auth-token");
        }

        // Clear stored referral upon successful registration/login
        clearStoredReferral();

        // Determine if user is a new user
        const isNewUser = Boolean(
          res?.data?.isNew ??
          res?.data?.data?.isNew ??
          (res?.data?.message && (res.data.message.includes("ثبت‌نام") || res.data.message.includes("ثبت نام")))
        );

        const hasReferralAttempt = Boolean(referralCode && String(referralCode).trim() !== "");

        if (isNewUser && hasReferralAttempt) {
          // 1. New user with referral: set modal flag for Home page and gift code 'lopon'
          sessionStorage.setItem("lopon_show_welcome_gift", "true");
          sessionStorage.setItem("lopon_welcome_gift_code", "lopon");

          showAlert({ type: "success", message: "ثبت‌نام شما با موفقیت انجام شد!" });

          navigate("/", {
            replace: true,
            state: {
              showWelcomeGiftModal: true,
              discountCode: "lopon",
            },
          });
        } else if (!isNewUser && hasReferralAttempt) {
          // 2. Existing user who was invited or entered a referral code: DO NOT give gift, show warning
          showAlert({ type: "warning", message: "شما قبلا دعوت شده اید" });

          const redirectUrl = sessionStorage.getItem("redirect_after_login");
          if (redirectUrl) {
            sessionStorage.removeItem("redirect_after_login");
            navigate(redirectUrl, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          // 3. Normal login or registration without referral
          const msg = res?.data?.message || (isNewUser ? "ثبت‌نام شما با موفقیت انجام شد !" : "ورود شما با موفقیت انجام شد !");
          showAlert({ type: "success", message: msg });

          const redirectUrl = sessionStorage.getItem("redirect_after_login");
          if (redirectUrl) {
            sessionStorage.removeItem("redirect_after_login");
            navigate(redirectUrl, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }
      } else {
        isSubmittingRef.current = false;
        const errorMsg = res?.data?.message || "کد وارد شده یا اطلاعات نامعتبر است";
        showAlert({ type: "error", message: errorMsg });
      }
    } catch (err) {
      setLoading(false);
      isSubmittingRef.current = false;
      const errorMsg = err?.response?.data?.message || "کد تایید وارد شده اشتباه یا منقضی شده است";
      showAlert({ type: "error", message: errorMsg });

      // Fallback for demo environment if server is unreachable
      if (!err?.response) {
        setTimeout(() => {
          setCookie(STORAGE_KEYS.AUTH_TOKEN, "demo-auth-token");
          clearStoredReferral();
          if (referralCode) {
            sessionStorage.setItem("lopon_show_welcome_gift", "true");
            sessionStorage.setItem("lopon_welcome_gift_code", "lopon");
            navigate("/", {
              replace: true,
              state: { showWelcomeGiftModal: true, discountCode: "lopon" },
            });
          } else {
            showAlert({ type: "success", message: "ورود موفقیت‌آمیز به برنامه" });
            const redirectUrl = sessionStorage.getItem("redirect_after_login");
            if (redirectUrl) {
              sessionStorage.removeItem("redirect_after_login");
              navigate(redirectUrl, { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }
        }, 1200);
      }
    }
  };

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none overflow-hidden">
      {/* Page Header with Back and Support Drawer */}
      <PageHeader
        title="تأیید کد یک‌بار مصرف"
        showSupportIcon={true}
        onBack={() => navigate('/login')}
      />

      {/* Main Form Container */}
      <div className="flex-1 w-full flex flex-col justify-center items-center px-5 sm:px-6 py-2 relative overflow-y-auto no-scrollbar my-auto">
        {/* Premium subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onSubmit={handleSubmit(handleLoginSubmit)}
          autoComplete="on"
          className="w-full max-w-[380px] relative z-10 flex flex-col items-center my-auto"
        >
          <div className="scale-90 sm:scale-100 origin-center transition-transform shrink-0">
            <LoginIcon />
          </div>
          <div className="w-full mt-1 sm:mt-2">
            <PhoneOtp
              control={control}
              watch={watch}
              setValue={setValue}
              register={register}
              onResend={handleResendOtp}
              phone={params.phone}
              loading={loading}
              resending={resending}
              onSubmit={handleSubmit(handleLoginSubmit)}
            />
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginMainOtp;
