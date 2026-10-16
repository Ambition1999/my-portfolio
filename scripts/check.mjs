import { readFile, readdir, stat } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

// Lightweight checks for this buildless HTML page, not a full HTML validator.
const rootUrl = new URL('../', import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const documentUrl = new URL('index.html', rootUrl);
const html = await readFile(documentUrl, 'utf8');
const failures = [];

if (!/^\uFEFF?\s*<!doctype html>/i.test(html)) failures.push('Missing HTML5 doctype.');
if (!/<html\b[^>]*\blang=["'][^"']+["']/i.test(html)) failures.push('Missing document language.');
if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(html)) failures.push('Missing viewport metadata.');
if (!/<title>\s*\S[\s\S]*?<\/title>/i.test(html)) failures.push('Missing page title.');
if (/<style\b/i.test(html)) failures.push('Move stylesheet blocks to assets/css/.');

// Strip script/style bodies and comments, retaining tags for asset checks.
const markup = html
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1>/gi, '<$1$2></$1>');
const tags = [...markup.matchAll(/<[a-z][^>]*>/gi)].map((match) => match[0]);
const getAttribute = (tag, name) => {
  const pattern = new RegExp('(?:^|\\s)' + name + '\\s*=\\s*(["\'])(.*?)\\1', 'i');
  return tag.match(pattern)?.[2];
};
const ids = new Set();

for (const tag of tags) {
  if (getAttribute(tag, 'style') !== undefined) failures.push('Move inline styles to assets/css/.');
  const id = getAttribute(tag, 'id');
  if (id === undefined) continue;
  if (!id || ids.has(id)) failures.push(`Empty or duplicate id: "${id}".`);
  ids.add(id);
}

for (const tag of tags) {
  const href = getAttribute(tag, 'href');
  if (href?.startsWith('#') && href.length > 1 && !ids.has(href.slice(1))) {
    failures.push(`Broken local reference: ${href}.`);
  }
  for (const name of ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
    const value = getAttribute(tag, name);
    if (!value) continue;
    for (const id of value.trim().split(/\s+/)) {
      if (!ids.has(id)) failures.push(`Missing ${name} target: ${id}.`);
    }
  }
  if (getAttribute(tag, 'target') === '_blank') {
    const rel = getAttribute(tag, 'rel')?.split(/\s+/) ?? [];
    if (!rel.includes('noopener')) failures.push(`Missing rel="noopener": ${href}.`);
  }
}

// Check local assets as well as links so missing files fail before deployment.
let assetCount = 0;
for (const tag of tags) {
  for (const attribute of ['src', 'href', 'poster']) {
    const value = getAttribute(tag, attribute);
    if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
    if (value.startsWith('/')) {
      failures.push(`Use a relative URL for project-site hosting: ${value}.`);
      continue;
    }
    try {
      const url = new URL(value, documentUrl);
      const assetPath = relative(rootPath, fileURLToPath(url));
      if (assetPath === '..' || assetPath.startsWith('..' + sep) || isAbsolute(assetPath)) {
        throw new Error('Path is outside the repository');
      }
      if (!(await stat(url)).isFile()) throw new Error('Expected a file');
      assetCount += 1;
    } catch (error) {
      failures.push(`Missing or invalid local asset: ${value} (${error.message}).`);
    }
  }
}

// Keep HTML free of executable inline JavaScript; scripts live in assets/js/.
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const type = getAttribute('<script ' + match[1] + '>', 'type');
  if (type && !['text/javascript', 'application/javascript'].includes(type)) continue;
  if (match[2].trim()) failures.push('Move inline JavaScript to assets/js/.');
}

let scriptCount = 0;
async function checkScripts(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) {
      await checkScripts(url);
    } else if (entry.name.endsWith('.js')) {
      scriptCount += 1;
      try {
        new Script(await readFile(url, 'utf8'), { filename: relative(rootPath, fileURLToPath(url)) });
      } catch (error) {
        failures.push(error.message);
      }
    }
  }
}
await checkScripts(new URL('assets/js/', rootUrl));

if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS portfolio: metadata, ${ids.size} unique IDs, local/accessibility references, ${assetCount} local assets and ${scriptCount} JavaScript files.`);
}
