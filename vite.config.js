import { defineConfig } from 'vite';
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { inlinePagesEntry } from './scripts/inline-pages-entry.mjs';

const cordovaConfig = readFileSync(resolve('cordova-app/config.xml'), 'utf8');
const nativeVersion = cordovaConfig.match(/<widget\b[^>]*\bversion="([^"]+)"/)?.[1];
if (!nativeVersion) throw new Error('Versao ausente em cordova-app/config.xml.');
const displayVersion = nativeVersion.split('.').length > 2
  ? nativeVersion.replace(/\.0$/, '')
  : nativeVersion;
const emittedBuildAssets = new Set();

export default defineConfig({
  root: 'client',
  base: './',
  define: {
    __KICKER_HAX_VERSION__: JSON.stringify(nativeVersion)
  },
  plugins: [
    {
      name: 'emit-nojekyll-for-pages',
      generateBundle(_options, bundle) {
        // Dynamic imports are referenced by another chunk instead of the HTML.
        // Keep every asset emitted by the current build so the cleanup cannot
        // delete lazy features such as the MP4 exporter before Pages commits it.
        emittedBuildAssets.clear();
        Object.keys(bundle)
          .filter(fileName => fileName.startsWith('assets/'))
          .forEach(fileName => emittedBuildAssets.add(basename(fileName)));
      },
      closeBundle() {
        writeFileSync(resolve('docs/.nojekyll'), '');
        writeFileSync(resolve('docs/deploy-version.txt'), `Kicker Hax ${displayVersion}\nbuild: ${new Date().toISOString()}\n`);

        // Keep the entry in the document so Pages propagation cannot leave a
        // new HTML shell pointing at a newly hashed file that is not live yet.
        inlinePagesEntry(resolve('docs/index.html'));

        // The download folder is preserved, while obsolete hashed bundles are
        // removed after each build so Pages never accumulates stale scripts.
        const indexHtml = readFileSync(resolve('docs/index.html'), 'utf8')
          .replace(/\r/g, '')
          .replace(/[ \t]+(?=\n|$)/g, '');
        writeFileSync(resolve('docs/index.html'), indexHtml);
        const activeAssets = new Set(
          [...indexHtml.matchAll(/\.\/assets\/([^"']+)/g)].map(match => basename(match[1]))
        );
        emittedBuildAssets.forEach(asset => activeAssets.add(asset));
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
