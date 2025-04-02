import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import '../styles/Notebook.css'; // Import the CSS styles

const Notebook = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get all necessary state from DataContext
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
    // Add layout settings
    mapType,
    setMapType,
    colorScheme,
    setColorScheme,
    // Add visibleComponents
    visibleComponents,
    setVisibleComponents
  } = useData();

  // For debugging - log the context values we receive
  useEffect(() => {
    console.log('Notebook received from context:', {
      visibleComponents,
      setVisibleComponents: typeof setVisibleComponents === 'function' ? 'function' : typeof setVisibleComponents
    });
  }, [visibleComponents, setVisibleComponents]);

  // Load saved notes from localStorage when component mounts
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

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('datades-notebook', JSON.stringify(notes));
  }, [notes]);

  const captureCurrentState = () => {
    console.log('Capturing current state, visibleComponents:', visibleComponents);
    
    // Create a timestamp
    const timestamp = new Date().toISOString();
    
    // Capture current map center and zoom if map exists
    const mapState = map ? {
      center: map.getCenter(),
      zoom: map.getZoom()
    } : null;
    
    // Create state snapshot
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
        // Add layout settings
        mapType,
        colorScheme,
        // Explicitly clone the visibleComponents object
        visibleComponents: visibleComponents ? { ...visibleComponents } : null
      }
    };
    
    console.log('Created state snapshot:', stateSnapshot);
    return stateSnapshot;
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const stateSnapshot = captureCurrentState();
    
    // Add new note with text and state
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
    
    // Add new note with text only, no state
    const newNoteEntry = {
      id: Date.now(),
      text: newNote,
      timestamp: new Date().toISOString(),
      state: null // explicitly set state to null to indicate no state was captured
    };
    
    setNotes([newNoteEntry, ...notes]);
    setNewNote('');
  };

  const restoreState = (savedState) => {
    if (!savedState) return;
    
    console.log('Restoring state:', savedState);
    
    // Restore date and range
    if (savedState.selectedDate) {
      setSelectedDate(new Date(savedState.selectedDate));
    }
    setDaysRange(savedState.daysRange);
    
    // Restore filters
    setSelectedSexo(savedState.selectedSexo);
    setSelectedCondicion(savedState.selectedCondicion);
    setEdadRange(savedState.edadRange);
    setsumScoreRange(savedState.sumScoreRange);
    setTimeScale(savedState.timeScale);
    
    // Restore layout settings
    if (savedState.mapType) {
      setMapType(savedState.mapType);
    }
    if (savedState.colorScheme) {
      setColorScheme(savedState.colorScheme);
    }
    
    // Restore component visibility with extra checks
    if (savedState.visibleComponents && typeof setVisibleComponents === 'function') {
      console.log('Restoring visibleComponents:', savedState.visibleComponents);
      setVisibleComponents(savedState.visibleComponents);
    } else {
      console.error('Cannot restore visibleComponents:', {
        saved: savedState.visibleComponents,
        setter: typeof setVisibleComponents
      });
    }
    
    // Restore map position if mapState and map exist
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
    </div>
  );
};

export default Notebook;
