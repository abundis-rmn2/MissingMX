import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceArea } from 'recharts';
import { useData } from '../context/DataContext';

const GlobalTimeGraph = () => {
  const {
    map,
    COLORS,
    selectedDate,
    daysRange,
    timeScale,
    setSelectedDate,
    setTimeScale,
    newDataFetched,
    newForenseDataFetched,
  } = useData();
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!map) {
      console.warn('GlobalTimeGraph: Map is not initialized.');
      setIsLoading(true);
      return;
    }

    const handleMapLoad = () => {
      console.log('GlobalTimeGraph: Map is fully loaded.');
      setIsLoading(false);
    };

    if (!map.isStyleLoaded()) {
      map.once('load', handleMapLoad);
    } else {
      handleMapLoad();
    }

    return () => {
      if (map) {
        map.off('load', handleMapLoad);
      }
    };
  }, [map]);

  useEffect(() => {
    if (isLoading || !map || (!newDataFetched && !newForenseDataFetched)) {
      console.warn('GlobalTimeGraph: Waiting for map and features to be ready.');
      return;
    }

    const aggregateData = new Map();
    const layers = map.getStyle().layers || [];
    const features = layers
      .filter(layer => layer.type === 'circle')
      .flatMap(layer => {
        const source = map.getSource(layer.source);
        return source?._data?.features || [];
      });

    if (features.length === 0) {
      console.warn('GlobalTimeGraph: No features found in map layers.');
      setProcessedData([]);
      return;
    }

    features.forEach(feature => {
      const timestamp = feature.properties?.timestamp;
      const sexo = feature.properties?.sexo;
      const condicion = feature.properties?.condicion_localizacion;
      if (!timestamp) return;

      const date = new Date(parseInt(timestamp));
      let key;

      switch (timeScale) {
        case 'weekly':
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          break;
        case 'bi-weekly':
          const startOfBiWeek = new Date(date);
          // Align to Sunday first
          startOfBiWeek.setDate(date.getDate() - date.getDay());
          // Then find which bi-week period (0 or 1)
          const daysIntoBiWeek = Math.floor((startOfBiWeek.getDate() - 1) / 14) * 14;
          startOfBiWeek.setDate(1 + daysIntoBiWeek);
          key = startOfBiWeek.toISOString().split('T')[0];
          break;
        case 'yearly':
          key = `${date.getFullYear()}-01-01`;
          break;
        case 'daily':
          key = date.toISOString().split('T')[0];
          break;
        default:
          key = date.toISOString().split('T')[0];
      }

      if (!aggregateData.has(key)) {
        aggregateData.set(key, {
          date: key,
          HOMBRE: 0,
          MUJER: 0,
          'CON VIDA': 0,
          'SIN VIDA': 0,
          'NO APLICA': 0,
        });
      }

      const entry = aggregateData.get(key);
      if (sexo === 'HOMBRE' || sexo === 'MUJER') {
        entry[sexo]++;
      }
      if (condicion === 'CON VIDA' || condicion === 'SIN VIDA' || condicion === 'NO APLICA') {
        entry[condicion]++;
      }
    });

    const sortedData = Array.from(aggregateData.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('GlobalTimeGraph: Processed data:', sortedData);
    setProcessedData(sortedData);
  }, [map, timeScale, newDataFetched, newForenseDataFetched, isLoading]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;

      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc'
        }}>
          <p><strong>{label}</strong></p>
          <p>Men: {data.HOMBRE}</p>
          <p>Women: {data.MUJER}</p>
          <p>Found Alive: {data['CON VIDA']}</p>
          <p>Found Deceased: {data['SIN VIDA']}</p>
          <p>Not Applicable: {data['NO APLICA']}</p>
        </div>
      );
    }
    return null;
  };

  const handleTimeScaleChange = (e) => {
    setTimeScale(e.target.value);
  };

  const handleDateClick = (e) => {
    if (e && e.activeLabel) {
      const clickedDate = new Date(e.activeLabel);
      setSelectedDate(clickedDate);
    }
  };

  const calculateDateRange = () => {
    if (!selectedDate) return null;

    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    // Reset time components to avoid timezone issues


    switch (timeScale) {
      case 'weekly':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'bi-weekly':
        // Align to the start of bi-weekly period
        const daysIntoBiWeek = Math.floor((startDate.getDate() - 1));
        startDate.setDate(1 + daysIntoBiWeek);
        endDate.setDate(startDate.getDate() + 14);
        break;
      case 'monthly':
        startDate.setDate(1); // Set to first day of month
        startDate.setMonth(startDate.getMonth()); // Stay in current month
        endDate.setDate(1); // Set to first day of month
        endDate.setMonth(endDate.getMonth() + 1, 0); // Set to last day of current month
        break;
      case 'yearly':
        startDate.setMonth(0, 1);
        endDate.setMonth(11, 31);
        break;
      default: // daily
        endDate.setDate(endDate.getDate());
    }

    // Ensure the range aligns with the XAxis's dataKey format (YYYY-MM-DD)
    const range = {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
    };

    console.log('Calculated date range:', range);
    return range;
  };

  if (isLoading) {
    return <div>Loading GlobalTimeGraph...</div>;
  }

  const dateRange = calculateDateRange();
  console.log('Date range for ReferenceArea:', dateRange);

  return (
    <div className="GlobalTimeLine" style={{
      width: '100%',
      height: processedData.length > 0 ? '150px' : '40px',
      marginTop: '60px'
    }}>
      <div className="GlobalTimeLine" style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            value="daily"
            checked={timeScale === 'daily'}
            onChange={handleTimeScaleChange}
          /> Daily
        </label>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            value="weekly"
            checked={timeScale === 'weekly'}
            onChange={handleTimeScaleChange}
          /> Weekly
        </label>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            value="bi-weekly"
            checked={timeScale === 'bi-weekly'}
            onChange={handleTimeScaleChange}
          /> Bi-weekly
        </label>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={timeScale === 'monthly'}
            onChange={handleTimeScaleChange}
          /> Monthly
        </label>
        <label style={{ marginRight: '15px' }}>
          <input
            type="radio"
            value="yearly"
            checked={timeScale === 'yearly'}
            onChange={handleTimeScaleChange}
          /> Yearly
        </label>
      </div>

      {/* Legend for Selected Date Range */}
      {selectedDate && (
        <div className="SelectedDateLegend" style={{ marginBottom: '10px', textAlign: 'center' }}>
          <strong>Date Range:</strong> {`${dateRange.start} to ${dateRange.end}`} <br />
          <span style={{ fontStyle: 'italic', color: '#555' }}>
            Data is aggregated based on the selected time scale.
          </span>
        </div>
      )}

      {processedData.length === 0 && (
        <div className='PickScale'>
          <span>No data available for the selected time scale.</span>
        </div>
      )}

      {processedData.length > 0 && (
        <ResponsiveContainer>
          <LineChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            onClick={handleDateClick}
          >
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dateRange && (
              <ReferenceArea
                x1={dateRange.start}
                x2={dateRange.end}
                stroke="rgba(0, 0, 255, 0.6)"
                strokeWidth={2}
                fill="rgba(0, 0, 255, 0.2)"
              />
            )}
            <Line type="monotone" dataKey="HOMBRE" stroke={COLORS.HOMBRE.opacity100} />
            <Line type="monotone" dataKey="MUJER" stroke={COLORS.MUJER.opacity100} />
            <Line type="monotone" dataKey="CON VIDA" stroke={COLORS.CON_VIDA.opacity100} />
            <Line type="monotone" dataKey="SIN VIDA" stroke={COLORS.SIN_VIDA.opacity100} />
            <Line type="monotone" dataKey="NO APLICA" stroke={COLORS.NO_APLICA.opacity100} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GlobalTimeGraph;