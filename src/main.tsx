import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle dynamic module import failures (e.g. stale cache, dev server reload, build updates)
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Dynamic import chunk failed, reloading for latest assets...', event);
  const lastReload = sessionStorage.getItem('vite-preload-reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 8000) {
    sessionStorage.setItem('vite-preload-reload', String(now));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')!).render(<App />);

