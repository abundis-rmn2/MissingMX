import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const DateForm = ({ startDate, endDate, setStartDate, setEndDate, handleSubmit, fetchCedulas, setFetchCedulas, fetchForense, setFetchForense }) => {
  const { loading } = useData();
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [isModalMode, setIsModalMode] = useState(true);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStartDate(localStartDate); // Update the parent state
    setEndDate(localEndDate); // Update the parent state
    setIsModalMode(false);
    handleSubmit(e);
  };

  return (
    <div className={`date-form-container ${isModalMode ? 'modal' : 'compact'}`}>
      <form onSubmit={handleFormSubmit} className={isModalMode ? 'modal-form' : 'compact-form'}>
        <div className="form-content">
          <div className="date-inputs">
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
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={fetchCedulas}
                onChange={(e) => setFetchCedulas(e.target.checked)}
              />
              Fetch Cedulas
            </label>
            <label>
              <input
                type="checkbox"
                checked={fetchForense}
                onChange={(e) => setFetchForense(e.target.checked)}
              />
              Fetch Forense
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DateForm;