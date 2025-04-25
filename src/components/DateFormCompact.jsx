import React from 'react';
import { useData } from '../context/DataContext';
import { useDateForm } from '../utils/dateForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faIdCard, faDna, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Box, Heading } from '@radix-ui/themes';

const DateFormCompact = ({ handleSubmit, fetchCedulas, setFetchCedulas, fetchForense, setFetchForense }) => {
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
    <>      
    <Box
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '10px 20px 4px 20px',
      borderBottom: '1px solid #eee',
      background: '#fafbfc',
      gap: 8,
    }}
  >
    <FontAwesomeIcon icon={faDownload} style={{ fontSize: 28, color: '#007bff' }} />
    <Heading size="1" style={{ margin: 0, fontSize: '1rem', lineHeight: '1.2' }}>
      Rango de análisis
    </Heading>
  </Box>
  <Box>
    <div className="date-form-container compact">
      <form onSubmit={handleFormSubmit} className="compact-form">
        <div className="form-content">
          <div className="date-inputs">
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 6 }} />
              Fecha inicio:
              <input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 6 }} />
              Fecha fin:
              <input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: 6 }} />
            {loading ? 'Cargando...' : 'Obtener datos'}
          </button>
        </div>
      </form>
    </div>
    </Box>
    </>
  );
};

export default DateFormCompact;
