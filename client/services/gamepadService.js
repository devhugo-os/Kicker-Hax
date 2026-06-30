// Kicker Hax - Gamepad Service
export const gamepadService = {
  connectedGamepads: [],
  onUpdateCallback: null,
  
  settings: {
    sensitivity: 5, // 1 to 10 scale
    p1GamepadIndex: null,
    p2GamepadIndex: null,
    // Standard Xbox / PlayStation button layouts
    // 0: A/Cross, 1: B/Circle, 2: X/Square, 3: Y/Triangle, 4: L1/LB, 5: R1/RB
    p1ButtonMap: { shoot: 0, dribble: 2, tackle: 1, power: 3, sprint: 5 },
    p2ButtonMap: { shoot: 0, dribble: 2, tackle: 1, power: 3, sprint: 5 }
  },

  init() {
    window.addEventListener('gamepadconnected', (e) => {
      console.log(`[Gamepad] Conectado no index ${e.gamepad.index}: ${e.gamepad.id}`);
      this.updateGamepadsList();
    });

    window.addEventListener('gamepaddisconnected', (e) => {
      console.log(`[Gamepad] Desconectado do index ${e.gamepad.index}`);
      this.updateGamepadsList();
    });

    this.updateGamepadsList();
  },

  updateGamepadsList() {
    const list = navigator.getGamepads ? navigator.getGamepads() : [];
    this.connectedGamepads = Array.from(list).filter(g => g !== null);
    this.autoAssign();
    if (this.onUpdateCallback) {
      this.onUpdateCallback(this.getStatusText());
    }
  },

  onUpdate(callback) {
    this.onUpdateCallback = callback;
    callback(this.getStatusText());
  },

  getStatusText() {
    if (this.connectedGamepads.length === 0) {
      return 'Nenhum controle detectado. Pressione qualquer botão no controle para ativar.';
    }
    let text = `${this.connectedGamepads.length} controle(s) detectado(s): `;
    this.connectedGamepads.forEach((g, idx) => {
      text += `[#${g.index}] ${g.id.slice(0, 16)}... `;
    });
    return text;
  },

  autoAssign() {
    if (this.connectedGamepads.length > 0) {
      if (this.settings.p1GamepadIndex === null) {
        this.settings.p1GamepadIndex = this.connectedGamepads[0].index;
      }
      if (this.connectedGamepads.length > 1 && this.settings.p2GamepadIndex === null) {
        this.settings.p2GamepadIndex = this.connectedGamepads[1].index;
      }
    }
  },

  getInputs(playerIndex) {
    const targetIdx = playerIndex === 1 ? this.settings.p1GamepadIndex : this.settings.p2GamepadIndex;
    if (targetIdx === null) return null;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[targetIdx];
    if (!gp) return null;

    const deadzone = 1 - (this.settings.sensitivity * 0.08); // Calc deadzone based on sensitivity
    const map = playerIndex === 1 ? this.settings.p1ButtonMap : this.settings.p2ButtonMap;

    let x = 0;
    let y = 0;

    // Read Left Stick
    if (gp.axes && gp.axes.length >= 2) {
      const stickX = gp.axes[0];
      const stickY = gp.axes[1];
      if (Math.abs(stickX) > deadzone) x = stickX;
      if (Math.abs(stickY) > deadzone) y = stickY;
    }

    // Read D-pad fallback (buttons 12, 13, 14, 15)
    if (gp.buttons && gp.buttons.length >= 16) {
      if (gp.buttons[14] && gp.buttons[14].pressed) x = -1; // Left
      if (gp.buttons[15] && gp.buttons[15].pressed) x = 1;  // Right
      if (gp.buttons[12] && gp.buttons[12].pressed) y = -1; // Up
      if (gp.buttons[13] && gp.buttons[13].pressed) y = 1;  // Down
    }

    // Helper to read button presses
    const btnPressed = (btnIndex) => {
      return gp.buttons && gp.buttons[btnIndex] && gp.buttons[btnIndex].pressed;
    };

    return {
      x,
      y,
      shoot: btnPressed(map.shoot),
      dribble: btnPressed(map.dribble),
      tackle: btnPressed(map.tackle),
      power: btnPressed(map.power),
      sprint: btnPressed(map.sprint)
    };
  }
};
export default gamepadService;
