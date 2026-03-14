/**
 * Background Service Worker
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT PII Guard Installed');
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scanComplete') {
    // We could show a notification here if desired
    console.log('Scan complete:', message.stats);
  }
});
