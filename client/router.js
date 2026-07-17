// Kicker Hax - SPA Client-side View Router

import { soundFx } from './utils/soundFx.js';

class Router {
  constructor() {
    this.routes = new Map(); // screenId -> { onEnter, onExit }
    this.currentScreenId = 'splash-screen';
  }

  register(screenId, handlers = {}) {
    this.routes.set(screenId, {
      onEnter: handlers.onEnter || null,
      onExit: handlers.onExit || null
    });
  }

  show(screenId) {
    if (screenId !== 'match-screen') {
      try {
        soundFx.stopCrowd();
      } catch (err) {}
    }
    if (screenId !== 'match-screen') {
      try { soundFx.startMenuTheme(); } catch (err) {}
      try { soundFx.stopMatchTheme(); } catch (err) {}
    } else {
      try { soundFx.stopMenuTheme(); } catch (err) {}
      try { soundFx.startMatchTheme(); } catch (err) {}
    }
    const nextScreen = document.getElementById(screenId);
    if (!nextScreen) {
      console.error(`[Router] Tela não encontrada: ${screenId}`);
      return;
    }

    const prevScreenId = this.currentScreenId;
    const prevRoute = this.routes.get(prevScreenId);
    const nextRoute = this.routes.get(screenId);

    // Call exit lifecycle handler
    if (prevRoute && prevRoute.onExit) {
      try {
        prevRoute.onExit({ from: prevScreenId, to: screenId });
      } catch (err) {
        console.error(`[Router] Erro ao sair da tela ${prevScreenId}:`, err);
      }
    }

    // Toggle DOM classes
    const allScreens = document.querySelectorAll('.screen-view');
    allScreens.forEach(el => {
      el.classList.add('hidden');
      el.classList.remove('active');
    });

    nextScreen.classList.remove('hidden');
    nextScreen.classList.add('active');
    
    this.currentScreenId = screenId;
    window.dispatchEvent(new CustomEvent('kicker:routechange', { detail: { from: prevScreenId, to: screenId } }));

    const globalChat = document.getElementById('global-chat-container');
    if (globalChat) {
      if (screenId === 'menu-screen' || screenId === 'multiplayer-screen' || screenId === 'lobby-screen') {
        globalChat.classList.remove('hidden');
      } else {
        globalChat.classList.add('hidden');
      }
    }

    const versionBadge = document.getElementById('game-version-badge');
    if (versionBadge) {
      versionBadge.classList.toggle('hidden', screenId !== 'menu-screen');
    }

    // Call enter lifecycle handler
    if (nextRoute && nextRoute.onEnter) {
      try {
        nextRoute.onEnter();
      } catch (err) {
        console.error(`[Router] Erro ao entrar na tela ${screenId}:`, err);
      }
    }
  }
}

export const router = new Router();
export default router;
