import React from 'react';
import LoponLogo from '@assets/images/lopon-logo.png';

function LoginIcon() {
  return (
    <div className="pb-8 pt-4 flex justify-center items-center">
      <img
        src={LoponLogo}
        alt="لوپُن"
        className="h-28 w-auto object-contain max-w-[220px] transition-transform duration-300 hover:scale-[1.03]"
      />
    </div>
  );
}

export default LoginIcon;

