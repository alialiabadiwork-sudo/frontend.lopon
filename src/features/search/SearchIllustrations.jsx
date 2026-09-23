import React from 'react';

/**
 * Custom high-craft SVG Illustration for Empty Search (Initial Idle State)
 * Designed in the same visual language as Lopon's EmptyCartIllustration:
 * Ambient glow, warm peach/orange tones, floating sparkles, modern vector geometry.
 */
export const SearchIdleIllustration = () => (
  <div className="relative w-44 h-44 mx-auto flex items-center justify-center select-none">
    {/* Soft glowing ambient background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-orange-100 via-amber-50 to-orange-200/50 rounded-full blur-2xl opacity-75 animate-pulse" />
    <div className="absolute w-36 h-36 bg-orange-50/70 rounded-full border border-orange-100/90 shadow-inner flex items-center justify-center" />

    {/* SVG Vector Elements */}
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-36 h-36">
      <defs>
        <linearGradient id="search-idle-lens" x1="42" y1="38" x2="102" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#FFF5ED" />
          <stop offset="1" stopColor="#FFE8D8" />
        </linearGradient>

        <linearGradient id="search-idle-rim" x1="38" y1="34" x2="104" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F47A20" />
          <stop offset="1" stopColor="#E0650D" />
        </linearGradient>

        <linearGradient id="search-idle-handle" x1="94" y1="92" x2="132" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F47A20" />
          <stop offset="1" stopColor="#C95404" />
        </linearGradient>

        <filter id="shadow-search-idle" x="24" y="20" width="118" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#F47A20" floodOpacity="0.16" />
        </filter>
      </defs>

      {/* Decorative ambient background particles */}
      <circle cx="28" cy="38" r="4" fill="#F47A20" fillOpacity="0.25" />
      <circle cx="136" cy="46" r="5" fill="#FFB800" fillOpacity="0.35" />
      <circle cx="24" cy="116" r="3.5" fill="#F47A20" fillOpacity="0.18" />
      <circle cx="136" cy="114" r="3" fill="#FFB800" fillOpacity="0.3" />

      {/* Floating 4-pointed Sparkle 1 */}
      <path d="M128 28L130 34L136 36L130 38L128 44L126 38L120 36L126 34L128 28Z" fill="#F47A20" />

      {/* Floating 4-pointed Sparkle 2 */}
      <path d="M34 90L35.5 94.5L40 96L35.5 97.5L34 102L32.5 97.5L28 96L32.5 94.5L34 90Z" fill="#FFB800" />

      {/* Main Stylized Magnifying Glass */}
      <g filter="url(#shadow-search-idle)">
        {/* Handle */}
        <path d="M96 94L124 122" stroke="url(#search-idle-handle)" strokeWidth="12" strokeLinecap="round" />
        <path d="M98 96L122 120" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.65" />
        <circle cx="124" cy="122" r="6" fill="#C95404" />

        {/* Outer Lens Rim and Glass */}
        <circle cx="68" cy="66" r="32" fill="url(#search-idle-lens)" stroke="url(#search-idle-rim)" strokeWidth="6" />

        {/* Lens Inner Glass Highlight Arc */}
        <path d="M48 52C53 45 61 41 71 41" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />

        {/* Center Sparkle in Lens - representing discovery / beauty salons */}
        <path d="M68 50L71.5 61.5L83 65L71.5 68.5L68 80L64.5 68.5L53 65L64.5 61.5L68 50Z" fill="#F47A20" />
        <circle cx="68" cy="65" r="4" fill="#FFB800" />
        <circle cx="68" cy="65" r="1.8" fill="#FFFFFF" />
      </g>
    </svg>
  </div>
);

/**
 * Custom high-craft SVG Illustration for Search No Results
 * Designed in the same visual language: clean, minimal, non-cluttered, matching Lopon brand.
 */
export const SearchNoResultIllustration = () => (
  <div className="relative w-44 h-44 mx-auto flex items-center justify-center select-none">
    {/* Soft glowing ambient background */}
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/60 via-slate-100 to-orange-100/40 rounded-full blur-2xl opacity-65" />
    <div className="absolute w-36 h-36 bg-slate-50/80 rounded-full border border-slate-200/70 shadow-inner flex items-center justify-center" />

    {/* SVG Vector Elements */}
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-36 h-36">
      <defs>
        <linearGradient id="search-nores-lens" x1="42" y1="38" x2="102" y2="98" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.6" stopColor="#F8FAFC" />
          <stop offset="1" stopColor="#F1F5F9" />
        </linearGradient>

        <linearGradient id="search-nores-rim" x1="38" y1="34" x2="104" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient id="search-nores-handle" x1="94" y1="92" x2="132" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>

        <filter id="shadow-search-nores" x="24" y="20" width="118" height="120" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Decorative ambient background particles */}
      <circle cx="28" cy="40" r="3.5" fill="#94A3B8" fillOpacity="0.25" />
      <circle cx="134" cy="48" r="4.5" fill="#F47A20" fillOpacity="0.2" />
      <circle cx="26" cy="118" r="3" fill="#CBD5E1" fillOpacity="0.3" />
      <circle cx="136" cy="112" r="3" fill="#94A3B8" fillOpacity="0.2" />

      {/* Floating subtle sparkle */}
      <path d="M128 32L129.5 36.5L134 38L129.5 39.5L128 44L126.5 39.5L122 38L126.5 36.5L128 32Z" fill="#F47A20" fillOpacity="0.4" />

      {/* Main Stylized Lens with Empty Search Indicator */}
      <g filter="url(#shadow-search-nores)">
        {/* Handle */}
        <path d="M96 94L124 122" stroke="url(#search-nores-handle)" strokeWidth="12" strokeLinecap="round" />
        <path d="M98 96L122 120" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        <circle cx="124" cy="122" r="6" fill="#64748B" />

        {/* Outer Lens Rim and Glass */}
        <circle cx="68" cy="66" r="32" fill="url(#search-nores-lens)" stroke="url(#search-nores-rim)" strokeWidth="6" />

        {/* Lens Inner Glass Highlight Arc */}
        <path d="M48 52C53 45 61 41 71 41" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />

        {/* Clean, Friendly Question / Missing Mark in Lens */}
        <path d="M61 57C61 53 64.5 50.5 68.5 50.5C72.5 50.5 76 53 76 57C76 60.5 73.5 62.5 70.5 64C69 65 68.5 66.5 68.5 68.5" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="68.5" cy="76" r="2.2" fill="#94A3B8" />
      </g>
    </svg>
  </div>
);
