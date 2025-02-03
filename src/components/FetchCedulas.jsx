import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FetchDataDesaparecidos = () => {
  const { setFetchedRecords, setNewDataFetched } = useData(); // Get function to update the context and new data flag
  const [startDate, setStartDate] = useState('2024-01-01'); // Default start date
  const [endDate, setEndDate] = useState('2024-02-02'); // Default end date
  const [loading, setLoading] = useState(false);

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
      const formattedRecords = records.map(record => {
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

      setFetchedRecords(formattedRecords); // Update context with fetched records
      setNewDataFetched(true); // Set new data flag to true
      console.log('Fetched records:', formattedRecords);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(startDate, endDate);
  };

  return (
    <div>
      <span>Missing Persons Data</span>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </form>
      {loading && <div>Loading data...</div>}
    </div>
  );
};

export default FetchDataDesaparecidos;