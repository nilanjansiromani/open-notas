// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Open Notas extension installed');
  
  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'add-to-notes',
    title: 'Add to Open Notas',
    contexts: ['selection'],
  });
});

// Handle command from keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-overlay') {
    // Send message to content script to toggle overlay
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id || 0, { action: 'toggleOverlay' });
      }
    });
  }
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'add-to-notes' && info.selectionText) {
    // Send message to content script to show selection popup
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id || 0, {
          action: 'addSelectedText',
          selectedText: info.selectionText,
          pageUrl: info.pageUrl || tabs[0].url,
          pageTitle: tabs[0].title,
        });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getNotes') {
    chrome.storage.local.get(['notes'], (result) => {
      sendResponse({ notes: result.notes || [] });
    });
    return true;
  }
  
  if (request.action === 'saveNotes') {
    chrome.storage.local.set({ notes: request.data }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
