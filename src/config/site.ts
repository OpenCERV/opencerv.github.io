/**
 * Central site configuration.
 *
 * This is the only file that needs to change for most content-free updates:
 * naming, navigation, external links and contact routes all live here.
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface ContactChannel {
  label: string;
  description: string;
  href: string;
  external?: boolean;
}

export const site = {
  /** Full name — used in the masthead, page titles and structured data. */
  name: 'CityUHK-EE RISC-V Open Community',
  /** Compact name — used where the full name will not fit. */
  shortName: 'CityUHK-EE RISC-V',
  /** Two-line lockup used in the header and hero. */
  wordmark: { top: 'CityUHK-EE', bottom: 'RISC-V Open Community' },
  headline: 'Open RISC-V Innovation for Edge AI and Security',
  description:
    'An open community connecting research, education, open-source development and the RISC-V ecosystem in Hong Kong. Two technical pillars: Edge AI and Security.',
  locale: 'en',
  /** Used for hreflang/OG locale and date formatting. */
  intlLocale: 'en-HK',

  /** The community open-source organisation. */
  github: {
    org: 'OpenCERV',
    url: 'https://github.com/OpenCERV',
  },

  /** Public registration form only. Keep the private response sheet off the site. */
  registration: {
    formUrl:
      'https://docs.google.com/forms/d/e/1FAIpQLSfO1Bmu-KXRviRkMfHiipIOGuyan2A6zYGMSiGe8ZfB7o37JA/viewform',
  },

  /** Community contact routes, shared by the Join page and site footer. */
  contact: {
    email: 'opencerv@gmail.com',
    /** Optional physical affiliation line, shown in the footer when set. */
    affiliation: 'Department of Electrical Engineering, City University of Hong Kong',
  },

  /**
   * Optional social/ecosystem links rendered in the footer.
   * Add entries only when the account is confirmed to exist.
   */
  social: [] as { label: string; href: string; icon: string }[],
} as const;

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Activities', href: '/activities' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resources', href: '/resources' },
  { label: 'Join Us', href: '/join' },
];

/** Footer link groups. Kept deliberately small. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Community',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Activities', href: '/activities' },
      { label: 'Join Us', href: '/join' },
    ],
  },
  {
    heading: 'Technical',
    items: [
      { label: 'Projects', href: '/projects' },
      { label: 'Resources', href: '/resources' },
      { label: 'OpenCERV on GitHub', href: site.github.url },
    ],
  },
];
