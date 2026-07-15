import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(projectRoot, 'cordova-app/config.xml');
const launcherPath = resolve(projectRoot, 'cordova-app/www/index.html');
const packagePath = resolve(projectRoot, 'package.json');
const configXml = readFileSync(configPath, 'utf8');
const version = configXml.match(/<widget\b[^>]*\bversion="([^"]+)"/)?.[1];

if (!version) throw new Error('Versao ausente em cordova-app/config.xml.');
const webVersion = JSON.parse(readFileSync(packagePath, 'utf8')).version;
const normalizedWebVersion = String(webVersion).replace(/\.0$/, '');
if (version !== normalizedWebVersion) {
  throw new Error(`Versoes divergentes: app ${version}, web ${webVersion}.`);
}

const launcher = readFileSync(launcherPath, 'utf8');
const nativeVersionPattern = /url\.searchParams\.set\('nativeAppVersion',\s*'[^']*'\);/;
if (!nativeVersionPattern.test(launcher)) {
  throw new Error('nativeAppVersion ausente em cordova-app/www/index.html.');
}
const synchronized = launcher.replace(
  nativeVersionPattern,
  `url.searchParams.set('nativeAppVersion', '${version}');`
);

writeFileSync(launcherPath, synchronized);
console.log(`Versao nativa sincronizada: ${version}`);
