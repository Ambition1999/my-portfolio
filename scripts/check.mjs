import { readFile, readdir, stat } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

// Lightweight checks for the two buildless HTML pages.
const rootUrl = new URL('../', import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const failures = [];
const localFiles = new Map();

function getAttribute(tag, name) {
  const pattern = new RegExp('(?:^|\\s)' + name + '\\s*=\\s*(["\\\'])(.*?)\\1', 'i');
  return tag.match(pattern)?.[2];
}

async function checkDocument(filename, language, alternateFilename) {
  const documentUrl = new URL(filename, rootUrl);
  const fail = (message) => failures.push(`${filename}: ${message}`);
  let html;
  try {
    html = await readFile(documentUrl, 'utf8');
  } catch (error) {
    fail(error.message);
    return null;
  }

  if (!/^\uFEFF?\s*<!doctype html>/i.test(html)) fail('Missing HTML5 doctype.');
  if (!/<title>\s*\S[\s\S]*?<\/title>/i.test(html)) fail('Missing page title.');
  if (/<style\b/i.test(html)) fail('Move stylesheet blocks to assets/css/.');

  // Strip script/style bodies and comments, retaining tags for asset checks.
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b([^>]*)>[\s\S]*?<\/\1>/gi, '<$1$2></$1>');
  const tags = [...markup.matchAll(/<[a-z][^>]*>/gi)].map((match) => match[0]);
  const root = tags.find((tag) => /^<html\b/i.test(tag)) ?? '';
  if (getAttribute(root, 'lang') !== language) fail(`Expected document language "${language}".`);
  const meta = tags.filter((tag) => /^<meta\b/i.test(tag));
  if (!meta.some((tag) => getAttribute(tag, 'name') === 'viewport')) fail('Missing viewport metadata.');
  if (!meta.some((tag) => getAttribute(tag, 'name') === 'description' && getAttribute(tag, 'content')?.trim())) {
    fail('Missing page description.');
  }

  const ids = new Set();
  const sectionIds = [];
  for (const tag of tags) {
    if (getAttribute(tag, 'style') !== undefined) fail('Move inline styles to assets/css/.');
    const id = getAttribute(tag, 'id');
    if (id === undefined) continue;
    if (!id || ids.has(id)) fail(`Empty or duplicate id: "${id}".`);
    ids.add(id);
    if (/^<section\b/i.test(tag)) sectionIds.push(id);
  }

  let linksToAlternate = false;
  for (const tag of tags) {
    const href = getAttribute(tag, 'href');
    if (href?.startsWith('#') && href.length > 1 && !ids.has(href.slice(1))) {
      fail(`Broken local reference: ${href}.`);
    }
    for (const name of ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
      const value = getAttribute(tag, name);
      if (!value) continue;
      for (const id of value.trim().split(/\s+/)) {
        if (!ids.has(id)) fail(`Missing ${name} target: ${id}.`);
      }
    }
    if (getAttribute(tag, 'target') === '_blank') {
      const rel = getAttribute(tag, 'rel')?.split(/\s+/) ?? [];
      if (!rel.includes('noopener')) fail(`Missing rel="noopener": ${href}.`);
    }

    // Collect local links and assets, then check shared files once.
    for (const attribute of ['src', 'href', 'poster']) {
      const value = getAttribute(tag, attribute);
      if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value)) continue;
      if (value.startsWith('/')) {
        fail(`Use a relative URL for project-site hosting: ${value}.`);
        continue;
      }
      try {
        const filePath = fileURLToPath(new URL(value, documentUrl));
        const assetPath = relative(rootPath, filePath);
        if (assetPath === '..' || assetPath.startsWith('..' + sep) || isAbsolute(assetPath)) {
          throw new Error('Path is outside the repository');
        }
        const entry = localFiles.get(assetPath) ?? { filePath, documents: new Set() };
        entry.documents.add(filename);
        localFiles.set(assetPath, entry);
        if (attribute === 'href' && /^<a\b/i.test(tag) && assetPath === alternateFilename) {
          linksToAlternate = true;
        }
      } catch (error) {
        fail(`Invalid local file URL: ${value} (${error.message}).`);
      }
    }
  }

  if (!linksToAlternate) fail(`Missing relative language switch link to ${alternateFilename}.`);

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const type = getAttribute('<script ' + match[1] + '>', 'type');
    if (type && !['text/javascript', 'application/javascript'].includes(type)) continue;
    if (match[2].trim()) fail('Move inline JavaScript to assets/js/.');
  }

  return { sectionIds, idCount: ids.size };
}

const vietnamese = await checkDocument('index.html', 'vi', 'en.html');
const english = await checkDocument('en.html', 'en', 'index.html');
if (vietnamese && english && vietnamese.sectionIds.join('\n') !== english.sectionIds.join('\n')) {
  failures.push('index.html and en.html must use the same section IDs in the same order.');
}

for (const [assetPath, { filePath, documents }] of localFiles) {
  try {
    if (!(await stat(filePath)).isFile()) throw new Error('Expected a file');
  } catch (error) {
    failures.push(`${[...documents].join(', ')}: Missing or invalid local file: ${assetPath} (${error.message}).`);
  }
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
  console.log(
    `PASS index.html (${vietnamese.idCount} IDs) and en.html (${english.idCount} IDs): ` +
    `metadata, section parity, local/accessibility references, ${localFiles.size} local files and ${scriptCount} JavaScript files.`,
  );
}
