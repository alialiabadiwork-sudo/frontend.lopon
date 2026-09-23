import React from 'react'
import { twMerge } from 'tailwind-merge';

function Card({children , classCard , classBody}) {
  return (
    <div className={twMerge("card  bg-white mb-4" , classCard)}>
      <div className={twMerge("card-body p-3" , classBody)}>
        {children}
      </div>
    </div>
  )
}

export default Card