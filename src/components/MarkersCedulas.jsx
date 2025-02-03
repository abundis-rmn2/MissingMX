import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';

const MarkersCedulas = ({ map }) => {
  const { fetchedRecords, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS } = useData(); // Get the fetched records, current markers, setMarkers function, new data flag, COLORS, and POINT_RADIUS from context

  useEffect(() => {
    if (map && newDataFetched) {
      // Remove existing markers from the map
      markers.forEach(marker => {
        if (marker) {
          map.removeLayer(marker);
        }
      });

      // Create new markers from fetched records
      const newMarkers = fetchedRecords.map(record => {
        const { lat, lon, id, tipo_marcador, fecha_desaparicion, sexo, edad_momento_desaparicion, condicion_localizacion, descripcion_desaparicion } = record;

        if (lat && lon && tipo_marcador === 'cedula_busqueda') {
          // Determine marker color based on sexo
          const color = sexo === 'MUJER' ? COLORS.MUJER : COLORS.HOMBRE;

          // Create a marker for each record
            const marker = L.circleMarker([lat, lon], {
            id,
            tipo_marcador,
            fecha_desaparicion,
            sexo,
            edad_momento_desaparicion,
            condicion_localizacion,
            descripcion_desaparicion,
            color,
            radius: POINT_RADIUS
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

      setMarkers(newMarkers); // Update context with new markers
      setNewDataFetched(false); // Reset new data flag
    }
  }, [fetchedRecords, map, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS]);

  return null; // This component doesn't need to render anything directly
};

export default MarkersCedulas;