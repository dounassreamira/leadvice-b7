import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* Textes communs (en-tête, pied de page, chiffres, clients, fondatrices) : un fichier YAML par sujet. */
const site = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/site' }),
  schema: z.record(z.string(), z.any()),
});

/* Textes de chaque page : un fichier YAML par page, lu par le gabarit de la page. Aucun texte en dur dans les composants. */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/pages' }),
  schema: z.record(z.string(), z.any()),
});

/* Articles Insights : Markdown, sommaire, temps de lecture et « À lire aussi » calculés au build. */
const insights = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    category: z.enum(['Stratégie', 'Acquisition', 'Création', 'Business']),
    author: z.string().default('Amira Dounassre'),
    excerpt: z.string(),
    answer: z.string().optional(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    levier: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

/* Ressources (lead magnets) : une fiche YAML par ressource, page d'atterrissage /r/<nom>/ non indexée. */
const ressources = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/ressources' }),
  schema: z.object({
    brouillon: z.boolean().default(true),
    format: z.enum(['guides', 'skills', 'lettre']),
    etiquette: z.string(), titre: z.string(), promesse: z.string(),
    points: z.array(z.string()).default([]), bouton: z.string(), couverture: z.string(),
    fichier: z.string().default(''), afficher_dans_ressources: z.boolean().default(true), resume: z.string(),
  }),
});

/* Ateliers : données et textes des deux ateliers interactifs (clients fictifs, options, textes d'interface). */
const ateliers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ateliers' }),
  schema: z.record(z.string(), z.any()),
});

/* Pages légales : Markdown avec dates de mise à jour. */
const legal = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { site, pages, insights, legal, ateliers, ressources };
