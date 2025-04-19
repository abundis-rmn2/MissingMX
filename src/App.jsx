import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import DateForm from './components/DateForm';
import Clustering from './components/Clustering';
import Notebook from './components/Notebook';
import PasswordCheck from './components/PasswordCheck';

// Lazy load non-map components
const TimelineSlider = lazy(() => import('./components/TimelineSlider'));
const ViolenceCases = lazy(() => import('./components/ViolenceCases'));
const CrossRef = lazy(() => import('./components/CrossRef'));
const FilterForm = lazy(() => import('./components/FilterForm'));
const LayoutForm = lazy(() => import('./components/LayoutForm'));
const TimeGraph = lazy(() => import('./components/TimeGraph'));
const GlobalTimeGraph = lazy(() => import('./components/GlobalTimeGraph'));

const App = () => {
  const [fetchCedulas, setFetchCedulas] = useState(true);
  const [fetchForense, setFetchForense] = useState(true);
  const [fetchId, setFetchId] = useState(0);
  const [isFormsVisible, setIsFormsVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get data from context
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    visibleComponents,
    setVisibleComponents
  } = useData();

  useEffect(() => {
    console.log('App received visibleComponents:', visibleComponents);
    console.log('setVisibleComponents is:', typeof setVisibleComponents);
  }, [visibleComponents, setVisibleComponents]);

  useEffect(() => {
    console.log('isFormsVisible state updated:', isFormsVisible);
  }, [isFormsVisible]);

  // check changes in start and end date
  useEffect(() => {
    console.log('App: startDate updated:', startDate);
  }, [startDate]);

  useEffect(() => {
    console.log('App: endDate updated:', endDate);
  }, [endDate]);

  useEffect(() => {
    if (window.location.hostname === 'localhost') {
      setIsAuthenticated(true);
    }
  }, []);

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
    console.log('Toggling forms visibility. Current state:', isFormsVisible);
    setIsFormsVisible(!isFormsVisible);
    console.log('New forms visibility state:', !isFormsVisible);
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

  return (
    <DataProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Router basename="/dist">
          <div className="App">
            {!isAuthenticated ? (
              <PasswordCheck onAuthenticated={() => setIsAuthenticated(true)} />
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
                      fetchId={fetchId}
                      onFetchComplete={handleFetchComplete}
                    />
                    <FetchForense
                      fetchForense={fetchForense}
                      startDate={startDate}
                      endDate={endDate}
                      fetchId={fetchId}
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

                <div className="MobileContainer">
                  <div className="MapForms">

                      <TimelineSlider />
                      <LayoutForm />
                      {visibleComponents.filterForm && <FilterForm />}
                      {visibleComponents.currentState && <CurrentState />}
                      {visibleComponents.violenceCases && <ViolenceCases />}
                      {visibleComponents.timeGraph && <TimeGraph />}
                      {visibleComponents.crossRef && <CrossRef />}
                  </div>
                </div>
                <div className="Map">
                  <MapComponent />
                </div>
              </>
            )}
          </div>
          <Routes>
            <Route
              path="/notebook/:id"
              element={
                <Notebook
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate} // Pass setStartDate as a prop
                  setEndDate={setEndDate}     // Pass setEndDate as a prop
                />
              }
            />
            <Route path="/" element={<Notebook />} />
          </Routes>
        </Router>
      </Suspense>
    </DataProvider>
  );
};

export default App;