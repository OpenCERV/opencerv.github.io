# CityUHK-EE RISC-V Open Community — Website

The website for the **CityUHK-EE RISC-V Open Community**, an open technical community initiated
around the Department of Electrical Engineering at City University of Hong Kong and **CALAS** (the
Architecture Lab for Arithmetic and Security).

The community has two technical pillars — **Edge AI** and **Security** — and publishes its
open-source work under [github.com/OpenCERV](https://github.com/OpenCERV).

A static site: no backend, no database, no runtime secrets.

---

## Stack

| Concern   | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Framework | [Astro](https://astro.build) 7 (static output)                    |
| Styling   | [Tailwind CSS](https://tailwindcss.com) 4 via `@tailwindcss/vite` |
| Content   | Astro Content Collections + Zod schemas                           |
| Language  | TypeScript (strict)                                               |
| Fonts     | Inter + JetBrains Mono, self-hosted via Astro's Fonts API         |
| Icons     | Inline SVG (`src/components/Icon.astro`) — no icon package        |
| Hosting   | GitHub Pages via GitHub Actions                                   |

There is no UI framework (no React/Vue/Svelte) and no client-side router. Two small vanilla scripts
provide progressive enhancement — the mobile navigation and the activity type filter — and both
degrade cleanly with JavaScript disabled.

---

## Local development

Requires **Node 20.19+ / 22+** and **pnpm**.

```bash
pnpm install
pnpm dev          # dev server on http://localhost:4321
```

| Command             | Does                                                 |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Start the dev server                                 |
| `pnpm build`        | Production build into `dist/`                        |
| `pnpm preview`      | Serve the built site locally                         |
| `pnpm check`        | `astro check` — types and template diagnostics       |
| `pnpm format`       | Format with Prettier                                 |
| `pnpm format:check` | Verify formatting (what CI runs)                     |
| `pnpm verify`       | `format:check` + `check` + `build` — run before a PR |

> **TypeScript is pinned to 6.x on purpose.** `astro check` relies on a programmatic API that
> TypeScript 7's native compiler does not expose yet. Do not bump it to 7 until upstream support
> lands.

---

## Directory structure

```
.
├── .github/workflows/
│   ├── deploy.yml            GitHub Pages build + deploy
│   └── ci.yml                Format, type-check and build on every PR
├── public/
│   ├── favicon.svg           Abstract chip mark (not an institutional logo)
│   └── og-image.png          Social preview card — generated, see below
└── src/
    ├── components/
    │   ├── diagrams/         ChipDiagram, FlowDiagram, SkylineMotif
    │   ├── Header · Footer · Hero · PageHeader · Section · SectionHeading
    │   ├── PillarCard · ActivityCard · ProjectCard · EcosystemGroup
    │   ├── CommunityModel · Roadmap · CTA · Button · Badge · Icon
    ├── config/site.ts        ← names, navigation, GitHub org, contact
    ├── content/
    │   ├── activities/       One Markdown file per activity
    │   └── projects/         One Markdown file per project
    ├── content.config.ts     Collection schemas (Zod)
    ├── layouts/BaseLayout.astro   <head>, SEO, structured data, skip link
    ├── lib/
    │   ├── content.ts        Taxonomy labels, sorting, date formatting
    │   └── paths.ts          Base-path-aware link helpers
    ├── pages/                Routes (see below)
    └── styles/global.css     Design tokens + base styles
```

### Routes

```
/                              /activities        /activities/<slug>
/about                         /projects          /projects/<slug>
/resources                     /join              /404
/activities/rss.xml            /robots.txt        /sitemap-index.xml
/og-card                       ← source for public/og-image.png (noindex, not in sitemap)
```

---

## Adding content

### Add an activity

Create `src/content/activities/<slug>.md`. The filename becomes the URL.

```markdown
---
title: Hong Kong RISC-V Day 2026
type: risc-v-day # risc-v-day | campus-tour | workshop | tutorial | seminar | conference | other
summary: One or two sentences shown on the card and in the feed.

# Chronology — use whichever level of detail you actually have:
date: 2026-05-14 # exact date, when known
endDate: 2026-05-15 # optional; requires `date`
# year: 2026            # use instead of `date` when only the year is known
# dateLabel: 'Spring 2026'  # overrides the rendered string entirely

location: City University of Hong Kong
organizers: [CALAS]
coOrganizers: [RIOS]
externalUrl: https://example.org/event
links:
  - label: Slides
    href: https://example.org/slides.pdf
tags: [RISC-V, Hong Kong]
featured: true # surfaces it on the homepage
detailsPending: false # true adds a "details still being compiled" note
draft: false # true hides it from production builds
---

Optional Markdown body.
```

**Do not invent dates, venues, speakers or attendance figures.** The schema is built so an entry can
be published with only a title, type and summary. Set `detailsPending: true` and the page will say
so plainly and invite contributions, which is better than a confident-looking but wrong record.

Entries are sorted newest first; anything with no `date` and no `year` is listed last as
"Date to be confirmed".

**Photographs:** drop the image next to the Markdown file and reference it with
`cover: ./photo.jpg` plus `coverAlt: "..."`. Astro validates and optimises it. Use real photographs
only — a card built from typography is the correct fallback, not a generated image.

### Add a project

Create `src/content/projects/<slug>.md`.

```markdown
---
title: RISC-V Edge AI Reference Platform
summary: One or two sentences shown on the card.
category: edge-ai # edge-ai | security | infrastructure | education
status: incubating # incubating | active | stable | archived
github: https://github.com/OpenCERV/repo # omit until the repository exists
docs: https://…
maintainers: []
tags: [RISC-V, FPGA]
featured: false
placeholder: false # true renders a visible "Placeholder" badge
order: 100 # lower sorts first
draft: false
---
```

The four entries currently in `src/content/projects/` are **placeholders** — they show the shape of
a project page before any repository exists. They carry no `github` link and are visibly badged.
Replace or delete them as real projects are published; once none are placeholders, the notice banner
on `/projects` disappears on its own.

### Change site configuration

Almost everything non-content lives in [`src/config/site.ts`](src/config/site.ts): the community
name, the two-line wordmark, the headline, the meta description, the GitHub organisation,
navigation, footer groups and contact details.

**Contact address.** `site.contact.email` is intentionally empty, because no address has been
confirmed and the site must not show an invented one. Set it and the Join page switches from
"contact us on GitHub" to a real `mailto:` automatically — no other file needs touching.

### Change colours or typography

All design tokens are in the `@theme` block of [`src/styles/global.css`](src/styles/global.css).
Components reference tokens (`bg-crimson-600`, `text-muted`, `border-line`), never raw hex values, so
retuning the palette is a single-file change. Every text/background pair currently in use meets
WCAG AA.

---

## Deployment

### GitHub Pages

1. Push to the `main` branch of the repository under the `OpenCERV` organisation.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes on every push to `main`, and can be run
   manually from the Actions tab.

`pnpm-lock.yaml` is committed — the Astro action detects pnpm from it.

### Switching deployment target

The site never emits a bare root-relative link. Every internal `href` goes through `url()` in
[`src/lib/paths.ts`](src/lib/paths.ts), which prefixes `import.meta.env.BASE_URL`. Changing where the
site is served is therefore a configuration change, not a find-and-replace.

Both values are read from the environment in `astro.config.mjs`, with organisation-site defaults:

| Scenario                                | `SITE_URL`                   | `BASE_PATH` |
| --------------------------------------- | ---------------------------- | ----------- |
| **A.** Organisation site (default)      | `https://opencerv.github.io` | `/`         |
| **B.** Project site `…github.io/<repo>` | `https://opencerv.github.io` | `/<repo>`   |
| **C.** Custom domain                    | `https://your-domain.org`    | `/`         |

To use B or C, set `SITE_URL` and `BASE_PATH` as **repository variables**
(Settings → Secrets and variables → Actions → Variables). The deploy workflow already passes them
through; when unset, the defaults in `astro.config.mjs` apply.

Verify a subpath build locally before switching:

```bash
BASE_PATH=/my-repo pnpm build && pnpm preview
```

### Custom domain

1. Configure DNS with your registrar per GitHub's documentation.
2. Add `public/CNAME` containing a single line with the domain.
3. Set the `SITE_URL` repository variable to `https://your-domain.org` and leave `BASE_PATH` as `/`.

### Regenerating the social preview image

`public/og-image.png` is rendered from `/og-card`, an Astro page that reuses the site's own tokens
and fonts, so the card never drifts from the design:

```bash
pnpm build && pnpm preview &
google-chrome --headless --window-size=1200,630 --hide-scrollbars \
  --screenshot=public/og-image.png http://localhost:4321/og-card
```

Commit the regenerated PNG.

---

## Architecture notes

### Documentation, and a possible future Starlight site

The Resources page is deliberately lightweight: a set of resource areas, each marked _Planned_ until
material actually exists. It is not a documentation system, and should not grow into one.

If project documentation later becomes substantial, add
[Starlight](https://starlight.astro.build) as a **separate section mounted at a subpath** (for
example `/docs`) rather than converting this site. Starlight brings its own layout, navigation and
theme, and merging it into the main site would mean fighting two design systems in one layout tree.
Astro supports running Starlight at a subpath within the same project; nothing in the current
architecture blocks that, and no work here needs undoing first. Until then, keeping Starlight out
avoids a large dependency for a page that currently holds a handful of links.

### Deliberate omissions

- **No dark mode.** The design is committed to a light, print-like surface. Adding a theme toggle
  later means defining the dark half of the tokens in `global.css` and adding one small script.
- **No analytics or third-party requests.** Fonts are self-hosted; nothing is fetched at runtime.
- **No `news` collection.** Activities cover the need today. Adding one later means a third schema in
  `content.config.ts` and a route pair — not a restructure.

---

## Contributing

1. Fork or branch from `main`.
2. Make the change. For content, that is usually one Markdown file.
3. Run `pnpm verify` — this is exactly what CI runs.
4. Open a pull request.

**Content accuracy is the rule that matters most here.** Do not add attendance numbers, partner
counts, repository statistics, speaker names, dates or venues that are not confirmed. The schemas
are designed to let an entry be published without them; an honest gap is better than a plausible
invention. Organisations under _Ecosystem_ are presented as **"Potential Co-organizers & Ecosystem
Links"** and must not be described as formal partners unless that partnership is confirmed.
