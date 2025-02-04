import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [forenseRecords, setForenseRecords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [timelineData, setTimelineData] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [timelineControl, setTimelineControl] = useState(null);
  const [newDataFetched, setNewDataFetched] = useState(false);
  const [newForenseDataFetched, setNewForenseDataFetched] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const COLORS = {
    MUJER: '#FF69B4',
    HOMBRE: '#1E90FF',
    CON_VIDA: '#008000',
    SIN_VIDA: '#000000',
    NO_APLICA: '#FF0000',
    UNKNOWN: '#808080'
};

const POINT_RADIUS = 6;

const updateMarkers = (fetchedRecords, forenseRecords) => {
    console.log('Updating markers');
    const mergedRecords = [...fetchedRecords, ...forenseRecords];
    console.log("Merged Records:", mergedRecords);
    setMarkers(mergedRecords);
    markers.forEach(marker => {
      map.removeLayer(marker);
    });
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
        updateMarkers // Add updateMarkers function to context
    }}>
        {children}
    </DataContext.Provider>
);


};

export const useData = () => useContext(DataContext);