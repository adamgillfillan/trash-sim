import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const STORAGE_KEY = 'trash-sim-theme';
const FALLBACK_THEME = 'tablefelt';

(function ensureThemePreset() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const theme = stored ?? FALLBACK_THEME;
    document.documentElement.setAttribute('data-theme', theme);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch (error) {
    document.documentElement.setAttribute('data-theme', FALLBACK_THEME);
  }
})();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

