import { useEffect } from 'react';
import { useData } from '../context/DataContext';

export const useTimelineSlider = () => {
  const {
    selectedDate,
    setSelectedDate,
    daysRange,
    timelineData,
    isTimelinePlaying,
    setIsTimelinePlaying,
    timelineVelocity,
    setTimelineVelocity,
  } = useData();

  const minDate = timelineData.length > 0 
    ? new Date(Math.min(...timelineData.map(d => d.timestamp)))
    : null;

  const maxDate = timelineData.length > 0
    ? new Date(Math.max(...timelineData.map(d => d.timestamp)))
    : null;

  const stepBackward = (days) => {
    setSelectedDate(prev => {
      if (!prev) return prev;
      const newDate = new Date(prev.getTime() - days * 86400000);
      return newDate < minDate ? minDate : newDate;
    });
  };

  const stepForward = (days) => {
    setSelectedDate(prev => {
      if (!prev) return prev;
      const newDate = new Date(prev.getTime() + days * 86400000);
      // Si llegamos al final, pausar la reproducción
      if (newDate >= maxDate) {
        setIsTimelinePlaying(false);
        return maxDate;
      }
      return newDate;
    });
  };

  const togglePlayPause = () => {
    setIsTimelinePlaying(prev => !prev);
  };

  useEffect(() => {
    let interval;
    if (isTimelinePlaying) {
      interval = setInterval(() => {
        stepForward(daysRange);
      }, timelineVelocity);
    }
    // Si llegamos al final, limpiar el intervalo
    if (selectedDate && maxDate && selectedDate >= maxDate) {
      clearInterval(interval);
      setIsTimelinePlaying(false);
    }
    return () => clearInterval(interval);
  }, [isTimelinePlaying, timelineVelocity, daysRange, selectedDate, maxDate]);

  return {
    isPlaying: isTimelinePlaying,
    selectedDate,
    minDate,
    maxDate,
    velocity: timelineVelocity,
    setVelocity: setTimelineVelocity,
    stepBackward,
    stepForward,
    togglePlayPause,
    handleDateChange: setSelectedDate,
    timelineData,
    daysRange,
  };
};
