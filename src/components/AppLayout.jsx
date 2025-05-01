import React from 'react';
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
  isNotebookRoute
}) => {
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
      />
      <LeftSideBar />
      <SideNotebook
        handleSubmit={handleSubmit}
        loading={loading}
        fetchCedulas={fetchCedulas}
        setFetchCedulas={setFetchCedulas}
        fetchForense={fetchForense}
        setFetchForense={setFetchForense}
      />
      <BottomTimelinePanel />
    </div>
  );
};

export default AppLayout;
