import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

const MarkersForense = ({ map }) => {
  const { forenseRecords, markers, setMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS } = useData(); // Get the forense records, current markers, setMarkers function, new data flag, COLORS, and POINT_RADIUS from context

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
    if (map && newForenseDataFetched) {
      // Remove existing markers from the map
      markers.forEach(marker => {
        if (marker) {
          map.removeLayer(marker);
        }
      });

      // Create new markers from forense records
      const newMarkers = forenseRecords.map((record, index) => {
        const { lat, lon, ID, Fecha_Ingreso, Probable_nombre, Edad, Tatuajes, Indumentarias, Senas_Particulares, Delegacion_IJCF } = record;
        console.log(lat, lon, ID, Fecha_Ingreso, Probable_nombre, Edad, Tatuajes, Indumentarias, Senas_Particulares, Delegacion_IJCF);
        if (lat && lon) {
          // Adjust lat and lon to avoid overlap
          const adjustedCoords = adjustLatLon(lat, lon, index);

          // Determine marker color for forense records
          const color = COLORS.UNKNOWN;

          // Create a marker for each record
          const marker = L.circleMarker([adjustedCoords.lat, adjustedCoords.lon], {
            color,
            radius: POINT_RADIUS
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

      setMarkers(newMarkers); // Update context with new markers
      setNewForenseDataFetched(false); // Reset new data flag
    }
  }, [forenseRecords, map, markers, setMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS]);

  return null; // This component doesn't need to render anything directly
};

export default MarkersForense;