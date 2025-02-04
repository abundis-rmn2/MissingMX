import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MarkersCedulas from './MarkersCedulas';
import MarkersForense from './MarkersForense';
import TimelineSlider from './TimelineSlider';

const MapComponent = () => {
  const { map, setMap, setFilterMonth } = useData();
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) {
      try {
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://demotiles.maplibre.org/style.json',
          center: [-103.349609, 20.659698],
          zoom: 10
        });

        newMap.on('load', () => {
          setMap(newMap);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  }, [map, setMap, setFilterMonth]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '100vh', width: '100vw' }}>
        {map && <MarkersForense map={map} />}
        {map && <MarkersCedulas map={map} />}
      </div>
    </div>
  );
};

export default MapComponent;