import { useState, useEffect, useCallback, useRef } from 'react';
import { useData } from '../context/DataContext';

export function useTimelineSlider() {
  const { 
    timelineData, 
    filterMarkersByDate, 
    selectedDate, 
    setSelectedDate, 
    daysRange, 
    setDaysRange,
    selectedSexo,
    selectedCondicion,
    edadRange,
    sumScoreRange,
    timeScale
  } = useData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [velocity, setVelocity] = useState(500);
  const intervalRef = useRef(null);

  const getDaysRange = (date, scale) => {
    switch(scale) {
      case 'weekly': return 7;
      case 'bi-weekly': return 14;
      case 'monthly': return 30;
      case 'yearly': return 365;
      default: return 1;
    }
  };

  const handleDateChange = useCallback((date) => {
    if (!date) return;
    setSelectedDate(date);
    filterMarkersByDate(date, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange);
  }, [filterMarkersByDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange, setSelectedDate]);

  useEffect(() => {
    if (timelineData.length > 0 && !selectedDate) {
      const initialDate = new Date(Math.min(...timelineData.map(d => parseInt(d.timestamp)).filter(t => !isNaN(t))));
      handleDateChange(initialDate);
      setDaysRange(getDaysRange(initialDate, timeScale));
    }
  }, [timelineData, timeScale]);

  useEffect(() => {
    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  }, [selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange, handleDateChange]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setSelectedDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setDate(newDate.getDate() + 1);
          return newDate;
        });
      }, velocity);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, velocity, setSelectedDate]);

  useEffect(() => {
    if (selectedDate) {
      setDaysRange(getDaysRange(selectedDate, timeScale));
    }
  }, [timeScale, selectedDate, setDaysRange]);

  const playForward = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    const maxDate = new Date(Math.max(
      ...timelineData.map(d => parseInt(d.timestamp)).filter(t => !isNaN(t))
    ));
    if (newDate > maxDate) return;
    setSelectedDate(newDate);
  };

  const stepForward = () => {
    if (!selectedDate) return;
    playForward();
  };

  const stepBackward = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    const minDate = new Date(Math.min(
      ...timelineData.map(d => parseInt(d.timestamp)).filter(t => !isNaN(t))
    ));
    if (newDate < minDate) return;
    setSelectedDate(newDate);
  };

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  const timestamps = timelineData
    .map(d => parseInt(d.timestamp))
    .filter(timestamp => !isNaN(timestamp));
  const minDate = timestamps.length ? new Date(Math.min(...timestamps)) : null;
  const maxDate = timestamps.length ? new Date(Math.max(...timestamps)) : null;

  return {
    isPlaying,
    selectedDate,
    minDate,
    maxDate,
    velocity,
    setVelocity,
    stepBackward,
    stepForward,
    togglePlayPause,
    handleDateChange,
    timelineData,
    daysRange,
    setDaysRange,
  };
}
