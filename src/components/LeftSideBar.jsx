import React from 'react';
import FilterForm from './FilterForm';
import FilteredStats from './FilteredStats';
import { useData } from '../context/DataContext';

const LeftSideBar = () => {
  const { visibleComponents } = useData();

  return (
    <div 
      style={{
        position: 'absolute',
        left: 0,
        top: 100,
        width: '300px',
        background: 'white',
        padding: '16px',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        zIndex: 98,
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto'
      }}
    >
      {visibleComponents.filterForm && <FilterForm />}
      {visibleComponents.currentState && <FilteredStats />}
    </div>
  );
};

export default LeftSideBar;
