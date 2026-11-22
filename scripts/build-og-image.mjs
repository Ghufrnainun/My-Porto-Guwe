// Renders scripts/og/og.html to public/og-image.png with a local Chrome or Edge, at 2x then scaled to 1200x630.
// scripts/og/ganos-desktop.jpg is a real screenshot of the desktop; retake it when the desktop changes.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((p) => p && existsSync(p));
if (!browser) throw new Error('No Chrome or Edge found; set CHROME_PATH');

const tmp = mkdtempSync(join(tmpdir(), 'og-'));
const shot = join(tmp, 'og@2x.png');
try {
  execFileSync(browser, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=2',
    '--window-size=1200,630',
    '--virtual-time-budget=5000',
    `--user-data-dir=${join(tmp, 'profile')}`,
    `--screenshot=${shot}`,
    pathToFileURL(resolve(root, 'scripts/og/og.html')).href,
  ], { stdio: 'ignore' });
  await sharp(shot).resize(1200, 630).png({ compressionLevel: 9 }).toFile(resolve(root, 'public/og-image.png'));
  console.log('og-image.png written');
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
