import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const DateForm = ({ startDate, endDate, setStartDate, setEndDate, handleSubmit, fetchCedulas, setFetchCedulas, fetchForense, setFetchForense }) => {
  const { loading } = useData(); // Use loading state from context
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStartDate(localStartDate);
    setEndDate(localEndDate);
    handleSubmit(e);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Start Date:
        <input
          type="date"
          value={localStartDate}
          onChange={(e) => setLocalStartDate(e.target.value)}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={localEndDate}
          onChange={(e) => setLocalEndDate(e.target.value)}
          required
        />
      </label>
      <label>
        Fetch Cedulas:
        <input
          type="checkbox"
          checked={fetchCedulas}
          onChange={(e) => setFetchCedulas(e.target.checked)}
        />
      </label>
      <label>
        Fetch Forense:
        <input
          type="checkbox"
          checked={fetchForense}
          onChange={(e) => setFetchForense(e.target.checked)}
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
    </form>
  );
};

export default DateForm;