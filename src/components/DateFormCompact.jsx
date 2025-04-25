import React from 'react';
import { useData } from '../context/DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Box, Heading } from '@radix-ui/themes';

const DateFormCompact = ({ handleSubmit, fetchCedulas, setFetchCedulas, fetchForense, setFetchForense, loading: loadingProp }) => {
  const { startDate, endDate, setStartDate, setEndDate, loading: loadingContext } = useData();

  // Always use loading from context unless explicitly passed as prop
  const loading = loadingProp !== undefined ? loadingProp : loadingContext;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (typeof handleSubmit === 'function') {
      handleSubmit(e);
    }
  };

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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </label>
              <label>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: 6 }} />
                Fecha fin:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
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
