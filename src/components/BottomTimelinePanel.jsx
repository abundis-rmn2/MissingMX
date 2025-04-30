import React from 'react';
import TimelineSlider from './TimelineSlider';
import LayoutForm from './LayoutForm';
import Clustering from './Clustering';
import GlobalTimeGraph from './GlobalTimeGraph';
import { useData } from '../context/DataContext';

const BottomTimelinePanel = () => {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    setLoading,
  } = useData();

  const handleDateSelect = (start, end) => {
    console.log('Date selected in GlobalTimeGraph:', { start, end });
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="TimelineSlider">
      <div className="FormsContainer">
        <TimelineSlider />
        <LayoutForm />
      </div>
      <Clustering type="personas_sin_identificar" />
      <GlobalTimeGraph 
        className="GlobalTimeGraph" 
        onDateSelect={handleDateSelect}
      />
    </div>
  );
};

export default BottomTimelinePanel;
