import React from 'react';

function LoginHeader({ head, description }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-xl sm:text-2xl font-kal-3 font-black text-slate-900 tracking-tight">
        {head}
      </h1>
      
      {description && (
        <p className="text-xs sm:text-sm font-kal-2 text-slate-500 mt-2.5 max-w-[280px] mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export default LoginHeader;

