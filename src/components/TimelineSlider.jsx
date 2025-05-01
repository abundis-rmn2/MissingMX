import React, { useEffect } from 'react';
import { useTimelineSlider } from '../utils/timeLineSlider';
import { useData } from '../context/DataContext';
import { ArrowLeft, ArrowRight, Play, Pause, Turtle, Rabbit, ArrowRightCircle, Square } from 'lucide-react';

const TimelineSlider = () => {
  const { timelinePanelOpen } = useData();
  const {
    isPlaying,
    selectedDate,
    minDate,
    maxDate,
    velocity,
    setVelocity,
    stepBackward,
    stepForward,
    togglePlayPause,
    handleDateChange,
    timelineData,
    daysRange,
  } = useTimelineSlider();

  // Add this useEffect to handle initial date selection
  useEffect(() => {
    if (timelineData && timelineData.length > 0 && !selectedDate && minDate) {
      console.log('TimelineSlider: Setting initial date to:', minDate);
      handleDateChange(minDate);
    }
  }, [timelineData, minDate, selectedDate, handleDateChange]);

  const formatDateToSpanish = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!Array.isArray(timelineData) || timelineData.length === 0) {
    return <p>Loading timeline...</p>;
  }

  if (!minDate || !maxDate) return <p>No data available</p>;

  return (
    <div
      style={{
        display: timelinePanelOpen ? "block" : "none",
        padding: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div>
        <span
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: "10px",
            color: "#666",
            fontSize: "0.9em",
            display: timelinePanelOpen ? "none" : "block",
          }}
        >
          {selectedDate ? (
            <>
              {formatDateToSpanish(selectedDate)}
              <br />
              <small style={{ color: "#999" }}>Rango de {daysRange} días</small>
            </>
          ) : (
            "Selecciona una fecha"
          )}
        </span>
        <div
          className="timelinebuttons"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "space-evenly",
          }}
        >
          <button
            onClick={() => stepBackward(daysRange)}
            style={{
              background: "#007bff",
              border: "none",
              cursor: "pointer",
              color: "white",
              borderRadius: "5px",
              padding: "8px",
            }}
            title={`Retroceder:
- Días de rango: ${daysRange}
- Rango de selección: ${
              selectedDate
                ? new Date(selectedDate.getTime() - daysRange * 86400000)
                    .toISOString()
                    .slice(0, 10)
                : ""
            } a ${selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}`}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={togglePlayPause}
            style={{
              background: "#007bff",
              border: "none",
              cursor: "pointer",
              color: "white",
              borderRadius: "5px",
              padding: "8px",
            }}
            title={`Resumen:
- Días de rango: ${daysRange}
- Velocidad: ${velocity}ms
- Fecha de inicio: ${
              selectedDate ? selectedDate.toISOString().slice(0, 10) : ""
            }
- Rango de selección: ${
              selectedDate ? selectedDate.toISOString().slice(0, 10) : ""
            } a ${
              selectedDate
                ? new Date(selectedDate.getTime() + daysRange * 86400000)
                    .toISOString()
                    .slice(0, 10)
                : ""
            }`}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={() => stepForward(daysRange)}
            style={{
              background: "#007bff",
              border: "none",
              cursor: "pointer",
              color: "white",
              borderRadius: "5px",
              padding: "8px",
            }}
            title={`Avanzar:
- Días de rango: ${daysRange}
- Rango de selección: ${
              selectedDate ? selectedDate.toISOString().slice(0, 10) : ""
            } a ${
              selectedDate
                ? new Date(selectedDate.getTime() + daysRange * 86400000)
                    .toISOString()
                    .slice(0, 10)
                : ""
            }`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <div className="rangeTime" style={{ display: "flex", alignItems: "center", gap: "5px", }}>
          <ArrowRightCircle
            size={20}
            title={minDate ? minDate.toISOString().slice(0, 10) : ""}
          />
          <input
            type="range"
            min={minDate.getTime()}
            max={maxDate.getTime()}
            value={selectedDate ? selectedDate.getTime() : minDate.getTime()}
            onChange={(e) => handleDateChange(new Date(Number(e.target.value)))}
            style={{ width: 150 }}
          />
          <Square
            size={20}
            title={maxDate ? maxDate.toISOString().slice(0, 10) : ""}
          />
        </div>
        <div className="rangeSpeed" style={{  alignItems: "center", gap: "5px", display: timelinePanelOpen ? "flex"  : "none"  }}>
          <Rabbit size={20} title="Velocidad mínima: 2000ms" />
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            style={{ width: 150 }}
          />
          <Turtle size={20} title="Velocidad máxima: 100ms" />
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;