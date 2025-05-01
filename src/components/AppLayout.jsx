import React from 'react';
import InitialModal from './InitialModal';
import LeftSideBar from './LeftSideBar';
import HeaderCompact from './HeaderCompact';
import SideNotebook from './SideNotebook';

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
    <div className="App" id="app">
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
    </div>
  );
};

export default AppLayout;
