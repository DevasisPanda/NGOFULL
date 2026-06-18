import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const PageTransition: React.FC = () => {
  const location = useLocation();
  
  return (
    <div key={location.pathname} className="animate-page-enter w-full h-full flex-grow flex flex-col">
      <Outlet />
    </div>
  );
};

export default PageTransition;
