import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';

const MarkersCedulas = ({ map, fetchId, thresholdId }) => {
  const { fetchedRecords, newDataFetched, setNewDataFetched, COLORS, updateLayerData } = useData();

  useEffect(() => {
    if (map && newDataFetched) {
      const formattedRecordsCedula = fetchedRecords.map(record => {
        const [lat, lon] = record.lat_long ? record.lat_long.split(',').map(coord => parseFloat(coord)) : [null, null];
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          properties: {
            ...record,
            id: record.id_cedula_busqueda,
            timestamp: new Date(record.fecha_desaparicion).getTime(),
            color: record.sexo === 'MUJER' ? COLORS.MUJER : COLORS.HOMBRE,
            tipo_marcador: 'cedula_busqueda',
            // Add properties for tooltip
            fecha_desaparicion: record.fecha_desaparicion,
            sexo: record.sexo,
            edad_momento_desaparicion: record.edad_momento_desaparicion,
            condicion_localizacion: record.condicion_localizacion,
            descripcion_desaparicion: record.descripcion_desaparicion
          }
        };
      });

      const geojsonData = {
        type: 'FeatureCollection',
        features: formattedRecordsCedula
      };

      updateLayerData('cedulaLayer', geojsonData);
      setNewDataFetched(false);
    }
  }, [fetchedRecords, map, newDataFetched, setNewDataFetched, COLORS, updateLayerData]);

  return null;
};

export default MarkersCedulas;