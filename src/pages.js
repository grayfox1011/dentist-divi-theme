/**
 * Page compositions. Each page is an ordered list of sections, plus the details the child
 * theme needs to create it on a site: title, address and (optionally) parent page.
 */
const s = require('./sections');
const C = require('./content');
const { color: c } = require('./tokens');

/** One page per treatment, all built from the same sections. */
const servicePage = sv => ({
  key: `service-${sv.slug}`, layoutTitle: `Service – ${sv.title}`,
  page: { title: sv.title, slug: sv.slug, parent: 'services' },
  build: () => [
    s.serviceHero(sv), s.serviceDetails(sv), sv.plans && s.pricing(sv),
    s.testimonials({ bg: c('white') }), s.faq(), s.cta({ bg: c('mist') }),
  ].filter(Boolean),
});

const PAGES = [
  {
    key: 'home', layoutTitle: 'Home', page: { title: 'Home', slug: 'home', front: true },
    build: () => [s.hero(), s.stats(), s.services(), s.about(), s.steps(), s.smileGallery({ bg: c('mist') }), s.team(), s.testimonials(), s.latestPosts(), s.faq(), s.cta({ bg: c('mist') })],
  },
  {
    key: 'about', layoutTitle: 'About', page: { title: 'About', slug: 'about' },
    build: () => [s.pageHero({ eyebrow: 'About us', title: 'A small studio, on purpose', text: 'Sixteen years, one address and a team that has barely changed. Here is who we are.' }), s.story(), s.stats({ bg: c('white') }), s.values(), s.team(), s.testimonials(), s.cta()],
  },
  {
    key: 'services', layoutTitle: 'Services', page: { title: 'Services', slug: 'services' },
    build: () => [s.pageHero({ eyebrow: 'Treatments', title: 'What we can do for you', text: 'Six kinds of treatment, one team. The prices are a guide: you get an exact quote after your examination.' }), s.services({ cta: false }), s.steps({ bg: c('white') }), s.smileGallery({ bg: c('mist') }), s.faq({ bg: c('white') }), s.cta()],
  },
  ...C.SERVICES.map(servicePage),
  {
    key: 'blog', layoutTitle: 'Blog', page: { title: 'Blog', slug: 'blog' },
    build: () => [s.pageHero({ eyebrow: 'Journal', title: 'Notes from the studio', text: 'Short answers to the questions we are asked most, written by the team.' }), s.blogList(), s.cta()],
  },
  {
    key: 'contact', layoutTitle: 'Contact', page: { title: 'Contact', slug: 'contact' },
    build: () => [s.pageHero({ eyebrow: 'Contact', title: 'Come and see us', text: 'Call, email or use the form. We answer every message within one business day.' }), s.contactMain(), s.map(), s.faq()],
  },
];

/** Pages shown in the main menu, in order. */
const MENU = ['home', 'about', 'services', 'blog', 'contact'];

/** Theme Builder layouts. */
const THEME = {
  header: { title: 'Perla – Global Header', build: s.header },
  footer: { title: 'Perla – Global Footer', build: s.footer },
  post: { title: 'Perla – Blog Post', build: s.postBody },
  notFound: { title: 'Perla – 404 Page', build: s.notFound },
};

module.exports = { PAGES, MENU, THEME, POSTS: C.POSTS };
