import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerServiceWorker, initializePWAInstall } from './utils/pwa.js'

// Register service worker for PWA functionality
registerServiceWorker();

// Initialize PWA install prompt handling
initializePWAInstall();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
