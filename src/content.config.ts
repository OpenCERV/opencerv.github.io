import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const ACTIVITY_TYPES = [
  'risc-v-day',
  'campus-tour',
  'workshop',
  'tutorial',
  'seminar',
  'conference',
  'other',
] as const;

export const PROJECT_CATEGORIES = ['edge-ai', 'security', 'infrastructure', 'education'] as const;

export const PROJECT_STATUSES = ['incubating', 'active', 'stable', 'archived'] as const;

const activities = defineCollection({
  loader: glob({ base: './src/content/activities', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),

        /**
         * Chronology is deliberately flexible so that an entry never has to carry
         * an invented date.
         *   - `date` (+ optional `endDate`): the exact date is known.
         *   - `year` only: the entry is placed on the timeline by year.
         *   - `dateLabel`: overrides the rendered string for anything unusual.
         * Entries with none of these are listed last as "Date to be confirmed".
         */
        date: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        year: z.number().int().min(1970).max(2200).optional(),
        dateLabel: z.string().optional(),

        type: z.enum(ACTIVITY_TYPES),
        location: z.string().optional(),
        summary: z.string(),

        /** Real photographs only. Drop a file next to the entry and reference it. */
        cover: image().optional(),
        coverAlt: z.string().optional(),

        featured: z.boolean().default(false),
        organizers: z.array(z.string()).default([]),
        coOrganizers: z.array(z.string()).default([]),

        /** Canonical page for the event, if one exists elsewhere. */
        externalUrl: z.url().optional(),
        links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),

        tags: z.array(z.string()).default([]),

        /**
         * Marks an entry whose details have not been confirmed yet. The detail
         * page then shows a short note inviting contributions instead of
         * presenting an incomplete record as complete.
         */
        detailsPending: z.boolean().default(false),
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.endDate || !!data.date, {
        message: '`endDate` requires `date` to be set as well.',
        path: ['endDate'],
      }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(PROJECT_CATEGORIES),
    status: z.enum(PROJECT_STATUSES),

    /** Omit until the repository actually exists — the card then shows no link. */
    github: z.url().optional(),
    docs: z.url().optional(),

    maintainers: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),

    /**
     * Structural example rather than a real project. Rendered with a visible
     * "Placeholder" badge so nothing on the site reads as a shipped repository.
     */
    placeholder: z.boolean().default(false),

    /** Lower sorts first within a category. */
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { activities, projects };
