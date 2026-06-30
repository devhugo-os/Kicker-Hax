// Kicker Hax - Auth View Controller
import { router } from '../router.js';
import { firebaseService } from '../services/firebaseService.js';
import { showToast } from '../utils/toast.js';

export const authController = {
  init() {
    // 1) Bind Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        
        try {
          showToast('Efetuando login...', 'info');
          await firebaseService.login(email, pass);
          showToast('Login realizado com sucesso!', 'success');
          // Router handles redirecting to menu screen automatically on auth state change
        } catch (err) {
          showToast(err.message || 'E-mail ou senha incorretos.', 'error');
        }
      });
    }

    // 2) Bind Register Form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const displayName = document.getElementById('register-displayname').value;
        const email = document.getElementById('register-email').value;
        const pass = document.getElementById('register-password').value;
        const country = document.getElementById('register-country').value;

        if (username.length < 3 || username.includes(' ')) {
          return showToast('Nome de usuário inválido (mínimo 3 caract., sem espaços).', 'error');
        }

        try {
          showToast('Registrando perfil...', 'info');
          await firebaseService.register(username, displayName, email, pass, country);
          showToast('Conta criada com sucesso!', 'success');
        } catch (err) {
          showToast(err.message || 'Erro ao registrar.', 'error');
        }
      });
    }

    // 3) Bind Password Recovery Form
    const recoveryForm = document.getElementById('recovery-form');
    if (recoveryForm) {
      recoveryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('recovery-email').value;

        try {
          showToast('Enviando e-mail de recuperação...', 'info');
          await firebaseService.recoverPassword(email);
          showToast('E-mail enviado! Verifique sua caixa de entrada.', 'success');
          router.show('login-screen');
        } catch (err) {
          showToast(err.message || 'Erro ao enviar e-mail de recuperação.', 'error');
        }
      });
    }

    // 4) View Navigation Buttons
    const goReg = document.getElementById('go-to-register');
    if (goReg) goReg.onclick = () => router.show('register-screen');

    const goRec = document.getElementById('go-to-recovery');
    if (goRec) goRec.onclick = () => router.show('recovery-screen');

    const backLogReg = document.getElementById('register-back-to-login');
    if (backLogReg) backLogReg.onclick = () => router.show('login-screen');

    const backLogRec = document.getElementById('recovery-back-to-login');
    if (backLogRec) backLogRec.onclick = () => router.show('login-screen');
  }
};
export default authController;
