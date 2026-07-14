import { defineConfig } from 'vite';
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';

const cordovaConfig = readFileSync(resolve('cordova-app/config.xml'), 'utf8');
const nativeVersion = cordovaConfig.match(/<widget\b[^>]*\bversion="([^"]+)"/)?.[1];
if (!nativeVersion) throw new Error('Versao ausente em cordova-app/config.xml.');
const displayVersion = nativeVersion.split('.').length > 2
  ? nativeVersion.replace(/\.0$/, '')
  : nativeVersion;

export default defineConfig({
  root: 'client',
  base: './',
  define: {
    __KICKER_HAX_VERSION__: JSON.stringify(nativeVersion)
  },
  plugins: [
    {
      name: 'emit-nojekyll-for-pages',
      closeBundle() {
        writeFileSync(resolve('docs/.nojekyll'), '');
        writeFileSync(resolve('docs/deploy-version.txt'), `Kicker Hax ${displayVersion}\nbuild: ${new Date().toISOString()}\n`);

        // The download folder is preserved, while obsolete hashed bundles are
        // removed after each build so Pages never accumulates stale scripts.
        const indexHtml = readFileSync(resolve('docs/index.html'), 'utf8')
          .replace(/\r/g, '')
          .replace(/[ \t]+(?=\n|$)/g, '');
        writeFileSync(resolve('docs/index.html'), indexHtml);
        const activeAssets = new Set(
          [...indexHtml.matchAll(/\.\/assets\/([^"']+)/g)].map(match => basename(match[1]))
        );
        readdirSync(resolve('docs/assets')).forEach(asset => {
          if (!activeAssets.has(asset)) unlinkSync(resolve('docs/assets', asset));
        });
      }
    }
  ],
  build: {
    outDir: '../docs',
    // APKs are produced by the Cordova workflow inside docs/downloads. Keep
    // them while replacing the web bundle so normal site builds never erase
    // the currently downloadable app.
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/firebase/') || id.includes('\\node_modules\\firebase\\')) return 'firebase';
          if (id.includes('/server/models/') || id.includes('\\server\\models\\')) return 'game-engine';
          return undefined;
        }
      }
    }
  },
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      // This is required to dynamically load serverPhysics.js in Solo mode
      allow: ['..']
    }
  }
});
