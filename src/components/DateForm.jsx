import React from 'react';

const DateForm = ({ startDate, endDate, setStartDate, setEndDate, handleSubmit, loading }) => {
  return (
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
  );
};

export default DateForm;