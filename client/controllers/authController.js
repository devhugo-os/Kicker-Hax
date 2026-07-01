// Kicker Hax - Auth View Controller
import { firebaseService } from '../services/firebaseService.js';
import { showToast } from '../utils/toast.js';

export const authController = {
  init() {
    // Bind Google Login Button
    const googleBtn = document.getElementById('btn-google-login');
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        try {
          showToast('Iniciando login com Google...', 'info');
          await firebaseService.loginWithGoogle();
          showToast('Login realizado com sucesso!', 'success');
          // Router handles redirecting to menu screen automatically on auth state change
        } catch (err) {
          showToast(err.message || 'Erro ao entrar com Google.', 'error');
        }
      });
    }
  }
};
export default authController;
