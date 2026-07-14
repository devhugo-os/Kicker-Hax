// Kicker Hax - Settings & Key Remapping Controller
import { router } from '../router.js';
import { soundFx } from '../utils/soundFx.js';
import { showToast } from '../utils/toast.js';
import { firebaseService } from '../services/firebaseService.js';

export const DEFAULT_MOBILE_HUD = {
  showStats: true,
  largeButtons: false,
  opacity: 60,
  stickX: 12,
  stickY: 25,
  chatX: 86,
  chatY: 84,
  chatSize: 44,
  chatOpacity: 60,
  statsX: 93,
  statsY: 84,
  statsSize: 44,
  statsOpacity: 60,
  pauseX: 8,
  pauseY: 84,
  pauseSize: 44,
  pauseOpacity: 60,
  stickSize: 132,
  stickOpacity: 60,
  actionPositions: {
    sprint: { x: 74, y: 66 },
    shoot: { x: 83, y: 34 },
    dribble: { x: 92, y: 33 },
    tackle: { x: 83, y: 15 },
    power: { x: 92, y: 52 }
  },
  actionStyles: {
    sprint: { size: 54, opacity: 60 },
    shoot: { size: 58, opacity: 60 },
    dribble: { size: 54, opacity: 60 },
    tackle: { size: 54, opacity: 60 },
    power: { size: 56, opacity: 60 }
  }
};

export const settingsController = {
  // Key mappings
  CTRL_P1: null,
  CTRL_P2: null,
  
  // Game dimensions config
  fieldSize: 'medium', // 'small' | 'medium' | 'large'
  dimensions: { w: 1024, h: 640 },
  mobileHud: structuredClone(DEFAULT_MOBILE_HUD),
  mobileHudUserId: null,
  desktopControlsUserId: null,

  // Key remap target
  waitingRemap: null, // { playerNum, actionId, btnElement }
  pendingMobileHud: null,

  defaultP1: {
    up: 'w', down: 's', left: 'a', right: 'd',
    sprint: 'ShiftLeft', shoot: ' ', dribble: 'f', tackle: 'e', power: 'q'
  },
  defaultP2: {
    up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright',
    sprint: 'ShiftRight', shoot: '1', dribble: '2', tackle: '3', power: '0'
  },

  blockedRemapKeys: new Set([
    'enter', 'tab', 'escape', 'backspace', 'delete',
    'meta', 'contextmenu', 'capslock', 'numlock', 'scrolllock',
    'alt', 'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight'
  ]),

  actions: [
    { id: 'up', label: 'Mover Cima' },
    { id: 'down', label: 'Mover Baixo' },
    { id: 'left', label: 'Mover Esquerda' },
    { id: 'right', label: 'Mover Direita' },
    { id: 'sprint', label: 'Correr' },
    { id: 'shoot', label: 'Chutar' },
    { id: 'dribble', label: 'Driblar' },
    { id: 'tackle', label: 'Desarme' },
    { id: 'power', label: 'Power Shoot' }
  ],

  init() {
    this.loadSettings();

    // Volume Slider
    const volSlider = document.getElementById('settings-volume');
    const volDisplay = document.getElementById('volume-val-display');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (volDisplay) volDisplay.textContent = `${val}%`;
        soundFx.setVolume(val);
        localStorage.setItem('kicker_hax_volume', val);
      });
    }
    const musicSlider = document.getElementById('settings-music-volume');
    const musicDisplay = document.getElementById('music-volume-val-display');
    if (musicSlider) {
      musicSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        if (musicDisplay) musicDisplay.textContent = `${val}%`;
        soundFx.setMusicVolume(val);
        localStorage.setItem('kicker_hax_music_volume', val);
      });
    }

    // Back buttons
    const btnSetBack = document.getElementById('settings-btn-back');
    if (btnSetBack) btnSetBack.onclick = () => router.show('menu-screen');
    const btnSettingsFullscreen = document.getElementById('settings-btn-fullscreen');
    if (btnSettingsFullscreen) {
      btnSettingsFullscreen.onclick = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.();
        }
      };
    }

    const btnCtrlBack = document.getElementById('controls-btn-back');
    if (btnCtrlBack) btnCtrlBack.onclick = () => router.show('menu-screen');
    this.bindMobileHudSettings();

    // Global Key Listener for Remapping
    window.addEventListener('keydown', (e) => this.handleRemapKey(e));

    // Reset Controls button
    const btnReset = document.getElementById('controls-btn-reset');
    if (btnReset) {
      btnReset.onclick = () => {
        this.CTRL_P1 = JSON.parse(JSON.stringify(this.defaultP1));
        this.CTRL_P2 = JSON.parse(JSON.stringify(this.defaultP2));
        this.mobileHud = structuredClone(DEFAULT_MOBILE_HUD);
        this.saveControls();
        this.saveMobileHudSettings();
        this.renderRemapGrids();
        this.renderMobileControlsPanel();
        window.dispatchEvent(new CustomEvent('kicker:mobileHudUpdated'));
        showToast('Controles e HUD restaurados aos padrões!', 'success');
      };
    }

    // Settings lifecycle triggers
    router.register('settings-screen', {
      onEnter: () => {
        // Reload slider visual
        const savedVol = localStorage.getItem('kicker_hax_volume') || '80';
        const savedMusicVol = localStorage.getItem('kicker_hax_music_volume') || '55';
        if (volSlider) volSlider.value = savedVol;
        if (volDisplay) volDisplay.textContent = `${savedVol}%`;
        if (musicSlider) musicSlider.value = savedMusicVol;
        if (musicDisplay) musicDisplay.textContent = `${savedMusicVol}%`;
      }
    });

    router.register('controls-screen', {
      onEnter: () => {
        this.renderRemapGrids();
        this.renderMobileControlsPanel();
        const warning = document.getElementById('controls-restart-warning');
        if (warning) warning.classList.add('hidden');
      }
    });
  },

  loadSettings() {
    // 1) Sound volume
    const savedVol = localStorage.getItem('kicker_hax_volume') || '80';
    const savedMusicVol = localStorage.getItem('kicker_hax_music_volume') || '55';
    soundFx.setVolume(parseInt(savedVol, 10));
    soundFx.setMusicVolume(parseInt(savedMusicVol, 10));

    // 2) Default dimensions
    this.fieldSize = 'medium';
    this.dimensions = { w: 1024, h: 640 };

    // HUD starts from the same canonical layout used by the reset control.
    // Account-specific data is applied only after Firebase authentication.
    this.mobileHud = structuredClone(DEFAULT_MOBILE_HUD);

    // 4) Key controls
    try {
      this.CTRL_P1 = JSON.parse(localStorage.getItem('kicker_hax_keys_p1')) || JSON.parse(JSON.stringify(this.defaultP1));
      this.CTRL_P2 = JSON.parse(localStorage.getItem('kicker_hax_keys_p2')) || JSON.parse(JSON.stringify(this.defaultP2));
    } catch (e) {
      this.CTRL_P1 = JSON.parse(JSON.stringify(this.defaultP1));
      this.CTRL_P2 = JSON.parse(JSON.stringify(this.defaultP2));
    }
    [this.CTRL_P1, this.CTRL_P2].forEach(ctrl => {
      Object.keys(ctrl).forEach(action => {
        const val = ctrl[action];
        if (this.blockedRemapKeys.has(String(val).toLowerCase()) || this.blockedRemapKeys.has(val)) {
          ctrl[action] = '';
        }
      });
    });
  },

  saveControls() {
    localStorage.setItem('kicker_hax_keys_p1', JSON.stringify(this.CTRL_P1));
    localStorage.setItem('kicker_hax_keys_p2', JSON.stringify(this.CTRL_P2));
    if (!this.desktopControlsUserId) return;
    // P2 remains local for same-device solo play; only the account owner's
    // controls belong in the Firebase profile.
    const desktopControls = { p1: { ...this.CTRL_P1 } };
    localStorage.setItem(`kicker_hax_desktop_controls_${this.desktopControlsUserId}`, JSON.stringify(desktopControls));
    firebaseService.updateUserProfile(this.desktopControlsUserId, { desktopControls })
      .catch(error => console.warn('[Kicker Controls] Falha ao sincronizar controles:', error));
  },

  normalizeMobileHud(hud) {
    return {
      ...structuredClone(DEFAULT_MOBILE_HUD),
      ...(hud || {}),
      actionPositions: {
        ...structuredClone(DEFAULT_MOBILE_HUD.actionPositions),
        ...(hud?.actionPositions || {})
      },
      actionStyles: {
        ...structuredClone(DEFAULT_MOBILE_HUD.actionStyles),
        ...(hud?.actionStyles || {})
      }
    };
  },

  async loadMobileHudForUser(user) {
    this.mobileHudUserId = user?.uid || null;
    this.desktopControlsUserId = user?.uid || null;
    if (!this.mobileHudUserId) {
      this.mobileHud = structuredClone(DEFAULT_MOBILE_HUD);
      return;
    }

    const storageKey = `kicker_hax_mobile_hud_${this.mobileHudUserId}`;
    let savedHud = null;
    try {
      const profile = await firebaseService.getUserProfile(this.mobileHudUserId);
      savedHud = profile?.mobileHud || JSON.parse(localStorage.getItem(storageKey) || 'null');
      const cachedControls = JSON.parse(localStorage.getItem(`kicker_hax_desktop_controls_${this.desktopControlsUserId}`) || 'null');
      const savedControls = profile?.desktopControls || cachedControls;
      if (savedControls?.p1) this.CTRL_P1 = { ...this.defaultP1, ...savedControls.p1 };
      this.saveControls();
    } catch (error) {
      savedHud = JSON.parse(localStorage.getItem(storageKey) || 'null');
      console.warn('[Kicker HUD] Usando cache local do HUD:', error);
    }

    this.mobileHud = this.normalizeMobileHud(savedHud);
    localStorage.setItem(storageKey, JSON.stringify(this.mobileHud));
    window.dispatchEvent(new CustomEvent('kicker:mobileHudUpdated'));
  },

  clearMobileHudUser() {
    this.mobileHudUserId = null;
    this.desktopControlsUserId = null;
    this.mobileHud = structuredClone(DEFAULT_MOBILE_HUD);
  },

  saveMobileHudSettings(nextHud = this.mobileHud) {
    this.mobileHud = this.normalizeMobileHud(nextHud);
    if (!this.mobileHudUserId) return;

    localStorage.setItem(`kicker_hax_mobile_hud_${this.mobileHudUserId}`, JSON.stringify(this.mobileHud));
    firebaseService.updateUserProfile(this.mobileHudUserId, { mobileHud: this.mobileHud })
      .catch(error => console.warn('[Kicker HUD] Falha ao sincronizar HUD:', error));
  },

  getKeyLabel(keyOrCode) {
    if (!keyOrCode) return '—';
    if (keyOrCode === 'ShiftLeft') return 'Shift Esq.';
    if (keyOrCode === 'ShiftRight') return 'Shift Dir.';
    if (keyOrCode === ' ') return 'Espaço';
    if (keyOrCode === 'arrowup') return '↑';
    if (keyOrCode === 'arrowdown') return '↓';
    if (keyOrCode === 'arrowleft') return '←';
    if (keyOrCode === 'arrowright') return '→';
    if (keyOrCode === 'enter') return 'Enter';
    return keyOrCode.toUpperCase();
  },

  renderRemapGrids() {
    const gridP1 = document.getElementById('grid-controls-p1');

    if (!gridP1) return;
    if (this.isTouchDevice()) {
      gridP1.innerHTML = '<div class="subtext">No mobile, toque em "Editar HUD na partida" para arrastar os botões dentro de um treino livre.</div>';
      return;
    }

    const buildGrid = (gridEl, playerNum, ctrlObj) => {
      gridEl.innerHTML = '';
      this.actions.forEach(act => {
        // Label
        const lbl = document.createElement('div');
        lbl.className = 'map-label';
        lbl.textContent = act.label;
        gridEl.appendChild(lbl);

        // Key Value Button
        const val = ctrlObj[act.id];
        const btn = document.createElement('button');
        btn.className = 'map-key-btn';
        btn.dataset.actionLabel = act.label;
        btn.textContent = this.getKeyLabel(val);
        btn.onclick = () => this.startRemapping(playerNum, act.id, btn);
        gridEl.appendChild(btn);
      });
    };

    buildGrid(gridP1, 1, this.CTRL_P1);
  },

  isTouchDevice() {
    const ua = navigator.userAgent || '';
    const mobileUA = /Android|iPhone|iPad|iPod|Mobile|IEMobile|Opera Mini/i.test(ua);
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    return navigator.maxTouchPoints > 0 && (coarse || mobileUA || Math.min(window.innerWidth, window.innerHeight) <= 540);
  },

  bindMobileHudSettings() {
    const showStats = document.getElementById('mobile-hud-show-stats');
    const largeButtons = document.getElementById('mobile-hud-large-buttons');
    const opacity = document.getElementById('mobile-hud-opacity');
    const stickX = document.getElementById('mobile-stick-x');
    const stickY = document.getElementById('mobile-stick-y');
    const actionsX = document.getElementById('mobile-actions-x');
    const actionsY = document.getElementById('mobile-actions-y');
    const save = ({ persist = false } = {}) => {
      const shootPos = this.pendingMobileHud?.actionPositions?.shoot || this.mobileHud.actionPositions?.shoot || DEFAULT_MOBILE_HUD.actionPositions.shoot;
      this.pendingMobileHud = {
        ...structuredClone(DEFAULT_MOBILE_HUD),
        ...(this.pendingMobileHud || this.mobileHud),
        showStats: showStats ? !!showStats.checked : (this.mobileHud.showStats !== false),
        largeButtons: largeButtons ? !!largeButtons.checked : !!this.mobileHud.largeButtons,
        opacity: parseInt(opacity?.value || String(this.mobileHud.opacity || DEFAULT_MOBILE_HUD.opacity), 10),
        stickX: parseInt(stickX?.value || String(DEFAULT_MOBILE_HUD.stickX), 10),
        stickY: parseInt(stickY?.value || String(DEFAULT_MOBILE_HUD.stickY), 10),
        actionPositions: {
          ...structuredClone(DEFAULT_MOBILE_HUD.actionPositions),
          ...(this.pendingMobileHud?.actionPositions || this.mobileHud.actionPositions || {}),
          shoot: {
            x: parseInt(actionsX?.value || String(shootPos.x), 10),
            y: parseInt(actionsY?.value || String(shootPos.y), 10)
          }
        }
      };
      if (persist) {
        this.saveMobileHudSettings(this.pendingMobileHud);
        window.dispatchEvent(new CustomEvent('kicker:mobileHudUpdated'));
        showToast('HUD mobile salvo.', 'success');
      }
      this.updateMobileHudPreview();
    };
    [showStats, largeButtons, opacity, stickX, stickY, actionsX, actionsY].forEach(el => el?.addEventListener('input', save));
    [showStats, largeButtons, opacity, stickX, stickY, actionsX, actionsY].forEach(el => el?.addEventListener('change', save));
    document.getElementById('mobile-hud-save-layout')?.addEventListener('click', () => save({ persist: true }));
    document.getElementById('mobile-hud-edit-match')?.addEventListener('click', () => {
      save({ persist: true });
      window.dispatchEvent(new CustomEvent('kicker:openMobileHudEditor'));
    });
    this.bindMobilePreviewDrag();
  },

  renderMobileControlsPanel() {
    const panel = document.getElementById('mobile-hud-settings');
    if (!panel) return;
    const isMobile = this.isTouchDevice();
    panel.classList.toggle('hidden', !isMobile);
    const showStats = document.getElementById('mobile-hud-show-stats');
    const largeButtons = document.getElementById('mobile-hud-large-buttons');
    const opacity = document.getElementById('mobile-hud-opacity');
    const stickX = document.getElementById('mobile-stick-x');
    const stickY = document.getElementById('mobile-stick-y');
    const actionsX = document.getElementById('mobile-actions-x');
    const actionsY = document.getElementById('mobile-actions-y');
    if (showStats) showStats.checked = this.mobileHud.showStats;
    if (largeButtons) largeButtons.checked = this.mobileHud.largeButtons;
    if (opacity) opacity.value = this.mobileHud.opacity;
    if (stickX) stickX.value = this.mobileHud.stickX;
    if (stickY) stickY.value = this.mobileHud.stickY;
    if (actionsX) actionsX.value = this.mobileHud.actionPositions?.shoot?.x ?? DEFAULT_MOBILE_HUD.actionPositions.shoot.x;
    if (actionsY) actionsY.value = this.mobileHud.actionPositions?.shoot?.y ?? DEFAULT_MOBILE_HUD.actionPositions.shoot.y;
    this.pendingMobileHud = { ...this.mobileHud };
    this.updateMobileHudPreview();
  },

  updateMobileHudPreview() {
    const stick = document.getElementById('mobile-preview-stick');
    const actions = document.getElementById('mobile-preview-actions');
    const hud = this.pendingMobileHud || this.mobileHud;
    if (stick) {
      stick.style.left = `${hud.stickX}%`;
      stick.style.bottom = `${hud.stickY}%`;
    }
    if (actions) {
      const shoot = hud.actionPositions?.shoot || DEFAULT_MOBILE_HUD.actionPositions.shoot;
      actions.style.left = `${shoot.x}%`;
      actions.style.bottom = `${shoot.y}%`;
    }
  },

  bindMobilePreviewDrag() {
    const preview = document.querySelector('.mobile-hud-preview');
    if (!preview || preview.dataset.dragBound === 'true') return;
    preview.dataset.dragBound = 'true';

    const bindTarget = (el, keys) => {
      if (!el) return;
      const move = (event) => {
        const rect = preview.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const yFromBottom = ((rect.bottom - event.clientY) / rect.height) * 100;
        const clampedX = Math.max(2, Math.min(94, Math.round(x)));
        const clampedY = Math.max(8, Math.min(44, Math.round(yFromBottom)));
        const [xKey, yKey, xInputId, yInputId] = keys;
        if (xKey === 'shootX') {
          const current = this.pendingMobileHud || this.mobileHud;
          this.pendingMobileHud = {
            ...current,
            actionPositions: {
              ...structuredClone(DEFAULT_MOBILE_HUD.actionPositions),
              ...(current.actionPositions || {}),
              shoot: { x: clampedX, y: clampedY }
            }
          };
        } else {
          this.pendingMobileHud = { ...(this.pendingMobileHud || this.mobileHud), [xKey]: clampedX, [yKey]: clampedY };
        }
        const xInput = document.getElementById(xInputId);
        const yInput = document.getElementById(yInputId);
        if (xInput) xInput.value = clampedX;
        if (yInput) yInput.value = clampedY;
        this.updateMobileHudPreview();
      };
      el.addEventListener('pointerdown', (event) => {
        event.preventDefault();
        el.setPointerCapture?.(event.pointerId);
        move(event);
      });
      el.addEventListener('pointermove', (event) => {
        if (event.buttons === 0 && event.pressure === 0) return;
        event.preventDefault();
        move(event);
      });
    };

    bindTarget(document.getElementById('mobile-preview-stick'), ['stickX', 'stickY', 'mobile-stick-x', 'mobile-stick-y']);
    bindTarget(document.getElementById('mobile-preview-actions'), ['shootX', 'shootY', 'mobile-actions-x', 'mobile-actions-y']);
  },

  startRemapping(playerNum, actionId, btn) {
    // Clear any previous remapping state
    if (this.waitingRemap) {
      const prevBtn = this.waitingRemap.btn;
      const prevVal = this.waitingRemap.playerNum === 1 ?this.CTRL_P1[this.waitingRemap.actionId] : this.CTRL_P2[this.waitingRemap.actionId];
      prevBtn.textContent = this.getKeyLabel(prevVal);
      prevBtn.classList.remove('active');
    }

    this.waitingRemap = { playerNum, actionId, btn };
    btn.textContent = 'Aguardando tecla...';
    btn.classList.add('active');
  },

  handleRemapKey(e) {
    if (!this.waitingRemap) return;

    e.preventDefault();
    e.stopPropagation();

    const { playerNum, actionId, btn } = this.waitingRemap;
    btn.classList.remove('active');

    const keyVal = e.key || '';
    const keyLower = keyVal.toLowerCase();

    // Cancel on ESC
    if (keyVal === 'Escape') {
      const val = playerNum === 1 ?this.CTRL_P1[actionId] : this.CTRL_P2[actionId];
      btn.textContent = this.getKeyLabel(val);
      this.waitingRemap = null;
      return;
    }

    // Clear on Backspace
    if (keyVal === 'Backspace') {
      if (playerNum === 1) this.CTRL_P1[actionId] = '';
      else this.CTRL_P2[actionId] = '';
      this.saveControls();
      this.renderRemapGrids();
      this.waitingRemap = null;
      return;
    }

    // Read input key value or code (for modifier shifts)
    let selectedKey = keyLower;
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
      selectedKey = e.code;
    }

    if (this.blockedRemapKeys.has(keyLower) || this.blockedRemapKeys.has(selectedKey) || keyLower.startsWith('f') && /^f\d{1,2}$/.test(keyLower)) {
      btn.textContent = this.getKeyLabel(playerNum === 1 ?this.CTRL_P1[actionId] : this.CTRL_P2[actionId]);
      this.waitingRemap = null;
      showToast('Essa tecla é reservada pelo sistema ou pelo chat.', 'error');
      return;
    }

    const selfCtrl = playerNum === 1 ?this.CTRL_P1 : this.CTRL_P2;
    // Self swap if key is already assigned inside the same control profile.
    const prevAction = Object.keys(selfCtrl).find(key => selfCtrl[key] === selectedKey);
    if (prevAction && prevAction !== actionId) {
      // Swap key values
      const tempVal = selfCtrl[actionId];
      selfCtrl[actionId] = selectedKey;
      selfCtrl[prevAction] = tempVal;
    } else {
      selfCtrl[actionId] = selectedKey;
    }

    this.saveControls();
    this.renderRemapGrids();
    this.waitingRemap = null;
  }
};
export default settingsController;
