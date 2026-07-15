import { firebaseService } from '../services/firebaseService.js';
import { menuController } from './menuController.js';
import { showToast } from '../utils/toast.js';
import { getEquippedSkin } from '../data/skins.js';
import { appendStaffTag } from '../utils/staffTags.js';

export const chatController = {
  initialized: false,
  identityCache: new Map(),
  unsubscribeGlobalChat: null,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const chatContainer = document.getElementById('global-chat-container');
    const chatToggleBtn = document.getElementById('global-chat-toggle');
    const chatForm = document.getElementById('global-chat-form');
    const chatInput = document.getElementById('global-chat-input');
    const chatMessages = document.getElementById('global-chat-messages');

    if (!chatContainer || !chatToggleBtn || !chatForm) return;
    this.buildResponsiveToggleLabel(chatToggleBtn);

    // Toggle Chat visibility
    chatToggleBtn.addEventListener('click', () => {
      if (window.matchMedia('(pointer: coarse), (orientation: landscape) and (max-height: 560px)').matches) {
        chatContainer.classList.toggle('mobile-open');
        chatContainer.classList.toggle('minimized', !chatContainer.classList.contains('mobile-open'));
        if (chatContainer.classList.contains('mobile-open')) {
          this.scrollToLatest();
          chatInput.focus();
        }
        return;
      }
      chatContainer.classList.toggle('minimized');
      if (!chatContainer.classList.contains('minimized')) {
        this.scrollToLatest();
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

  },

  scrollToLatest() {
    const chatMessages = document.getElementById('global-chat-messages');
    if (!chatMessages) return;
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  },

  startGlobalChatSubscription() {
    if (!this.initialized) return;
    this.unsubscribeGlobalChat?.();
    this.unsubscribeGlobalChat = null;

    const chatMessages = document.getElementById('global-chat-messages');
    if (!chatMessages) return;
    chatMessages.replaceChildren();
    firebaseService.pruneOldChatMessages().catch(() => {});
    this.unsubscribeGlobalChat = firebaseService.subscribeToGlobalChat(async (msg) => {
      if (!msg) return;
      let profile = null;
      let badge = msg.badge || '👤';
      if (msg.uid) {
        try {
          const cached = this.identityCache.get(msg.uid);
          if (!cached || Date.now() - cached.loadedAt > 60000) {
            profile = await firebaseService.getUserProfile(msg.uid);
            this.identityCache.set(msg.uid, { profile, loadedAt: Date.now() });
          } else {
            profile = cached.profile;
          }
          badge = profile?.badge || badge;
        } catch (e) {}
      }
      const timeStr = msg.timestamp ?new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

      // Construct nodes rather than injecting chat text into HTML. Besides
      // preventing markup from messages, this is reliable in mobile WebViews.
      const el = document.createElement('div');
      el.className = 'global-chat-msg';
      el.dataset.messageId = msg.id || `${msg.timestamp || Date.now()}-${msg.username}-${msg.text}`;
      el.dataset.timestamp = String(Number(msg.timestamp) || Date.now());
      if (chatMessages.querySelector(`[data-message-id="${CSS.escape(el.dataset.messageId)}"]`)) return;
      const time = document.createElement('span');
      time.className = 'msg-time';
      time.textContent = timeStr;
      const badgeEl = document.createElement(msg.uid ? 'button' : 'span');
      badgeEl.className = 'msg-badge';
      if (msg.uid) badgeEl.type = 'button';
      const equippedSkin = getEquippedSkin(profile || {});
      menuController.renderSkin(badgeEl, equippedSkin, badge);
      const author = document.createElement(msg.uid ? 'button' : 'span');
      author.className = 'msg-author';
      author.textContent = msg.username || 'Jogador';
      appendStaffTag(author, profile?.staffRole || msg.staffRole);
      author.appendChild(document.createTextNode(':'));
      if (msg.uid) {
        author.type = 'button';
        badgeEl.classList.add('profile-trigger');
        author.classList.add('profile-trigger');
        badgeEl.title = `Ver perfil de ${msg.username || 'Jogador'}`;
        author.title = badgeEl.title;
        badgeEl.addEventListener('click', () => menuController.openPublicProfile(msg.uid));
        author.addEventListener('click', () => menuController.openPublicProfile(msg.uid));
      }
      const content = document.createElement('span');
      content.className = 'msg-content';
      content.textContent = String(msg.text || '');
      el.append(time, badgeEl, author, content);
      const after = [...chatMessages.children].find(child => Number(child.dataset.timestamp || 0) > Number(el.dataset.timestamp));
      if (after) chatMessages.insertBefore(el, after);
      else chatMessages.appendChild(el);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, () => {
      chatMessages.replaceChildren();
    }, (error) => {
      console.warn('[GlobalChat] Listener indisponivel:', error);
    });
  },

  stopGlobalChatSubscription() {
    this.unsubscribeGlobalChat?.();
    this.unsubscribeGlobalChat = null;
  },

  buildResponsiveToggleLabel(chatToggleBtn) {
    const title = chatToggleBtn.querySelector('.chat-title');
    if (!title) return;

    // Recreate the label with separate elements so the mobile icon can be
    // centered as a real control instead of relying on emoji baseline hacks.
    const icon = document.createElement('span');
    icon.className = 'chat-mobile-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '\u{1F4AC}';

    const text = document.createElement('span');
    text.className = 'chat-title-text';
    text.textContent = 'Chat Global';

    const close = document.createElement('span');
    close.className = 'chat-close-icon';
    close.setAttribute('aria-hidden', 'true');
    close.textContent = '\u00D7';

    title.replaceChildren(icon, text, close);
  }
};
export default chatController;
