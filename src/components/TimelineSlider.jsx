import React from 'react';
import { useTimelineSlider } from '../utils/timeLineSlider';

const TimelineSlider = () => {
  const {
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
  } = useTimelineSlider();

  if (!Array.isArray(timelineData) || timelineData.length === 0) {
    return <p>Loading timeline...</p>;
  }

  if (!minDate || !maxDate) return <p>No data available</p>;

  return (
    <div style={{ padding: 8 }}>
      <button onClick={stepBackward}>&lt;</button>
      <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <button onClick={stepForward}>&gt;</button>
      <input
        type="range"
        min={minDate.getTime()}
        max={maxDate.getTime()}
        value={selectedDate ? selectedDate.getTime() : minDate.getTime()}
        onChange={e => handleDateChange(new Date(Number(e.target.value)))}
        style={{ width: 200, margin: '0 8px' }}
      />
      <span>
        {selectedDate ? selectedDate.toISOString().slice(0, 10) : ''}
      </span>
      <label style={{ marginLeft: 16 }}>
        Velocidad:
        <input
          type="number"
          min={100}
          max={2000}
          step={100}
          value={velocity}
          onChange={e => setVelocity(Number(e.target.value))}
          style={{ width: 60, marginLeft: 4 }}
        /> ms
      </label>
      <label style={{ marginLeft: 16 }}>
        Días rango:
        <input
          type="number"
          min={1}
          max={365}
          value={daysRange}
          onChange={e => setDaysRange(Number(e.target.value))}
          style={{ width: 60, marginLeft: 4 }}
        />
      </label>
    </div>
  );
};

export default TimelineSlider;