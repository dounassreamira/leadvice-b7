// Audit du site en une commande : build, contrôles du HTML (titres, méta, canonical, JSON-LD, liens),
// textes interdits, Lighthouse mobile, axe (clair et sombre), débordements et erreurs console, captures.
// N'affiche que les échecs et les scores.
//   node scripts/audit.mjs                 tout (build compris)
//   node scripts/audit.mjs --no-build      sans rebuild
//   node scripts/audit.mjs --only html,lh  étapes choisies : html, text, lh, axe, shots
//   node scripts/audit.mjs --pages /,/cabinet/   pages choisies
//   node scripts/audit.mjs --shots apercus/phase-1
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execSync } from 'node:child_process';
import zlib from 'node:zlib';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i < 0 ? d : (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true); };
const ONLY = arg('only') ? String(arg('only')).split(',') : ['html', 'text', 'lh', 'axe', 'shots'];
const DIST = path.resolve('dist');
const CHROME = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
const fails = [];
const fail = (where, msg) => fails.push(`${where} : ${msg}`);

if (!argv.includes('--no-build')) {
  console.log('Build…');
  try { execSync('npm run build', { stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { console.log(String(e.stdout).split('\n').filter((l) => /error|warn/i.test(l)).join('\n')); process.exit(1); }
}

/* ---------- pages construites ---------- */
function walk(d, out = []) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p, out); else out.push(p); } return out; }
const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html') && !f.includes(`${path.sep}pagefind${path.sep}`));
const route = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/').replace(/\.html$/, '/');
let pages = htmlFiles.map(route).filter((r) => !r.startsWith('/dev/design/echelle'));
if (arg('pages')) pages = String(arg('pages')).split(',');
const PUBLIC_PAGES = pages.filter((p) => !p.startsWith('/dev/') && !p.startsWith('/admin/'));

/* ---------- serveur statique local ---------- */
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.ico': 'image/x-icon', '.wasm': 'application/wasm', '.pf_meta': 'application/octet-stream', '.pf_fragment': 'application/octet-stream', '.pf_index': 'application/octet-stream', '.pf_filter': 'application/octet-stream' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p.startsWith('/api/')) { res.writeHead(503, { 'Content-Type': 'application/json' }); res.end('{"error":"local"}'); return; }
  let f = path.join(DIST, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (p === '/404/') f = path.join(DIST, '404.html'); // la page 404 elle-même, mesurée comme une page
  if (!fs.existsSync(f)) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end(fs.existsSync(path.join(DIST, '404.html')) ? fs.readFileSync(path.join(DIST, '404.html')) : 'Not found'); return; }
  const type = MIME[path.extname(f)] || 'application/octet-stream';
  // compression comme en production (Cloudflare), pour mesurer les poids réellement transférés
  if (/text|javascript|json|svg|xml/.test(type) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    res.writeHead(200, { 'Content-Type': type, 'Content-Encoding': 'gzip', 'Cache-Control': 'public, max-age=3600' });
    fs.createReadStream(f).pipe(zlib.createGzip({ level: 9 })).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'public, max-age=3600' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(4399, '127.0.0.1', r));
const BASE = 'http://127.0.0.1:4399';

/* ---------- 1. HTML : titre, méta, canonical, OG, JSON-LD, H1, liens internes ---------- */
const titles = new Map(), descs = new Map();
if (ONLY.includes('html')) {
  for (const f of htmlFiles) {
    const r = route(f), html = fs.readFileSync(f, 'utf8');
    if (r === '/404/' || r.startsWith('/dev/design/echelle')) continue;
    const t = html.match(/<title>([^<]*)<\/title>/)?.[1];
    const d = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
    if (!t) fail(r, 'title manquant'); else { if (titles.has(t)) fail(r, `title identique à ${titles.get(t)}`); titles.set(t, r); }
    if (!d) fail(r, 'meta description manquante'); else { if (descs.has(d)) fail(r, `description identique à ${descs.get(d)}`); descs.set(d, r); if (d.length > 170) fail(r, `description longue (${d.length} car.)`); }
    if (!/<link rel="canonical"/.test(html)) fail(r, 'canonical manquant');
    if (!/property="og:image"/.test(html)) fail(r, 'og:image manquant');
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) fail(r, `${h1} H1`);
    if (!/<html lang="fr"/.test(html)) fail(r, 'lang="fr" manquant');
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { fail(r, 'JSON-LD invalide'); } }
    if (!/application\/ld\+json/.test(html)) fail(r, 'JSON-LD manquant');
    const og = html.match(/property="og:image" content="https:\/\/leadvice\.org(\/og\/[^"]+)"/)?.[1];
    if (og && !fs.existsSync(path.join(DIST, og))) fail(r, `image de partage absente ${og}`);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]));
    for (const m of html.matchAll(/\shref="([^"]+)"/g)) {
      const h = m[1].replace(/&amp;/g, '&');
      if (/^(https?:|mailto:|tel:|data:|javascript:)/.test(h)) continue;
      if (h.startsWith('#')) { if (h.length > 1 && !ids.has(h.slice(1))) fail(r, `ancre introuvable ${h}`); continue; }
      const [p0, hash] = h.split('#');
      const p = p0.split('?')[0];
      if (p.startsWith('/api/')) continue; // Pages Functions : absentes du build statique
      let target = path.join(DIST, p);
      if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) { fail(r, `lien cassé ${h}`); continue; }
      if (hash && target.endsWith('.html')) { const th = fs.readFileSync(target, 'utf8'); if (!th.includes(`id="${hash}"`)) fail(r, `ancre introuvable ${h}`); }
    }
  }
  console.log(`HTML : ${htmlFiles.length} pages contrôlées.`);
}

/* ---------- 2. Textes : placeholders, mots bannis, tirets cadratins ---------- */
if (ONLY.includes('text')) {
  const PH = /lorem|\bTODO\b|FIXME|placeholder|À COMPLÉTER|\bXXX\b/i;
  for (const f of walk('src').concat(htmlFiles)) {
    if (!/\.(astro|ts|md|mdx|yaml|css|html)$/.test(f)) continue;
    const s = fs.readFileSync(f, 'utf8');
    s.split('\n').forEach((l, i) => { if (PH.test(l)) fail(path.relative('.', f) + ':' + (i + 1), 'occurrence interdite « ' + l.trim().slice(0, 80) + ' »'); });
  }
  const BANNED = /\b(crucial|cruciale|essentiel|essentielle|fondamental|fondamentale|en somme|booster|synergie|solutions innovantes|360°)\b/i;
  for (const f of htmlFiles) {
    const r = route(f);
    if (r.startsWith('/dev/')) continue;
    const text = fs.readFileSync(f, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ');
    const b = text.match(BANNED); if (b) fail(r, `mot à éviter « ${b[0]} »`);
    const dash = text.match(/.{0,30}[—–].{0,30}/); if (dash) fail(r, `tiret cadratin ou demi-cadratin « ${dash[0].trim()} »`);
    const ag = [...text.matchAll(/.{0,40}\bagences?\b.{0,40}/gi)].map((x) => x[0].trim());
    if (ag.length) console.log(`  (à relire) ${r} « agence » : ${ag.slice(0, 2).join(' | ')}`);
  }
  console.log('Textes : contrôlés.');
}

/* ---------- 3. Lighthouse mobile ---------- */
const scores = [];
if (ONLY.includes('lh')) {
  const { default: lighthouse } = await import('lighthouse');
  const chromeLauncher = await import('chrome-launcher');
  const chrome = await chromeLauncher.launch({ chromePath: CHROME, chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
  const list = arg('lh-pages') ? String(arg('lh-pages')).split(',') : PUBLIC_PAGES;
  for (const p of list) {
    const r = await lighthouse(BASE + p, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false } });
    const c = r.lhr.categories, a = r.lhr.audits;
    const s = { page: p, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100), lcp: a['largest-contentful-paint'].numericValue, cls: a['cumulative-layout-shift'].numericValue, tbt: a['total-blocking-time'].numericValue };
    const js = r.lhr.audits['network-requests']?.details?.items?.filter((x) => x.resourceType === 'Script').reduce((t, x) => t + (x.transferSize || 0), 0) || 0;
    s.js = Math.round(js / 1024);
    s.a11yNotes = Object.values(r.lhr.categories.accessibility.auditRefs).filter((x) => x.weight > 0 && a[x.id].score !== null && a[x.id].score < 1).map((x) => x.id);
    scores.push(s);
    // localhost sans HTTPS ni en-têtes de production : on ne retient pas ces deux contrôles ici
    const bpIgnored = ['is-on-https', 'redirects-http', 'csp-xss', 'uses-http2'];
    const bpReal = Object.values(r.lhr.categories['best-practices'].auditRefs).filter((x) => !bpIgnored.includes(x.id) && x.weight > 0 && a[x.id].score !== null && a[x.id].score < 1).map((x) => x.id);
    if (s.perf < 95) fail(p, `Lighthouse performance ${s.perf} (LCP ${Math.round(s.lcp)} ms, TBT ${Math.round(s.tbt)} ms)`);
    if (s.a11y < 95) fail(p, `Lighthouse accessibilité ${s.a11y} : ${Object.values(r.lhr.categories.accessibility.auditRefs).filter((x) => x.weight > 0 && a[x.id].score === 0).map((x) => x.id).join(', ')}`);
    if (bpReal.length) fail(p, `Lighthouse bonnes pratiques : ${bpReal.join(', ')}`);
    const file = fs.existsSync(path.join(DIST, p, 'index.html')) ? path.join(DIST, p, 'index.html') : path.join(DIST, p.replace(/\/$/, '') + '.html');
    const noindex = fs.readFileSync(file, 'utf8').includes('name="robots" content="noindex');
    const seoFails = Object.values(r.lhr.categories.seo.auditRefs).filter((x) => x.weight > 0 && a[x.id].score === 0).map((x) => x.id).filter((id) => !(noindex && id === 'is-crawlable'));
    if (seoFails.length) fail(p, `Lighthouse SEO ${s.seo} : ${seoFails.join(', ')}`);
    if (s.lcp > 2000) fail(p, `LCP ${Math.round(s.lcp)} ms`);
    if (s.cls > .05) fail(p, `CLS ${s.cls.toFixed(3)}`);
    if (s.js > 80) fail(p, `JS ${s.js} Ko transférés`);
    process.stdout.write('.');
  }
  await chrome.kill();
  console.log('\nLighthouse mobile (perf / a11y / bonnes pratiques / SEO, LCP, CLS, JS) :');
  for (const s of scores) console.log(`  ${s.page.padEnd(52)} ${s.perf} / ${s.a11y} / ${s.bp} / ${s.seo}   LCP ${Math.round(s.lcp)} ms  CLS ${s.cls.toFixed(3)}  JS ${s.js} Ko${s.a11yNotes.length ? '  (a11y : ' + s.a11yNotes.join(', ') + ')' : ''}`);
  fs.mkdirSync('apercus', { recursive: true });
  fs.writeFileSync('apercus/lighthouse.json', JSON.stringify(scores, null, 2));
}

/* ---------- 4. axe, débordements, erreurs console (clair et sombre, 390 et 1440) ---------- */
if (ONLY.includes('axe') || ONLY.includes('shots')) {
  const { chromium } = await import('playwright');
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const browser = await chromium.launch({ executablePath: CHROME });
  const shotsDir = arg('shots');
  for (const theme of ['light', 'dark']) for (const w of [390, 1440]) {
    const mobile = w < 600;
    const ctx = await browser.newContext({ viewport: { width: w, height: mobile ? 844 : 900 }, isMobile: mobile, hasTouch: mobile });
    await ctx.addInitScript((t) => { try { localStorage.setItem('lv-theme', t); localStorage.setItem('lv-consent', JSON.stringify({ mesure: false, pub: false, at: 1 })); } catch {} }, theme);
    for (const p of pages) {
      const page = await ctx.newPage();
      const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error' && !/api\/|503|Failed to load resource/.test(m.text())) errs.push(m.text()); });
      await page.goto(BASE + p, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < H; y += 600) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
      await page.waitForTimeout(400);
      const ov = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (ov > 0) fail(`${p} ${w} ${theme}`, `débordement horizontal ${ov} px`);
      if (errs.length) fail(`${p} ${w} ${theme}`, 'console : ' + errs.slice(0, 2).join(' | '));
      if (ONLY.includes('axe') && (w === 1440 || theme === 'light')) {
        await page.evaluate(() => window.scrollTo(0, 0));
        const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).exclude('canvas').analyze();
        for (const v of res.violations) fail(`${p} ${w} ${theme}`, `axe ${v.id} (${v.nodes.length}) ${v.nodes[0]?.target?.join(' ')}`);
      }
      if (shotsDir && ONLY.includes('shots')) {
        fs.mkdirSync(shotsDir, { recursive: true });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
        const name = (p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'accueil') + `-${w}-${theme}.jpg`;
        const { default: sharp } = await import('sharp');
        const buf = await page.screenshot({ fullPage: true, type: 'png' });
        await sharp(buf, { limitInputPixels: false }).resize({ width: Math.min(w, 720), withoutEnlargement: true }).jpeg({ quality: 62, mozjpeg: true }).toFile(path.join(shotsDir, name));
      }
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();
  console.log('Navigateur : axe, débordements et console contrôlés' + (shotsDir ? `, captures dans ${shotsDir}` : '') + '.');
}

server.close();
if (fails.length) { console.log(`\n${fails.length} échec(s) :`); for (const f of fails) console.log('  ✗ ' + f); process.exitCode = 1; }
else console.log('\nTout passe.');
