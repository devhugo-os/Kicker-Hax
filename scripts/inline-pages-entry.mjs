import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const ENTRY_SCRIPT_PATTERN = /<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="\.\/assets\/(index-[^"]+\.js)")[^>]*><\/script>/;
const ENTRY_STYLE_PATTERN = /<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="\.\/assets\/(index-[^"]+\.css)")[^>]*>/;

/**
 * Embeds the application entry in the deployed HTML. GitHub Pages can briefly
 * publish a new document before its newly hashed assets reach every CDN node;
 * keeping the entry in the document prevents that window from breaking boot.
 */
export function inlinePagesEntry(indexPath) {
  const html = readFileSync(indexPath, 'utf8');
  const match = html.match(ENTRY_SCRIPT_PATTERN);
  if (!match) throw new Error('Entrada JavaScript do Pages nao encontrada para incorporacao.');
  const styleMatch = html.match(ENTRY_STYLE_PATTERN);
  if (!styleMatch) throw new Error('Folha de estilos do Pages nao encontrada para incorporacao.');

  const entryPath = resolve(dirname(indexPath), 'assets', match[1]);
  const entrySource = readFileSync(entryPath, 'utf8')
    // Relative imports originally resolve from docs/assets. Once inlined they
    // resolve from docs, so preserve the same target explicitly.
    .replace(/\bfrom(["'])\.\/([^"']+\.js)\1/g, 'from$1./assets/$2$1')
    .replace(/\bimport\((["'])\.\/([^"']+\.js)\1\)/g, 'import($1./assets/$2$1)')
    .replace(/<\/script/gi, '<\\/script');

  const stylePath = resolve(dirname(indexPath), 'assets', styleMatch[1]);
  const styleSource = readFileSync(stylePath, 'utf8').replace(/<\/style/gi, '<\\/style');
  const inlined = html
    .replace(match[0], `<script type="module" data-kicker-inline-entry>\n${entrySource}\n</script>`)
    .replace(styleMatch[0], `<style data-kicker-inline-styles>\n${styleSource}\n</style>`);
  writeFileSync(indexPath, inlined);
  return { script: match[1], style: styleMatch[1] };
}
