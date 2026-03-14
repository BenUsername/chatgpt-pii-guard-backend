/**
 * Popup Logic
 */

document.getElementById('scan-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('chatgpt.com')) {
        document.getElementById('status-text').textContent = 'Please go to chatgpt.com';
        document.getElementById('status-text').style.color = '#ef4444';
        return;
    }

    document.getElementById('scan-btn').disabled = true;
    document.getElementById('scan-feedback').style.display = 'block';
    
    // Trigger scan in content script
    try {
        await chrome.tabs.sendMessage(tab.id, { action: 'startScan' });
    } catch (err) {
        document.getElementById('status-text').textContent = 'Error: Content script not loaded. Refresh ChatGPT page.';
        document.getElementById('status-text').style.color = '#ef4444';
        document.getElementById('scan-btn').disabled = false;
        document.getElementById('scan-feedback').style.display = 'none';
    }
});

// Update stats when received from content script
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'scanComplete') {
        document.getElementById('stat-scanned').textContent = message.stats.total;
        document.getElementById('stat-deleted').textContent = message.stats.deleted;
        document.getElementById('status-text').textContent = 'Scan Complete!';
        document.getElementById('scan-btn').disabled = false;
        document.getElementById('scan-feedback').style.display = 'none';
        
        // Show success color
        document.getElementById('status-text').style.color = '#00ff41';
    }
});
