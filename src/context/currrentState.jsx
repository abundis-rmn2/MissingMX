import React, { useState } from 'react';
import { useData } from './DataContext';

const CurrentState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    map,
    fetchedRecords,
    forenseRecords,
    heatmapLayer,
    markerClusterGroup,
    timelineData,
    timeline,
    timelineControl,
    COLORS,
    newDataFetched,
    newForenseDataFetched,
    loading,
    selectedDate,
    daysRange,
    activeHeatmapCategories,
    selectedSexo,
    selectedCondicion,
    edadRange,
    sumScoreRange,
  } = useData(); // Get all data from context

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <h3 onClick={toggleAccordion} style={{ cursor: 'pointer'}}>
        Current State {isOpen ? <button onClick={toggleAccordion}>x</button> : null}
      </h3>
      {isOpen && (
        <div>
          <p>Map: {map ? 'Initialized' : 'Not Initialized'}</p>
          <p>Fetched Records: {fetchedRecords.length}</p>
          <p>Forense Records: {forenseRecords.length}</p>
          <p>Heatmap Layer: {heatmapLayer ? 'Initialized' : 'Not Initialized'}</p>
          <p>Marker Cluster Group: {markerClusterGroup ? 'Initialized' : 'Not Initialized'}</p>
          <p>Timeline Data: {timelineData ? 'Available' : 'Not Available'}</p>
          <p>Timeline: {timeline ? 'Initialized' : 'Not Initialized'}</p>
          <p>Timeline Control: {timelineControl ? 'Initialized' : 'Not Initialized'}</p>
          <p>New Data Fetched: {newDataFetched ? 'Yes' : 'No'}</p>
          <p>New Forense Data Fetched: {newForenseDataFetched ? 'Yes' : 'No'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Selected Date: {selectedDate ? selectedDate.toDateString() : 'None'}</p>
          <p>Days Range: {daysRange}</p>
          <p>Active Heatmap Categories: {activeHeatmapCategories.join(', ')}</p>
          <p>Selected Sexo: {selectedSexo.join(', ')}</p>
          <p>Selected Condicion: {selectedCondicion.join(', ')}</p>
          <p>Edad Range: {edadRange.join(' - ')}</p>
          <p>Sum Score Range: {sumScoreRange.join(' - ')}</p>
          <div>
            <p>Colors:</p>
            {Object.entries(COLORS).map(([key, value]) => (
              <div key={key} style={{ backgroundColor: value, padding: '5px', margin: '2px 0' }}>
                {key}: {value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentState;