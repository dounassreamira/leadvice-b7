// Copie dist/ en un aperçu à liens relatifs (publiable hors domaine) : node scripts/apercu-relatif.mjs <sortie>
// Les appels au back-end (/api/...) restent absolus : dans l'aperçu, la réservation bascule sur son repli.
import fs from 'node:fs';
import path from 'node:path';
const SRC = 'dist', OUT = process.argv[2] || '.apercu';
const SKIP = /^(pagefind|og|admin|dev)(\/|$)/;
fs.rmSync(OUT, { recursive: true, force: true });
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else files.push(path.relative(SRC, p)); } })(SRC);
const fix = (url, depth) => {
  if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/api/')) return url;
  const up = depth ? '../'.repeat(depth) : './';
  let [p, rest = ''] = url.split(/(?=[#?])/);
  if (p.endsWith('/')) p += 'index.html';
  else if (!path.extname(p)) p += '/index.html';
  return up + p.slice(1) + rest;
};
for (const f of files) {
  if (SKIP.test(f)) continue;
  const src = path.join(SRC, f), dst = path.join(OUT, f.replace(/^_astro\//, 'astro/'));
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (f.endsWith('.js')) { fs.writeFileSync(dst, fs.readFileSync(src, 'utf8').replace(/\/?_astro\//g, 'astro/').replace(/return"\/"\+(\w)\}/g, 'return new URL("../"+$1,import.meta.url).href}')); continue; }
  if (!f.endsWith('.html') && !f.endsWith('.css')) { fs.copyFileSync(src, dst); continue; }
  const depth = f.split('/').length - 1;
  let s = fs.readFileSync(src, 'utf8');
  s = s.replace(/(\s(?:href|src|action|poster)=)"(\/[^"]*)"/g, (_, a, u) => `${a}"${fix(u, depth)}"`);
  s = s.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (_, q, u) => `url(${q}${fix(u, depth)}${q})`);
  s = s.replace(/(srcset=")([^"]+)"/g, (_, a, v) => a + v.split(',').map((x) => { const [u, w] = x.trim().split(/\s+/); return fix(u, depth) + (w ? ' ' + w : ''); }).join(', ') + '"');
  s = s.replace(/_astro\//g, 'astro/');
  fs.writeFileSync(dst, s);
}
console.log('aperçu :', OUT);
