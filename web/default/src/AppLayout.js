import React from 'react';
import { useLocation } from 'react-router-dom';
import App from './App';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { CommandPalette } from './components/muxi';

const AUTH_PATHS = ['/login', '/register', '/reset', '/user/reset'];

const AppLayout = () => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  if (isAuthPage) {
    return (
      <>
        <App />
        <CommandPalette />
      </>
    );
  }

  return (
    <>
      <div className='muxi-app-shell'>
        <Sidebar />
        <main id='main-content' className='muxi-main'>
          <App />
          <Footer />
        </main>
      </div>
      <CommandPalette />
    </>
  );
};

export default AppLayout;
