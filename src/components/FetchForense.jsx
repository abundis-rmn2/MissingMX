import React, { useState } from 'react';
import axios from 'axios';
import { useData } from '../context/DataContext';

const FetchForense = () => {
  const { setForenseRecords, setNewForenseDataFetched } = useData(); // Get function to update the context and new data flag
  const [startDate, setStartDate] = useState('2024-01-01'); // Default start date
  const [endDate, setEndDate] = useState('2024-02-02'); // Default end date
  const [loading, setLoading] = useState(false);

  // Location coordinates for Delegacion_IJCF
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
      const formattedRecords = records.map(record => {
        let [lat, lon] = record.lat_long ? record.lat_long.split(',').map(coord => parseFloat(coord)) : [null, null];

        if (!lat || !lon) {
            const location = Object.keys(LOCATIONS).find(loc => record.Delegacion_IJCF.includes(loc));
            if (location) {
                [lat, lon] = LOCATIONS[location];
            }
        }
        return {
          ...record,
          lat,
          lon,
          tipo_marcador: 'personas_sin_identificar'
        };
      });

      setForenseRecords(formattedRecords); // Update context with fetched records
      setNewForenseDataFetched(true); // Set new data flag to true
      console.log('Fetched Forense records:', formattedRecords);
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
        <span> Forensic Data</span>
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

export default FetchForense;