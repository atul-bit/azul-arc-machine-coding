import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App';
import { EmployeeProvider } from './context/EmployeeContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <EmployeeProvider>
      <App />
    </EmployeeProvider>
  </React.StrictMode>
);