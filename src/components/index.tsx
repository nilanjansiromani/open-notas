// Overlay entry point - mounts React app to the overlay container
import React from 'react';
import { createRoot } from 'react-dom/client';
import NoteOverlay from './Overlay';

// Wait for the overlay container to be available
const waitForElement = (selector: string, callback: () => void, timeout = 1000) => {
  const startTime = Date.now();
  const checkElement = () => {
    const element = document.querySelector(selector);
    if (element) {
      callback();
    } else if (Date.now() - startTime < timeout) {
      requestAnimationFrame(checkElement);
    }
  };
  checkElement();
};

waitForElement('#open-notas-overlay', () => {
  const container = document.getElementById('open-notas-overlay');
  if (container) {
    const root = createRoot(container);
    root.render(<NoteOverlay />);
  }
});
