import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * The entry point for the React application.
 * Initializes the root element and renders the main App component.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/**
 * Performance Monitoring.
 * reportWebVitals can be used to log performance metrics or send them to an analytics endpoint.
 * By default, it runs silently.
 */
reportWebVitals();

