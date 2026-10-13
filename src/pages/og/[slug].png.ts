/* Images de partage générées au build : titre de la page sur papier, ligne violette, logo. */
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';
import { ogEntries, type OgEntry } from '../../lib/og';

const font = (w: number): Buffer => fs.readFileSync(`node_modules/@fontsource/schibsted-grotesk/files/schibsted-grotesk-latin-${w}-normal.woff`);
let fonts: { name: string; data: Buffer; weight: 500 | 800; style: 'normal' }[] | null = null;

export const getStaticPaths = (async () => (await ogEntries()).map((e) => ({ params: { slug: e.slug }, props: e }))) satisfies GetStaticPaths;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const e = props as OgEntry;
  fonts ??= [{ name: 'Schibsted', data: font(500), weight: 500, style: 'normal' }, { name: 'Schibsted', data: font(800), weight: 800, style: 'normal' }];
  const size = e.title.length > 60 ? 64 : e.title.length > 36 ? 78 : 96;
  const tree = h('div', { width: 1200, height: 630, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#FBFAFD', padding: '64px 72px 72px', fontFamily: 'Schibsted', position: 'relative' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, fontWeight: 500, letterSpacing: 4, color: '#1E0F52' }, [
      { type: 'svg', props: { width: 44, height: 44, viewBox: '0 0 100 100', children: [{ type: 'rect', props: { width: 100, height: 100, rx: 2, fill: '#301781' } }, { type: 'path', props: { d: 'M29.7 17.1h17.1v51.4h28v13.5H29.7z', fill: '#fff' } }] } },
      'LEADVICE',
    ]),
    h('div', { display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2.4, color: '#1E0F52', maxWidth: 1000 }, e.title),
    { type: 'svg', props: { width: 1056, height: 56, viewBox: '0 0 1056 56', children: [{ type: 'path', props: { d: 'M0 40 C 260 6, 460 56, 680 24 S 960 4, 1056 18', stroke: '#6B4EFF', strokeWidth: 3, fill: 'none' } }] } },
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 24, fontWeight: 500, color: '#5B5770' }, [
      h('div', { display: 'flex' }, e.kicker),
      h('div', { display: 'flex', width: 180, height: 10, background: '#FFC93C' }),
    ]),
  ]);
  // satori attend des éléments au format React ; la structure ci-dessus en suit la forme
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
