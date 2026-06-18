import React from 'react';
//import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </AuthProvider>
  </React.StrictMode>
)
