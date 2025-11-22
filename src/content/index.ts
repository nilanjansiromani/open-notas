// Content Script - Listens for keyboard shortcut and injects overlay

// Listen for Ctrl+Shift+N keyboard shortcut
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.ctrlKey && event.shiftKey && event.code === 'KeyN') {
    event.preventDefault();
    toggleOverlay();
  }
});

function toggleOverlay() {
  let overlay = document.getElementById('open-notas-overlay');
  
  if (overlay) {
    // If overlay exists, remove it (toggle off)
    const parent = overlay.parentNode;
    if (parent) {
      parent.removeChild(overlay);
    }
  } else {
    // Create and inject overlay
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'open-notas-overlay';
    overlayContainer.style.cssText = `
      position: fixed;
      right: 0;
      top: 0;
      width: 30%;
      height: 100%;
      background: white;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 999999;
      border-left: 1px solid #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(overlayContainer);
    
    // Load and inject the overlay UI
    const script = document.createElement('script');
    script.src = (window as any).chrome.runtime.getURL('overlay.js');
    script.addEventListener('load', function() {
      const parent = script.parentNode;
      if (parent) {
        parent.removeChild(script);
      }
    });
    (document.head || document.documentElement).appendChild(script);
    
    // Load styles
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = (window as any).chrome.runtime.getURL('overlay.css');
    document.head.appendChild(link);
  }
}
