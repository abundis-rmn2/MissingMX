import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { useData } from '../context/DataContext';
import '../styles/Notebook.css'; // Import the CSS styles

const Notebook = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal state
  const [notebookList, setNotebookList] = useState([]); // Store the list of notebooks

  const { id } = useParams(); // Get the 'id' parameter from the URL
  const navigate = useNavigate(); // Use navigate to update the URL

  const {
    selectedDate,
    daysRange,
    selectedSexo,
    setSelectedSexo,
    selectedCondicion,
    setSelectedCondicion,
    edadRange,
    setEdadRange,
    sumScoreRange,
    setsumScoreRange,
    timeScale,
    setTimeScale,
    map,
    setSelectedDate,
    setDaysRange,
    mapType,
    setMapType,
    colorScheme,
    setColorScheme,
    visibleComponents,
    setVisibleComponents
  } = useData();

  useEffect(() => {
    console.log('Notebook received from context:', {
      visibleComponents,
      setVisibleComponents: typeof setVisibleComponents === 'function' ? 'function' : typeof setVisibleComponents
    });
  }, [visibleComponents, setVisibleComponents]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('datades-notebook');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error('Error loading notes from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('datades-notebook', JSON.stringify(notes));
  }, [notes]);

  const captureCurrentState = () => {
    console.log('Capturing current state, visibleComponents:', visibleComponents);
    
    const timestamp = new Date().toISOString();
    
    const mapState = map ? {
      center: map.getCenter(),
      zoom: map.getZoom()
    } : null;
    
    const stateSnapshot = {
      timestamp,
      state: {
        selectedDate: selectedDate ? selectedDate.toISOString() : null,
        daysRange,
        selectedSexo: [...selectedSexo],
        selectedCondicion: [...selectedCondicion],
        edadRange: [...edadRange],
        sumScoreRange: [...sumScoreRange],
        timeScale,
        mapState,
        mapType,
        colorScheme,
        visibleComponents: visibleComponents ? { ...visibleComponents } : null
      }
    };
    
    console.log('Created state snapshot:', stateSnapshot);
    return stateSnapshot;
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const stateSnapshot = captureCurrentState();
    
    const newNoteEntry = {
      id: Date.now(),
      text: newNote,
      ...stateSnapshot
    };
    
    setNotes([newNoteEntry, ...notes]);
    setNewNote('');
  };

  const addTextOnlyNote = () => {
    if (!newNote.trim()) return;
    
    const newNoteEntry = {
      id: Date.now(),
      text: newNote,
      timestamp: new Date().toISOString(),
      state: null
    };
    
    setNotes([newNoteEntry, ...notes]);
    setNewNote('');
  };

  const restoreState = (savedState) => {
    if (!savedState) return;
    
    console.log('Restoring state:', savedState);
    
    if (savedState.selectedDate) {
      setSelectedDate(new Date(savedState.selectedDate));
    }
    setDaysRange(savedState.daysRange);
    
    setSelectedSexo(savedState.selectedSexo);
    setSelectedCondicion(savedState.selectedCondicion);
    setEdadRange(savedState.edadRange);
    setsumScoreRange(savedState.sumScoreRange);
    setTimeScale(savedState.timeScale);
    
    if (savedState.mapType) {
      setMapType(savedState.mapType);
    }
    if (savedState.colorScheme) {
      setColorScheme(savedState.colorScheme);
    }
    
    if (savedState.visibleComponents && typeof setVisibleComponents === 'function') {
      console.log('Restoring visibleComponents:', savedState.visibleComponents);
      setVisibleComponents(savedState.visibleComponents);
    } else {
      console.error('Cannot restore visibleComponents:', {
        saved: savedState.visibleComponents,
        setter: typeof setVisibleComponents
      });
    }
    
    if (savedState.mapState && map) {
      map.flyTo({
        center: [savedState.mapState.center.lng, savedState.mapState.center.lat],
        zoom: savedState.mapState.zoom
      });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const saveNotesToBackend = async () => {
    try {
      const name = prompt('Enter a name for the notebook:');
      if (!name) {
        alert('Notebook name is required to save.');
        return;
      }

      alert('Saving notes to the backend...');
      const response = await fetch(`https://datades.abundis.com.mx/api/save.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes, name }),
      });
      if (!response.ok) {
        throw new Error('Failed to save notes to backend');
      }
      alert('Notes saved successfully!');
    } catch (error) {
      alert('Error saving notes to backend.');
      console.error('Error saving notes to backend:', error);
    }
  };

  const loadNotesFromBackend = async (notebookId) => {
    try {
      const response = await fetch(`https://datades.abundis.com.mx/api/load.php?id=${notebookId}`);
      if (!response.ok) {
        throw new Error('Failed to load notes from backend');
      }
      const data = await response.json();
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Error loading notes from backend:', error);
    }
  };

  const listNotebooks = async () => {
    try {
      const response = await fetch(`https://datades.abundis.com.mx/api/list.php`);
      if (!response.ok) {
        throw new Error('Failed to fetch notebooks');
      }
      const data = await response.json();
      if (data.success) {
        setNotebookList(data.notebooks);
        setIsModalOpen(true);
      } else {
        alert('No notebooks found.');
      }
    } catch (error) {
      alert('Error fetching notebooks.');
      console.error('Error fetching notebooks:', error);
    }
  };

  const selectNotebook = (notebook) => {
    setIsModalOpen(false);
    navigate(`/notebook/${notebook}`);
  };

  useEffect(() => {
    if (id) {
      loadNotesFromBackend(id);
    }
  }, [id]);

  return (
    <div className={`notebook ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {isExpanded && (
        <div className="notebook-content">
          <div className="notebook-input">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
            />
            <div className="notebook-buttons">
              <button onClick={addNote}>Note + State</button>
              <button onClick={addTextOnlyNote}>Note</button>
              <button onClick={saveNotesToBackend}>Save to Backend</button>
              <button onClick={() => loadNotesFromBackend(prompt('Enter Notebook ID:'))}>
                Load from Backend
              </button>
              <button onClick={listNotebooks}>List Notebooks</button>
            </div>
          </div>
          
          <div className="notebook-entries">
            {notes.length === 0 ? (
              <p className="no-notes">No notes yet. Add one to get started!</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="notebook-entry">
                  <div className="note-text">{note.text}</div>
                  <div className="note-meta">
                    <span className="note-timestamp">
                      {formatTimestamp(note.timestamp)}
                    </span>
                    <div className="note-actions">
                      {note.state && (
                        <button 
                          className="restore-button"
                          onClick={() => restoreState(note.state)}
                          title="Restore this state"
                        >
                          ⟲ Restore
                        </button>
                      )}
                      <button 
                        className="delete-button"
                        onClick={() => deleteNote(note.id)}
                        title="Delete this note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
      <div className="notebook-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Notebook {isExpanded ? '▼' : '▲'}</h3>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Select a Notebook</h3>
            <ul>
              {notebookList.map((notebook) => (
                <li key={notebook}>
                  <button onClick={() => selectNotebook(notebook)}>{notebook}</button>
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notebook;
