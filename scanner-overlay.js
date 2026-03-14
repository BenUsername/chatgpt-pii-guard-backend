/**
 * Scanner Overlay Controller
 */
class ScannerOverlay {
    constructor() {
        this.createElements();
    }

    createElements() {
        // Overlay container for the sidebar
        this.overlay = document.createElement('div');
        this.overlay.className = 'pii-guard-overlay';
        
        // The scanning line
        this.scanLine = document.createElement('div');
        this.scanLine.className = 'pii-guard-scan-line';
        this.overlay.appendChild(this.scanLine);
        
        // Highlight box for current row
        this.highlight = document.createElement('div');
        this.highlight.className = 'pii-guard-row-highlight';
        this.overlay.appendChild(this.highlight);
        
        // Counter floating element
        this.counterBox = document.createElement('div');
        this.counterBox.className = 'pii-guard-counter';
        this.counterBox.innerHTML = `
            Scanned: <span class="pii-guard-counter-val" id="pg-scanned">0</span> / <span id="pg-total">0</span>
            <div class="pii-guard-status" id="pg-status">Initializing...</div>
        `;
        
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.counterBox);
    }

    show() {
        // Find ChatGPT sidebar - might need selector update
        const sidebar = document.querySelector('nav') || document.querySelector('[role="navigation"]');
        if (sidebar) {
            const rect = sidebar.getBoundingClientRect();
            this.overlay.style.width = `${rect.width}px`;
            this.overlay.style.top = `${rect.top}px`;
            this.overlay.style.left = `${rect.left}px`;
            this.overlay.style.height = `${rect.height}px`;
        }
        
        this.overlay.style.display = 'block';
        this.counterBox.style.display = 'block';
    }

    hide() {
        this.overlay.style.display = 'none';
        this.counterBox.style.display = 'none';
    }

    updateCounter(scanned, total, status) {
        document.getElementById('pg-scanned').textContent = scanned;
        document.getElementById('pg-total').textContent = total;
        if (status) {
            document.getElementById('pg-status').textContent = status;
        }
    }

    highlightRow(conversationId, isFlagged = false) {
        // Attempt to find the DOM element for the conversation in the sidebar
        // ChatGPT sidebar items usually have links with conversation IDs
        const selector = `a[href*="/c/${conversationId}"]`;
        const link = document.querySelector(selector);
        
        if (link) {
            const rect = link.getBoundingClientRect();
            const sidebarRect = this.overlay.getBoundingClientRect();
            
            this.highlight.style.top = `${rect.top - sidebarRect.top}px`;
            this.highlight.style.height = `${rect.height}px`;
            this.highlight.classList.add('active');
            
            if (isFlagged) {
                this.highlight.classList.add('flagged');
            } else {
                this.highlight.classList.remove('flagged');
            }
        } else {
            this.highlight.classList.remove('active');
        }
    }
}

window.ScannerOverlay = ScannerOverlay;
