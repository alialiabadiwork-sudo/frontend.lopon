import { useState, useEffect, useCallback } from 'react';

const useTimer = (initialMinutes) => {
    const initialTime = initialMinutes * 60; 
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);

            return () => clearInterval(timerId); 
        } else {
            setIsTimeUp(true); 
        }
    }, [timeLeft]);

    const resetTimer = useCallback(() => {
        setTimeLeft(initialTime); 
        setIsTimeUp(false); 
    }, [initialTime]);

    const minutes = Math.floor(timeLeft / 60); 
    const seconds = timeLeft % 60; 
    return { minutes, seconds, isTimeUp, resetTimer };
};

export default useTimer;