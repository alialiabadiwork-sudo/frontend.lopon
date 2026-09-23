import React from 'react'

function Skeleton() {
  return (
    < >
      <div className="flex w-100 flex-col gap-4 mt-5 px-3">
        <div className="skeleton h-48  w-100  rounded-lg "></div>
        <div className="skeleton h-48 w-100  rounded-lg "></div>
        <div className="skeleton h-48  w-100  rounded-lg"></div>
        <div className="skeleton h-48  w-100  rounded-lg"></div>
      </div>
    </>
  )
}

export default Skeleton