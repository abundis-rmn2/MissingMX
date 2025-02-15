import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const GlobalTimeGraph = () => {
  const { map, COLORS, setSelectedDate, timeScale, setTimeScale } = useData();
  const [showChart, setShowChart] = useState(false);

  const processedData = useMemo(() => {
    if (!map) return [];

    const aggregateData = new Map();
    
    const layers = map.getStyle().layers;
    const features = layers
      .filter(layer => layer.type === 'circle')
      .flatMap(layer => {
        const source = map.getSource(layer.source);
        return source?._data?.features || [];
      });

    features.forEach(feature => {
      const timestamp = feature.properties?.timestamp;
      const sexo = feature.properties?.sexo;
      const condicion = feature.properties?.condicion_localizacion;
      if (!timestamp) return;

      const date = new Date(parseInt(timestamp));
      let key;

      switch(timeScale) {
        case 'weekly':
          const startOfWeek = new Date(date);
          startOfWeek.setDate(date.getDate() - date.getDay());
          key = startOfWeek.toISOString().split('T')[0];
          break;
        case 'bi-weekly':
          const startOfBiWeek = new Date(date);
          const dayOfMonth = date.getDate();
          startOfBiWeek.setDate(dayOfMonth <= 15 ? 1 : 16);
          key = startOfBiWeek.toISOString().split('T')[0];
          break;
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
          break;
        case 'yearly':
          key = `${date.getFullYear()}-01-01`;
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
          'NO APLICA': 0
        });
      }
      
      const entry = aggregateData.get(key);
      if (sexo === 'HOMBRE' || sexo === 'MUJER') {
        entry[sexo]++;
      }
      if (condicion === 'CON VIDA' || condicion === 'SIN VIDA' || 'NO APLICA') {
        entry[condicion]++;
      }
    });

    return Array.from(aggregateData.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [map, timeScale]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '10px',
          border: '1px solid #ccc'
        }}>
          <p><strong>{formatDateLabel(label)}</strong></p>
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

  const formatDateLabel = (date) => {
    const d = new Date(date);
    switch(timeScale) {
      case 'weekly':
        return `Week of ${d.toLocaleDateString()}`;
      case 'bi-weekly':
        const day = d.getDate();
        return `${day <= 15 ? 'First' : 'Second'} half of ${d.toLocaleDateString('default', { month: 'short', year: 'numeric' })}`;
      case 'monthly':
        return d.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      case 'yearly':
        return d.getFullYear().toString();
      default:
        return d.toLocaleDateString();
    }
  };

  const handleDateClick = (e) => {
    if (e && e.activeLabel) {
      const clickedDate = new Date(e.activeLabel);
      setSelectedDate(clickedDate);
    }
  };

  const handleTimeScaleChange = (e) => {
    setTimeScale(e.target.value);
    setShowChart(true);
  };

  return (
    <div className="GlobalTimeLine" style={{ width: '100%', 
                                            height: showChart ? '150px' : '40px',
                                            marginTop: '60px' }}>
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
      {!showChart && (<div className='PickScale'>        
          <span>Pick your timeScale</span></div>)}

      {showChart && map && (
        <ResponsiveContainer>
          <LineChart
            data={processedData}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            onClick={handleDateClick}
          >
            <XAxis 
              dataKey="date"
              tickFormatter={formatDateLabel}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            {timeScale && <Legend />}
            <Line
              type="monotone"
              dataKey="HOMBRE"
              name="Men"
              stroke={COLORS.HOMBRE.opacity100}
              dot={true}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="MUJER"
              name="Women"
              stroke={COLORS.MUJER.opacity100}
              dot={true}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="CON VIDA"
              name="Found Alive"
              stroke={COLORS.CON_VIDA.opacity100}
              dot={true}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="SIN VIDA"
              name="Found Deceased" 
              stroke={COLORS.SIN_VIDA.opacity100}
              dot={true}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="NO APLICA"
              name="Not Applicable"
              stroke={COLORS.NO_APLICA.opacity100}
              dot={true}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default GlobalTimeGraph;