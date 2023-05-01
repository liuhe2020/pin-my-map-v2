import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Home from './routes/home';
import { GlobalProvider } from './context/GlobalContext';
import { ToastContainer, Slide } from 'react-toastify';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GlobalProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position='bottom-left'
          autoClose={4000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          transition={Slide}
        />
      </GlobalProvider>
    </HelmetProvider>
  </React.StrictMode>
);
