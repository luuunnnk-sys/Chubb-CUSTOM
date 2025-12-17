import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MainApp from './MainApp';  // ✅ On utilise MainApp et non App
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainApp />
  </StrictMode>
);
