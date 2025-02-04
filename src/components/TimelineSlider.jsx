import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';

const TimelineSlider = () => {
  const { timelineData, filterMarkersByDate } = useData();
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysRange, setDaysRange] = useState(5); // Default to 5 days range

  useEffect(() => {
    if (timelineData.length > 0) {
      const timestamps = timelineData
        .map(d => parseInt(d.timestamp))
        .filter(timestamp => !isNaN(timestamp));

      if (timestamps.length > 0) {
        const minDate = new Date(Math.min(...timestamps));
        setSelectedDate(minDate);
        filterMarkersByDate(minDate, daysRange); // Apply initial filter
      }
    }
  }, [timelineData, filterMarkersByDate, daysRange]); // Depend on both data and daysRange

  useEffect(() => {
    if (selectedDate) {
      filterMarkersByDate(selectedDate, daysRange); // Filter when selectedDate or daysRange changes
    }
  }, [selectedDate, filterMarkersByDate, daysRange]);

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
      <input 
        type="range"
        min={minDate.getTime()}
        max={maxDate.getTime()}
        step={24 * 60 * 60 * 1000} // Step by 1 day
        value={selectedDate ? selectedDate.getTime() : minDate.getTime()}
        onChange={(e) => {
          const newDate = new Date(parseInt(e.target.value));
          setSelectedDate(newDate);
          filterMarkersByDate(newDate, daysRange); // Filter on date change
        }}
      />
      <p>{selectedDate ? selectedDate.toDateString() : 'Select a date'}</p>

      {/* Days range input */}
      <input
        type="number"
        value={daysRange}
        onChange={(e) => setDaysRange(Number(e.target.value))}
        min="1" // Minimum 1 day
        style={{ marginLeft: '10px', width: '60px' }}
      />
      <p>Show markers for {daysRange} days from selected date</p>
    </div>
  );
};

export default TimelineSlider;
