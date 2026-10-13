/* Données structurées JSON-LD, conformes au contenu visible. */
import type { Data } from './content';
import { plain } from './content';

export const ORG_ID = 'https://leadvice.org/#org';
export const SITE_ID = 'https://leadvice.org/#site';

export function organization(s: Data): Data {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: s.nom,
    legalName: 'Leadvice SARL',
    url: s.url + '/',
    logo: s.url + '/logo-leadvice.png',
    image: s.url + '/og/accueil.png',
    email: s.email,
    description: s.description_courte,
    foundingDate: '2022-01',
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.legal.adresse,
      addressLocality: s.legal.ville,
      addressCountry: 'MA',
    },
    areaServed: { '@type': 'Country', name: 'Maroc' },
    founder: (s.fondatrices as Data[]).map((f) => ({ '@type': 'Person', name: f.nom, sameAs: [f.linkedin] })),
    sameAs: [s.instagram.url, ...(s.fondatrices as Data[]).map((f) => f.linkedin)],
    knowsAbout: ['Stratégie marketing', 'Acquisition client', 'Meta Ads', 'Google Ads', 'Génération de leads', 'Pilotage de la performance'],
  };
}

export function website(s: Data): Data {
  return { '@type': 'WebSite', '@id': SITE_ID, name: s.nom, url: s.url + '/', inLanguage: 'fr-MA', publisher: { '@id': ORG_ID } };
}

export function breadcrumb(items: { name: string; url: string }[]): Data {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: 'https://leadvice.org' + it.url })),
  };
}

export function faqPage(qs: { q: string; a: string | string[] }[]): Data {
  return {
    '@type': 'FAQPage',
    mainEntity: qs.map((x) => ({
      '@type': 'Question',
      name: plain(x.q),
      acceptedAnswer: { '@type': 'Answer', text: plain(Array.isArray(x.a) ? x.a.join(' ') : x.a) },
    })),
  };
}

export function service(name: string, description: string, url: string): Data {
  return {
    '@type': 'Service',
    name,
    description: plain(description),
    url: 'https://leadvice.org' + url,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'Maroc' },
  };
}
