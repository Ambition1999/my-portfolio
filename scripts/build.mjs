import { copyFile, mkdir, readdir, realpath, rm } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = await realpath(new URL('../', import.meta.url));
const output = join(root, 'dist');

async function copyAssets(source, destination) {
  // Fresh directories avoid inheriting read-only flags from synced folders on Windows.
  await mkdir(destination);
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyAssets(sourcePath, destinationPath);
    } else if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    } else {
      throw new Error(`Expected a regular public asset: ${relative(root, sourcePath)}`);
    }
  }
}

// Only clear the repository's own output directory, even if dist was replaced by a link.
const resolvedOutput = await realpath(output).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
  return output;
});
if (resolvedOutput !== output) {
  throw new Error('Refusing to clear dist because it resolves to a different path.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output);
await Promise.all([
  copyFile(join(root, 'index.html'), join(output, 'index.html')),
  copyFile(join(root, 'en.html'), join(output, 'en.html')),
  copyAssets(join(root, 'assets'), join(output, 'assets')),
]);

console.log('Built dist/ with index.html, en.html, and assets/.');
