import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';

const TimeGraph = () => {
  const { 
    timelineData,
    selectedDate,
    daysRange,
    COLORS
  } = useData();

  const AGE_RANGES = [
    { min: 0, max: 15, label: '0-15' },
    { min: 16, max: 30, label: '16-30' },
    { min: 31, max: 45, label: '31-45' },
    { min: 46, max: 60, label: '46-60' },
    { min: 61, max: 100, label: '61+' }
  ];

  const processedData = useMemo(() => {
    if (!timelineData || timelineData.length === 0 || !selectedDate) return [];

    // Create frequency maps by age range
    const dailyData = new Map();
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + daysRange);

    timelineData.forEach(item => {
      if (item.type !== 'cedula_busqueda') return;

      const date = new Date(parseInt(item.timestamp));
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
      const age = parseInt(item.edad_momento_desaparicion);
      
      if (!isNaN(age)) {
        const ageRange = AGE_RANGES.find(range => age >= range.min && age <= range.max);
        if (ageRange) {
          entry[ageRange.label]++;
          entry.total++;
        }
      }
    });

    // Calculate percentages
    dailyData.forEach(value => {
      AGE_RANGES.forEach(range => {
        if (value.total > 0) {
          value[range.label] = (value[range.label] / value.total) * 100;
        }
      });
    });

    // Convert to array and sort
    return Array.from(dailyData.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

  }, [timelineData, selectedDate, daysRange]);

  if (!processedData.length) return <div>No data available for graph</div>;

  const AREA_COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#666666'
  ];

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <AreaChart
          data={processedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          stackOffset="expand"
        >
          <XAxis 
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis 
            tickFormatter={(value) => `${Math.round(value)}%`}
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
              stroke={AREA_COLORS[index]}
              fill={AREA_COLORS[index]}
              fillOpacity={0.6}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeGraph;