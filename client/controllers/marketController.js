import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { menuController } from './menuController.js';
import { CHESTS, SKINS, getSkinById, getSkinValue, rollChest } from '../data/skins.js';
import { showToast } from '../utils/toast.js';
import { buildChestReel, getReelTargetOffset } from '../utils/chestReel.js';
import { escapeHtml, safeImageSource } from '../utils/safeHtml.js';
import { getCommunitySkinInventoryValue, getInsufficientCoinsMessage } from '../utils/marketPricing.js';
import { createChestPurchaseId, markChestPurchaseCommitted } from '../utils/chestPurchase.js';
import { normalizeCommunitySkinName } from '../utils/skinQueue.js';
import { confirmDialog } from '../utils/dialog.js';
import { encodeSkinCanvas, validateSkinImageFile } from '../utils/skinImage.js';
import { SKIN_IMAGE_MAX_BYTES, SKIN_NAME_MAX_LENGTH } from '../../shared/constants.js';
import { soundFx } from '../utils/soundFx.js';
import { formatFeaturedTimeLeft } from '../utils/featuredCycle.js';

const FEATURED = {
  daily: { label: 'Skin do dia', price: 90, reset: 'Troca diariamente' },
  weekly: { label: 'Skin da semana', price: 180, reset: 'Troca toda semana' },
  monthly: { label: 'Skin do mês', price: 360, reset: 'Troca a cada 4 semanas' }
};
const rarityLabel = { none: 'Sem skin', common: 'Comum', rare: 'Rara', epic: 'Épica', legendary: 'Lendária', custom: 'Skin do dia' };

export const marketController = {
  crop: { image: null, x: 0, y: 0, zoom: 1, dragging: false },

  async init(user) {
    this.user = user;
    document.getElementById('menu-btn-market')?.addEventListener('click', () => router.show('market-screen'));
    document.getElementById('market-btn-back')?.addEventListener('click', () => router.show('menu-screen'));
    document.getElementById('profile-btn-inventory')?.addEventListener('click', () => router.show('inventory-screen'));
    document.getElementById('inventory-btn-back')?.addEventListener('click', () => router.show('profile-screen'));
    document.querySelectorAll('[data-inventory-rarity]').forEach(button => button.addEventListener('click', () => {
      this.inventoryRarity = button.dataset.inventoryRarity;
      document.querySelectorAll('[data-inventory-rarity]').forEach(item => item.classList.toggle('active', item === button));
      this.renderInventory();
    }));
    document.getElementById('inventory-sort')?.addEventListener('change', () => this.renderInventory());
    window.addEventListener('kicker:profile-draft-discarded', () => this.renderInventory());
    document.querySelectorAll('[data-market-tab]').forEach(button => button.addEventListener('click', () => this.selectTab(button.dataset.marketTab)));
    document.getElementById('chest-roulette-close')?.addEventListener('click', () => this.closeChestRoulette());
    this.bindCropEditor();
    router.register('market-screen', { onEnter: () => this.load() });
    router.register('inventory-screen', { onEnter: () => this.loadInventory() });
    await this.resumePendingChestPurchase();
  },

  async load() {
    if (!this.user) return;
    menuController.profileData = await firebaseService.getUserProfile(this.user.uid);
    await this.resumePendingChestPurchase();
    this.renderWallet();
    this.renderChests();
    await this.renderFeatured();
    await this.renderRequestStatus();
  },

  selectTab(tab) {
    document.querySelectorAll('[data-market-tab]').forEach(button => button.classList.toggle('active', button.dataset.marketTab === tab));
    document.querySelectorAll('.market-panel').forEach(panel => panel.classList.add('hidden'));
    document.getElementById(`market-panel-${tab}`)?.classList.remove('hidden');
  },

  renderWallet() {
    const coins = menuController.profileData?.coins || 0;
    const marketCoins = document.getElementById('market-coins');
    const profileCoins = document.getElementById('profile-coins');
    if (marketCoins) marketCoins.textContent = coins;
    if (profileCoins) profileCoins.textContent = coins;
    const inventoryCoins = document.getElementById('inventory-coins');
    if (inventoryCoins) inventoryCoins.textContent = coins;
  },

  renderChests() {
    const grid = document.getElementById('market-chest-grid');
    if (!grid) return;
    grid.innerHTML = '';
    Object.values(CHESTS).forEach(chest => {
      const card = document.createElement('article');
      card.className = `market-chest chest-${chest.id}`;
      card.style.setProperty('--chest-accent', chest.accent);
      const glyph = chest.id === 'common' ? 'C' : chest.id === 'golden' ? 'G' : 'O';
      card.innerHTML = `<div class="chest-art"><div class="chest-aura"></div><div class="chest-spark spark-a"></div><div class="chest-spark spark-b"></div><div class="chest-glow"></div><div class="chest-lid"></div><div class="chest-lock">${glyph}</div><div class="chest-body"><span>KX</span></div><div class="chest-base"></div></div><div><span class="market-eyebrow">${chest.rarities.map(r => rarityLabel[r]).join(' • ')}</span><h3>${escapeHtml(chest.name)}</h3><p>Uma coleção temática com prêmio garantido. Duplicatas devolvem 25% do preço.</p></div><button class="btn btn-primary" type="button">Abrir por ${chest.price} KX Coins</button>`;
      card.querySelector('button').onclick = () => this.openChest(chest.id);
      grid.appendChild(card);
    });
  },

  async openChest(chestId) {
    if (this.openingChest || this.confirmingPurchase) return false;
    const chest = CHESTS[chestId];
    const balance = Number(menuController.profileData?.coins || 0);
    if (balance < chest.price) {
      showToast(getInsufficientCoinsMessage(balance, chest.price, `abrir o ${chest.name}`), 'error');
      return false;
    }
    this.confirmingPurchase = true;
    const confirmed = await confirmDialog({
      title: `Abrir ${chest.name}?`,
      message: `Esta abertura custa ${chest.price} KX Coins. Seu saldo atual é ${balance} KX Coins.`,
      confirmLabel: 'Abrir baú'
    });
    this.confirmingPurchase = false;
    if (!confirmed) return false;
    const won = rollChest(chestId);
    const purchaseId = createChestPurchaseId();
    const pendingPurchase = { purchaseId, chestId, skinId: won.id };
    this.setPendingChestPurchase(pendingPurchase);
    this.openingChest = true;
    try {
      const result = await firebaseService.purchaseSkinChest(this.user.uid, chest, won, purchaseId);
      // Keep the committed receipt until the reveal ends. Closing the app
      // during the spin can then reconcile the same idempotent transaction.
      this.setPendingChestPurchase(markChestPurchaseCommitted(pendingPurchase, result));
      menuController.profileData = { ...menuController.profileData, ...result.profile };
      this.renderWallet();
      await this.playRoulette(chest, won, result.duplicate, result.refund, purchaseId);
      return true;
    } catch (error) {
      if (!this.isRetryablePurchaseError(error)) this.clearPendingChestPurchase(purchaseId);
      showToast(error.message || 'Não foi possível abrir o baú.', 'error');
      return false;
    } finally {
      this.openingChest = false;
    }
  },

  playRoulette(chest, won, duplicate, refund, purchaseId) {
    const modal = document.getElementById('chest-roulette-modal');
    const track = document.getElementById('chest-roulette-track');
    const result = document.getElementById('chest-result');
    this.lastChestReward = null;
    modal?.classList.remove('hidden');
    result?.classList.add('hidden');
    const winnerIndex = 37;
    const reel = buildChestReel(SKINS, won, { length: 42, winnerIndex });
    track.innerHTML = reel.map(skin => `<div class="roulette-skin rarity-${escapeHtml(skin.rarity)}" data-skin-id="${escapeHtml(skin.id)}"><img src="${safeImageSource(skin.image)}" alt=""><span>${escapeHtml(skin.name)}</span></div>`).join('');
    track.style.transition = 'none';
    track.style.transform = 'translateX(0)';
    const viewport = track.parentElement;
    const winnerElement = track.children[winnerIndex];
    const targetOffset = getReelTargetOffset(viewport.clientWidth, winnerElement.offsetLeft, winnerElement.offsetWidth);
    // Flush the zero position before starting a long decelerating spin. Using
    // measured DOM coordinates avoids assumptions about margins or mobile CSS.
    void track.offsetWidth;
    return new Promise(resolve => {
      let completed = false;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (completed) return;
        track.style.transition = 'transform 5s cubic-bezier(.08,.7,.12,1)';
        track.style.transform = `translateX(${targetOffset}px)`;
        this.stopRouletteSound = soundFx.startRoulette(5000);
      }));
      const finish = () => {
        if (completed) return;
        completed = true;
        this.stopRouletteSound?.();
        this.stopRouletteSound = null;
        track.style.transition = 'none';
        track.style.transform = `translateX(${targetOffset}px)`;
        const canOpenAgain = Number(menuController.profileData?.coins || 0) >= chest.price;
        result.innerHTML = `<img src="${safeImageSource(won.image)}" alt="${escapeHtml(won.name)}"><div class="chest-result-info"><span class="rarity-${escapeHtml(won.rarity)}">${escapeHtml(rarityLabel[won.rarity])}</span><h3>${escapeHtml(won.name)}</h3><p>${duplicate ? `Duplicata: ${refund} KX Coins devolvidos.` : 'Adicionada ao seu perfil.'}</p>${canOpenAgain ? `<button class="btn btn-primary chest-open-again" type="button">Abrir novamente por ${chest.price} KX Coins</button>` : ''}</div>`;
        result.querySelector('.chest-open-again')?.addEventListener('click', async event => {
          const button = event.currentTarget;
          button.disabled = true;
          // The previous opening releases its guard in the current microtask.
          await new Promise(resolve => setTimeout(resolve, 0));
          const opened = await this.openChest(chest.id);
          if (!opened) button.disabled = false;
        });
        result.classList.remove('hidden');
        this.finishChestRoulette = null;
        this.lastChestReward = won;
        this.clearPendingChestPurchase(purchaseId);
        if (!duplicate) soundFx.play('reward');
        resolve();
      };
      this.finishChestRoulette = finish;
      track.addEventListener('transitionend', finish, { once: true });
      setTimeout(finish, 5250);
    });
  },

  closeChestRoulette() {
    this.finishChestRoulette?.();
    this.stopRouletteSound?.();
    this.stopRouletteSound = null;
    document.getElementById('chest-roulette-modal')?.classList.add('hidden');
    if (this.lastChestReward) showToast(`${this.lastChestReward.name} já está no seu inventário.`, 'success');
  },

  pendingChestStorageKey() {
    return this.user?.uid ? `kicker_hax_pending_chest_${this.user.uid}` : null;
  },

  getPendingChestPurchase() {
    const key = this.pendingChestStorageKey();
    if (!key) return null;
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  },

  setPendingChestPurchase(pending) {
    const key = this.pendingChestStorageKey();
    try { if (key) localStorage.setItem(key, JSON.stringify(pending)); } catch {}
  },

  clearPendingChestPurchase(purchaseId) {
    const key = this.pendingChestStorageKey();
    const pending = this.getPendingChestPurchase();
    try {
      if (key && (!purchaseId || pending?.purchaseId === purchaseId)) localStorage.removeItem(key);
    } catch {}
  },

  isRetryablePurchaseError(error) {
    const message = String(error?.code || error?.message || '').toLowerCase();
    return ['unavailable', 'deadline-exceeded', 'network', 'offline'].some(token => message.includes(token));
  },

  async resumePendingChestPurchase() {
    const pending = this.getPendingChestPurchase();
    if (!pending || this.openingChest) return;
    const chest = CHESTS[pending.chestId];
    const won = getSkinById(pending.skinId);
    if (!chest || !won || won.id !== pending.skinId) {
      this.clearPendingChestPurchase(pending.purchaseId);
      return;
    }
    this.openingChest = true;
    try {
      const result = await firebaseService.purchaseSkinChest(this.user.uid, chest, won, pending.purchaseId);
      menuController.profileData = { ...menuController.profileData, ...result.profile };
      this.renderWallet();
      this.clearPendingChestPurchase(pending.purchaseId);
      if (result.duplicate) {
        showToast(`Duplicata recuperada: ${result.refund} KX Coins devolvidos.`, 'success');
      } else {
        soundFx.play('reward');
        showToast(`${won.name} foi recuperada e está no seu inventário.`, 'success');
      }
    } catch (error) {
      if (!this.isRetryablePurchaseError(error)) this.clearPendingChestPurchase(pending.purchaseId);
      console.warn('[Kicker Market] Abertura pendente aguardando nova tentativa:', error);
    } finally {
      this.openingChest = false;
    }
  },

  async renderFeatured() {
    const content = document.getElementById('market-daily-content');
    if (!content) return;
    content.innerHTML = '<div class="subtext">Montando as vitrines...</div>';
    const featured = await firebaseService.getFeaturedSkins().catch(() => ({}));
    content.innerHTML = '<div class="featured-skin-grid"></div>';
    const grid = content.firstElementChild;
    Object.entries(FEATURED).forEach(([cadence, config]) => {
      const skin = featured[cadence];
      const card = document.createElement('article');
      card.className = `featured-skin-card featured-${cadence}`;
      if (!skin) {
        card.innerHTML = `<div class="featured-placeholder">?</div><div><span class="market-eyebrow">${config.reset}</span><h3>${config.label}</h3><p>Aguardando a primeira solicitação da comunidade.</p></div>`;
        grid.appendChild(card);
        return;
      }
      const owned = (menuController.profileData?.ownedSkins || []).includes(skin.id);
      const resetLabel = skin.expiresAt ? formatFeaturedTimeLeft(skin.expiresAt) : config.reset;
      card.innerHTML = `<img src="${safeImageSource(skin.image)}" alt="${escapeHtml(skin.name || config.label)}"><div><span class="market-eyebrow">${escapeHtml(config.label)} • ${escapeHtml(resetLabel)}${skin.carried ? ' • mantida por falta de nova candidata' : ''}</span><h3>${escapeHtml(skin.name || 'Skin da comunidade')}</h3><p>Enviada por ${escapeHtml(skin.username || 'Jogador')}</p><strong>${config.price} KX Coins</strong><button class="btn btn-primary" type="button" ${owned ? 'disabled' : ''}>${owned ? 'Já adquirida' : 'Comprar'}</button></div>`;
      card.querySelector('button')?.addEventListener('click', async () => {
        const purchaseButton = card.querySelector('button');
        if (purchaseButton?.disabled) return;
        const balance = Number(menuController.profileData?.coins || 0);
        if (balance < config.price) {
          showToast(getInsufficientCoinsMessage(balance, config.price, `comprar a ${config.label}`), 'error');
          return;
        }
        purchaseButton.disabled = true;
        const confirmed = await confirmDialog({
          title: `Comprar ${skin.name || config.label}?`,
          message: `Esta skin custa ${config.price} KX Coins. Seu saldo atual é ${balance} KX Coins.`,
          confirmLabel: 'Comprar skin'
        });
        if (!confirmed) {
          purchaseButton.disabled = false;
          return;
        }
        try {
          const profile = await firebaseService.purchaseDailySkin(this.user.uid, skin, config.price);
          menuController.profileData = { ...menuController.profileData, ...profile };
          this.renderWallet();
          await this.renderFeatured();
          soundFx.play('reward');
          showToast(`${skin.name || config.label} adicionada ao perfil.`, 'success');
        } catch (error) {
          showToast(error.message, 'error');
          purchaseButton.disabled = false;
        }
      });
      grid.appendChild(card);
    });
  },

  async loadInventory() {
    if (!this.user) return;
    const [profile, featured] = await Promise.all([
      firebaseService.getUserProfile(this.user.uid),
      firebaseService.getFeaturedSkins().catch(() => ({}))
    ]);
    menuController.profileData = profile;
    this.renderWallet();
    const owned = menuController.profileData?.ownedSkins?.length ? menuController.profileData.ownedSkins : ['rookie'];
    const ownedItems = (await Promise.all(owned.map(async id => {
      if (id.startsWith('community_')) {
        const custom = await firebaseService.getSkinAsset(id);
        const paidValue = getCommunitySkinInventoryValue(menuController.profileData, custom, featured);
        return custom ? { ...custom, rarity: 'custom', value: paidValue } : null;
      }
      const skin = getSkinById(id);
      return { ...skin, value: getSkinValue(skin) };
    }))).filter(Boolean);
    this.inventoryItems = ownedItems;
    this.inventoryRarity ||= 'all';
    this.renderInventory();
  },

  renderInventory() {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;
    const rarityOrder = { legendary: 5, custom: 4, epic: 3, rare: 2, common: 1 };
    const sort = document.getElementById('inventory-sort')?.value || 'rarity';
    const items = (this.inventoryItems || [])
      .filter(skin => this.inventoryRarity === 'all' || skin.rarity === this.inventoryRarity)
      .sort((a, b) => {
        if (sort === 'price-asc') return a.value - b.value;
        if (sort === 'price-desc') return b.value - a.value;
        if (sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
        return (rarityOrder[b.rarity] - rarityOrder[a.rarity]) || a.name.localeCompare(b.name, 'pt-BR');
      });
    grid.innerHTML = '';
    if (!items.length) {
      grid.innerHTML = '<div class="inventory-empty"><h3>Nenhuma skin neste filtro</h3><p>Abra baús ou acompanhe as vitrines do mercado.</p></div>';
      return;
    }
    items.forEach(skin => {
      // Every account starts with Rookie equipped even when older profiles do
      // not yet have equippedSkinId persisted.
      const equippedId = menuController.profileDraft?.equippedSkinId || menuController.profileData?.equippedSkinId || 'rookie';
      const equipped = equippedId === skin.id;
      const skinPending = equipped && equippedId !== (menuController.profileData?.equippedSkinId || 'rookie');
      const card = document.createElement('article');
      card.className = `inventory-skin-card rarity-border-${skin.rarity} ${equipped ? 'equipped' : ''}`;
      const visual = `<img src="${safeImageSource(skin.image)}" alt="${escapeHtml(skin.name)}">`;
      const valueLabel = skin.id === 'rookie' ? 'Sem valor' : `${skin.value} KX Coins`;
      const equippedLabel = skinPending ? 'Selecionada, salve o perfil' : 'Em uso';
      card.innerHTML = `<div class="inventory-skin-image">${visual}<span>${equipped ? 'Selecionada' : escapeHtml(rarityLabel[skin.rarity])}</span></div><div class="inventory-skin-info"><h3>${escapeHtml(skin.name)}</h3><p>Valor de coleção</p><strong>${valueLabel}</strong><button class="btn ${equipped ? 'btn-secondary' : 'btn-primary'}" type="button" ${equipped ? 'disabled' : ''}>${equipped ? equippedLabel : 'Selecionar'}</button></div>`;
      card.querySelector('button')?.addEventListener('click', async () => {
        menuController.selectProfileSkinDraft(skin);
        this.renderInventory();
        showToast(`${skin.name} selecionada. Volte ao perfil e salve as alterações.`, 'info');
      });
      grid.appendChild(card);
    });
  },

  bindCropEditor() {
    const file = document.getElementById('skin-request-file');
    const image = document.getElementById('skin-crop-image');
    const viewport = document.getElementById('skin-crop-viewport');
    const zoom = document.getElementById('skin-crop-zoom');
    const nameInput = document.getElementById('skin-request-name');
    nameInput?.addEventListener('input', () => this.updateRequestSubmitState());
    file?.addEventListener('change', async () => {
      const selected = file.files?.[0];
      if (!selected || selected.size > 5 * 1024 * 1024) return showToast('Use uma imagem PNG ou JPG de até 5 MB.', 'error');
      const mimeType = await validateSkinImageFile(selected).catch(() => null);
      if (!mimeType) {
        file.value = '';
        return showToast('A skin precisa ser um arquivo PNG ou JPG válido.', 'error');
      }
      const reader = new FileReader();
      reader.onload = () => {
        image.onload = () => {
          this.crop.x = 0;
          this.crop.y = 0;
          this.crop.zoom = 1;
          if (zoom) zoom.value = '1';
          this.updateCrop();
          this.updateRequestSubmitState();
        };
        image.src = reader.result;
        this.crop = { image, x: 0, y: 0, zoom: 1, dragging: false, mimeType };
      };
      reader.readAsDataURL(selected);
    });
    zoom?.addEventListener('input', () => { this.crop.zoom = Number(zoom.value); this.updateCrop(); });
    const point = event => event.touches?.[0] || event;
    viewport?.addEventListener('pointerdown', event => { this.crop.dragging = true; this.crop.lastX = point(event).clientX; this.crop.lastY = point(event).clientY; viewport.setPointerCapture?.(event.pointerId); });
    viewport?.addEventListener('pointermove', event => {
      if (!this.crop.dragging) return;
      const p = point(event); this.crop.x += p.clientX - this.crop.lastX; this.crop.y += p.clientY - this.crop.lastY; this.crop.lastX = p.clientX; this.crop.lastY = p.clientY; this.updateCrop();
    });
    const finishDrag = () => { this.crop.dragging = false; };
    viewport?.addEventListener('pointerup', finishDrag);
    viewport?.addEventListener('pointercancel', finishDrag);
    document.getElementById('skin-request-submit')?.addEventListener('click', () => this.submitRequest());
  },

  updateCrop() {
    const image = document.getElementById('skin-crop-image');
    if (!image?.src || !image.naturalWidth || !image.naturalHeight) return;
    const canvas = document.getElementById('skin-request-preview');
    const ctx = canvas.getContext('2d');
    const viewport = document.getElementById('skin-crop-viewport');
    const viewportSize = Math.max(1, viewport.clientWidth);
    const cropDiameter = viewportSize * 0.78;
    const baseScale = Math.max(cropDiameter / image.naturalWidth, cropDiameter / image.naturalHeight);
    const displayWidth = image.naturalWidth * baseScale * this.crop.zoom;
    const displayHeight = image.naturalHeight * baseScale * this.crop.zoom;
    const maxX = Math.max(0, (displayWidth - cropDiameter) / 2);
    const maxY = Math.max(0, (displayHeight - cropDiameter) / 2);
    this.crop.x = Math.max(-maxX, Math.min(maxX, this.crop.x));
    this.crop.y = Math.max(-maxY, Math.min(maxY, this.crop.y));

    image.style.width = `${displayWidth}px`;
    image.style.height = `${displayHeight}px`;
    image.style.left = `${viewportSize / 2 + this.crop.x}px`;
    image.style.top = `${viewportSize / 2 + this.crop.y}px`;
    image.style.transform = 'translate(-50%, -50%)';

    // Draw from the exact same visual rectangle as the editor. The crop square
    // is mapped to 256x256 before applying the circular mask, so preview and
    // uploaded Base64 cannot diverge.
    const cropLeft = (viewportSize - cropDiameter) / 2;
    const ratio = 256 / cropDiameter;
    const imageLeft = (viewportSize / 2 + this.crop.x) - displayWidth / 2;
    const imageTop = (viewportSize / 2 + this.crop.y) - displayHeight / 2;
    ctx.clearRect(0, 0, 256, 256);
    ctx.save();
    ctx.beginPath();
    ctx.arc(128, 128, 128, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(image, (imageLeft - cropLeft) * ratio, (imageTop - cropLeft) * ratio, displayWidth * ratio, displayHeight * ratio);
    ctx.restore();
  },

  async submitRequest() {
    const canvas = document.getElementById('skin-request-preview');
    const name = normalizeCommunitySkinName(document.getElementById('skin-request-name')?.value);
    if (name.length < 3) return showToast('Dê um nome de pelo menos 3 caracteres para sua skin.', 'error');
    const image = encodeSkinCanvas(canvas, this.crop.mimeType);
    if (!image) return showToast(`Não foi possível comprimir a skin para até ${SKIN_IMAGE_MAX_BYTES / 1024} KB.`, 'error');
    try {
      await firebaseService.submitSkinRequest(this.user.uid, menuController.profileData.username, name, image);
      showToast('Skin solicitada! Ela entrou na fila para aparecer no Mercado.', 'success');
      await this.renderRequestStatus(true);
    } catch (error) { showToast(error.message, 'error'); }
  },

  async renderRequestStatus(justSubmitted = false) {
    const status = document.getElementById('skin-request-status');
    const button = document.getElementById('skin-request-submit');
    // A successful write is authoritative even if the immediate read is still
    // propagating or temporarily unavailable in the Realtime Database.
    const sent = justSubmitted || await firebaseService.hasSkinRequestToday(this.user.uid).catch(() => false);
    this.requestSent = sent;
    if (justSubmitted) this.resetRequestForm();
    const file = document.getElementById('skin-request-file');
    const zoom = document.getElementById('skin-crop-zoom');
    const name = document.getElementById('skin-request-name');
    const shell = document.querySelector('.skin-request-shell');
    [file, zoom, name].forEach(control => { if (control) control.disabled = sent; });
    shell?.classList.toggle('request-used', sent);
    if (status) {
      status.textContent = sent
        ? (justSubmitted ? 'Solicitação confirmada! Sua skin está na fila para aparecer no Mercado.' : 'Você já enviou a solicitação de hoje.')
        : 'Uma solicitação disponível hoje.';
      status.classList.toggle('request-confirmed', sent && justSubmitted);
    }
    if (button) this.updateRequestSubmitState();
  },

  resetRequestForm() {
    const file = document.getElementById('skin-request-file');
    const image = document.getElementById('skin-crop-image');
    const zoom = document.getElementById('skin-crop-zoom');
    const name = document.getElementById('skin-request-name');
    const canvas = document.getElementById('skin-request-preview');
    if (file) file.value = '';
    if (name) name.value = '';
    if (zoom) zoom.value = '1';
    if (image) {
      image.removeAttribute('src');
      image.removeAttribute('style');
    }
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
    this.crop = { image: null, x: 0, y: 0, zoom: 1, dragging: false, mimeType: null };
  },

  updateRequestSubmitState() {
    const button = document.getElementById('skin-request-submit');
    const name = normalizeCommunitySkinName(document.getElementById('skin-request-name')?.value);
    if (button) button.disabled = Boolean(this.requestSent) || !this.crop.image?.src || !this.crop.mimeType || name.length < 3 || name.length > SKIN_NAME_MAX_LENGTH;
  }
};
