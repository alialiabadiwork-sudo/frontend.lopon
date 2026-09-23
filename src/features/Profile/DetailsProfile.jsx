import React, { useState } from 'react';
import DefaultAvatarSVG from '@components/common/DefaultAvatarSVG';
import { Pencil } from 'lucide-react';

function DetailsProfile({ data, onEditClick }) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = data?.avatar;

  return (
    <div className="flex flex-col items-center justify-center my-4">
      {/* Avatar Container */}
      <div className="relative">
        {/* Orange Ring Frame */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[3px] border-[#F47A20] p-1 bg-white shadow-xs flex items-center justify-center overflow-hidden">
          {avatarUrl && !imgError ? (
            <img
              src={avatarUrl}
              alt={data?.name || "پروفایل"}
              className="w-full h-full rounded-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <DefaultAvatarSVG className="w-full h-full rounded-full" />
          )}
        </div>

        {/* Pencil Edit Icon Badge */}
        <button
          type="button"
          onClick={onEditClick}
          className="absolute top-0 left-0 w-7 h-7 rounded-full bg-[#f4f5f7] border-2 border-white flex items-center justify-center text-slate-600 shadow-xs hover:bg-slate-200 transition-all cursor-pointer"
          title="ویرایش پروفایل"
        >
          <Pencil className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>

      {/* User Name */}
      <h2 className="font-kal-3 font-bold text-slate-800 text-lg sm:text-xl mt-3 text-center">
        {data?.name || "کاربر لُپُن"}
      </h2>

      {/* Mobile Number */}
      <p className="text-slate-400 font-kal-2 text-sm mt-0.5 text-center dir-ltr">
        {data?.mobile || ""}
      </p>
    </div>
  );
}

export default DetailsProfile;

