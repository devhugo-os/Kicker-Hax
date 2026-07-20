// Kicker Hax - Core Gameplay Controller (Solo vs CPU & Multiplayer Online)
import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { socketService } from '../services/socketService.js';
import { DEFAULT_MOBILE_HUD, settingsController } from './settingsController.js';
import { menuController } from './menuController.js';
import { soundFx } from '../utils/soundFx.js';
import { showToast } from '../utils/toast.js';
import { confirmDialog, promptDialog } from '../utils/dialog.js';
import { ClientBall } from '../models/clientBall.js';
import { ClientPlayer } from '../models/clientPlayer.js';
import * as C from '../../shared/constants.js';
import { ServerPhysics } from '../../server/models/serverPhysics.js';
import { getEquippedSkin } from '../data/skins.js';
import { drawSkinImage } from '../utils/skinRenderer.js';
import { normalizeMatchTeam, resolvePlayerMatchOutcome } from '../utils/matchResult.js';
import { escapeHtml } from '../utils/safeHtml.js';
import { appendStaffTag, drawStaffTagOnCanvas } from '../utils/staffTags.js';
import { isMobilePhoneDevice, shouldUseMobileHud } from '../utils/deviceCapabilities.js';
import { drawPowerKickBallEffect, getPowerKickShakeOffset } from '../utils/powerKickFx.js';
import { TutorialSession, tutorialNeedsAlly, tutorialNeedsBall, tutorialNeedsEnemy } from '../tutorial/tutorialSession.js';
import { getPossessionConfidenceScore, getRatingConfidenceScore, getWinRateConfidenceScore } from '../utils/rankingScore.js';
import { buildMatchReport } from '../../shared/matchReport.js';
import { renderMatchReport } from '../components/matchReportView.js';
import { buildLiveMatchReport } from '../replay/liveMatchReport.js';
import {
  estimateServerClockOffset,
  getReplayPosition,
  getSynchronizedReplayStart,
  interpolateReplayFrame
} from '../replay/goalReplay.js';
import { getMatchRecordingId, MatchRecordingSession } from '../replay/matchRecording.js';

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
  hudEditorMode: false,
  tutorialMode: false,
  tutorialSession: null,

  // Socket Lobby
  activeRoom: null,
  onlineMatchMeta: null,
  lastOnlineActionInput: {},
  localActionSoundUntil: {},
  lastMatchReadySentAt: 0,

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
  replayFallbackTimer: null,
  onlineMatchFinished: false,
  replayFrameIdx: 0,
  replayTimer: 0,
  replayBlob: null,
  mediaRecorder: null,
  recordedChunks: [],
  isRecording: false,
  matchRecording: null,
  recordingFinalizePromise: null,
  serverClockOffsetMs: 0,
  phaseEndsAt: 0,
  fieldCacheCanvas: null,
  fieldCacheKey: '',

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
      if (this.isTypingTarget(e.target)) {
        if (e.key === 'Enter' && router.currentScreenId === 'match-screen') e.stopPropagation();
        return;
      }
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
        if (k === 'tab') {
          e.preventDefault();
          if (!e.repeat) {
            const modal = document.getElementById('live-match-report-modal');
            this.showLiveMatchReport(!!modal?.classList.contains('hidden'));
          }
          return;
        }
        if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'enter'].includes(k)) {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (this.isTypingTarget(e.target)) return;
      const keyVal = e.key || '';
      const k = keyVal.toLowerCase();
      if (k) {
        this.keys.set(k, false);
      }
      if (e.code) {
        this.codes.set(e.code, false);
      }
      if (router.currentScreenId === 'match-screen' && k === 'tab') {
        e.preventDefault();
      }
    });

    // Auto Pausa on window blur
    window.addEventListener('blur', () => this.keys.clear());

    // Navigation and View Triggers setup
    this.setupViewTriggers();
    this.bindDOMEvents();
    this.setupMobileControls();

    // Establish WebSocket connection on startup to bind indicators
    try {
      socketService.connect();
      const socket = socketService.getSocket();
      if (socket) {
        socket.on('onlineUsersCount', (count) => {
          document.querySelectorAll('#online-users-count, [data-online-users-count]').forEach(el => {
            el.textContent = count;
          });
        });
      }
    } catch (e) {
      console.warn("[Socket.IO] Failed to connect on startup:", e);
    }
  },

  isTypingTarget(target = document.activeElement) {
    if (!target) return false;
    const tag = target.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
  },

  clearPressedKeys() {
    this.keys.clear();
    this.codes.clear();
    this.virtualInput = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
  },

  async exitCurrentMatch() {
    if (this.tutorialMode) {
      this.tutorialMode = false;
      router.show('mode-select-screen');
      return;
    }
    const competitiveSurrender = this.mode === 'multiplayer' && !!this.activeRoom?.competitive;
    const shouldExit = await confirmDialog({
      title: competitiveSurrender ? 'Desistir da partida?' : 'Sair da partida?',
      message: competitiveSurrender
        ? 'Se seu time ficar vazio, o adversário vence por W.O. Caso ainda existam companheiros, eles votarão se desejam continuar.'
        : 'Você voltará para o menu e perderá a partida em andamento.',
      confirmLabel: competitiveSurrender ? 'Desistir' : 'Sair da partida',
      danger: true
    });
    if (!shouldExit) return;

    if (competitiveSurrender) {
      document.getElementById('pause-modal')?.classList.add('hidden');
      this.pauseMenuOpen = false;
      socketService.off('surrenderAccepted');
      socketService.once('surrenderAccepted', () => {
        this.onlineMatchFinished = true;
        this.activeRoom = null;
        this.clearRoomChatViews();
        // A guest can close its transport after the host reserved its roster
        // entry. The browser-host keeps authority alive for the remaining team.
        if (!socketService.isHost) socketService.leaveRoom();
        router.show('multiplayer-screen');
        showToast('Desistência registrada. Seu antigo time decidirá se continua.', 'info');
      });
      socketService.surrenderMatch();
      return;
    }
    if (this.localPhysicsTick) cancelAnimationFrame(this.localPhysicsTick);
    if (soundFx.stopCrowd) soundFx.stopCrowd();

    if (this.mode === 'multiplayer') {
      socketService.leaveRoom();
      router.show('multiplayer-screen');
    } else if (this.practiceMode) {
      router.show('mode-select-screen');
    } else {
      router.show('solo-screen');
    }
  },

  isTouchDevice() {
    // Viewport dimensions are intentionally ignored: browser zoom must never
    // switch a desktop player to the mobile HUD or remove the HUD from the app.
    return shouldUseMobileHud(navigator, {
      cordova: !!window.cordova,
      search: window.location.search,
      coarsePointer: !!window.matchMedia?.('(pointer: coarse)').matches
    });
  },

  isMobilePhone() {
    return isMobilePhoneDevice(navigator);
  },

  /**
   * Makes a mobile tackle commit to the ball. The virtual stick is deliberately
   * ignored for this short lunge so an existing movement direction cannot pull
   * the player away from the tackle target.
   */
  applyMobileTackleAssist(input, player, ball) {
    if (!this.isMobilePhone() || !this.virtualInput?.tackle || !input.tackle || !player || !ball) return;
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1 || distance > C.TACKLE_RANGE * 2.1) return;
    input.x = dx / distance;
    input.y = dy / distance;
    input.mobileTackleAssist = true;
  },

  flushMobileOnlineInput() {
    if (this.mode !== 'multiplayer' || router.currentScreenId !== 'match-screen' || this.hudEditorMode) return;
    const localId = socketService.getSocket().id;
    const player = this.players?.find(item => item.id === localId);
    if (!player) return;
    const input = { ...this.virtualInput };
    this.applyMobileTackleAssist(input, player, this.ball);
    socketService.sendGameInput(input);
  },

  setupMobileControls() {
    this.virtualInput = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
    const controls = document.getElementById('mobile-controls');
    if (!controls) return;

    const recomputeDirections = () => {
      const active = this.mobileDirections || new Set();
      this.virtualInput.x = (active.has('right') ? 1 : 0) - (active.has('left') ? 1 : 0);
      this.virtualInput.y = (active.has('down') ? 1 : 0) - (active.has('up') ? 1 : 0);
    };

    this.mobileDirections = new Set();
    const stick = document.getElementById('mobile-stick');
    const knob = document.getElementById('mobile-stick-knob');
    const resetStick = () => {
      this.virtualInput.x = 0;
      this.virtualInput.y = 0;
      if (knob) knob.style.transform = 'translate(-50%, -50%)';
      this.flushMobileOnlineInput();
    };
    const updateStick = (e) => {
      if (this.hudEditorMode) return;
      if (!stick || !knob) return;
      const rect = stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = Math.max(24, rect.width * 0.36);
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const len = Math.hypot(dx, dy) || 1;
      const limited = Math.min(max, len);
      const nx = (dx / len) * limited;
      const ny = (dy / len) * limited;
      this.virtualInput.x = Math.max(-1, Math.min(1, dx / max));
      this.virtualInput.y = Math.max(-1, Math.min(1, dy / max));
      knob.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
      this.flushMobileOnlineInput();
    };
    if (stick) {
      stick.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        stick.setPointerCapture?.(e.pointerId);
        updateStick(e);
      });
      stick.addEventListener('pointermove', (e) => {
        if (e.pressure === 0 && e.buttons === 0) return;
        e.preventDefault();
        updateStick(e);
      });
      ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(eventName => {
        stick.addEventListener(eventName, (e) => {
          e.preventDefault();
          resetStick();
        });
      });
    }

    controls.querySelectorAll('[data-mobile-dir]').forEach(btn => {
      const dir = btn.dataset.mobileDir;
      const press = (e) => {
        e.preventDefault();
        if (this.hudEditorMode) return;
        this.mobileDirections.add(dir);
        recomputeDirections();
      };
      const release = (e) => {
        e.preventDefault();
        this.mobileDirections.delete(dir);
        recomputeDirections();
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
    });

    controls.querySelectorAll('[data-mobile-action]').forEach(btn => {
      const action = btn.dataset.mobileAction;
      const press = (e) => {
        e.preventDefault();
        if (this.hudEditorMode) return;
        this.virtualInput[action] = true;
        this.flushMobileOnlineInput();
      };
      const release = (e) => {
        e.preventDefault();
        this.virtualInput[action] = false;
        this.flushMobileOnlineInput();
      };
      btn.addEventListener('pointerdown', press);
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
    });

    [
      controls,
      document.getElementById('mobile-chat-toggle'),
      document.getElementById('mobile-stats-toggle'),
      document.getElementById('mobile-pause-toggle')
    ].forEach(el => {
      el?.addEventListener('contextmenu', (event) => event.preventDefault());
      el?.setAttribute('draggable', 'false');
    });
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
        this.practiceMode = false;
        this.tutorialMode = false;
        router.show('solo-screen');
      };
    }

    const cardPractice = document.getElementById('mode-card-practice');
    if (cardPractice) {
      cardPractice.onclick = () => {
        this.mode = 'solo';
        this.practiceMode = true;
        this.tutorialMode = false;
        this.goalLimit = 0;
        this.matchTime = 24 * 60 * 60;
        router.show('match-screen');
      };
    }

    const cardTutorial = document.getElementById('mode-card-tutorial');
    if (cardTutorial) {
      cardTutorial.onclick = () => {
        this.mode = 'solo';
        this.practiceMode = true;
        this.tutorialMode = true;
        this.goalLimit = 0;
        this.matchTime = 24 * 60 * 60;
        router.show('match-screen');
      };
    }

    const cardMulti = document.getElementById('mode-card-multiplayer');
    if (cardMulti) {
      cardMulti.onclick = () => {
        this.mode = 'multiplayer';
        this.practiceMode = false;
        this.tutorialMode = false;
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
        socketService.off('matchRejoined');
        socketService.on('matchRejoined', (payload) => {
          this.activeRoom = payload?.lobbyInfo || this.activeRoom;
          this.fieldSize = this.activeRoom?.fieldSize || 'medium';
          this.onlineMatchMeta = { rejoined: true, matchId: payload?.matchId || null };
          router.show('match-screen');
          showToast('Voce voltou para a partida.', 'success');
        });
        socketService.refreshPublicRooms();
        this.refreshRejoinMatchAction();
      },
      onExit: ({ to } = {}) => {
        if (to !== 'match-screen') {
          socketService.clearListeners();
        }
      }
    });

    router.register('lobby-screen', {
      onEnter: () => {
        requestAnimationFrame(() => this.scrollChatToLatest('lobby-chat-messages'));
        if (this.activeRoom?.code) {
          const pendingRoom = this.activeRoom;
          socketService.getPublicRoomMeta(pendingRoom.code).then(roomMeta => {
            if (!roomMeta) {
              this.activeRoom = null;
              this.clearRoomChatViews();
              socketService.leaveRoom();
              router.show('multiplayer-screen');
              socketService.refreshPublicRooms();
              return;
            }
            if (router.currentScreenId === 'lobby-screen' && this.activeRoom?.code === pendingRoom.code) {
              this.updateLobbyView(this.activeRoom);
            }
          }).catch(() => {
            this.activeRoom = null;
            this.clearRoomChatViews();
            socketService.leaveRoom();
            router.show('multiplayer-screen');
            socketService.refreshPublicRooms();
          });
        } else {
          router.show('multiplayer-screen');
          socketService.refreshPublicRooms();
          return;
        }
        socketService.getSocket().off('startError');
        socketService.getSocket().off('hostLeft');
        socketService.getSocket().off('roomChatCleared');
        socketService.onLobbyUpdate((room) => this.updateLobbyView(room));
        socketService.onChat((msg) => this.appendChatMessage(msg));
        socketService.onChatRateLimited?.(({ retryAfterMs }) => {
          showToast(`Aguarde ${Math.max(1, Math.ceil(Number(retryAfterMs || 0) / 1000))}s para enviar outra mensagem.`, 'info');
        });
        socketService.onMatchStarted((matchMeta) => {
          this.onlineMatchMeta = matchMeta || null;
          if (!socketService.isHost && this.currentUser?.uid && this.activeRoom?.code) {
            localStorage.setItem(`kicker_hax_rejoin_${this.currentUser.uid}`, JSON.stringify({
              code: this.activeRoom.code,
              matchId: matchMeta?.matchId || null,
              savedAt: Date.now()
            }));
          }
          showToast('A partida está começando!', 'success');
          router.show('match-screen');
        });
        socketService.off('matchRejoined');
        socketService.on('matchRejoined', (payload) => {
          this.activeRoom = payload?.lobbyInfo || this.activeRoom;
          this.fieldSize = this.activeRoom?.fieldSize || 'medium';
          this.onlineMatchMeta = { rejoined: true, matchId: payload?.matchId || null };
          showToast('Voce voltou para a partida.', 'success');
          router.show('match-screen');
        });
        socketService.getSocket().on('startError', (msg) => showToast(msg, 'error'));
        socketService.onKicked(() => {
          showToast('Você foi expulso do lobby pelo Host.', 'error');
          router.show('multiplayer-screen');
        });
        socketService.getSocket().on('hostLeft', (msg) => {
          this.activeRoom = null;
          this.clearRoomChatViews();
          socketService.leaveRoom();
          showToast(msg || 'O host saiu. A sala foi encerrada.', 'error');
          router.show('multiplayer-screen');
        });
        socketService.getSocket().on('roomChatCleared', () => this.clearRoomChatViews());
      },
      onExit: ({ to } = {}) => {
        if (to !== 'match-screen') {
          socketService.clearListeners();
        }
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
      onEnter: () => this.loadRanking('general')
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

    const btnLobbyRandomTeams = document.getElementById('lobby-btn-random-teams');
    if (btnLobbyRandomTeams) {
      btnLobbyRandomTeams.onclick = () => socketService.hostRandomizeTeams();
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
          showToast('Código copiado!', 'success');
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
    if (btnMultiCreate) btnMultiCreate.onclick = async () => {
      if (await this.blockMatchmakingWhileReserved()) return;
      router.show('create-room-screen');
    };

    const btnMultiJoinCode = document.getElementById('multi-btn-join-code');
    if (btnMultiJoinCode) btnMultiJoinCode.onclick = async () => {
      if (await this.blockMatchmakingWhileReserved()) return;
      router.show('join-code-screen');
    };

    const btnRefreshRooms = document.getElementById('multi-btn-refresh-rooms');
    if (btnRefreshRooms) btnRefreshRooms.onclick = () => socketService.refreshPublicRooms();

    // Create room form submits
    const createRoomForm = document.getElementById('create-room-form');
    if (createRoomForm) {
      createRoomForm.onsubmit = async (e) => {
        e.preventDefault();
        if (await this.blockMatchmakingWhileReserved()) return;
        const name = document.getElementById('room-name-input').value.trim();
        const pass = document.getElementById('room-password-input').value;
        if (!name || name.length > C.ROOM_NAME_MAX_LENGTH) return showToast(`O nome da sala deve ter entre 1 e ${C.ROOM_NAME_MAX_LENGTH} caracteres.`, 'error');
        if (pass.length > C.ROOM_PASSWORD_MAX_LENGTH) return showToast(`A senha pode ter no máximo ${C.ROOM_PASSWORD_MAX_LENGTH} caracteres.`, 'error');
        const competitiveInput = document.getElementById('room-competitive-input');
        const competitive = !!competitiveInput?.checked && !pass;
        const max = document.getElementById('room-max-players').value;
        const duration = competitive ? '5' : document.getElementById('room-duration').value;
        const goals = competitive ? '0' : document.getElementById('room-goals').value;

        const sizeSelect = document.getElementById('room-field-size');
        const fieldSize = competitive ? 'medium' : (sizeSelect ? sizeSelect.value : 'medium');
        const showReplay = localStorage.getItem('kicker_hax_show_replay') !== 'false';

        let profile = {
          uid: this.currentUser.uid,
          username: menuController.profileData.username,
          badge: menuController.profileData.badge || '🏳️',
          skin: getEquippedSkin(menuController.profileData).image,
          skinId: menuController.profileData.equippedSkinId || 'rookie',
          staffRole: menuController.profileData.staffRole || ''
        };

        const s = socketService.getSocket();
        if (s) {
          const submitButton = createRoomForm.querySelector('button[type="submit"]');
          submitButton?.setAttribute('disabled', 'disabled');
          const unlockForm = () => submitButton?.removeAttribute('disabled');
          s.once('roomCreated', (code) => {
            unlockForm();
            showToast('Lobby criado!', 'success');
            const room = socketService.serverRoom?.getLobbyInfo();
            if (room) {
              this.activeRoom = room;
              this.updateLobbyView(room);
            }
            router.show('lobby-screen');
          });
          s.once('createRoomError', (err) => {
            unlockForm();
            showToast(err, 'error');
          });
        }
        socketService.createRoom(name, pass, max, duration, goals, fieldSize, showReplay, profile, competitive);
      };
    }

    // Join with Code form
    const joinCodeForm = document.getElementById('join-code-form');
    if (joinCodeForm) {
      const codeInput = document.getElementById('join-code-input');
      const passwordContainer = document.getElementById('join-password-container');
      if (passwordContainer) passwordContainer.classList.add('hidden');
      if (codeInput) {
        codeInput.addEventListener('input', async () => {
          const code = codeInput.value.toUpperCase();
          codeInput.value = code;
          if (code.length !== 6 || !passwordContainer) {
            passwordContainer?.classList.add('hidden');
            return;
          }
          const meta = await socketService.getPublicRoomMeta(code).catch(() => null);
          passwordContainer.classList.toggle('hidden', !meta?.hasPassword);
        });
      }

      joinCodeForm.onsubmit = async (e) => {
        e.preventDefault();
        if (await this.blockMatchmakingWhileReserved()) return;
        const code = document.getElementById('join-code-input').value.toUpperCase();
        const passContainer = document.getElementById('join-password-container');
        const pass = passContainer && !passContainer.classList.contains('hidden')
          ? document.getElementById('join-password-input').value
          : '';

        let profile = {
          uid: this.currentUser.uid,
          username: menuController.profileData.username,
          badge: menuController.profileData.badge || '🏳️',
          skin: getEquippedSkin(menuController.profileData).image,
          skinId: menuController.profileData.equippedSkinId || 'rookie',
          staffRole: menuController.profileData.staffRole || ''
        };

        const roomMeta = await socketService.getPublicRoomMeta(code).catch(() => null);
        if (!roomMeta) return showToast('A sala não existe mais ou o host está desconectado.', 'error');
        this.registerJoinResult(
          (joinData) => {
            const room = joinData?.lobbyInfo;
            if (room) {
              this.activeRoom = room;
              this.updateLobbyView(room);
            }
            showToast('Entrou no lobby com sucesso!', 'success');
            router.show('lobby-screen');
          }
        );
        localStorage.setItem(`kicker_hax_last_room_${this.currentUser.uid}`, JSON.stringify({ code, password: pass }));
        socketService.joinRoom(code, pass, profile);
      };
    }

    document.getElementById('match-btn-exit')?.addEventListener('click', () => this.exitCurrentMatch());

    // Replay controls buttons
    const btnSkipReplay = document.getElementById('replay-vote-skip-btn');
    if (btnSkipReplay) {
      btnSkipReplay.onclick = () => {
        if (this.mode === 'multiplayer') {
          socketService.skipReplay();
        } else {
          // Local simulations do not have a socket host to advance the replay
          // timer. Flag the next physics step to perform the normal kickoff.
          if (this.localMatchSim) this.localMatchSim.skipReplayRequested = true;
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
    document.getElementById('live-match-report-close')?.addEventListener('click', () => {
      this.showLiveMatchReport(false);
    });
    document.getElementById('live-match-report-modal')?.addEventListener('click', event => {
      if (event.target?.id === 'live-match-report-modal') this.showLiveMatchReport(false);
    });

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
        // Sending a message is the explicit end of chat input. Blur the field
        // so the next keys immediately control the player again.
        gameChatForm.classList.add('active');
        document.getElementById('game-chat-overlay')?.classList.remove('hidden');
        input.blur();
        this.clearPressedKeys();
      };
    }

    const roomPasswordInput = document.getElementById('room-password-input');
    const roomCompetitiveInput = document.getElementById('room-competitive-input');
    const roomDurationSelect = document.getElementById('room-duration');
    const roomGoalsSelect = document.getElementById('room-goals');
    const roomFieldSelect = document.getElementById('room-field-size');
    const lockCompetitiveSelect = (el, value, label) => {
      if (!el) return;
      if (!el.dataset.defaultOptions) {
        el.dataset.defaultOptions = el.innerHTML;
      }
      el.innerHTML = `<option value="${value}">Padrão Competitiva - ${label}</option>`;
      el.value = value;
      el.disabled = true;
    };
    const restoreCompetitiveSelect = (el) => {
      if (!el) return;
      if (el.dataset.defaultOptions) {
        el.innerHTML = el.dataset.defaultOptions;
      }
      el.disabled = false;
    };
    const applyCreateRoomLocks = () => {
      const isPrivate = !!roomPasswordInput?.value;
      const isCompetitive = !!roomCompetitiveInput?.checked && !isPrivate;
      if (roomCompetitiveInput) {
        if (isPrivate) roomCompetitiveInput.checked = false;
        roomCompetitiveInput.disabled = isPrivate;
      }
      if (isCompetitive) {
        lockCompetitiveSelect(roomDurationSelect, '5', '5 minutos');
        lockCompetitiveSelect(roomGoalsSelect, '0', 'sem limite de gols');
        lockCompetitiveSelect(roomFieldSelect, 'medium', 'campo automático no início');
      } else {
        restoreCompetitiveSelect(roomDurationSelect);
        restoreCompetitiveSelect(roomGoalsSelect);
        restoreCompetitiveSelect(roomFieldSelect);
      }
    };
    if (roomPasswordInput && roomCompetitiveInput) {
      roomPasswordInput.addEventListener('input', applyCreateRoomLocks);
      roomCompetitiveInput.addEventListener('change', applyCreateRoomLocks);
    }

    // Bind ranking screens selector filters
    const btnRankWins = document.getElementById('rank-filter-wins');
    const btnRankGoals = document.getElementById('rank-filter-goals');
    const btnRankShots = document.getElementById('rank-filter-shots');
    const btnRankDribbles = document.getElementById('rank-filter-dribbles');
    const btnRankAssists = document.getElementById('rank-filter-assists');
    const btnRankMatches = document.getElementById('rank-filter-matches');
    const btnRankMvps = document.getElementById('rank-filter-mvps');
    const btnRankOverall = document.getElementById('rank-filter-overall');
    const btnRankWinrate = document.getElementById('rank-filter-winrate');
    const btnRankLevel = document.getElementById('rank-filter-level');
    const btnRankGeneral = document.getElementById('rank-filter-general');
    const btnRankLosses = document.getElementById('rank-filter-losses');
    const btnRankDraws = document.getElementById('rank-filter-draws');
    const btnRankOwnGoals = document.getElementById('rank-filter-own-goals');
    const btnRankTackles = document.getElementById('rank-filter-tackles');
    const btnRankPossession = document.getElementById('rank-filter-possession');
    const btnRankRating = document.getElementById('rank-filter-rating');
    const btnRankCoins = document.getElementById('rank-filter-coins');
    const btnRankSkins = document.getElementById('rank-filter-skins');

    if (btnRankGeneral) btnRankGeneral.onclick = () => this.loadRanking('general');
    if (btnRankWins) btnRankWins.onclick = () => this.loadRanking('wins');
    if (btnRankLosses) btnRankLosses.onclick = () => this.loadRanking('losses');
    if (btnRankDraws) btnRankDraws.onclick = () => this.loadRanking('draws');
    if (btnRankGoals) btnRankGoals.onclick = () => this.loadRanking('goals');
    if (btnRankOwnGoals) btnRankOwnGoals.onclick = () => this.loadRanking('ownGoals');
    if (btnRankShots) btnRankShots.onclick = () => this.loadRanking('shots');
    if (btnRankDribbles) btnRankDribbles.onclick = () => this.loadRanking('dribbles');
    if (btnRankAssists) btnRankAssists.onclick = () => this.loadRanking('assists');
    if (btnRankTackles) btnRankTackles.onclick = () => this.loadRanking('tackles');
    if (btnRankPossession) btnRankPossession.onclick = () => this.loadRanking('possession');
    if (btnRankRating) btnRankRating.onclick = () => this.loadRanking('rating');
    if (btnRankMatches) btnRankMatches.onclick = () => this.loadRanking('matches');
    if (btnRankMvps) btnRankMvps.onclick = () => this.loadRanking('mvps');
    if (btnRankOverall) btnRankOverall.onclick = () => this.loadRanking('overall');
    if (btnRankWinrate) btnRankWinrate.onclick = () => this.loadRanking('winrate');
    if (btnRankLevel) btnRankLevel.onclick = () => this.loadRanking('level');
    if (btnRankCoins) btnRankCoins.onclick = () => this.loadRanking('coins');
    if (btnRankSkins) btnRankSkins.onclick = () => this.loadRanking('skins');

    // Post Game Screen Continue button
    const btnPostContinue = document.getElementById('post-btn-continue');
    if (btnPostContinue) {
      btnPostContinue.onclick = () => {
        if (this.mode === 'multiplayer') {
          const roomCode = this.activeRoom?.code;
          if (!roomCode || !socketService.hasLiveHostConnection()) {
            this.activeRoom = null;
            this.clearRoomChatViews();
            socketService.leaveRoom();
            showToast('A sala foi encerrada pelo host.', 'error');
            router.show('multiplayer-screen');
            socketService.refreshPublicRooms();
            return;
          }
          if (socketService.isHost && socketService.serverRoom) {
            // Discovery temporarily reports zero players after results. The
            // authoritative host still owns the room and recreates its lobby
            // immediately with the previous settings.
            socketService.returnToLobby();
            this.activeRoom = socketService.serverRoom.getLobbyInfo();
            this.updateLobbyView(this.activeRoom);
            router.show('lobby-screen');
            return;
          }
          socketService.getPublicRoomMeta(this.activeRoom?.code).then(room => {
            if (room) {
              btnPostContinue.disabled = true;
              socketService.off('returnedToLobby');
              const returnTimeout = window.setTimeout(() => {
                socketService.off('returnedToLobby', handleReturned);
                btnPostContinue.disabled = false;
                showToast('Não foi possível confirmar o retorno ao lobby. Tente novamente.', 'error');
              }, 5000);
              const handleReturned = payload => {
                window.clearTimeout(returnTimeout);
                socketService.off('returnedToLobby', handleReturned);
                btnPostContinue.disabled = false;
                if (payload?.lobbyInfo) this.activeRoom = payload.lobbyInfo;
                router.show('lobby-screen');
              };
              socketService.on('returnedToLobby', handleReturned);
              socketService.returnToLobby();
            } else {
              btnPostContinue.disabled = false;
              this.activeRoom = null;
              this.clearRoomChatViews();
              socketService.leaveRoom();
              showToast('O host saiu. A sala foi encerrada.', 'error');
              router.show('multiplayer-screen');
              socketService.refreshPublicRooms();
            }
          }).catch(() => {
            btnPostContinue.disabled = false;
            this.activeRoom = null;
            this.clearRoomChatViews();
            socketService.leaveRoom();
            showToast('O host saiu. A sala foi encerrada.', 'error');
            router.show('multiplayer-screen');
          });
        } else if (this.practiceMode) {
          router.show('mode-select-screen');
        } else {
          router.show('solo-screen');
        }
      };
    }

    // Leaderboard Screen back button
    const btnRankBack = document.getElementById('ranking-btn-back');
    if (btnRankBack) btnRankBack.onclick = () => router.show('menu-screen');

    const btnSaveLobbySettings = document.getElementById('lobby-btn-save-settings');
    if (btnSaveLobbySettings) {
      btnSaveLobbySettings.onclick = () => {
        const pass = document.getElementById('lobby-password-input')?.value || '';
        if (pass.length > C.ROOM_PASSWORD_MAX_LENGTH) return showToast(`A senha pode ter no máximo ${C.ROOM_PASSWORD_MAX_LENGTH} caracteres.`, 'error');
        socketService.hostSetPassword(pass);
        socketService.hostSetCompetitive(false);
        showToast('Configurações da sala atualizadas.', 'success');
      };
    }
    const lobbyPasswordInputLive = document.getElementById('lobby-password-input');
    if (lobbyPasswordInputLive) {
      lobbyPasswordInputLive.addEventListener('input', () => {
        const btn = document.getElementById('lobby-btn-save-settings');
        if (btn) btn.disabled = false;
      });
    }

    window.addEventListener('kicker:openMobileHudEditor', () => this.startMobileHudEditor());
    window.addEventListener('kicker:mobileHudUpdated', () => this.applyMobileHudSettings());
  },

  // ==========================================================================
  // RENDER & MATCH LOGIC
  // ==========================================================================
  startMatchView() {
    this.administrativeMatchAbort = false;
    if (!this.hudEditorMode) this.closeMobileHudEditorUI();
    this.canvas = document.getElementById('match-canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.recordedChunks = [];
    this.isRecording = false;
    // Match views are disposable. Do not carry a paused menu or host pause
    // marker into a new game after a player exits and comes back.
    this.isPaused = false;
    this.pauseMenuOpen = false;
    this.matchHostPaused = false;
    this.onlineShootStartedAt = null;
    document.getElementById('pause-modal')?.classList.add('hidden');
    document.getElementById('focus-lost-badge')?.classList.add('hidden');

    // Apply layout scale sizes from settingsController dimensions
    const dims = settingsController.dimensions;
    this.canvas.width = dims.w;
    this.canvas.height = dims.h;
    this.matchRecording = this.mode === 'multiplayer' && !!this.activeRoom?.competitive
      ? new MatchRecordingSession({ fieldWidth: dims.w, fieldHeight: dims.h, players: this.activeRoom?.players || [] })
      : null;
    this.recordingFinalizePromise = null;
    document.getElementById('live-match-report-modal')?.classList.add('hidden');

    // Layout resizing responsive hook
    this.resizeCanvasContainer();
    if (this.boundResizeHandler) window.removeEventListener('resize', this.boundResizeHandler);
    this.boundResizeHandler = () => {
      this.resizeCanvasContainer();
      this.refreshMobileMatchChrome();
    };
    window.addEventListener('resize', this.boundResizeHandler);
    if (this.boundFullscreenHandler) document.removeEventListener('fullscreenchange', this.boundFullscreenHandler);
    this.boundFullscreenHandler = () => {
      if (this.isTouchDevice()) return;
      setTimeout(() => this.resizeCanvasContainer(), 80);
    };
    document.addEventListener('fullscreenchange', this.boundFullscreenHandler);

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
    this.onlineReplayBuffer = [];
    this.lastOnlineStateAt = 0;
    this.clearPressedKeys();

    this.refreshMobileMatchChrome();
    this.applyMobileHudSettings();
    const pingEl = document.getElementById('ping-indicator');
    if (pingEl) pingEl.classList.toggle('hidden', this.mode !== 'multiplayer');

    // Focus lost event listener
    const focusLostBadge = document.getElementById('focus-lost-badge');
    if (this.boundVisibilityHandler) document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    if (this.boundBlurHandler) window.removeEventListener('blur', this.boundBlurHandler);
    if (this.boundFocusHandler) window.removeEventListener('focus', this.boundFocusHandler);
    this.boundVisibilityHandler = null;
    this.boundBlurHandler = null;
    this.boundFocusHandler = null;

    this.ball = new ClientBall();
    this.players = [];

    const gameChat = document.getElementById('game-chat-overlay');
    const mobileChatToggle = document.getElementById('mobile-chat-toggle');
    const mobileStatsToggle = document.getElementById('mobile-stats-toggle');
    const mobilePauseToggle = document.getElementById('mobile-pause-toggle');
    if (gameChat) {
      // Existing lobby messages are already in this shared chat container.
      // Scroll again after layout settles on every platform and app WebView.
      requestAnimationFrame(() => requestAnimationFrame(() => this.scrollChatToLatest('game-chat-messages')));
      const mobileChat = this.isTouchDevice() && this.mode === 'multiplayer';
      gameChat.classList.toggle('hidden', this.mode !== 'multiplayer' || mobileChat);
      gameChat.classList.toggle('mobile-chat-box', mobileChat);
      if (mobileChatToggle) {
        mobileChatToggle.classList.toggle('hidden', !mobileChat);
        mobileChatToggle.onclick = () => {
          if (this.hudEditorMode) return;
          const willOpen = gameChat.classList.contains('hidden');
          gameChat.classList.toggle('hidden', !willOpen);
          gameChat.classList.toggle('mobile-chat-modal', this.isTouchDevice() && willOpen);
          document.getElementById('game-chat-form')?.classList.toggle('active', willOpen);
          if (!gameChat.classList.contains('hidden')) {
            requestAnimationFrame(() => this.scrollChatToLatest('game-chat-messages'));
            document.getElementById('game-chat-input')?.focus();
          }
        };
        let closeBtn = document.getElementById('mobile-chat-close');
        if (mobileChat && !closeBtn) {
          closeBtn = document.createElement('button');
          closeBtn.id = 'mobile-chat-close';
          closeBtn.type = 'button';
          closeBtn.className = 'mobile-chat-close';
          closeBtn.textContent = '×';
          closeBtn.onclick = () => {
            gameChat.classList.add('hidden');
            gameChat.classList.remove('mobile-chat-modal');
            document.getElementById('game-chat-form')?.classList.remove('active');
          };
          gameChat.prepend(closeBtn);
        } else if (!mobileChat && closeBtn) {
          closeBtn.remove();
        }
      } else if (mobileChatToggle) {
        mobileChatToggle.classList.add('hidden');
      }
      if (this.mode === 'multiplayer') {
        const leftSidebar = document.getElementById('match-side-left');
        const matchScreen = document.getElementById('match-screen');
        if (this.isTouchDevice() && matchScreen && gameChat.parentElement !== matchScreen) {
          matchScreen.appendChild(gameChat);
      } else if (!this.isTouchDevice() && leftSidebar && gameChat.parentElement !== leftSidebar) {
        leftSidebar.innerHTML = '<div class="side-title">Chat</div>';
        leftSidebar.appendChild(gameChat);
      }
      if (!this.isTouchDevice() && this.mode === 'multiplayer') {
        document.getElementById('game-chat-form')?.classList.add('active');
        requestAnimationFrame(() => this.scrollChatToLatest('game-chat-messages'));
      }
    }
    }
    if (mobileStatsToggle) {
      mobileStatsToggle.onclick = () => {
        if (this.hudEditorMode) return;
        this.toggleMobileStatsModal();
      };
    }
    if (mobilePauseToggle) {
      mobilePauseToggle.onclick = () => {
        if (this.hudEditorMode) return;
        this.togglePauseMenu();
      };
    }

    // Initialize Pause Menu Event Handlers once
    this.setupPauseMenu();

    // Bind Escape/Enter/P keys in match to open transparent chat or pause
    if (this.boundMatchKeyHandler) window.removeEventListener('keydown', this.boundMatchKeyHandler, true);
    this.boundMatchKeyHandler = (e) => {
      if (router.currentScreenId !== 'match-screen') return;

      if (e.key === 'Enter') {
        const form = document.getElementById('game-chat-form');
        const input = document.getElementById('game-chat-input');
        if (form && input) {
          if (document.activeElement !== input) {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.clearPressedKeys();
            document.getElementById('game-chat-overlay')?.classList.remove('hidden');
            form.classList.add('active');
            requestAnimationFrame(() => {
              this.scrollChatToLatest('game-chat-messages');
              input.focus({ preventScroll: true });
            });
          } else {
            // The match hotkey listener owns Enter, so submit explicitly.
            // This keeps chat usable while a replay overlay is displayed.
            e.preventDefault();
            e.stopImmediatePropagation();
            form.requestSubmit();
          }
        }
      } else if (!this.hudEditorMode && !this.isTypingTarget(e.target)
        && (e.key === 'p' || e.key === 'P' || (e.key === 'Escape' && !document.fullscreenElement))) {
        this.togglePauseMenu();
      }
    };
    window.addEventListener('keydown', this.boundMatchKeyHandler, true);

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
    const isMobile = this.isTouchDevice();
    const browserFullscreen = window.screen?.availHeight
      ? window.innerHeight >= window.screen.availHeight - 12
      : false;
    const isFullscreen = (document.fullscreenElement || browserFullscreen) && !isMobile;
    document.documentElement.classList.toggle('browser-immersive', isFullscreen);
    const gap = isMobile ? 0 : (isFullscreen ? 8 : 12);
    const mobileSideW = Math.max(56, Math.min(76, Math.floor(window.innerWidth * 0.105)));
    const leftW = isMobile
      ? 0
      : (this.mode === 'solo' ? 0 : Math.min(240, Math.max(176, Math.floor(window.innerWidth * 0.18))));
    const rightW = isMobile ? 0 : Math.min(210, Math.max(164, Math.floor(window.innerWidth * 0.14)));
    const reservedW = this.mode === 'solo' && !isMobile ? rightW + gap : leftW + rightW + (gap * 2);
    // On mobile the score stays as an overlay, leaving the whole viewport to
    // the field instead of reserving a strip that made the canvas too small.
    const hudH = isMobile ? 0 : (document.querySelector('.match-hud')?.offsetHeight || 62);
    const outerPadW = isMobile ? 0 : (isFullscreen ? 20 : 80);
    const outerPadH = isMobile ? 0 : (isFullscreen ? 20 : 110);
    const availW = Math.max(320, window.innerWidth - outerPadW - reservedW);
    const availH = Math.max(240, window.innerHeight - outerPadH - hudH);

    let canvasH = availH;
    let canvasW = canvasH * aspect;

    if (isMobile) {
      // Fill the width of a landscape phone, but never crop the top or bottom
      // of the field. A small responsive vertical squeeze is preferable to
      // hiding goals and controls on displays that are shorter than 16:10.
      canvasW = availW;
      canvasH = availH;
    } else if (canvasW > availW) {
      const scale = availW / canvasW;
      canvasW *= scale;
      canvasH *= scale;
    }

    canvasW = Math.floor(canvasW);
    canvasH = Math.floor(canvasH);

    const leftSidebar = document.getElementById('match-side-left');
    if (isMobile) {
      if (leftSidebar) leftSidebar.style.display = 'none';
      const rightSidebar = document.getElementById('match-side-right');
      if (rightSidebar) rightSidebar.style.display = 'none';
      // The mobile field is deliberately stretched to the complete viewport.
      // Keeping a fixed stage prevents the green canvas gutter shown by the
      // Cordova WebView when its visual viewport changes.
      wrap.style.position = 'fixed';
      wrap.style.inset = '0';
      const viewportWidth = Math.round(window.visualViewport?.width || window.innerWidth);
      const viewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
      wrap.style.width = `${viewportWidth}px`;
      wrap.style.height = `${viewportHeight}px`;
      stage.style.position = 'absolute';
      stage.style.inset = '0';
      stage.style.gridTemplateColumns = `${canvasW}px`;
      stage.style.width = `${viewportWidth}px`;
      stage.style.height = `${viewportHeight}px`;
      stage.style.gap = '0px';
      stage.style.overflow = 'hidden';
      // Cordova's layout viewport can differ from its visible WebView bounds.
      this.canvas.style.setProperty('width', `${viewportWidth}px`, 'important');
      this.canvas.style.setProperty('height', `${viewportHeight}px`, 'important');
      this.canvas.style.aspectRatio = 'auto';
      // Fill the exact WebView bounds. An extra horizontal scale used to crop
      // posts and made a rejoined match look like a different arena.
      this.canvas.classList.add('mobile-field-fill');
      this.canvas.style.setProperty('transform', 'none', 'important');
      this.canvas.style.transformOrigin = 'center center';
      return;
    }

    stage.style.overflow = 'visible';
    wrap.style.position = '';
    wrap.style.inset = '';
    wrap.style.width = '';
    wrap.style.height = '';
    stage.style.position = '';
    stage.style.inset = '';
    this.canvas.style.transform = '';
    this.canvas.style.transformOrigin = '';
    this.canvas.classList.remove('mobile-field-fill');
    if (this.mode === 'solo' && !isMobile) {
      if (leftSidebar) leftSidebar.style.display = 'none';
      const rightSidebar = document.getElementById('match-side-right');
      if (rightSidebar) rightSidebar.style.display = 'flex';
      stage.style.gridTemplateColumns = `${canvasW}px ${rightW}px`;
      stage.style.width = `${canvasW + rightW + gap}px`;
    } else {
      if (leftSidebar) {
        leftSidebar.style.display = this.mode === 'solo' ? 'none' : 'flex';
        leftSidebar.style.minWidth = `${leftW}px`;
        leftSidebar.style.maxWidth = `${leftW}px`;
      }
      const rightSidebar = document.getElementById('match-side-right');
      if (rightSidebar) {
        rightSidebar.style.display = 'flex';
        rightSidebar.style.minWidth = `${rightW}px`;
        rightSidebar.style.maxWidth = `${rightW}px`;
      }
      stage.style.gridTemplateColumns = `${leftW}px ${canvasW}px ${rightW}px`;
      stage.style.width = `${canvasW + leftW + rightW + (gap * 2)}px`;
    }
    stage.style.gap = `${gap}px`;
    stage.style.height = `${canvasH}px`;

    this.canvas.style.width = `${canvasW}px`;
    this.canvas.style.height = `${canvasH}px`;
    this.canvas.style.aspectRatio = `${this.canvas.width} / ${this.canvas.height}`;
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
    const badge = menuController.profileData.badge || '🇧🇷';
    const equippedSkin = getEquippedSkin(menuController.profileData).image;

    // Retrieve selected field size and replay settings
    const sizeSelect = document.getElementById('solo-field-size');
    const fieldSize = this.tutorialMode ? 'medium' : (sizeSelect ? sizeSelect.value : 'medium');
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

    const p1Lobby = { id: 'p1', uid: this.currentUser.uid, username, badge, skin: equippedSkin, team: 'blue', cpu: false };
    const cpuLobby = { id: 'cpu', uid: '', username: 'CPU Bot', badge: '⚙️', team: 'red', cpu: true, difficulty: this.difficulty };

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

    // Simulate Match logic locally on the client. The displayed value is
    // seconds while MatchSim keeps its internal timing in 60 Hz frames.
    this.status = 'countdown';
    this.countdown = 5;
    this.onlineReplayBuffer = [];
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
      replayIndex: 0,
      skipReplayRequested: false
    };

    this.localMatchSim = MatchSim;

    const redPlayer = {
      id: 'cpu',
      name: 'CPU Bot',
      badge: '⚙️',
      team: C.Team.RED,
      cpu: true,
      difficulty: this.difficulty,
      x: C.BORDER + 120,
      y: this.canvas.height * 0.5,
      vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
      stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
      tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
      tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, tackleImpactReady: false, shootHalo: 0, aiShootLock: 45, aiFeintLock: 0,
      // Each solo match selects a distinct attacking lane and pressure level.
      // This keeps the bot from repeating a single deterministic route.
      aiStyle: {
        lane: Math.random() < 0.5 ? -1 : 1,
        aggression: 0.82 + Math.random() * 0.28,
        escapeBias: 0.65 + Math.random() * 0.22
      },
      aiDecisionTimer: 0,
      aiChargeFrames: 0
    };

    const bluePlayer = {
      id: 'p1',
      name: username,
      badge: badge,
      skin: equippedSkin,
      staffRole: menuController.profileData?.staffRole || '',
      team: C.Team.BLUE,
      cpu: false,
      x: this.canvas.width - C.BORDER - 120,
      y: this.canvas.height * 0.5,
      vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: 0, lastMoveDir: 0,
      stamina: 1.0, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
      tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
      tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, tackleImpactReady: false, shootHalo: 0
    };

    const allyPlayer = {
      id: 'tutorial-ally', name: 'CPU Parceiro', badge: '🤝', team: C.Team.BLUE, cpu: true,
      x: this.canvas.width * 0.46, y: this.canvas.height * 0.64,
      vx: 0, vy: 0, r: C.PLAYER_RADIUS, dir: Math.PI, lastMoveDir: Math.PI,
      stamina: 1, staminaLock: 0, stun: 0, slowTimer: 0, kickCharge: 0, cool: 0,
      tackle_cd: 0, dribble_cd: 0, dash_time: 0, invuln: 0, power_cd: 0,
      tackleFreeze: 0, tackleSuccess: false, tackleEval: 0, tackleImpactReady: false, shootHalo: 0
    };

    const localPlayers = this.tutorialMode
      ? [redPlayer, bluePlayer, allyPlayer]
      : (this.practiceMode ? [bluePlayer] : [redPlayer, bluePlayer]);
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
        // A mobile frame can contain more than one physics step. Keep every
        // action sound generated in that frame instead of losing earlier ones.
        frameSfx = [];

        while (accumulator >= timeStep) {
          if (!this.isPaused) {
          if (MatchSim.skipReplayRequested) {
            MatchSim.skipReplayRequested = false;
            MatchSim.status = 'countdown';
            MatchSim.countdownTimer = C.RESTART_COUNTDOWN_FRAMES;
            resetFieldPositions();
          }
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
              this.replayFrameMs = (1000 / 60) * C.REPLAY_SLOWMO_FACTOR;
              this.replayStartedAtWall = Date.now();
              document.getElementById('replay-overlay')?.classList.remove('hidden');
              const localSkip = document.getElementById('replay-vote-skip-btn');
              if (localSkip) {
                localSkip.classList.remove('hidden');
                localSkip.disabled = false;
                localSkip.textContent = 'Pular replay (1/1)';
              }
              MatchSim.status = 'replay';
              // Set replay duration using the shared slow-motion factor.
              MatchSim.countdownTimer = (this.replayFrames.length * C.REPLAY_SLOWMO_FACTOR)
                + Math.ceil(C.REPLAY_POST_GOAL_FREEZE_MS / (1000 / 60));

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
                MatchSim.countdownTimer = C.RESTART_COUNTDOWN_FRAMES;
                resetFieldPositions();
              }
            }
          } else if (MatchSim.status === 'playing') {
            if (!this.practiceMode) {
              MatchSim.matchTime -= 1 / 60;
            }
            if (!this.practiceMode && MatchSim.matchTime <= 0) {
              MatchSim.matchTime = 0;
              MatchSim.status = 'ended';
              this.localMatchEnd(MatchSim.score);
            }

            // 1) Read P1 keyboard Inputs
            inputP1 = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
            if (!this.isTypingTarget()) {
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
            }
            if (this.isTouchDevice() && this.virtualInput) {
              inputP1.x += this.virtualInput.x || 0;
              inputP1.y += this.virtualInput.y || 0;
              inputP1.shoot = inputP1.shoot || !!this.virtualInput.shoot;
              inputP1.sprint = inputP1.sprint || !!this.virtualInput.sprint;
              inputP1.dribble = inputP1.dribble || !!this.virtualInput.dribble;
              inputP1.tackle = inputP1.tackle || !!this.virtualInput.tackle;
              inputP1.power = inputP1.power || !!this.virtualInput.power;
            }
            this.applyMobileTackleAssist(inputP1, bluePlayer, localBallSim);

            // 2) AI bot decision making
            let inputCPU = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
            const tutorialEnemyActive = this.tutorialMode && !!this.tutorialSession?.enemyActive;
            if ((!this.practiceMode || tutorialEnemyActive) && redPlayer.stun <= 0) {
              if (redPlayer.aiDecisionTimer > 0) redPlayer.aiDecisionTimer--;
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
                const trappedNearWall = redPlayer.x < C.BORDER + 65 || redPlayer.x > w - C.BORDER - 65 || redPlayer.y < C.BORDER + 65 || redPlayer.y > h - C.BORDER - 65;
                if (this.difficulty !== 'easy' && (oppDist < 120 || trappedNearWall)) {
                  // Dribble feint: steer away from blue player
                  targetX = Math.max(redPlayer.x + 120, C.BORDER + 110);
                  targetY = Physics.clamp(redPlayer.y + Math.sign(redPlayer.y - bluePlayer.y || (h / 2 - redPlayer.y)) * 150, C.BORDER + 55, h - C.BORDER - 55);
                  if (redPlayer.dribble_cd <= 0) {
                    inputCPU.dribble = true;
                  }
                } else {
                  const laneTarget = (h * 0.5) + (redPlayer.aiStyle.lane * 54);
                  targetY = Physics.clamp((redPlayer.y * 0.35) + (laneTarget * 0.65), gTop + 20, gBot - 20);
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

              const wallMargin = C.BORDER + 92;
              const trappedAtWall = redPlayer.x < wallMargin || redPlayer.x > w - wallMargin || redPlayer.y < wallMargin || redPlayer.y > h - wallMargin;
              if (trappedAtWall) {
                // Escape diagonally toward open grass. This is intentionally
                // applied before avoidance so a blocking player cannot cancel
                // the bot's route away from a wall.
                targetX = redPlayer.x < wallMargin ? C.BORDER + 190 : (redPlayer.x > w - wallMargin ? w - C.BORDER - 190 : redPlayer.x);
                targetY = redPlayer.y < wallMargin ? h * redPlayer.aiStyle.escapeBias : (redPlayer.y > h - wallMargin ? h * (1 - redPlayer.aiStyle.escapeBias) : h * 0.5);
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

              const blockDx = redPlayer.x - bluePlayer.x;
              const blockDy = redPlayer.y - bluePlayer.y;
              const blockDist = Math.hypot(blockDx, blockDy);
              if (blockDist < 76) {
                const push = (76 - blockDist) / 76;
                if (redPlayer.aiDecisionTimer <= 0) {
                  redPlayer.aiStyle.lane = redPlayer.y <= bluePlayer.y ? -1 : 1;
                  redPlayer.aiDecisionTimer = 150;
                }
                // Commit to one side of a stationary defender instead of
                // recalculating left/right every frame and oscillating.
                ax += 0.28 * redPlayer.aiStyle.aggression;
                ay += redPlayer.aiStyle.lane * (0.72 + push * 0.45);
              }

              inputCPU.x = ax * speedFactor;
              inputCPU.y = ay * speedFactor;

              const wantSprint = (localBallSim.owner === 'cpu' && Math.abs(rightPostX - redPlayer.x) > 200) ||
                                 (!localBallSim.owner && distBall > 80) ||
                                 (blockDist < 82 * redPlayer.aiStyle.aggression && this.difficulty !== 'easy');
              inputCPU.sprint = wantSprint && redPlayer.staminaLock <= 0 && redPlayer.stamina > 0.30;

              // Shoot/Tackle trigger
              if (localBallSim.owner === 'cpu') {
                const distToGoal = Math.abs(rightPostX - redPlayer.x);
                const inShootingLane = redPlayer.y > gTop + 8 && redPlayer.y < gBot - 8;
                if (redPlayer.aiShootLock <= 0 && inShootingLane && distToGoal < 230) {
                  // Aim through the center of the goal, charge briefly and
                  // release. The previous AI often kept dribbling past this
                  // point or released while still facing a sideline.
                  inputCPU.x = 1;
                  inputCPU.y = Physics.clamp((h * 0.5 - redPlayer.y) / 80, -0.45, 0.45);
                  inputCPU.dribble = false;
                  inputCPU.power = false;
                  if (redPlayer.aiChargeFrames < 16) {
                    inputCPU.shoot = true;
                    redPlayer.aiChargeFrames++;
                  } else {
                    inputCPU.shoot = false;
                    redPlayer.aiChargeFrames = 0;
                    redPlayer.aiShootLock = 55;
                  }
                } else if (distToGoal >= 230) {
                  redPlayer.aiChargeFrames = 0;
                }
                const trappedNearWall = redPlayer.x < C.BORDER + 65 || redPlayer.x > w - C.BORDER - 65 || redPlayer.y < C.BORDER + 65 || redPlayer.y > h - C.BORDER - 65;
                if (!inputCPU.shoot && redPlayer.aiChargeFrames === 0 && (trappedNearWall || blockDist < 100) && redPlayer.dribble_cd <= 0 && redPlayer.stamina >= C.DRIBBLE_STAM_COST && this.difficulty !== 'easy') {
                  inputCPU.dribble = true;
                }
                if (redPlayer.aiShootLock <= 0 && trappedNearWall && blockDist < 110 && redPlayer.power_cd <= 0 && redPlayer.stamina > 0.65) {
                  inputCPU.power = true;
                }
              } else if (localBallSim.owner === 'p1') {
                if (distBall < C.TACKLE_RANGE && redPlayer.tackle_cd <= 0 && this.difficulty !== 'easy') {
                  inputCPU.tackle = true;
                }
              }
            }

            if (this.tutorialMode && this.tutorialSession?.step?.id === 'dribble') {
              // The dribble lesson needs visible pressure, not a tackle. The
              // rival follows the carrier closely so the player can feel the
              // protected dash without the lesson ending through a steal.
              const dx = bluePlayer.x - redPlayer.x;
              const dy = bluePlayer.y - redPlayer.y;
              const distance = Math.hypot(dx, dy) || 1;
              inputCPU.x = (dx / distance) * 0.82;
              inputCPU.y = (dy / distance) * 0.82;
              inputCPU.sprint = distance > 135;
              inputCPU.tackle = false;
              inputCPU.dribble = false;
              inputCPU.power = false;
              inputCPU.shoot = false;
            }

            // 3) Apply Physics movements and skills
            const applySkills = (p, input) => {
              if (p.stun > 0) return;

              // Tackle
              if (input.tackle && localBallSim.owner !== p.id && p.tackle_cd <= 0 && p.stamina >= C.TACKLE_STAM_COST) {
                p.stamina = Math.max(0, p.stamina - C.TACKLE_STAM_COST);
                p.tackle_cd = C.TACKLE_CD;
                p.tackleSuccess = false;
                p.tackleEval = C.TACKLE_DASH_FRAMES;
                p.tackleImpactReady = false;
                p.slowTimer = C.TACKLE_SLOW_TIME;
                p.tackleFreeze = 8;
                frameSfx.push('tackle');

                const opp = p.id === 'p1' ?redPlayer : bluePlayer;
                const ang = localBallSim.owner === opp.id ?Math.atan2(opp.y - p.y, opp.x - p.x) : p.dir;
                p.vx += Math.cos(ang) * C.TACKLE_LUNGE;
                p.vy += Math.sin(ang) * C.TACKLE_LUNGE;
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
              if (input.power && p.power_cd <= 0 && p.stamina >= 0.50 && localBallSim.owner === p.id) {
                if (p.id === 'p1') this.p1Shots = (this.p1Shots || 0) + 1;
                p.stamina = Math.max(0, p.stamina - 0.50);
                if (p.stamina === 0) {
                  p.staminaLock = C.STAMINA_LOCK_FRAMES;
                }
                p.power_cd = C.POWER_KICK_CD;
                p.cool = 12;
                p.shootHalo = 22;

                const ang = (input.x || input.y) ?Math.atan2(input.y, input.x) : p.dir;
                Physics.powerKick(p, localBallSim, ang, C.POWER_KICK_POWER);
                frameSfx.push('power');
                if (p.id === 'p1') this.tutorialSession?.record('power');
                if (p.id === 'cpu') this.tutorialSession?.record('botKick');
              }

              // Regular Shoot Release
              if (p.kickCharge > 0 && !input.shoot) {
                if (localBallSim.owner === p.id) {
                  const charge = Physics.clamp(p.kickCharge, 0, 1);
                  p.cool = 14;
                  p.shootHalo = 18;
                  const ang = (input.x || input.y) ?Math.atan2(input.y, input.x) : p.dir;
                  const pow = Math.max(C.KICK_BASE, C.KICK_BASE + C.KICK_CHARGE * charge);
                  if (p.id === 'p1') this.p1Shots = (this.p1Shots || 0) + 1;
                  Physics.kickBall(p, localBallSim, ang, pow);
                  frameSfx.push('kick');
                  if (p.id === 'p1') this.tutorialSession?.record('kick');
                  if (p.id === 'cpu') this.tutorialSession?.record('botKick');
                }
                p.kickCharge = 0;
              }
            };

            applySkills(bluePlayer, inputP1);
            if (!this.practiceMode || tutorialEnemyActive) applySkills(redPlayer, inputCPU);
            if (bluePlayer.dribble_cd === C.DRIBBLE_CD) this.tutorialSession?.record('dribble');

            Physics.updatePlayerPhysics(bluePlayer, inputP1, localBallSim, (sfx) => frameSfx.push(sfx));
            if (!this.practiceMode || this.tutorialMode) Physics.updatePlayerPhysics(redPlayer, inputCPU, localBallSim, (sfx) => frameSfx.push(sfx));
            if (this.tutorialMode && !allyPlayer.tutorialHidden) Physics.updatePlayerPhysics(allyPlayer, { x: 0, y: 0 }, localBallSim, (sfx) => frameSfx.push(sfx));

            Physics.applyLimits(bluePlayer, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w, h);
            if (!this.practiceMode || this.tutorialMode) Physics.applyLimits(redPlayer, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w, h);
            if (this.tutorialMode && !allyPlayer.tutorialHidden) Physics.applyLimits(allyPlayer, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, w, h);

            const activeLocalPlayers = localPlayers.filter(player => !player.tutorialHidden);

            // Resolve the tackle at the final dash frame before normal bodies
            // are separated, mirroring the authoritative multiplayer server.
            Physics.resolvePlayerPlayer(activeLocalPlayers);
            if (!localBallSim.tutorialHidden) {
              this.resolveLocalTackleImpacts(activeLocalPlayers, localBallSim);
              Physics.resolvePlayerBall(activeLocalPlayers, localBallSim, () => frameSfx.push('pickup'));
              Physics.updateBallPhysics(
              localBallSim, gTop, gBot, leftNetBack, rightNetBack, leftPostX, rightPostX, cornerR, activeLocalPlayers,
              (sfx) => frameSfx.push(sfx),
              (side) => {
                // Goal triggered offline
                if (side === 'blue') MatchSim.score.blue++; else MatchSim.score.red++;

                if (this.tutorialMode) {
                  this.tutorialSession?.record('goal', { side });
                  localBallSim.vx = 0;
                  localBallSim.vy = 0;
                  return;
                }

                // Set last goal detail
                const scorerName = localBallSim.lastTouch === 'cpu' ?'CPU Bot' : username;
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
                    MatchSim.countdownTimer = C.RESTART_COUNTDOWN_FRAMES;
                    resetFieldPositions();
                  }
                }
              },
                w, h
              );
            }
            this.tutorialSession?.update({
              player: bluePlayer,
              players: activeLocalPlayers,
              ball: localBallSim,
              input: inputP1,
              canvas: this.canvas
            });
          }

          // The goal replay must contain actual play only. Capturing freeze,
          // replay or countdown frames would replace part of the six seconds
          // immediately preceding the goal.
          if (MatchSim.status === 'playing') recordLocalFrame();
        }
        accumulator -= timeStep;
      }

        // Render Frame Canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const replayCameraFrame = this.inReplay && !this.isReplayPostGoalHold() ? this.getCurrentReplayFrame() : null;
        const cameraShaking = this.beginPowerKickCamera(
          this.ctx,
          this.inReplay ? replayCameraFrame?.ball : MatchSim.status === 'playing' ? localBallSim : null
        );
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
          this.ball.vx = localBallSim.vx;
          this.ball.vy = localBallSim.vy;
          this.ball.lastStrikeType = localBallSim.lastStrikeType;
          this.ball.strikeTimer = localBallSim.strikeTimer;
          if (!localBallSim.tutorialHidden) {
            this.drawShotPreview(this.ctx, bluePlayer, localBallSim, inputP1, bluePlayer.kickCharge || 0);
            this.ball.draw(this.ctx);
          }

          this.players.forEach(p => {
            const phys = localPlayers.find(item => item.id === p.id);
            if (!phys || phys.tutorialHidden) return;
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
        if (cameraShaking) this.ctx.restore();

        // Top scoreboard and HUD
        const m = Math.floor(MatchSim.matchTime / 60);
        const s = Math.floor(MatchSim.matchTime % 60);
        const clockEl = document.getElementById('match-clock');
        const scoreEl = document.getElementById('match-score');

        if (clockEl) clockEl.textContent = this.practiceMode ?'∞' : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        if (scoreEl) scoreEl.textContent = `${MatchSim.score.red} : ${MatchSim.score.blue}`;

        // Sidebars update
        const rightStam = document.getElementById('right-stam-fill');
        const rightPow = document.getElementById('right-pow-fill');
        const leftStam = document.getElementById('left-stam-fill');
        const leftPow = document.getElementById('left-pow-fill');

        if (rightStam) rightStam.style.height = `${bluePlayer.stamina * 100}%`;
        if (rightPow) rightPow.style.height = `${bluePlayer.kickCharge * 100}%`;
        this.updateMobileActionMeters(bluePlayer.stamina, bluePlayer.kickCharge || 0);
        if (leftStam) leftStam.style.height = `${redPlayer.stamina * 100}%`;
        if (leftPow) leftPow.style.height = `${redPlayer.kickCharge * 100}%`;

        const canTrackLocalStats = MatchSim.status === 'playing' && !this.isPaused && !this.inReplay;
        // Track possession only while the local simulation is actually running.
        if (canTrackLocalStats) {
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
        }
        const p1Poss = Math.round(((this.p1PossessionFrames || 0) / (this.totalPossessionFrames || 1)) * 100);

        // Track Tackles and Dribbles counts from state cooldown activations
        if (canTrackLocalStats && bluePlayer.tackle_cd > 0 && !this.p1TackleLock) {
          this.p1Tackles = (this.p1Tackles || 0) + 1;
          this.p1TackleLock = true;
        } else if (bluePlayer.tackle_cd === 0) {
          this.p1TackleLock = false;
        }
        if (canTrackLocalStats && bluePlayer.dribble_cd > 0 && !this.p1DribbleLock) {
          this.p1Dribbles = (this.p1Dribbles || 0) + 1;
          this.p1DribbleLock = true;
        } else if (bluePlayer.dribble_cd === 0) {
          this.p1DribbleLock = false;
        }

        // Render counts on HUD (Você / P1 only)
        const rightPossEl = document.getElementById('right-stat-possession');
        const rightShotsEl = document.getElementById('right-stat-shots');
        const rightTacklesEl = document.getElementById('right-stat-tackles');
        const rightDribblesEl = document.getElementById('right-stat-dribbles');

        if (rightPossEl) rightPossEl.textContent = `${p1Poss}%`;
        if (rightShotsEl) rightShotsEl.textContent = this.p1Shots || 0;
        if (rightTacklesEl) rightTacklesEl.textContent = this.p1Tackles || 0;
        if (rightDribblesEl) rightDribblesEl.textContent = this.p1Dribbles || 0;
        this.refreshMobileStatsModal();
        this.refreshLiveMatchReportIfOpen();

        // Render Countdown Banners
        if (MatchSim.status === 'countdown') {
          const bannerSecs = Math.max(0, Math.ceil(MatchSim.countdownTimer / 60));
          this.drawCenterBanner(`Começa em ${bannerSecs}...`, 'Prepare-se!');
        } else if (MatchSim.status === 'freeze') {
          const label = (this.lastGoal && this.lastGoal.ownGoal) ?`GOL CONTRA de ${this.lastGoal.scorerName}` : `GOL DE ${(this.lastGoal && this.lastGoal.scorerName) || '??'}!`;
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
        bluePlayer.tackleEval = 0;
        bluePlayer.tackleImpactReady = false;
        bluePlayer.tackleSuccess = false;
        bluePlayer.tackle_cd = 0;
        bluePlayer.dribble_cd = 0;
        bluePlayer.power_cd = 0;
        bluePlayer.cool = 0;
        bluePlayer.dash_time = 0;
        bluePlayer.invuln = 0;

        const jitterX2 = (Math.random() - 0.5) * 20;
        const jitterY2 = (Math.random() - 0.5) * 20;
        redPlayer.x = C.BORDER + 120 + jitterX2;
        redPlayer.y = this.canvas.height * 0.5 + jitterY2;
        redPlayer.vx = redPlayer.vy = 0;
        redPlayer.kickCharge = 0;
        redPlayer.stamina = 1.0;
        redPlayer.staminaLock = 0;
        redPlayer.stun = 0;
        redPlayer.tackleEval = 0;
        redPlayer.tackleImpactReady = false;
        redPlayer.tackleSuccess = false;
        redPlayer.tackle_cd = 0;
        redPlayer.dribble_cd = 0;
        redPlayer.power_cd = 0;
        redPlayer.cool = 0;
        redPlayer.dash_time = 0;
        redPlayer.invuln = 0;

        allyPlayer.x = this.canvas.width * 0.46;
        allyPlayer.y = this.canvas.height * 0.64;
        allyPlayer.vx = allyPlayer.vy = 0;
        allyPlayer.kickCharge = 0;
        allyPlayer.stamina = 1;
        allyPlayer.stun = 0;

        localBallSim.x = this.canvas.width / 2;
        localBallSim.y = this.canvas.height / 2;
        localBallSim.vx = localBallSim.vy = 0;
        localBallSim.owner = null;
        localBallSim.lastTouch = null;
      };
      this.resetLocalFieldPositions = resetFieldPositions;

      const setBallOwner = (owner) => {
        localBallSim.owner = owner?.id || null;
        localBallSim.lastTouch = owner?.id || null;
        localBallSim.vx = localBallSim.vy = 0;
        localBallSim.x = owner ? owner.x + Math.cos(owner.dir) * (owner.r + localBallSim.r + 2) : this.canvas.width / 2;
        localBallSim.y = owner ? owner.y + Math.sin(owner.dir) * (owner.r + localBallSim.r + 2) : this.canvas.height / 2;
      };

      // Each lesson starts from a deterministic scene so the instructions and
      // the physics remain in sync after fast objective completion.
      const prepareTutorialStep = (step) => {
        if (!this.tutorialMode || !step) return;
        resetFieldPositions();
        MatchSim.status = 'playing';
        MatchSim.countdownTimer = 0;
        this.isPaused = !!step.manual || !!step.celebration;
        if (step.celebration) soundFx.play('reward');
        redPlayer.x = C.BORDER + 110;
        redPlayer.y = this.canvas.height * 0.22;
        bluePlayer.dir = Math.PI;
        allyPlayer.dir = Math.PI;
        allyPlayer.tutorialHidden = !tutorialNeedsAlly(step.id);
        redPlayer.tutorialHidden = !tutorialNeedsEnemy(step.id);
        localBallSim.tutorialHidden = !tutorialNeedsBall(step.id);
        if (localBallSim.tutorialHidden) {
          localBallSim.x = -1000;
          localBallSim.y = -1000;
        }

        if (step.id === 'control') {
          bluePlayer.x = this.canvas.width * 0.68;
          localBallSim.x = bluePlayer.x - 95;
          localBallSim.y = bluePlayer.y;
        } else if (step.id === 'pass') {
          bluePlayer.x = this.canvas.width * 0.72;
          bluePlayer.y = this.canvas.height * 0.58;
          allyPlayer.x = this.canvas.width * 0.47;
          allyPlayer.y = this.canvas.height * 0.58;
          setBallOwner(bluePlayer);
        } else if (['shoot', 'dribble', 'power', 'goal'].includes(step.id)) {
          bluePlayer.x = this.canvas.width * 0.66;
          bluePlayer.y = this.canvas.height * 0.5;
          setBallOwner(bluePlayer);
        } else if (step.id === 'tackle') {
          redPlayer.x = this.canvas.width * 0.48;
          redPlayer.y = this.canvas.height * 0.5;
          redPlayer.dir = 0;
          bluePlayer.x = this.canvas.width * 0.64;
          bluePlayer.y = this.canvas.height * 0.5;
          setBallOwner(redPlayer);
        }
      };

      const recordLocalFrame = () => {
        const snap = localPlayers.filter(p => !p.tutorialHidden).map(p => ({
          x: p.x,
          y: p.y,
          dir: p.dir,
          team: p.team,
          has: (localBallSim.owner === p.id),
          name: p.id === 'p1' ?username : 'CPU Bot',
          badge: p.id === 'p1' ? badge : '⚙️',
          staffRole: p.id === 'p1' ? (menuController.profileData?.staffRole || '') : '',
          inv: p.invuln || 0,
          stun: p.stun || 0,
          halo: p.shootHalo || 0
        }));

        const frame = {
          ball: {
            x: localBallSim.x,
            y: localBallSim.y,
            vx: localBallSim.vx,
            vy: localBallSim.vy,
            lastStrikeType: localBallSim.lastStrikeType,
            strikeTimer: localBallSim.strikeTimer
          },
          players: snap,
          score: { ...MatchSim.score },
          sfx: [...frameSfx]
        };

        MatchSim.replayBuffer.push(frame);
        if (MatchSim.replayBuffer.length > C.REPLAY_CAPTURE_FRAMES) {
          MatchSim.replayBuffer.shift();
        }
      };

      // Boot local simulation loop
      resetFieldPositions();
      if (this.tutorialMode) {
        this.tutorialSession?.destroy();
        this.tutorialSession = new TutorialSession({
          root: document.getElementById('tutorial-guide'),
          controls: settingsController.CTRL_P1,
          mobile: this.isTouchDevice(),
          onStepChange: prepareTutorialStep,
          onAttemptReset: prepareTutorialStep,
          onFeedbackChange: (locked) => {
            if (!this.tutorialMode) return;
            this.isPaused = locked;
            if (locked) this.clearPressedKeys();
          },
          onFinish: () => {
            this.tutorialMode = false;
            router.show('mode-select-screen');
          },
          onExit: () => {
            this.tutorialMode = false;
            router.show('mode-select-screen');
          }
        });
        this.tutorialSession.start();
      }
      this.localPhysicsTick = requestAnimationFrame(tickLocalGame);
    })();
  },

  resolveLocalTackleImpacts(localPlayers, localBallSim) {
    for (const tackler of localPlayers) {
      if (!tackler.tackleImpactReady || tackler.tackleSuccess) continue;
      tackler.tackleImpactReady = false;

      const owner = localPlayers.find(x => x.id === localBallSim.owner);
      const canHitOwner = owner
        && owner.id !== tackler.id
        && owner.team !== tackler.team
        && owner.invuln <= 0;
      const impactDist = canHitOwner ? Math.hypot(owner.x - tackler.x, owner.y - tackler.y) : Infinity;
      const contactDistance = canHitOwner ? owner.r + tackler.r + C.TACKLE_CONTACT_TOLERANCE : 0;

      if (!canHitOwner || impactDist > contactDistance) {
        tackler.vx = 0;
        tackler.vy = 0;
        tackler.stun = Math.max(tackler.stun, C.FAIL_STUN);
        if (tackler.id === 'p1') {
          this.tutorialSession?.record('tackleFailed', { message: 'Missão falhou: o dash terminou sem tocar na bola.' });
        }
        continue;
      }

      const ownerForwardX = Math.cos(owner.dir || 0);
      const ownerForwardY = Math.sin(owner.dir || 0);
      const tacklerFromOwnerX = tackler.x - owner.x;
      const tacklerFromOwnerY = tackler.y - owner.y;
      const approachDot = (ownerForwardX * tacklerFromOwnerX) + (ownerForwardY * tacklerFromOwnerY);

      if (approachDot > -owner.r * 0.35) {
        localBallSim.owner = tackler.id;
        localBallSim.lastTouch = tackler.id;
        localBallSim.noPickupFrames = 10;
        localBallSim.noPickupFrom = null;
        localBallSim.vx = 0;
        localBallSim.vy = 0;
        owner.stun = Math.max(owner.stun, C.TACKLE_STUN);
        owner.vx = 0;
        owner.vy = 0;
        if (tackler.id === 'cpu' && owner.id === 'p1') {
          this.tutorialSession?.record('botTackle');
        }
        if (tackler.id === 'p1' && localBallSim.owner === tackler.id) {
          this.tutorialSession?.record('tackleSuccess');
        }
      } else {
        const pushAng = Math.atan2(owner.y - tackler.y, owner.x - tackler.x);
        localBallSim.owner = null;
        localBallSim.lastTouch = owner.id;
        localBallSim.noPickupFrames = 18;
        localBallSim.noPickupFrom = tackler.id;
        localBallSim.vx = Math.cos(pushAng) * 8;
        localBallSim.vy = Math.sin(pushAng) * 8;
        owner.stun = Math.max(owner.stun, C.TACKLE_STUN);
        tackler.stun = Math.max(tackler.stun, C.TACKLE_STUN);
        owner.vx = 0;
        owner.vy = 0;
        tackler.vx = 0;
        tackler.vy = 0;
        if (tackler.id === 'cpu' && owner.id === 'p1') {
          this.tutorialSession?.record('botTackle');
        }
        if (tackler.id === 'p1') {
          this.tutorialSession?.record('tackleFailed', { message: 'Missão falhou: desarme por trás não concede a posse.' });
        }
      }
      tackler.tackleSuccess = true;
    }
  },

  localMatchEnd(score) {
    cancelAnimationFrame(this.localPhysicsTick);
    this.stopLocalReplayRecording();

    // Stop background crowd noise to prevent audio leak to menu
    soundFx.stopCrowd();

    showToast('Fim de jogo!', 'info');

    // In Solo match, do NOT save stats or history to Firebase, and do not award XP.
    // Display Post-match Screen directly
    const resultTitle = score.red === score.blue ?'Empate' : (score.blue > score.red ?'Vitória' : 'Derrota');
    document.getElementById('post-result-title').textContent = resultTitle;
    document.getElementById('post-score-red').textContent = score.red;
    document.getElementById('post-score-blue').textContent = score.blue;
    document.getElementById('post-mvp').textContent = score.blue >= score.red ?menuController.profileData.username : 'CPU Bot';
    document.getElementById('post-xp-gained').textContent = this.practiceMode ? '+0 XP (Treino)' : '+0 XP (com bot)';
    document.getElementById('post-coins-gained').textContent = '+0';
    const localStats = this.players.map(player => ({
      playerId: player.id,
      username: player.name || (player.id === 'p1' ? menuController.profileData.username : 'CPU Bot'),
      team: player.team,
      goals: player.matchStats?.goals || 0,
      assists: player.matchStats?.assists || 0,
      ownGoals: player.matchStats?.ownGoals || 0,
      shots: player.matchStats?.shots || 0,
      dribbles: player.matchStats?.dribbles || 0,
      tackles: player.matchStats?.tackles || 0,
      possessionPct: player.matchStats?.possessionPct || 0
    }));
    renderMatchReport(document.getElementById('post-match-report'), {
      score,
      winnerTeam: score.red === score.blue ? 'draw' : score.red > score.blue ? C.Team.RED : C.Team.BLUE,
      playerStats: localStats
    });
    router.show('post-game-screen');
  },

  showOnlineMatchEnd(result) {
    if (this.administrativeMatchAbort) return;
    showToast('Partida finalizada!', 'info');
    this.stopLocalReplayRecording();
    if (result?.lobbyInfo) this.activeRoom = result.lobbyInfo;

    const score = result?.score || result || { red: 0, blue: 0 };
    const matchId = result?.matchId || `${this.activeRoom?.code || 'online'}-${result?.endedAt || Date.now()}`;
    const recordingOwnerUid = result?.recordingOwnerUid || this.currentUser?.uid;
    const recordingId = this.matchRecording && recordingOwnerUid
      ? getMatchRecordingId(recordingOwnerUid, matchId)
      : null;
    const myId = socketService.getSocket().id;
    const outcome = resolvePlayerMatchOutcome(result, this.currentUser?.uid, myId, this.players);
    const { stats: playerStats, localTeam, winnerTeam, isDraw, isSpectator: isSpec, isWin, isLoss } = outcome;
    const isMvp = !!result?.mvp && (result.mvp.playerId === myId || result.mvp.uid === this.currentUser?.uid);
    const xpGained = isSpec ?0 : isWin ?80 : isDraw ?30 : 15;
    const isCompetitive = !!result?.competitive;
    const coinsGained = isSpec || !isCompetitive ? 0 : (isWin ? 30 : isDraw ? 18 : 10);

    const resultKey = `kicker_hax_result_${matchId}_${this.currentUser.uid}`;
    const resultSaveState = localStorage.getItem(resultKey);
    const pendingSince = resultSaveState?.startsWith('pending:') ? Number(resultSaveState.split(':')[1]) : 0;
    const alreadySaved = resultSaveState === '1' || (pendingSince > 0 && Date.now() - pendingSince < 30000);
    if (!isSpec && !result?.hasBots && !alreadySaved) {
      // Keep duplicate callbacks out while still allowing a retry if either
      // the stats transaction or the history write fails.
      localStorage.setItem(resultKey, `pending:${Date.now()}`);
      const resultStats = Array.isArray(result?.playerStats) ? result.playerStats : [];
      const activeHumans = resultStats
        .filter(p => p.uid)
        .map(p => ({ uid: p.uid, team: normalizeMatchTeam(p.team) }));
      if (this.currentUser?.uid && !activeHumans.some(player => player.uid === this.currentUser.uid)) {
        activeHumans.push({ uid: this.currentUser.uid, team: localTeam });
      }
      const playerTeams = {};
      activeHumans.forEach(p => { playerTeams[p.uid] = p.team; });
      const matchDoc = {
        matchId,
        mode: 'multiplayer',
        date: result?.endedAt || new Date().toISOString(),
        startedAt: result?.startedAt || null,
        endedAt: result?.endedAt || new Date().toISOString(),
        playerUids: activeHumans.map(player => player.uid),
        participantUids: activeHumans.map(player => player.uid),
        playerTeams,
        playerStats: resultStats,
        teamStats: result?.teamStats || buildMatchReport(result).teamStats,
        mvp: result?.mvp || null,
        winner: winnerTeam,
        scoreRed: score.red,
        scoreBlue: score.blue,
        competitive: isCompetitive,
        category: isCompetitive ? 'competitive' : 'casual',
        forfeit: !!result?.forfeit,
        forfeitReason: result?.forfeitReason || null,
        recordingId,
        recordingVersion: recordingId ? 8 : null
      };
      const saveProgress = () => isCompetitive
        ? firebaseService.saveMatchResult(
          this.currentUser.uid,
          isWin,
          isLoss,
          isDraw,
          playerStats.goals || 0,
          playerStats.shots || this.p1Shots || 0,
          playerStats.dribbles || this.p1Dribbles || 0,
          playerStats.assists || 0,
          playerStats.ownGoals || 0,
          isMvp,
          xpGained,
          playerStats.tackles || this.p1Tackles || 0,
          playerStats.possessionPct || 0,
          matchId,
          coinsGained,
          playerStats.rating || 5
        )
        : firebaseService.saveXpOnly(this.currentUser.uid, xpGained, matchId);
      // History and progress form one retryable unit. If either write fails,
      // idempotent match IDs allow the complete result to be retried later.
      Promise.all([
        firebaseService.addMatchToHistory(matchDoc),
        saveProgress(),
        this.finalizeMatchRecording(matchId, result, recordingId)
      ]).then(() => {
        localStorage.setItem(resultKey, '1');
      }).catch(err => {
        localStorage.removeItem(resultKey);
        console.warn('[Kicker Stats] Falha ao salvar resultado:', err);
      });
    }

    const resultTitle = isDraw ?'Empate' : `Vitória do Time ${winnerTeam === C.Team.BLUE ?'Azul' : 'Vermelho'}`;
    document.getElementById('post-result-title').textContent = resultTitle;
    document.getElementById('post-score-red').textContent = score.red;
    document.getElementById('post-score-blue').textContent = score.blue;
    document.getElementById('post-mvp').textContent = result?.mvp?.username || (winnerTeam === C.Team.BLUE ?'Time Azul' : winnerTeam === C.Team.RED ?'Time Vermelho' : 'Empate');
    document.getElementById('post-xp-gained').textContent = isSpec
      ? 'Espectador'
      : (result?.hasBots ? '+0 XP (com bot)' : `+${xpGained} XP`);
    document.getElementById('post-coins-gained').textContent = coinsGained > 0 ? `+${coinsGained}` : '+0';
    renderMatchReport(document.getElementById('post-match-report'), result);
    router.show('post-game-screen');
  },

  finalizeMatchRecording(matchId, result, recordingId = null) {
    if (!this.matchRecording || !this.currentUser?.uid || !result?.competitive) return Promise.resolve(null);
    const recordingOwnerUid = result?.recordingOwnerUid || this.currentUser.uid;
    // One canonical host-owned demo is shared by every participant history.
    // Disconnected, expelled or exhausted players can therefore watch it later.
    if (recordingOwnerUid !== this.currentUser.uid) return Promise.resolve(recordingId);
    if (this.recordingFinalizePromise) return this.recordingFinalizePromise;
    const session = this.matchRecording;
    const safeRecordingId = recordingId || getMatchRecordingId(recordingOwnerUid, matchId);
    this.recordingFinalizePromise = session.finalize({
      matchId,
      ownerUid: recordingOwnerUid,
      result
    }).then(documentData => firebaseService.saveMatchRecording(safeRecordingId, documentData))
      .then(() => safeRecordingId)
      .catch(error => {
        console.warn('[Kicker Recording] Gravação não foi persistida:', error);
        return null;
      });
    return this.recordingFinalizePromise;
  },

  buildHostDepartureResult() {
    const myId = socketService.getSocket().id;
    const localPlayer = this.players.find(player => player.id === myId);
    const hostLobbyPlayer = this.activeRoom?.players?.find(player => player.id === this.activeRoom?.hostId);
    const hostPhysicalPlayer = this.players.find(player => player.id === this.activeRoom?.hostId);
    const hostTeam = hostPhysicalPlayer?.team ?? (
      hostLobbyPlayer?.team === 'red' ? C.Team.RED
        : hostLobbyPlayer?.team === 'blue' ? C.Team.BLUE
          : null
    );
    const winnerTeam = hostTeam === C.Team.RED
      ? C.Team.BLUE
      : hostTeam === C.Team.BLUE
        ? C.Team.RED
        : localPlayer?.team;
    const score = { ...(this.score || { red: 0, blue: 0 }) };

    // A forfeit must produce an unambiguous winner even when the score was tied.
    if (winnerTeam === C.Team.RED && score.red <= score.blue) score.red = score.blue + 1;
    if (winnerTeam === C.Team.BLUE && score.blue <= score.red) score.blue = score.red + 1;

    const playerStats = this.players.map(player => {
      const lobbyPlayer = this.activeRoom?.players?.find(item => item.id === player.id);
      return {
        playerId: player.id,
        uid: lobbyPlayer?.uid || '',
        username: lobbyPlayer?.username || player.name || 'Jogador',
        team: player.team,
        goals: player.matchStats?.goals || 0,
        assists: player.matchStats?.assists || 0,
        ownGoals: player.matchStats?.ownGoals || 0,
        shots: player.matchStats?.shots || 0,
        dribbles: player.matchStats?.dribbles || 0,
        tackles: player.matchStats?.tackles || 0,
        possessionPct: player.matchStats?.possessionPct || 0
      };
    });

    const report = buildMatchReport({ score, winnerTeam, playerStats });
    return {
      matchId: this.onlineMatchMeta?.matchId || `${this.activeRoom?.code || 'online'}-host-forfeit-${Date.now()}`,
      startedAt: this.onlineMatchMeta?.startedAt || null,
      endedAt: new Date().toISOString(),
      score,
      winnerTeam,
      playerStats: report.playerStats,
      teamStats: report.teamStats,
      competitive: !!this.activeRoom?.competitive,
      hasBots: false,
      forfeit: true,
      mvp: report.playerStats.slice().sort((a, b) => b.rating - a.rating)[0] || null
    };
  },

  // ==========================================================================
  // ONLINE MULTIPLAYER MATCH LOOP
  // ==========================================================================
  playImmediateOnlineActionSfx(input) {
    const previous = this.lastOnlineActionInput || {};
    const now = Date.now();
    const myId = socketService.getSocket().id;
    const me = this.players.find(player => player.id === myId);
    const canPlay = this.status === 'playing' && !this.matchHostPaused && !this.inReplay;
    const play = (kind) => {
      soundFx.play(kind);
      this.localActionSoundUntil[kind] = now + 240;
    };

    if (canPlay && me) {
      // Match the authoritative skill gates. Immediate feedback stays fast,
      // but never claims an action that the host will reject for stamina,
      // possession or cooldown reasons.
      const canTackle = this.ball.owner !== myId && me.tackle_cd <= 0 && me.stamina >= C.TACKLE_STAM_COST;
      const canDribble = this.ball.owner === myId && me.dribble_cd <= 0 && me.stamina >= C.DRIBBLE_STAM_COST;
      const hasBall = this.ball.owner === myId;
      const canPower = hasBall && (me.power_cd || 0) <= 0 && me.stamina >= 0.50;
      const canKick = hasBall && (me.kickCharge || 0) > 0;
      if (input.tackle && !previous.tackle && canTackle) play('tackle');
      if (input.dribble && !previous.dribble && canDribble) play('dribble');
      if (input.power && !previous.power && canPower) play('power');
      if (previous.shoot && !input.shoot && canKick) play('kick');
    }
    this.lastOnlineActionInput = { ...input };
  },

  startOnlineMatch() {
    // Reset stats tracking variables for online match
    this.p1Tackles = 0; this.p1Dribbles = 0;
    this.p2Tackles = 0; this.p2Dribbles = 0;
    this.p1TackleLock = false; this.p1DribbleLock = false;
    this.p2TackleLock = false; this.p2DribbleLock = false;
    this.pingMs = null;
    this.pingSamples = [];
    this.lastPingAt = 0;
    this.lastGameStateSequence = 0;
    this.lastOnlineActionInput = {};
    this.localActionSoundUntil = {};
    if (this.pingInterval) clearInterval(this.pingInterval);

    socketService.off('pong');
    socketService.on('pong', ({ sentAt, serverTime } = {}) => {
      const receivedAt = Date.now();
      const sample = receivedAt - Number(sentAt);
      if (!Number.isFinite(sample) || sample < 0 || sample > 5000) return;
      this.lastPingAt = Date.now();
      const sorted = [...this.pingSamples].sort((a, b) => a - b);
      const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : sample;
      // Do not let one delayed browser/WebRTC packet make the indicator jump.
      if (this.pingSamples.length >= 3 && sample > Math.max(350, median * 3)) return;
      this.pingSamples.push(sample);
      if (this.pingSamples.length > 9) this.pingSamples.shift();
      const stable = [...this.pingSamples].sort((a, b) => a - b);
      this.pingMs = stable[Math.floor(stable.length / 2)];
      // NTP midpoint estimation removes one-way network delay from the clock
      // offset, so every client maps replayStartAt to the same wall instant.
      const clockSample = estimateServerClockOffset(sentAt, receivedAt, serverTime);
      if (clockSample !== null) {
        this.serverClockOffsetMs = this.serverClockOffsetMs
          ? (this.serverClockOffsetMs * 0.75) + (clockSample * 0.25)
          : clockSample;
      }
    });
    const samplePing = () => socketService.emit('ping', { sentAt: Date.now() });
    samplePing();
    this.pingInterval = setInterval(samplePing, 1800);

    const socket = socketService.getSocket();
    if (socket) {
      socket.off('fieldSizeUpdated');
      socket.off('matchReset');
    }

    // Await the host snapshot with a readable value. A raw frame counter is
    // never useful to the player and used to expose a failed server tick.
    this.status = 'countdown';
    this.countdown = 5;

    // Always derive geometry from the latest lobby snapshot. This is vital on
    // rejoin, where the controller may still remember a previous room size.
    this.applyFieldDimensions(this.activeRoom?.fieldSize || this.fieldSize || 'medium');

    socketService.onGameState((state) => {
      if (state?.status === 'loading' && Date.now() - this.lastMatchReadySentAt > 1000) {
        this.lastMatchReadySentAt = Date.now();
        socketService.sendMatchClientReady();
      }
      const sequence = Number(state?.transportSequence || state?.sequence || 0);
      if (sequence > 0 && sequence <= this.lastGameStateSequence) return;
      if (sequence > 0) this.lastGameStateSequence = sequence;
      if (this.pendingRejoinConfirmation) {
        const localId = socketService.getSocket().id;
        const localPlayerRestored = state?.players?.some(player => player.id === localId);
        if (localPlayerRestored) {
          window.clearInterval(this.rejoinReadyInterval);
          this.rejoinReadyInterval = null;
          window.clearTimeout(this.pendingRejoinConfirmation.timeout);
          this.pendingRejoinConfirmation = null;
          showToast('Você voltou para a partida.', 'success');
        }
      }
      if (!this.lastPingAt && Number.isFinite(Number(state.serverSentAt))) {
        const offsetSample = Number(state.serverSentAt) - Date.now();
        this.serverClockOffsetMs = this.serverClockOffsetMs
          ? (this.serverClockOffsetMs * 0.8) + (offsetSample * 0.2)
          : offsetSample;
      }
      const pingEl = document.getElementById('ping-indicator');
      const pingStale = !!this.lastPingAt && Date.now() - this.lastPingAt > 4500;
      if (pingEl) {
        pingEl.textContent = this.pingMs == null
          ? (socketService.hasLiveHostConnection() ? 'Ping: medindo...' : 'Ping: sem conexão')
          : `Ping: ${pingStale ? '>' : ''}${Math.min(500, this.pingMs)}ms`;
      }
      if (this.inReplay && state.status !== 'freeze' && state.status !== 'replay') {
        this.endReplayPlayback();
      }
      this.status = state.status;
      this.countdown = state.countdown;
      this.phaseEndsAt = Number(state.phaseEndsAt || 0);
      this.score = state.score;
      this.matchTime = state.matchTime;
      this.matchHostPaused = !!state.isHostPaused;
      if (state.goalInfo) {
        this.lastGoal = state.goalInfo;
      }
      if (!this.inReplay && state.status !== 'replay') {
        this.recordOnlineReplayFrame(state);
      }
      const synchronizedNow = Date.now() + Number(this.serverClockOffsetMs || 0);
      const replayStillActive = !this.phaseEndsAt || synchronizedNow < this.phaseEndsAt - 100;
      if (state.status === 'replay' && replayStillActive && !this.inReplay && !this.replayFallbackTimer) {
        // The reliable replay payload may be delayed behind other control
        // packets on mobile. Start from buffered snapshots instead of freezing.
        this.replayFallbackTimer = setTimeout(() => {
          this.replayFallbackTimer = null;
          if (this.status !== 'replay' || this.inReplay || !this.onlineReplayBuffer?.length) return;
          const frameMs = (1000 / 30) * C.REPLAY_SLOWMO_FACTOR;
          const replayStartAt = this.phaseEndsAt
            ? this.phaseEndsAt - (this.onlineReplayBuffer.length * frameMs) - C.REPLAY_POST_GOAL_FREEZE_MS
            : 0;
          this.beginOnlineReplay(this.onlineReplayBuffer, this.lastGoal, frameMs, replayStartAt);
        }, C.REPLAY_SYNC_LEAD_MS + 150);
      }

      // Play sound effects triggered on server
      (state.soundEffects || []).forEach(sfx => {
        if ((this.localActionSoundUntil[sfx] || 0) > Date.now()) return;
        soundFx.play(sfx);
      });

      // Update focusLostBadge based on server's host pause state
      const badge = document.getElementById('focus-lost-badge');
      const continueButton = document.getElementById('disconnect-continue-btn');
      if (badge) {
        if (state.isDisconnectPaused) {
          badge.textContent = state.isDisconnectVoting
            ? `${state.disconnectedPlayerName || 'Jogador'} excedeu o limite. Votação: ${state.disconnectPauseRemaining || 0}s`
            : `${state.disconnectedPlayerName || 'Jogador'} saiu. Aguardando retorno: ${state.disconnectPauseRemaining || 0}s`;
          if (state.isDisconnectVoting) {
            badge.textContent = `${state.disconnectedPlayerName || 'Jogador'} não voltou. Decidam se o time continua: ${state.disconnectPauseRemaining || 0}s`;
          }
          badge.classList.remove('hidden');
        } else if (state.isHostPaused) {
          badge.textContent = '⏸️ Pausado (Dono da sala fora da aba)';
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }
      if (continueButton) {
        const me = state.players?.find(player => player.id === socketService.getSocket().id);
        const canVote = !!state.isDisconnectPaused && !!state.isDisconnectVoting && !!me && me.team === state.disconnectTeam;
        continueButton.classList.toggle('hidden', !canVote);
        if (canVote) {
          continueButton.textContent = `Continuar sem jogador (${state.continueVotes || 0}/${state.continueVotesRequired || 1})`;
          continueButton.onclick = () => socketService.voteContinueWithoutDisconnected();
        }
      }

      // Store authoritative snapshot targets. Client models extrapolate only
      // their visual position for a few frames between network updates.
      const snapshotReceivedAt = performance.now();
      const extrapolateMotion = state.status === 'playing'
        && !state.isHostPaused
        && !state.isDisconnectPaused
        && !this.inReplay;
      this.ball.updateState(state.ball, snapshotReceivedAt, extrapolateMotion);

      state.players.forEach(sp => {
        const roomPlayer = this.activeRoom?.players?.find(player => player.id === sp.id || (sp.uid && player.uid === sp.uid));
        if (!sp.uid && roomPlayer?.uid) sp.uid = roomPlayer.uid;
        if (!sp.skinId && roomPlayer?.skinId) sp.skinId = roomPlayer.skinId;
        if (!sp.skin || sp.skin === 'custom') {
          sp.skin = roomPlayer?.skin || '';
        }
        let p = this.players.find(x => x.id === sp.id);
        if (!p) {
          p = new ClientPlayer(sp);
          this.players.push(p);
        }
        p.updateState(sp, snapshotReceivedAt, extrapolateMotion);
        p.renderTrail = !this.isTouchDevice();
        if (!p.renderTrail) p.trail.length = 0;
      });

      // Capture after restoring cosmetics stripped from realtime snapshots.
      this.matchRecording?.capture(state);

      // Clear disconnected players
      const serverIds = state.players.map(x => x.id);
      this.players = this.players.filter(p => serverIds.includes(p.id));
    });

    socketService.getSocket().on('fieldSizeUpdated', ({ size }) => {
      this.applyFieldDimensions(size);
      showToast('O Host alterou o tamanho do campo!', 'info');
    });

    socketService.getSocket().on('matchReset', () => {
      showToast('A partida foi reiniciada pelo Host!', 'info');
      this.p1Tackles = 0; this.p1Dribbles = 0;
      this.p2Tackles = 0; this.p2Dribbles = 0;
    });

    socketService.onPlayReplay(({ replayFrames, goalInfo, replayStartAt, replayDelayMs, replayFrameMs }) => {
      if (this.inReplay) return;
      const frames = (replayFrames && replayFrames.length > 0) ? replayFrames : (this.onlineReplayBuffer || []);
      if (!frames || frames.length === 0) {
        this.lastGoal = goalInfo;
        this.endReplayPlayback();
        return;
      }
      this.beginOnlineReplay(frames, goalInfo, replayFrameMs, replayStartAt, replayDelayMs);
    });

    socketService.onMatchEnded((result) => {
      if (!socketService.isHost && this.currentUser?.uid) {
        localStorage.removeItem(`kicker_hax_rejoin_${this.currentUser.uid}`);
      }
      this.rejoinRoomMeta = null;
      this.onlineMatchFinished = true;
      if (this.inReplay) {
        this.pendingMatchResult = result;
        return;
      }
      this.showOnlineMatchEnd(result);
    });

    socketService.onLobbyUpdate((room) => {
      this.activeRoom = room;
    });

    socketService.onChat((msg) => {
      this.appendChatMessage(msg);
    });
    socketService.onChatRateLimited?.(({ retryAfterMs }) => {
      showToast(`Aguarde ${Math.max(1, Math.ceil(Number(retryAfterMs || 0) / 1000))}s para enviar outra mensagem.`, 'info');
    });

    socketService.getSocket().off('matchAborted');
    socketService.getSocket().off('kicked');
    socketService.getSocket().off('replaySkipped');
    socketService.getSocket().off('replayVoteStatus');
    socketService.getSocket().off('hostLeft');
    socketService.getSocket().off('roomChatCleared');
    socketService.getSocket().on('matchAborted', (payload) => {
      this.administrativeMatchAbort = true;
      this.onlineMatchFinished = true;
      this.pendingMatchResult = null;
      if (this.currentUser?.uid) localStorage.removeItem(`kicker_hax_rejoin_${this.currentUser.uid}`);
      if (payload?.lobbyInfo) this.activeRoom = payload.lobbyInfo;
      this.endReplayPlayback();
      showToast('Partida encerrada pelo host. Resultado não contabilizado.', 'info');
      this.clearRoomChatViews();
      if (payload?.closeRoom) {
        this.activeRoom = null;
        socketService.leaveRoom();
        router.show('multiplayer-screen');
      } else {
        router.show('lobby-screen');
      }
    });

    socketService.onKicked(() => {
      // A kicked participant must never reach post-match results or receive
      // progress. Leave the game view immediately and clear local match data.
      this.onlineMatchFinished = true;
      this.administrativeMatchAbort = true;
      this.pendingMatchResult = null;
      this.endReplayPlayback();
      this.activeRoom = null;
      this.clearRoomChatViews();
      socketService.leaveRoom();
      showToast('Você foi expulso da partida pelo host.', 'error');
      router.show('multiplayer-screen');
    });

    socketService.getSocket().on('replaySkipped', () => {
      this.endReplayPlayback();
    });
    socketService.getSocket().on('replayVoteStatus', ({ votes = 0, totalPlayers = 0 } = {}) => {
      const replayVoteButton = document.getElementById('replay-vote-skip-btn');
      if (replayVoteButton) replayVoteButton.textContent = `Pular replay (${votes}/${totalPlayers})`;
    });

    socketService.getSocket().on('hostLeft', (msg) => {
      if (this.administrativeMatchAbort) return;
      // A host forfeit already emitted a match result. Do not replace that
      // result screen with a false room-closed notification during teardown.
      if (!this.onlineMatchFinished && this.mode === 'multiplayer' && router.currentScreenId === 'match-screen') {
        this.endReplayPlayback();
        this.onlineMatchFinished = true;
        const result = this.buildHostDepartureResult();
        socketService.leaveRoom();
        this.showOnlineMatchEnd(result);
        showToast(msg || 'O host saiu. Seu time venceu por abandono.', 'success');
        return;
      }
      if (this.onlineMatchFinished) {
        this.activeRoom = null;
        this.clearRoomChatViews();
        if (router.currentScreenId === 'lobby-screen') {
          socketService.leaveRoom();
          router.show('multiplayer-screen');
          socketService.refreshPublicRooms();
        }
        showToast(msg || 'O host saiu. Seu time recebeu a vitória.', 'info');
        return;
      }
      this.endReplayPlayback();
      this.activeRoom = null;
      this.clearRoomChatViews();
      socketService.leaveRoom();
      showToast(msg || 'O host saiu. A partida foi encerrada.', 'error');
      router.show('multiplayer-screen');
    });

    socketService.getSocket().on('roomChatCleared', () => this.clearRoomChatViews());

    // High frequency client tick loop (60Hz animation loop)
    const tickOnlineGame = () => {
      if (router.currentScreenId !== 'match-screen') return;

      const localId = socketService.getSocket().id;
      const spectator = this.activeRoom?.players?.find(player => player.id === localId)?.team === 'spectator'
        || !this.players.some(player => player.id === localId);

      // Spectators render server state only. Sending 60 empty input packets
      // per second made the host data channel queue up and caused teleports.
      let input = { x: 0, y: 0, shoot: false, sprint: false, dribble: false, tackle: false, power: false };
      if (!spectator && !this.isTypingTarget() && !this.inReplay && !this.pauseMenuOpen) {
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
      }
      if (!spectator && this.isTouchDevice() && this.virtualInput) {
        input.x += this.virtualInput.x || 0;
        input.y += this.virtualInput.y || 0;
        input.shoot = input.shoot || !!this.virtualInput.shoot;
        input.sprint = input.sprint || !!this.virtualInput.sprint;
        input.dribble = input.dribble || !!this.virtualInput.dribble;
        input.tackle = input.tackle || !!this.virtualInput.tackle;
        input.power = input.power || !!this.virtualInput.power;
      }
      if (!spectator) {
        this.applyMobileTackleAssist(input, this.players.find(player => player.id === localId), this.ball);
      }

      if (!spectator) {
        this.playImmediateOnlineActionSfx(input);
        socketService.sendGameInput(input);
      }

      const me = this.players.find(player => player.id === localId);
      if (input.shoot && !this.onlineShootStartedAt) this.onlineShootStartedAt = Date.now();
      if (!input.shoot) this.onlineShootStartedAt = null;
      const localCharge = input.shoot && this.onlineShootStartedAt
        ? Math.min(1, (Date.now() - this.onlineShootStartedAt) / 900)
        : 0;

      // 2) Render Frame
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const replayCameraFrame = this.inReplay && !this.isReplayPostGoalHold() ? this.getCurrentReplayFrame() : null;
      const cameraShaking = this.beginPowerKickCamera(
        this.ctx,
        this.inReplay ? replayCameraFrame?.ball : this.status === 'playing' ? this.ball : null
      );
      this.drawFieldGrid(this.ctx);

      if (this.inReplay) {
        this.playbackReplay();
      } else {
        // Remote snapshots arrive about half an RTT behind the host. Adapt the
        // correction strength and project velocity to the guest's present;
        // low-ping play stays crisp while distant links stop snapping in a grid.
        const measuredPing = Math.max(0, Number(this.pingMs || 0));
        const networkDelayFrames = Math.min(10, measuredPing / 2 / (1000 / 60));
        const networkSmoothing = measuredPing > 180 ? 0.12
          : measuredPing > 100 ? 0.16
            : measuredPing > 60 ? 0.22 : 0.34;
        this.ball.interpolate(networkSmoothing, performance.now(), networkDelayFrames);
        this.drawShotPreview(this.ctx, me, this.ball, input, Math.max(localCharge, me?.kickCharge || 0));
        this.ball.draw(this.ctx);

        this.players.forEach(p => {
          const localPrediction = p.id === localId && this.status === 'playing' && !this.matchHostPaused
            ? { input, pingMs: this.pingMs || 0 }
            : null;
          p.interpolate(networkSmoothing, performance.now(), localPrediction, networkDelayFrames);
          p.draw(this.ctx, this.ball.owner);
        });
      }

      this.drawNetOverlay(this.ctx);
      if (cameraShaking) this.ctx.restore();

      // Refresh HUD Score clock
      const m = Math.floor(this.matchTime / 60);
      const s = Math.floor(this.matchTime % 60);
      const clockEl = document.getElementById('match-clock');
      const scoreEl = document.getElementById('match-score');

      if (clockEl) clockEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (scoreEl) scoreEl.textContent = `${this.score.red} : ${this.score.blue}`;

      if (this.status === 'countdown' && this.phaseEndsAt > 0) {
        const serverNow = Date.now() + Number(this.serverClockOffsetMs || 0);
        this.countdown = Math.max(0, Math.ceil((this.phaseEndsAt - serverNow) / 1000));
      }

      // Refresh sidebars (stamina / power / speed / tackles / dribbles)
      const myId = localId;
      const opp = this.players.find(p => p.id !== myId && p.team !== 'spectator');

      if (me) {
        const myStam = document.getElementById('right-stam-fill');
        const myPow = document.getElementById('right-pow-fill');
        if (myStam) myStam.style.height = `${me.stamina * 100}%`;

        if (myPow) myPow.style.height = `${localCharge * 100}%`;
        this.updateMobileActionMeters(me.stamina, Math.max(localCharge, me.kickCharge || 0));

        const canTrackLiveStats = this.status === 'playing' && !this.matchHostPaused && !this.inReplay;
        const serverStatsAvailable = !!me.matchStats;
        if (serverStatsAvailable) {
          const allStats = this.players.map(player => player.matchStats).filter(Boolean);
          const totalPossession = allStats.reduce((sum, stats) => sum + (stats.possessionFrames || 0), 0);
          this.p1PossessionFrames = me.matchStats.possessionFrames || 0;
          this.totalPossessionFrames = totalPossession;
          this.p1Shots = me.matchStats.shots || 0;
          this.p1Tackles = me.matchStats.tackles || 0;
          this.p1Dribbles = me.matchStats.dribbles || 0;
          this.p1Assists = me.matchStats.assists || 0;
        }
        // Track live stats only while the authoritative match is moving.
        if (!serverStatsAvailable && opp && canTrackLiveStats) {
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
        if (!serverStatsAvailable && canTrackLiveStats && this.ball.owner === me.id && (input.shoot || input.power) && !this.shotCooldown) {
          const ang = Math.atan2(this.ball.y - me.y, this.ball.x - me.x);
          const isAttackingRight = me.team === C.Team.BLUE;
          if ((isAttackingRight && Math.cos(ang) > 0.2) || (!isAttackingRight && Math.cos(ang) < -0.2)) {
            this.p1Shots = (this.p1Shots || 0) + 1;
            this.shotCooldown = 30;
          }
        }

        // Tackle count
        if (!serverStatsAvailable && canTrackLiveStats && me.tackle_cd > 0 && !this.p1TackleLock) {
          this.p1Tackles = (this.p1Tackles || 0) + 1;
          this.p1TackleLock = true;
        } else if (me.tackle_cd === 0) {
          this.p1TackleLock = false;
        }
        // Dribble count
        if (!serverStatsAvailable && canTrackLiveStats && me.dribble_cd > 0 && !this.p1DribbleLock) {
          this.p1Dribbles = (this.p1Dribbles || 0) + 1;
          this.p1DribbleLock = true;
        } else if (me.dribble_cd === 0) {
          this.p1DribbleLock = false;
        }

        const rightPossEl = document.getElementById('right-stat-possession');
        const rightShotsEl = document.getElementById('right-stat-shots');
        const rightTacklesEl = document.getElementById('right-stat-tackles');
        const rightDribblesEl = document.getElementById('right-stat-dribbles');
        const rightAssistsEl = document.getElementById('right-stat-assists');
        if (rightPossEl) rightPossEl.textContent = `${p1Poss}%`;
        if (rightShotsEl) rightShotsEl.textContent = this.p1Shots || 0;
        if (rightTacklesEl) rightTacklesEl.textContent = this.p1Tackles || 0;
        if (rightDribblesEl) rightDribblesEl.textContent = this.p1Dribbles || 0;
        if (rightAssistsEl) rightAssistsEl.textContent = this.p1Assists || 0;
        this.refreshMobileStatsModal();
        this.refreshLiveMatchReportIfOpen();
      }

      if (opp) {
        const oppStam = document.getElementById('left-stam-fill');
        const oppPow = document.getElementById('left-pow-fill');
        if (oppStam) oppStam.style.height = `${opp.stamina * 100}%`;
        if (oppPow) oppPow.style.height = `${(opp.kickCharge || 0) * 100}%`;
      }

      // Render countdown banner
      if (this.status === 'loading') {
        this.drawCenterBanner('Aguardando jogadores...', 'A partida começa quando todos abrirem o campo.');
      } else if (this.status === 'countdown') {
        this.drawCenterBanner(`Começa em ${this.countdown}...`, 'Prepare-se!');
      } else if (this.status === 'freeze') {
        const goal = this.lastGoal || { scorerName: 'Jogador', ownGoal: false };
        const label = goal.ownGoal ?`GOL CONTRA de ${goal.scorerName}` : `GOL DE ${goal.scorerName}!`;
        const assistLabel = goal.assistName ? `Assistência de ${goal.assistName}` : 'Revisando jogada...';
        this.drawCenterBanner(label, assistLabel, true);
      }

      this.localPhysicsTick = requestAnimationFrame(tickOnlineGame);
    };

    this.localPhysicsTick = requestAnimationFrame(tickOnlineGame);
    // The authoritative clock remains stopped until every active client has
    // installed its state/replay listeners and opened this match view.
    this.lastMatchReadySentAt = Date.now();
    socketService.sendMatchClientReady();
    if (this.onlineMatchMeta?.rejoined) {
      window.clearInterval(this.rejoinReadyInterval);
      this.rejoinReadyInterval = window.setInterval(() => socketService.sendMatchClientReady(), 600);
      if (this.pendingRejoinConfirmation) {
        this.pendingRejoinConfirmation.timeout = window.setTimeout(() => {
          if (this.pendingRejoinConfirmation) this.pendingRejoinConfirmation.timeout = null;
          // The host already owns this player again. Keep requesting the
          // bootstrap instead of sending the client back to a now-invalid
          // arena reservation and creating a second ghost reconnection.
          showToast('Retorno aceito. A sincronização está demorando; mantendo a conexão...', 'info');
        }, 12000);
      }
    }
  },

  stopMatchView() {
    cancelAnimationFrame(this.localPhysicsTick);
    this.tutorialSession?.destroy();
    this.tutorialSession = null;
    this.stopLocalReplayRecording();
    clearTimeout(this.replayFallbackTimer);
    this.replayFallbackTimer = null;
    this.replayFrames = [];
    this.onlineReplayBuffer = [];
    this.inReplay = false;
    soundFx.stopCrowd();
    socketService.clearListeners();
    if (this.pingInterval) clearInterval(this.pingInterval);
    this.pingInterval = null;
    window.clearInterval(this.rejoinReadyInterval);
    this.rejoinReadyInterval = null;
    if (!this.rejoinRemountInProgress) {
      if (this.pendingRejoinConfirmation?.timeout) window.clearTimeout(this.pendingRejoinConfirmation.timeout);
      this.pendingRejoinConfirmation = null;
    }
    this.pingMs = null;
    this.isPaused = false;
    this.pauseMenuOpen = false;
    this.matchHostPaused = false;
    this.onlineMatchFinished = false;
    this.onlineShootStartedAt = null;
    document.getElementById('pause-modal')?.classList.add('hidden');
    document.getElementById('focus-lost-badge')?.classList.add('hidden');
    document.getElementById('replay-overlay')?.classList.add('hidden');
    if (this.boundResizeHandler) window.removeEventListener('resize', this.boundResizeHandler);
    if (this.boundFullscreenHandler) document.removeEventListener('fullscreenchange', this.boundFullscreenHandler);
    if (this.boundVisibilityHandler) document.removeEventListener('visibilitychange', this.boundVisibilityHandler);
    if (this.boundBlurHandler) window.removeEventListener('blur', this.boundBlurHandler);
    if (this.boundFocusHandler) window.removeEventListener('focus', this.boundFocusHandler);
    if (this.boundMatchKeyHandler) window.removeEventListener('keydown', this.boundMatchKeyHandler, true);
    this.clearPressedKeys();
    document.getElementById('mobile-controls')?.classList.add('hidden');
    document.getElementById('mobile-chat-toggle')?.classList.add('hidden');
    document.getElementById('mobile-stats-toggle')?.classList.add('hidden');
    document.getElementById('mobile-pause-toggle')?.classList.add('hidden');
    this.closeMobileHudEditorUI();
    if (this.matchRecording) this.matchRecording.active = false;
    this.matchRecording = null;
    this.players = [];
    this.ball = null;
    document.getElementById('ping-indicator')?.classList.add('hidden');
    document.getElementById('match-screen')?.classList.remove('mobile-match', 'mobile-stats-open', 'hud-editor-mode');
    this.hudEditorMode = false;
  },

  refreshMobileMatchChrome() {
    const mobile = this.isTouchDevice();
    const root = document.getElementById('match-screen');
    root?.classList.toggle('mobile-match', mobile);
    document.getElementById('mobile-controls')?.classList.toggle('hidden', !mobile);
    document.getElementById('mobile-chat-toggle')?.classList.toggle('hidden', !mobile || (this.mode !== 'multiplayer' && !this.hudEditorMode));
    document.getElementById('mobile-stats-toggle')?.classList.toggle('hidden', !mobile);
    document.getElementById('mobile-pause-toggle')?.classList.toggle('hidden', !mobile);
    if (!mobile) {
      root?.classList.remove('mobile-stats-open');
      document.getElementById('game-chat-overlay')?.classList.toggle('hidden', this.mode !== 'multiplayer');
    }
    // Fullscreen on mobile must be user-initiated; automatic calls are blocked
    // by browsers and spam the console during HUD editing.
  },

  applyMobileHudSettings() {
    const hud = {
      ...structuredClone(DEFAULT_MOBILE_HUD),
      ...(settingsController.mobileHud || {}),
      actionPositions: {
        ...structuredClone(DEFAULT_MOBILE_HUD.actionPositions),
        ...(settingsController.mobileHud?.actionPositions || {})
      },
      actionStyles: {
        ...structuredClone(DEFAULT_MOBILE_HUD.actionStyles),
        ...(settingsController.mobileHud?.actionStyles || {})
      }
    };
    const root = document.getElementById('match-screen');
    const controls = document.getElementById('mobile-controls');
    if (root) {
      root.classList.toggle('mobile-hide-stats', !hud.showStats);
      root.classList.toggle('mobile-large-controls', !!hud.largeButtons);
    }
    if (controls) {
      controls.style.setProperty('--mobile-controls-opacity', `${Math.max(40, Math.min(100, hud.opacity || 80)) / 100}`);
      controls.style.setProperty('--mobile-stick-x', `${hud.stickX ?? 7}%`);
      controls.style.setProperty('--mobile-stick-y', `${hud.stickY ?? 18}%`);
      const stickEl = controls.querySelector('.mobile-stick');
      stickEl?.style.setProperty('--mobile-stick-x', `${hud.stickX}%`);
      stickEl?.style.setProperty('--mobile-stick-y', `${hud.stickY}%`);
      stickEl?.style.setProperty('--mobile-stick-size', `${hud.stickSize}px`);
      stickEl?.style.setProperty('--mobile-stick-opacity', `${Math.max(0, Math.min(100, hud.stickOpacity)) / 100}`);
      if (stickEl) {
        const size = Math.max(48, Math.min(160, Number(hud.stickSize) || DEFAULT_MOBILE_HUD.stickSize));
        stickEl.style.width = `${size}px`;
        stickEl.style.height = `${size}px`;
        stickEl.style.opacity = `${Math.max(0, Math.min(100, hud.stickOpacity)) / 100}`;
        const knob = stickEl.querySelector('.mobile-stick-knob');
        if (knob) {
          const knobSize = Math.max(36, Math.min(78, Math.round(size * 0.55)));
          knob.style.width = `${knobSize}px`;
          knob.style.height = `${knobSize}px`;
        }
      }
      controls.querySelectorAll('[data-mobile-action]').forEach(btn => {
        const pos = hud.actionPositions[btn.dataset.mobileAction] || DEFAULT_MOBILE_HUD.actionPositions[btn.dataset.mobileAction];
        const style = hud.actionStyles[btn.dataset.mobileAction] || DEFAULT_MOBILE_HUD.actionStyles[btn.dataset.mobileAction];
        if (!pos) return;
        btn.style.setProperty('--action-x', `${pos.x}%`);
        btn.style.setProperty('--action-y', `${pos.y}%`);
        btn.style.setProperty('--action-size', `${style?.size || 54}px`);
        btn.style.setProperty('--button-opacity', `${Math.max(0, Math.min(100, style?.opacity ?? 80)) / 100}`);
      });
    }
    const chatToggle = document.getElementById('mobile-chat-toggle');
    const statsToggle = document.getElementById('mobile-stats-toggle');
    const pauseToggle = document.getElementById('mobile-pause-toggle');
    if (chatToggle) {
      chatToggle.style.setProperty('--mobile-chat-x', `${hud.chatX}%`);
      chatToggle.style.setProperty('--mobile-chat-y', `${hud.chatY}%`);
      chatToggle.style.setProperty('--toggle-size', `${hud.chatSize}px`);
      chatToggle.style.setProperty('--toggle-opacity', `${Math.max(0, Math.min(100, hud.chatOpacity)) / 100}`);
      chatToggle.style.width = `${Math.max(36, Math.min(132, Number(hud.chatSize) || DEFAULT_MOBILE_HUD.chatSize))}px`;
      chatToggle.style.height = chatToggle.style.width;
      chatToggle.style.opacity = `${Math.max(0, Math.min(100, hud.chatOpacity)) / 100}`;
    }
    if (statsToggle) {
      statsToggle.style.setProperty('--mobile-stats-x', `${hud.statsX}%`);
      statsToggle.style.setProperty('--mobile-stats-y', `${hud.statsY}%`);
      statsToggle.style.setProperty('--toggle-size', `${hud.statsSize}px`);
      statsToggle.style.setProperty('--toggle-opacity', `${Math.max(0, Math.min(100, hud.statsOpacity)) / 100}`);
      statsToggle.style.width = `${Math.max(36, Math.min(132, Number(hud.statsSize) || DEFAULT_MOBILE_HUD.statsSize))}px`;
      statsToggle.style.height = statsToggle.style.width;
      statsToggle.style.opacity = `${Math.max(0, Math.min(100, hud.statsOpacity)) / 100}`;
    }
    if (pauseToggle) {
      pauseToggle.style.setProperty('--mobile-pause-x', `${hud.pauseX}%`);
      pauseToggle.style.setProperty('--mobile-pause-y', `${hud.pauseY}%`);
      pauseToggle.style.setProperty('--toggle-size', `${hud.pauseSize}px`);
      pauseToggle.style.setProperty('--toggle-opacity', `${Math.max(0, Math.min(100, hud.pauseOpacity)) / 100}`);
      pauseToggle.style.width = `${Math.max(36, Math.min(132, Number(hud.pauseSize) || DEFAULT_MOBILE_HUD.pauseSize))}px`;
      pauseToggle.style.height = pauseToggle.style.width;
      pauseToggle.style.opacity = `${Math.max(0, Math.min(100, hud.pauseOpacity)) / 100}`;
    }
  },

  startMobileHudEditor() {
    if (!this.isTouchDevice()) {
      showToast('Editor de HUD mobile disponível apenas em dispositivos móveis.', 'info');
      return;
    }
    this.stopMatchView();
    this.mode = 'solo';
    this.practiceMode = true;
    this.hudEditorMode = true;
    this.matchTime = 24 * 60 * 60;
    this.goalLimit = 0;
    this.status = 'countdown';
    router.show('match-screen');
    this.startMatchView();
    setTimeout(() => this.enableMobileHudEditor(), 80);
  },

  enableMobileHudEditor() {
    const root = document.getElementById('match-screen');
    if (!root || !this.hudEditorMode) return;
    root.classList.add('hud-editor-mode');
    root.classList.remove('mobile-stats-open');
    this.refreshMobileMatchChrome();
    this.applyMobileHudSettings();
    this.clearPressedKeys();
    document.getElementById('mobile-chat-toggle')?.classList.remove('hidden');
    document.getElementById('mobile-stats-toggle')?.classList.remove('hidden');
    document.getElementById('mobile-pause-toggle')?.classList.remove('hidden');

    let confirmBtn = document.getElementById('mobile-hud-confirm');
    if (!confirmBtn) {
      confirmBtn = document.createElement('button');
      confirmBtn.id = 'mobile-hud-confirm';
      confirmBtn.type = 'button';
      confirmBtn.className = 'mobile-hud-confirm';
      confirmBtn.textContent = 'Confirmar HUD';
      root.appendChild(confirmBtn);
    }
    confirmBtn.classList.remove('hidden');
    confirmBtn.onclick = () => {
      settingsController.saveMobileHudSettings(settingsController.mobileHud);
      showToast('HUD mobile salvo.', 'success');
      this.hudEditorMode = false;
      root.classList.remove('hud-editor-mode');
      confirmBtn.classList.add('hidden');
      this.clearMobileHudEditHandles();
      this.stopMatchView();
      router.show('controls-screen');
    };

    const bindDrag = (el, update, dragSurface = el) => {
      if (!el || !dragSurface || dragSurface.dataset.hudDragBound === 'true') return;
      dragSurface.dataset.hudDragBound = 'true';
      if (el !== dragSurface) el.dataset.hudDragBound = 'true';
      let dragging = false;
      const startDrag = (event) => {
        if (!this.hudEditorMode) return;
        if (event.target.closest?.('.hud-edit-handle')) return;
        event.preventDefault();
        event.stopPropagation();
        dragging = true;
        event.currentTarget?.setPointerCapture?.(event.pointerId);
        update(event);
      };
      const moveDrag = (event) => {
        if (!this.hudEditorMode || !dragging) return;
        event.preventDefault();
        event.stopPropagation();
        update(event);
      };
      const endDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        event.currentTarget?.releasePointerCapture?.(event.pointerId);
        settingsController.saveMobileHudSettings(settingsController.mobileHud);
      };
      [dragSurface, el].forEach(target => {
        target.addEventListener('pointerdown', startDrag);
        target.addEventListener('pointermove', moveDrag);
        target.addEventListener('pointerup', endDrag);
        target.addEventListener('pointercancel', endDrag);
      });
    };

    const toHudPosition = (event) => ({
      x: Math.max(2, Math.min(94, Math.round((event.clientX / window.innerWidth) * 100))),
      y: Math.max(4, Math.min(86, Math.round(((window.innerHeight - event.clientY) / window.innerHeight) * 100)))
    });

    const stick = document.querySelector('#mobile-controls .mobile-stick');
    bindDrag(stick, (event) => {
      const pos = toHudPosition(event);
      settingsController.mobileHud = { ...settingsController.mobileHud, stickX: pos.x, stickY: pos.y };
      this.applyMobileHudSettings();
      settingsController.saveMobileHudSettings(settingsController.mobileHud);
      this.renderMobileHudEditHandles();
    });

    document.querySelectorAll('#mobile-controls [data-mobile-action]').forEach(btn => {
      bindDrag(btn, (event) => {
        const pos = toHudPosition(event);
        settingsController.mobileHud = {
          ...settingsController.mobileHud,
          actionPositions: {
            ...structuredClone(DEFAULT_MOBILE_HUD.actionPositions),
            ...(settingsController.mobileHud.actionPositions || {}),
            [btn.dataset.mobileAction]: pos
          }
        };
        this.applyMobileHudSettings();
        this.renderMobileHudEditHandles();
      });
    });

    const chatToggle = document.getElementById('mobile-chat-toggle');
    const chatSurface = this.createMobileHudDragSurface('chat', chatToggle);
    bindDrag(chatToggle, (event) => {
      const pos = toHudPosition(event);
      settingsController.mobileHud = { ...settingsController.mobileHud, chatX: pos.x, chatY: pos.y };
      this.applyMobileHudSettings();
      this.renderMobileHudEditHandles();
    }, chatSurface);
    const statsToggle = document.getElementById('mobile-stats-toggle');
    const statsSurface = this.createMobileHudDragSurface('stats', statsToggle);
    bindDrag(statsToggle, (event) => {
      const pos = toHudPosition(event);
      settingsController.mobileHud = { ...settingsController.mobileHud, statsX: pos.x, statsY: pos.y };
      this.applyMobileHudSettings();
      this.renderMobileHudEditHandles();
    }, statsSurface);
    const pauseToggle = document.getElementById('mobile-pause-toggle');
    const pauseSurface = this.createMobileHudDragSurface('pause', pauseToggle);
    bindDrag(pauseToggle, (event) => {
      const pos = toHudPosition(event);
      settingsController.mobileHud = { ...settingsController.mobileHud, pauseX: pos.x, pauseY: pos.y };
      this.applyMobileHudSettings();
      this.renderMobileHudEditHandles();
    }, pauseSurface);
    this.renderMobileHudEditHandles();
  },

  createMobileHudDragSurface(key, target) {
    if (!target) return target;
    let surface = document.querySelector(`.hud-drag-surface[data-target-key="${key}"]`);
    if (!surface) {
      surface = document.createElement('div');
      surface.className = 'hud-drag-surface';
      surface.dataset.targetKey = key;
      document.getElementById('match-screen')?.appendChild(surface);
    }
    const update = () => {
      const rect = target.getBoundingClientRect();
      surface.style.left = `${rect.left + rect.width / 2}px`;
      surface.style.top = `${rect.top + rect.height / 2}px`;
    };
    update();
    return surface;
  },

  clearMobileHudEditHandles() {
    document.querySelectorAll('.hud-edit-handle').forEach(handle => handle.remove());
    document.querySelectorAll('.hud-drag-surface').forEach(surface => surface.remove());
  },

  closeMobileHudEditorUI() {
    // The editor is a temporary training view. Explicitly clear every piece
    // of its chrome so a later solo or online match cannot inherit its modal.
    document.getElementById('mobile-hud-confirm')?.classList.add('hidden');
    document.getElementById('mobile-hud-config-modal')?.classList.add('hidden');
    this.clearMobileHudEditHandles();
    document.getElementById('match-screen')?.classList.remove('hud-editor-mode');
  },

  renderMobileHudEditHandles() {
    if (!this.hudEditorMode) return;
    const targets = [
      document.querySelector('#mobile-controls .mobile-stick'),
      ...document.querySelectorAll('#mobile-controls [data-mobile-action]'),
      document.getElementById('mobile-chat-toggle'),
      document.getElementById('mobile-stats-toggle'),
      document.getElementById('mobile-pause-toggle')
    ].filter(Boolean);

    const root = document.getElementById('match-screen');
    if (!root) return;
    const existing = new Map([...document.querySelectorAll('.hud-edit-handle')].map(el => [el.dataset.targetKey, el]));
    const activeKeys = new Set();
    targets.forEach((target, index) => {
      const key = target.dataset.mobileAction || (target.classList.contains('mobile-stick') ? 'stick' : target.id.replace('mobile-', '').replace('-toggle', ''));
      activeKeys.add(key);
      let handle = existing.get(key);
      if (!handle) {
        handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'hud-edit-handle';
        handle.textContent = '✏️';
        handle.dataset.targetKey = key;
        handle.setAttribute('draggable', 'false');
        handle.addEventListener('contextmenu', (event) => event.preventDefault());
        handle.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          event.stopPropagation();
        });
        handle.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.openMobileHudElementSettings(target);
        });
        root.appendChild(handle);
      }
      const rect = target.getBoundingClientRect();
      handle.style.left = `${Math.min(window.innerWidth - 28, rect.right - 14)}px`;
      handle.style.top = `${Math.max(4, rect.top - 10)}px`;
      handle.style.zIndex = `${30 + index}`;
      const surface = document.querySelector(`.hud-drag-surface[data-target-key="${key}"]`);
      if (surface) {
        surface.style.left = `${rect.left + rect.width / 2}px`;
        surface.style.top = `${rect.top + rect.height / 2}px`;
      }
    });
    existing.forEach((handle, key) => {
      if (!activeKeys.has(key)) handle.remove();
    });
  },

  openMobileHudElementSettings(el) {
    const key = el.dataset.mobileAction || (
      el.classList.contains('mobile-stick') ? 'stick' :
        el.id === 'mobile-chat-toggle' ? 'chat' :
          el.id === 'mobile-pause-toggle' ? 'pause' : 'stats'
    );
    const hud = settingsController.mobileHud;
    const current = key === 'stick'
      ? { size: hud.stickSize, opacity: hud.stickOpacity }
      : key === 'chat'
        ? { size: hud.chatSize, opacity: hud.chatOpacity }
        : key === 'pause'
          ? { size: hud.pauseSize, opacity: hud.pauseOpacity }
        : key === 'stats'
          ? { size: hud.statsSize, opacity: hud.statsOpacity }
          : (hud.actionStyles?.[key] || DEFAULT_MOBILE_HUD.actionStyles[key]);

    let modal = document.getElementById('mobile-hud-config-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mobile-hud-config-modal';
      modal.className = 'mobile-hud-config-modal hidden';
      document.getElementById('match-screen')?.appendChild(modal);
    }
    modal.innerHTML = `
      <button type="button" class="mobile-modal-close" id="mobile-hud-config-close">×</button>
      <h3>Configurar controle</h3>
      <label>Tamanho <input id="mobile-hud-config-size" type="range" min="36" max="132" value="${current.size || 54}" /></label>
      <label>Opacidade <input id="mobile-hud-config-opacity" type="range" min="0" max="100" value="${current.opacity ?? 80}" /></label>
    `;
    modal.classList.remove('hidden');
    modal.querySelector('#mobile-hud-config-close')?.addEventListener('click', () => modal.classList.add('hidden'));

    const apply = () => {
      const size = parseInt(modal.querySelector('#mobile-hud-config-size')?.value || '54', 10);
      const opacity = parseInt(modal.querySelector('#mobile-hud-config-opacity')?.value || '80', 10);
      if (key === 'stick') {
        settingsController.mobileHud = { ...settingsController.mobileHud, stickSize: size, stickOpacity: opacity };
      } else if (key === 'chat') {
        settingsController.mobileHud = { ...settingsController.mobileHud, chatSize: size, chatOpacity: opacity };
      } else if (key === 'stats') {
        settingsController.mobileHud = { ...settingsController.mobileHud, statsSize: size, statsOpacity: opacity };
      } else if (key === 'pause') {
        settingsController.mobileHud = { ...settingsController.mobileHud, pauseSize: size, pauseOpacity: opacity };
      } else {
        settingsController.mobileHud = {
          ...settingsController.mobileHud,
          actionStyles: {
            ...structuredClone(DEFAULT_MOBILE_HUD.actionStyles),
            ...(settingsController.mobileHud.actionStyles || {}),
            [key]: { size, opacity }
          }
        };
      }
      this.applyMobileHudSettings();
    };
    modal.querySelector('#mobile-hud-config-size')?.addEventListener('input', apply);
    modal.querySelector('#mobile-hud-config-opacity')?.addEventListener('input', apply);
  },

  updateMobileActionMeters(stamina = 1, kickCharge = 0) {
    const controls = document.getElementById('mobile-controls');
    if (!controls || controls.classList.contains('hidden')) return;
    const sprintBtn = controls.querySelector('[data-mobile-action="sprint"]');
    const shootBtn = controls.querySelector('[data-mobile-action="shoot"]');
    if (sprintBtn) sprintBtn.style.setProperty('--meter', `${Math.round(Math.max(0, Math.min(1, stamina)) * 360)}deg`);
    if (shootBtn) shootBtn.style.setProperty('--meter', `${Math.round(Math.max(0, Math.min(1, kickCharge)) * 360)}deg`);
  },

  toggleMobileStatsModal() {
    let modal = document.getElementById('mobile-stats-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'mobile-stats-modal';
      modal.className = 'mobile-stats-modal hidden';
      modal.innerHTML = `
        <button type="button" class="mobile-modal-close" id="mobile-stats-close">×</button>
        <h3>Estatísticas</h3>
        <div class="mobile-stat-row"><span>Posse</span><strong data-mobile-stat="possession">0%</strong></div>
        <div class="mobile-stat-row"><span>Dribles</span><strong data-mobile-stat="dribbles">0</strong></div>
        <div class="mobile-stat-row"><span>Chutes</span><strong data-mobile-stat="shots">0</strong></div>
        <div class="mobile-stat-row"><span>Desarmes</span><strong data-mobile-stat="tackles">0</strong></div>
        <div class="mobile-stat-row"><span>Assistências</span><strong data-mobile-stat="assists">0</strong></div>
        <button type="button" class="btn btn-primary btn-block" id="mobile-live-report-open">Relatório completo</button>
      `;
      document.getElementById('match-screen')?.appendChild(modal);
      document.getElementById('mobile-stats-close')?.addEventListener('click', () => modal.classList.add('hidden'));
      document.getElementById('mobile-live-report-open')?.addEventListener('click', () => {
        modal.classList.add('hidden');
        this.showLiveMatchReport(true);
      });
    }
    modal.classList.toggle('hidden');
    this.refreshMobileStatsModal();
  },

  refreshMobileStatsModal() {
    const modal = document.getElementById('mobile-stats-modal');
    if (!modal) return;
    const set = (key, value) => {
      const el = modal.querySelector(`[data-mobile-stat="${key}"]`);
      if (el) el.textContent = value;
    };
    set('possession', document.getElementById('right-stat-possession')?.textContent || '0%');
    set('dribbles', document.getElementById('right-stat-dribbles')?.textContent || '0');
    set('shots', document.getElementById('right-stat-shots')?.textContent || '0');
    set('tackles', document.getElementById('right-stat-tackles')?.textContent || '0');
    set('assists', document.getElementById('right-stat-assists')?.textContent || '0');
  },

  refreshLiveMatchReportIfOpen() {
    const modal = document.getElementById('live-match-report-modal');
    if (!modal || modal.classList.contains('hidden')) return;
    const now = performance.now();
    if (now - Number(this.lastLiveReportRefreshAt || 0) < 300) return;
    this.lastLiveReportRefreshAt = now;
    this.showLiveMatchReport(true);
  },

  showLiveMatchReport(show = true) {
    const modal = document.getElementById('live-match-report-modal');
    const content = document.getElementById('live-match-report-content');
    if (!modal || !content) return;
    if (!show) {
      modal.classList.add('hidden');
      return;
    }
    const report = this.mode === 'multiplayer'
      ? buildLiveMatchReport(this.players, this.score)
      : buildMatchReport({
        score: this.localMatchSim?.score || this.score,
        winnerTeam: 'draw',
        playerStats: this.players.map(player => ({
          playerId: player.id,
          username: player.name || 'Jogador',
          team: player.team,
          goals: player.matchStats?.goals || 0,
          assists: player.matchStats?.assists || 0,
          ownGoals: player.matchStats?.ownGoals || 0,
          shots: player.id === 'p1' ? this.p1Shots || 0 : player.matchStats?.shots || 0,
          dribbles: player.id === 'p1' ? this.p1Dribbles || 0 : player.matchStats?.dribbles || 0,
          tackles: player.id === 'p1' ? this.p1Tackles || 0 : player.matchStats?.tackles || 0,
          possessionFrames: player.id === 'p1' ? this.p1PossessionFrames || 0 : this.cpuPossessionFrames || 0
        }))
      });
    renderMatchReport(content, report);
    modal.classList.remove('hidden');
  },

  // ==========================================================================
  // REPLAY CAPTURE & EXPORT (MP4 LOCAL REC)
  // ==========================================================================
  startLocalReplayRecording() {
    if (!this.canvas || this.isRecording) return;
    if (this.isTouchDevice()) {
      // MediaRecorder on mobile browsers is expensive enough to stutter the
      // mandatory goal replay, so phones/tablets render only the playback.
      this.replayBlob = null;
      this.recordedChunks = [];
      return;
    }

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
    const now = Date.now();
    if (this.matchHostPaused || this.isPaused) {
      this.replayPauseStartedAt ||= now;
      return;
    }
    if (this.replayPauseStartedAt) {
      this.replayStartedAtWall += now - this.replayPauseStartedAt;
      this.replayPauseStartedAt = null;
    }
    const position = getReplayPosition(
      this.replayStartedAtWall || now,
      this.replayFrameMs || ((1000 / 60) * C.REPLAY_SLOWMO_FACTOR),
      this.replayFrames.length,
      now,
      C.REPLAY_POST_GOAL_FREEZE_MS
    );
    if (position.ended) {
      this.endReplayPlayback();
      return;
    }
    this.replayFrameIdx = position.index;
    const frame = interpolateReplayFrame(
      this.replayFrames[position.index],
      this.replayFrames[Math.min(this.replayFrames.length - 1, position.index + 1)],
      position.ratio
    );
    if (!frame) return;

    // Trigger local audio triggers synced with frames
    if (this.replayFrameIdx !== this.lastReplaySfxIdx) {
      (frame.sfx || []).forEach(sfx => soundFx.play(sfx));
      this.lastReplaySfxIdx = this.replayFrameIdx;
    }

    // Render replay frame directly
    // Ball
    ctxBallDraw(
      this.ctx,
      frame.ball.x,
      frame.ball.y,
      frame.ball.lastStrikeType,
      frame.ball.strikeTimer,
      frame.ball.vx,
      frame.ball.vy
    );

    // Players
    frame.players.forEach(p => {
      const replaySkin = p.skin || this.players.find(player => player.id === p.id || player.name === p.name)?.skin || '';
      const replayRole = p.staffRole || this.players.find(player => player.id === p.id || player.name === p.name)?.staffRole || '';
      ctxPlayerDraw(this.ctx, p.x, p.y, p.team, p.name, p.badge, replaySkin, p.halo, p.inv, p.stun, p.has, replayRole);
    });

    // Replay text info
    const captionEl = document.getElementById('replay-caption');
    if (captionEl && this.lastGoal) {
      const label = this.lastGoal.ownGoal ?`GOL CONTRA de ${this.lastGoal.scorerName}` : `GOL DE ${this.lastGoal.scorerName}!`;
      captionEl.textContent = this.lastGoal.assistName ? `${label} Assistência de ${this.lastGoal.assistName}.` : label;
      captionEl.style.display = 'block';
    }
  },

  getCurrentReplayFrame(now = Date.now()) {
    if (!this.inReplay || !this.replayFrames.length) return null;
    const position = getReplayPosition(
      this.replayStartedAtWall || now,
      this.replayFrameMs || ((1000 / 60) * C.REPLAY_SLOWMO_FACTOR),
      this.replayFrames.length,
      now,
      C.REPLAY_POST_GOAL_FREEZE_MS
    );
    return interpolateReplayFrame(
      this.replayFrames[position.index],
      this.replayFrames[Math.min(this.replayFrames.length - 1, position.index + 1)],
      position.ratio
    );
  },

  isReplayPostGoalHold(now = Date.now()) {
    if (!this.inReplay || !this.replayFrames.length) return false;
    return getReplayPosition(
      this.replayStartedAtWall || now,
      this.replayFrameMs || ((1000 / 60) * C.REPLAY_SLOWMO_FACTOR),
      this.replayFrames.length,
      now,
      C.REPLAY_POST_GOAL_FREEZE_MS
    ).holding;
  },

  endReplayPlayback() {
    clearTimeout(this.replayFallbackTimer);
    this.replayFallbackTimer = null;
    this.inReplay = false;
    this.stopLocalReplayRecording();
    document.getElementById('replay-overlay')?.classList.add('hidden');
    const captionEl = document.getElementById('replay-caption');
    if (captionEl) captionEl.style.display = 'none';
    this.replayStartedAtWall = null;
    this.replayFrameMs = null;
    this.replayPauseStartedAt = null;
    this.lastReplaySfxIdx = -1;

    // Resume persistent stadium audio
    soundFx.ensureAudio();

    if (this.pendingMatchResult) {
      const pending = this.pendingMatchResult;
      this.pendingMatchResult = null;
      this.showOnlineMatchEnd(pending);
    }
  },

  beginOnlineReplay(frames, goalInfo, replayFrameMs, replayStartAt = 0) {
    if (!Array.isArray(frames) || frames.length === 0) return;
    clearTimeout(this.replayFallbackTimer);
    this.replayFallbackTimer = null;
    this.inReplay = true;
    // Compact live snapshots omit identity between periodic extended states.
    // Carry the last known identity through every replay frame so names,
    // badges, skins and staff tags never blink during online playback.
    const identities = new Map();
    this.players.forEach(player => identities.set(player.id, {
      name: player.name || '',
      badge: player.badge || '',
      skin: player.skin || '',
      staffRole: player.staffRole || ''
    }));
    this.activeRoom?.players?.forEach(player => {
      const current = identities.get(player.id) || {};
      identities.set(player.id, {
        name: player.username || current.name || '',
        badge: player.badge || current.badge || '',
        skin: player.skin || current.skin || '',
        staffRole: player.staffRole || current.staffRole || ''
      });
    });
    this.replayFrames = frames.map(frame => ({
      ...frame,
      players: (frame.players || []).map(player => {
        const known = identities.get(player.id) || {};
        const identity = {
          name: player.name || known.name || '',
          badge: player.badge || known.badge || '',
          skin: player.skin || known.skin || '',
          staffRole: player.staffRole || known.staffRole || ''
        };
        identities.set(player.id, identity);
        return { ...player, ...identity };
      })
    }));
    this.replayFrameIdx = 0;
    this.replayTimer = 0;
    this.lastGoal = goalInfo || this.lastGoal;
    this.replayFrameMs = Number(replayFrameMs) || ((1000 / 60) * C.REPLAY_SLOWMO_FACTOR);
    // The host schedules one shared future instant. The offset estimated from
    // authoritative snapshots maps that instant to each device clock.
    this.replayStartedAtWall = getSynchronizedReplayStart(replayStartAt, this.serverClockOffsetMs);
    this.replayPauseStartedAt = null;
    this.lastReplaySfxIdx = -1;
    document.getElementById('replay-overlay')?.classList.remove('hidden');

    const replayVoteButton = document.getElementById('replay-vote-skip-btn');
    if (replayVoteButton) {
      const localId = socketService.getSocket().id;
      const canVoteReplay = this.players.some(player => player.id === localId);
      replayVoteButton.classList.toggle('hidden', !canVoteReplay);
      replayVoteButton.disabled = !canVoteReplay;
      replayVoteButton.textContent = `Pular replay (0/${this.players.length || 1})`;
      replayVoteButton.onclick = canVoteReplay ? () => socketService.voteSkipReplay() : null;
    }
    this.startLocalReplayRecording();
  },

  recordOnlineReplayFrame(state) {
    if (state?.status !== 'playing' || !state?.ball || !Array.isArray(state.players)) return;
    if (!Array.isArray(this.onlineReplayBuffer)) {
      this.onlineReplayBuffer = [];
    }
    const frame = {
      ball: {
        x: state.ball.x,
        y: state.ball.y,
        vx: state.ball.vx,
        vy: state.ball.vy,
        lastStrikeType: state.ball.lastStrikeType,
        strikeTimer: state.ball.strikeTimer
      },
      players: state.players.map(p => {
        const known = this.players.find(player => player.id === p.id);
        return {
          id: p.id,
          x: p.x,
          y: p.y,
          dir: p.dir,
          team: p.team,
          has: state.ball.owner === p.id,
          name: p.name || known?.name || '',
          badge: p.badge || known?.badge || '',
          skin: p.skin || known?.skin || '',
          staffRole: p.staffRole || known?.staffRole || '',
          inv: p.invuln || 0,
          stun: p.stun || 0,
          halo: p.shootHalo || 0
        };
      }),
      score: { ...state.score },
      sfx: [...(state.soundEffects || [])]
    };
    this.onlineReplayBuffer.push(frame);
    // Snapshots arrive at 30 Hz, so 120 frames retain four seconds without
    // keeping twice as much object data on mobile devices.
    if (this.onlineReplayBuffer.length > Math.ceil(C.REPLAY_CAPTURE_FRAMES / 2)) {
      this.onlineReplayBuffer.shift();
    }
  },

  // ==========================================================================
  // CANVAS RENDERING HELPERS
  // ==========================================================================
  drawSpeedPad(cx, x, y, active) {
    cx.save();
    // Glowing outer circle
    cx.shadowColor = '#00f0ff';
    cx.shadowBlur = active ?16 : 8;
    cx.fillStyle = active ?'rgba(0, 240, 255, 0.45)' : 'rgba(0, 240, 255, 0.18)';
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

  applyFieldDimensions(size = 'medium') {
    this.fieldSize = ['small', 'medium', 'large'].includes(size) ? size : 'medium';
    if (this.fieldSize === 'small') {
      this.canvas.width = 896;
      this.canvas.height = 560;
    } else if (this.fieldSize === 'large') {
      this.canvas.width = 1280;
      this.canvas.height = 768;
    } else {
      this.canvas.width = 1024;
      this.canvas.height = 640;
    }
    this.fieldCacheCanvas = null;
    this.fieldCacheKey = '';
    if (this.matchRecording) this.matchRecording.field = [this.canvas.width, this.canvas.height];
    this.resizeCanvasContainer();
  },

  drawFieldGrid(cx) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cacheKey = `${w}x${h}:${C.BORDER}:${C.GOAL_W_INIT}`;

    if (!this.fieldCacheCanvas || this.fieldCacheKey !== cacheKey) {
      this.fieldCacheCanvas = document.createElement('canvas');
      this.fieldCacheCanvas.width = w;
      this.fieldCacheCanvas.height = h;
      this.fieldCacheKey = cacheKey;
      const cacheCtx = this.fieldCacheCanvas.getContext('2d', { alpha: false });
      if (cacheCtx) this.drawFieldGridStatic(cacheCtx);
    }

    cx.drawImage(this.fieldCacheCanvas, 0, 0);
  },

  drawFieldGridStatic(cx) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const gTop = (h - C.GOAL_W_INIT) / 2;
    const gBot = (h + C.GOAL_W_INIT) / 2;

    // 1) Concrete background outer zone (Stands / Arquibancada)
    cx.fillStyle = '#000';
    cx.fillRect(0, 0, w, h);

    // Draw stands rows outside C.BORDER
    cx.strokeStyle = '#334155';
    cx.lineWidth = 2;
    for (let offset = 4; offset < C.BORDER - 8; offset += 6) {
      cx.strokeRect(offset, offset, w - offset * 2, h - offset * 2);
    }

    // Populate stands with simplified crowds, keeping the goal mouths clean.
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
        const inGoalMouth = (x < C.BORDER + 74 || x > w - C.BORDER - 74)
          && y > gTop - 30
          && y < gBot + 30;
        if ((outsideX || outsideY) && !inGoalMouth && pseudoRandom() < 0.42) {
          const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#94a3b8'];
          cx.fillStyle = colors[Math.floor(pseudoRandom() * colors.length)];
          cx.beginPath();
          cx.arc(x, y, 2.2 + pseudoRandom() * 1.4, 0, Math.PI * 2);
          cx.fill();
        }
      }
    }
    cx.restore();

    // 2) Grass pitch background (Alternating stripes)
    cx.fillStyle = '#2e7d32';
    // Green grass reaches the interior of each net; crowd remains outside it.
    cx.fillRect(C.BORDER - C.POST_T - C.GOAL_DEPTH, gTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
    cx.fillRect(w - C.BORDER + C.POST_T, gTop, C.GOAL_DEPTH, C.GOAL_W_INIT);
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
    cx.fillStyle = 'rgba(46, 125, 50, 0.82)';
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

  drawShotPreview(cx, player, ball, input, charge = 0) {
    if (!player || !ball || !input?.shoot) return;
    if (ball.owner !== player.id) return;
    const inputLength = Math.hypot(input.x || 0, input.y || 0);
    const angle = inputLength > 0.01 ? Math.atan2(input.y, input.x) : player.dir;
    const normalizedCharge = Math.max(0, Math.min(1, Number(charge) || 0));
    const power = C.KICK_BASE + C.KICK_CHARGE * normalizedCharge;
    const travel = power * C.FRICTION_FIELD / Math.max(0.01, 1 - C.FRICTION_FIELD);
    const targetX = Math.max(C.BORDER, Math.min(this.canvas.width - C.BORDER, ball.x + Math.cos(angle) * travel));
    const targetY = Math.max(C.BORDER, Math.min(this.canvas.height - C.BORDER, ball.y + Math.sin(angle) * travel));
    cx.save();
    cx.globalAlpha = 0.58 + normalizedCharge * 0.32;
    cx.strokeStyle = normalizedCharge > 0.72 ? '#facc15' : '#7dd3fc';
    cx.fillStyle = cx.strokeStyle;
    cx.lineWidth = 2 + normalizedCharge;
    cx.setLineDash([7, 7]);
    cx.beginPath();
    cx.moveTo(ball.x, ball.y);
    cx.lineTo(targetX, targetY);
    cx.stroke();
    cx.setLineDash([]);
    cx.beginPath();
    cx.moveTo(targetX, targetY);
    cx.lineTo(targetX - Math.cos(angle - 0.55) * 11, targetY - Math.sin(angle - 0.55) * 11);
    cx.lineTo(targetX - Math.cos(angle + 0.55) * 11, targetY - Math.sin(angle + 0.55) * 11);
    cx.closePath();
    cx.fill();
    cx.globalAlpha *= 0.75;
    cx.beginPath();
    cx.arc(targetX, targetY, 6 + normalizedCharge * 5, 0, Math.PI * 2);
    cx.stroke();
    cx.restore();
  },

  beginPowerKickCamera(cx, ball) {
    const offset = getPowerKickShakeOffset(ball, performance.now());
    if (!offset.x && !offset.y) return false;
    cx.save();
    cx.translate(offset.x, offset.y);
    return true;
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
  registerJoinResult(onSuccess) {
    const socket = socketService.getSocket();
    if (!socket) return;
    if (this.pendingJoinSuccess) socket.off('joinSuccess', this.pendingJoinSuccess);
    if (this.pendingJoinError) socket.off('joinError', this.pendingJoinError);
    const successHandler = joinData => {
      cleanup();
      onSuccess(joinData);
    };
    const errorHandler = error => {
      cleanup();
      showToast(error, 'error');
    };
    const cleanup = () => {
      socket.off('joinSuccess', successHandler);
      socket.off('joinError', errorHandler);
      if (this.pendingJoinSuccess === successHandler) this.pendingJoinSuccess = null;
      if (this.pendingJoinError === errorHandler) this.pendingJoinError = null;
      this.joiningRoomCode = null;
      if (this.latestRooms) this.renderRoomsList(this.latestRooms);
    };
    this.pendingJoinSuccess = successHandler;
    this.pendingJoinError = errorHandler;
    socket.on('joinSuccess', successHandler);
    socket.on('joinError', errorHandler);
  },

  async blockMatchmakingWhileReserved() {
    const uid = this.currentUser?.uid;
    if (!uid) return false;
    const reservation = await socketService.getActiveMatchReservation(uid);
    if (!reservation) return false;

    this.rejoinRoomMeta = reservation.room;
    await this.refreshRejoinMatchAction();
    showToast('Você ainda está reservado em uma partida. Volte para ela ou abandone antes de entrar em outra sala.', 'error');
    return true;
  },

  async refreshRejoinMatchAction() {
    const button = document.getElementById('multi-btn-rejoin-match');
    const abandonButton = document.getElementById('multi-btn-abandon-match');
    if (!button) return;
    button.classList.add('hidden');
    button.onclick = null;
    abandonButton?.classList.add('hidden');
    if (abandonButton) abandonButton.onclick = null;
    this.rejoinRoomMeta = null;
    const key = this.currentUser?.uid ? `kicker_hax_rejoin_${this.currentUser.uid}` : null;
    if (!key) return;
    const reservation = await socketService.getActiveMatchReservation(this.currentUser.uid);
    if (!reservation) return;
    const { saved, room } = reservation;
    this.rejoinRoomMeta = room;
    if (this.latestRooms) this.renderRoomsList(this.latestRooms);
    button.classList.remove('hidden');
    abandonButton?.classList.remove('hidden');
    const getRejoinCredentials = async () => {
        let profile = {
        uid: this.currentUser.uid,
        username: menuController.profileData.username,
        badge: menuController.profileData.badge || '🏳️',
        skin: getEquippedSkin(menuController.profileData).image,
        skinId: menuController.profileData.equippedSkinId || 'rookie',
        staffRole: menuController.profileData.staffRole || ''
      };
      let password = '';
      try {
        const lastRoom = JSON.parse(localStorage.getItem(`kicker_hax_last_room_${this.currentUser.uid}`) || 'null');
        if (lastRoom?.code === saved.code) password = lastRoom.password || '';
      } catch { /* Rejoining a public room does not need a saved password. */ }
      return { profile, password };
    };
    button.onclick = async () => {
      const { profile, password } = await getRejoinCredentials();
      button.disabled = true;
      if (abandonButton) abandonButton.disabled = true;
      const restoreActions = () => {
        button.disabled = false;
        if (abandonButton) abandonButton.disabled = false;
      };
      // Enter the online view immediately and let its ready requests wait for
      // PeerJS. This removes the arena-side race where the host restored the
      // player but the returning client never mounted the match listeners.
      this.mode = 'multiplayer';
      this.practiceMode = false;
      this.tutorialMode = false;
      this.activeRoom = this.rejoinRoomMeta || room;
      this.fieldSize = this.activeRoom?.fieldSize || 'medium';
      this.onlineMatchMeta = { rejoined: true, matchId: saved.matchId };
      this.onlineMatchFinished = false;
      this.pendingRejoinConfirmation = { timeout: null };
      this.rejoinRemountInProgress = true;
      try {
        router.show('match-screen');
      } finally {
        this.rejoinRemountInProgress = false;
      }
      try {
        const payload = await socketService.rejoinMatch(saved.code, password, profile, saved.matchId);
        restoreActions();
        this.activeRoom = payload.lobbyInfo || this.rejoinRoomMeta || room;
        this.fieldSize = this.activeRoom?.fieldSize || 'medium';
        this.onlineMatchMeta = { rejoined: true, matchId: payload.matchId || saved.matchId };
        socketService.sendMatchClientReady();
        showToast('Retorno aceito. Sincronizando a partida...', 'info');
      } catch (error) {
        restoreActions();
        socketService.leaveRoom();
        const reservation = await socketService.getActiveMatchReservation(this.currentUser?.uid).catch(() => null);
        if (!reservation) {
          this.rejoinRoomMeta = null;
          await this.refreshRejoinMatchAction();
          socketService.refreshPublicRooms();
        }
        if (router.currentScreenId === 'match-screen') router.show('multiplayer-screen');
        showToast(error?.message || 'Não foi possível voltar para a partida.', 'error');
      }
    };
    if (abandonButton) abandonButton.onclick = async () => {
      const confirmed = await confirmDialog({
        title: 'Abandonar esta partida?',
        message: 'Você perderá o direito de voltar. Se ainda houver jogadores no seu time, eles votarão se desejam continuar; caso contrário, o adversário vence por W.O.',
        confirmLabel: 'Abandonar partida',
        danger: true
      });
      if (!confirmed) return;
      const { profile, password } = await getRejoinCredentials();
      button.disabled = true;
      abandonButton.disabled = true;
      socketService.off('abandonAccepted');
      socketService.once('abandonAccepted', () => {
        localStorage.removeItem(key);
        this.rejoinRoomMeta = null;
        button.classList.add('hidden');
        abandonButton.classList.add('hidden');
        button.disabled = false;
        abandonButton.disabled = false;
        if (this.latestRooms) this.renderRoomsList(this.latestRooms);
        showToast('Desistência registrada. Você não pode mais voltar a essa partida.', 'info');
      });
      socketService.once('joinError', (message) => {
        button.disabled = false;
        abandonButton.disabled = false;
        showToast(message, 'error');
      });
      socketService.abandonMatch(saved.code, password, profile, saved.matchId);
    };
  },

  renderRoomsList(rooms) {
    const tbody = document.getElementById('rooms-list-body');
    if (!tbody) return;

    const authoritativeRooms = (rooms || [])
      .filter(room => room.status === 'lobby' && !room.rejoinOnly);
    this.latestRooms = authoritativeRooms.slice();
    rooms = authoritativeRooms.slice();
    if (this.rejoinRoomMeta && !rooms.some(room => room.code === this.rejoinRoomMeta.code)) {
      rooms.push({ ...this.rejoinRoomMeta, status: 'lobby', rejoinOnly: true });
    }
    const headerLabels = ['Nome da Sala', 'Host', 'Jogadores', 'Duração', 'Gols', 'Segurança', 'Tipo', 'Ação'];
    document.querySelectorAll('.rooms-table thead tr:first-child th').forEach((th, index) => {
      th.textContent = headerLabels[index] || th.textContent;
    });
    const nameFilter = document.getElementById('room-search-input') || document.querySelector('[data-room-filter="name"]');
    if (nameFilter) nameFilter.setAttribute('placeholder', 'Pesquisar sala');
    const filterInputs = Array.from(document.querySelectorAll('[data-room-filter]'));
    if (!this.boundRoomFilters) {
      this.boundRoomFilters = true;
      filterInputs.forEach(input => {
        if (input.dataset.roomFilter === 'name') {
          input.addEventListener('input', () => this.renderRoomsList(this.latestRooms || []));
        }
      });
      const sortableHeaders = [
        ['players', 2],
        ['duration', 3],
        ['goalLimit', 4],
        ['security', 5],
        ['type', 6]
      ];
      const headers = document.querySelectorAll('.rooms-table thead tr:first-child th');
      sortableHeaders.forEach(([key, index]) => {
        const th = headers[index];
        if (!th) return;
        th.classList.add('sortable-room-header');
        th.title = 'Clique para ordenar';
        th.addEventListener('click', () => {
          const current = this.roomSort || { key: 'players', dir: 'desc' };
          this.roomSort = {
            key,
            dir: current.key === key && current.dir === 'asc' ? 'desc' : 'asc'
          };
          this.renderRoomsList(this.latestRooms || []);
        });
      });
    }
    // Do not replace the pressed button on every Firebase heartbeat. Replacing
    // the node while PointerEvent is active caused the visible phantom click.
    if (this.joiningRoomCode && tbody.dataset.roomsRendered === 'true') {
      const pending = document.getElementById(`join-btn-${this.joiningRoomCode}`);
      if (pending) {
        pending.disabled = true;
        pending.textContent = 'Conectando...';
      }
      return;
    }
    const nameSearch = String((document.getElementById('room-search-input') || document.querySelector('[data-room-filter="name"]'))?.value || '').trim().toLowerCase();
    rooms = rooms.filter(room => {
      return !nameSearch || String(room.name || '').toLowerCase().includes(nameSearch);
    });
    const sort = this.roomSort || { key: 'players', dir: 'desc' };
    const getSortValue = (room) => {
      if (sort.key === 'players') return Number(room.playersCount || 0);
      if (sort.key === 'duration') return Number(room.duration || 0);
      if (sort.key === 'goalLimit') return Number(room.goalLimit || 0);
      if (sort.key === 'security') return (room.hasPassword || room.password) ? 1 : 0;
      if (sort.key === 'type') return room.competitive ? 1 : 0;
      return 0;
    };
    rooms.sort((a, b) => {
      const av = getSortValue(a);
      const bv = getSortValue(b);
      const diff = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? diff : -diff;
    });

    if (rooms.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">Nenhuma sala criada no momento. Seja o primeiro!</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    tbody.dataset.roomsRendered = 'true';
    rooms.forEach(r => {
      const tr = document.createElement('tr');
      const security = (r.hasPassword || r.password) ?'Senha' : 'Pública';

      tr.innerHTML = `
        <td><strong>${escapeHtml(r.name)}</strong></td>
        <td>${escapeHtml(r.hostUsername || 'Host')}</td>
        <td>${r.playersCount}/${r.maxPlayers}</td>
        <td>${r.duration} min</td>
        <td>${Number(r.goalLimit) === 0 ? 'Sem limite' : `${r.goalLimit} gols`}</td>
        <td>${security}</td>
        <td>${r.competitive ? 'Competitiva' : 'Casual'}</td>
        <td><button class="btn btn-secondary btn-sm" id="join-btn-${escapeHtml(r.code)}">${r.rejoinOnly ? 'Voltar' : 'Entrar'}</button></td>
      `;
      tbody.appendChild(tr);

      const joinBtn = document.getElementById(`join-btn-${r.code}`);
      if (joinBtn) {
        const joiningThisRoom = this.joiningRoomCode === r.code;
        joinBtn.disabled = joiningThisRoom;
        if (joiningThisRoom) joinBtn.textContent = 'Conectando...';
        joinBtn.onclick = async () => {
          if (this.joiningRoomCode) return;
          if (r.rejoinOnly) {
            document.getElementById('multi-btn-rejoin-match')?.click();
            return;
          }
          if (r.hasPassword || r.password) {
            const pass = await promptDialog({
              title: 'Senha da sala',
              message: 'Digite a senha para entrar em ' + r.name + '.',
              placeholder: 'Senha de acesso',
              confirmLabel: 'Entrar',
              inputType: 'password'
            });
            if (pass !== null) this.joinRoomWithCode(r.code, pass);
          } else {
            this.joinRoomWithCode(r.code, '');
          }
        };
      }
    });
  },

  async joinRoomWithCode(code, password) {
    if (await this.blockMatchmakingWhileReserved()) return;
    if (this.joiningRoomCode) return;
    const roomMeta = await socketService.getPublicRoomMeta(code).catch(() => null);
    if (!roomMeta) {
      socketService.refreshPublicRooms();
      return showToast('A sala não existe mais ou o host está desconectado.', 'error');
    }
    this.joiningRoomCode = String(code || '').toUpperCase();
    this.renderRoomsList(this.latestRooms || []);
    let profile = {
      uid: this.currentUser.uid,
      username: menuController.profileData.username,
      badge: menuController.profileData.badge || '🏳️',
      skin: getEquippedSkin(menuController.profileData).image,
      skinId: menuController.profileData.equippedSkinId || 'rookie',
      staffRole: menuController.profileData.staffRole || ''
    };
    this.registerJoinResult((joinData) => {
      const room = joinData?.lobbyInfo;
      if (room) {
        this.activeRoom = room;
        this.updateLobbyView(room);
      }
      showToast('Entrou na sala!', 'success');
      router.show('lobby-screen');
    });
    localStorage.setItem(`kicker_hax_last_room_${this.currentUser.uid}`, JSON.stringify({ code, password }));
    socketService.joinRoom(code, password, profile);
  },

  updateLobbyView(room) {
    if (!room) return;
    if (!room.hostId || !room.players?.some(player => player.id === room.hostId)) {
      this.activeRoom = null;
      this.clearRoomChatViews();
      socketService.leaveRoom();
      showToast('A sala foi encerrada pelo host.', 'error');
      router.show('multiplayer-screen');
      socketService.refreshPublicRooms();
      return;
    }
    this.activeRoom = room;
    this.fieldSize = room.fieldSize || 'medium';
    this.showReplay = room.showReplay !== undefined ?room.showReplay : true;
    const myId = socketService.getSocket().id;
    const isHost = room.hostId === myId;
    this.isHost = isHost;

    document.getElementById('lobby-room-name').textContent = room.name;
    const lobbyCodeLine = document.getElementById('lobby-room-code')?.closest('p');
    if (lobbyCodeLine) lobbyCodeLine.style.display = isHost ?'' : 'none';
    if (isHost) document.getElementById('lobby-room-code').textContent = room.code;
    document.getElementById('lobby-setting-time').textContent = `${room.duration}m`;
    document.getElementById('lobby-setting-goals').textContent = room.goalLimit === 0 ?'Sem Limite' : room.goalLimit;

    const sizeMap = { small: 'Pequeno', medium: 'Médio', large: 'Grande' };
    const sizeEl = document.getElementById('lobby-setting-size');
    if (sizeEl) sizeEl.textContent = sizeMap[this.fieldSize] || 'Médio';

    const replayEl = document.getElementById('lobby-setting-replay');
    if (replayEl) replayEl.textContent = this.showReplay ?'Sim' : 'Não';
    const competitiveEl = document.getElementById('lobby-setting-competitive');
    if (competitiveEl) competitiveEl.textContent = room.competitive ? 'Competitiva' : 'Casual';

    // Toggle Host controls visibility
    const startBtn = document.getElementById('lobby-btn-start');
    const randomTeamsBtn = document.getElementById('lobby-btn-random-teams');
    const botControls = document.getElementById('lobby-host-bot-controls');

    if (startBtn) startBtn.classList.toggle('hidden', !isHost);
    if (randomTeamsBtn) randomTeamsBtn.classList.toggle('hidden', !isHost || room.competitive);
    if (botControls) botControls.classList.toggle('hidden', !isHost);
    const lobbyHostSettings = document.getElementById('lobby-host-settings');
    if (lobbyHostSettings) lobbyHostSettings.classList.toggle('hidden', !isHost || !room.hasPassword || room.competitive);
    const lobbyPasswordInput = document.getElementById('lobby-password-input');
    if (lobbyPasswordInput) {
      lobbyPasswordInput.value = '';
      lobbyPasswordInput.placeholder = room.hasPassword ? 'Senha privada ativa' : 'Vazio = pública';
    }
    ['lobby-btn-join-red', 'lobby-btn-join-blue', 'lobby-btn-join-spec'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.classList.toggle('hidden', true);
    });

    // Render lists of Red, Blue, Spectators
    const redPlayersList = document.getElementById('lobby-red-players');
    const bluePlayersList = document.getElementById('lobby-blue-players');
    const specPlayersList = document.getElementById('lobby-spec-players');

    if (redPlayersList) redPlayersList.innerHTML = '';
    if (bluePlayersList) bluePlayersList.innerHTML = '';
    if (specPlayersList) specPlayersList.innerHTML = '';

    room.players.forEach(p => {
      if (p.status && p.status !== 'lobby') return;
      const row = document.createElement('div');
      row.className = 'lobby-player-row';

      const isSpec = p.team === 'spectator';
      const readyBadge = isSpec && !room.competitive ?'' : `<span class="ready-badge ${p.ready ?'ready' : ''}">${p.ready ?'Pronto' : 'Aguardando'}</span>`;
      const kickAction = isHost && p.id !== myId && !p.cpu ? `<button class="kick-btn" id="kick-btn-${p.id}" title="Expulsar">🚪</button>` : '';
      const banAction = isHost && p.id !== myId && !p.cpu ? `<button class="kick-btn ban-btn" id="ban-btn-${p.id}" title="Banir desta sala">🚫</button>` : '';
      const removeBotAction = isHost && p.cpu ? `<button class="kick-btn" id="remove-bot-btn-${p.id}">×</button>` : '';
      const hostTeamActions = isHost && !room.competitive ?`
        <button class="team-move-btn red" id="lobby-move-red-${p.id}" title="Mover para o vermelho">R</button>
        <button class="team-move-btn blue" id="lobby-move-blue-${p.id}" title="Mover para o azul">A</button>
        <button class="team-move-btn spec" id="lobby-move-spec-${p.id}" title="Mover para espectador">E</button>
      ` : '';

      row.innerHTML = `
        <span class="lobby-player-name"><span>${escapeHtml(p.badge)}</span> <span>${escapeHtml(p.username)}</span></span>
        <span class="lobby-player-meta">
          ${readyBadge}
          ${hostTeamActions}
          ${kickAction}
          ${banAction}
          ${removeBotAction}
        </span>
      `;
      appendStaffTag(row.querySelector('.lobby-player-name'), p.staffRole);

      if (p.team === 'red') redPlayersList?.appendChild(row);
      else if (p.team === 'blue') bluePlayersList?.appendChild(row);
      else specPlayersList?.appendChild(row);

      // Hook actions
      const kickBtn = document.getElementById(`kick-btn-${p.id}`);
      if (kickBtn) {
        kickBtn.onclick = async () => {
          const confirmed = await confirmDialog({
            title: 'Expulsar jogador?',
            message: `Expulsar ${p.username} desta sala?`,
            confirmLabel: 'Expulsar',
            danger: true
          });
          if (!confirmed) return;
          socketService.kickPlayer(p.id);
        };
      }

      const removeBotBtn = document.getElementById(`remove-bot-btn-${p.id}`);
      if (removeBotBtn) {
        removeBotBtn.onclick = () => {
          socketService.removeBot(p.id);
        };
      }

      const banBtn = document.getElementById(`ban-btn-${p.id}`);
      if (banBtn) banBtn.onclick = async () => {
        const confirmed = await confirmDialog({
          title: 'Banir jogador?',
          message: `Banir ${p.username} desta sala? Ele nao podera entrar novamente.`,
          confirmLabel: 'Banir',
          danger: true
        });
        if (confirmed) socketService.banPlayer(p.id);
      };

      const moveRed = document.getElementById(`lobby-move-red-${p.id}`);
      const moveBlue = document.getElementById(`lobby-move-blue-${p.id}`);
      const moveSpec = document.getElementById(`lobby-move-spec-${p.id}`);
      if (moveRed) moveRed.onclick = () => socketService.hostChangeTeam(p.id, 'red');
      if (moveBlue) moveBlue.onclick = () => socketService.hostChangeTeam(p.id, 'blue');
      if (moveSpec) moveSpec.onclick = () => socketService.hostChangeTeam(p.id, 'spectator');
    });

    // Room chat is sourced only from Realtime Database to avoid stale host memory.
  },

  async appendChatMessage(msg, isLocalGame = false) {
    const containers = [
      document.getElementById('lobby-chat-messages'),
      document.getElementById('game-chat-messages')
    ];

    const roomPlayer = this.activeRoom?.players?.find(player => player.uid === msg.uid);
    let profile = null;
    if (msg.uid && (!roomPlayer || roomPlayer.skin === 'custom')) {
      profile = await firebaseService.getUserProfile(msg.uid).catch(() => null);
    }
    const identity = profile || {
      equippedSkinId: roomPlayer?.skin ? 'room-skin' : 'rookie',
      equippedSkinImage: roomPlayer?.skin || null,
      badge: msg.badge
    };

    containers.forEach(chatList => {
      if (!chatList) return;

      const isLobby = chatList.id === 'lobby-chat-messages';

      if (msg.id && chatList.querySelector(`[data-message-id="${CSS.escape(msg.id)}"]`)) return;

      const el = document.createElement('div');
      const isSystem = msg.username === 'Sistema';
      el.className = `chat-msg ${isSystem ?'system' : ''}`;
      el.dataset.messageId = msg.id || `${msg.timestamp || Date.now()}-${msg.username}-${msg.text}`;
      el.dataset.timestamp = String(Number(msg.timestamp) || Date.now());

      const time = document.createElement('span');
      time.className = 'msg-time';
      time.textContent = `[${msg.time || ''}]`;
      const sender = document.createElement(msg.uid ? 'button' : 'span');
      sender.className = `msg-sender${msg.uid ? ' profile-trigger' : ''}`;
      if (msg.uid) sender.type = 'button';
      const avatar = document.createElement('span');
      avatar.className = 'room-chat-avatar';
      menuController.renderSkin(avatar, getEquippedSkin(identity), identity.badge || msg.badge);
      const senderName = document.createElement('strong');
      senderName.textContent = msg.username || 'Jogador';
      sender.append(avatar, senderName);
      appendStaffTag(sender, roomPlayer?.staffRole || profile?.staffRole || msg.staffRole);
      sender.appendChild(document.createTextNode(':'));
      if (msg.uid) sender.addEventListener('click', () => menuController.openPublicProfile(msg.uid));
      const text = document.createElement('span');
      text.className = 'msg-text';
      text.textContent = String(msg.text || '');
      el.append(time, sender, text);
      const after = [...chatList.children].find(child => Number(child.dataset.timestamp || 0) > Number(el.dataset.timestamp));
      if (after) chatList.insertBefore(el, after);
      else chatList.appendChild(el);

      // Match chat keeps a fixed visual footprint: discard the oldest lines
      // so new messages remain visible without growing beyond the viewport.
      if (!isLobby) {
        while (chatList.children.length > 40) {
          chatList.firstElementChild?.remove();
        }
      }

      // Auto scroll bottom
      chatList.scrollTop = chatList.scrollHeight;
    });
  },

  clearRoomChatViews() {
    ['lobby-chat-messages', 'game-chat-messages'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
  },

  scrollChatToLatest(id) {
    const chat = document.getElementById(id);
    if (chat) chat.scrollTop = chat.scrollHeight;
  },

  // ==========================================================================
  // RANKINGS LOADER
  // ==========================================================================
  async loadRanking(filter = 'general') {
    const tbody = document.getElementById('leaderboard-body');
    if (!tbody) return;

    const headRow = document.getElementById('leaderboard-head-row');
    const allColumns = [
      ['overall', 'Overall', r => r.overall || 0],
      ['level', 'Nível', r => r.level || 1],
      ['matches', 'Jogos', r => r.matchesPlayed || 0],
      ['wins', 'Vitórias', r => r.wins || 0],
      ['losses', 'Derrotas', r => r.losses || 0],
      ['draws', 'Empates', r => r.draws || 0],
      ['goals', 'Gols', r => r.goals || 0],
      ['ownGoals', 'Gols Contra', r => r.ownGoals || 0],
      ['shots', 'Chutes', r => r.shots || 0],
      ['dribbles', 'Dribles', r => r.dribbles || 0],
      ['assists', 'Assistências', r => r.assists || 0],
      ['tackles', 'Desarmes', r => r.tackles || 0],
      ['possession', 'Posse Média', r => `${r.possessionAvg || 0}%`],
      ['possessionScore', 'Índice', r => `${Math.round(getPossessionConfidenceScore(r))}%`],
      ['possessionMatches', 'Jogos', r => r.possessionMatches || r.matchesPlayed || 0],
      ['rating', 'Nota Média', r => Number(r.ratingAvg || 0).toFixed(1)],
      ['ratingScore', 'Índice', r => Number(getRatingConfidenceScore(r) || 0).toFixed(1)],
      ['ratingMatches', 'Jogos', r => r.ratingMatches || 0],
      ['mvps', 'MVPs', r => r.mvps || 0],
      ['coins', 'KX Coins', r => r.coins || 0],
      ['skins', 'Skins', r => r.skinCount || 0],
      ['winrate', 'Winrate', r => {
        const games = r.matchesPlayed || 0;
        return games > 0 ? `${Math.round(((r.wins || 0) / games) * 100)}%` : '0%';
      }],
      ['winrateScore', 'Índice', r => `${Math.round(getWinRateConfidenceScore(r) * 100)}%`]
    ];
    const visibleColumns = filter === 'general'
      ? allColumns
      : filter === 'winrate'
        ? ['winrate', 'winrateScore', 'matches'].map(key => allColumns.find(([columnKey]) => columnKey === key))
        : filter === 'possession'
          ? ['possession', 'possessionScore', 'possessionMatches'].map(key => allColumns.find(([columnKey]) => columnKey === key))
          : filter === 'rating'
            ? ['rating', 'ratingScore', 'ratingMatches'].map(key => allColumns.find(([columnKey]) => columnKey === key))
        : allColumns.filter(([key]) => key === filter);
    const colSpan = 2 + visibleColumns.length;

    if (headRow) {
      headRow.innerHTML = `
        <th>Posição</th>
        <th>Jogador</th>
        ${visibleColumns.map(([, label]) => `<th>${label}</th>`).join('')}
      `;
    }

    tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center">Carregando dados da tabela...</td></tr>`;

    // Filters active toggles
    const btnWins = document.getElementById('rank-filter-wins');
    const btnGoals = document.getElementById('rank-filter-goals');
    const btnShots = document.getElementById('rank-filter-shots');
    const btnDribbles = document.getElementById('rank-filter-dribbles');
    const btnAssists = document.getElementById('rank-filter-assists');
    const btnMatches = document.getElementById('rank-filter-matches');
    const btnMvps = document.getElementById('rank-filter-mvps');
    const btnOverall = document.getElementById('rank-filter-overall');
    const btnWinrate = document.getElementById('rank-filter-winrate');
    const btnLevel = document.getElementById('rank-filter-level');
    const btnGeneral = document.getElementById('rank-filter-general');
    const btnLosses = document.getElementById('rank-filter-losses');
    const btnDraws = document.getElementById('rank-filter-draws');
    const btnOwnGoals = document.getElementById('rank-filter-own-goals');
    const btnTackles = document.getElementById('rank-filter-tackles');
    const btnPossession = document.getElementById('rank-filter-possession');
    const btnRating = document.getElementById('rank-filter-rating');
    const btnCoins = document.getElementById('rank-filter-coins');
    const btnSkins = document.getElementById('rank-filter-skins');

    [btnWins, btnGoals, btnShots, btnDribbles, btnAssists, btnMatches, btnMvps, btnOverall, btnWinrate, btnLevel, btnGeneral, btnLosses, btnDraws, btnOwnGoals, btnTackles, btnPossession, btnRating, btnCoins, btnSkins].forEach(b => b?.classList.remove('active'));
    if (filter === 'general') btnGeneral?.classList.add('active');
    if (filter === 'wins') btnWins?.classList.add('active');
    if (filter === 'losses') btnLosses?.classList.add('active');
    if (filter === 'draws') btnDraws?.classList.add('active');
    if (filter === 'goals') btnGoals?.classList.add('active');
    if (filter === 'ownGoals') btnOwnGoals?.classList.add('active');
    if (filter === 'shots') btnShots?.classList.add('active');
    if (filter === 'dribbles') btnDribbles?.classList.add('active');
    if (filter === 'assists') btnAssists?.classList.add('active');
    if (filter === 'tackles') btnTackles?.classList.add('active');
    if (filter === 'possession') btnPossession?.classList.add('active');
    if (filter === 'rating') btnRating?.classList.add('active');
    if (filter === 'matches') btnMatches?.classList.add('active');
    if (filter === 'mvps') btnMvps?.classList.add('active');
    if (filter === 'overall') btnOverall?.classList.add('active');
    if (filter === 'winrate') btnWinrate?.classList.add('active');
    if (filter === 'level') btnLevel?.classList.add('active');
    if (filter === 'coins') btnCoins?.classList.add('active');
    if (filter === 'skins') btnSkins?.classList.add('active');

    try {
      const records = await firebaseService.getGlobalRanking(filter === 'general' ? 'overall' : filter, 10);
      if (records.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center">Nenhum jogador registrado no ranking.</td></tr>`;
        return;
      }

      tbody.innerHTML = '';
      records.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>#${idx + 1}</strong></td>
          <td class="ranking-player-cell"></td>
          ${visibleColumns.map(([, , getter]) => `<td>${getter(r)}</td>`).join('')}
        `;
        const playerCell = tr.querySelector('.ranking-player-cell');
        const trigger = document.createElement('button');
        trigger.className = 'ranking-profile-trigger';
        trigger.type = 'button';
        trigger.title = `Ver perfil de ${r.displayName || r.username || 'Jogador'}`;
        const avatar = document.createElement('span');
        avatar.className = 'ranking-player-avatar';
        menuController.renderSkin(avatar, getEquippedSkin(r), r.badge);
        const name = document.createElement('strong');
        name.textContent = r.displayName || r.username || 'Jogador';
        trigger.append(avatar, name);
        appendStaffTag(trigger, r.staffRole);
        trigger.addEventListener('click', () => menuController.openPublicProfile(r.uid));
        playerCell.appendChild(trigger);
        tbody.appendChild(tr);
      });
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center text-danger">Erro ao carregar dados do banco.</td></tr>`;
    }
  },

  togglePauseMenu() {
    const modal = document.getElementById('pause-modal');
    if (!modal) return;
    const competitive = this.mode === 'multiplayer' && !!this.activeRoom?.competitive;

    if (modal.classList.contains('hidden')) {
      modal.classList.remove('hidden');
      this.pauseMenuOpen = true;
      this.clearPressedKeys();
      if (this.mode === 'solo') {
        this.isPaused = true;
      } else if (this.mode === 'multiplayer' && this.isHost && !competitive) {
        socketService.hostSetPaused(true);
      }

      const hostCtrl = document.getElementById('host-controls');
      if (hostCtrl) {
        const canSeePanel = this.mode === 'multiplayer' && this.isHost && !competitive;
        hostCtrl.style.display = canSeePanel ?'block' : 'none';
        this.populateHostControls(this.isHost);
      }
    } else {
      modal.classList.add('hidden');
      this.pauseMenuOpen = false;
      if (this.mode === 'solo') {
        this.isPaused = false;
      } else if (this.mode === 'multiplayer' && this.isHost && !competitive) {
        socketService.hostSetPaused(false);
      }
    }
  },

  populateHostControls(canControl) {
    const note = document.getElementById('host-controls-note');
    const resetBtn = document.getElementById('pause-btn-reset-match');
    const addOneBtn = document.getElementById('pause-btn-add-1m');
    const addThreeBtn = document.getElementById('pause-btn-add-3m');
    const subOneBtn = document.getElementById('pause-btn-sub-1m');
    const subThreeBtn = document.getElementById('pause-btn-sub-3m');
    const endToLobbyBtn = document.getElementById('pause-btn-end-lobby');
    const panel = document.getElementById('host-team-panel');
    const controlsAllowed = canControl && !(this.mode === 'multiplayer' && this.activeRoom?.competitive);

    if (note) {
      note.textContent = canControl
        ? (controlsAllowed ? 'Gerencie tempo, reinício e times da partida.' : 'Partida competitiva: painel administrativo desativado.')
        : 'Somente o host pode alterar esta partida.';
    }
    if (resetBtn) resetBtn.disabled = !controlsAllowed;
    [addOneBtn, addThreeBtn, subOneBtn, subThreeBtn].forEach(btn => {
      if (btn) btn.disabled = !controlsAllowed || this.mode !== 'multiplayer';
    });
    if (endToLobbyBtn) endToLobbyBtn.disabled = !controlsAllowed || this.mode !== 'multiplayer';

    if (addOneBtn) addOneBtn.onclick = () => controlsAllowed && this.mode === 'multiplayer' && socketService.hostAddTime(60);
    if (addThreeBtn) addThreeBtn.onclick = () => controlsAllowed && this.mode === 'multiplayer' && socketService.hostAddTime(180);
    if (subOneBtn) subOneBtn.onclick = () => controlsAllowed && this.mode === 'multiplayer' && socketService.hostAddTime(-60);
    if (subThreeBtn) subThreeBtn.onclick = () => controlsAllowed && this.mode === 'multiplayer' && socketService.hostAddTime(-180);
    if (endToLobbyBtn) {
      endToLobbyBtn.onclick = () => {
        if (!controlsAllowed || this.mode !== 'multiplayer') return;
        socketService.hostEndMatchToLobby();
        this.togglePauseMenu();
      };
    }
    if (!panel) return;

    panel.innerHTML = '';
    if (this.mode !== 'multiplayer') {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'flex';
    const roster = this.activeRoom?.players?.length
      ?this.activeRoom.players
      : this.players.map(p => ({
        id: p.id,
        username: p.username || p.name || 'Jogador',
        badge: p.badge || '',
        team: p.team === C.Team.RED ?'red' : 'blue',
        cpu: !!p.cpu
      }));

    roster.forEach(player => {
      const row = document.createElement('div');
      row.className = 'host-player-row';
      row.innerHTML = `
        <span class="host-player-name">${player.badge || ''} ${player.username}</span>
        <button class="btn btn-sm btn-danger" data-team="red">Vermelho</button>
        <button class="btn btn-sm btn-primary" data-team="blue">Azul</button>
        <button class="btn btn-sm btn-secondary host-emoji-action" data-kick="true" title="Expulsar">🚪</button>
        <button class="btn btn-sm btn-danger host-emoji-action" data-ban="true" title="Banir">🚫</button>
      `;

      row.querySelectorAll('button').forEach(btn => {
        const isSelf = player.id === socketService.getSocket().id;
        // The host can switch sides, but never kick or ban itself.
        btn.disabled = !controlsAllowed || player.cpu || (isSelf && (btn.dataset.kick || btn.dataset.ban));
        btn.onclick = async () => {
          if (!controlsAllowed) return;
          if (btn.dataset.kick) {
            const confirmed = await confirmDialog({
              title: 'Expulsar jogador?',
              message: `Expulsar ${player.username} da partida?`,
              confirmLabel: 'Expulsar',
              danger: true
            });
            if (!confirmed) return;
            socketService.kickPlayer(player.id);
            return;
          }
          if (btn.dataset.ban) {
            const confirmed = await confirmDialog({
              title: 'Banir jogador?',
              message: `Banir ${player.username} desta sala?`,
              confirmLabel: 'Banir',
              danger: true
            });
            if (!confirmed) return;
            socketService.banPlayer(player.id);
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
      exitBtn.textContent = this.mode === 'multiplayer' && this.activeRoom?.competitive ? 'Desistir' : 'Sair ao Menu';
      exitBtn.onclick = () => {
        this.exitCurrentMatch();
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
            this.localMatchSim.matchTime = this.matchTime;
            this.localMatchSim.status = 'countdown';
            this.localMatchSim.countdownTimer = 300;
            this.localMatchSim.replayBuffer = [];
            if (this.resetLocalFieldPositions) this.resetLocalFieldPositions();
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
function ctxBallDraw(cx, x, y, strikeType = null, strikeTimer = 0, vx = 0, vy = 0) {
  drawPowerKickBallEffect(cx, { x, y, r: C.BALL_RADIUS, vx, vy, lastStrikeType: strikeType, strikeTimer });
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

function ctxPlayerDraw(cx, x, y, team, name, badge, skin, halo, inv, stun, hasBall, staffRole = '') {
  // Trail details
  ctxPlayerShadow(cx, x, y);

  cx.beginPath();
  cx.arc(x, y, C.PLAYER_RADIUS, 0, Math.PI * 2);
  cx.fillStyle = team === C.Team.RED ?'#ef4444' : '#3b82f6';
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

  // Keep a thin team-colored ring while giving the cosmetic almost the whole
  // playable silhouette.
  const skinDrawn = drawSkinImage(cx, skin, x, y, C.PLAYER_RADIUS - 1);
  if (!skinDrawn && badge) {
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
    cx.font = '700 12px system-ui';
    cx.textAlign = 'center';
    cx.lineWidth = 3;
    cx.strokeStyle = 'rgba(4, 9, 24, 0.9)';
    cx.strokeText(name, x, y - C.PLAYER_RADIUS - 14);
    cx.fillStyle = C.TEAM_NAME_COLORS[team] || '#e2e8f0';
    cx.fillText(name, x, y - C.PLAYER_RADIUS - 14);
  }
  drawStaffTagOnCanvas(cx, x, y - C.PLAYER_RADIUS - 31, staffRole);
}

function ctxPlayerShadow(cx, x, y) {
  cx.fillStyle = 'rgba(0,0,0,.25)';
  cx.beginPath();
  cx.ellipse(x + 4, y + 8, C.PLAYER_RADIUS * 1.1, C.PLAYER_RADIUS * 0.6, 0, 0, Math.PI * 2);
  cx.fill();
}
export default gameController;
