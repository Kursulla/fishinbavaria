import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/theme.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './theme/ThemeContext';
import { AuthProvider } from './features/auth/context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
reportWebVitals();
