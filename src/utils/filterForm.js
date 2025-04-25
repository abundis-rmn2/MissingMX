import { useEffect, useRef } from 'react';

// Handlers desacoplados para los filtros
export function useFilterFormHandlers(dataContext) {
  // Desestructura setters del contexto
  const {
    setSelectedSexo,
    setSelectedCondicion,
    setEdadRange,
    setsumScoreRange
  } = dataContext;

  // Handler para filtro de sexo
  const handleSexoChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSexo((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((item) => item !== value);
      console.log(`[FilterForm] Sexo filter updated:`, updated);
      return updated;
    });
  };

  // Handler para filtro de condición
  const handleCondicionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCondicion((prev) => {
      const updated = checked ? [...prev, value] : prev.filter((item) => item !== value);
      console.log(`[FilterForm] Condición filter updated:`, updated);
      return updated;
    });
  };

  // Handler para rango de edad
  const handleEdadRangeChange = (e) => {
    const { value, name } = e.target;
    setEdadRange((prev) => {
      const updated = name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)];
      console.log(`[FilterForm] Edad range updated:`, updated);
      return updated;
    });
  };

  // Handler para rango de score
  const handleSumScoreRangeChange = (e) => {
    const { value, name } = e.target;
    setsumScoreRange((prev) => {
      const updated = name === 'min' ? [Number(value), prev[1]] : [prev[0], Number(value)];
      console.log(`[FilterForm] Sum Score range updated:`, updated);
      return updated;
    });
  };

  return {
    handleSexoChange,
    handleCondicionChange,
    handleEdadRangeChange,
    handleSumScoreRangeChange
  };
}

// Efectos y lógica de aplicación de filtros
export function useFilterFormEffects(dataContext) {
  const filtersInitialized = useRef(false);

  useEffect(() => {
    const {
      map,
      selectedDate,
      daysRange,
      selectedSexo,
      selectedCondicion,
      edadRange,
      sumScoreRange,
      filterMarkersByDate
    } = dataContext;

    // Inicialización de filtros después del slider de tiempo
    if (selectedDate && daysRange !== undefined) {
      if (!filtersInitialized.current) {
        console.log('[FilterForm] Initializing filters after time slider is set...');
        filtersInitialized.current = true;
      }
      applyFilters();
    }

    // Aplica los filtros al mapa
    function applyFilters() {
      if (!map || !filtersInitialized.current) return;
      console.log('[FilterForm] Applying filters with:', {
        selectedDate,
        daysRange,
        selectedSexo,
        selectedCondicion,
        edadRange,
        sumScoreRange,
      });
      filterMarkersByDate(selectedDate, daysRange, selectedSexo, selectedCondicion, edadRange, sumScoreRange);
    }
    // eslint-disable-next-line
  }, [
    dataContext.selectedSexo,
    dataContext.selectedCondicion,
    dataContext.edadRange,
    dataContext.sumScoreRange,
    dataContext.selectedDate,
    dataContext.daysRange,
    dataContext.map
  ]);
}
