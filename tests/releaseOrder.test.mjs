import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('release compila APK antes de gerar e publicar o site', () => {
  const workflow = readFileSync(new URL('../.github/workflows/build-cordova-apk.yml', import.meta.url), 'utf8');
  const apkBuild = workflow.indexOf('- name: Build APK');
  const apkPublish = workflow.indexOf('- name: Publish APK to docs');
  const webBuild = workflow.indexOf('- name: Build web release after APK');
  const releaseCommit = workflow.indexOf('- name: Commit APK');
  assert.ok(apkBuild >= 0);
  assert.ok(apkBuild < apkPublish);
  assert.ok(apkPublish < webBuild);
  assert.ok(webBuild < releaseCommit);
});
