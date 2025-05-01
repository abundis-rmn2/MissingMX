import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const HeaderCompact = ({ visibleComponents, toggleComponent }) => {
  const { id } = useParams();
  const location = useLocation();
  const currentTimestamp = Date.now();

  useEffect(() => {
    console.log('HeaderCompact - Current location:', location);
    console.log('HeaderCompact - Route params:', { id });
    console.log('HeaderCompact - Full pathname:', location.pathname);
    console.log('HeaderCompact - Route match:', location.pathname.includes("/cuaderno/"));
  }, [location, id]);

  return (
    <div className="HeaderCompact">
      <div className="header-info">
        {location.pathname.includes("/cuaderno/") ? (
          <span className="notebook-id">Cuaderno ID: {id || 'no-id'}</span>
        ) : (
          <span className="timestamp">{currentTimestamp}</span>
        )}
      </div>
      <div className="toggle-controls">
        {Object.entries(visibleComponents).map(([key, value]) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={value}
              onChange={() => toggleComponent(key)}
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
    </div>
  );
};

export default HeaderCompact;
