import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import DetailsProfile from "./DetailsProfile";
import MainButtons from "./MainButtons";
import Skeleton from "./components/Skeleton";
import EditProfileModal from "./EditProfileModal";
import SupportDrawer from "@components/global/Drawers/SupportDrawer";
import useGet from "@hooks/server/useGet";
import { STORAGE_KEYS } from "@core/constants/storage-keys";
import { deleteCookie } from "../../utils/cookie";
import { clearStoredReferral } from "@hooks/useReferral";

const ProfileMain = () => {
  const navigate = useNavigate();
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  const { data: getME, isLoading } = useGet({}, 'users/getMe', `users/getMe_Get`);

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('lopon_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore error
      }
    }
    return { name: "کاربر لُپُن", mobile: "" };
  });

  useEffect(() => {
    if (getME?.data?.name || getME?.data?.mobile) {
      setProfileData((prev) => ({
        ...prev,
        name: getME.data.name || prev.name,
        mobile: getME.data.mobile || prev.mobile,
      }));
    }
  }, [getME?.data?.name, getME?.data?.mobile]);

  const handleSaveProfile = (updated) => {
    const merged = { ...profileData, ...updated };
    setProfileData(merged);
    localStorage.setItem('lopon_user_profile', JSON.stringify(merged));
  };

  const handleExitProfile = () => {
    deleteCookie(STORAGE_KEYS.AUTH_TOKEN);
    clearStoredReferral();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto px-3 py-2 flex flex-col">

      {isLoading ? (
        <Skeleton />
      ) : (
        <div className="flex-1 flex flex-col justify-start">
          {/* User Details (Avatar Ring, Pencil Badge, Name, Mobile) */}
          <DetailsProfile
            data={profileData}
            onEditClick={() => setIsEditOpen(true)}
          />

          {/* Main Action Button (سفارشات من) & 2x2 Grid */}
          <MainButtons
            isAdmin={getME?.data?.role === 'admin' || getME?.data?.role === 'ADMIN' || profileData?.role === 'admin'}
            onSupportClick={() => setIsSupportOpen(true)}
            onFaqClick={() => setIsSupportOpen(true)}
            onExitClick={() => setIsExitConfirmOpen(true)}
          />
        </div>
      )}

      {/* Support Drawer Modal */}
      <SupportDrawer isOpen={isSupportOpen} setIsOpen={setIsSupportOpen} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={profileData}
        onSave={handleSaveProfile}
      />

      {/* Exit Confirmation Centered Modal */}
      <AnimatePresence>
        {isExitConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-3xl w-full max-w-xs p-6 text-center shadow-2xl border border-slate-100 space-y-4"
              dir="rtl"
            >
              <div className="w-12 h-12 bg-orange-50 text-[#F47A20] rounded-full mx-auto flex items-center justify-center border border-orange-100">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-kal-3 font-bold text-slate-800">خروج از حساب کاربری</h3>
                <p className="text-xs font-kal-2 text-slate-500 leading-relaxed">
                  آیا از خروج از حساب کاربری خود اطمینان دارید؟
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExitProfile}
                  className="flex-1 py-3 bg-[#F47A20] hover:bg-[#d66311] text-white text-xs font-kal-3 font-bold rounded-2xl transition-all shadow-sm cursor-pointer"
                >
                  تایید و خروج
                </button>
                <button
                  type="button"
                  onClick={() => setIsExitConfirmOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-kal-3 font-bold rounded-2xl transition-all cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileMain;
