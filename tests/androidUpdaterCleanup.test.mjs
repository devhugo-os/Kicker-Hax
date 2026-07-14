import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const updaterRoot = new URL('../cordova-app/cordova-plugins/kicker-hax-updater/', import.meta.url);

test('remove o APK registrado depois que o Android conclui a atualizacao', async () => {
  const [updater, receiver, manifest] = await Promise.all([
    readFile(new URL('src/android/KickerHaxUpdater.java', updaterRoot), 'utf8'),
    readFile(new URL('src/android/UpdateCheckReceiver.java', updaterRoot), 'utf8'),
    readFile(new URL('plugin.xml', updaterRoot), 'utf8')
  ]);

  assert.match(updater, /cleanupDownloadedApk/);
  assert.match(updater, /manager\.remove\(downloadId\)/);
  assert.match(updater, /updateFile\.delete\(\)/);
  assert.match(receiver, /ACTION_MY_PACKAGE_REPLACED/);
  assert.match(receiver, /KickerHaxUpdater\.cleanupDownloadedApk\(context\)/);
  assert.match(manifest, /android\.intent\.action\.MY_PACKAGE_REPLACED/);
});

test('notificacoes Android preservam acentos e anunciam uma mudanca real do jogo', async () => {
  const [updater, worker] = await Promise.all([
    readFile(new URL('src/android/KickerHaxUpdater.java', updaterRoot), 'utf8'),
    readFile(new URL('src/android/UpdateCheckWorker.java', updaterRoot), 'utf8')
  ]);

  for (const source of [updater, worker]) {
    assert.match(source, /Atualizações do Kicker Hax/);
    assert.match(source, /HUD renovado/);
    assert.doesNotMatch(source, /Atualizacao do Kicker Hax/);
  }
  assert.match(updater, /Atualização do Kicker Hax/);
  assert.match(updater, /nova versão do jogo/);
});
