import React, { createContext, useContext, useState } from 'react';
import maplibregl from 'maplibre-gl';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [forenseRecords, setForenseRecords] = useState([]);
  const [mergedRecords, setMergedRecords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [timelineControl, setTimelineControl] = useState(null);
  const [newDataFetched, setNewDataFetched] = useState(false);
  const [newForenseDataFetched, setNewForenseDataFetched] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
    const [cedulaMarkers, setCedulaMarkers] = useState([]);
  const [forenseMarkers, setForenseMarkers] = useState([]);

  const COLORS = {
    MUJER: '#FF69B4',
    HOMBRE: '#1E90FF',
    CON_VIDA: '#008000',
    SIN_VIDA: '#000000',
    NO_APLICA: '#FF0000',
    UNKNOWN: '#808080'
  };

  const POINT_RADIUS = 6;

  const updateMarkers = (prevMarkers, newMarkers, setMarkerState) => {
  
    console.log('Removing all markers...');
  
    // **Remove all markers from the map**
    prevMarkers.forEach(marker => {
      if (marker instanceof maplibregl.Marker) {
        marker.remove();
      }
    });

  
    console.log('Adding new markers...');
  
    // **Update marker state with new markers**
    setMarkerState([...newMarkers]);
  };
  
  
  const updateTimelineData = (newEntries, reset = false) => {
    setTimelineData(prev => reset ? [...newEntries] : [...prev, ...newEntries]); 
  };
  
  const mergeRecords = (cedulasRecords, ForenseRecords) => {
    console.log('Merging records');
    const mergedRecordsObj = [...cedulasRecords, ...ForenseRecords];
    console.log("Merged Records:", mergedRecordsObj);
    setMergedRecords(mergedRecordsObj);
  };

  const filterMarkersByDate = (selectedDate, daysRange) => {
    const filterMarkers = (markers) => {
      const endDate = new Date(selectedDate);
      endDate.setDate(selectedDate.getDate() + daysRange); // Calculate end date (selectedDate + daysRange)
  
      markers.forEach(marker => {
        if (marker instanceof maplibregl.Marker) {
          const timestamp = marker.getElement().dataset.timestamp; // Get the timestamp from the marker data
    
          if (!timestamp) {
            console.warn('Marker missing timestamp:', marker.getElement().dataset);
            return;
          }
    
          const recordDate = new Date(parseInt(timestamp)); // Convert timestamp to Date object
    
          if (isNaN(recordDate.getTime())) {
            console.warn('Invalid date for marker:', marker.getElement().dataset);
            return;
          }
    
          // Strip time part of selectedDate and recordDate for comparison
          const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
          const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
  
          // Show or hide based on if the record is within the selected range
          if (recordDateOnly >= selectedDateOnly && recordDateOnly <= endDateOnly) {
            marker.getElement().style.display = 'block'; // Show marker if within the range
          } else {
            marker.getElement().style.display = 'none';  // Hide marker if outside the range
          }
        }
      });
    };
  
    filterMarkers(cedulaMarkers);
    filterMarkers(forenseMarkers);
  };

  return (
    <DataContext.Provider value={{
      map, setMap,
      fetchedRecords, setFetchedRecords,
      forenseRecords, setForenseRecords,
      markers, setMarkers,
      heatmapLayer, setHeatmapLayer,
      timelineData, setTimelineData,
      timeline, setTimeline,
      timelineControl, setTimelineControl,
      newDataFetched, setNewDataFetched,
      newForenseDataFetched, setNewForenseDataFetched,
      loading, setLoading, // Include loading state in context
      COLORS,
      POINT_RADIUS,
      cedulaMarkers, setCedulaMarkers,
      forenseMarkers, setForenseMarkers,
      updateMarkers, // Add updateMarkers function to context
      filterMarkersByDate, // Add filterMarkersByDate function to context
      mergeRecords, // Add mergeRecords function to context
      updateTimelineData // Add updateTimelineData function to context
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);