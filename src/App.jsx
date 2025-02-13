import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import DateForm from './components/DateForm';
import ErrorBoundary from './context/ErrorBoundary';
import TimelineSlider from './components/TimelineSlider';
import Clustering from './components/Clustering';
import LayoutForm from './components/LayoutForm';
import FilterForm from './components/FilterForm';
import TimeGraph from './components/TimeGraph';
import SexoTimeGraph from './components/SexoTimeGraph';
import CondicionTimeGraph from './components/CondicionTimeGraph';
import GlobalTimeGraph from './components/GlobalTimeGraph';
import ViolenceCases from './components/ViolenceCases';

const App = () => {
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [fetchCedulas, setFetchCedulas] = useState(true);
  const [fetchForense, setFetchForense] = useState(true);
  const [fetchId, setFetchId] = useState(0); // Unique identifier for each fetch operation
  const { loading, setLoading, updatedMarkers } = useData(); // Use loading state from context
  const [isFormsVisible, setIsFormsVisible] = useState(true); // State to manage form visibility

  const handleDateSelect = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    setFetchId(prev => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    setLoading(true);
    setFetchId(prev => prev + 1); // Increment the fetchId to trigger useEffect in child components
    console.log('Fetch ID incremented:', fetchId + 1);
  };

  const handleFetchComplete = () => {
    console.log('Fetch complete');
    setLoading(false);
  };

  const toggleFormsVisibility = () => {
    setIsFormsVisible(!isFormsVisible);
  };

  return (
    <DataProvider>
      <ErrorBoundary>
        <div className="App">
          <button onClick={toggleFormsVisibility}>
            {isFormsVisible ? 'Minimize Forms' : 'Maximize Forms'}
          </button>
          {isFormsVisible && (
            <div className="DateForm">
              <DateForm
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                handleSubmit={handleSubmit}
                loading={loading}
                fetchCedulas={fetchCedulas}
                setFetchCedulas={setFetchCedulas}
                fetchForense={fetchForense}
                setFetchForense={setFetchForense}
              />
              <FetchCedulas
                fetchCedulas={fetchCedulas}
                startDate={startDate}
                endDate={endDate}
                fetchId={fetchId} // Pass fetchId instead of triggerFetch
                onFetchComplete={handleFetchComplete}
              />
              <FetchForense
                fetchForense={fetchForense}
                startDate={startDate}
                endDate={endDate}
                fetchId={fetchId} // Pass fetchId instead of triggerFetch
                onFetchComplete={handleFetchComplete}
              />
              <Clustering type="personas_sin_identificar" />
              <GlobalTimeGraph onDateSelect={handleDateSelect} />
            </div>
          )}
          <div className="TimelineSlider">
            <TimelineSlider />
            <ViolenceCases />
            <TimeGraph />
          </div>
          <div className="MapForms">
            <LayoutForm />
            <FilterForm />
            <CurrentState />
          </div>
          <div className="Map">
            <MapComponent />
          </div>
        </div>
      </ErrorBoundary>
    </DataProvider>
  );
};

export default App;