// Kicker Hax - SPA Entrypoint Client Module
import { router } from './router.js';
import { firebaseService } from './services/firebaseService.js';
import { authController } from './controllers/authController.js';
import { menuController } from './controllers/menuController.js';
import { settingsController } from './controllers/settingsController.js';
import { gameController } from './controllers/gameController.js';
import { chatController } from './controllers/chatController.js';
import { showToast } from './utils/toast.js';

// Setup full SPA lifecycle
function initApp() {
  console.log('[Kicker Hax SPA] Inicializando...');
  
  // 1) Bind Fullscreen buttons (Global bar)
  const fsBtn1 = document.getElementById('match-btn-fullscreen');
  if (fsBtn1) {
    fsBtn1.onclick = () => toggleFullscreen();
  }

  // 2) Initialize individual screen controllers
  authController.init();
  settingsController.loadSettings();
  chatController.init();

  // 3) Setup ripple buttons dynamic highlights
  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // 4) Subscribe to Firebase Authentication state change
  const statusEl = document.getElementById('splash-status');
  firebaseService.subscribeToAuth(async (user) => {
    if (user) {
      if (statusEl) statusEl.textContent = 'Conectando ao banco de dados...';
      
      // Initialize internal sections
      await menuController.init(user);
      await gameController.init(user);
      settingsController.init();

      // Force pick username flow for new users
      if (menuController.profileData && menuController.profileData.isNewUser) {
        showToast('Escolha seu apelido de jogador antes de começar!', 'info');
        const backBtn = document.getElementById('profile-btn-back');
        if (backBtn) backBtn.style.display = 'none';
        router.show('profile-screen');
      } else {
        const backBtn = document.getElementById('profile-btn-back');
        if (backBtn) backBtn.style.display = '';
        router.show('menu-screen');
      }
    } else {
      // Clear data states if log out
      menuController.currentUser = null;
      gameController.currentUser = null;
      
      router.show('login-screen');
    }
  });
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn(`Erro ao ativar tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
}

// Start application when DOM loaded
window.addEventListener('DOMContentLoaded', initApp);
export default initApp;
