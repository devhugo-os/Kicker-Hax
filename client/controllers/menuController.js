// Kicker Hax - Main Menu & Profile Controller
import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { showToast } from '../utils/toast.js';
import { confirmDialog } from '../utils/dialog.js';
import { sanitizeBadgeInput } from '../utils/graphemes.js';
import { APK_URL, requestAppDownload } from '../utils/nativeBridge.js';
import { getEquippedSkin, getSkinById, getSkinValue, usesProfileBadge } from '../data/skins.js';
import { createProfileDraft, profilesDiffer } from '../utils/profileDraft.js';
import { PROFILE_BIO_MAX_LENGTH, USERNAME_MAX_LENGTH } from '../../shared/constants.js';
import { appendStaffTag } from '../utils/staffTags.js';
import { calculateOverallRating } from '../utils/rankingScore.js';
import { renderMatchReport } from '../components/matchReportView.js';

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

export const menuController = {
  currentUser: null,
  profileData: null,
  profileDraft: null,
  profileDirty: false,

  async init(user) {
    this.currentUser = user;
    if (!user) return;

    // Authentication and profile creation are separate Firebase operations.
    // Hydrate the profile before binding UI that depends on onboarding fields,
    // especially after a seasonal reset creates a brand-new document.
    this.profileData = await firebaseService.getUserProfile(user.uid);
    if (!this.profileData) {
      this.profileData = await firebaseService.ensureUserProfile(user);
    }
    if (!this.profileData) {
      throw new Error('Perfil autenticado nao foi criado ou carregado.');
    }
    this.profileDraft = null;
    this.profileDirty = false;

    // Hook Menu Buttons
    const btnPlay = document.getElementById('menu-btn-play');
    if (btnPlay) btnPlay.onclick = () => router.show('mode-select-screen');

    const btnProfile = document.getElementById('menu-btn-profile');
    if (btnProfile) btnProfile.onclick = () => router.show('profile-screen');

    const quickProfile = document.getElementById('menu-quick-profile');
    if (quickProfile) quickProfile.onclick = () => router.show('profile-screen');

    const btnRanking = document.getElementById('menu-btn-ranking');
    if (btnRanking) btnRanking.onclick = () => router.show('ranking-screen');

    const btnSettings = document.getElementById('menu-btn-settings');
    if (btnSettings) btnSettings.onclick = () => router.show('settings-screen');

    const btnControls = document.getElementById('menu-btn-controls');
    if (btnControls) {
      btnControls.classList.remove('hidden');
      btnControls.onclick = () => router.show('controls-screen');
    }

    const btnCredits = document.getElementById('menu-btn-credits');
    if (btnCredits) btnCredits.onclick = () => router.show('credits-screen');

    const rulesButton = document.getElementById('menu-btn-rules');
    const rulesModal = document.getElementById('game-rules-modal');
    const rulesClose = document.getElementById('game-rules-close');
    if (rulesButton && rulesModal) rulesButton.onclick = () => rulesModal.classList.remove('hidden');
    if (rulesClose && rulesModal) rulesClose.onclick = () => rulesModal.classList.add('hidden');
    if (rulesModal) rulesModal.onclick = event => {
      if (event.target === rulesModal) rulesModal.classList.add('hidden');
    };

    const btnDownloadApp = document.getElementById('menu-btn-download-app');
    if (btnDownloadApp) {
      const isApp = new URLSearchParams(window.location.search).get('app') === '1';
      const isMobile = window.matchMedia?.('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
      if (isApp) {
        btnDownloadApp.remove();
      } else if (!isMobile) {
        btnDownloadApp.classList.add('hidden');
      } else {
        fetch(btnDownloadApp.getAttribute('href'), { method: 'HEAD', cache: 'no-store' })
          .then(response => btnDownloadApp.classList.toggle('hidden', !response.ok))
          .catch(() => btnDownloadApp.classList.add('hidden'));
      }
    }

    const bindLogout = (btn) => {
      if (!btn) return;
      btn.onclick = async () => {
        if (!(await this.confirmDiscardProfileChanges())) return;
        try {
          await firebaseService.logout();
          showToast('Desconectado com sucesso.', 'info');
        } catch (e) {
          showToast('Erro ao sair da conta.', 'error');
        }
      };
    };
    const menuLogout = document.getElementById('menu-btn-logout');
    if (menuLogout) menuLogout.remove();
    bindLogout(document.getElementById('profile-btn-logout'));

    // Credits Screen back button
    const btnCreditsBack = document.getElementById('credits-btn-back');
    if (btnCreditsBack) btnCreditsBack.onclick = () => router.show('menu-screen');

    // Register routes lifecycle hooks for data updates
    router.register('menu-screen', {
      onEnter: () => this.refreshQuickProfile()
    });

    router.register('profile-screen', {
      onEnter: () => this.loadProfileScreen()
    });
    router.register('credits-screen', {
      onEnter: () => this.loadCreditsStaff()
    });

    const publicProfileModal = document.getElementById('public-profile-modal');
    document.getElementById('public-profile-close')?.addEventListener('click', () => publicProfileModal?.classList.add('hidden'));
    publicProfileModal?.addEventListener('click', event => {
      if (event.target === publicProfileModal) publicProfileModal.classList.add('hidden');
    });
    const publicHistoryModal = document.getElementById('public-profile-history-modal');
    const publicInventoryModal = document.getElementById('public-profile-inventory-modal');
    document.getElementById('public-profile-history-close')?.addEventListener('click', () => publicHistoryModal?.classList.add('hidden'));
    document.getElementById('public-profile-inventory-close')?.addEventListener('click', () => publicInventoryModal?.classList.add('hidden'));
    publicHistoryModal?.addEventListener('click', event => {
      if (event.target === publicHistoryModal) publicHistoryModal.classList.add('hidden');
    });
    publicInventoryModal?.addEventListener('click', event => {
      if (event.target === publicInventoryModal) publicInventoryModal.classList.add('hidden');
    });
    document.getElementById('public-profile-history-open')?.addEventListener('click', () => this.openPublicHistory());
    document.getElementById('public-profile-inventory-open')?.addEventListener('click', () => this.openPublicInventory());
    const matchDetailsModal = document.getElementById('match-details-modal');
    document.getElementById('match-details-close')?.addEventListener('click', () => matchDetailsModal?.classList.add('hidden'));
    matchDetailsModal?.addEventListener('click', event => {
      if (event.target === matchDetailsModal) matchDetailsModal.classList.add('hidden');
    });

    // Profile Back button
    const btnProfileBack = document.getElementById('profile-btn-back');
    if (btnProfileBack) btnProfileBack.onclick = async () => {
      if (!(await this.confirmDiscardProfileChanges())) return;
      this.discardProfileChanges();
      router.show('menu-screen');
    };

    // Profile Save button
    const btnProfileSave = document.getElementById('profile-btn-save');
    if (btnProfileSave) {
      btnProfileSave.onclick = async () => {
        await this.saveProfileEdits();
      };
    }

    // Setup input listeners to show dynamic badge/avatar preview
    const badgeSelect = document.getElementById('profile-badge-select');
    const avatarDisplay = document.getElementById('profile-avatar-display');
    const onboardingNotice = document.getElementById('profile-onboarding-notice');
    onboardingNotice?.classList.toggle('hidden', !this.profileData.isNewUser);
    const updateDraftFromFields = () => this.updateProfileDraftFromFields();
    badgeSelect?.addEventListener('change', updateDraftFromFields);
    document.getElementById('profile-username-input')?.addEventListener('input', updateDraftFromFields);
    document.getElementById('profile-bio-input')?.addEventListener('input', updateDraftFromFields);
    window.addEventListener('beforeunload', event => {
      if (!this.profileDirty) return;
      event.preventDefault();
      event.returnValue = '';
    });

    // Initial load
    await this.refreshQuickProfile();
  },

  async checkNativeAppUpdate(button) {
    const fallbackUrl = APK_URL;
    const installed = new URLSearchParams(window.location.search).get('nativeAppVersion') || '0';
    button.disabled = true;
    button.textContent = 'VERIFICANDO...';
    try {
      const response = await fetch(`./deploy-version.txt?cb=${Date.now()}`, { cache: 'no-store' });
      const text = response.ok ? await response.text() : '';
      const latest = text.match(/Kicker Hax\s+([0-9.]+)/i)?.[1] || '';
      if (!latest || !isVersionNewer(latest, installed)) {
        showToast('Seu aplicativo ja esta atualizado.', 'success');
        return;
      }
      const shouldDownload = await confirmDialog({
        title: 'Atualização encontrada',
        message: `A versão ${latest} está disponível para o aplicativo.`,
        confirmLabel: 'Baixar atualização'
      });
      if (!shouldDownload) return;
      requestAppDownload(`${fallbackUrl}?v=${encodeURIComponent(latest)}&cb=${Date.now()}`);
    } catch (error) {
      showToast('Não foi possível verificar atualizações agora.', 'error');
    } finally {
      button.disabled = false;
      button.textContent = 'PROCURAR ATUALIZAÇÕES';
    }
  },

  async refreshQuickProfile() {
    if (!this.currentUser) return;
    try {
      this.profileData = await firebaseService.getUserProfile(this.currentUser.uid);
      if (!this.profileData) return;

      // Update Quick Profile HTML Elements
      const flagEl = document.getElementById('quick-profile-flag');
      const nameEl = document.getElementById('quick-profile-name');
      const levelEl = document.getElementById('quick-profile-level');
      const avatarEl = document.getElementById('quick-avatar-char');
      const xpFillEl = document.querySelector('.quick-xp-fill');

      if (flagEl) {
        flagEl.textContent = this.profileData.badge || '🇧🇷';
        flagEl.classList.toggle('hidden', !usesProfileBadge(this.profileData));
      }
      if (nameEl) nameEl.textContent = this.profileData.displayName || this.profileData.username;
      if (levelEl) levelEl.textContent = this.profileData.level || 1;
      if (avatarEl) this.renderSkin(avatarEl, getEquippedSkin(this.profileData), this.profileData.badge);

      if (xpFillEl) {
        const level = this.profileData.level || 1;
        const xp = this.profileData.xp || 0;
        const xpNeeded = level * 100;
        const percentage = Math.min(100, Math.max(0, (xp / xpNeeded) * 100));
        xpFillEl.style.width = `${percentage}%`;
      }
    } catch (e) {
      console.error("Erro ao carregar perfil rápido:", e);
    }
  },

  async loadProfileScreen() {
    if (!this.currentUser || !this.profileData) return;

    // Returning from the inventory must preserve unsaved skin/name changes.
    if (!this.profileDraft) {
      this.profileData = await firebaseService.getUserProfile(this.currentUser.uid);
      this.profileDraft = createProfileDraft(this.profileData);
    }

    const ownStaffTag = document.getElementById('profile-staff-tag');
    ownStaffTag?.replaceChildren();
    if (ownStaffTag) appendStaffTag(ownStaffTag, this.profileData.staffRole, { full: true });

    // Bind edit fields
    const usernameInput = document.getElementById('profile-username-input');
    const badgeSelect = document.getElementById('profile-badge-select');
    const bioInput = document.getElementById('profile-bio-input');
    const avatarDisplay = document.getElementById('profile-avatar-display');

    if (usernameInput) usernameInput.value = this.profileDraft.username;
    if (badgeSelect) badgeSelect.value = this.profileDraft.badge;
    if (bioInput) bioInput.value = this.profileDraft.bio;
    if (avatarDisplay) this.renderSkin(avatarDisplay, getEquippedSkin(this.profileDraft), this.profileDraft.badge);
    const badgeControls = document.getElementById('profile-badge-controls');
    const usesDefaultSkin = usesProfileBadge(this.profileDraft);
    badgeControls?.classList.toggle('hidden', !usesDefaultSkin);
    this.updateProfileDirtyState();
    const coins = document.getElementById('profile-coins');
    if (coins) coins.textContent = this.profileData.coins || 0;

    // Load statistics
    const stats = await firebaseService.getUserStats(this.currentUser.uid);
    if (stats) {
      const winrate = stats.matchesPlayed > 0 ?Math.round((stats.wins / stats.matchesPlayed) * 100) : 0;

      document.getElementById('stats-played').textContent = stats.matchesPlayed || 0;
      document.getElementById('stats-wins').textContent = stats.wins || 0;
      document.getElementById('stats-losses').textContent = stats.losses || 0;
      document.getElementById('stats-winrate').textContent = `${winrate}%`;
      document.getElementById('stats-goals').textContent = stats.goals || 0;
      document.getElementById('stats-shots').textContent = stats.shots || 0;
      document.getElementById('stats-dribbles').textContent = stats.dribbles || 0;
      document.getElementById('stats-assists').textContent = stats.assists || 0;
      document.getElementById('stats-tackles').textContent = stats.tackles || 0;
      document.getElementById('stats-draws').textContent = stats.draws || 0;
      document.getElementById('stats-possession').textContent = `${stats.matchesPlayed ? Math.round((stats.possessionTotal || 0) / stats.matchesPlayed) : 0}%`;
      document.getElementById('stats-own-goals').textContent = stats.ownGoals || 0;
      document.getElementById('stats-mvps').textContent = stats.mvps || 0;
      document.getElementById('stats-overall').textContent = calculateOverallRating(stats);
      document.getElementById('stats-level').textContent = this.profileData.level || 1;
      document.getElementById('stats-xp').textContent = this.profileData.xp || 0;
    }

    // Load Match History
    const historyList = document.getElementById('profile-match-history-modal-list') || document.getElementById('profile-match-history');
    const openHistoryBtn = document.getElementById('profile-btn-history-modal');
    const historyModal = document.getElementById('profile-history-modal');
    const closeHistoryBtn = document.getElementById('profile-history-btn-close');
    if (openHistoryBtn && historyModal) openHistoryBtn.onclick = () => historyModal.classList.remove('hidden');
    if (closeHistoryBtn && historyModal) closeHistoryBtn.onclick = () => historyModal.classList.add('hidden');
    if (historyModal) {
      historyModal.onclick = (event) => {
        if (event.target === historyModal) historyModal.classList.add('hidden');
      };
    }
    if (historyList) {
      historyList.innerHTML = '<div class="subtext">Carregando histórico...</div>';
      try {
        const history = await firebaseService.getRecentHistory(this.currentUser.uid);
        if (history.length === 0) {
          historyList.innerHTML = '<div class="subtext">Nenhuma partida recente.</div>';
        } else {
          const buildHistoryItem = (match) => {
              const item = document.createElement('div');
              item.className = 'history-item history-item-clickable';
              item.tabIndex = 0;
              item.setAttribute('role', 'button');
              item.setAttribute('aria-label', 'Abrir detalhes da partida');

              let resultClass = 'draw';
              let resultText = 'Empate';

              if (match.winner === 'draw') {
                resultClass = 'draw';
              } else if (match.winner === match.playerTeams?.[this.currentUser.uid]) {
                resultClass = 'win';
                resultText = 'Vit\u00f3ria';
              } else {
                resultClass = 'loss';
                resultText = 'Derrota';
              }

              const matchDate = new Date(match.date).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
              item.innerHTML = `
                <span>${matchDate} - ${match.mode === 'solo' ? 'vs CPU' : 'Online'}</span>
                <span>${match.scoreRed} : ${match.scoreBlue}</span>
                <span class="history-result ${resultClass}">${resultText}</span>
              `;
              item.onclick = () => this.openMatchDetails(match, this.currentUser.uid);
              item.onkeydown = event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  this.openMatchDetails(match, this.currentUser.uid);
                }
              };
              return item;
          };

          const renderHistory = (expanded = false) => {
            historyList.innerHTML = '';
            const competitiveHistory = history.filter(match => match.competitive || match.category === 'competitive');
            const casualHistory = history.filter(match => !match.competitive && match.category !== 'competitive');
            const groups = [
              ['Competitivas', competitiveHistory],
              ['Casuais', casualHistory]
            ];
            const grid = document.createElement('div');
            grid.className = 'history-split-grid';
            groups.forEach(([title, matches]) => {
              const column = document.createElement('div');
              column.className = 'history-split-column';
              column.innerHTML = `<h3>${title}</h3>`;
              const visible = expanded ? matches : matches.slice(0, 5);
              if (visible.length === 0) {
                column.innerHTML += '<div class="subtext">Nenhuma partida.</div>';
              }
              visible.forEach(match => {
                column.appendChild(buildHistoryItem(match));
              });
              grid.appendChild(column);
            });
            historyList.appendChild(grid);

            if (history.length > 10) {
              const toggle = document.createElement('button');
              toggle.className = 'btn btn-secondary btn-sm history-toggle';
              toggle.textContent = expanded ? 'Ver menos' : 'Ver mais';
              toggle.onclick = () => renderHistory(!expanded);
              historyList.appendChild(toggle);
            }
          };
          renderHistory(false);
        }
      } catch (err) {
        historyList.innerHTML = '<div class="subtext text-danger">Erro ao carregar histórico.</div>';
      }
    }
  },

  async loadCreditsStaff() {
    const roles = [
      ['developer', 'Hugo'],
      ['influencer', 'Rhuan']
    ];
    await Promise.all(roles.map(async ([role, fallbackName]) => {
      const button = document.querySelector(`[data-staff-profile="${role}"]`);
      if (!button) return;
      button.disabled = true;
      button.textContent = fallbackName;
      try {
        const profile = await firebaseService.getStaffProfile(role);
        if (!profile) return;
        button.replaceChildren(document.createTextNode(profile.displayName || profile.username || fallbackName));
        appendStaffTag(button, role);
        button.disabled = false;
        button.onclick = () => this.openPublicProfile(profile.uid);
        button.title = `Ver perfil de ${profile.displayName || profile.username || fallbackName}`;
      } catch (error) {
        console.warn(`[Créditos] Perfil ${role} indisponível:`, error);
      }
    }));
  },

  async saveProfileEdits() {
    if (!this.currentUser) return;
    const usernameInput = document.getElementById('profile-username-input');
    const badgeSelect = document.getElementById('profile-badge-select');
    const bioInput = document.getElementById('profile-bio-input');

    this.updateProfileDraftFromFields();
    const draft = createProfileDraft(this.profileDraft);
    const { username, badge, bio } = draft;

    if (username.length < 3 || username.length > USERNAME_MAX_LENGTH) {
      return showToast(`O nome de usuário precisa ter entre 3 e ${USERNAME_MAX_LENGTH} caracteres.`, 'error');
    }

    if (bio.length > PROFILE_BIO_MAX_LENGTH) {
      return showToast(`A biografia pode ter no máximo ${PROFILE_BIO_MAX_LENGTH} caracteres.`, 'error');
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return showToast('O nome de usuário só pode conter letras, números e sublinhado (_). Sem espaços!', 'error');
    }

    try {
      showToast('Verificando disponibilidade do nome...', 'info');
      const isUnique = await firebaseService.isUsernameUnique(username, this.currentUser.uid);
      if (!isUnique) {
        return showToast('Este nome de usuário já está em uso por outro jogador.', 'error');
      }

      showToast('Salvando dados...', 'info');
      await firebaseService.updateUserProfile(this.currentUser.uid, {
        username,
        displayName: username,
        badge,
        bio,
        equippedSkinId: draft.equippedSkinId,
        equippedSkinImage: draft.equippedSkinImage,
        isNewUser: false
      });
      
      this.profileData.username = username;
      this.profileData.displayName = username;
      this.profileData.badge = badge;
      this.profileData.bio = bio;
      this.profileData.equippedSkinId = draft.equippedSkinId;
      this.profileData.equippedSkinImage = draft.equippedSkinImage;
      this.profileData.isNewUser = false;
      this.clearProfileDraft();

      // Restore back button
      const backBtn = document.getElementById('profile-btn-back');
      if (backBtn) backBtn.style.display = '';

      showToast('Perfil atualizado com sucesso!', 'success');
      await this.refreshQuickProfile();
      router.show('menu-screen');
    } catch (e) {
      showToast('Erro ao atualizar perfil.', 'error');
    }
  },

  updateAvatarDisplay(avatarDisplay, badge) {
    if (!avatarDisplay) return;
    avatarDisplay.innerHTML = '';
    avatarDisplay.textContent = badge || '👤';
  },

  updateProfileDraftFromFields() {
    if (!this.profileDraft) this.profileDraft = createProfileDraft(this.profileData);
    const username = document.getElementById('profile-username-input')?.value ?? this.profileDraft.username;
    const badge = document.getElementById('profile-badge-select')?.value ?? this.profileDraft.badge;
    const bio = document.getElementById('profile-bio-input')?.value ?? this.profileDraft.bio;
    this.profileDraft = { ...this.profileDraft, username, badge, bio };
    this.updateProfileDirtyState();
    const avatar = document.getElementById('profile-avatar-display');
    if (avatar) this.renderSkin(avatar, getEquippedSkin(this.profileDraft), this.profileDraft.badge);
  },

  selectProfileSkinDraft(skin) {
    if (!skin) return;
    if (!this.profileDraft) this.profileDraft = createProfileDraft(this.profileData);
    this.profileDraft = {
      ...this.profileDraft,
      equippedSkinId: skin.id,
      equippedSkinImage: skin.custom ? skin.image : null
    };
    this.updateProfileDirtyState();
    const usesDefaultSkin = usesProfileBadge(this.profileDraft);
    document.getElementById('profile-badge-controls')?.classList.toggle('hidden', !usesDefaultSkin);
  },

  updateProfileDirtyState() {
    this.profileDirty = !!this.profileDraft && profilesDiffer(this.profileData, this.profileDraft);
    const save = document.getElementById('profile-btn-save');
    if (save) save.disabled = !this.profileDirty && !this.profileData?.isNewUser;
  },

  clearProfileDraft() {
    this.profileDraft = null;
    this.profileDirty = false;
  },

  discardProfileChanges() {
    this.clearProfileDraft();
    // Inventory cards are long-lived DOM nodes. Notify their controller so a
    // discarded cosmetic preview cannot remain marked as selected.
    window.dispatchEvent(new CustomEvent('kicker:profile-draft-discarded'));
  },

  async confirmDiscardProfileChanges() {
    if (!this.profileDirty) return true;
    return confirmDialog({
      title: 'Alterações não salvas',
      message: 'Deseja descartar as mudanças feitas no perfil?',
      confirmLabel: 'Sim, descartar',
      cancelLabel: 'Não, continuar editando',
      danger: true
    });
  },

  renderSkin(container, skin, fallback = '👤') {
    if (!container) return;
    container.innerHTML = '';
    if (!skin?.image) {
      container.textContent = fallback;
      return;
    }
    const image = document.createElement('img');
    image.src = skin.image;
    image.alt = skin.name || 'Skin equipada';
    image.draggable = false;
    container.appendChild(image);
  },

  async openPublicProfile(uid) {
    if (!uid) return;
    const modal = document.getElementById('public-profile-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.getElementById('public-profile-title').textContent = 'Carregando...';
    this.publicProfileUid = uid;
    this.publicProfileData = null;
    try {
      const [profile, stats] = await Promise.all([
        firebaseService.getUserProfile(uid),
        firebaseService.getUserStats(uid)
      ]);
      if (!profile) throw new Error('Perfil não encontrado.');
      this.publicProfileData = profile;
      const publicTitle = document.getElementById('public-profile-title');
      publicTitle.textContent = profile.displayName || profile.username || 'Jogador';
      appendStaffTag(publicTitle, profile.staffRole, { full: true });
      document.getElementById('public-profile-bio').textContent = profile.bio || 'Sem biografia.';
      document.getElementById('public-profile-level').textContent = profile.level || 1;
      document.getElementById('public-profile-overall').textContent = calculateOverallRating(stats);
      this.renderSkin(document.getElementById('public-profile-avatar'), getEquippedSkin(profile), profile.badge);
      const publicWinrate = stats.matchesPlayed > 0
        ? Math.round(((stats.wins || 0) / stats.matchesPlayed) * 100)
        : 0;
      const values = {
        'public-stats-played': stats.matchesPlayed || 0,
        'public-stats-wins': stats.wins || 0,
        'public-stats-losses': stats.losses || 0,
        'public-stats-draws': stats.draws || 0,
        'public-stats-goals': stats.goals || 0,
        'public-stats-shots': stats.shots || 0,
        'public-stats-dribbles': stats.dribbles || 0,
        'public-stats-assists': stats.assists || 0,
        'public-stats-tackles': stats.tackles || 0,
        'public-stats-mvps': stats.mvps || 0,
        'public-stats-possession': `${stats.matchesPlayed ? Math.round((stats.possessionTotal || 0) / stats.matchesPlayed) : 0}%`,
        'public-stats-coins': Number(profile.coins || 0),
        'public-stats-skins': Array.isArray(profile.ownedSkins)
          ? new Set(profile.ownedSkins.filter(id => id !== 'rookie')).size
          : 0,
        'public-stats-winrate': `Winrate: ${publicWinrate}%`
      };
      Object.entries(values).forEach(([id, value]) => { document.getElementById(id).textContent = value; });

    } catch (error) {
      document.getElementById('public-profile-title').textContent = 'Perfil indisponível';
      document.getElementById('public-profile-bio').textContent = error.message || 'Não foi possível carregar este perfil.';
    }
  },

  async openPublicInventory() {
    const profile = this.publicProfileData;
    const inventory = document.getElementById('public-profile-inventory');
    const modal = document.getElementById('public-profile-inventory-modal');
    if (!profile || !inventory || !modal) return;
    modal.classList.remove('hidden');
    inventory.textContent = 'Carregando inventário...';
    try {
      const skins = (await Promise.all((profile.ownedSkins || ['rookie']).map(async id => {
        if (String(id).startsWith('community_')) return firebaseService.getSkinAsset(id);
        return getSkinById(id);
      }))).filter(Boolean);
      inventory.replaceChildren();
      skins.forEach(skin => {
        const item = document.createElement('article');
        item.className = `public-skin-item rarity-border-${skin.rarity || 'custom'}`;
        if ((profile.equippedSkinId || 'rookie') === skin.id) item.classList.add('equipped');
        const image = document.createElement('img');
        image.src = skin.image;
        image.alt = skin.name || 'Skin';
        image.draggable = false;
        const name = document.createElement('strong');
        name.textContent = `${skin.name || 'Skin da comunidade'}${(profile.equippedSkinId || 'rookie') === skin.id ? ' · Em uso' : ''}`;
        const value = document.createElement('span');
        value.textContent = `${getSkinValue(skin)} KX`;
        item.append(image, name, value);
        inventory.appendChild(item);
      });
      if (!skins.length) inventory.textContent = 'Nenhuma skin na coleção.';
    } catch (error) {
      inventory.textContent = 'Não foi possível carregar este inventário.';
    }
  },

  async openPublicHistory() {
    const uid = this.publicProfileUid;
    const modal = document.getElementById('public-profile-history-modal');
    const list = document.getElementById('public-profile-history-list');
    if (!uid || !modal || !list) return;
    modal.classList.remove('hidden');
    list.textContent = 'Carregando histórico...';
    try {
      const history = await firebaseService.getRecentHistory(uid, 20);
      list.replaceChildren();
      const groups = [
        ['Competitivas', history.filter(match => match.competitive || match.category === 'competitive').slice(0, 10)],
        ['Casuais', history.filter(match => !match.competitive && match.category !== 'competitive').slice(0, 10)]
      ];
      const grid = document.createElement('div');
      grid.className = 'history-split-grid public-history-grid';
      const appendMatch = (column, match) => {
        const team = match.playerTeams?.[uid];
        const isDraw = match.winner === 'draw';
        const isWin = !isDraw && String(team) === String(match.winner);
        const item = document.createElement('article');
        item.className = 'history-item public-history-item history-item-clickable';
        item.tabIndex = 0;
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Abrir detalhes da partida');
        const date = document.createElement('span');
        date.textContent = new Date(match.date || match.endedAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
        const mode = document.createElement('span');
        mode.textContent = match.competitive || match.category === 'competitive' ? 'Competitiva' : 'Casual';
        const score = document.createElement('strong');
        score.textContent = `${match.scoreRed ?? 0} : ${match.scoreBlue ?? 0}`;
        const result = document.createElement('span');
        result.className = `history-result ${isDraw ? 'draw' : isWin ? 'win' : 'loss'}`;
        result.textContent = isDraw ? 'Empate' : isWin ? 'Vit\u00f3ria' : 'Derrota';
        item.append(date, mode, score, result);
        item.onclick = () => this.openMatchDetails(match, uid);
        item.onkeydown = event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.openMatchDetails(match, uid);
          }
        };
        column.appendChild(item);
      };
      groups.forEach(([title, matches]) => {
        const column = document.createElement('section');
        column.className = 'history-split-column';
        const heading = document.createElement('h3');
        heading.textContent = title;
        column.appendChild(heading);
        matches.forEach(match => appendMatch(column, match));
        if (!matches.length) {
          const empty = document.createElement('p');
          empty.className = 'subtext';
          empty.textContent = 'Nenhuma partida.';
          column.appendChild(empty);
        }
        grid.appendChild(column);
      });
      list.appendChild(grid);
      if (!history.length) list.textContent = 'Nenhuma partida registrada nesta temporada.';
    } catch (error) {
      list.textContent = 'Não foi possível carregar este histórico.';
    }
  },

  openMatchDetails(match, viewerUid) {
    const modal = document.getElementById('match-details-modal');
    const report = document.getElementById('match-details-report');
    if (!modal || !report || !match) return;
    const competitive = match.competitive || match.category === 'competitive';
    const date = new Date(match.date || match.endedAt || Date.now()).toLocaleString('pt-BR', {
      dateStyle: 'short', timeStyle: 'short'
    });
    const team = match.playerTeams?.[viewerUid];
    const draw = match.winner === 'draw';
    const won = !draw && String(team) === String(match.winner);
    document.getElementById('match-details-title').textContent = `${competitive ? 'Competitiva' : 'Casual'} · ${draw ? 'Empate' : won ? 'Vitória' : 'Derrota'}`;
    document.getElementById('match-details-meta').textContent = `${date}${match.forfeit ? ' · Encerrada por W.O.' : ''}`;
    document.getElementById('match-details-score').textContent = `${match.scoreRed ?? match.score?.red ?? 0} : ${match.scoreBlue ?? match.score?.blue ?? 0}`;
    renderMatchReport(report, match);
    modal.classList.remove('hidden');
  },
};
export default menuController;
