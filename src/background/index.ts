// Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Open Notas extension installed');
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
