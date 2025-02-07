import React, { useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';

const FilterForm = () => {
  const {
    map,
    setActiveHeatmapCategories,
    selectedDate,
    daysRange,
    filterMarkersByDate,
    selectedSexo,
    setSelectedSexo,
    selectedCondicion,
    setSelectedCondicion,
    edadRange,
    setEdadRange
  } = useData();

  // Track whether filters have been initialized after the time slider
  const filtersInitialized = useRef(false);

  useEffect(() => {
    if (selectedDate && daysRange !== undefined) {
      if (!filtersInitialized.current) {
        console.log('Initializing filters after time slider is set...');
        filtersInitialized.current = true;
      }
      applyFilters();
    }
  }, [selectedSexo, selectedCondicion, edadRange, selectedDate, daysRange, map]);

  const applyFilters = () => {
    if (!map || !filtersInitialized.current) return;

    console.log('Applying filters...');
    filterMarkersByDate(selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange);
  };

  const handleSexoChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSexo((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((item) => item !== value);
      console.log(`Sexo filter updated: ${updated}`);
      return updated;
    });
  };

  const handleCondicionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCondicion((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((item) => item !== value);
      console.log(`Condición filter updated: ${updated}`);
      return updated;
    });
  };

  const handleEdadRangeChange = (e) => {
    const { value, name } = e.target;
    setEdadRange((prev) => {
      const updated = name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)];
      console.log(`Edad range updated: ${updated}`);
      return updated;
    });
  };

  return (
    <div style={{ padding: '10px', background: 'white', borderRadius: '8px', marginBottom: '10px' }}>
      <fieldset>
        <legend>Sexo</legend>
        <label>
          <input
            type="checkbox"
            value="HOMBRE"
            checked={selectedSexo.includes('HOMBRE')}
            onChange={handleSexoChange}
          />
          Hombre
        </label>
        <label>
          <input
            type="checkbox"
            value="MUJER"
            checked={selectedSexo.includes('MUJER')}
            onChange={handleSexoChange}
          />
          Mujer
        </label>
      </fieldset>

      <fieldset>
        <legend>Condición de Localización</legend>
        <label>
          <input
            type="checkbox"
            value="CON VIDA"
            checked={selectedCondicion.includes('CON VIDA')}
            onChange={handleCondicionChange}
          />
          Con Vida
        </label>
        <label>
          <input
            type="checkbox"
            value="SIN VIDA"
            checked={selectedCondicion.includes('SIN VIDA')}
            onChange={handleCondicionChange}
          />
          Sin Vida
        </label>
        <label>
          <input
            type="checkbox"
            value="NO APLICA"
            checked={selectedCondicion.includes('NO APLICA')}
            onChange={handleCondicionChange}
          />
          No Aplica
        </label>
      </fieldset>

      <fieldset>
  <legend>Edad de Desaparición</legend>
  <label>
    Min:
    <input
      type="range"
      name="min"
      value={edadRange[0]}
      onChange={handleEdadRangeChange}
      min="0"
      max={edadRange[1]}
    />
    <span>{edadRange[0]}</span>
  </label>
  <label>
    Max:
    <input
      type="range"
      name="max"
      value={edadRange[1]}
      onChange={handleEdadRangeChange}
      min={edadRange[0]}
      max="100"
    />
    <span>{edadRange[1]}</span>
  </label>
</fieldset>
    </div>
  );
};

export default FilterForm;