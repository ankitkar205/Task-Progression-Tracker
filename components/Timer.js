import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

// Helper function to format seconds into HH:MM:SS
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds].map(v => v.toString().padStart(2, '0')).join(':');
};

const Timer = ({ startTime, style }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    // This function runs every second to update the timer
    const interval = setInterval(() => {
      const seconds = Math.round((Date.now() - startTime) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    // This is a cleanup function that runs when the component is unmounted
    // It prevents memory leaks by stopping the interval.
    return () => clearInterval(interval);
  }, [startTime]); // The effect re-runs only if the startTime changes

  return (
    <Text style={style}>
      Session: {formatTime(elapsedTime)}
    </Text>
  );
};

export default Timer;