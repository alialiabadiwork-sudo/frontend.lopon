import React from 'react';
import { twMerge } from 'tailwind-merge';

const ErrorText = ({value , className}) => {
    return (
        <div className={twMerge("text-xs font-kal-2 text-red-500 my-2" , className)}>{value}</div>
    );
}

export default ErrorText;
