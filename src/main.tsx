import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { applyTheme, getStoredTheme } from './services/theme';
import './styles/global.css';

// Applied here (before React renders) rather than only inside <ThemeToggle> so
// every page — including /login, which doesn't render the Header — starts in
// the user's last chosen theme instead of flashing dark before switching.
applyTheme(getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);