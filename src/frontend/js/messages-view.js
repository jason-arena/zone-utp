document.addEventListener('DOMContentLoaded', function() {
    const messagesBtn = document.getElementById('messagesBtn');
    const headerMessagesModal = document.getElementById('headerMessagesModal');
    const individualChatModal = document.getElementById('individualChatModal');
    const messagesOverlay = document.getElementById('messagesOverlay');
    const closeHeaderMessagesModal = document.getElementById('closeHeaderMessagesModal');
    const closeIndividualChat = document.getElementById('closeIndividualChat');
    const backToMessagesList = document.getElementById('backToMessagesList');
    const messageItems = document.querySelectorAll('.message-item');
    
    // Abrir modal de mensajes desde el header
    if (messagesBtn) {
        messagesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            headerMessagesModal.classList.add('active');
            messagesOverlay.classList.add('active');
        });
    }
    
    // Cerrar modal de mensajes
    if (closeHeaderMessagesModal) {
        closeHeaderMessagesModal.addEventListener('click', function() {
            headerMessagesModal.classList.remove('active');
            messagesOverlay.classList.remove('active');
        });
    }
    
    // Cerrar modal de chat individual
    if (closeIndividualChat) {
        closeIndividualChat.addEventListener('click', function() {
            individualChatModal.classList.remove('active');
            messagesOverlay.classList.remove('active');
        });
    }
    
    // Volver a la lista de mensajes
    if (backToMessagesList) {
        backToMessagesList.addEventListener('click', function() {
            individualChatModal.classList.remove('active');
            headerMessagesModal.classList.add('active');
        });
    }
    
    // Abrir chat individual al hacer click en un mensaje
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            const userName = this.querySelector('.user-name').textContent;
            document.getElementById('currentChatUser').textContent = userName;
            headerMessagesModal.classList.remove('active');
            individualChatModal.classList.add('active');
        });
    });
    
    // Cerrar modales al hacer click en overlay
    if (messagesOverlay) {
        messagesOverlay.addEventListener('click', function() {
            headerMessagesModal.classList.remove('active');
            individualChatModal.classList.remove('active');
            messagesOverlay.classList.remove('active');
        });
    }
    
    // Cerrar modal al hacer click fuera (para que funcione como Facebook)
    document.addEventListener('click', function(e) {
        if (!headerMessagesModal.contains(e.target) && 
            !individualChatModal.contains(e.target) && 
            !messagesBtn.contains(e.target)) {
            headerMessagesModal.classList.remove('active');
            individualChatModal.classList.remove('active');
            messagesOverlay.classList.remove('active');
        }
    });
});
