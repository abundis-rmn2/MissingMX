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
    setEdadRange,
    sumScoreRange,
    setsumScoreRange,
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
  }, [selectedSexo, selectedCondicion, edadRange, sumScoreRange, selectedDate, daysRange, map]);

  const applyFilters = () => {
    if (!map || !filtersInitialized.current) return;

    console.log('Applying filters with the following parameters:', {
      selectedDate,
      daysRange,
      selectedSexo,
      selectedCondicion,
      edadRange,
      sumScoreRange,
    });
    filterMarkersByDate(selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange);
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

  const handleSumScoreRangeChange = (e) => {
    const { value, name } = e.target;
    setsumScoreRange((prev) => {
      const updated = name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)];
      console.log(`Sum Score range updated: ${updated}`);
      return updated;
    });
  };

  return (
    <div >
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
    Min: 0
    <input
      type="range"
      name="min"
      value={edadRange[0]}
      onChange={handleEdadRangeChange}
      min="0"
      max={edadRange[1]}
    />
  </label>
  <br></br>
  <label>
    Max: 100
    <input
      type="range"
      name="max"
      value={edadRange[1]}
      onChange={handleEdadRangeChange}
      min={edadRange[0]}
      max="100"
    />
  </label>
  <hr></hr>
  <div className='rangeLegend'>    <span>Selected Age Range: {edadRange[0]} - {edadRange[1]}</span></div>
</fieldset>

<fieldset>
  <legend>Score de Violencia</legend>
  <label>
   Min: 0.5
    <input
      type="range"
      name="min"
      value={sumScoreRange[0]}
      onChange={handleSumScoreRangeChange}
      min="0.5"
      max={sumScoreRange[1]}
    />
  </label>
  <br></br>
  <label>
    Max: 20
    <input
      type="range"
      name="max"
      value={sumScoreRange[1]}
      onChange={handleSumScoreRangeChange}
      min={sumScoreRange[0]}
      max="20"
    />
  </label>
  <hr></hr>
  <div className='rangeLegend'>    <span>Selected Score Range: {sumScoreRange[0]} - {sumScoreRange[1]}</span></div>
</fieldset>
    </div>
  );
};

export default FilterForm;