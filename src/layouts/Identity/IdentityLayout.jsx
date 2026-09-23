import React, { useEffect, useRef } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getCookie } from "@utils/cookie";
import { STORAGE_KEYS } from "@core/constants/storage-keys";
import { clearStoredReferral } from "@hooks/useReferral";
import { useTopAlert } from "@hooks/useTopAlert";

function IdentityLayout() {
  const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
  const location = useLocation();
  const { showAlert } = useTopAlert();
  const hasAlerted = useRef(false);

  useEffect(() => {
    if (token && !hasAlerted.current) {
      hasAlerted.current = true;
      const params = new URLSearchParams(location.search);
      const hasRef =
        params.get("ref") ||
        params.get("referral") ||
        params.get("code") ||
        params.get("invite");
      if (hasRef) {
        clearStoredReferral();
      }
      showAlert({ type: "info", message: "شما قبلاً وارد سیستم شده‌اید." });
    }
  }, [token, location.search, showAlert]);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-slate-100 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-[480px] h-[100dvh] max-h-[100dvh] bg-white shadow-2xl relative border-x border-slate-200 overflow-hidden flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default IdentityLayout;