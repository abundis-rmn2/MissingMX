import React, { useEffect, useState } from 'react';
import L from 'leaflet'; // Assuming you're using Leaflet for the map
import MarkersCedulas from './MarkersCedulas';
import MarkersForense from './MarkersForense';
import { useData } from '../context/DataContext';

const MapComponent = () => {
  const { map, setMap } = useData(); // Get map state and setter from context
  const [mapInstance, setMapInstance] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      try {
        const map = L.map('map').setView([20.6597, -103.3496], 13); // Center the map on Guadalajara City
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          errorTileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' // Fallback tile URL
        });

        tileLayer.on('tileerror', (error) => {
          console.error('Error loading tile:', error);
        });

        tileLayer.addTo(map);
        setMap(map); // Set the map in context once it's initialized
        setMapInstance(map); // Store map instance locally
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    if (!mapInstance) {
      initializeMap(); // Initialize map only once
    }

    return () => {
      if (mapInstance) {
        mapInstance.remove(); // Clean up the map instance when the component unmounts
      }
    };
  }, [mapInstance, setMap]);

return (
  <div style={{ height: '100vh', width: '100vw' }}>
    <div id="map" style={{ height: 'calc(100% - 40px)', width: '100%' }}></div>
    {mapInstance && (
      <>
        <MarkersCedulas map={mapInstance} />
        <MarkersForense map={mapInstance} />
      </>
    )} {/* Load markers when map is ready */}
  </div>
);
};

export default MapComponent;