// Kicker Hax - SPA Entrypoint Client Module
import { router } from './router.js';
import { firebaseService, auth } from './services/firebaseService.js';
import { authController } from './controllers/authController.js';
import { menuController } from './controllers/menuController.js';
import { marketController } from './controllers/marketController.js';
import { settingsController } from './controllers/settingsController.js';
import { gameController } from './controllers/gameController.js';
import { chatController } from './controllers/chatController.js';
import { showToast } from './utils/toast.js';
import { soundFx } from './utils/soundFx.js';
import { requestAppDownload, notifyNativeUpdate } from './utils/nativeBridge.js';
import { setupCharacterLimitWarnings } from './utils/contentLimitWarnings.js';

// Vite replaces the build constant in production. The fallback keeps the
// local development server usable when it serves the source module directly.
const APP_VERSION = typeof __KICKER_HAX_VERSION__ !== 'undefined' ? __KICKER_HAX_VERSION__ : '30.5.0';
const DISPLAY_VERSION = APP_VERSION.split('.').length > 2
  ? APP_VERSION.replace(/\.0$/, '')
  : APP_VERSION;
let fullscreenExitApproved = false;
let fullscreenEscapeHoldTimer = null;

// Setup full SPA lifecycle
function initApp() {
  console.log('[Kicker Hax SPA] Inicializando...');
  setupAppRuntimeOptimizations();
  setupMandatoryUpdateCheck();
  setupDesktopFullscreenLock();
  disableInputSuggestions();
  setupCharacterLimitWarnings();
  setupBackgroundAudioPolicy();
  setupRangeProgress();
  setupAudioUnlock();
  
  // Hide fullscreen buttons on mobile / touch devices
  const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isMobile) {
    const fsBtn1 = document.getElementById('match-btn-fullscreen');
    if (fsBtn1) fsBtn1.style.display = 'none';
    const fsBtn2 = document.getElementById('settings-btn-fullscreen');
    if (fsBtn2) fsBtn2.style.display = 'none';
  }
  if (new URLSearchParams(window.location.search).get('app') === '1') {
    // Native updates are handled by the Android shell; remove this web CTA
    // completely so stale CSS cannot make it visible in the app.
    document.getElementById('menu-btn-download-app')?.remove();
  }
  
  // 1) Bind Fullscreen buttons (Global bar)
  const fsBtn1 = document.getElementById('match-btn-fullscreen');
  if (fsBtn1) {
    fsBtn1.onclick = () => toggleFullscreen();
  }

  // Version changelog triggers
  const versionBadge = document.getElementById('game-version-badge');
  const changelogModal = document.getElementById('changelog-modal');
  const changelogCloseBtn = document.getElementById('changelog-btn-close');

  if (versionBadge) versionBadge.textContent = `v${DISPLAY_VERSION}`;

  if (versionBadge && changelogModal) {
    versionBadge.onclick = () => {
      changelogModal.classList.remove('hidden');
    };
  }
  if (changelogCloseBtn && changelogModal) {
    changelogCloseBtn.onclick = () => {
      changelogModal.classList.add('hidden');
    };
  }
  const changelogCloseTopBtn = document.getElementById('changelog-btn-close-top');
  if (changelogCloseTopBtn && changelogModal) {
    changelogCloseTopBtn.onclick = () => {
      changelogModal.classList.add('hidden');
    };
  }
  setupReleaseNotesOnce(changelogModal);

  // 2) Initialize individual screen controllers
  authController.init();
  settingsController.loadSettings();
  chatController.init();

  // 3) Delegated feedback also covers profile links created after startup.
  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, .btn, .mode-card, .profile-trigger, #menu-quick-profile');
    if (!target) return;
    soundFx.playButton();
    if (!target.matches('button, .btn, .mode-card')) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });

  // 4) Subscribe to Firebase Authentication state change
  const statusEl = document.getElementById('splash-status');
  firebaseService.bootstrapAuth().catch(() => {}).finally(() => firebaseService.subscribeToAuth(async (user) => {
    if (user) {
      if (statusEl) statusEl.textContent = 'Conectando ao banco de dados...';
      try {
        await firebaseService.ensureUserProfile(user);
        await firebaseService.claimActiveSession(user);
      } catch (err) {
        if (err?.code === 'active-session') {
          showSessionBlockedScreen(user, err.message || 'Esta conta já está aberta em outro local.');
        } else {
          console.error('[Kicker Auth] Falha ao preparar perfil:', err);
          showToast('Não foi possível sincronizar seu perfil agora. Tente novamente.', 'error');
          router.show('login-screen');
        }
        return;
      }

      // Initialize internal sections
      settingsController.init();
      await settingsController.loadMobileHudForUser(user);
      await menuController.init(user);
      await marketController.init(user);
      await gameController.init(user);
      chatController.startGlobalChatSubscription();

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
      settingsController.clearMobileHudUser();
      chatController.stopGlobalChatSubscription();
      
      router.show('login-screen');
    }
  }));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    fullscreenExitApproved = false;
    requestImmersiveFullscreen().catch((err) => {
      console.warn(`Erro ao ativar tela cheia: ${err.message}`);
    });
  } else {
    fullscreenExitApproved = true;
    document.exitFullscreen();
  }
}

function isDesktopRuntime() {
  return !window.matchMedia?.('(pointer: coarse)').matches;
}

function setupDesktopFullscreenLock() {
  document.addEventListener('keydown', event => {
    if (!isDesktopRuntime() || !document.fullscreenElement) return;
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || event.target?.isContentEditable || event.key !== 'Escape') return;

    if (event.repeat || fullscreenEscapeHoldTimer) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    fullscreenEscapeHoldTimer = setTimeout(() => {
      fullscreenExitApproved = true;
      document.exitFullscreen().catch(() => {});
      fullscreenEscapeHoldTimer = null;
    }, 900);
  }, true);

  document.addEventListener('keyup', event => {
    if (event.key !== 'Escape' || !fullscreenEscapeHoldTimer) return;
    clearTimeout(fullscreenEscapeHoldTimer);
    fullscreenEscapeHoldTimer = null;
  }, true);

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement || !isDesktopRuntime()) return;
    const approved = fullscreenExitApproved;
    fullscreenExitApproved = false;
    // Fullscreen may only be requested directly by a user gesture. Do not
    // auto-reenter here: Android/Chrome rejects it and fills the console.
  });
}

function disableInputSuggestions() {
  document.querySelectorAll('input, textarea, select').forEach(el => {
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocapitalize', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('spellcheck', 'false');
  });
}

function setupBackgroundAudioPolicy() {
  const stopForBackground = () => soundFx.suspendForBackground();
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopForBackground();
    else soundFx.resumeAfterForeground(
      router.currentScreenId === 'menu-screen',
      router.currentScreenId === 'match-screen',
      router.currentScreenId === 'match-screen'
    );
  });
  window.addEventListener('pagehide', stopForBackground);
}

function setupReleaseNotesOnce(changelogModal) {
  if (!changelogModal) return;
  const seenKey = () => {
    const uid = auth.currentUser?.uid;
    return uid ? `kicker_hax_release_notes_${uid}_${APP_VERSION}` : null;
  };
  const showWhenMenuIsReady = () => {
    const menu = document.getElementById('menu-screen');
    const key = seenKey();
    if (!menu || menu.classList.contains('hidden') || !key || localStorage.getItem(key)) return false;
    localStorage.setItem(key, '1');
    changelogModal.classList.remove('hidden');
    return true;
  };
  if (showWhenMenuIsReady()) return;
  const observer = new MutationObserver(() => {
    if (showWhenMenuIsReady()) observer.disconnect();
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  // Native authentication can finish after the menu is already visible.
  const retry = window.setInterval(() => {
    if (showWhenMenuIsReady()) window.clearInterval(retry);
  }, 750);
  window.setTimeout(() => window.clearInterval(retry), 15000);
}

function requestImmersiveFullscreen() {
  // This is the closest browser-permitted equivalent to F11. Browsers do not
  // expose the real F11 chrome mode to JavaScript, but navigationUI=hide gives
  // the game the same immersive viewport through a user-initiated click.
  return document.documentElement.requestFullscreen({ navigationUI: 'hide' })
    .catch(() => document.documentElement.requestFullscreen());
}

function setupRangeProgress() {
  const updateRange = input => {
    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || min);
    const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty('--range-progress', `${Math.max(0, Math.min(100, progress))}%`);
  };
  const refresh = () => document.querySelectorAll('input[type="range"]').forEach(updateRange);
  document.addEventListener('input', event => {
    if (event.target?.matches?.('input[type="range"]')) updateRange(event.target);
  });
  document.addEventListener('change', refresh);
  new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true });
  refresh();
}

function setupAudioUnlock() {
  const unlock = () => soundFx.resumeAfterForeground(false, false);
  window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  window.addEventListener('touchstart', unlock, { capture: true, passive: true });
}

function setupAppRuntimeOptimizations() {
  if (new URLSearchParams(window.location.search).get('app') !== '1') return;
  // The Cordova shell uses a current browser for the game. Trim decorative GPU
  // work in that path so older Android devices keep more budget for the canvas.
  document.documentElement.classList.add('app-runtime');
}

function setupMandatoryUpdateCheck() {
  const params = new URLSearchParams(window.location.search);
  const nativeVersion = params.get('nativeAppVersion');
  const current = (nativeVersion || APP_VERSION).replace(/^v/i, '');
  let updateShown = false;
  let pendingVersion = null;
  const shouldDefer = () => router.currentScreenId === 'match-screen'
    && gameController.mode === 'multiplayer'
    && !gameController.onlineMatchFinished;
  const check = async () => {
    try {
      const response = await fetch(`./deploy-version.txt?cb=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const text = await response.text();
      const match = text.match(/Kicker Hax\s+([0-9.]+)/i);
      const latest = match?.[1];
      if (latest && isVersionNewer(latest, current)) {
        if (shouldDefer()) {
          pendingVersion = latest;
          return;
        }
        if (nativeVersion) {
          const apkResponse = await fetch(`./downloads/kicker-hax-apk.txt?cb=${Date.now()}`, { cache: 'no-store' });
          const apkText = apkResponse.ok ? await apkResponse.text() : '';
          const apkVersion = apkText.match(/Version:\s*([0-9.]+)/i)?.[1];
          // Do not block the installed app until the matching APK workflow
          // has published a binary that the updater can actually install.
          if (apkVersion !== latest) return;
        }
        if (!updateShown) {
          updateShown = true;
          showUpdateRequiredScreen(latest, !!nativeVersion);
        }
      }
    } catch (err) {
      console.warn('[Kicker Update] Falha ao verificar versao publicada:', err);
    }
  };
  check();
  setInterval(check, 60000);
  // Desktop tabs can stay alive for hours with an older hashed bundle. Check
  // again as soon as the player returns, rather than waiting for a reload.
  window.addEventListener('focus', check);
  window.addEventListener('pageshow', check);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) check();
  });
  window.addEventListener('kicker:routechange', () => {
    if (pendingVersion && !shouldDefer()) {
      const version = pendingVersion;
      pendingVersion = null;
      updateShown = true;
      showUpdateRequiredScreen(version, !!nativeVersion);
    }
  });
}

function isVersionNewer(candidate, installed) {
  const parse = value => String(value).split('.').map(part => Number.parseInt(part, 10) || 0);
  const next = parse(candidate);
  const current = parse(installed);
  const size = Math.max(next.length, current.length);
  for (let index = 0; index < size; index++) {
    if ((next[index] || 0) !== (current[index] || 0)) return (next[index] || 0) > (current[index] || 0);
  }
  return false;
}

function showUpdateRequiredScreen(latestVersion, isNativeApp = false) {
  let blocker = document.getElementById('update-required-blocker');
  if (isNativeApp && !blocker) {
    showToast('Tem chuteira nova no vestiário. Bora atualizar!', 'info');
    notifyNativeUpdate(latestVersion);
  }
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'update-required-blocker';
    blocker.className = 'session-blocker';
    blocker.innerHTML = `
      <div class="session-blocker-box">
        <h2>Atualização obrigatória</h2>
        <p>Uma nova versão do Kicker Hax está disponível. Atualize para jogar com todos na mesma versão.</p>
        <button id="update-required-reload" class="btn btn-primary">${isNativeApp ? 'Baixar atualização' : 'Atualizar agora'}</button>
      </div>
    `;
    document.body.appendChild(blocker);
  }
  blocker.classList.remove('hidden');
  const reload = document.getElementById('update-required-reload');
  if (reload) {
    reload.onclick = async () => {
      if (isNativeApp) {
        reload.disabled = true;
        let remaining = 10;
        reload.textContent = `AGUARDE ${remaining}s`;
        requestAppDownload();
        const cooldown = window.setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            window.clearInterval(cooldown);
            reload.disabled = false;
            reload.textContent = 'TENTAR BAIXAR NOVAMENTE';
            return;
          }
          reload.textContent = `AGUARDE ${remaining}s`;
        }, 1000);
        return;
      }
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      } catch (err) {
        console.warn('[Kicker Update] Cache local nao pode ser limpo:', err);
      }
      window.location.href = `${window.location.pathname}?v=${encodeURIComponent(latestVersion)}&t=${Date.now()}`;
    };
  }
}

function showSessionBlockedScreen(user, message) {
  let blocker = document.getElementById('session-blocker');
  if (!blocker) {
    blocker = document.createElement('div');
    blocker.id = 'session-blocker';
    blocker.className = 'session-blocker';
    blocker.innerHTML = `
      <div class="session-blocker-box">
        <h2>Sessão já ativa</h2>
        <p id="session-blocker-message">${message}</p>
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
          <button id="session-blocker-force" class="btn btn-primary">Usar nesta tela</button>
          <button id="session-blocker-retry" class="btn btn-secondary">Tentar novamente</button>
        </div>
      </div>
    `;
    document.body.appendChild(blocker);
  } else {
    const msgEl = document.getElementById('session-blocker-message');
    if (msgEl) msgEl.textContent = message;
  }
  blocker.classList.remove('hidden');

  const forceBtn = document.getElementById('session-blocker-force');
  if (forceBtn) {
    forceBtn.onclick = async () => {
      try {
        blocker.classList.add('hidden');
        const statusEl = document.getElementById('splash-status');
        if (statusEl) statusEl.textContent = 'Forçando conexão...';
        await firebaseService.ensureUserProfile(user);
        await firebaseService.claimActiveSession(user, true);
        
        // Initialize internal sections
        settingsController.init();
        await settingsController.loadMobileHudForUser(user);
        await menuController.init(user);
        await marketController.init(user);
        await gameController.init(user);
        chatController.startGlobalChatSubscription();

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
      } catch (err) {
        showToast(err.message || 'Erro ao usar esta tela.', 'error');
        if (err?.code === 'active-session') {
          showSessionBlockedScreen(user, err.message || 'Erro ao forçar a sessão.');
        } else {
          blocker.classList.add('hidden');
        }
      }
    };
  }

  const retry = document.getElementById('session-blocker-retry');
  if (retry) retry.onclick = () => window.location.reload();
  showToast(message, 'error');
}

// Start application when DOM loaded
window.addEventListener('DOMContentLoaded', initApp);
export default initApp;
