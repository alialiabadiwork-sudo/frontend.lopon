import React from 'react';

export default function DefaultAvatarSVG({ className = "w-full h-full" }) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Soft Modern Slate-Grey Background Gradient */}
        <linearGradient id="neutral-avatar-bg" x1="80" y1="0" x2="80" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* Head Gradient */}
        <linearGradient id="neutral-avatar-head" x1="80" y1="32" x2="80" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Torso/Shoulders Gradient */}
        <linearGradient id="neutral-avatar-body" x1="80" y1="98" x2="80" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>

        {/* Circular Clip to keep bounds perfectly rounded */}
        <clipPath id="neutral-avatar-clip">
          <circle cx="80" cy="80" r="80" />
        </clipPath>

        {/* Soft Ambient Shadow for Head */}
        <filter id="head-shadow" x="46" y="28" width="68" height="68" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#334155" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Main Background */}
      <circle cx="80" cy="80" r="80" fill="url(#neutral-avatar-bg)" />

      {/* Clipped Silhouette Group */}
      <g clipPath="url(#neutral-avatar-clip)">
        {/* Body / Shoulders */}
        <path
          d="M 22 148 C 22 114 48 98 80 98 C 112 98 138 114 138 148 C 138 168 128 170 80 170 C 32 170 22 168 22 148 Z"
          fill="url(#neutral-avatar-body)"
        />

        {/* Head */}
        <g filter="url(#head-shadow)">
          <circle cx="80" cy="58" r="26" fill="url(#neutral-avatar-head)" />
        </g>
      </g>
    </svg>
  );
}
