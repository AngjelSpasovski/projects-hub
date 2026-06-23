import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const port = 4302;
const baseUrl = `http://127.0.0.1:${port}`;
const outputDir = join(process.cwd(), 'src', 'assets', 'project-screenshots');

const projects = [
  { id: 'tic-tac-toe', route: '/admin/projects/tic-tac-toe' },
  { id: 'calculator', route: '/admin/projects/calculator' },
  { id: 'hang-man', route: '/admin/projects/hang-man' },
  { id: 'weather', route: '/admin/projects/weather' },
  { id: 'music-event', route: '/admin/projects/music-event' }
];

function waitForServer(url, timeoutMs = 120_000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        const response = await fetch(url);

        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Server is still starting.
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(check, 1000);
    };

    check();
  });
}

await mkdir(outputDir, { recursive: true });

const server = spawn('npm.cmd', ['start', '--', '--host', '127.0.0.1', '--port', String(port)], {
  cwd: process.cwd(),
  shell: true,
  stdio: 'inherit',
  windowsHide: true
});

try {
  await waitForServer(baseUrl);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });

  for (const project of projects) {
    await page.goto(`${baseUrl}${project.route}`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'EN', exact: true }).click().catch(() => undefined);

    const main = page.locator('.admin-main');
    await main.screenshot({
      path: join(outputDir, `${project.id}.png`),
      animations: 'disabled'
    });
  }

  await browser.close();
} finally {
  server.kill();
}
