import React from 'react';
import { useData } from '../context/DataContext';
import { useDateForm } from '../utils/dateForm';

const DateFormModal = ({ handleSubmit, fetchCedulas, setFetchCedulas, fetchForense, setFetchForense }) => {
  const { startDate, endDate, setStartDate, setEndDate, loading } = useData();
  const {
    localStartDate,
    setLocalStartDate,
    localEndDate,
    setLocalEndDate,
    handleFormSubmit
  } = useDateForm({
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    handleSubmit
  });

  return (
    <div className="date-form-container modal">
      <form onSubmit={handleFormSubmit} className="modal-form">
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

export default DateFormModal;
