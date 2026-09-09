import type { CollectionEntry } from 'astro:content';
import { site } from '../config/site';
import type { IconName } from '../components/Icon.astro';

export type Activity = CollectionEntry<'activities'>;
export type Project = CollectionEntry<'projects'>;

/* -------------------------------------------------------------------------- */
/* Activities                                                                  */
/* -------------------------------------------------------------------------- */

export const ACTIVITY_TYPE_META: Record<
  Activity['data']['type'],
  { label: string; icon: IconName }
> = {
  'risc-v-day': { label: 'RISC-V Day', icon: 'pulse' },
  'campus-tour': { label: 'Campus Tour', icon: 'building' },
  workshop: { label: 'Workshop', icon: 'terminal' },
  tutorial: { label: 'Tutorial', icon: 'book-open' },
  seminar: { label: 'Seminar', icon: 'presentation' },
  conference: { label: 'Conference', icon: 'users' },
  other: { label: 'Activity', icon: 'calendar' },
};

const dayFormatter = new Intl.DateTimeFormat(site.intlLocale, {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const dayNoYearFormatter = new Intl.DateTimeFormat(site.intlLocale, {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

/**
 * Human-readable date for an activity, degrading gracefully as detail is lost:
 * explicit label -> exact date (or range) -> year only -> unconfirmed.
 */
export function activityDate(data: Activity['data']): string {
  if (data.dateLabel) return data.dateLabel;

  if (data.date && data.endDate) {
    const sameYear = data.date.getUTCFullYear() === data.endDate.getUTCFullYear();
    const start = sameYear ? dayNoYearFormatter.format(data.date) : dayFormatter.format(data.date);
    return `${start} – ${dayFormatter.format(data.endDate)}`;
  }

  if (data.date) return dayFormatter.format(data.date);
  if (data.year) return String(data.year);
  return 'Date to be confirmed';
}

/** Machine-readable value for `<time datetime>`, when one is available. */
export function activityDateTime(data: Activity['data']): string | undefined {
  if (data.date) return data.date.toISOString().slice(0, 10);
  if (data.year) return String(data.year);
  return undefined;
}

/** Most recent first; entries without any date information are listed last. */
function activitySortKey(data: Activity['data']): number {
  if (data.date) return data.date.getTime();
  if (data.year) return Date.UTC(data.year, 11, 31);
  return Number.NEGATIVE_INFINITY;
}

export function sortActivities(entries: Activity[]): Activity[] {
  return [...entries].sort((a, b) => activitySortKey(b.data) - activitySortKey(a.data));
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                    */
/* -------------------------------------------------------------------------- */

export const PROJECT_CATEGORY_META: Record<
  Project['data']['category'],
  { label: string; icon: IconName; blurb: string }
> = {
  'edge-ai': {
    label: 'AI @ Edge',
    icon: 'chip',
    blurb: 'Reference platforms, accelerator IP and kernels for inference on RISC-V.',
  },
  security: {
    label: 'Security',
    icon: 'shield',
    blurb: 'Cryptographic accelerator IP, secure reference systems and evaluation tooling.',
  },
  infrastructure: {
    label: 'Community Infrastructure',
    icon: 'layers',
    blurb: 'Shared build, test and documentation infrastructure for community projects.',
  },
  education: {
    label: 'Education / Tutorials',
    icon: 'graduation-cap',
    blurb: 'Teaching material, labs and worked examples for students and newcomers.',
  },
};

/**
 * Status is communicated by label first; the colour only reinforces it, so the
 * meaning survives for readers who cannot distinguish the hues.
 */
export const PROJECT_STATUS_META: Record<
  Project['data']['status'],
  { label: string; classes: string; description: string }
> = {
  incubating: {
    label: 'Incubating',
    classes: 'border-accent-300 bg-accent-50 text-accent-700',
    description: 'Scoping and early design; interfaces are expected to change.',
  },
  active: {
    label: 'Active',
    classes: 'border-navy-200 bg-navy-50 text-navy-700',
    description: 'Under active development with usable output.',
  },
  stable: {
    label: 'Stable',
    classes: 'border-emerald-300 bg-emerald-50 text-emerald-800',
    description: 'Released and maintained; suitable for external use.',
  },
  archived: {
    label: 'Archived',
    classes: 'border-line-strong bg-surface-sub text-muted',
    description: 'No longer maintained; kept for reference.',
  },
};

const STATUS_ORDER: Record<Project['data']['status'], number> = {
  active: 0,
  stable: 1,
  incubating: 2,
  archived: 3,
};

export function sortProjects(entries: Project[]): Project[] {
  return [...entries].sort((a, b) => {
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    if (a.data.order !== b.data.order) return a.data.order - b.data.order;
    const status = STATUS_ORDER[a.data.status] - STATUS_ORDER[b.data.status];
    if (status !== 0) return status;
    return a.data.title.localeCompare(b.data.title);
  });
}

/* -------------------------------------------------------------------------- */
/* Shared                                                                      */
/* -------------------------------------------------------------------------- */

/** Drafts are excluded from production builds but stay visible in `astro dev`. */
export function isPublished<T extends { data: { draft: boolean } }>(entry: T): boolean {
  return import.meta.env.DEV || !entry.data.draft;
}
