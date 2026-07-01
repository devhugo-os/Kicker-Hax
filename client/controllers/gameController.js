// Kicker Hax - Core Gameplay Controller (Solo vs CPU & Multiplayer Online)
import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { socketService } from '../services/socketService.js';
import { settingsController } from './settingsController.js';
import { menuController } from './menuController.js';
import { soundFx } from '../utils/soundFx.js';
import { showToast } from '../utils/toast.js';
import { ClientBall } from '../models/clientBall.js';
import { ClientPlayer } from '../models/clientPlayer.js';
import * as C from '../../shared/constants.js';
import { ServerPhysics } from '../../server/models/serverPhysics.js';

export const gameController = {
  currentUser: null,

  // Game state
  mode: 'solo', // 'solo' | 'multiplayer'
  difficulty: 'medium',
  score: { red: 0, blue: 0 },
  matchTime: 0,
  goalLimit: 3,
  status: 'lobby',
  countdown: 0,

  // Socket Lobby
  activeRoom: null,

  // Render & Physics Loop
  canvas: null,
  ctx: null,
  ball: null,
  players: [], // ClientPlayer instances
  localPhysicsTick: null,
  keys: new Map(),
  codes: new Map(),

  // Replay
  replayFrames: [],
  inReplay: false,
  replayFrameIdx: 0,
  replayTimer: 0,
  replayBlob: null,
  mediaRecorder: null,
  recordedChunks: [],
  isRecording: false,

  // Local Stats Track
  goalsScored: 0,
  assistsGained: 0,
  savesDone: 0,

  async init(user) {
    this.currentUser = user;
    this.canvas = document.getElementById('match-canvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d', { alpha: false });
    }

    // Input listeners
    window.addEventListener('keydown', (e) => {
      const keyVal = e.key || '';
      const k = keyVal.toLowerCase();
      if (k) {
        this.keys.set(k, true);
      }
      if (e.code) {
        this.codes.set(e.code, true);
      }

      // Disable browser scrolling keys inside active match
      if (router.currentScreenId === 'match-screen') {
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'enter'].includes(k)) {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const keyVal = e.key || '';
      const k = keyVal.toLowerCase();
      if (k) {
        this.keys.set(k, false);
      }
      if (e.code) {
        this.codes.set(e.code, false);
      }
    });

    // Auto Pausa on window blur
    window.addEventListener('blur', () => this.keys.clear());

    // Navigation and View Triggers setup
    this.setupViewTriggers();
    this.bindDOMEvents();

    // Establish WebSocket connection on startup to bind indicators
    try {
      socketService.connect();
      const socket = socketService.getSocket();
      if (socket) {
        socket.on('onlineUsersCount', (count) => {
          const el = document.getElementById('online-users-count');
          if (el) el.textContent = count;
        });
      }
    } catch (e) {
      console.warn("[Socket.IO] Failed to connect on startup:", e);
    }
  },

  setupViewTriggers() {
    // Mode selector back button
    const btnModeBack = document.getElementById('mode-btn-back');
    if (btnModeBack) btnModeBack.onclick = () => router.show('menu-screen');

    // Setup Select Mode cards
    const cardSolo = document.getElementById('mode-card-solo');
    if (cardSolo) {
      cardSolo.onclick = () => {
        this.mode = 'solo';
        router.show('solo-screen');
      };
    }

    const cardMulti = document.getElementById('mode-card-multiplayer');
    if (cardMulti) {
      cardMulti.onclick = () => {
        this.mode = 'multiplayer';
        router.show('multiplayer-screen');
      };
    }

    // Settings / Control navigations
    const btnSoloBack = document.getElementById('solo-btn-back');
    if (btnSoloBack) btnSoloBack.onclick = () => router.show('mode-select-screen');

    const btnMultiBack = document.getElementById('multiplayer-btn-back');
    if (btnMultiBack) btnMultiBack.onclick = () => router.show('mode-select-screen');

    const btnCreateRoomBack = document.getElementById('create-room-btn-back');
    if (btnCreateRoomBack) btnCreateRoomBack.onclick = () => router.show('multiplayer-screen');

    const btnJoinCodeBack = document.getElementById('join-code-btn-back');
    if (btnJoinCodeBack) btnJoinCodeBack.onclick = () => router.show('multiplayer-screen');

    // Register routes hooks
    router.register('multiplayer-screen', {
      onEnter: () => {
        socketService.connect();
        socketService.onPublicRoomsList((rooms) => this.renderRoomsList(rooms));
      },
      onExit: () => {
        socketService.clearListeners();
      }
    });

    router.register('lobby-screen', {
      onEnter: () => {
        socketService.onLobbyUpdate((room) => this.updateLobbyView(room));
        socketService.onChat((msg) => this.appendChatMessage(msg));
        socketService.onMatchStarted(() => {
          showToast('A partida estÃ¡ comeÃ§ando!', 'success');
          router.show('match-screen');
        });
        socketService.onKicked(() => {
          showToast('VocÃª foi expulso do lobby pelo Host.', 'error');
          router.show('multiplayer-screen');
        });
      },
      onExit: () => {
        socketService.clearListeners();
      }
    });

    router.register('match-screen', {
      onEnter: () => {
        soundFx.ensureAudio();
        this.startMatchView();
      },
      onExit: () => {
        this.stopMatchView();
      }
    });

    router.register('ranking-screen', {
      onEnter: () => this.loadRanking('overall')
    });
  },

  bindDOMEvents() {
    // Solo difficulty buttons selector
    const diffButtons = document.querySelectorAll('#solo-ai-difficulty button');
    diffButtons.forEach(btn => {
      btn.onclick = () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.getAttribute('data-diff');
      };
    });

    // Start Solo Button
    const btnSoloStart = document.getElementById('solo-btn-start');
    if (btnSoloStart) {
      btnSoloStart.onclick = () => {
        this.practiceMode = false;
        this.goalLimit = parseInt(document.getElementById('solo-goals').value, 10);
        this.matchTime = parseInt(document.getElementById('solo-minutes').value, 10) * 60;
        router.show('match-screen');
      };
    }

    const btnSoloPractice = document.getElementById('solo-btn-practice');
    if (btnSoloPractice) {
      btnSoloPractice.onclick = () => {
        this.practiceMode = true;
        this.goalLimit = 0;
        this.matchTime = 24 * 60 * 60;
        router.show('match-screen');
      };
    }

    // Lobby interactions
    const btnLobbyLeave = document.getElementById('lobby-btn-leave');
    if (btnLobbyLeave) {
      btnLobbyLeave.onclick = () => {
        socketService.leaveRoom();
        router.show('multiplayer-screen');
      };
    }

    const btnLobbyReady = document.getElementById('lobby-btn-ready');
    if (btnLobbyReady) {
      btnLobbyReady.onclick = () => {
        socketService.toggleReady();
      };
    }

    const btnLobbyStart = document.getElementById('lobby-btn-start');
    if (btnLobbyStart) {
      btnLobbyStart.onclick = () => {
        socketService.startGame();
      };
    }

    // Team Select buttons
    const btnJoinRed = document.getElementById('lobby-btn-join-red');
    if (btnJoinRed) btnJoinRed.onclick = () => socketService.changeTeam('red');

    const btnJoinBlue = document.getElementById('lobby-btn-join-blue');
    if (btnJoinBlue) btnJoinBlue.onclick = () => socketService.changeTeam('blue');

    const btnJoinSpec = document.getElementById('lobby-btn-join-spec');
    if (btnJoinSpec) btnJoinSpec.onclick = () => socketService.changeTeam('spectator');

    // Bot spawns buttons (Host only)
    const btnBotRed = document.getElementById('btn-add-bot-red');
    if (btnBotRed) btnBotRed.onclick = () => socketService.addBot('red');

    const btnBotBlue = document.getElementById('btn-add-bot-blue');
    if (btnBotBlue) btnBotBlue.onclick = () => socketService.addBot('blue');

    // Copy Lobby Code button
    const btnCopyCode = document.getElementById('btn-copy-code');
    if (btnCopyCode) {
      btnCopyCode.onclick = () => {
        const codeText = document.getElementById('lobby-room-code').textContent;
        navigator.clipboard.writeText(codeText).then(() => {
          showToast('CÃ³digo copiado!', 'success');
        });
      };
    }

    // Send chat forms
    const chatForm = document.getElementById('lobby-chat-form');
    if (chatForm) {
      chatForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('lobby-chat-input');
        const txt = input.value.trim();
        if (txt) {
          socketService.sendChatMessage(txt);
          input.value = '';
        }
      };
    }

    // Multiplayer room join action triggers
    const btnMultiCreate = document.getElementById('multi-btn-create-room');
    if (btnMultiCreate) btnMultiCreate.onclick = () => router.show('create-room-screen');

    const btnMultiJoinCode = document.getElementById('multi-btn-join-code');
    if (btnMultiJoinCode) btnMultiJoinCode.onclick = () => router.show('join-code-screen');

    // Create room form submits
    const createRoomForm = document.getElementById('create-room-form');
    if (createRoomForm) {
      createRoomForm.onsubmit = (e) => {
        e.preventDefault();
        const name = document.getElementById('room-name-input').value;
        const pass = document.getElementById('room-password-input').value;
        const max = document.getElementById('room-max-players').value;
        const duration = document.getElementById('room-duration').value;
        const goals = document.getElementById('room-goals').value;

        const sizeSelect = document.getElementById('room-field-size');
        const fieldSize = sizeSelect ? sizeSelect.value : 'medium';
        const showReplay = localStorage.getItem('kicker_hax_show_replay') !== 'false';

        const profile = {
          uid: this.currentUser.uid,
          username: menuController.profileData.username,
          badge: menuController.profileData.badge || 'ðŸ³ï¸'
        };

        socketService.createRoom(name, pass, max, duration, goals, fieldSize, showReplay, profile);

        const s = socketService.getSocket();
        if (s) {
          s.once('roomCreated', (code) => {
            showToast('Lobby criado!', 'success');
            router.show('lobby-screen');
          });
        }
      };
    }

    // Join with Code form
    const joinCodeForm = document.getElementById('join-code-form');
    if (joinCodeForm) {
      joinCodeForm.onsubmit = (e) => {
        e.preventDefault();
        const code = document.getElementById('join-code-input').value.toUpperCase();
        const pass = document.getElementById('join-password-input').value;

        const profile = {
          uid: this.currentUser.uid,
          username: menuController.profileData.username,
          badge: menuController.profileData.badge || 'ðŸ³ï¸'
        };

        socketService.joinRoom(code, pass, profile);

        const s = socketService.getSocket();
        if (s) {
          s.once('joinSuccess', () => {
            showToast('Entrou no lobby com sucesso!', 'success');
            router.show('lobby-screen');
          });

          s.once('joinError', (err) => {
            showToast(err, 'error');
          });
        }
      };
    }

    // In-game Exit Button
    const btnMatchExit = document.getElementById('match-btn-exit');
    if (btnMatchExit) {
      btnMatchExit.onclick = () => {
        if (confirm('Deseja realmente sair da partida?')) {
          if (this.localPhysicsTick) cancelAnimationFrame(this.localPhysicsTick);
          if (soundFx.stopCrowd) soundFx.stopCrowd();

          if (this.mode === 'multiplayer') {
            socketService.leaveRoom();
            router.show('multiplayer-screen');
          } else {
            router.show('solo-screen');
          }
        }
      };
    }

    // Replay controls buttons
    const btnSkipReplay = document.getElementById('btn-skip-replay');
    if (btnSkipReplay) {
      btnSkipReplay.onclick = () => {
        if (this.mode === 'multiplayer') {
          socketService.skipReplay();
        } else {
          this.endReplayPlayback();
        }
      };
    }

    const btnSaveReplay = document.getElementById('btn-save-replay');
    if (btnSaveReplay) {
      btnSaveReplay.onclick = () => {
        this.downloadReplay();
      };
    }

    // In-game chat submit
    const gameChatForm = document.getElementById('game-chat-form');
    if (gameChatForm) {
      gameChatForm.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('game-chat-input');
        const txt = input.value.trim();
        if (txt && this.mode === 'multiplayer') {
          socketService.sendChatMessage(txt);
          input.value = '';
        }
        // Blur
        input.blur();
        gameChatForm.classList.remove('active');
        this.canvas.focus();
      };
    }

    // Bind ranking screens selector filters
    const btnRankWins = document.getElementById('rank-filter-wins');
    const btnRankGoals = document.getElementById('rank-filter-goals');
    const btnRankShots = document.getElementById('rank-filter-shots');
    const btnRankDribbles = document.getElementById('rank-filter-dribbles');
    const btnRankMatches = document.getElementById('rank-filter-matches');
    const btnRankMvps = document.getElementById('rank-filter-mvps');
    const btnRankOverall = document.getElementById('rank-filter-overall');

    if (btnRankWins) btnRankWins.onclick = () => this.loadRanking('wins');
    if (btnRankGoals) btnRankGoals.onclick = () => this.loadRanking('goals');
    if (btnRankShots) btnRankShots.onclick = () => this.loadRanking('shots');
    if (btnRankDribbles) btnRankDribbles.onclick = () => this.loadRanking('dribbles');
    if (btnRankMatches) btnRankMatches.onclick = () => this.loadRanking('matches');
    if (btnRankMvps) btnRankMvps.onclick = () => this.loadRanking('mvps');
    if (btnRankOverall) btnRankOverall.onclick = () => this.loadRanking('overall');

    // Post Game Screen Continue button
    const btnPostContinue = document.getElementById('post-btn-continue');
    if (btnPostContinue) {
      btnPostContinue.onclick = () => {
        if (this.mode === 'multiplayer') {
          router.show('lobby-screen');
        } else {
          router.show('solo-screen');
        }
      };
    }

    // Leaderboard Screen back button
    const btnRankBack = document.getElementById('ranking-btn-back');
    if (btnRankBack) btnRankBack.onclick = () => router.show('menu-screen');
  },

  // ==========================================================================
  // RENDER & MATCH LOGIC
  // ==========================================================================
  startMatchView() {
    this.canvas = document.getElementById('match-canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.recordedChunks = [];
    this.isRecording = false;

    // Apply layout scale sizes from settingsController dimensions
    const dims = settingsController.dimensions;
    this.canvas.width = dims.w;
    this.canvas.height = dims.h;

    // Layout resizing responsive hook
    this.resizeCanvasContainer();
    window.addEventListener('resize', () => this.resizeCanvasContainer());

    // Reset local counters
    this.p1PossessionFrames = 0;
    this.cpuPossessionFrames = 0;
    this.totalPossessionFrames = 0;
    this.p1Shots = 0;
    this.p1Tackles = 0;
    this.p1Dribbles = 0;
    this.shotCooldown = 0;
    this.goalsScored = 0;
    this.assistsGained = 0;
    this.savesDone = 0;
    this.score = { red: 0, blue: 0 };
    this.inReplay = false;

    // Focus lost event listener
    const focusLostBadge = document.getElementById('focus-lost-badge');
    const handleFocusLost = () => {
      if (this.mode === 'multiplayer' && this.isHost) {
        const socket = socketService.getSocket();
        if (socket) socket.emit('hostFocusChanged', { focusLost: true });
      }
    };

    const handleFocusRegained = () => {
      if (this.mode === 'multiplayer' && this.isHost) {
        const socket = socketService.getSocket();
        if (socket) socket.emit('hostFocusChanged', { focusLost: false });
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleFocusLost();
      else handleFocusRegained();
    });
    window.addEventListener('blur', handleFocusLost);
    window.addEventListener('focus', handleFocusRegained);

    this.ball = new ClientBall();
    this.players = [];

    const gameChat = document.getElementById('game-chat-overlay');
    if (gameChat) gameChat.classList.toggle('hidden', this.mode !== 'multiplayer');

    // Initialize Pause Menu Event Handlers once
    this.setupPauseMenu();

    // Bind Escape/Enter/P keys in match to open transparent chat or pause
    window.addEventListener('keydown', (e) => {
      if (router.currentScreenId !== 'match-screen') return;

      if (e.key === 'Enter') {
        const form = document.getElementById('game-chat-form');
        const input = document.getElementById('game-chat-input');
        if (form && input) {
          if (!form.classList.contains('active')) {
            form.classList.add('active');
            input.focus();
          }
        }
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        this.togglePauseMenu();
      }
    });

    if (this.mode === 'solo') {
      this.startLocalSoloMatch();
    } else {
      this.startOnlineMatch();
    }
  },

  resizeCanvasContainer() {
    if (router.currentScreenId !== 'match-screen' || !this.canvas) return;

    const wrap = document.querySelector('.match-wrap');
    const stage = document.getElementById('match-stage');
    if (!wrap || !stage) return;

    const aspect = this.canvas.width / this.canvas.height;
    const availW = window.innerWidth - 80; // paddings and sidebars
    const availH = window.innerHeight - 110; // top HUD and paddings

    let canvasH = availH;
    let canvasW = canvasH * aspect;

    if (canvasW > availW) {
      const scale = availW / canvasW;
      canvasW *= scale;
      canvasH *= scale;
    }

    canvasW = Math.floor(canvasW);
    canvasH = Math.floor(canvasH);

    const leftSidebar = document.getElementById('match-side-left');
    if (this.mode === 'solo') {
      if (leftSidebar) leftSidebar.style.display = 'none';
      stage.style.gridTemplateColumns = `${canvasW}px 150px`;
      stage.style.width = `${canvasW + 150 + 16}px`;
    } else {
      if (leftSidebar) leftSidebar.style.display = 'flex';
      stage.style.gridTemplateColumns = `150px ${canvasW}px 150px`;
      stage.style.width = `${canvasW + 300 + 16}px`;
    }
    stage.style.height = `${canvasH}px`;

    this.canvas.style.width = `${canvasW}px`;
    this.canvas.style.height = `${canvasH}px`;
  },

  // ==========================================================================
  // OFFLINE SOLO MATCH LOOP
  // ==========================================================================
  startLocalSoloMatch() {
    // Reset local stats tracking variables
    this.p1Tackles = 0; this.p1Dribbles = 0;
    this.p2Tackles = 0; this.p2Dribbles = 0;
    this.p1TackleLock = false; this.p1DribbleLock = false;
    this.p2TackleLock = false; this.p2DribbleLock = false;

    // Spawn local players
    const username = menuController.profileData.username;
    const badge = menuController.profileData.badge || 'ðŸ‡§ðŸ‡·';

    // Retrieve selected field size and replay settings
    const sizeSelect = document.getElementById('solo-field-size');
    const fieldSize = sizeSelect ? sizeSelect.value : 'medium';
    this.showReplay = true;

    // Apply dimensions to canvas
    if (fieldSize === 'small') {
      this.canvas.width = 896; this.canvas.height = 560;
    } else if (fieldSize === 'large') {
      this.canvas.width = 1280; this.canvas.height = 768;
    } else {
      this.canvas.width = 1024; this.canvas.height = 640;
    }

    this.resizeCanvasContainer();

    const p1Lobby = { id: 'p1', uid: this.currentUser.uid, username, badge, team: 'blue', cpu: false };
    const cpuLobby = { id: 'cpu', uid: '', username: 'CPU Bot', badge: 'âš™ï¸', team: 'red', cpu: true, difficulty: this.difficulty };

    // Reset match statistics
    this.p1PossessionFrames = 0;
    this.cpuPossessionFrames = 0;
    this.totalPossessionFrames = 0;
    this.p1Shots = 0;
    this.p1Tackles = 0;
    this.p1Dribbles = 0;
    this.shotCooldown = 0;
    this.goalsScored = 0;
    this.assistsGained = 0;
    this.savesDone = 0;

    // Simulate Match logic locally on the client!
    this.status = 'countdown';
    this.countdown = 300;
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;

    // Import server physics simulation locally
    const MatchSim = {
      score: { red: 0, blue: 0 },
      matchTime: this.matchTime,
      status: 'countdown',
      countdownTimer: 300,
      goalFreezeTimer: 0,
      replayBuffer: [],
      replayIndex: 0
    };

    this.localMatchSim = MatchSim;

    const redPlayer = {
      id: 'cpu',
      name: 'CPU Bot',
      badge: 'âš™ï¸',
      team: C.Team.RED,
      cpu: true,
      difficulty: this.difficulty,
      x: C.BORDER + 120,
      y: this.canvas.height * 0.5,
      vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
      stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
      tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
      tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, shootHalo: 0, aiShootLock: 0, aiFeintLock: 0
    };

    const bluePlayer = {
      id: 'p1',
      name: username,
      badge: badge,
      team: C.Team.BLUE,
      cpu: false,
      x: this.canvas.width - C.BORDER - 120,
      y: this.canvas.height * 0.5,
      vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
      stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
      tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
      tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, shootHalo: 0
    };

    const localPlayers = this.practiceMode ? [bluePlayer] : [redPlayer, bluePlayer];
    this.players = localPlayers.map(p => new ClientPlayer(p));

    // Physical ball simulation
    const localBallSim = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
      vx: 0, vy: 0, r: C.BALL_RADIUS, owner: null, lastTouch: null,
      strikeTimer: 0, lastStrikeType: null, noPickupFrames: 0, noPickupFrom: null
    };

    this.localBallSim = localBallSim;

    // Load static physics modules directly on client tick
    (() => {
      const Physics = ServerPhysics;
      let frameSfx = [];
      let lastTime = performance.now();
      const timeStep = 1000 / 60; // 16.67ms per physical tick
      let accumulator = 0;

      const tickLocalGame = (timestamp) => {
        if (router.currentScreenId !== 'match-screen') return;
        try {

        if (typeof timestamp !== 'number') timestamp = performance.now();
        let dt = timestamp - lastTime;
        if (dt > 100) dt = 100; // Cap to avoid freeze spirals
        lastTime = timestamp;
        accumulator += dt;

        const w = this.canvas.width;
        const h = this.canvas.height;
        const gTop = (h - C.GOAL_W_INIT) / 2;
        const gBot = (h + C.GOAL_W_INIT) / 2;
        const leftPostX = C.BORDER - C.POST_T;
        const rightPostX = w - C.BORDER + C.POST_T;
        const leftNetBack = leftPostX - C.GOAL_DEPTH;
        const rightNetBack = rightPostX + C.GOAL_DEPTH;
        const cornerR = 10;
        let inputP1 = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };

        while (accumulator >= timeStep) {
          frameSfx = [];
          if (!this.isPaused) {
          if (MatchSim.status === 'countdown') {
            MatchSim.countdownTimer--;
            if (MatchSim.countdownTimer <= 0) {
              MatchSim.status = 'playing';
            }
          } else if (MatchSim.status === 'freeze') {
            MatchSim.goalFreezeTimer--;
            if (MatchSim.goalFreezeTimer <= 0) {
              // Play replay Locally
              this.inReplay = true;
              this.replayFrames = [...MatchSim.replayBuffer];
              this.replayFrameIdx = 0;
              this.replayTimer = 0;
              document.getElementById('replay-overlay')?.classList.remove('hidden');
              MatchSim.status = 'replay';
              // Set replay duration (accounting for 3x slow motion)
              MatchSim.countdownTimer = (C.GOAL_FREEZE_FRAMES * 2 * 3) + 5;

              // Start local recording
              this.startLocalReplayRecording();
            }
          } else if (MatchSim.status === 'replay') {
            MatchSim.countdownTimer--;
            if (MatchSim.countdownTimer <= 0) {
              this.endReplayPlayback();
              const goalsTotal = MatchSim.score.red >= this.goalLimit || MatchSim.score.blue >= this.goalLimit;
              if (goalsTotal && this.goalLimit > 0) {
                MatchSim.status = 'ended';
                this.localMatchEnd(MatchSim.score);
              } else {
                MatchSim.status = 'countdown';
                MatchSim.countdownTimer = 300;
                resetFieldPositions();
              }
            }
          } else if (MatchSim.status === 'playing') {
            MatchSim.matchTime -= 1 / 60;
            if (MatchSim.matchTime <= 0) {
              MatchSim.matchTime = 0;
              MatchSim.status = 'ended';
              this.localMatchEnd(MatchSim.score);
            }

            // 1) Read P1 keyboard Inputs
            inputP1 = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
            const keysCtrl = settingsController.CTRL_P1;
            if (this.keys.get(keysCtrl.up)) inputP1.y -= 1;
            if (this.keys.get(keysCtrl.down)) inputP1.y += 1;
            if (this.keys.get(keysCtrl.left)) inputP1.x -= 1;
            if (this.keys.get(keysCtrl.right)) inputP1.x += 1;

            if (keysCtrl.sprint.startsWith('Shift')) {
              inputP1.sprint = this.codes.get(keysCtrl.sprint);
            } else {
              inputP1.sprint = this.keys.get(keysCtrl.sprint);
            }
            inputP1.shoot = this.keys.get(keysCtrl.shoot);
            inputP1.dribble = this.keys.get(keysCtrl.dribble);
            inputP1.tackle = this.keys.get(keysCtrl.tackle);
            inputP1.power = this.keys.get(keysCtrl.power);

            // 2) AI bot decision making
            let inputCPU = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
            if (!this.practiceMode && redPlayer.stun <= 0) {
              const ballFuture = { x: localBallSim.x, y: localBallSim.y };
              if (!localBallSim.owner) {
                let vx = localBallSim.vx;
                let vy = localBallSim.vy;
                for (let i = 0; i < 10; i++) {
                  vx *= C.FRICTION_FIELD;
                  vy *= C.FRICTION_FIELD;
                  ballFuture.x += vx;
                  ballFuture.y += vy;
                }
              }

              const distBall = Math.hypot(ballFuture.x - redPlayer.x, ballFuture.y - redPlayer.y);

              // Intelligent Roles setup
              let targetX = ballFuture.x;
              let targetY = ballFuture.y;

              const ballInOurHalf = localBallSim.x < w / 2;

              if (localBallSim.owner === 'cpu') {
                // attacking state
                targetX = rightPostX;
                const oppDist = Math.hypot(bluePlayer.x - redPlayer.x, bluePlayer.y - redPlayer.y);
                if (this.difficulty !== 'easy' && oppDist < 120) {
                  // Dribble feint: steer away from blue player
                  targetY = bluePlayer.y > redPlayer.y ? redPlayer.y - 80 : redPlayer.y + 80;
                  if (this.difficulty === 'hard' && redPlayer.dribble_cd <= 0) {
                    inputCPU.dribble = true;
                  }
                } else {
                  targetY = Physics.clamp(redPlayer.y, gTop + 20, gBot - 20);
                }
              } else if (localBallSim.owner === 'p1') {
                const d = Math.hypot(bluePlayer.x - redPlayer.x, bluePlayer.y - redPlayer.y);
                if (d > 200) {
                  // Defensive marking: block angle between player and our goal (left goal)
                  const defGoalX = C.BORDER;
                  targetX = defGoalX + (bluePlayer.x - defGoalX) * 0.7;
                  targetY = (h * 0.5) + (bluePlayer.y - h * 0.5) * 0.7;
                } else {
                  targetX = bluePlayer.x;
                  targetY = bluePlayer.y;
                }
              } else if (ballInOurHalf && distBall > 260 && this.difficulty !== 'easy') {
                // Goalie defensive stance
                targetX = C.BORDER + 50;
                targetY = Physics.clamp(ballFuture.y, gTop + 10, gBot - 10);
              } else {
                // Pursuing ball
                targetX = ballFuture.x;
                targetY = ballFuture.y;
              }

              let dx = targetX - redPlayer.x;
              let dy = targetY - redPlayer.y;
              let L = Math.hypot(dx, dy) || 1;
              let ax = dx / L;
              let ay = dy / L;

              // difficulty speed factor adjustments
              let speedFactor = 1.0;
              let err = 0;
              if (this.difficulty === 'easy') {
                speedFactor = 0.72;
                err = 0.25;
              } else if (this.difficulty === 'medium') {
                speedFactor = 0.88;
                err = 0.12;
              }

              if (err > 0 && Math.random() < 0.05) {
                ax += Physics.rnd(-err, err);
                ay += Physics.rnd(-err, err);
              }

              inputCPU.x = ax * speedFactor;
              inputCPU.y = ay * speedFactor;

              const wantSprint = (localBallSim.owner === 'cpu' && Math.abs(rightPostX - redPlayer.x) > 200) ||
                                 (!localBallSim.owner && distBall > 120);
              inputCPU.sprint = wantSprint && redPlayer.staminaLock <= 0 && redPlayer.stamina > 0.30;

              // Shoot/Tackle trigger
              if (localBallSim.owner === 'cpu') {
                const distToGoal = Math.abs(rightPostX - redPlayer.x);
                if (distToGoal < 100 || (distToGoal < 160 && redPlayer.y > gTop && redPlayer.y < gBot)) {
                  inputCPU.shoot = true;
                }
              } else if (localBallSim.owner === 'p1') {
                if (distBall < C.TACKLE_RANGE && redPlayer.tackle_cd <= 0 && this.difficulty !== 'easy') {
                  inputCPU.tackle = true;
                }
              }
            }

            // 3) Apply Physics movements and skills
            const applySkills = (p, input) => {
              if (p.stun > 0) return;

              // Tackle
              if (input.tackle && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST) {
                p.stamina = Math.max(0, p.stamina - C.TACKLE_STAM_COST);
                p.tackle_cd = C.TACKLE_CD;
                p.tackleSuccess = false;
                p.tackleEval = 12;
                p.slowTimer = C.TACKLE_SLOW_TIME;
                p.tackleFreeze = 8;
                frameSfx.push('tackle');

                const opp = p.id === 'p1' ? redPlayer : bluePlayer;
                const ang = localBallSim.owner === opp.id ? Math.atan2(opp.y - p.y, opp.x - p.x) : p.dir;
                p.vx += Math.cos(ang) * C.TACKLE_LUNGE;
                p.vy += Math.sin(ang) * C.TACKLE_LUNGE;

                if (localBallSim.owner === opp.id && opp.invuln <= 0 && Math.hypot(opp.x - p.x, opp.y - p.y) <= C.TACKLE_RANGE) {
                  localBallSim.owner = p.id;
                  localBallSim.lastTouch = p.id;
                  localBallSim.noPickupFrames = 10;
                  localBallSim.noPickupFrom = null;
                  localBallSim.vx = 0;
                  localBallSim.vy = 0;

                  opp.stun = Math.max(opp.stun, C.TACKLE_STUN);
                  opp.vx = 0;
                  opp.vy = 0;
                  p.tackleSuccess = true;
                }
              }

              // Dribble
              if (input.dribble && p.dribble_cd <= 0 && localBallSim.owner === p.id && p.stamina >= C.DRIBBLE_STAM_COST) {
                p.stamina = Math.max(0, p.stamina - C.DRIBBLE_STAM_COST);
                p.dash_time = C.DRIBBLE_TIME;
                p.invuln = C.DRIBBLE_INVULN;
                p.dribble_cd = C.DRIBBLE_CD;
                p.vx += Math.cos(p.dir) * C.DRIBBLE_DASH;
                p.vy += Math.sin(p.dir) * C.DRIBBLE_DASH;
                frameSfx.push('dribble');
              }

              // Power Kick
              if (input.power && p.power_cd <= 0 && p.stamina >= 0.50 && (localBallSim.owner === p.id || Math.hypot(p.x - localBallSim.x, p.y - localBallSim.y) < p.r + localBallSim.r + 8)) {
                if (p.id === 'p1') this.p1Shots = (this.p1Shots || 0) + 1;
                p.stamina = Math.max(0, p.stamina - 0.50);
                if (p.stamina === 0) {
                  p.staminaLock = C.STAMINA_LOCK_FRAMES;
                }
                p.power_cd = C.POWER_KICK_CD;
                p.cool = 12;
                p.shootHalo = 22;

                const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
                Physics.powerKick(p, localBallSim, ang, C.POWER_KICK_POWER);
                frameSfx.push('power');
              }

              // Regular Shoot Release
              if (p.kickCharge > 0 && !input.shoot) {
                const nearBall = localBallSim.owner === p.id || Math.hypot(p.x - localBallSim.x, p.y - localBallSim.y) < p.r + localBallSim.r + 14;
                if (nearBall) {
                  const charge = Physics.clamp(p.kickCharge, 0, 1);
                  p.cool = 14;
                  p.shootHalo = 18;
                  const ang = (input.x || input.y) ? Math.atan2(input.y, input.x) : p.dir;
                  const pow = Math.max(C.KICK_BASE, C.KICK_BASE + C.KICK_CHARGE * charge);
                  if (p.id === 'p1') this.p1Shots = (this.p1Shots || 0) + 1;
                  Physics.kickBall(p, localBallSim, ang, pow);
                  frameSfx.push('kick');
                }
                p.kickCharge = 0;
              }
            };

            applySkills(bluePlayer, inputP1);
            if (!this.practiceMode) applySkills(redPlayer, inputCPU);

            Physics.updatePlayerPhysics(bluePlayer, inputP1, localBallSim, (sfx) => frameSfx.push(sfx));
            if (!this.practiceMode) Physics.updatePlayerPhysics(redPlayer, inputCPU, localBallSim, (sfx) => frameSfx.push(sfx));

            Physics.applyLimits(bluePlayer, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w, h);
            if (!this.practiceMode) Physics.applyLimits(redPlayer, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w, h);

            Physics.resolvePlayerPlayer(localPlayers);
            Physics.resolvePlayerBall(localPlayers, localBallSim, () => {
              for (const pl of localPlayers) {
                if (pl.tackleEval > 0 && localBallSim.owner === pl.id) pl.tackleSuccess = true;
              }
            });

            Physics.updateBallPhysics(
              localBallSim, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, localPlayers,
              (sfx) => frameSfx.push(sfx),
              (side) => {
                // Goal triggered offline
                if (side === 'blue') MatchSim.score.blue++; else MatchSim.score.red++;

                // Set last goal detail
                const scorerName = localBallSim.lastTouch === 'p1' ? username : 'CPU Bot';
                const ownGoal = (side === 'blue' && localBallSim.lastTouch === 'cpu') || (side === 'red' && localBallSim.lastTouch === 'p1');
                this.lastGoal = { side, scorerName, ownGoal };

                frameSfx.push('whistle');
                frameSfx.push('goal');
                frameSfx.push('cheer');

                if (this.showReplay) {
                  MatchSim.status = 'freeze';
                  MatchSim.goalFreezeTimer = C.GOAL_FREEZE_FRAMES;
                } else {
                  const goalsTotal = MatchSim.score.red >= this.goalLimit || MatchSim.score.blue >= this.goalLimit;
                  if (goalsTotal && this.goalLimit > 0) {
                    MatchSim.status = 'ended';
                    this.localMatchEnd(MatchSim.score);
                  } else {
                    // Bypass replay, restart directly
                    MatchSim.status = 'countdown';
                    MatchSim.countdownTimer = 300;
                    resetFieldPositions();
                  }
                }
              },
              w, h
            );
          }

          // Record locally for replay frames
          recordLocalFrame();
        }
        accumulator -= timeStep;
      }

        // Render Frame Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawFieldGrid(this.ctx);

        // Update Client elements state LERP
        if (this.inReplay) {
          this.playbackReplay();
        } else {
          // Play occurred synth audio
          frameSfx.forEach(sfx => soundFx.play(sfx));

          // Draw ball and players
          this.ball.x = localBallSim.x;
          this.ball.y = localBallSim.y;
          this.ball.owner = localBallSim.owner;
          this.ball.draw(this.ctx);

          this.players.forEach(p => {
            const phys = p.id === 'p1' ? bluePlayer : redPlayer;
            p.x = phys.x;
            p.y = phys.y;
            p.dir = phys.dir;
            p.stamina = phys.stamina;
            p.staminaLock = phys.staminaLock;
            p.stun = phys.stun;
            p.shootHalo = phys.shootHalo;
            p.invuln = phys.invuln;
            p.draw(this.ctx, localBallSim.owner);
          });
        }

        this.drawNetOverlay(this.ctx);

        // Top scoreboard and HUD
        const m = Math.floor(MatchSim.matchTime / 60);
        const s = Math.floor(MatchSim.matchTime % 60);
        const clockEl = document.getElementById('match-clock');
        const scoreEl = document.getElementById('match-score');

        if (clockEl) clockEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (scoreEl) scoreEl.textContent = `${MatchSim.score.red} : ${MatchSim.score.blue}`;

        // Sidebars update
        const rightStam = document.getElementById('right-stam-fill');
        const rightPow = document.getElementById('right-pow-fill');
        const leftStam = document.getElementById('left-stam-fill');
        const leftPow = document.getElementById('left-pow-fill');

        if (rightStam) rightStam.style.height = `${bluePlayer.stamina * 100}%`;
        if (rightPow) rightPow.style.height = `${bluePlayer.kickCharge * 100}%`;
        if (leftStam) leftStam.style.height = `${redPlayer.stamina * 100}%`;
        if (leftPow) leftPow.style.height = `${redPlayer.kickCharge * 100}%`;

        // Track possession in real-time
        if (localBallSim.owner === 'p1') {
          this.p1PossessionFrames = (this.p1PossessionFrames || 0) + 1;
        } else if (localBallSim.owner === 'cpu') {
          this.cpuPossessionFrames = (this.cpuPossessionFrames || 0) + 1;
        } else {
          if (localBallSim.lastTouch === 'p1') {
            this.p1PossessionFrames = (this.p1PossessionFrames || 0) + 1;
          } else if (localBallSim.lastTouch === 'cpu') {
            this.cpuPossessionFrames = (this.cpuPossessionFrames || 0) + 1;
          }
        }
        this.totalPossessionFrames = (this.totalPossessionFrames || 0) + 1;
        const p1Poss = Math.round(((this.p1PossessionFrames || 0) / (this.totalPossessionFrames || 1)) * 100);

        // Track Tackles and Dribbles counts from state cooldown activations
        if (bluePlayer.tackle_cd > 0 && !this.p1TackleLock) {
          this.p1Tackles = (this.p1Tackles || 0) + 1;
          this.p1TackleLock = true;
        } else if (bluePlayer.tackle_cd === 0) {
          this.p1TackleLock = false;
        }
        if (bluePlayer.dribble_cd > 0 && !this.p1DribbleLock) {
          this.p1Dribbles = (this.p1Dribbles || 0) + 1;
          this.p1DribbleLock = true;
        } else if (bluePlayer.dribble_cd === 0) {
          this.p1DribbleLock = false;
        }

        // Render counts on HUD (VocÃª / P1 only)
        const rightPossEl = document.getElementById('right-stat-possession');
        const rightShotsEl = document.getElementById('right-stat-shots');
        const rightTacklesEl = document.getElementById('right-stat-tackles');
        const rightDribblesEl = document.getElementById('right-stat-dribbles');

        if (rightPossEl) rightPossEl.textContent = `${p1Poss}%`;
        if (rightShotsEl) rightShotsEl.textContent = this.p1Shots || 0;
        if (rightTacklesEl) rightTacklesEl.textContent = this.p1Tackles || 0;
        if (rightDribblesEl) rightDribblesEl.textContent = this.p1Dribbles || 0;

        // Render Countdown Banners
        if (MatchSim.status === 'countdown') {
          const bannerSecs = Math.max(0, Math.ceil(MatchSim.countdownTimer / 60));
          this.drawCenterBanner(`ComeÃ§a em ${bannerSecs}...`, 'Prepare-se!');
        } else if (MatchSim.status === 'freeze') {
          const label = (this.lastGoal && this.lastGoal.ownGoal) ? `GOL CONTRA de ${this.lastGoal.scorerName}` : `GOL DE ${(this.lastGoal && this.lastGoal.scorerName) || '???'}!`;
          this.drawCenterBanner(label, 'Revisando jogada...');
        }

        } catch (tickErr) {
          console.error('[Kicker Solo] Tick error:', tickErr);
        }

        // Loop next frame
        if (MatchSim.status !== 'ended') {
          this.localPhysicsTick = requestAnimationFrame(tickLocalGame);
        }
      };

      const resetFieldPositions = () => {
        const jitterX1 = (Math.random() - 0.5) * 20;
        const jitterY1 = (Math.random() - 0.5) * 20;
        bluePlayer.x = this.canvas.width - C.BORDER - 120 + jitterX1;
        bluePlayer.y = this.canvas.height * 0.5 + jitterY1;
        bluePlayer.vx = bluePlayer.vy = 0;
        bluePlayer.kickCharge = 0;
        bluePlayer.stamina = 1.0;
        bluePlayer.staminaLock = 0;
        bluePlayer.stun = 0;

        const jitterX2 = (Math.random() - 0.5) * 20;
        const jitterY2 = (Math.random() - 0.5) * 20;
        redPlayer.x = C.BORDER + 120 + jitterX2;
        redPlayer.y = this.canvas.height * 0.5 + jitterY2;
        redPlayer.vx = redPlayer.vy = 0;
        redPlayer.kickCharge = 0;
        redPlayer.stamina = 1.0;
        redPlayer.staminaLock = 0;
        redPlayer.stun = 0;

        localBallSim.x = this.canvas.width / 2;
        localBallSim.y = this.canvas.height / 2;
        localBallSim.vx = localBallSim.vy = 0;
        localBallSim.owner = null;
        localBallSim.lastTouch = null;
      };

      const recordLocalFrame = () => {
        const snap = localPlayers.map(p => ({
          x: p.x,
          y: p.y,
          dir: p.dir,
          team: p.team,
          has: (localBallSim.owner === p.id),
          name: p.id === 'p1' ? username : 'CPU Bot',
          badge: p.id === 'p1' ? badge : 'âš™ï¸',
          inv: p.invuln || 0,
          stun: p.stun || 0,
          halo: p.shootHalo || 0
        }));

        const frame = {
          ball: { x: localBallSim.x, y: localBallSim.y },
          players: snap,
          score: { ...MatchSim.score },
          sfx: [...frameSfx]
        };

        MatchSim.replayBuffer.push(frame);
        if (MatchSim.replayBuffer.length > C.GOAL_FREEZE_FRAMES * 2) {
          MatchSim.replayBuffer.shift();
        }
      };

      // Boot local simulation loop
      resetFieldPositions();
      this.localPhysicsTick = requestAnimationFrame(tickLocalGame);
    })();
  },

  localMatchEnd(score) {
    cancelAnimationFrame(this.localPhysicsTick);
    this.stopLocalReplayRecording();

    // Stop background crowd noise to prevent audio leak to menu
    soundFx.stopCrowd();

    showToast('Fim de jogo!', 'info');

    // In Solo match, do NOT save stats or history to Firebase, and do not award XP.
    // Display Post-match Screen directly
    const resultTitle = score.red === score.blue ? 'Empate' : (score.blue > score.red ? 'Vitoria' : 'Derrota');
    document.getElementById('post-result-title').textContent = resultTitle;
    document.getElementById('post-score-red').textContent = score.red;
    document.getElementById('post-score-blue').textContent = score.blue;
    document.getElementById('post-mvp').textContent = score.blue >= score.red ? menuController.profileData.username : 'CPU Bot';
    document.getElementById('post-xp-gained').textContent = `+0 XP (Modo Treino)`;
    router.show('post-game-screen');
  },

  showOnlineMatchEnd(result) {
    showToast('Partida finalizada!', 'info');
    this.stopLocalReplayRecording();

    const score = result?.score || result || { red: 0, blue: 0 };
    const myId = socketService.getSocket().id;
    const localP = this.players.find(p => p.id === myId);
    const isSpec = !localP || localP.team === 'spectator';
    const winnerTeam = result?.winnerTeam || (score.red === score.blue ? 'draw' : (score.blue > score.red ? C.Team.BLUE : C.Team.RED));
    const isDraw = winnerTeam === 'draw';
    const isWin = !isSpec && localP.team === winnerTeam && !isDraw;
    const isLoss = !isSpec && localP.team !== winnerTeam && !isDraw;
    const playerStats = result?.playerStats?.find(stats => stats.playerId === myId) || {};
    const isMvp = !!result?.mvp && result.mvp.playerId === myId;
    const xpGained = isSpec ? 0 : isWin ? 80 : isDraw ? 30 : 15;

    if (!isSpec && !result?.hasBots) {
      firebaseService.saveMatchResult(
        this.currentUser.uid,
        isWin,
        isLoss,
        isDraw,
        playerStats.goals || 0,
        playerStats.shots || this.p1Shots || 0,
        playerStats.dribbles || this.p1Dribbles || 0,
        playerStats.ownGoals || 0,
        isMvp,
        xpGained
      ).then(() => {
        const matchDoc = {
          mode: 'multiplayer',
          date: new Date().toISOString(),
          playerUids: [this.currentUser.uid],
          playerTeams: { [this.currentUser.uid]: localP.team },
          winner: winnerTeam,
          scoreRed: score.red,
          scoreBlue: score.blue
        };
        return firebaseService.addMatchToHistory(matchDoc);
      }).catch(err => console.warn('[Kicker Stats] Falha ao salvar resultado:', err));
    }

    const resultTitle = isDraw ? 'Empate' : `Vitoria do Time ${winnerTeam === C.Team.BLUE ? 'Azul' : 'Vermelho'}`;
    document.getElementById('post-result-title').textContent = resultTitle;
    document.getElementById('post-score-red').textContent = score.red;
    document.getElementById('post-score-blue').textContent = score.blue;
    document.getElementById('post-mvp').textContent = result?.mvp?.username || (winnerTeam === C.Team.BLUE ? 'Time Azul' : winnerTeam === C.Team.RED ? 'Time Vermelho' : 'Empate');
    document.getElementById('post-xp-gained').textContent = isSpec ? 'Espectador' : (result?.hasBots ? '+0 XP (com bot)' : `+${xpGained} XP`);
    router.show('post-game-screen');
  },

  // ==========================================================================
  // ONLINE MULTIPLAYER MATCH LOOP
  // ==========================================================================
  startOnlineMatch() {
    // Reset stats tracking variables for online match
    this.p1Tackles = 0; this.p1Dribbles = 0;
    this.p2Tackles = 0; this.p2Dribbles = 0;
    this.p1TackleLock = false; this.p1DribbleLock = false;
    this.p2TackleLock = false; this.p2DribbleLock = false;

    const socket = socketService.getSocket();
    if (socket) {
      socket.off('fieldSizeUpdated');
      socket.off('matchReset');
    }

    this.status = 'countdown';
    this.countdown = 300;

    // Apply dimensions to canvas from room fieldSize
    if (this.fieldSize === 'small') {
      this.canvas.width = 896; this.canvas.height = 560;
    } else if (this.fieldSize === 'large') {
      this.canvas.width = 1280; this.canvas.height = 768;
    } else {
      this.canvas.width = 1024; this.canvas.height = 640;
    }
    this.resizeCanvasContainer();

    socketService.onGameState((state) => {
      this.status = state.status;
      this.countdown = state.countdown;
      this.score = state.score;
      this.matchTime = state.matchTime;

      // Play sound effects triggered on server
      state.soundEffects.forEach(sfx => soundFx.play(sfx));

      // Update focusLostBadge based on server's host pause state
      const badge = document.getElementById('focus-lost-badge');
      if (badge) {
        if (state.isHostPaused) {
          badge.textContent = 'â¸ï¸ Pausado (Dono da sala fora da aba)';
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      // Update local physical components LERP targets
      this.ball.updateState(state.ball);

      state.players.forEach(sp => {
        let p = this.players.find(x => x.id === sp.id);
        if (!p) {
          p = new ClientPlayer(sp);
          this.players.push(p);
        }
        p.updateState(sp);
      });

      // Clear disconnected players
      const serverIds = state.players.map(x => x.id);
      this.players = this.players.filter(p => serverIds.includes(p.id));
    });

    socketService.getSocket().on('fieldSizeUpdated', ({ size }) => {
      this.fieldSize = size;
      if (size === 'small') {
        this.canvas.width = 896; this.canvas.height = 560;
      } else if (size === 'large') {
        this.canvas.width = 1280; this.canvas.height = 768;
      } else {
        this.canvas.width = 1024; this.canvas.height = 640;
      }
      this.resizeCanvasContainer();
      showToast('O Host alterou o tamanho do campo!', 'info');
    });

    socketService.getSocket().on('matchReset', () => {
      showToast('A partida foi reiniciada pelo Host!', 'info');
      this.p1Tackles = 0; this.p1Dribbles = 0;
      this.p2Tackles = 0; this.p2Dribbles = 0;
    });

    socketService.onPlayReplay(({ replayFrames, goalInfo }) => {
      if (!replayFrames || replayFrames.length === 0) {
        this.lastGoal = goalInfo;
        this.endReplayPlayback();
        return;
      }
      this.inReplay = true;
      this.replayFrames = replayFrames;
      this.replayFrameIdx = 0;
      this.replayTimer = 0;
      this.lastGoal = goalInfo;

      document.getElementById('replay-overlay')?.classList.remove('hidden');

      // Start recording locally for MP4 export
      this.startLocalReplayRecording();
    });

    socketService.onMatchEnded((result) => {
      if (this.inReplay) {
        this.pendingMatchResult = result;
        return;
      }
      this.showOnlineMatchEnd(result);
    });

    // High frequency client tick loop (60Hz animation loop)
    const tickOnlineGame = () => {
      if (router.currentScreenId !== 'match-screen') return;

      // 1) Read local input and emit via WebSocket
      let input = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
      const keysCtrl = settingsController.CTRL_P1;
      if (this.keys.get(keysCtrl.up)) input.y -= 1;
      if (this.keys.get(keysCtrl.down)) input.y += 1;
      if (this.keys.get(keysCtrl.left)) input.x -= 1;
      if (this.keys.get(keysCtrl.right)) input.x += 1;

      if (keysCtrl.sprint.startsWith('Shift')) {
        input.sprint = this.codes.get(keysCtrl.sprint);
      } else {
        input.sprint = this.keys.get(keysCtrl.sprint);
      }
      input.shoot = this.keys.get(keysCtrl.shoot);
      input.dribble = this.keys.get(keysCtrl.dribble);
      input.tackle = this.keys.get(keysCtrl.tackle);
      input.power = this.keys.get(keysCtrl.power);

      // Emit inputs to server
      socketService.sendGameInput(input);

      // 2) Render Frame
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawFieldGrid(this.ctx);

      if (this.inReplay) {
        this.playbackReplay();
      } else {
        // Interpolate ball and players positions locally (LERP)
        this.ball.interpolate(0.35);
        this.ball.draw(this.ctx);

        this.players.forEach(p => {
          p.interpolate(0.35);
          p.draw(this.ctx, this.ball.owner);
        });
      }

      this.drawNetOverlay(this.ctx);

      // Refresh HUD Score clock
      const m = Math.floor(this.matchTime / 60);
      const s = Math.floor(this.matchTime % 60);
      const clockEl = document.getElementById('match-clock');
      const scoreEl = document.getElementById('match-score');

      if (clockEl) clockEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (scoreEl) scoreEl.textContent = `${this.score.red} : ${this.score.blue}`;

      // Refresh sidebars (stamina / power / speed / tackles / dribbles)
      const myId = socketService.getSocket().id;
      const me = this.players.find(p => p.id === myId);
      const opp = this.players.find(p => p.id !== myId && p.team !== 'spectator');

      if (me) {
        const myStam = document.getElementById('right-stam-fill');
        const myPow = document.getElementById('right-pow-fill');
        if (myStam) myStam.style.height = `${me.stamina * 100}%`;

        // Read local kick charge if shoot held
        let localCharge = 0;
        if (input.shoot) localCharge = 1; // display simple kick glow
        if (myPow) myPow.style.height = `${localCharge * 100}%`;

        // Track possession in real-time
        if (opp) {
          if (this.ball.owner === me.id) {
            this.p1PossessionFrames = (this.p1PossessionFrames || 0) + 1;
          } else if (this.ball.owner === opp.id) {
            this.cpuPossessionFrames = (this.cpuPossessionFrames || 0) + 1;
          } else {
            if (this.ball.lastTouch === me.id) {
              this.p1PossessionFrames = (this.p1PossessionFrames || 0) + 1;
            } else if (this.ball.lastTouch === opp.id) {
              this.cpuPossessionFrames = (this.cpuPossessionFrames || 0) + 1;
            }
          }
          this.totalPossessionFrames = (this.totalPossessionFrames || 0) + 1;
        }
        const p1Poss = Math.round(((this.p1PossessionFrames || 0) / (this.totalPossessionFrames || 1)) * 100);

        // Track Shots on Goal
        if (this.shotCooldown > 0) {
          this.shotCooldown--;
        }
        const p1NearBall = Math.hypot(me.x - this.ball.x, me.y - this.ball.y) < C.PLAYER_RADIUS + C.BALL_RADIUS + 12;
        if (p1NearBall && input.shoot && !this.shotCooldown) {
          const ang = Math.atan2(this.ball.y - me.y, this.ball.x - me.x);
          const isAttackingRight = me.team === C.Team.BLUE;
          if ((isAttackingRight && Math.cos(ang) > 0.2) || (!isAttackingRight && Math.cos(ang) < -0.2)) {
            this.p1Shots = (this.p1Shots || 0) + 1;
            this.shotCooldown = 30;
          }
        }

        // Tackle count
        if (me.tackle_cd > 0 && !this.p1TackleLock) {
          this.p1Tackles = (this.p1Tackles || 0) + 1;
          this.p1TackleLock = true;
        } else if (me.tackle_cd === 0) {
          this.p1TackleLock = false;
        }
        // Dribble count
        if (me.dribble_cd > 0 && !this.p1DribbleLock) {
          this.p1Dribbles = (this.p1Dribbles || 0) + 1;
          this.p1DribbleLock = true;
        } else if (me.dribble_cd === 0) {
          this.p1DribbleLock = false;
        }

        const rightPossEl = document.getElementById('right-stat-possession');
        const rightShotsEl = document.getElementById('right-stat-shots');
        const rightTacklesEl = document.getElementById('right-stat-tackles');
        const rightDribblesEl = document.getElementById('right-stat-dribbles');
        if (rightPossEl) rightPossEl.textContent = `${p1Poss}%`;
        if (rightShotsEl) rightShotsEl.textContent = this.p1Shots || 0;
        if (rightTacklesEl) rightTacklesEl.textContent = this.p1Tackles || 0;
        if (rightDribblesEl) rightDribblesEl.textContent = this.p1Dribbles || 0;
      }

      if (opp) {
        const oppStam = document.getElementById('left-stam-fill');
        const oppPow = document.getElementById('left-pow-fill');
        if (oppStam) oppStam.style.height = `${opp.stamina * 100}%`;
        if (oppPow) oppPow.style.height = `${(opp.kickCharge || 0) * 100}%`;
      }

      // Render countdown banner
      if (this.status === 'countdown') {
        this.drawCenterBanner(`ComeÃ§a em ${this.countdown}...`, 'Prepare-se!');
      } else if (this.status === 'freeze') {
        const label = this.lastGoal.ownGoal ? `GOL CONTRA de ${this.lastGoal.scorerName}` : `GOL DE ${this.lastGoal.scorerName}!`;
        this.drawCenterBanner(label, 'Revisando jogada...', true);
      }

      this.localPhysicsTick = requestAnimationFrame(tickOnlineGame);
    };

    this.localPhysicsTick = requestAnimationFrame(tickOnlineGame);
  },

  stopMatchView() {
    cancelAnimationFrame(this.localPhysicsTick);
    this.stopLocalReplayRecording();
    soundFx.stopCrowd();
    socketService.clearListeners();
    document.getElementById('replay-overlay')?.classList.add('hidden');
    window.removeEventListener('resize', () => this.resizeCanvasContainer());
  },

  // ==========================================================================
  // REPLAY CAPTURE & EXPORT (MP4 LOCAL REC)
  // ==========================================================================
  startLocalReplayRecording() {
    if (!this.canvas || this.isRecording) return;

    try {
      const stream = this.canvas.captureStream(30); // 30 FPS stream

      // Get Web Audio API mixed stream
      const audioDest = soundFx.getRecordingStreamDestination();
      if (audioDest) {
        const audioTracks = audioDest.stream.getAudioTracks();
        audioTracks.forEach(track => stream.addTrack(track));
      }

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.replayBlob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.isRecording = false;

        // Show save button
        const saveBtn = document.getElementById('btn-save-replay');
        if (saveBtn) saveBtn.style.display = 'inline-block';
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (e) {
      console.warn("Replay recording not supported on this browser.", e);
    }
  },

  stopLocalReplayRecording() {
    if (this.mediaRecorder && this.isRecording) {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }
  },

  downloadReplay() {
    if (!this.replayBlob) return;
    const url = URL.createObjectURL(this.replayBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KickerHax-Replay-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Replay baixado com sucesso!', 'success');
  },

  playbackReplay() {
    if (this.replayFrames.length === 0) return;

    this.replayTimer++;
    // Tick playback speed to 1/3 speed (slow motion)
    if (this.replayTimer % 3 === 0) {
      this.replayFrameIdx++;
      if (this.replayFrameIdx >= this.replayFrames.length) {
        this.endReplayPlayback();
        if (this.mode === 'solo' && this.localMatchSim) {
          this.localMatchSim.countdownTimer = 0;
        }
        return;
      }
    }

    const frame = this.replayFrames[Math.min(this.replayFrameIdx, this.replayFrames.length - 1)];
    if (!frame) return;

    // Trigger local audio triggers synced with frames
    if (this.replayTimer % 3 === 0) {
      frame.sfx.forEach(sfx => soundFx.play(sfx));
    }

    // Render replay frame directly
    // Ball
    ctxBallDraw(this.ctx, frame.ball.x, frame.ball.y);

    // Players
    frame.players.forEach(p => {
      ctxPlayerDraw(this.ctx, p.x, p.y, p.team, p.name, p.badge, p.halo, p.inv, p.stun, p.has);
    });

    // Replay text info
    const captionEl = document.getElementById('replay-caption');
    if (captionEl && this.lastGoal) {
      const label = this.lastGoal.ownGoal ? `GOL CONTRA de ${this.lastGoal.scorerName}` : `GOL DE ${this.lastGoal.scorerName}!`;
      captionEl.textContent = label;
      captionEl.style.display = 'block';
    }
  },

  endReplayPlayback() {
    this.inReplay = false;
    this.stopLocalReplayRecording();
    document.getElementById('replay-overlay')?.classList.add('hidden');
    const captionEl = document.getElementById('replay-caption');
    if (captionEl) captionEl.style.display = 'none';

    // Resume persistent stadium audio
    soundFx.ensureAudio();

    if (this.pendingMatchResult) {
      const pending = this.pendingMatchResult;
      this.pendingMatchResult = null;
      this.showOnlineMatchEnd(pending);
    }
  },

  // ==========================================================================
  // CANVAS RENDERING HELPERS
  // ==========================================================================
  drawSpeedPad(cx, x, y, active) {
    cx.save();
    // Glowing outer circle
    cx.shadowColor = '#00f0ff';
    cx.shadowBlur = active ? 16 : 8;
    cx.fillStyle = active ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 240, 255, 0.18)';
    cx.strokeStyle = '#00f0ff';
    cx.lineWidth = 2.5;
    cx.beginPath();
    cx.arc(x, y, 32, 0, Math.PI * 2);
    cx.fill();
    cx.stroke();

    // Glowing arrows inside pointing in motion direction (Right-Up for top, Left-Down for bottom)
    cx.fillStyle = '#00f0ff';
    cx.beginPath();
    if (x < this.canvas.width / 2) {
      // Top pad arrows point top-right
      cx.moveTo(x - 6, y + 6);
      cx.lineTo(x + 10, y - 10);
      cx.lineTo(x + 2, y - 10);
      cx.lineTo(x + 10, y - 10);
      cx.lineTo(x + 10, y - 2);
    } else {
      // Bottom pad arrows point bottom-left
      cx.moveTo(x + 6, y - 6);
      cx.lineTo(x - 10, y + 10);
      cx.lineTo(x - 2, y + 10);
      cx.lineTo(x - 10, y + 10);
      cx.lineTo(x - 10, y + 2);
    }
    cx.strokeStyle = '#00f0ff';
    cx.lineWidth = 3;
    cx.stroke();
    cx.restore();
  },

  drawFieldGrid(cx) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gTop = (h - C.GOAL_W_INIT) / 2;
    const gBot = (h + C.GOAL_W_INIT) / 2;

    // 1) Concrete background outer zone (Stands / Arquibancada)
    cx.fillStyle = '#1e293b';
    cx.fillRect(0, 0, w, h);

    // Draw stands rows outside C.BORDER
    cx.strokeStyle = '#334155';
    cx.lineWidth = 2;
    for (let offset = 4; offset < C.BORDER - 8; offset += 6) {
      cx.strokeRect(offset, offset, w - offset * 2, h - offset * 2);
    }

    // Populate stands with simplified crowds (tiny colored dots)
    cx.save();
    // seedable random to keep spectator dots static per frame
    let crowdSeed = 12345;
    const pseudoRandom = () => {
      let x = Math.sin(crowdSeed++) * 10000;
      return x - Math.floor(x);
    };

    for (let x = 8; x < w - 8; x += 12) {
      for (let y = 8; y < h - 8; y += 12) {
        // Only draw if outside the grass boundary
        const outsideX = x < C.BORDER - 8 || x > w - C.BORDER + 8;
        const outsideY = y < C.BORDER - 8 || y > h - C.BORDER + 8;
        if ((outsideX || outsideY) && pseudoRandom() < 0.35) {
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#94a3b8'];
          cx.fillStyle = colors[Math.floor(pseudoRandom() * colors.length)];
          cx.beginPath();
          cx.arc(x, y, 2.5, 0, Math.PI * 2);
          cx.fill();
        }
      }
    }
    cx.restore();

    // 2) Grass pitch background (Alternating stripes)
    cx.fillStyle = '#2e7d32'; // Base dark green
    cx.fillRect(C.BORDER - 8, C.BORDER - 8, w - 2 * C.BORDER + 16, h - 2 * C.BORDER + 16);

    // Draw stripes
    const stripeCount = 14;
    const stripeW = (w - 2 * C.BORDER + 16) / stripeCount;
    cx.fillStyle = '#388e3c'; // Lighter green
    for (let i = 0; i < stripeCount; i += 2) {
      cx.fillRect(C.BORDER - 8 + i * stripeW, C.BORDER - 8, stripeW, h - 2 * C.BORDER + 16);
    }

    // 3) White Chalk Field Lines
    cx.save();
    cx.strokeStyle = '#ffffff';
    cx.lineWidth = 3;

    // Field Boundary
    cx.strokeRect(C.BORDER, C.BORDER, w - 2 * C.BORDER, h - 2 * C.BORDER);

    // Center Line
    cx.beginPath();
    cx.moveTo(w / 2, C.BORDER);
    cx.lineTo(w / 2, h - C.BORDER);
    cx.stroke();

    // Center Circle
    cx.beginPath();
    cx.arc(w / 2, h / 2, 72, 0, Math.PI * 2);
    cx.stroke();

    // Center point
    cx.beginPath();
    cx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
    cx.fillStyle = '#ffffff';
    cx.fill();

    // 4) Area penalty boxes
    // Left Team area
    cx.strokeRect(C.BORDER, (h - 260) / 2, 140, 260); // Grande area
    cx.strokeRect(C.BORDER, (h - 110) / 2, 50, 110);  // Pequena area
    // Penalty Spot
    cx.beginPath();
    cx.arc(C.BORDER + 100, h / 2, 3, 0, Math.PI * 2);
    cx.fill();

    // Right Team area
    cx.strokeRect(w - C.BORDER - 140, (h - 260) / 2, 140, 260); // Grande area
    cx.strokeRect(w - C.BORDER - 50, (h - 110) / 2, 50, 110);  // Pequena area
    // Penalty Spot
    cx.beginPath();
    cx.arc(w - C.BORDER - 100, h / 2, 3, 0, Math.PI * 2);
    cx.fill();

    // Corner flag arcs
    const cornerArcR = 12;
    cx.lineWidth = 2;
    // Top-Left
    cx.beginPath(); cx.arc(C.BORDER, C.BORDER, cornerArcR, 0, Math.PI * 0.5); cx.stroke();
    // Bottom-Left
    cx.beginPath(); cx.arc(C.BORDER, h - C.BORDER, cornerArcR, -Math.PI * 0.5, 0); cx.stroke();
    // Top-Right
    cx.beginPath(); cx.arc(w - C.BORDER, C.BORDER, cornerArcR, Math.PI * 0.5, Math.PI); cx.stroke();
    // Bottom-Right
    cx.beginPath(); cx.arc(w - C.BORDER, h - C.BORDER, cornerArcR, Math.PI, -Math.PI * 0.5); cx.stroke();
    cx.restore();

    // 5) Corner flags drawing
    const drawFlag = (fx, fy, angle) => {
      cx.save();
      cx.translate(fx, fy);
      cx.rotate(angle);
      // Pole
      cx.strokeStyle = '#fbbf24';
      cx.lineWidth = 2;
      cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(-6, -6); cx.stroke();
      // Flag banner
      cx.fillStyle = '#ef4444';
      cx.beginPath();
      cx.moveTo(-6, -6);
      cx.lineTo(-12, -4);
      cx.lineTo(-8, -10);
      cx.closePath();
      cx.fill();
      cx.restore();
    };
    drawFlag(C.BORDER, C.BORDER, 0);
    drawFlag(C.BORDER, h - C.BORDER, -Math.PI * 0.5);
    drawFlag(w - C.BORDER, C.BORDER, Math.PI * 0.5);
    drawFlag(w - C.BORDER, h - C.BORDER, Math.PI);



    // 7) Goals concrete background bases
    cx.fillStyle = '#0f172a';
    cx.fillRect(C.BORDER - C.POST_T, gTop, C.POST_T, C.GOAL_W_INIT);
    cx.fillRect(w - C.BORDER, gTop, C.POST_T, C.GOAL_W_INIT);

    // Goal Nets inner background
    cx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    cx.fillRect(C.BORDER - C.POST_T - C.GOAL_DEPTH, gTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
    cx.fillRect(w - C.BORDER + C.POST_T, gTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
  },

  drawNetOverlay(cx) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gTop = (h - C.GOAL_W_INIT) / 2;
    const gBot = (h + C.GOAL_W_INIT) / 2;

    cx.fillStyle = '#0f172a';
    cx.fillRect(C.BORDER - C.POST_T, gTop, C.POST_T, C.GOAL_W_INIT);
    cx.fillRect(w - C.BORDER, gTop, C.POST_T, C.GOAL_W_INIT);

    cx.save();
    cx.strokeStyle = 'rgba(255,255,255,.18)';
    cx.lineWidth = 1;
    cx.beginPath();

    // Draw net lines left
    for (let x = C.BORDER - C.POST_T - C.GOAL_DEPTH; x <= C.BORDER - C.POST_T; x += 10) {
      cx.moveTo(x, gTop); cx.lineTo(x, gBot);
    }
    for (let y = gTop; y <= gBot; y += 10) {
      cx.moveTo(C.BORDER - C.POST_T - C.GOAL_DEPTH, y); cx.lineTo(C.BORDER - C.POST_T, y);
    }

    // Draw net lines right
    for (let x = w - C.BORDER + C.POST_T; x <= w - C.BORDER + C.POST_T + C.GOAL_DEPTH; x += 10) {
      cx.moveTo(x, gTop); cx.lineTo(x, gBot);
    }
    for (let y = gTop; y <= gBot; y += 10) {
      cx.moveTo(w - C.BORDER + C.POST_T, y); cx.lineTo(w - C.BORDER + C.POST_T + C.GOAL_DEPTH, y);
    }
    cx.stroke();
    cx.restore();
  },

  drawCenterBanner(title, subtitle, isCelebration = false) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;

    const bannerW = 640;
    const bannerH = 140;
    const x = w / 2 - bannerW / 2;
    const y = h * 0.25;

    if (isCelebration) {
      // Golden/Orange glowing gradient for goal celebration!
      const grad = this.ctx.createLinearGradient(x, y, x + bannerW, y);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.95)'); // Amber
      grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.95)'); // Red
      grad.addColorStop(1, 'rgba(245, 158, 11, 0.95)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(x, y, bannerW, bannerH);

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(x + 0.5, y + 0.5, bannerW - 1, bannerH - 1);

      // Scaling pulse animation
      const scale = 1.0 + Math.sin(Date.now() / 150) * 0.05;
      this.ctx.translate(w / 2, y + 45);
      this.ctx.scale(scale, scale);

      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '900 32px Outfit';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
      this.ctx.shadowBlur = 10;
      this.ctx.fillText(title, 0, 0);
      this.ctx.restore();

      // Draw subtitle
      this.ctx.save();
      this.ctx.globalAlpha = 0.95;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '700 16px Inter';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(subtitle, w / 2, y + 95);
      this.ctx.restore();
    } else {
      // Normal banner
      this.ctx.fillStyle = 'rgba(7, 11, 25, 0.9)';
      this.ctx.fillRect(x, y, bannerW, bannerH);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      this.ctx.strokeRect(x + 0.5, y + 0.5, bannerW - 1, bannerH - 1);

      this.ctx.fillStyle = '#e2e8f0';
      this.ctx.font = '800 24px Outfit';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(title, w / 2, y + 50);

      this.ctx.font = '600 15px Inter';
      this.ctx.fillStyle = '#60a5fa';
      this.ctx.fillText(subtitle, w / 2, y + 90);
      this.ctx.restore();
    }
  },

  // ==========================================================================
  // MULTIPLAYER LOBBY UI RENDERERS
  // ==========================================================================
  renderRoomsList(rooms) {
    const tbody = document.getElementById('rooms-list-body');
    if (!tbody) return;

    rooms = rooms.filter(room => room.status === 'lobby');

    if (rooms.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    rooms.forEach(r => {
      const tr = document.createElement('tr');
      const security = (r.hasPassword || r.password) ? 'Senha' : 'Publica';

      tr.innerHTML = `
        <td><strong>${r.name}</strong></td>
        <td>${r.playersCount}/${r.maxPlayers}</td>
        <td>${r.duration} min</td>
        <td>${r.goalLimit} gols</td>
        <td>${security}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${r.code}">Entrar</button></td>
      `;
      tbody.appendChild(tr);

      const joinBtn = document.getElementById(`join-btn-${r.code}`);
      if (joinBtn) {
        joinBtn.onclick = () => {
          if (r.hasPassword || r.password) {
            const pass = prompt('Digite a senha da sala:');
            if (pass !== null) this.joinRoomWithCode(r.code, pass);
          } else {
            this.joinRoomWithCode(r.code, '');
          }
        };
      }
    });
  },

  joinRoomWithCode(code, password) {
    const profile = {
      uid: this.currentUser.uid,
      username: menuController.profileData.username,
      badge: menuController.profileData.badge || 'ðŸ³ï¸'
    };
    socketService.joinRoom(code, password, profile);
    socketService.getSocket().once('joinSuccess', () => {
      showToast('Entrou na sala!', 'success');
      router.show('lobby-screen');
    });
    socketService.getSocket().once('joinError', (err) => {
      showToast(err, 'error');
    });
  },

  updateLobbyView(room) {
    if (!room) return;
    this.activeRoom = room;
    this.fieldSize = room.fieldSize || 'medium';
    this.showReplay = room.showReplay !== undefined ? room.showReplay : true;

    document.getElementById('lobby-room-name').textContent = room.name;
    document.getElementById('lobby-room-code').textContent = room.code;
    document.getElementById('lobby-setting-time').textContent = `${room.duration}m`;
    document.getElementById('lobby-setting-goals').textContent = room.goalLimit === 0 ? 'Sem Limite' : room.goalLimit;

    const sizeMap = { small: 'Pequeno', medium: 'MÃ©dio', large: 'Grande' };
    const sizeEl = document.getElementById('lobby-setting-size');
    if (sizeEl) sizeEl.textContent = sizeMap[this.fieldSize] || 'MÃ©dio';

    const replayEl = document.getElementById('lobby-setting-replay');
    if (replayEl) replayEl.textContent = this.showReplay ? 'Sim' : 'NÃ£o';

    const myId = socketService.getSocket().id;
    const isHost = room.hostId === myId;
    this.isHost = isHost;

    // Toggle Host controls visibility
    const startBtn = document.getElementById('lobby-btn-start');
    const botControls = document.getElementById('lobby-host-bot-controls');

    if (startBtn) startBtn.classList.toggle('hidden', !isHost);
    if (botControls) botControls.classList.toggle('hidden', !isHost);

    // Render lists of Red, Blue, Spectators
    const redPlayersList = document.getElementById('lobby-red-players');
    const bluePlayersList = document.getElementById('lobby-blue-players');
    const specPlayersList = document.getElementById('lobby-spec-players');

    if (redPlayersList) redPlayersList.innerHTML = '';
    if (bluePlayersList) bluePlayersList.innerHTML = '';
    if (specPlayersList) specPlayersList.innerHTML = '';

    room.players.forEach(p => {
      const row = document.createElement('div');
      row.className = 'lobby-player-row';

      const isSpec = p.team === 'spectator';
      const readyBadge = isSpec ? '' : `<span class="ready-badge ${p.ready ? 'ready' : ''}">${p.ready ? 'Pronto' : 'Aguardando'}</span>`;
      const kickAction = isHost && p.id !== myId && !p.cpu ? `<button class="kick-btn" id="kick-btn-${p.id}">âŒ</button>` : '';
      const removeBotAction = isHost && p.cpu ? `<button class="kick-btn" id="remove-bot-btn-${p.id}">âŒ</button>` : '';

      row.innerHTML = `
        <span class="lobby-player-name"><span>${p.badge}</span> <span>${p.username}</span></span>
        <span class="lobby-player-meta">
          ${readyBadge}
          ${kickAction}
          ${removeBotAction}
        </span>
      `;

      if (p.team === 'red') redPlayersList?.appendChild(row);
      else if (p.team === 'blue') bluePlayersList?.appendChild(row);
      else specPlayersList?.appendChild(row);

      // Hook actions
      const kickBtn = document.getElementById(`kick-btn-${p.id}`);
      if (kickBtn) {
        kickBtn.onclick = () => {
          socketService.kickPlayer(p.id);
        };
      }

      const removeBotBtn = document.getElementById(`remove-bot-btn-${p.id}`);
      if (removeBotBtn) {
        removeBotBtn.onclick = () => {
          socketService.removeBot(p.id);
        };
      }
    });

    // Populate Lobby chat messages initial state
    const chatContainer = document.getElementById('lobby-chat-messages');
    if (chatContainer) {
      chatContainer.innerHTML = '';
      room.chatHistory.forEach(msg => this.appendChatMessage(msg));
    }
  },

  appendChatMessage(msg, isLocalGame = false) {
    const containers = [
      document.getElementById('lobby-chat-messages'),
      document.getElementById('game-chat-messages')
    ];

    containers.forEach(chatList => {
      if (!chatList) return;

      const isLobby = chatList.id === 'lobby-chat-messages';

      const el = document.createElement('div');
      const isSystem = msg.username === 'Sistema';
      el.className = `chat-msg ${isSystem ? 'system' : ''}`;

      const badgeText = msg.badge ? `<span>${msg.badge}</span> ` : '';
      el.innerHTML = `
        <span class="msg-time">[${msg.time}]</span>
        <span class="msg-sender">${badgeText}${msg.username}:</span>
        <span class="msg-text">${msg.text}</span>
      `;
      chatList.appendChild(el);

      // Auto scroll bottom
      chatList.scrollTop = chatList.scrollHeight;
    });
  },

  // ==========================================================================
  // RANKINGS LOADER
  // ==========================================================================
  async loadRanking(filter = 'overall') {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="9" class="text-center">Carregando dados da tabela...</td></tr>`;

    // Filters active toggles
    const btnWins = document.getElementById('rank-filter-wins');
    const btnGoals = document.getElementById('rank-filter-goals');
    const btnShots = document.getElementById('rank-filter-shots');
    const btnDribbles = document.getElementById('rank-filter-dribbles');
    const btnMatches = document.getElementById('rank-filter-matches');
    const btnMvps = document.getElementById('rank-filter-mvps');
    const btnOverall = document.getElementById('rank-filter-overall');

    [btnWins, btnGoals, btnShots, btnDribbles, btnMatches, btnMvps, btnOverall].forEach(b => b?.classList.remove('active'));
    if (filter === 'wins') btnWins?.classList.add('active');
    if (filter === 'goals') btnGoals?.classList.add('active');
    if (filter === 'shots') btnShots?.classList.add('active');
    if (filter === 'dribbles') btnDribbles?.classList.add('active');
    if (filter === 'matches') btnMatches?.classList.add('active');
    if (filter === 'mvps') btnMvps?.classList.add('active');
    if (filter === 'overall') btnOverall?.classList.add('active');

    try {
      const records = await firebaseService.getGlobalRanking(filter, 10);
      if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center">Nenhum jogador registrado no ranking.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      records.forEach((r, idx) => {
        const winrate = (r.wins + r.losses) > 0 ? Math.round((r.wins / (r.wins + r.losses)) * 100) : 0;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>#${idx + 1}</strong></td>
          <td><span>${r.badge}</span> <strong>${r.displayName || r.username}</strong></td>
          <td>${r.matchesPlayed || 0}</td>
          <td class="text-success">${r.wins}</td>
          <td>${r.goals}</td>
          <td>${r.shots || 0}</td>
          <td>${r.dribbles || 0}</td>
          <td>${r.mvps || 0}</td>
          <td>${winrate}%</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>`;
    }
  },

  togglePauseMenu() {
    const modal = document.getElementById('pause-modal');
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      if (this.mode === 'solo') {
        this.isPaused = true;
      } else if (this.mode === 'multiplayer' && this.isHost) {
        socketService.hostSetPaused(true);
      }

      const hostCtrl = document.getElementById('host-controls');
      if (hostCtrl) {
        const canSeePanel = this.mode === 'solo' || this.mode === 'multiplayer';
        hostCtrl.style.display = canSeePanel ? 'block' : 'none';
        this.populateHostControls(this.mode === 'solo' || this.isHost);
      }
    } else {
      modal.classList.add('hidden');
      if (this.mode === 'solo') {
        this.isPaused = false;
      } else if (this.mode === 'multiplayer' && this.isHost) {
        socketService.hostSetPaused(false);
      }
    }
  },

  populateHostControls(canControl) {
    const note = document.getElementById('host-controls-note');
    const resetBtn = document.getElementById('pause-btn-reset-match');
    const addOneBtn = document.getElementById('pause-btn-add-1m');
    const addThreeBtn = document.getElementById('pause-btn-add-3m');
    const panel = document.getElementById('host-team-panel');

    if (note) {
      note.textContent = canControl
        ? 'Gerencie tempo, reinicio e times da partida.'
        : 'Somente o host pode alterar esta partida.';
    }
    if (resetBtn) resetBtn.disabled = !canControl;
    [addOneBtn, addThreeBtn].forEach(btn => {
      if (btn) btn.disabled = !canControl || this.mode !== 'multiplayer';
    });

    if (addOneBtn) addOneBtn.onclick = () => canControl && this.mode === 'multiplayer' && socketService.hostAddTime(60);
    if (addThreeBtn) addThreeBtn.onclick = () => canControl && this.mode === 'multiplayer' && socketService.hostAddTime(180);
    if (!panel) return;

    panel.innerHTML = '';
    if (this.mode !== 'multiplayer') {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'flex';
    const roster = this.activeRoom?.players?.length
      ? this.activeRoom.players
      : this.players.map(p => ({
        id: p.id,
        username: p.username || p.name || 'Jogador',
        badge: p.badge || '',
        team: p.team === C.Team.RED ? 'red' : 'blue',
        cpu: !!p.cpu
      }));

    roster.filter(p => p.team !== 'spectator').forEach(player => {
      const row = document.createElement('div');
      row.className = 'host-player-row';
      row.innerHTML = `
        <span class="host-player-name">${player.badge || ''} ${player.username}</span>
        <button class="btn btn-sm btn-danger" data-team="red">Vermelho</button>
        <button class="btn btn-sm btn-primary" data-team="blue">Azul</button>
        <button class="btn btn-sm btn-secondary" data-kick="true">Expulsar</button>
      `;

      row.querySelectorAll('button').forEach(btn => {
        btn.disabled = !canControl || player.cpu;
        btn.onclick = () => {
          if (!canControl) return;
          if (btn.dataset.kick) {
            socketService.kickPlayer(player.id);
            return;
          }
          socketService.hostChangeTeam(player.id, btn.dataset.team);
        };
      });

      panel.appendChild(row);
    });
  },

  setupPauseMenu() {
    const resumeBtn = document.getElementById('pause-btn-resume');
    if (resumeBtn) {
      resumeBtn.onclick = () => {
        this.togglePauseMenu();
      };
    }

    const exitBtn = document.getElementById('pause-btn-exit-match');
    if (exitBtn) {
      exitBtn.onclick = () => {
        this.togglePauseMenu();
        const exitMatchBtn = document.getElementById('match-btn-exit');
        if (exitMatchBtn) exitMatchBtn.click();
      };
    }

    const resetBtn = document.getElementById('pause-btn-reset-match');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (this.mode === 'solo') {
          this.score = { red: 0, blue: 0 };
          this.p1Tackles = 0; this.p1Dribbles = 0;
          this.p2Tackles = 0; this.p2Dribbles = 0;

          if (this.localMatchSim) {
            this.localMatchSim.score = { red: 0, blue: 0 };
            this.localMatchSim.status = 'countdown';
            this.localMatchSim.countdownTimer = 300;
            this.localBallSim.x = this.canvas.width / 2;
            this.localBallSim.y = this.canvas.height / 2;
            this.localBallSim.vx = 0;
            this.localBallSim.vy = 0;
          }
          showToast('Partida reiniciada!', 'success');
        } else if (this.mode === 'multiplayer') {
          socketService.getSocket().emit('hostResetMatch');
        }
        this.togglePauseMenu();
      };
    }
  }
};

// Replay canvas direct drawing helpers to prevent class overhead
function ctxBallDraw(cx, x, y) {
  cx.fillStyle = 'rgba(0,0,0,.25)';
  cx.beginPath();
  cx.ellipse(x + 3, y + 6, C.BALL_RADIUS * 1.1, C.BALL_RADIUS * 0.6, 0, 0, Math.PI * 2);
  cx.fill();

  const g = cx.createRadialGradient(x - 5, y - 5, 4, x, y, C.BALL_RADIUS);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#bfc8d6');

  cx.fillStyle = g;
  cx.beginPath();
  cx.arc(x, y, C.BALL_RADIUS, 0, Math.PI * 2);
  cx.fill();
}

function ctxPlayerDraw(cx, x, y, team, name, badge, halo, inv, stun, hasBall) {
  // Trail details
  ctxPlayerShadow(cx, x, y);

  cx.beginPath();
  cx.arc(x, y, C.PLAYER_RADIUS, 0, Math.PI * 2);
  cx.fillStyle = team === C.Team.RED ? '#ef4444' : '#3b82f6';
  cx.fill();
  cx.lineWidth = 2;
  cx.strokeStyle = 'rgba(0,0,0,.45)';
  cx.stroke();

  if (halo > 0) {
    cx.strokeStyle = '#000000';
    cx.lineWidth = 2;
    cx.beginPath();
    cx.arc(x, y, C.PLAYER_RADIUS + 2, 0, Math.PI * 2);
    cx.stroke();
  }

  if (badge) {
    cx.fillStyle = '#0b1020';
    cx.font = `700 16px system-ui, sans-serif`;
    cx.textAlign = 'center';
    cx.textBaseline = 'middle';
    cx.fillText(badge, x, y);
  }

  if (inv > 0) {
    cx.strokeStyle = '#22c55e';
    cx.setLineDash([4, 4]);
    cx.beginPath();
    cx.arc(x, y, C.PLAYER_RADIUS + 4, 0, Math.PI * 2);
    cx.stroke();
    cx.setLineDash([]);
  }

  if (stun > 0) {
    cx.strokeStyle = '#ef4444';
    cx.beginPath();
    cx.arc(x, y, C.PLAYER_RADIUS + 2, 0, Math.PI * 2);
    cx.stroke();
  }

  if (hasBall) {
    cx.fillStyle = 'rgba(255,255,255,.85)';
    cx.beginPath();
    cx.moveTo(x, y - C.PLAYER_RADIUS - 10);
    cx.lineTo(x - 6, y - C.PLAYER_RADIUS - 2);
    cx.lineTo(x + 6, y - C.PLAYER_RADIUS - 2);
    cx.closePath();
    cx.fill();
  }

  if (name) {
    cx.fillStyle = '#e2e8f0';
    cx.font = '700 12px system-ui';
    cx.textAlign = 'center';
    cx.fillText(name, x, y - C.PLAYER_RADIUS - 14);
  }
}

function ctxPlayerShadow(cx, x, y) {
  cx.fillStyle = 'rgba(0,0,0,.25)';
  cx.beginPath();
  cx.ellipse(x + 4, y + 8, C.PLAYER_RADIUS * 1.1, C.PLAYER_RADIUS * 0.6, 0, 0, Math.PI * 2);
  cx.fill();
}
export default gameController;
