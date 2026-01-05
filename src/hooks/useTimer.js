import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialTime = 0, options = {}) => {
  const { autoStart = false, onComplete, interval = 1000 } = options;
  
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);

  const start = useCallback(() => {
    setIsRunning(true);
    setIsCompleted(false);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback((newTime = initialTime) => {
    setTime(newTime);
    setIsRunning(autoStart);
    setIsCompleted(false);
  }, [initialTime, autoStart]);

  const addTime = useCallback((seconds) => {
    setTime(prev => prev + seconds);
  }, []);

  const formatTime = useCallback((seconds = time) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [time]);

  const getProgress = useCallback((totalTime) => {
    if (totalTime <= 0) return 0;
    return Math.min(100, (time / totalTime) * 100);
  }, [time]);

  useEffect(() => {
    let intervalId;

    if (isRunning && time > 0) {
      intervalId = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsRunning(false);
            setIsCompleted(true);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, interval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, time, interval, onComplete]);

  return {
    time,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    addTime,
    formatTime,
    getProgress,
    setTime
  };
};