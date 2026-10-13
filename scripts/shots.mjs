// Captures d'écran des pages, en clair et en sombre, mobile et ordinateur.
// node scripts/shots.mjs --base http://127.0.0.1:4321 --out apercus/phase-0 --pages /,/expertises/ [--widths 390,1440] [--themes light,dark] [--full]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]?.startsWith('--') || all[i + 1] === undefined ? true : all[i + 1]]] : a), []));
const base = args.base || 'http://127.0.0.1:4321';
const out = args.out || 'apercus/tmp';
const pages = String(args.pages || '/').split(',');
const widths = String(args.widths || '390,1440').split(',').map(Number);
const themes = String(args.themes || 'light,dark').split(',');
const full = args.full !== 'false';
fs.mkdirSync(out, { recursive: true });
const exe = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const browser = await chromium.launch({ executablePath: exe });
const report = [];
for (const theme of themes) for (const w of widths) {
  const mobile = w < 600;
  const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile, reducedMotion: args.rm ? 'reduce' : 'no-preference' });
  await ctx.addInitScript((t) => { try { localStorage.setItem('lv-theme', t); localStorage.setItem('lv-consent', JSON.stringify({ mesure: false, pub: false, at: 1 })); } catch {} }, theme);
  for (const p of pages) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(base + p, { waitUntil: 'networkidle' }).catch((e) => errs.push('goto ' + e.message));
    await page.waitForTimeout(1200);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(70); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(900);
    const name = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'accueil') + `-${w}-${theme}${args.rm ? '-rm' : ''}.jpg`;
    const buf = await page.screenshot({ fullPage: full, type: 'png' });
    // allégées pour le dépôt : 720 px de large au plus pour l'ordinateur
    await sharp(buf, { limitInputPixels: false }).resize({ width: Math.min(w, 720), withoutEnlargement: true }).jpeg({ quality: 62, mozjpeg: true }).toFile(path.join(out, name));
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    report.push({ page: p, w, theme, overflow: ov, errors: errs });
    console.log(name, 'H=' + H, ov ? 'DÉBORDEMENT ' + ov + 'px' : '', errs.length ? 'ERREURS: ' + errs.slice(0, 3).join(' | ') : '');
    await page.close();
  }
  await ctx.close();
}
await browser.close();
fs.writeFileSync(path.join(out, 'rapport.json'), JSON.stringify(report, null, 2));
