/**
 * Headless interaction test for the static web export.
 *
 * Usage:
 *   npm run test:e2e
 *
 * Runs `expo export --platform web` (via the npm script), serves dist/ locally,
 * then drives headless Chrome through the core flow with puppeteer-core:
 *   home -> quest board -> Volleyball detail -> type destination -> Vamanos! -> confirmation
 * Asserting each screen renders its expected content. Exits non-zero on failure.
 */
import http from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import puppeteer from 'puppeteer-core';

const root = new URL('../dist', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf', '.ico': 'image/x-icon', '.json': 'application/json' };

const server = http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let file = join(root, p);
  try { await readFile(file); } catch {
    if (!extname(p)) file = join(root, p + '.html');
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    const data = await readFile(join(root, '+not-found.html'));
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(data);
  }
});
await new Promise((r) => server.listen(8410, r));

const screenshots = new URL('../test-results/', import.meta.url).pathname;
await mkdir(screenshots, { recursive: true });

const chrome = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser = await puppeteer.launch({ executablePath: chrome, args: ['--no-sandbox'] });

function fail(msg) {
  console.error('FAIL:', msg);
  process.exitCode = 1;
}

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  const text = () => page.evaluate(() => document.body.innerText.toLowerCase());
  const clickButton = (label) =>
    page.evaluate((l) => {
      const b = [...document.querySelectorAll('[role="button"]')].find((e) => (e.textContent || '').includes(l));
      if (!b) throw new Error('button not found: ' + l);
      b.click();
    }, label);

  await page.goto('http://localhost:8410/', { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 2000));
  const home = await text();
  if (!home.includes('do nothing') || !home.includes('pau') || !home.includes('demo build')) fail('home content');

  await clickButton('Open the quest board');
  await new Promise((r) => setTimeout(r, 1500));
  const board = await text();
  if (!board.includes('quest board') || !board.includes('volleyball') || !board.includes('starter quests')) fail('board content');

  await clickButton('Volleyball');
  await new Promise((r) => setTimeout(r, 1500));
  const detail = await text();
  if (!detail.includes('volleyball quest')) fail('detail content');

  await page.type('input', 'Ocean Beach');
  await clickButton('Vamanos');
  await new Promise((r) => setTimeout(r, 1500));
  const quest = await text();
  if (!quest.includes('quest saved') || !quest.includes('ocean beach') || !quest.includes('saved on this device')) fail('confirmation content');

  // Saved quest appears on the board and persists across reload.
  await page.goto('http://localhost:8410/explore', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  const boardWithSaved = await text();
  if (!boardWithSaved.includes('my quests') || !boardWithSaved.includes('ocean beach')) fail('saved quest not listed on board');
  const stored = await page.evaluate(() => window.localStorage.getItem('jobless.savedQuests.v1'));
  if (!stored || !stored.includes('Ocean Beach')) fail('quest not in local storage');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  const boardAfterReload = await text();
  if (!boardAfterReload.includes('ocean beach')) fail('saved quest lost after reload');
  await clickButton('Remove');
  await new Promise((r) => setTimeout(r, 800));
  const boardAfterRemove = await text();
  if (boardAfterRemove.includes('ocean beach')) fail('quest still listed after remove');

  // Negative routes must never claim or create a save.
  await page.goto('http://localhost:8410/quest', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Not saved'));
  if ((await text()).includes('saved on this device')) fail('direct /quest claims a save');
  await page.screenshot({ path: join(screenshots, 'no-save.png'), fullPage: true });
  await page.goto('http://localhost:8410/quest?id=made-up', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Not saved'));
  await page.goto('http://localhost:8410/navigation/NotAQuest', { waitUntil: 'networkidle0' });
  await page.waitForFunction(() => document.body.innerText.includes('Quest not found'));
  const invalid = await text();
  if (invalid.includes('where to?') || invalid.includes('vamanos!')) fail('unknown quest exposes save UI');
  const remaining = await page.evaluate(() => window.localStorage.getItem('jobless.savedQuests.v1'));
  if (remaining !== '[]') fail('negative route mutated saved quests');
  await page.screenshot({ path: join(screenshots, 'unknown-quest.png'), fullPage: true });

  // Unknown route renders the not-found screen.
  await page.goto('http://localhost:8410/definitely-not-a-route', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));
  const nf = await text();
  if (!nf.includes('off the map')) fail('not-found content');

  if (!process.exitCode) console.log('e2e-web: all interactions passed');
} finally {
  await browser.close();
  server.close();
  }
