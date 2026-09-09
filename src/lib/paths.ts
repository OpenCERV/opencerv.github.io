/**
 * Base-path aware link helpers.
 *
 * GitHub Pages may serve the site from the domain root (`/`) or from a project
 * subpath (`/my-repo/`). Astro exposes the configured base as
 * `import.meta.env.BASE_URL` but does not rewrite `href` attributes, so every
 * internal link in this project is built with `url()` instead of a bare
 * root-relative string.
 */

const BASE = import.meta.env.BASE_URL;

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** Trim the trailing slash from the configured base ('/' becomes ''). */
function basePrefix(): string {
  return BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
}

/**
 * Resolve an internal path against the configured base.
 * External URLs, `mailto:` links and bare fragments are returned untouched.
 */
export function url(path: string): string {
  if (path === '' || EXTERNAL.test(path) || path.startsWith('#')) return path;
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${basePrefix()}${rel}` || '/';
}

/**
 * Absolute URL for an internal path written *without* the base
 * (e.g. `/og-image.png`), for Open Graph tags and feed links.
 */
export function absoluteUrl(path: string, siteUrl: URL | undefined): string {
  const resolved = url(path);
  if (EXTERNAL.test(resolved)) return resolved;
  if (!siteUrl) return resolved;
  return new URL(resolved, siteUrl).href;
}

/**
 * Absolute URL from a pathname that already carries the base, such as
 * `Astro.url.pathname`. Passing one of those through `absoluteUrl()` would
 * prefix the base a second time.
 */
export function absoluteFromPathname(pathname: string, siteUrl: URL | undefined): string {
  if (!siteUrl) return pathname;
  return new URL(pathname, siteUrl).href;
}

/** Normalise a pathname for comparison: strip the base and any trailing slash. */
export function normalizePath(pathname: string): string {
  const prefix = basePrefix();
  let p = pathname;
  if (prefix && p.startsWith(prefix)) p = p.slice(prefix.length);
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

/**
 * Is `href` the current page, or a section containing it?
 * `/activities` stays highlighted while viewing `/activities/some-event`.
 */
export function isActive(href: string, pathname: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(url(href));
  if (target === '/') return current === '/';
  return current === target || current.startsWith(`${target}/`);
}
