// Messages functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMessages();
});

function initializeMessages() {
    const conversationItems = document.querySelectorAll('.clickable-conversation');
    const backToChatsBtn = document.getElementById('backToChatsBtn');
    const conversationsSidebar = document.querySelector('.conversations-sidebar');
    const chatMainArea = document.querySelector('.chat-main-area');
    const chatUserName = document.querySelector('.chat-user-name');
    
    // Check if we're in mobile view
    function isMobileView() {
        return window.innerWidth <= 768;
    }
    
    // Show chat area (mobile)
    function showChatArea(userName) {
        if (isMobileView()) {
            conversationsSidebar.classList.add('hidden');
            chatMainArea.classList.add('active');
            if (userName && chatUserName) {
                chatUserName.textContent = userName;
            }
        }
    }
    
    // Show conversations sidebar (mobile)
    function showConversationsList() {
        if (isMobileView()) {
            conversationsSidebar.classList.remove('hidden');
            chatMainArea.classList.remove('active');
        }
    }
    
    // Handle conversation item click
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            conversationItems.forEach(conv => conv.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get user name
            const userName = this.getAttribute('data-user-name');
            
            // Show chat area in mobile, update user name
            showChatArea(userName);
        });
    });
    
    // Handle back to chats button
    if (backToChatsBtn) {
        backToChatsBtn.addEventListener('click', function() {
            showConversationsList();
            // Remove active class from all conversations
            conversationItems.forEach(conv => conv.classList.remove('active'));
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (!isMobileView()) {
            // Reset mobile states when switching to desktop
            conversationsSidebar.classList.remove('hidden');
            chatMainArea.classList.remove('active');
        }
    });
    
    // Initialize default state
    if (isMobileView()) {
        showConversationsList();
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeMessages };
}
