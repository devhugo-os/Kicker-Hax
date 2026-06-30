// Kicker Hax - Settings & Key Remapping Controller
import { router } from '../router.js';
import { soundFx } from '../utils/soundFx.js';
import { showToast } from '../utils/toast.js';

export const settingsController = {
  // Key mappings
  CTRL_P1: null,
  CTRL_P2: null,
  
  // Game dimensions config
  fieldSize: 'medium', // 'small' | 'medium' | 'large'
  dimensions: { w: 1024, h: 640 },

  // Key remap target
  waitingRemap: null, // { playerNum, actionId, btnElement }

  defaultP1: {
    up: 'w', down: 's', left: 'a', right: 'd',
    sprint: 'ShiftLeft', shoot: ' ', dribble: 'f', tackle: 'e', power: 'q'
  },
  defaultP2: {
    up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright',
    sprint: 'ShiftRight', shoot: '1', dribble: '2', tackle: '3', power: 'enter'
  },

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

    // Back buttons
    const btnSetBack = document.getElementById('settings-btn-back');
    if (btnSetBack) btnSetBack.onclick = () => router.show('menu-screen');

    const btnCtrlBack = document.getElementById('controls-btn-back');
    if (btnCtrlBack) btnCtrlBack.onclick = () => router.show('menu-screen');

    // Global Key Listener for Remapping
    window.addEventListener('keydown', (e) => this.handleRemapKey(e));

    // Reset Controls button
    const btnReset = document.getElementById('controls-btn-reset');
    if (btnReset) {
      btnReset.onclick = () => {
        this.CTRL_P1 = JSON.parse(JSON.stringify(this.defaultP1));
        this.CTRL_P2 = JSON.parse(JSON.stringify(this.defaultP2));
        this.saveControls();
        this.renderRemapGrids();
        showToast('Controles restaurados aos padrões!', 'success');
      };
    }

    // Settings lifecycle triggers
    router.register('settings-screen', {
      onEnter: () => {
        // Reload slider visual
        const savedVol = localStorage.getItem('kicker_hax_volume') || '80';
        if (volSlider) volSlider.value = savedVol;
        if (volDisplay) volDisplay.textContent = `${savedVol}%`;
      }
    });

    router.register('controls-screen', {
      onEnter: () => {
        this.renderRemapGrids();
        const warning = document.getElementById('controls-restart-warning');
        if (warning) warning.classList.add('hidden');
      }
    });
  },

  loadSettings() {
    // 1) Sound volume
    const savedVol = localStorage.getItem('kicker_hax_volume') || '80';
    soundFx.setVolume(parseInt(savedVol, 10));

    // 2) Default dimensions
    this.fieldSize = 'medium';
    this.dimensions = { w: 1024, h: 640 };

    // 3) Key controls
    try {
      this.CTRL_P1 = JSON.parse(localStorage.getItem('kicker_hax_keys_p1')) || JSON.parse(JSON.stringify(this.defaultP1));
      this.CTRL_P2 = JSON.parse(localStorage.getItem('kicker_hax_keys_p2')) || JSON.parse(JSON.stringify(this.defaultP2));
    } catch (e) {
      this.CTRL_P1 = JSON.parse(JSON.stringify(this.defaultP1));
      this.CTRL_P2 = JSON.parse(JSON.stringify(this.defaultP2));
    }
  },

  saveControls() {
    localStorage.setItem('kicker_hax_keys_p1', JSON.stringify(this.CTRL_P1));
    localStorage.setItem('kicker_hax_keys_p2', JSON.stringify(this.CTRL_P2));
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
    const gridP2 = document.getElementById('grid-controls-p2');

    if (!gridP1 || !gridP2) return;

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
        btn.textContent = this.getKeyLabel(val);
        btn.onclick = () => this.startRemapping(playerNum, act.id, btn);
        gridEl.appendChild(btn);
      });
    };

    buildGrid(gridP1, 1, this.CTRL_P1);
    buildGrid(gridP2, 2, this.CTRL_P2);
  },

  startRemapping(playerNum, actionId, btn) {
    // Clear any previous remapping state
    if (this.waitingRemap) {
      const prevBtn = this.waitingRemap.btn;
      const prevVal = this.waitingRemap.playerNum === 1 ? this.CTRL_P1[this.waitingRemap.actionId] : this.CTRL_P2[this.waitingRemap.actionId];
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

    // Cancel on ESC
    if (e.key === 'Escape') {
      const val = playerNum === 1 ? this.CTRL_P1[actionId] : this.CTRL_P2[actionId];
      btn.textContent = this.getKeyLabel(val);
      this.waitingRemap = null;
      return;
    }

    // Clear on Backspace
    if (e.key === 'Backspace') {
      if (playerNum === 1) this.CTRL_P1[actionId] = '';
      else this.CTRL_P2[actionId] = '';
      this.saveControls();
      this.renderRemapGrids();
      this.waitingRemap = null;
      return;
    }

    // Read input key value or code (for modifier shifts)
    let selectedKey = e.key.toLowerCase();
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'ControlLeft' || e.code === 'ControlRight') {
      selectedKey = e.code;
    }

    const selfCtrl = playerNum === 1 ? this.CTRL_P1 : this.CTRL_P2;
    const oppCtrl = playerNum === 1 ? this.CTRL_P2 : this.CTRL_P1;

    // Block cross players duplicate key
    const usedByOpponent = Object.values(oppCtrl).includes(selectedKey);
    if (usedByOpponent && selectedKey) {
      btn.classList.add('warn');
      btn.textContent = 'Já em uso pelo outro jogador!';
      setTimeout(() => {
        btn.classList.remove('warn');
        const val = playerNum === 1 ? this.CTRL_P1[actionId] : this.CTRL_P2[actionId];
        btn.textContent = this.getKeyLabel(val);
      }, 1000);
      this.waitingRemap = null;
      return;
    }

    // Self swap if key is already assigned inside same player
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
