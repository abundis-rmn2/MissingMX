import React, { useEffect } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FetchCedulas = ({ fetchCedulas, startDate, endDate, fetchId, onFetchComplete }) => {
  const { setFetchedRecords, setNewDataFetched, loading, setLoading, updateMarkers, forenseRecords } = useData();

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
          ...record,
          lat,
          lon,
          id: record.id_cedula_busqueda,
          fecha_desaparicion: record.fecha_desaparicion,
          sexo: record.sexo,
          edad_momento_desaparicion: record.edad_momento_desaparicion,
          condicion_localizacion: record.condicion_localizacion,
          descripcion_desaparicion: record.descripcion_desaparicion,
          tipo_marcador: 'cedula_busqueda'
        };
      });

      setFetchedRecords(formattedRecordsCedula);
      setNewDataFetched(true);
      //updateMarkers(formattedRecordsCedula, forenseRecords); // Update markers with combined records
      console.log('Fetched Cedulas records:', formattedRecordsCedula);
    } catch (error) {
      console.error("Error fetching Cedulas data:", error);
    } finally {
      setLoading(false);
      onFetchComplete();
    }
  };

  return (
    <div>
      {loading && <div>Loading Cedulas data...</div>}
    </div>
  );
};

export default FetchCedulas;