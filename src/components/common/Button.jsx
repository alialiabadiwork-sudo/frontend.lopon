import React from 'react';
import { twMerge } from 'tailwind-merge';

function Button({ children, className, disabled, onClick, type = "button", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(
        "w-full flex items-center justify-center gap-2 bg-[#F47A20] hover:bg-[#e06810] text-white font-kal-3 font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm shadow-[#F47A20]/20",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
