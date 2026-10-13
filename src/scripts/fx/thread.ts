/* Le fil conducteur : une ligne dans la marge gauche, jamais sur le texte. Elle descend du titre de la page
   jusqu'au bandeau violet final, marque chaque chapitre d'un repère qui s'allume et porte une tête lumineuse
   à la hauteur de lecture (55 % de l'écran). */
import type { ScrollTrigger as STType } from 'gsap/ScrollTrigger';
import type { gsap as GsapType } from 'gsap';
import { $, $$ } from '../env';

export function initThread(ST: typeof STType, gsap: typeof GsapType): void {
  const main = $('main');
  if (!main) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'thread');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<defs><clipPath id="thr-clip"><rect id="thr-rect" x="0" y="0" width="100%" height="0"/></clipPath></defs><path class="thr-track"/><path class="thr-done" clip-path="url(#thr-clip)"/><g class="thr-nodes"></g><circle class="thr-head" r="5"/>';
  main.insertBefore(svg, main.firstChild);
  const track = svg.querySelector('.thr-track')!, done = svg.querySelector('.thr-done')!, rect = svg.querySelector('#thr-rect')!, gN = svg.querySelector('.thr-nodes')!, headC = svg.querySelector('.thr-head')!;
  let nodes: { y: number; scene: boolean }[] = [], X0 = 0, AMP = 0, y0 = 0, y1 = 0;
  const xAt = (y: number): number => X0 + Math.sin(y / 420) * AMP + Math.sin(y / 137) * AMP * .25;

  function build(): void {
    const mb = main!.getBoundingClientRect(), H = main!.scrollHeight;
    const gut = parseFloat(getComputedStyle($('.wrap') ?? main!).paddingLeft) || 24;
    X0 = Math.max(6, gut * (gut < 30 ? .36 : .45));
    AMP = Math.min(10, gut * .14);
    svg.setAttribute('viewBox', '0 0 ' + mb.width + ' ' + H);
    svg.style.height = H + 'px';
    svg.style.width = mb.width + 'px';
    const marks = $$('h1, h2, section.scene', main!).filter((e) => !e.closest('.violet, .bk, [data-no-mark]') && e.getBoundingClientRect().height > 0);
    const violet = $('.violet', main!);
    nodes = marks.map((e) => {
      const b = e.getBoundingClientRect(), isScene = e.tagName === 'SECTION';
      return { y: b.top - mb.top + (isScene ? Math.min(b.height, innerHeight) * .5 : b.height * .5), scene: isScene };
    }).sort((a, b) => a.y - b.y);
    if (!nodes.length) return;
    y0 = nodes[0]!.y;
    y1 = violet ? violet.getBoundingClientRect().top - mb.top - 30 : nodes[nodes.length - 1]!.y + 200;
    let d = 'M' + xAt(y0) + ' ' + y0;
    for (let y = y0 + 24; y <= y1; y += 24) d += ' L' + xAt(y).toFixed(1) + ' ' + y;
    d += ' L' + xAt(y1) + ' ' + y1;
    track.setAttribute('d', d);
    done.setAttribute('d', d);
    gN.innerHTML = nodes.map((n) => '<circle cx="' + xAt(n.y) + '" cy="' + n.y + '" r="' + (n.scene ? 6 : 4) + '" class="' + (n.scene ? 'sc' : '') + '"/>').join('') + '<circle class="end" cx="' + xAt(y1) + '" cy="' + y1 + '" r="7"/>';
    draw();
  }
  function draw(): void {
    if (!nodes.length) return;
    const mb = main!.getBoundingClientRect(), head = Math.max(y0, Math.min(y1, -mb.top + innerHeight * .55));
    rect.setAttribute('height', String(head));
    headC.setAttribute('cx', String(xAt(head)));
    headC.setAttribute('cy', String(head));
    gN.querySelectorAll('circle').forEach((c) => c.classList.toggle('on', +(c.getAttribute('cy') ?? 0) <= head + 1));
  }
  ST.addEventListener('refresh', build);
  addEventListener('scroll', draw, { passive: true });
  gsap.ticker.add(draw);
  build();
}
