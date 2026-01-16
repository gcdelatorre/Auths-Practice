import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* The BrowserRouter provides routing functionality to the entire app. */}
    <BrowserRouter>
      {/* 
        The AuthProvider wraps the App. This is a key part of the context pattern.
        It makes the authentication state (like whether a user is logged in)
        and functions (like login and logout) available to any component
        deep inside the App component tree that needs it, without having to
        pass props down manually through every level.
      */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);