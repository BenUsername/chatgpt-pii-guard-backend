/**
 * ChatGPT API Client
 * This script runs in the context of the content script or background script
 * and uses fetch to interact with ChatGPT's internal API.
 */
class ChatGPTAPI {
    constructor() {
        this.baseUrl = 'https://chatgpt.com/backend-api';
    }

    async getConversations(offset = 0, limit = 20) {
        const response = await fetch(`${this.baseUrl}/conversations?offset=${offset}&limit=${limit}`);
        if (!response.ok) throw new Error(`Failed to fetch conversations: ${response.status}`);
        return await response.json();
    }

    async getConversationMessages(conversationId) {
        const response = await fetch(`${this.baseUrl}/conversation/${conversationId}`);
        if (!response.ok) throw new Error(`Failed to fetch conversation ${conversationId}: ${response.status}`);
        return await response.json();
    }

    async deleteConversation(conversationId) {
        const response = await fetch(`${this.baseUrl}/conversation/${conversationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_visible: false })
        });
        
        // Note: Some versions of the API use DELETE, others use PATCH is_visible: false
        // We'll try PATCH first as it's common for "archiving" or "deleting" in their recent UI
        if (!response.ok) {
            // Fallback to DELETE if PATCH fails
            const deleteResponse = await fetch(`${this.baseUrl}/conversation/${conversationId}`, {
                method: 'DELETE'
            });
            if (!deleteResponse.ok) throw new Error(`Failed to delete conversation ${conversationId}: ${deleteResponse.status}`);
            return await deleteResponse.json();
        }
        
        return await response.json();
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = ChatGPTAPI;
} else {
    window.ChatGPTAPI = ChatGPTAPI;
}
