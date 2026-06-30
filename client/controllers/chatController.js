import { firebaseService } from '../services/firebaseService.js';
import { menuController } from './menuController.js';
import { showToast } from '../utils/toast.js';

export const chatController = {
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const chatContainer = document.getElementById('global-chat-container');
    const chatToggleBtn = document.getElementById('global-chat-toggle');
    const chatForm = document.getElementById('global-chat-form');
    const chatInput = document.getElementById('global-chat-input');
    const chatMessages = document.getElementById('global-chat-messages');

    if (!chatContainer || !chatToggleBtn || !chatForm) return;

    // Toggle Chat visibility
    chatToggleBtn.addEventListener('click', () => {
      chatContainer.classList.toggle('minimized');
      if (!chatContainer.classList.contains('minimized')) {
        chatInput.focus();
      }
    });

    // Handle message sending
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      if (!menuController.profileData) {
        showToast('Perfil não carregado ainda.', 'error');
        return;
      }

      chatInput.value = '';
      try {
        await firebaseService.sendGlobalChatMessage(menuController.profileData, text);
      } catch (err) {
        showToast('Erro ao enviar mensagem.', 'error');
        console.error(err);
      }
    });

    // Listen for new messages
    firebaseService.subscribeToGlobalChat((msg) => {
      if (!msg) return;
      const el = document.createElement('div');
      el.className = 'global-chat-msg';
      
      const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      
      el.innerHTML = `
        <span class="msg-time">${timeStr}</span>
        <span class="msg-badge">${msg.badge}</span>
        <span class="msg-author">${msg.username}:</span>
        <span class="msg-content">${msg.text}</span>
      `;
      chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }
};
export default chatController;
