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

export const collections = { site, pages, insights, legal };
