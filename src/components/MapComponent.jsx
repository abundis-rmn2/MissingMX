import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapComponent = () => {
  const { map, setMap } = useData();
  const mapContainer = useRef(null);
  const contextLostRef = useRef(false);

  useEffect(() => {
    if (!map && !contextLostRef.current) {
      try {
        const newMap = new maplibregl.Map({
          container: mapContainer.current,
          style: 'https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=cf6b8388-7d50-4714-8aac-6ecb7fedd428',
          center: [-103.349609, 20.659698],
          zoom: 8,
          preserveDrawingBuffer: true,
          antialias: false,
          maxParallelImageRequests: 4
        });

        // Handle WebGL context events
        newMap.on('webglcontextlost', () => {
          console.log('WebGL context lost');
          contextLostRef.current = true;
        });

        newMap.on('webglcontextrestored', () => {
          console.log('WebGL context restored');
          contextLostRef.current = false;
        });

        newMap.on('load', () => {
          setMap(newMap);
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [map, setMap]);

  return (
    <div className="map-wrapper">
      <div ref={mapContainer} className="map-container" />
    </div>
  );
};

export default MapComponent;