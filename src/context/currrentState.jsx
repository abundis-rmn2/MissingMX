import React from 'react';
import { useData } from './DataContext';

const CurrentState = () => {
  const {
    map,
    fetchedRecords,
    forenseRecords,
    markers,
    forenseMarkers,
    heatmapLayer,
    markerClusterGroup,
    timelineData,
    timeline,
    timelineControl,
    COLORS
  } = useData(); // Get all data from context

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 999,
      backgroundColor: 'white',
      padding: '10px',
      border: '1px solid black',
      borderRadius: '5px'
    }}>
      <h3>Current State</h3>
      <p>Map: {map ? 'Initialized' : 'Not Initialized'}</p>
      <p>Fetched Records: {fetchedRecords.length}</p>
      <p>Forense Records: {forenseRecords.length}</p>
      <p>Markers: {markers.length}</p>
      <p>Forense Markers: {forenseMarkers.length}</p>
      <p>Heatmap Layer: {heatmapLayer ? 'Initialized' : 'Not Initialized'}</p>
      <p>Marker Cluster Group: {markerClusterGroup ? 'Initialized' : 'Not Initialized'}</p>
      <p>Timeline Data: {timelineData ? 'Available' : 'Not Available'}</p>
      <p>Timeline: {timeline ? 'Initialized' : 'Not Initialized'}</p>
      <p>Timeline Control: {timelineControl ? 'Initialized' : 'Not Initialized'}</p>
    <div>
      <p>Colors:</p>
      {Object.entries(COLORS).map(([key, value]) => (
        <div key={key} style={{ backgroundColor: value, padding: '5px', margin: '2px 0' }}>
        {key}: {value}
        </div>
      ))}
    </div>
    </div>
  );
};

export default CurrentState;