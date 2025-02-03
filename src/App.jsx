import React from 'react';
import { DataProvider } from './context/DataContext'; // Wrap app with DataProvider context
import FetchCedulas from './components/FetchCedulas';
import MapComponent from './components/MapComponent';
import CurrentState from './context/currrentState';
import FetchForense from './components/FetchForense';

const App = () => {
  return (
    <DataProvider>
      <FetchCedulas /> {/* Fetch data and update context */}
      <FetchForense /> {/* Fetch data and update context */}
      <MapComponent /> {/* Render the map with markers */}
      <CurrentState /> {/* Display the current state of the app */}
    </DataProvider>
  );
};

export default App;
