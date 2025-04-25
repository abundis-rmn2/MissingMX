import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import {
  useLayoutFormHandlers,
  useLayoutFormEffects,
  getEffectiveMapType,
  getEffectiveColorScheme
} from '../utils/layoutForm';

const LayoutForm = () => {
  const [localMapType, setLocalMapType] = useState('point');
  const [localColorScheme, setLocalColorScheme] = useState('sexo');
  const dataContext = useData();

  // Handlers and effects from utils
  const {
    handleMapTypeChange,
    handleColorSchemeChange
  } = useLayoutFormHandlers(dataContext, setLocalMapType, setLocalColorScheme);

  useLayoutFormEffects(dataContext);

  // Use helpers to get effective values
  const effectiveMapType = getEffectiveMapType(dataContext, localMapType);
  const effectiveColorScheme = getEffectiveColorScheme(dataContext, localColorScheme);

  return (
    <div>
      <fieldset>
        <legend>Tipo de visualización</legend>
        <label>
          <input
            type="radio"
            name="mapType"
            value="point"
            checked={effectiveMapType === 'point'}
            onChange={handleMapTypeChange}
          />
          Puntos
        </label>
        <label>
          <input
            type="radio"
            name="mapType"
            value="heatmap"
            checked={effectiveMapType === 'heatmap'}
            onChange={handleMapTypeChange}
          />
          Heatmap
        </label>
      </fieldset>

      <fieldset>
        <legend>Esquema de color</legend>
        <label>
          <input
            type="radio"
            name="colorScheme"
            value="sexo"
            checked={effectiveColorScheme === 'sexo'}
            onChange={handleColorSchemeChange}
          />
          Sexo
        </label>
        <label>
          <input
            type="radio"
            name="colorScheme"
            value="condicionLocalizacion"
            checked={effectiveColorScheme === 'condicionLocalizacion'}
            onChange={handleColorSchemeChange}
          />
          Condición de Localización
        </label>
      </fieldset>
    </div>
  );
};

export default LayoutForm;