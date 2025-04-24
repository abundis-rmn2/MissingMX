import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import '../styles/Notebook.css';
import { Button, IconButton, Heading, Box } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useNotebook } from '../utils/notebook';
import NotebookNotes from './NotebookNotes';
import NotebookLoad from './NotebookLoad';
// Este componente obtiene el estado global y funciones desde useData (contexto global).
// Pasa estos datos y funciones como props a GlobalTimeGraphData.jsx para depuración o visualización.
// No comunica directamente con GlobalTimeGraph.jsx, pero ambos usan el mismo contexto y utilidades.
import GlobalTimeGraphData from './GlobalTimeGraphData';

const Notebook = () => {
  const dataContext = useData(); // Obtiene el estado global y funciones
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    notes,
    newNote,
    isPanelOpen,
    isModalOpen,
    notebookList,
    setIsPanelOpen,
    setNewNote,
    addNote,
    addTextOnlyNote,
    saveNotesToBackend,
    loadNotesFromBackend,
    listNotebooks,
    deleteNote,
    restoreState,
    formatTimestamp,
    setIsModalOpen,
  } = useNotebook(dataContext, id, navigate);

  return (
    <>
      <Button
        variant="solid"
        style={{
          position: 'fixed',
          top: 80,
          right: 0,
          zIndex: 2000,
          borderRadius: '8px 0 0 8px',
          border: '1px solid #ccc',
          borderRight: 'none',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '8px 16px',
          transition: 'right 0.2s',
          right: isPanelOpen ? 380 : 0, // move button when panel is open
        }}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? 'Close Notebook' : 'Notebook'}
      </Button>

      {isPanelOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: 380,
            maxWidth: '90vw',
            background: '#fff',
            boxShadow: '-2px 0 12px rgba(0,0,0,0.12)',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid #eee',
            padding: 0,
            transition: 'right 0.2s',
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px 8px 20px',
              borderBottom: '1px solid #eee',
              background: '#fafbfc',
            }}
          >
            <Heading size="4">Notebook</Heading>
            <IconButton
              variant="ghost"
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close notebook"
            >
              <Cross2Icon />
            </IconButton>
          </Box>

          <Box style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            {/* 
              GlobalTimeGraphData recibe como props los datos y funciones globales 
              (map, COLORS, selectedDate, timeScale, setSelectedDate, setTimeScale, etc.)
              Esto permite que GlobalTimeGraphData acceda y muestre (por consola) la misma información
              que usa GlobalTimeGraph.jsx, pero sin renderizar el gráfico.
            */}
            <GlobalTimeGraphData
              map={dataContext.map}
              COLORS={dataContext.COLORS}
              selectedDate={dataContext.selectedDate}
              timeScale={dataContext.timeScale}
              setSelectedDate={dataContext.setSelectedDate}
              setTimeScale={dataContext.setTimeScale}
              newDataFetched={dataContext.newDataFetched}
              newForenseDataFetched={dataContext.newForenseDataFetched}
            />
            <NotebookNotes
              newNote={newNote}
              setNewNote={setNewNote}
              addNote={addNote}
              addTextOnlyNote={addTextOnlyNote}
            />
            <NotebookLoad
              saveNotesToBackend={saveNotesToBackend}
              loadNotesFromBackend={loadNotesFromBackend}
              listNotebooks={listNotebooks}
            />
            <Box>
              {notes.length === 0 ? (
                <Box color="gray" mb="2">No notes yet. Add one to get started!</Box>
              ) : (
                notes.map(note => (
                  <Box
                    key={note.id}
                    style={{
                      border: '1px solid #eee',
                      borderRadius: 6,
                      padding: 10,
                      marginBottom: 10,
                      background: '#fafbfc',
                    }}
                  >
                    <Box mb="1" style={{ whiteSpace: 'pre-wrap' }}>{note.text}</Box>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        color: '#888',
                      }}
                    >
                      <span>{formatTimestamp(note.timestamp)}</span>
                      <Box style={{ display: 'flex', gap: 6 }}>
                        {note.state && (
                          <Button
                            size="1"
                            variant="soft"
                            onClick={() => restoreState(note.state)}
                            title="Restore this state"
                          >
                            ⟲
                          </Button>
                        )}
                        <Button
                          size="1"
                          variant="ghost"
                          color="red"
                          onClick={() => deleteNote(note.id)}
                          title="Delete this note"
                        >
                          🗑️
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {isModalOpen && (
            <Box
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.18)',
                zIndex: 4000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                style={{
                  background: '#fff',
                  borderRadius: 8,
                  padding: 24,
                  minWidth: 320,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                }}
              >
                <Heading size="4" mb="3">Select a Notebook</Heading>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {notebookList.map((notebook) => (
                    <li key={notebook} style={{ marginBottom: 8 }}>
                      <a
                        href={`/dist/cuaderno/${notebook}`}
                        style={{
                          color: '#007bff',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                      >
                        {notebook}
                      </a>
                    </li>
                  ))}
                </ul>
                <Button mt="3" onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </div>
      )}
    </>
  );
};

export default Notebook;
