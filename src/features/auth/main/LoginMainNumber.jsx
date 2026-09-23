import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import LoginIcon from "@components/svg/LoginIcon";
import { ValidationForms } from "@utils/forms";
import useZeroPhone from "@hooks/validations/useZeroPhone";
import LoginNumber from "../components/LoginNumber";
import { authService } from "@services/auth.service";
import { useTopAlert } from "@hooks/useTopAlert";
import PageHeader from "@components/global/headings/PageHeader";
import useReferralCapture, { clearStoredReferral } from "@hooks/useReferral";

import { getCookie } from "@utils/cookie";
import { STORAGE_KEYS } from "@core/constants/storage-keys";

const validator = new ValidationForms();

const LoginMainNumber = () => {
  const { register, formState: { errors }, setValue, watch, handleSubmit } = useForm();
  useZeroPhone(setValue, watch, "mobile");
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useTopAlert();
  const [loading, setLoading] = useState(false);
  const referralData = useReferralCapture();

  // 1. Check if user is already logged in (once on mount)
  useEffect(() => {
    const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      const params = new URLSearchParams(location.search);
      const hasRef = params.get("ref") || params.get("referral") || params.get("code") || params.get("invite") || referralData?.code;
      if (hasRef) {
        clearStoredReferral();
      }
      showAlert({ type: "info", message: "شما قبلاً وارد سیستم شده‌اید." });
      navigate("/", { replace: true });
    }
  }, []);

  // 2. Alert if referral code was explicitly invalid (once per invalid code)
  const hasAlertedInvalid = React.useRef(false);
  useEffect(() => {
    if (referralData?.isInvalid && !hasAlertedInvalid.current) {
      hasAlertedInvalid.current = true;
      showAlert({ type: "error", message: "کد دعوت وارد شده نامعتبر می‌باشد" });
    }
  }, [referralData?.isInvalid]);

  useEffect(() => {
    if (!location.state?.fromCheckout) {
      sessionStorage.removeItem("redirect_after_login");
    }
  }, [location.state]);

  const submitForm = async (formData) => {
    const mobile = formData.mobile || watch("mobile");
    if (!mobile) return;

    setLoading(true);
    try {
      const res = await authService.sendOtp({ mobile });
      setLoading(false);

      if (res?.data?.status === "success" || res?.status === 200 || res?.data) {
        const successMsg = res?.data?.message || "کد تایید ارسال شد";
        showAlert({ type: "success", message: successMsg });
        navigate(`/login/otp/${mobile}`, { state: location.state });
      } else {
        const errorMsg = res?.data?.message || "خطا در ارسال کد تایید";
        showAlert({ type: "error", message: errorMsg });
      }
    } catch (err) {
      setLoading(false);
      const errorMsg = err?.response?.data?.message || "خطا در ارسال کد تایید. لطفاً مجدداً تلاش کنید.";
      showAlert({ type: "error", message: errorMsg });

      // Navigate to OTP page for testing environment or demo fallback
      setTimeout(() => {
        navigate(`/login/otp/${mobile}`, { state: location.state });
      }, 1200);
    }
  };

  const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full h-full flex flex-col justify-between relative select-none overflow-hidden">
      {/* Page Header with Back and Support Drawer */}
      <PageHeader title="ورود / ثبت‌نام" showSupportIcon={true} onBack={() => navigate('/')} />

      {/* Main Content Area */}
      <div className="flex-1 w-full flex flex-col justify-center items-center px-5 sm:px-6 py-2 relative overflow-y-auto no-scrollbar my-auto">
        {/* Premium subtle background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onSubmit={handleSubmit(submitForm)}
          className="w-full max-w-[380px] relative z-10 flex flex-col items-center my-auto"
        >
          <div className="scale-90 sm:scale-100 origin-center transition-transform shrink-0">
            <LoginIcon />
          </div>
          <div className="w-full mt-1 sm:mt-2">
            <LoginNumber
              validation={register('mobile', { required: "شماره موبایل الزامی می‌باشد!", validate: validator.validatePhone })}
              error={errors.mobile}
              phoneLoading={loading}
              inviterInfo={referralData?.info}
            />
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default LoginMainNumber;

