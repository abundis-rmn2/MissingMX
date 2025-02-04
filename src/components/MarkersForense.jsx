import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import L from 'leaflet';

const MarkersForense = ({ map, fetchId, thresholdId }) => {
  const { forenseRecords, markers, setMarkers, updateMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS } = useData(); // Get the forense records, current markers, setMarkers function, new data flag, COLORS, POINT_RADIUS, and updateMarkers function from context

  const MIN_DISTANCE = 0.0001; // Minimum distance threshold to avoid overlap

  const adjustLatLon = (lat, lon, index) => {
    const angle = (index % 360) * (Math.PI / 180); // Convert index to radians
    const offset = MIN_DISTANCE * (index + 1); // Increase offset with index
    return {
      lat: lat + offset * Math.sin(angle),
      lon: lon + offset * Math.cos(angle)
    };
  };

  useEffect(() => {
    console.log('useEffect triggered');
    console.log('map:', map);
    console.log('newForenseDataFetched:', newForenseDataFetched);
    console.log('forenseRecords:', forenseRecords);
    console.log('fetchId:', fetchId);

    if (map && newForenseDataFetched) {
      console.log('Creating new markers');

      // Create new markers from forense records
      const newMarkers = forenseRecords.map((record, index) => {
        const { lat, lon, ID, Fecha_Ingreso, Probable_nombre, Edad, Tatuajes, Indumentarias, Senas_Particulares, Delegacion_IJCF, tipo_marcador } = record;

        if (lat && lon && tipo_marcador === 'personas_sin_identificar') {
          // Adjust lat and lon to avoid overlap
          const adjustedCoords = adjustLatLon(lat, lon, index);

          // Determine marker color for forense records
          const color = COLORS.UNKNOWN;

          // Create a marker for each record
          const marker = L.circleMarker([adjustedCoords.lat, adjustedCoords.lon], {
            color,
            radius: POINT_RADIUS,
            tipo_marcador: tipo_marcador
          }).bindPopup(`
            <b>Record ID: ${ID}</b><br>
            Ingress Date: ${Fecha_Ingreso}<br>
            Probable Name: ${Probable_nombre}<br>
            Age: ${Edad}<br>
            Tattoos: ${Tatuajes}<br>
            Clothing: ${Indumentarias}<br>
            Distinctive Signs: ${Senas_Particulares}<br>
            Delegation: ${Delegacion_IJCF}
          `).addTo(map); // Add marker to map

          return marker;
        }
        return null;
      }).filter(marker => marker !== null); // Filter out any null markers

      console.log('newMarkers:', newMarkers);

      if (fetchId > thresholdId) {
        updateMarkers([], newMarkers); // Update markers with new markers
      } else {
        setMarkers(prevMarkers => [...prevMarkers, ...newMarkers]); // Append new markers to existing markers
      }

      setNewForenseDataFetched(false); // Reset new data flag
    }
  }, [forenseRecords, map, markers, setMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS, fetchId, thresholdId, updateMarkers]);

  return null; // This component doesn't need to render anything directly
};

export default MarkersForense;