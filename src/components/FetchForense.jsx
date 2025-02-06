import React, { useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FetchForense = ({ fetchForense, startDate, endDate, fetchId, onFetchComplete }) => {
  const { setForenseRecords, setNewForenseDataFetched, loading, setLoading, updateLayerData, fetchedRecords, setTimelineData, mergeRecords, COLORS, clusteringLayout} = useData();

  const LOCATIONS = {
    'San PedroTlaquepaque': [20.6253, -103.3123],
    'Puerto Vallarta': [20.6432, -105.2335],
    'Colotlán': [21.2159, -103.1278],
    'Magdalena': [20.7683, -103.8333],
    'Tepatitlán de Morelos': [20.9333, -102.7333],
    'Lagos de Moreno': [21.2333, -102.2333],
    'Ciudad Guzmán': [19.8833, -103.3667],
    'El Grullo': [20.4333, -103.9667],
    'Ocotlán': [19.9833, -103.3667]
  };

  useEffect(() => {
    if (fetchForense && fetchId) {
      console.log('Fetching Forense data');
      fetchData(startDate, endDate);
    }
  }, [fetchId]);

  const fetchData = async (start_date, end_date) => {
    try {
      setLoading(true);
      const response = await axios.get('https://datades.abundis.com.mx/api/sininden.php', {
        headers: {
          'API_KEY': 'gNXGJ0hCDavnMHvqbVRhL4yZalLUceQ4ccEHQmB40bQ',
        },
        params: {
          start_date,
          end_date
        }
      });

      const records = response.data.records || [];
      const formattedRecordsForense = records.map(record => {
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
            tipo_marcador: 'personas_sin_identificar'
          }
        };
      });

      const geojsonData = {
        type: 'FeatureCollection',
        features: formattedRecordsForense
      };

      setForenseRecords(geojsonData);
      setNewForenseDataFetched(true);
      //mergeRecords(fetchedRecords, geojsonData);
      updateLayerData('forenseLayer', geojsonData, clusteringLayout);
      console.log('Fetched Forense records:', formattedRecordsForense);
    } catch (error) {
      console.error("Error fetching Forense data:", error);
    } finally {
      setLoading(false);
      onFetchComplete();
    }
  };

  return (
    <div>
      {loading && <div>Loading Forense data...</div>}
    </div>
  );
};

export default FetchForense;