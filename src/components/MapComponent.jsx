import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const { map, setMap } = useData();
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) {
      try {
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=cf6b8388-7d50-4714-8aac-6ecb7fedd428',
          center: [-103.349609, 20.659698],
          zoom: 8
        });

        newMap.on('load', () => {
          setMap(newMap);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
  }, [map, setMap]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: '100vh', width: '100vw' }} />
    </div>
  );
};

export default MapComponent;