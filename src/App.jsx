import React, { useState, useEffect, Suspense, lazy } from 'react';
import { DataProvider, useData } from './context/DataContext';
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import DateForm from './components/DateForm';
import ErrorBoundary from './context/ErrorBoundary';
import Clustering from './components/Clustering';
import PasswordForm from './components/PasswordForm';
import Notebook from './components/Notebook';

// Lazy load non-map components
const TimelineSlider = lazy(() => import('./components/TimelineSlider'));
const ViolenceCases = lazy(() => import('./components/ViolenceCases'));
const CrossRef = lazy(() => import('./components/CrossRef'));
const FilterForm = lazy(() => import('./components/FilterForm'));
const LayoutForm = lazy(() => import('./components/LayoutForm'));
const TimeGraph = lazy(() => import('./components/TimeGraph'));
const GlobalTimeGraph = lazy(() => import('./components/GlobalTimeGraph'));

const AppContent = () => {
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [fetchCedulas, setFetchCedulas] = useState(true);
  const [fetchForense, setFetchForense] = useState(true);
  const [fetchId, setFetchId] = useState(0);
  const [isFormsVisible, setIsFormsVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get data from context
  const { 
    loading, 
    setLoading, 
    visibleComponents,
    setVisibleComponents 
  } = useData();

  // For debugging - log the visibility state
  useEffect(() => {
    console.log('App received visibleComponents:', visibleComponents);
    console.log('setVisibleComponents is:', typeof setVisibleComponents);
  }, [visibleComponents, setVisibleComponents]);

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

  const toggleComponent = (component) => {
    console.log('Toggling component:', component);
    console.log('Current state:', visibleComponents);
    
    if (typeof setVisibleComponents === 'function') {
      setVisibleComponents(prev => {
        const updated = { ...prev, [component]: !prev[component] };
        console.log('New visibility state:', updated);
        return updated;
      });
    } else {
      console.error('setVisibleComponents is not a function!');
    }
  };

  const handlePasswordSubmit = (password) => {
    fetch('https://datades.abundis.com.mx/dist/check_password.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsAuthenticated(true);
        } else {
          alert('Incorrect password');
        }
      });
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <PasswordForm onSubmit={handlePasswordSubmit} />
      ) : (
        <>
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

          <div className="ComponentToggles">
            {Object.entries(visibleComponents).map(([key, value]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => toggleComponent(key)}
                />
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
            ))}
          </div>

          <div className='MobileContainer'>
            <div className="MapForms">
              <Suspense fallback={<div>Loading...</div>}>
                <TimelineSlider />
                <LayoutForm />
                {visibleComponents.filterForm && <FilterForm />}
                {visibleComponents.currentState && <CurrentState />}
                {visibleComponents.violenceCases && <ViolenceCases />}
                {visibleComponents.timeGraph && <TimeGraph />}
                {visibleComponents.crossRef && <CrossRef />}
              </Suspense>
            </div>
          </div>
          <div className="Map">
            <MapComponent />
          </div>
          <Notebook />
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <DataProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </DataProvider>
  );
};

export default App;