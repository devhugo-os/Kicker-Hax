import { defineConfig } from 'vite';

export default defineConfig({
  root: 'client',
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      // This is required to dynamically load serverPhysics.js in Solo mode
      allow: ['..']
    }
  }
});
