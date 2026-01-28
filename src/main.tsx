import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Handle extension message listener to prevent "message channel closed" errors
if (typeof window !== 'undefined') {
  window.addEventListener('message', (event) => {
    try {
      // If a message includes a MessagePort, acknowledge it immediately.
      // This helps extensions/content-scripts that expect a response
      // and prevents "message channel closed" errors in the console.
      if (event.ports && event.ports.length > 0) {
        try {
          event.ports[0].postMessage({ received: true });
        } catch (e) {
          // ignore port post errors
        }

        // avoid allowing other page listeners to interfere
        if (typeof event.stopImmediatePropagation === 'function') {
          event.stopImmediatePropagation();
        }
      }
    } catch (error) {
      console.error('Error handling extension message:', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
