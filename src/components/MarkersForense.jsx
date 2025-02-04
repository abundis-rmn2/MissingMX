import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';

const MarkersForense = ({ map, fetchId, thresholdId }) => {
  const { forenseRecords, newForenseDataFetched, setNewForenseDataFetched, COLORS, updateLayerData } = useData();

  useEffect(() => {
    if (map && newForenseDataFetched) {
      const formattedRecordsForense = forenseRecords.map(record => {
        let [lat, lon] = record.lat_long ? record.lat_long.split(',').map(coord => parseFloat(coord)) : [null, null];

        if (!lat || !lon) {
          const location = Object.keys(LOCATIONS).find(loc => record.Delegacion_IJCF.includes(loc));
          if (location) {
            [lat, lon] = LOCATIONS[location];
          }
        }
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          properties: {
            ...record,
            timestamp: new Date(record.Fecha_Ingreso).getTime(),
            color: COLORS.UNKNOWN,
            tipo_marcador: 'personas_sin_identificar',
            // Add properties for tooltip
            ID: record.ID,
            Fecha_Ingreso: record.Fecha_Ingreso,
            Probable_nombre: record.Probable_nombre,
            Edad: record.Edad,
            Tatuajes: record.Tatuajes,
            Indumentarias: record.Indumentarias,
            Senas_Particulares: record.Senas_Particulares,
            Delegacion_IJCF: record.Delegacion_IJCF
          }
        };
      });

      const geojsonData = {
        type: 'FeatureCollection',
        features: formattedRecordsForense
      };

      updateLayerData('forenseLayer', geojsonData);
      setNewForenseDataFetched(false);
    }
  }, [forenseRecords, map, newForenseDataFetched, setNewForenseDataFetched, COLORS, updateLayerData]);

  return null;
};

export default MarkersForense;