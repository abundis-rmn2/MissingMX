import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';

const MarkersCedulas = ({ map, fetchId, thresholdId }) => {
  const { fetchedRecords, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS, updateMarkers, forenseRecords, cedulaMarkers,
          setCedulaMarkers, setTimelineData, updateTimelineData} = useData();

  useEffect(() => {
    if (map && newDataFetched) {
      const newTimelineEntries = [];
      const newCedulaMarkers = fetchedRecords.map(record => {
        const { lat, lon, id, tipo_marcador, fecha_desaparicion, sexo, edad_momento_desaparicion, condicion_localizacion, descripcion_desaparicion } = record;

        if (lat && lon && tipo_marcador === 'cedula_busqueda') {
          const color = sexo === 'MUJER' ? COLORS.MUJER : COLORS.HOMBRE;

            const marker = new maplibregl.Marker({ color })
            .setLngLat([lon, lat])
            .setPopup(new maplibregl.Popup().setHTML(`
              <b>Record ID: ${id}</b><br>
              Marker Type: ${tipo_marcador}<br>
              Disappearance Date: ${fecha_desaparicion}<br>
              Gender: ${sexo}<br>
              Age at Disappearance: ${edad_momento_desaparicion}<br>
              Location Condition: ${condicion_localizacion}<br>
              Disappearance Description: ${descripcion_desaparicion}
            `))
            .addTo(map);
            marker.getElement().setAttribute('data-tipo-marcador', tipo_marcador);
            marker.getElement().setAttribute('data-timestamp', new Date(fecha_desaparicion).getTime());
            console.log('Marker:', marker.getElement().dataset);
            newTimelineEntries.push({ id, timestamp: new Date(fecha_desaparicion).getTime(), type: 'cedula' });
            return marker;
        }
        return null;
      }).filter(marker => marker !== null);


      updateMarkers(cedulaMarkers, newCedulaMarkers, setCedulaMarkers);
      updateTimelineData(newTimelineEntries, true); // ✅ Reset timeline per fetch

      setNewDataFetched(false);
    }
  }, [fetchedRecords, map, markers, setMarkers, newDataFetched, setNewDataFetched, COLORS, POINT_RADIUS, fetchId, thresholdId, updateMarkers]);

  return null;
};

export default MarkersCedulas;