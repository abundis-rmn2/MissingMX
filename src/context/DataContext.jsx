import React, { createContext, useContext, useState } from 'react';
import maplibregl from 'maplibre-gl';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [map, setMap] = useState(null);
  const [fetchedRecords, setFetchedRecords] = useState([]);
  const [forenseRecords, setForenseRecords] = useState([]);
  const [mergedRecords, setMergedRecords] = useState([]);
  const [cedulaLayer, setCedulaLayer] = useState(null);
  const [forenseLayer, setForenseLayer] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [timeline, setTimeline] = useState(null);
  const [timelineControl, setTimelineControl] = useState(null);
  const [newDataFetched, setNewDataFetched] = useState(false);
  const [newForenseDataFetched, setNewForenseDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);

  const COLORS = {
    MUJER: '#FF69B4',
    HOMBRE: '#1E90FF',
    CON_VIDA: '#008000',
    SIN_VIDA: '#000000',
    NO_APLICA: '#FF0000',
    UNKNOWN: '#808080'
  };

  const POINT_RADIUS = 6;

  const updateLayerData = (layerId, data) => {
    if (map) {
      if (map.getSource(layerId)) {
        map.getSource(layerId).setData(data);
      } else {
        map.addSource(layerId, {
          type: 'geojson',
          data: data
        });
        map.addLayer({
          id: layerId,
          type: 'circle',
          source: layerId,
          paint: {
            'circle-radius': POINT_RADIUS,
            'circle-color': ['get', 'color'],
            'circle-opacity': ['case', ['get', 'visible'], 1, 0]
  
          }
        });

        // Add tooltip functionality
        let popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.on('click', layerId, (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const properties = e.features[0].properties;
          const tooltipContent = `
            <b>Record ID: ${properties.id || properties.ID}</b><br>
            Marker Type: ${properties.tipo_marcador}<br>
            ${properties.fecha_desaparicion ? `Disappearance Date: ${properties.fecha_desaparicion}<br>` : ''}
            ${properties.sexo ? `Gender: ${properties.sexo}<br>` : ''}
            ${properties.edad_momento_desaparicion ? `Age at Disappearance: ${properties.edad_momento_desaparicion}<br>` : ''}
            ${properties.condicion_localizacion ? `Location Condition: ${properties.condicion_localizacion}<br>` : ''}
            ${properties.descripcion_desaparicion ? `Disappearance Description: ${properties.descripcion_desaparicion}<br>` : ''}
            ${properties.Fecha_Ingreso ? `Ingress Date: ${properties.Fecha_Ingreso}<br>` : ''}
            ${properties.Probable_nombre ? `Probable Name: ${properties.Probable_nombre}<br>` : ''}
            ${properties.Edad ? `Age: ${properties.Edad}<br>` : ''}
            ${properties.Tatuajes ? `Tattoos: ${properties.Tatuajes}<br>` : ''}
            ${properties.Indumentarias ? `Clothing: ${properties.Indumentarias}<br>` : ''}
            ${properties.Senas_Particulares ? `Distinctive Signs: ${properties.Senas_Particulares}<br>` : ''}
            ${properties.Delegacion_IJCF ? `Delegation: ${properties.Delegacion_IJCF}<br>` : ''}
          `;
          popup
            .setLngLat(coordinates)
            .setHTML(tooltipContent)
            .addTo(map);
        });

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });

        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
      }

      // Update timeline data
      const timelineEntries = data.features.map(feature => ({
        timestamp: feature.properties.timestamp,
        type: feature.properties.tipo_marcador
      }));
      updateTimelineData(timelineEntries, true); // Reset timeline per fetch

      console.log(`Layer data updated for ${layerId}`);
      console.log(data);
    }
  };

  const mergeRecords = (cedulasRecords, forenseRecords) => {
    console.log('Merging records');
    const mergedRecordsObj = [...cedulasRecords, ...forenseRecords];
    console.log("Merged Records:", mergedRecordsObj);
    setMergedRecords(mergedRecordsObj);
    updateTimelineData(mergedRecordsObj);
  };

  const updateTimelineData = (records, reset = false) => {
    console.log('Updating timeline data');
    const timelineEntries = records.map(record => ({
      timestamp: record.timestamp || record.properties.timestamp,
      type: record.type || record.properties.tipo_marcador
    }));
    setTimelineData(reset ? timelineEntries : [...timelineData, ...timelineEntries]);
  };

  const filterMarkersByDate = (selectedDate, daysRange) => {
    if (!map) return;
  
    const endDate = new Date(selectedDate);
    endDate.setDate(selectedDate.getDate() + daysRange);
  
    // Convert dates to timestamps for easier filtering
    const selectedTimestamp = selectedDate.getTime();
    const endTimestamp = endDate.getTime();
  
    console.log(`Filtering layers by date: ${selectedDate} to ${endDate}`);
  
    // Apply a filter to the "cedula" layer
    if (map.getLayer("cedulaLayer")) {
      console.log("Filtering cedula layer");
      map.setFilter("cedulaLayer", [
        "all",
        [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
        ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
      ]);
    }
  
    // Apply a filter to the "forense" layer
    if (map.getLayer("forenseLayer")) {
      console.log("Filtering forense layer");
      map.setFilter("forenseLayer", [
        "all",
        [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
        ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
      ]);
    }
  };
  

  return (
    <DataContext.Provider value={{
      map, setMap,
      fetchedRecords, setFetchedRecords,
      forenseRecords, setForenseRecords,
      cedulaLayer, setCedulaLayer,
      forenseLayer, setForenseLayer,
      timelineData, setTimelineData,
      timeline, setTimeline,
      timelineControl, setTimelineControl,
      newDataFetched, setNewDataFetched,
      newForenseDataFetched, setNewForenseDataFetched,
      loading, setLoading,
      COLORS,
      POINT_RADIUS,
      updateLayerData,
      filterMarkersByDate,
      mergeRecords,
      updateTimelineData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);