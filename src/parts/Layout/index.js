import React from 'react';

import SideBar from '../SideBar';
import styles from './styles';

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <SideBar />
      <main className="main-container">
        {children}
      </main>
      <style jsx="true">{ styles }</style>
    </div>
  )
};

export default Layout;
