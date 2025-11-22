// Content Script - Listens for keyboard shortcut and injects overlay

let selectedText = '';
let selectedData: any = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleOverlay') {
    toggleOverlay();
  }
  
  if (request.action === 'addSelectedText') {
    selectedData = {
      text: request.selectedText,
      pageUrl: request.pageUrl,
      pageTitle: request.pageTitle,
    };
    showSelectionPopup(request.selectedText, request.pageUrl, request.pageTitle);
  }
});

// Listen for messages from overlay (postMessage)
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'GET_NOTES') {
    chrome.storage.local.get(['notes'], (result: any) => {
      window.postMessage({
        type: 'NOTES_DATA',
        notes: result.notes || [],
      }, '*');
    });
  }
  
  if (event.data.type === 'SAVE_NOTES') {
    chrome.storage.local.set({ notes: event.data.notes }, () => {
      console.log('Notes saved from overlay');
    });
  }
});

// Create floating button
function createFloatingButton() {
  if (document.getElementById('open-notas-float-btn')) {
    return; // Already exists
  }

  const floatingBtn = document.createElement('button');
  floatingBtn.id = 'open-notas-float-btn';
  floatingBtn.innerHTML = '📝';
  floatingBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 28px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999998;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  floatingBtn.onmouseenter = function(e: any) {
    e.target.style.transform = 'scale(1.1)';
    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25)';
  };

  floatingBtn.onmouseleave = function(e: any) {
    e.target.style.transform = 'scale(1)';
    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  };

  floatingBtn.onclick = toggleOverlay;
  document.body.appendChild(floatingBtn);
}

// Show selection popup
function showSelectionPopup(text: string, pageUrl: string, pageTitle: string) {
  if (document.getElementById('on-selection-popup')) {
    document.getElementById('on-selection-popup')?.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'on-selection-popup';
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 999999;
    padding: 24px;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  popup.innerHTML = `
    <div style="margin-bottom: 16px;">
      <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">Selected Text</p>
      <p style="margin: 0; padding: 12px; background: #f5f5f5; border-radius: 6px; font-size: 14px; color: #333; max-height: 100px; overflow-y: auto;">
        "${text}"
      </p>
    </div>
    <div style="margin-bottom: 16px;">
      <p style="margin: 0 0 8px 0; color: #666; font-size: 12px; text-transform: uppercase; font-weight: 600;">From Page</p>
      <p style="margin: 0; font-size: 13px; color: #007bff; word-break: break-all;">
        <a href="${pageUrl}" target="_blank" style="color: #007bff; text-decoration: none;">${pageTitle || pageUrl}</a>
      </p>
    </div>
    <div style="display: flex; gap: 8px;">
      <button id="add-selection-btn" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px;">Add to Notes</button>
      <button id="cancel-selection-btn" style="flex: 1; padding: 10px; background: #e0e0e0; color: #333; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px;">Cancel</button>
    </div>
  `;

  document.body.appendChild(popup);

  document.getElementById('add-selection-btn')!.onclick = () => {
    popup.remove();
    // Open overlay
    toggleOverlay();
  };

  document.getElementById('cancel-selection-btn')!.onclick = () => {
    popup.remove();
  };
}

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
    
    // Pass selected data to overlay
    (window as any).__openNotasSelectedData = selectedData;
    
    // Load and inject the overlay UI
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('overlay.js');
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
    link.href = chrome.runtime.getURL('overlay.css');
    document.head.appendChild(link);
  }
}

// Initialize floating button when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
  createFloatingButton();
}
