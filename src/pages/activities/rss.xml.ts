import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../../config/site';
import { activityDate, isPublished, sortActivities } from '../../lib/content';
import { url } from '../../lib/paths';

export const GET: APIRoute = async (context) => {
  const activities = sortActivities((await getCollection('activities')).filter(isPublished));

  return rss({
    title: `${site.name} — Activities`,
    description:
      'RISC-V Days, campus tours, workshops, tutorials and technical seminars from the CityUHK-EE RISC-V Open Community.',
    site: context.site ?? 'https://opencerv.github.io',
    items: activities.map((activity) => ({
      title: activity.data.title,
      // Entries without a confirmed date carry no pubDate rather than a made-up one.
      ...(activity.data.date ? { pubDate: activity.data.date } : {}),
      description: `${activityDate(activity.data)} — ${activity.data.summary}`,
      link: url(`/activities/${activity.id}`),
      categories: activity.data.tags,
    })),
    customData: `<language>en-hk</language>`,
  });
};
