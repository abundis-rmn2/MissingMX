import React, { useState, useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useData } from '../context/DataContext';
import { useDateForm } from '../utils/dateForm';

const InitialModal = ({
  handleSubmit,
  fetchCedulas,
  setFetchCedulas,
  fetchForense,
  setFetchForense
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
            minWidth: 320,
            zIndex: 1001
          }}
        >
          <Dialog.Title style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>
            Select Date Range
          </Dialog.Title>
          <form onSubmit={handleFormSubmit} className="modal-form">
            <div className="form-content">
              <div className="date-inputs" style={{ marginBottom: 12 }}>
                <label>
                  Start Date:
                  <input
                    type="date"
                    value={localStartDate}
                    onChange={(e) => setLocalStartDate(e.target.value)}
                    required
                  />
                </label>
                <label>
                  End Date:
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
                  Fetch Cedulas
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={fetchForense}
                    onChange={(e) => setFetchForense(e.target.checked)}
                  />
                  Fetch Forense
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Loading...' : 'Fetch Data'}
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
