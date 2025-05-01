import React, { useState } from 'react';
import InitialModal from './InitialModal';
import LeftSideBar from './LeftSideBar';
import HeaderCompact from './HeaderCompact';
import SideNotebook from './SideNotebook';
import BottomTimelinePanel from './BottomTimelinePanel';

const AppLayout = ({
  visibleComponents,
  toggleComponent,
  handleSubmit,
  loading,
  fetchCedulas,
  setFetchCedulas,
  fetchForense,
  setFetchForense,
  isNotebookRoute,
  listNotebooksApp
}) => {
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelHover = (panelName) => {
    setActivePanel(panelName);
  };

  const getPanelStyle = (panelName) => ({
    zIndex: activePanel === panelName ? 10 : 1
  });

  return (
    <div className="panel">
      <HeaderCompact 
        visibleComponents={visibleComponents}
        toggleComponent={toggleComponent}
      />
      <InitialModal
        isNotebookRoute={isNotebookRoute}
        handleSubmit={handleSubmit}
        loading={loading}
        fetchCedulas={fetchCedulas}
        setFetchCedulas={setFetchCedulas}
        fetchForense={fetchForense}
        setFetchForense={setFetchForense}
        listNotebooksApp={listNotebooksApp}
      />
      <LeftSideBar 
        onMouseEnter={() => handlePanelHover('leftSidebar')}
        onMouseLeave={() => handlePanelHover(null)}
        style={getPanelStyle('leftSidebar')}
      />
      <SideNotebook
        handleSubmit={handleSubmit}
        loading={loading}
        fetchCedulas={fetchCedulas}
        setFetchCedulas={setFetchCedulas}
        fetchForense={fetchForense}
        setFetchForense={setFetchForense}
        onMouseEnter={() => handlePanelHover('sideNotebook')}
        onMouseLeave={() => handlePanelHover(null)}
        style={getPanelStyle('sideNotebook')}
      />
      <BottomTimelinePanel 
        onMouseEnter={() => handlePanelHover('bottomTimeline')}
        onMouseLeave={() => handlePanelHover(null)}
        style={getPanelStyle('bottomTimeline')}
      />
    </div>
  );
};

export default AppLayout;
