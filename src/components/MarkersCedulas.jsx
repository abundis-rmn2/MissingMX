import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import L from 'leaflet';

const MarkersCedulas = ({ map, fetchId, thresholdId }) => {
  const { fetchedRecords, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS, updateMarkers } = useData(); // Get the fetched records, current markers, setMarkers function, new data flag, COLORS, POINT_RADIUS, and updateMarkers function from context

  useEffect(() => {
    if (map && newDataFetched) {
      // Create new markers from fetched records
      const newMarkers = fetchedRecords.map(record => {
        const { lat, lon, id, tipo_marcador, fecha_desaparicion, sexo, edad_momento_desaparicion, condicion_localizacion, descripcion_desaparicion } = record;

        if (lat && lon && tipo_marcador === 'cedula_busqueda') {
          // Determine marker color based on sexo
          const color = sexo === 'MUJER' ? COLORS.MUJER : COLORS.HOMBRE;

          // Create a marker for each record
          const marker = L.circleMarker([lat, lon], {
            color,
            radius: POINT_RADIUS,
            tipo_marcador: tipo_marcador
          }).bindPopup(`
            <b>Record ID: ${id}</b><br>
            Marker Type: ${tipo_marcador}<br>
            Disappearance Date: ${fecha_desaparicion}<br>
            Gender: ${sexo}<br>
            Age at Disappearance: ${edad_momento_desaparicion}<br>
            Location Condition: ${condicion_localizacion}<br>
            Disappearance Description: ${descripcion_desaparicion}
          `).addTo(map); // Add marker to map

          return marker;
        }
        return null;
      }).filter(marker => marker !== null); // Filter out any null markers

      if (fetchId > thresholdId) {
        updateMarkers(newMarkers, []); // Update markers with new markers
      } else {
        setMarkers(prevMarkers => [...prevMarkers, ...newMarkers]); // Append new markers to existing markers
      }

      setNewDataFetched(false); // Reset new data flag
    }
  }, [fetchedRecords, map, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS, fetchId, thresholdId, updateMarkers]);

  return null; // This component doesn't need to render anything directly
};

export default MarkersCedulas;