// Critical: Polyfill process for browser environments before importing anything else
if (typeof window !== 'undefined') {
  (window as any).process = { env: { API_KEY: (window as any).process?.env?.API_KEY || '' } };
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Critical Failure: Root container not found.");
}