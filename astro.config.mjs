// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deployment targets are switched here and nowhere else.
 *
 *  A. Organisation site   SITE_URL=https://opencerv.github.io   BASE_PATH=/
 *  B. Project site        SITE_URL=https://opencerv.github.io   BASE_PATH=/<repo-name>
 *  C. Custom domain       SITE_URL=https://<your-domain>        BASE_PATH=/
 *
 * Every internal link in the site goes through `url()` in src/lib/paths.ts,
 * which prefixes `import.meta.env.BASE_URL`, so changing BASE_PATH is enough.
 */
const site = process.env.SITE_URL || 'https://opencerv.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    // /og-card is the source for the social preview image, not a page.
    sitemap({ filter: (page) => !page.includes('/og-card') }),
  ],
  vite: { plugins: [tailwindcss()] },
  // Fonts are resolved from locally installed @fontsource packages and emitted
  // as self-hosted files. `remote: false` keeps the build fully offline and
  // reproducible: no CDN request at build time, no third-party request at runtime.
  fonts: [
    {
      provider: fontProviders.npm({ remote: false }),
      name: 'Inter Variable',
      cssVariable: '--font-inter',
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      options: { package: '@fontsource-variable/inter' },
    },
    {
      provider: fontProviders.npm({ remote: false }),
      name: 'JetBrains Mono Variable',
      cssVariable: '--font-jetbrains',
      weights: ['100 800'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
      options: { package: '@fontsource-variable/jetbrains-mono' },
    },
  ],
});
