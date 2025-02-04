import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import L from 'leaflet';
import MarkersCedulas from './MarkersCedulas';
import MarkersForense from './MarkersForense';

const MapComponent = () => {
  const { map, setMap } = useData();

  useEffect(() => {
    if (!map) {
      try {
        const newMap = L.map('map').setView([20.659698, -103.349609], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(newMap);
        setMap(newMap);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  }, [map, setMap]);

  return (
    <div id="map" style={{ height: '100vh', width: '100vw' }}>
      {map && <MarkersForense map={map} />}
      {map && <MarkersCedulas map={map} />}
    </div>
  );
};

export default MapComponent;