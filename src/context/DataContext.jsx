import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [forenseRecords, setForenseRecords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [forenseMarkers, setForenseMarkers] = useState([]);
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [markerClusterGroup, setMarkerClusterGroup] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [timelineControl, setTimelineControl] = useState(null);
  const [newDataFetched, setNewDataFetched] = useState(false); // New flag for new data
  const [newForenseDataFetched, setNewForenseDataFetched] = useState(false); // New flag for new forense data

  const COLORS = {
    MUJER: '#FF69B4',
    HOMBRE: '#1E90FF',
    CON_VIDA: '#008000',
    SIN_VIDA: '#000000',
    NO_APLICA: '#FF0000',
    UNKNOWN: '#808080'
  };

  const POINT_RADIUS = 6;

  return (
    <DataContext.Provider value={{
      map, setMap,
      fetchedRecords, setFetchedRecords,
      forenseRecords, setForenseRecords,
      markers, setMarkers,
      forenseMarkers, setForenseMarkers,
      heatmapLayer, setHeatmapLayer,
      markerClusterGroup, setMarkerClusterGroup,
      timelineData, setTimelineData,
      timeline, setTimeline,
      timelineControl, setTimelineControl,
      newDataFetched, setNewDataFetched, // Include new flag in context
      newForenseDataFetched, setNewForenseDataFetched, // Include new flag for forense data in context
      COLORS, // Include COLORS in context
      POINT_RADIUS // Include POINT_RADIUS in context
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);