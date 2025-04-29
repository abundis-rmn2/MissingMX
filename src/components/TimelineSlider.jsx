import React from 'react';
import { useTimelineSlider } from '../utils/timeLineSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPlay, faPause, faPersonWalking, faPersonRunning, faFlag, faFlagCheckered, faCircleDot, faCircleCheck, faArrowCircleRight, faStop } from '@fortawesome/free-solid-svg-icons';

const TimelineSlider = () => {
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

  if (!Array.isArray(timelineData) || timelineData.length === 0) {
    return <p>Loading timeline...</p>;
  }

  if (!minDate || !maxDate) return <p>No data available</p>;

  return (
    <div
      style={{
        padding: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div>
        <div
          className="timelinebuttons"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
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
                ? new Date(selectedDate.getTime() - daysRange * 86400000).toISOString().slice(0, 10)
                : ""
            } a ${
              selectedDate
                ? selectedDate.toISOString().slice(0, 10)
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
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
- Fecha de inicio: ${selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
- Rango de selección: ${selectedDate ? selectedDate.toISOString().slice(0, 10) : ""} a ${selectedDate ? new Date(selectedDate.getTime() + daysRange * 86400000).toISOString().slice(0, 10) : ""}`}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
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
              selectedDate
                ? selectedDate.toISOString().slice(0, 10)
                : ""
            } a ${
              selectedDate
                ? new Date(selectedDate.getTime() + daysRange * 86400000).toISOString().slice(0, 10)
                : ""
            }`}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
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
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FontAwesomeIcon
            icon={faArrowCircleRight}
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
          <FontAwesomeIcon
            icon={faStop}
            title={maxDate ? maxDate.toISOString().slice(0, 10) : ""}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <FontAwesomeIcon
            icon={faPersonWalking}
            title="Velocidad mínima: 2000ms"
          />
          <input
            type="range"
            min={100}
            max={2000}
            step={100}
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            style={{ width: 150 }}
          />
          <FontAwesomeIcon
            icon={faPersonRunning}
            title="Velocidad máxima: 100ms"
          />
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;