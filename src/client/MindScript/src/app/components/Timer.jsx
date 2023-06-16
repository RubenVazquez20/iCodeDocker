import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

export const Timer = ({ setTimerValue, resetTimer, setResetTimer }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (resetTimer) {
            setSeconds(0);
            setResetTimer(false);
        }
    }, [resetTimer, setResetTimer]);


    useEffect(() => {
        setTimerValue(seconds);
    }, [seconds, setTimerValue]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const remainingSeconds = time % 60;
        const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    };
    return (
        <Typography>
            {formatTime(seconds)}
        </Typography>
    );
};