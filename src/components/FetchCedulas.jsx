import React, { useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FetchCedulas = ({ fetchCedulas, startDate, endDate, fetchId, onFetchComplete }) => {
  const { setFetchedRecords, setNewDataFetched, loading, setLoading, updateLayerData, sexoLayout, forenseRecords, setTimelineData, mergeRecords, COLORS, map } = useData();

  useEffect(() => {
    if (fetchCedulas && fetchId) {
      console.log('Fetching Cedulas data');
      fetchData(startDate, endDate);
    }
  }, [fetchId]);

  const fetchData = async (start_date, end_date) => {
    try {
      setLoading(true);
      const response = await axios.get('https://datades.abundis.com.mx/api/specificDate.php', {
        headers: {
          'API_KEY': 'gNXGJ0hCDavnMHvqbVRhL4yZalLUceQ4ccEHQmB40bQ',
          'Content-Type': 'application/json'
        },
        params: {
          start_date,
          end_date
        }
      });

      const records = response.data.records || [];
      const formattedRecordsCedula = records.map(record => {
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
            num_score: record.num_score,
          }
        };
      });

      const geojsonData = {
        type: 'FeatureCollection',
        features: formattedRecordsCedula
      };

      setFetchedRecords(geojsonData);
      setNewDataFetched(true);
      if (map && map.isStyleLoaded()) {
        updateLayerData('cedulaLayer', geojsonData, sexoLayout);
      } else {
        console.error('Map is not initialized or style is not loaded');
      }
      console.log('Fetched Cedulas records:', formattedRecordsCedula);
      onFetchComplete();
    } catch (error) {
      console.error("Error fetching Cedulas data:", error);
    } finally {
      setLoading(false);
    }
  };

  return null;
};

export default FetchCedulas;