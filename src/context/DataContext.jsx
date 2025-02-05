import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [daysRange, setDaysRange] = useState(5); // Default to 5 days range
  const [activeHeatmapCategories, setActiveHeatmapCategories] = useState([]); // Add this line

  const COLORS = Object.fromEntries(
    ["MUJER", "HOMBRE", "CON_VIDA", "SIN_VIDA", "NO_APLICA", "UNKNOWN"].map((key) => {
      const fullColor = {
        MUJER: "rgba(255, 105, 180, 1)",
        HOMBRE: "rgba(30, 144, 255, 1)",
        CON_VIDA: "rgba(0, 128, 0, 1)",
        SIN_VIDA: "rgba(0, 0, 0, 1)",
        NO_APLICA: "rgba(255, 0, 0, 1)",
        UNKNOWN: "rgba(128, 128, 128, 1)"
      }[key];
  
      return [
        key,
        Object.assign(new String(fullColor), {
          opacity100: fullColor,
          opacity30: fullColor.replace(/[^,]+(?=\))/, "0.3"), // Modify alpha channel
        }),
      ];
    })
  );
  
  const POINT_RADIUS = 6;

  const addTooltip = (layerId) => {
    if (!map) return;

    let popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.on('mouseenter', layerId, (e) => {
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

    map.on('click', layerId, (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerId]
      });

      if (features.length) {
        const feature = features[0];
        if (feature.properties.tipo_marcador === 'cluster') {
          const originalLayers = JSON.parse(feature.properties.originalLayers);
          console.log('Cluster clicked:', originalLayers);
          // Display the original layers in a popup or sidebar
        } else {
          console.log('Feature clicked:', feature);
          // Display the feature details in a popup or sidebar
        }
      }
    });
  };

  const updateLayerData = (layerId, data, layoutConfig) => {
    if (!map) {
      console.error("Map is not initialized");
      return;
    }
  
    if (!data || !data.type || data.type !== 'FeatureCollection') {
      console.error("Input data given to 'forenseLayer' is not a valid GeoJSON object.");
      return;
    }
    console.log('Updating layer data:', layerId, layoutConfig);
    if (map.getSource(layerId)) {
      map.getSource(layerId).setData(data);
    } else {
      map.addSource(layerId, {
        type: 'geojson',
        data: data,
      });
  
      map.addLayer({
        id: layerId,
        type: 'circle',
        source: layerId,
        paint: layoutConfig || {
          'circle-radius': POINT_RADIUS,
          'circle-color': [
            'case',
            ['==', ['get', 'sexo'], 'MUJER'], COLORS.MUJER.opacity30,
            ['==', ['get', 'sexo'], 'HOMBRE'], COLORS.HOMBRE.opacity30,
            COLORS.UNKNOWN.opacity30,
          ],
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'sexo'], 'MUJER'], COLORS.MUJER.opacity100,
            ['==', ['get', 'sexo'], 'HOMBRE'], COLORS.HOMBRE.opacity100,
            COLORS.UNKNOWN.opacity100,
          ],
          'circle-stroke-width': 2,
          'circle-opacity': ['case', ['get', 'visible'], 0.8, 0],
          'circle-stroke-opacity': 1,
        },
      });
  
      addTooltip(layerId);
    }
  
    if (layoutConfig === clusteringLayout) {
      return
    }
    // Update timeline data
    const timelineEntries = data.features.map(feature => ({
      timestamp: feature.properties.timestamp,
      type: feature.properties.tipo_marcador,
    }));
  
    updateTimelineData(timelineEntries, true);
  };

  const clusteringLayout = {
    // Adjust the circle radius based on the cluster's count value.
    // This example interpolates from a radius of 5 for a single record to 20 for 20 records.
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'count'],
      1, 5,    // when count is 1, radius is 5
      20, 20   // when count is 20, radius is 20
    ],
    // Use a different color when the feature is a cluster.
    'circle-color': [
      'case',
      ['==', ['get', 'tipo_marcador'], 'cluster'],
      COLORS.UNKNOWN.opacity100,  // Color for clusters
      '#f1f075'   // Fallback color for non-cluster features (if any)
    ],
    'circle-opacity': 0.8,
  };

  const sexoLayout = {
    'circle-radius': 6,
    'circle-color': [
      'case',
      ['==', ['get', 'sexo'], 'MUJER'], COLORS.MUJER.opacity30,
      ['==', ['get', 'sexo'], 'HOMBRE'], COLORS.HOMBRE.opacity30,
      COLORS.UNKNOWN.opacity30,
    ],
    'circle-stroke-color': [
      'case',
      ['==', ['get', 'sexo'], 'MUJER'], COLORS.MUJER.opacity100,
      ['==', ['get', 'sexo'], 'HOMBRE'], COLORS.HOMBRE.opacity100,
      COLORS.UNKNOWN.opacity100,
    ],
    'circle-stroke-width': 2,
    'circle-opacity': 0.8,
    'circle-stroke-opacity': 1,
  };

  const condicionLocalizacionLayout = {
    'circle-radius': 6,
    'circle-color': [
      'case',
      ['==', ['get', 'condicion_localizacion'], 'CON VIDA'], COLORS.CON_VIDA.opacity30,
      ['==', ['get', 'condicion_localizacion'], 'SIN VIDA'], COLORS.SIN_VIDA.opacity30,
      ['==', ['get', 'condicion_localizacion'], 'NO APLICA'], COLORS.NO_APLICA.opacity30,
      COLORS.UNKNOWN.opacity30,
    ],
    'circle-stroke-color': [
      'case',
      ['==', ['get', 'condicion_localizacion'], 'CON VIDA'], COLORS.CON_VIDA.opacity100,
      ['==', ['get', 'condicion_localizacion'], 'SIN VIDA'], COLORS.SIN_VIDA.opacity100,
      ['==', ['get', 'condicion_localizacion'], 'NO APLICA'], COLORS.NO_APLICA.opacity100,
      COLORS.UNKNOWN.opacity100,
    ],
    'circle-stroke-width': 2,
    'circle-opacity': 0.8,
    'circle-stroke-opacity': 1,
  };

  const heatmapLayout = {
    'heatmap-weight': [
      'interpolate',
      ['linear'],
      ['get', 'density'],
      0, 0,
      6, 1
    ],
    'heatmap-intensity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 1,
      9, 3
    ],
    'heatmap-color': [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(33,102,172,0)',
      0.2, 'rgb(103,169,207)',
      0.4, 'rgb(209,229,240)',
      0.6, 'rgb(253,219,199)',
      0.8, 'rgb(239,138,98)',
      1, 'rgb(178,24,43)'
    ],
    'heatmap-radius': [
      'interpolate',
      ['linear'],
      ['zoom'],
      0, 2,
      9, 20
    ],
    'heatmap-opacity': [
      'interpolate',
      ['linear'],
      ['zoom'],
      7, 1,
      9, 0
    ],
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
  
    //console.log(`Filtering layers by date: ${selectedDate} to ${endDate}`);
  
    // Apply a filter to the "cedula" layer
    if (map.getLayer("cedulaLayer")) {
      //console.log("Filtering cedula layer");
      map.setFilter("cedulaLayer", [
        "all",
        [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
        ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
      ]);
    }
  
    /*
    // Apply a filter to the "forenseLayer"
    if (map.getLayer("forenseLayer")) {
      //console.log("Filtering forense layer");
      map.setFilter("forenseLayer", [
        "all",
        [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
        ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
      ]);
    }

        // Get the filtered features from the "forenseLayer"
    const filteredFeatures = map.querySourceFeatures('forenseLayer', {
      sourceLayer: 'forenseLayer',
      filter: [
        "all",
        [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
        ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
      ]
    });

    // Call avoidLayerOverlap with the filtered features
    avoidLayerOverlap(forenseRecords.features, 'personas_sin_identificar', selectedTimestamp, endTimestamp);
    */
       // Update heatmap layers
       activeHeatmapCategories.forEach(category => {
        const layerId = `cedulaLayer-${category}`;
        if (map.getLayer(layerId)) {
          const categoryFilter = category === 'HOMBRE' || category === 'MUJER' 
            ? ['==', ['get', 'sexo'], category]
            : ['==', ['get', 'condicion_localizacion'], category];
          
          map.setFilter(layerId, [
            "all",
            categoryFilter,
            [">=", ["to-number", ["get", "timestamp"]], selectedTimestamp],
            ["<=", ["to-number", ["get", "timestamp"]], endTimestamp]
          ]);
        }
      });
  };
  
  const avoidLayerOverlap = (records, tipo_marcador, selectedTimestamp, endTimestamp) => {
    //console.log('Clustering nodes with the same position');
  
    if (!Array.isArray(records)) {
        console.error("Records should be an array");
        return [];
    }
  
    const clusterMap = new Map();

    //console.log(tipo_marcador, selectedTimestamp, endTimestamp)
    records.forEach(record => {
      const { timestamp, tipo_marcador: recordTipoMarcador } = record.properties;
      const coordinates = record.geometry.coordinates.join(',');
      if (record.properties.tipo_marcador === tipo_marcador) {
       // console.log('Record:', record);
        if (!clusterMap.has(coordinates)) {
          clusterMap.set(coordinates, { 
            type: 'Feature', 
            geometry: record.geometry, 
            properties: {
              tipo_marcador: "cluster", 
              count: 0, 
              originalNodes: [], 
              timestamp: timestamp
            }
          });
        }
        const cluster = clusterMap.get(coordinates);
        cluster.properties.count += 1;
        cluster.properties.originalNodes.push(record);
        // Ensure the timestamp is the minimum among the clustered nodes
        cluster.properties.timestamp = Math.min(cluster.properties.timestamp, timestamp);
      } 
    });
    
    const clusterFeatures = Array.from(clusterMap.values());
    //console.log('Cluster features', clusterFeatures);
    const geojsonData = {
      type: 'FeatureCollection',
      features: clusterFeatures
    };
    updateLayerData('forenseLayer', geojsonData, clusteringLayout);
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
      selectedDate, setSelectedDate,
      daysRange, setDaysRange,
      COLORS,
      POINT_RADIUS,
      clusteringLayout,
      sexoLayout,
      condicionLocalizacionLayout,
      heatmapLayout,
      activeHeatmapCategories, setActiveHeatmapCategories,
      updateLayerData,
      filterMarkersByDate,
      mergeRecords,
      updateTimelineData,
      avoidLayerOverlap
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);