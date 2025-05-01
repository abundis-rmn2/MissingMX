import React, { useEffect } from 'react';
import InitialModal from './InitialModal';
import LeftSideBar from './LeftSideBar';
import HeaderCompact from './HeaderCompact';
import SideNotebook from './SideNotebook';
import PasswordCheck from './PasswordCheck';

const AppLayout = ({
  isAuthenticated,
  setIsAuthenticated,
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
      {!isAuthenticated ? (
        <PasswordCheck onAuthenticated={() => setIsAuthenticated(true)} />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default AppLayout;
