import React, { useState, useEffect } from 'react';
import { DataProvider, useData } from './context/DataContext';
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import DateForm from './components/DateForm';
import ErrorBoundary from './context/ErrorBoundary';
import TimelineSlider from './components/TimelineSlider';

const App = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-02-02');
  const [fetchCedulas, setFetchCedulas] = useState(true);
  const [fetchForense, setFetchForense] = useState(true);
  const [fetchId, setFetchId] = useState(0); // Unique identifier for each fetch operation
  const { loading, setLoading, updatedMarkers } = useData(); // Use loading state from context

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

  useEffect(() => {
    console.log('Loading state changed:', loading);
    console.log(updatedMarkers);
  }, [loading]);

  useEffect(() => {
    console.log('Fetch ID changed:', fetchId);
  }, [fetchId]);

  return (
    <DataProvider>
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
      <ErrorBoundary>
        <TimelineSlider />
        <MapComponent />
      </ErrorBoundary>
      <CurrentState />
    </DataProvider>
  );
};

export default App;