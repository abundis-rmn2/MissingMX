import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useData } from '../context/DataContext';
import { useDateForm } from '../utils/dateForm';
import { MapPin, Download } from 'lucide-react';

const InitialModal = ({
  handleSubmit,
  fetchCedulas,
  setFetchCedulas,
  fetchForense,
  setFetchForense,
  isNotebookRoute
}) => {
  const { startDate, endDate, setStartDate, setEndDate, loading } = useData();
  const [open, setOpen] = useState(true);

  // Initialize local dates with context values or defaults
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  // Sync local state with context when context changes
  useEffect(() => {
    if (startDate) setLocalStartDate(startDate);
    if (endDate) setLocalEndDate(endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    console.log(`Estás en modo: ${isNotebookRoute ? 'Edición de cuaderno' : 'Nuevo cuaderno'}`);
  }, [isNotebookRoute]);

  const handleFormSubmit = useCallback(async (e) => {
    e.preventDefault();
    // Update context before submitting
    setStartDate(localStartDate);
    setEndDate(localEndDate);
    await handleSubmit(e);
    setOpen(false);
  }, [localStartDate, localEndDate, setStartDate, setEndDate, handleSubmit]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            background: 'rgba(0,0,0,0.15)',
            position: 'fixed',
            inset: 0,
            zIndex: 1000
          }}
        />
        <Dialog.Content
          style={{
            background: 'white',
            borderRadius: 8,
            boxShadow: '0 10px 38px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.2)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: 24,
            width: '100%',
            maxWidth: 700,
            zIndex: 1001
          }}
        >
          <Dialog.Title style={{ fontWeight: 600, fontSize: 22, marginBottom: 20 }}>
            {isNotebookRoute ? 'Navegación de Datos' : 'Nueva Exploración'}
          </Dialog.Title>
          
          <div style={{ marginBottom: 24, color: '#333', fontSize: '16px', lineHeight: '1.4' }}>
            {isNotebookRoute ? (
              <p>
                Para explorar este análisis existente, necesitará descargar los datos. 
                Una vez cargados, haga clic en el botón <MapPin size={16} style={{verticalAlign: 'middle'}}/> 
                <strong>"Bitácora de navegación"</strong> en el lateral derecho para visualizar el análisis completo.
              </p>
            ) : (
              <p>
                Inicie una nueva exploración de casos de personas desaparecidas seleccionando 
                un período de tiempo. Los datos se mostrarán en el mapa para su análisis detallado.
              </p>
            )}
          </div>

          <form onSubmit={handleFormSubmit} className="">
            <div className="">
              <div className="date-inputs" style={{ marginBottom: 12 }}>
                <label>
                  Fecha de inicio:
                  <input
                    type="date"
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Fecha final:
                  <input
                    type="date"
                    value={localEndDate}
                    onChange={(e) => setLocalEndDate(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div className="checkbox-group" style={{ marginBottom: 12 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={fetchCedulas}
                    onChange={(e) => setFetchCedulas(e.target.checked)}
                  />
                  Obtener Cédulas
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={fetchForense}
                    onChange={(e) => setFetchForense(e.target.checked)}
                  />
                  Obtener Forense
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '8px 16px'
                  }}
                >
                  <Download size={18} />
                  {loading ? 'Cargando...' : 'Obtener Datos'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default InitialModal;
