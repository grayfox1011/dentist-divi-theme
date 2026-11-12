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
    build: () => [s.pageHero({ eyebrow: 'About us', title: 'Dentistry with a personal touch', text: 'Meet the people behind the smiles and find out what makes our studio different.' }), s.story(), s.stats({ bg: c('white') }), s.values(), s.team(), s.testimonials(), s.cta()],
  },
  {
    key: 'services', layoutTitle: 'Services', page: { title: 'Services', slug: 'services' },
    build: () => [s.pageHero({ eyebrow: 'Treatments', title: 'Everything your smile needs', text: 'Preventive, restorative and cosmetic dentistry from one experienced team.' }), s.services({ cta: false }), s.steps({ bg: c('white') }), s.smileGallery({ bg: c('mist') }), s.faq({ bg: c('white') }), s.cta()],
  },
  ...C.SERVICES.map(servicePage),
  {
    key: 'blog', layoutTitle: 'Blog', page: { title: 'Blog', slug: 'blog' },
    build: () => [s.pageHero({ eyebrow: 'Journal', title: 'Advice for a healthy smile', text: 'Practical tips and answers to common questions from our dental team.' }), s.blogList(), s.cta()],
  },
  {
    key: 'contact', layoutTitle: 'Contact', page: { title: 'Contact', slug: 'contact' },
    build: () => [s.pageHero({ eyebrow: 'Contact', title: 'Book your visit', text: 'Call, email or send us a message. We will find a time that works for you.' }), s.contactMain(), s.map(), s.faq()],
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

/** Sample articles created on a new site so the blog sections have something to show. */
const POSTS = [
  { title: 'How often should you really visit the dentist?', text: 'Most people benefit from a check-up and professional cleaning every six months. Regular visits let us spot small problems before they become big ones, and keep your gums healthy.', image: 'blog-1.jpg' },
  { title: 'Teeth whitening: what to expect from your first session', text: 'Professional whitening is quick, safe and comfortable. Here is how the treatment works, how long the results last and how to look after your brighter smile.', image: 'blog-2.jpg' },
  { title: 'Five habits for healthier gums', text: 'Healthy gums are the foundation of a healthy smile. A few small changes to your daily routine can make a real difference.', image: 'blog-3.jpg' },
];

module.exports = { PAGES, MENU, THEME, POSTS };
