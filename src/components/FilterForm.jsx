import React from 'react';
import { useData } from '../context/DataContext';
import {
  useFilterFormHandlers,
  useFilterFormEffects
} from '../utils/filterForm';

const FilterForm = () => {
  const dataContext = useData();

  // Obtén handlers y efectos desacoplados
  const {
    handleSexoChange,
    handleCondicionChange,
    handleEdadRangeChange,
    handleSumScoreRangeChange
  } = useFilterFormHandlers(dataContext);

  useFilterFormEffects(dataContext);

  // Desestructura los valores necesarios para renderizar
  const {
    selectedSexo,
    selectedCondicion,
    edadRange,
    sumScoreRange
  } = dataContext;

  // Renderizado puro, sin lógica de eventos ni estado local
  return (
    <div>
      {/* Filtros de Sexo */}
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

      {/* Filtros de Condición de Localización */}
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

      {/* Filtros de Edad */}
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
        <br />
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
        <hr />
        <div className='rangeLegend'>
          <span>Selected Age Range: {edadRange[0]} - {edadRange[1]}</span>
        </div>
      </fieldset>

      {/* Filtros de Score de Violencia */}
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
        <br />
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
        <hr />
        <div className='rangeLegend'>
          <span>Selected Score Range: {sumScoreRange[0]} - {sumScoreRange[1]}</span>
        </div>
      </fieldset>
    </div>
  );
};

export default FilterForm;