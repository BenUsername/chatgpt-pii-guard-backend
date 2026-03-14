/**
 * Content script to coordinate scanning
 */

let scanner = null;
let api = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startScan') {
        startScan();
        sendResponse({ status: 'Scan started' });
    }
    return true;
});

async function startScan() {
    if (!scanner) scanner = new ScannerOverlay();
    if (!api) api = new ChatGPTAPI();

    scanner.show();
    scanner.updateCounter(0, 0, 'Fetching conversations...');

    try {
        // 1. Get all conversations
        const data = await api.getConversations(0, 50); // Scan first 50 for v1
        const conversations = data.items || [];
        
        scanner.updateCounter(0, conversations.length, 'Scanning...');

        let scannedCount = 0;
        let deletedCount = 0;

        for (const conv of conversations) {
            scannedCount++;
            scanner.updateCounter(scannedCount, conversations.length, `Analyzing: ${conv.title}`);
            scanner.highlightRow(conv.id);

            // Fetch messages
            const messagesData = await api.getConversationMessages(conv.id);
            const messages = messagesData.mapping || {};
            
            let isFlagged = false;
            
            // Analyze each message (only user messages)
            for (const msgId in messages) {
                const node = messages[msgId];
                if (node.message && node.message.author.role === 'user') {
                    const text = node.message.content.parts.join(' ');
                    
                    // Send to backend
                    const result = await checkPII(conv.id, msgId, text);
                    if (result.flagged) {
                        isFlagged = true;
                        break;
                    }
                }
            }

            if (isFlagged) {
                scanner.highlightRow(conv.id, true);
                scanner.updateCounter(scannedCount, conversations.length, `Deleting: ${conv.title}`);
                await api.deleteConversation(conv.id);
                deletedCount++;
                // Wait a bit for the animation/UI to catch up
                await new Promise(r => setTimeout(r, 1000));
            }

            // Small delay between conversations to avoid rate limiting
            await new Promise(r => setTimeout(r, 500));
        }

        scanner.updateCounter(scannedCount, conversations.length, `Complete. Deleted: ${deletedCount}`);
        
        // Notify background/popup
        chrome.runtime.sendMessage({ 
            action: 'scanComplete', 
            stats: { 
                total: conversations.length, 
                scanned: scannedCount, 
                deleted: deletedCount 
            } 
        });

    } catch (err) {
        console.error('PII Guard Scan Error:', err);
        scanner.updateCounter(0, 0, `Error: ${err.message}`);
    }
}

async function checkPII(conversationId, messageId, text) {
    try {
        const response = await fetch('https://chatgpt-pii-guard-backend.vercel.app/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversation_id: conversationId,
                message_id: messageId,
                text: text
            })
        });
        
        if (!response.ok) return { flagged: false };
        return await response.json();
    } catch (err) {
        console.error('Failed to reach PII Backend:', err);
        return { flagged: false }; // Fail safe (don't delete if we can't check)
    }
}
