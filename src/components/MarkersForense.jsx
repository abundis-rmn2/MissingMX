import React, { useEffect } from 'react';
import { useData } from '../context/DataContext';
import maplibregl from 'maplibre-gl';

const MarkersForense = ({ map, fetchId, thresholdId }) => {
  const { forenseRecords, markers, setMarkers, updateMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS, fetchedRecords, 
          forenseMarkers, setForenseMarkers, setTimelineData, updateTimelineData} = useData();

  const MIN_DISTANCE = 0.0001;

  const adjustLatLon = (lat, lon, index) => {
    const angle = (index % 360) * (Math.PI / 180);
    const offset = MIN_DISTANCE * (index + 1);
    return {
      lat: lat + offset * Math.sin(angle),
      lon: lon + offset * Math.cos(angle)
    };
  };

  useEffect(() => {
    if (map && newForenseDataFetched) {
      const newTimelineEntries = [];
      const newForenseMarkers = forenseRecords.map((record, index) => {
        const { lat, lon, ID, Fecha_Ingreso, Probable_nombre, Edad, Tatuajes, Indumentarias, Senas_Particulares, Delegacion_IJCF, tipo_marcador } = record;

        if (lat && lon && tipo_marcador === 'personas_sin_identificar') {
          const adjustedCoords = adjustLatLon(lat, lon, index);

          const marker = new maplibregl.Marker({ color: COLORS.UNKNOWN })
            .setLngLat([adjustedCoords.lon, adjustedCoords.lat])
            .setPopup(new maplibregl.Popup().setHTML(`
              <b>Record ID: ${ID}</b><br>
              Ingress Date: ${Fecha_Ingreso}<br>
              Probable Name: ${Probable_nombre}<br>
              Age: ${Edad}<br>
              Tattoos: ${Tatuajes}<br>
              Clothing: ${Indumentarias}<br>
              Distinctive Signs: ${Senas_Particulares}<br>
              Delegation: ${Delegacion_IJCF}<br>
              Type: ${tipo_marcador}
            `))
            .addTo(map);
            marker.getElement().setAttribute('data-tipo-marcador', tipo_marcador);
            marker.getElement().setAttribute('data-timestamp', new Date(Fecha_Ingreso).getTime());
            console.log('Marker:', marker.getElement().dataset);
            //setTimelineData(marker.getElement().dataset);
            newTimelineEntries.push({ id: ID, timestamp: new Date(Fecha_Ingreso).getTime(), type: 'forense' });
          return marker;
        }
        return null;
      }).filter(marker => marker !== null);

      updateMarkers(forenseMarkers, newForenseMarkers, setForenseMarkers);
      updateTimelineData(newTimelineEntries, true);
      setNewForenseDataFetched(false);
    }
  }, [forenseRecords, map, markers, setMarkers, newForenseDataFetched, setNewForenseDataFetched, COLORS, POINT_RADIUS, fetchId, thresholdId, updateMarkers]);

  return null;
};

export default MarkersForense;