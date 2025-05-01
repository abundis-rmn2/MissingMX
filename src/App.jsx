import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useData } from './context/DataContext'; // Remove DataProvider import
import FetchCedulas from './components/FetchCedulas';
import FetchForense from './components/FetchForense';
import MapComponent from './components/MapComponent';
import InitialModal from './components/InitialModal';
import DateFormCompact from './components/DateFormCompact';
import Clustering from './components/Clustering';
import Notebook from './components/Notebook';
import PasswordCheck from './components/PasswordCheck';
import TabsComponent from './components/TabsComponent'; // Import TabsComponent
import NotebookLoad from './components/NotebookLoad'; // Import NotebookLoad
import FilteredStats from './components/FilteredStats'; // Import FilteredStats
import SideNotebook from './components/SideNotebook'; // Import SideNotebook
import BottomTimelinePanel from './components/BottomTimelinePanel'; // Import BottomTimelinePanel
import HeaderPanel from './components/HeaderPanel'; // Import HeaderPanel
import LeftSideBar from './components/LeftSideBar'; // Import LeftSideBar
import HeaderCompact from './components/HeaderCompact'; // Import HeaderCompact
import * as Tabs from '@radix-ui/react-tabs';
import AppLayout from './components/AppLayout';
import './styles/FilterForm.css'; // Import FilterForm styles

// Lazy load non-map components
const TimelineSlider = lazy(() => import('./components/TimelineSlider'));
const SemanticGraph = lazy(() => import('./components/SemanticGraph'));
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

  // State for NotebookLoad modal in Tab 5
  const [isNotebookModalOpen, setIsNotebookModalOpen] = useState(false);
  const [notebookList, setNotebookList] = useState([]);

  // Debug-enabled listNotebooks for Tab 5
  const listNotebooksApp = async () => {
    console.log('Tab5: listNotebooks called');
    try {
      const response = await fetch(`https://datades.abundis.com.mx/api/list.php`);
      if (!response.ok) throw new Error('Failed to fetch notebooks');
      const data = await response.json();
      console.log('Tab5: listNotebooks response', data);
      if (data.success) {
        setNotebookList(data.notebooks);
        setIsNotebookModalOpen(true);
        console.log('Tab5: Modal should open now');
      } else {
        alert('No notebooks found.');
      }
    } catch (error) {
      alert('Error fetching notebooks.');
      console.error('Tab5: Error fetching notebooks:', error);
    }
  };

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
      //setIsAuthenticated(true);
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
    <>
      <style>
        {`
          .rt-TabsTriggerInnerHidden, .rt-BaseTabListTriggerInnerHidden {
            display: none !important;
          }
        `}
      </style>
      {!isAuthenticated ? (
        <PasswordCheck onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <>
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
          <div className="Map">
            <MapComponent />
          </div>
          <BottomTimelinePanel />
          <Suspense fallback={<div>Loading...</div>}>
            <Router basename="/dist">
              <Routes>
                <Route path="/cuaderno/:id" element={
                  <AppLayout
                    isNotebookRoute={true}
                    visibleComponents={visibleComponents}
                    toggleComponent={toggleComponent}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    fetchCedulas={fetchCedulas}
                    setFetchCedulas={setFetchCedulas}
                    fetchForense={fetchForense}
                    setFetchForense={setFetchForense}
                  />
                } />
                <Route path="/" element={
                  <AppLayout
                    isNotebookRoute={false}
                    visibleComponents={visibleComponents}
                    toggleComponent={toggleComponent}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    fetchCedulas={fetchCedulas}
                    setFetchCedulas={setFetchCedulas}
                    fetchForense={fetchForense}
                    setFetchForense={setFetchForense}
                  />
                } />
              </Routes>
            </Router>
          </Suspense>
        </>
      )}
    </>
  );
};

export default App;