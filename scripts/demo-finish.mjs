// Après un build de démonstration : interdit l'indexation (la démo ne doit jamais concurrencer le vrai site).
import fs from 'node:fs';
fs.writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
fs.rmSync('dist/sitemap-index.xml', { force: true });
for (const f of fs.readdirSync('dist')) if (/^sitemap-\d+\.xml$/.test(f)) fs.rmSync('dist/' + f);
fs.writeFileSync('dist/_headers', '/*\n  X-Robots-Tag: noindex, nofollow\n');
console.log('démo : indexation bloquée');
