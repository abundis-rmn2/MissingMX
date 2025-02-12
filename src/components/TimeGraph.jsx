import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const TimeGraph = () => {
  const { 
    timelineData,
    selectedDate,
    daysRange,
    COLORS,
    map
  } = useData();

  const AGE_RANGES = [
    { min: 0, max: 15, label: '0-15' },
    { min: 16, max: 30, label: '16-30' },
    { min: 31, max: 45, label: '31-45' },
    { min: 46, max: 60, label: '46-60' },
    { min: 61, max: 100, label: '61+' }
  ];

  const CONDITIONS = ['CON VIDA', 'SIN VIDA', 'NO APLICA'];

  const AGE_COLORS = {
    '0-15': '#8884d8',  // Purple
    '16-30': '#82ca9d', // Green
    '31-45': '#ffc658', // Yellow
    '46-60': '#ff7300', // Orange
    '61+': '#d84848'    // Red
  };

  const CONDITION_OPACITY = {
    'CON VIDA': 1,
    'SIN VIDA': 0.5,
    'NO APLICA': 0.25
  };

  const processedData = useMemo(() => {
    if (!map || !selectedDate) return [];

    const layers = map.getStyle().layers;
    const features = layers
      .filter(layer => layer.type === 'circle')
      .flatMap(layer => {
        const source = map.getSource(layer.source);
        return source?._data?.features || [];
      })
      .filter(feature => feature.properties.tipo_marcador === 'cedula_busqueda');

    const dailyData = new Map();
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + daysRange);

    features.forEach(feature => {
      const timestamp = feature.properties?.timestamp;
      if (!timestamp) return;

      const date = new Date(parseInt(timestamp));
      if (date < startDate || date > endDate) return;

      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, {
          date: dateKey,
          total: 0,
          ...Object.fromEntries(AGE_RANGES.map(range => [range.label, 0]))
        });
      }

      const entry = dailyData.get(dateKey);
      const age = parseInt(feature.properties.edad_momento_desaparicion);
      
      if (!isNaN(age)) {
        const ageRange = AGE_RANGES.find(range => age >= range.min && age <= range.max);
        if (ageRange) {
          entry[ageRange.label]++;
          entry.total++;
        }
      }
    });

    return Array.from(dailyData.values())
      .map(entry => {
        const withPercentages = { ...entry };
        AGE_RANGES.forEach(range => {
          if (entry.total > 0) {
            withPercentages[range.label] = (entry[range.label] / entry.total) * 100;
          }
        });
        return withPercentages;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [map, selectedDate, daysRange]);

  const CustomYAxisTick = ({ x, y, payload }) => {
    const value = payload.value;
    const ageRange = AGE_RANGES[Math.floor(value * AGE_RANGES.length)];
    
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-5}
          y={0}
          dy={4}
          textAnchor="end"
          fill="#666"
          fontSize={12}
        >
          {ageRange ? ageRange.label : ''}
        </text>
      </g>
    );
  };

  if (!processedData.length) {
    return <div>No data available for graph</div>;
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <AreaChart
          data={processedData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          stackOffset="expand"
        >
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Tooltip 
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value, name) => [`${Math.round(value)}%`, `Age ${name}`]}
          />
          <Legend />
          
          {AGE_RANGES.map((range, index) => (
            <Area
              key={range.label}
              type="monotone"
              dataKey={range.label}
              stackId="1"
              stroke={AGE_COLORS[range.label]}
              fill={AGE_COLORS[range.label]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeGraph;