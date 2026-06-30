// Kicker Hax - Main Menu & Profile Controller
import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { showToast } from '../utils/toast.js';
import { sanitizeBadgeInput } from '../utils/graphemes.js';

export const menuController = {
  currentUser: null,
  profileData: null,

  async init(user) {
    this.currentUser = user;
    if (!user) return;

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
    if (btnControls) btnControls.onclick = () => router.show('controls-screen');

    const btnCredits = document.getElementById('menu-btn-credits');
    if (btnCredits) btnCredits.onclick = () => router.show('credits-screen');

    const btnLogout = document.getElementById('menu-btn-logout');
    if (btnLogout) {
      btnLogout.onclick = async () => {
        try {
          await firebaseService.logout();
          showToast('Desconectado com sucesso.', 'info');
        } catch (e) {
          showToast('Erro ao sair da conta.', 'error');
        }
      };
    }

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

    // Profile Back button
    const btnProfileBack = document.getElementById('profile-btn-back');
    if (btnProfileBack) btnProfileBack.onclick = () => router.show('menu-screen');

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
    if (badgeSelect && avatarDisplay) {
      badgeSelect.addEventListener('change', (e) => {
        this.updateAvatarDisplay(avatarDisplay, e.target.value);
      });
    }

    // Initial load
    await this.refreshQuickProfile();
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

      if (flagEl) flagEl.textContent = this.profileData.badge || '🇧🇷';
      if (nameEl) nameEl.textContent = this.profileData.displayName || this.profileData.username;
      if (levelEl) levelEl.textContent = this.profileData.level || 1;
      if (avatarEl) avatarEl.textContent = this.profileData.badge || '👤';

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

    // Refresh data
    this.profileData = await firebaseService.getUserProfile(this.currentUser.uid);

    // Bind edit fields
    const usernameInput = document.getElementById('profile-username-input');
    const badgeSelect = document.getElementById('profile-badge-select');
    const bioInput = document.getElementById('profile-bio-input');
    const avatarDisplay = document.getElementById('profile-avatar-display');

    if (usernameInput) usernameInput.value = this.profileData.username || '';
    if (badgeSelect) badgeSelect.value = this.profileData.badge || '👤';
    if (bioInput) bioInput.value = this.profileData.bio || '';
    if (avatarDisplay) {
      this.updateAvatarDisplay(avatarDisplay, this.profileData.badge);
    }

    // Load statistics
    const stats = await firebaseService.getUserStats(this.currentUser.uid);
    if (stats) {
      const winrate = stats.matchesPlayed > 0 ? Math.round((stats.wins / stats.matchesPlayed) * 100) : 0;

      document.getElementById('stats-played').textContent = stats.matchesPlayed || 0;
      document.getElementById('stats-wins').textContent = stats.wins || 0;
      document.getElementById('stats-losses').textContent = stats.losses || 0;
      document.getElementById('stats-winrate').textContent = `${winrate}%`;
      document.getElementById('stats-goals').textContent = stats.goals || 0;
      document.getElementById('stats-assists').textContent = stats.assists || 0;
      document.getElementById('stats-saves').textContent = stats.saves || 0;
      document.getElementById('stats-level').textContent = this.profileData.level || 1;
      document.getElementById('stats-xp').textContent = this.profileData.xp || 0;
    }

    // Load Match History
    const historyList = document.getElementById('profile-match-history');
    if (historyList) {
      historyList.innerHTML = '<div class="subtext">Carregando histórico...</div>';
      try {
        const history = await firebaseService.getRecentHistory(this.currentUser.uid);
        if (history.length === 0) {
          historyList.innerHTML = '<div class="subtext">Nenhuma partida recente.</div>';
        } else {
          historyList.innerHTML = '';
          history.forEach(match => {
            const item = document.createElement('div');
            item.className = 'history-item';
            
            // Calc win/loss/draw label for user
            let resultClass = 'draw';
            let resultText = 'Empate';
            
            if (match.winner === 'draw') {
              resultClass = 'draw';
              resultText = 'Empate';
            } else if (match.winner === match.playerTeams[this.currentUser.uid]) {
              resultClass = 'win';
              resultText = 'Vitória';
            } else {
              resultClass = 'loss';
              resultText = 'Derrota';
            }

            const matchDate = new Date(match.date).toLocaleDateString('pt-BR');
            item.innerHTML = `
              <span>📅 ${matchDate} - ${match.mode === 'solo' ? 'vs CPU' : 'Online'}</span>
              <span>${match.scoreRed} : ${match.scoreBlue}</span>
              <span class="history-result ${resultClass}">${resultText}</span>
            `;
            historyList.appendChild(item);
          });
        }
      } catch (err) {
        historyList.innerHTML = '<div class="subtext text-danger">Erro ao carregar histórico.</div>';
      }
    }
  },

  async saveProfileEdits() {
    if (!this.currentUser) return;
    const usernameInput = document.getElementById('profile-username-input');
    const badgeSelect = document.getElementById('profile-badge-select');
    const bioInput = document.getElementById('profile-bio-input');

    const username = usernameInput ? usernameInput.value.trim().toLowerCase() : '';
    const badge = badgeSelect ? badgeSelect.value : '👤';
    const bio = bioInput ? bioInput.value.trim() : '';

    if (username.length < 3 || username.length > 12) {
      return showToast('O nome de usuário precisa ter entre 3 e 12 caracteres.', 'error');
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
        isNewUser: false
      });
      
      this.profileData.username = username;
      this.profileData.displayName = username;
      this.profileData.badge = badge;
      this.profileData.bio = bio;
      this.profileData.isNewUser = false;

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
  }
};
export default menuController;
