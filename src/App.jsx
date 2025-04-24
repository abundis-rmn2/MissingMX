import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useData } from './context/DataContext'; // Remove DataProvider import
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import InitialModal from './components/InitialModal';
import DateFormCompact from './components/DateFormCompact';
import Clustering from './components/Clustering';
import Notebook from './components/Notebook';
import PasswordCheck from './components/PasswordCheck';
import { Tabs } from '@radix-ui/themes'; // Import Tabs from @radix-ui/themes

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
  const [toolbarTab, setToolbarTab] = useState('tab1'); // State for toolbar tabs

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    loading,
    setLoading,
    visibleComponents,
    setVisibleComponents,
    mapType,
    colorScheme,
  } = useData(); // Use DataContext for shared state

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

  useEffect(() => {
    console.log('App: Context values from useData():', {
      startDate,
      endDate,
      visibleComponents,
      mapType,
      colorScheme,
    });
  }, [startDate, endDate, visibleComponents, mapType, colorScheme]);

  const handleDateSelect = (start, end) => {
    console.log('Date selected in GlobalTimeGraph:', { start, end });
    setStartDate(start); // Update via DataContext
    setEndDate(end);     // Update via DataContext
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
    console.log('Current state before toggle:', visibleComponents);

    if (typeof setVisibleComponents === 'function') {
      setVisibleComponents(prev => {
        const updated = { ...prev, [component]: !prev[component] };
        console.log('New visibility state after toggle:', updated);
        return updated;
      });
    } else {
      console.error('setVisibleComponents is not a function!');
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router basename="/dist">
        <div className="App" id="app">
          {!isAuthenticated ? (
            <PasswordCheck onAuthenticated={() => setIsAuthenticated(true)} />
          ) : (
            <>
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
              {/* Fax-toolbar header */}
              <header
                style={{
                  width: "100%",
                  background: "rgb(245, 245, 245)",
                  borderBottom: "1px solid rgb(221, 221, 221)",
                  marginBottom: 16,
                  position: "absolute",
                  zIndex: 9999,
                  top: 0,
                }}
              >
                <Tabs.Root value={toolbarTab} onValueChange={setToolbarTab}>
                  <Tabs.List
                    style={{
                      display: "flex",
                      borderBottom: "1px solid #ccc",
                      padding: 0,
                      margin: 0,
                      background: "transparent",
                    }}
                  >
                    {["tab1", "tab2", "tab3", "tab4"].map((tab, idx) => (
                      <Tabs.Trigger
                        key={tab}
                        value={tab}
                        style={{
                          flex: 1,
                          padding: "12px 0",
                          border: "none",
                          borderTop:
                            toolbarTab === tab
                              ? "3px solid #007bff"
                              : "3px solid transparent",
                          borderBottom: "none",
                          background: "none",
                          outline: "none",
                          fontWeight: toolbarTab === tab ? "bold" : "normal",
                          color: toolbarTab === tab ? "#007bff" : "#333",
                          cursor: "pointer",
                          transition: "border-top 0.2s, color 0.2s",
                        }}
                      >
                        {`Tab ${idx + 1}`}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>
                </Tabs.Root>
              </header>

              {/* Persistent tab contents, only one visible at a time */}
              <div
                style={{
                  top: 0,
                  marginTop: 49,
                  position: "absolute",
                  zIndex: 99,
                  width: "100%",
                  background: "#fff",
                }}
              >
                <div
                  style={{ display: toolbarTab === "tab1" ? "block" : "none" }}
                >
                  {isFormsVisible && (
                    <div className="DateForm">
                      <DateFormCompact
                        handleSubmit={handleSubmit}
                        loading={loading}
                        fetchCedulas={fetchCedulas}
                        setFetchCedulas={setFetchCedulas}
                        fetchForense={fetchForense}
                        setFetchForense={setFetchForense}
                      />
                      <FetchCedulas
                        fetchCedulas={fetchCedulas}
                        fetchId={fetchId}
                        onFetchComplete={handleFetchComplete}
                      />
                      <FetchForense
                        fetchForense={fetchForense}
                        fetchId={fetchId}
                        onFetchComplete={handleFetchComplete}
                      />
                      <Clustering type="personas_sin_identificar" />
                      <GlobalTimeGraph onDateSelect={handleDateSelect} />
                    </div>
                  )}
                </div>
                <div
                  style={{ display: toolbarTab === "tab2" ? "block" : "none" }}
                >
                  {/* Replace with your real content for Tab 2 */}
                  <div style={{ padding: 16 }}>
                    <TimelineSlider />
                    <LayoutForm />
                  </div>
                </div>
                <div
                  style={{ display: toolbarTab === "tab3" ? "block" : "none" }}
                >
                  {/* Replace with your real content for Tab 3 */}
                  <div style={{ padding: 16 }}>
                    {visibleComponents.filterForm && <FilterForm />}
                </div>
                </div>
                <div
                  style={{ display: toolbarTab === "tab4" ? "block" : "none" }}
                >
                  {/* Replace with your real content for Tab 4 */}
                  <div style={{ padding: 16 }}>
                  {visibleComponents.currentState && <CurrentState />}
                  {/*visibleComponents.violenceCases && <ViolenceCases />*/}
                  </div>
                </div>
              </div>

              <InitialModal
                handleSubmit={handleSubmit}
                loading={loading}
                fetchCedulas={fetchCedulas}
                setFetchCedulas={setFetchCedulas}
                fetchForense={fetchForense}
                setFetchForense={setFetchForense}
              />



              <div className="MobileContainer">

              </div>
              <div className="Map">
                <MapComponent />
              </div>
            </>
          )}
        </div>
        <Routes>
          <Route path="/cuaderno/:id" element={<Notebook />} />
          <Route path="/" element={<Notebook />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

export default App;