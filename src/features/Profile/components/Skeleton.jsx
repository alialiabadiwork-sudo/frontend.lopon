import React from 'react'

function Skeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-5 mt-2 animate-pulse">
      {/* Avatar Circle Skeleton */}
      <div className="flex flex-col items-center gap-3">
        <div className="skeleton h-24 w-24 rounded-full"></div>
        <div className="skeleton h-5 w-32 rounded-md"></div>
        <div className="skeleton h-4 w-24 rounded-md"></div>
      </div>

      {/* Main Button Skeleton */}
      <div className="skeleton h-14 w-full rounded-2xl mt-2"></div>

      {/* 2x2 Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        <div className="skeleton h-14 w-full rounded-2xl"></div>
        <div className="skeleton h-14 w-full rounded-2xl"></div>
        <div className="skeleton h-14 w-full rounded-2xl"></div>
        <div className="skeleton h-14 w-full rounded-2xl"></div>
      </div>
    </div>
  )
}

export default Skeleton
