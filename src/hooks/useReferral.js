import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { authService } from "@services/auth.service";
import { getCookie } from "@utils/cookie";
import { STORAGE_KEYS } from "@core/constants/storage-keys";

const REFERRAL_CODE_KEY = "lopon_referral_code";
const INVITER_INFO_KEY = "lopon_inviter_info";

export const getStoredReferral = () => {
  try {
    const code = sessionStorage.getItem(REFERRAL_CODE_KEY);
    const infoRaw = sessionStorage.getItem(INVITER_INFO_KEY);
    let info = null;
    if (infoRaw) {
      try {
        info = JSON.parse(infoRaw);
      } catch (e) {
        info = null;
      }
    }
    return { code, info };
  } catch (e) {
    return { code: null, info: null };
  }
};

export const clearStoredReferral = () => {
  try {
    sessionStorage.removeItem(REFERRAL_CODE_KEY);
    sessionStorage.removeItem(INVITER_INFO_KEY);
    localStorage.removeItem(REFERRAL_CODE_KEY);
    localStorage.removeItem(INVITER_INFO_KEY);
  } catch (e) {
    // Ignore storage errors safely
  }
};

if (typeof window !== "undefined") {
  window.clearStoredReferral = clearStoredReferral;
  window.getStoredReferral = getStoredReferral;
}

export function useReferralCapture() {
  const location = useLocation();
  const [referralData, setReferralData] = useState(getStoredReferral);
  const checkedCodesRef = useRef(new Set());

  useEffect(() => {
    const token = getCookie(STORAGE_KEYS.AUTH_TOKEN);
    const params = new URLSearchParams(location.search);
    const refCode = params.get("ref") || params.get("referral") || params.get("code") || params.get("invite");

    // If user is already authenticated, do not capture referral
    if (token) {
      if (refCode) {
        clearStoredReferral();
      }
      setReferralData({ code: null, info: null, isInvalid: false });
      return;
    }

    // Case 1: Referral query param is present in URL
    if (refCode && refCode.trim() !== "") {
      const cleanCode = refCode.trim();

      // Skip redundant network calls if already checked in this session
      if (checkedCodesRef.current.has(cleanCode)) {
        const current = getStoredReferral();
        if (current.code === cleanCode && current.info) {
          setReferralData({ code: cleanCode, info: current.info, isInvalid: false });
        }
        return;
      }
      checkedCodesRef.current.add(cleanCode);

      // Verify and fetch inviter info from Backend API
      authService
        .checkReferral(cleanCode)
        .then((res) => {
          if (res?.data?.status === "success" || res?.data?.valid || res?.status === 200) {
            const inviter = res?.data?.data || res?.data;
            const hasRealName = inviter?.inviterName && inviter.inviterName.trim() !== "" && inviter.inviterName !== "بدون نام کاربری" && inviter.inviterName !== "کاربر لوپُن";
            const displayName = hasRealName ? inviter.inviterName : (inviter?.mobile || "کاربر لوپُن");

            const infoToSave = {
              code: cleanCode,
              inviterName: displayName,
              inviterMobile: inviter?.mobile || "",
              isValid: true,
            };
            sessionStorage.setItem(REFERRAL_CODE_KEY, cleanCode);
            sessionStorage.setItem(INVITER_INFO_KEY, JSON.stringify(infoToSave));
            setReferralData({ code: cleanCode, info: infoToSave, isInvalid: false });
          } else {
            clearStoredReferral();
            setReferralData({ code: null, info: null, isInvalid: true });
          }
        })
        .catch((err) => {
          if (err?.response?.status === 404) {
            clearStoredReferral();
            setReferralData({ code: null, info: null, isInvalid: true });
          } else {
            const fallbackInfo = { code: cleanCode, inviterName: "کاربر لوپُن", isValid: true };
            sessionStorage.setItem(REFERRAL_CODE_KEY, cleanCode);
            sessionStorage.setItem(INVITER_INFO_KEY, JSON.stringify(fallbackInfo));
            setReferralData({ code: cleanCode, info: fallbackInfo, isInvalid: false });
          }
        });
    } else {
      // Case 2: No ref param in URL (e.g. user returned back from OTP page during same session)
      const stored = getStoredReferral();
      if (stored.code && stored.info) {
        setReferralData({ code: stored.code, info: stored.info, isInvalid: false });
      } else {
        setReferralData({ code: null, info: null, isInvalid: false });
      }
    }
  }, [location.search]);

  return referralData;
}

export default useReferralCapture;
