import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ScrollAnimations } from './utils/aos';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize scroll animations
ScrollAnimations.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <App />
      </AppProvider>
    </ErrorBoundary>
  </StrictMode>
);
