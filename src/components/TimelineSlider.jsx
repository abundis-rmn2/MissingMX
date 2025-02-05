import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

const TimelineSlider = () => {
  const { 
    timelineData, 
    filterMarkersByDate, 
    selectedDate, 
    setSelectedDate, 
    daysRange, 
    setDaysRange 
  } = useData();

  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  // New state: velocity in milliseconds (default 1000 ms = 1 sec)
  const [velocity, setVelocity] = useState(500);

  // Handle initial date setup
  useEffect(() => {
    if (timelineData.length > 0) {
      const timestamps = timelineData
        .map(d => parseInt(d.timestamp))
        .filter(timestamp => !isNaN(timestamp));

      if (timestamps.length > 0) {
        const minDate = new Date(Math.min(...timestamps));
        if (!selectedDate) {
          setSelectedDate(minDate);
          filterMarkersByDate(minDate, daysRange);
        }
      }
    }
  }, [timelineData, filterMarkersByDate, daysRange, setSelectedDate, selectedDate]);

  // Handle date filtering when selectedDate or daysRange changes
  useEffect(() => {
    if (selectedDate) {
      filterMarkersByDate(selectedDate, daysRange);
    }
  }, [selectedDate, filterMarkersByDate, daysRange]);

  // Handle play/pause functionality with velocity control
  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        playForward();
      }, velocity); // use velocity as the interval delay
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
  }, [isPlaying, selectedDate, velocity]);

  const playForward = () => {
    if (!selectedDate) return;

    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);

    const maxDate = new Date(Math.max(
      ...timelineData.map(d => parseInt(d.timestamp)).filter(t => !isNaN(t))
    ));

    if (newDate > maxDate) {
      setIsPlaying(false);
      return;
    }

    setSelectedDate(newDate);
  };

  // Step forward by one day
  const stepForward = () => {
    if (!selectedDate) return;
    playForward();
  };

  // Step backward by one day
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
    <div style={{ padding: '10px', background: 'white', borderRadius: '8px', position: 'absolute', bottom: 0, zIndex: 99 }}>
      <button onClick={stepBackward} style={{ marginRight: '10px' }}>
        &lt; Step Back
      </button>
      <button onClick={togglePlayPause} style={{ marginRight: '10px' }}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={stepForward} style={{ marginRight: '10px' }}>
        Step Forward &gt;
      </button>

      {/* Velocity (play speed) slider */}
      <div style={{ marginTop: '10px' }}>
        <div>
        <label htmlFor="velocitySlider">Velocity play: </label>
        <input 
          id="velocitySlider"
          type="range"
          min="100"
          max="2000"
          step="100"
          value={velocity}
          onChange={(e) => setVelocity(Number(e.target.value))}
        />
        <span style={{ marginLeft: '5px' }}>{velocity} ms</span>
        </div>
      </div>

      <div>
      <label htmlFor="dateSlider">Date: </label>
      <input 
        type="range"
        min={minDate.getTime()}
        max={maxDate.getTime()}
        step={24 * 60 * 60 * 1000}
        value={selectedDate ? selectedDate.getTime() : minDate.getTime()}
        onChange={(e) => {
          const newDate = new Date(parseInt(e.target.value));
          setSelectedDate(newDate);
          filterMarkersByDate(newDate, daysRange);
        }}
      />
      <span style={{ marginLeft: '5px' }}>{selectedDate ? selectedDate.toDateString() : 'Select a date'}</span>
      </div>

      <div>
      <label htmlFor="daysRangeSlider">Days range: </label>
      <input
        type="range"
        min="0"
        max="31"
        step="1"
        value={daysRange}
        onChange={(e) => setDaysRange(Number(e.target.value))}
      />
      <span style={{ marginLeft: '5px' }}>{daysRange} ms</span>
      </div>
    </div>
  );
};

export default TimelineSlider;
