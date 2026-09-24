import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { UserProvider } from './context/User';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StatusProvider } from './context/Status';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StatusProvider>
      <UserProvider>
        <BrowserRouter>
          <a href='#main-content' className='muxi-skip-link'>
            跳转到主要内容
          </a>
          <AppLayout />
          <ToastContainer
            toastClassName='muxi-toast'
            progressClassName='muxi-toast-progress'
          />
        </BrowserRouter>
      </UserProvider>
    </StatusProvider>
  </React.StrictMode>
);
