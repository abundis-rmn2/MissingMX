import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';

const TimelineSlider = () => {
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
    timeScale // Get timeScale from context instead of local state
  } = useData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [velocity, setVelocity] = useState(500);

  const getDaysRange = (date, scale) => {
    switch(scale) {
      case 'weekly':
        return 7;
      case 'bi-weekly':
        return 14;
      case 'monthly':
        return 30;
      default:
        return 1;
    }
  };

  const handleDateChange = useCallback((date) => {
    if (!date) return;
    setSelectedDate(date);
    filterMarkersByDate(date, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange);
  }, [filterMarkersByDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange]);

  useEffect(() => {
    if (timelineData.length > 0 && !selectedDate) {
      const initialDate = new Date(Math.min(...timelineData.map(d => parseInt(d.timestamp)).filter(t => !isNaN(t))));
      handleDateChange(initialDate);
      setDaysRange(getDaysRange(initialDate, timeScale));
    }
  }, [timelineData, handleDateChange, setDaysRange, timeScale]);

  useEffect(() => {
    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  }, [selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange, handleDateChange]);

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        setSelectedDate(prevDate => {
          const newDate = new Date(prevDate);
          newDate.setDate(newDate.getDate() + 1);
          return newDate;
        });
      }, velocity);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, velocity, intervalId]);

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

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  if (!Array.isArray(timelineData) || timelineData.length === 0) {
    return <p>Loading timeline...</p>;
  }

  const timestamps = timelineData
    .map(d => parseInt(d.timestamp))
    .filter(timestamp => !isNaN(timestamp));

  if (timestamps.length === 0) return <p>No data available</p>;

  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date(Math.max(...timestamps));

  return (
<></>
  );
};

export default TimelineSlider;