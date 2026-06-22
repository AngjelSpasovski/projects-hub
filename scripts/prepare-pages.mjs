import { copyFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const outputDirectory = join('dist', 'projects-hub', 'browser');

await copyFile(join(outputDirectory, 'index.html'), join(outputDirectory, '404.html'));
await writeFile(join(outputDirectory, '.nojekyll'), '');

console.log('Prepared GitHub Pages SPA fallback.');
