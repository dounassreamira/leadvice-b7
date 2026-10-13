/* E-mails (Resend) : accusé de réception, confirmation de rendez-vous avec fichier .ics, notification interne. */
import { type Env, mailFrom, mailTo } from './env';

export interface Attachment { filename: string; content: string }
export async function sendMail(env: Env, to: string | string[], subject: string, text: string, html: string, attachments: Attachment[] = [], replyTo?: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: mailFrom(env), to, subject, text, html, attachments: attachments.length ? attachments : undefined, reply_to: replyTo }),
    });
    return r.ok;
  } catch { return false; }
}

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
/** Gabarit HTML sobre aux couleurs du site : papier, encre violette, un bouton violet. */
export function layout(paragraphs: string[], cta?: { label: string; url: string }): string {
  const ps = paragraphs.map((p) => `<p style="margin:0 0 16px;font:16px/1.6 Georgia,serif;color:#1E0F52">${esc(p).replace(/\n/g, '<br>')}</p>`).join('');
  const btn = cta ? `<p style="margin:24px 0"><a href="${esc(cta.url)}" style="display:inline-block;background:#301781;color:#fff;text-decoration:none;font:500 15px Arial,sans-serif;padding:14px 22px;border-radius:2px">${esc(cta.label)}</a></p>` : '';
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#FBFAFD"><div style="max-width:560px;margin:0 auto;padding:32px 24px"><p style="margin:0 0 28px;font:600 14px Arial,sans-serif;letter-spacing:.16em;color:#1E0F52"><span style="display:inline-block;width:18px;height:18px;background:#301781;vertical-align:-3px;margin-right:8px"></span>LEADVICE</p>${ps}${btn}<p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #E2DDF2;font:12px/1.5 Arial,sans-serif;color:#5B5770">Leadvice SARL, Casablanca. leadvice.org</p></div></body></html>`;
}

export function signature(): string {
  return 'À très vite,\nAmira Dounassre et Nada Moujibi\nLeadvice, conseil stratégique & marketing\nleadvice.org';
}

export const internalTo = mailTo;
export { esc };
