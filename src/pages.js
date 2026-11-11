/** Page compositions. Each page is just an ordered list of sections. */
const s = require('./sections');
const { color: c } = require('./tokens');

const PAGES = [
  {
    slug: 'home', title: 'Home',
    build: () => [s.hero(), s.stats(), s.services(), s.about(), s.steps(), s.smileGallery({ bg: c('mist') }), s.team(), s.testimonials(), s.latestPosts(), s.faq(), s.cta({ bg: c('mist') })],
  },
  {
    slug: 'about', title: 'About',
    build: () => [s.pageHero({ eyebrow: 'About us', title: 'Dentistry with a personal touch', text: 'Meet the people behind the smiles and find out what makes our studio different.' }), s.story(), s.stats({ bg: c('white') }), s.values(), s.team(), s.testimonials(), s.cta()],
  },
  {
    slug: 'services', title: 'Services',
    build: () => [s.pageHero({ eyebrow: 'Treatments', title: 'Everything your smile needs', text: 'Preventive, restorative and cosmetic dentistry from one experienced team.' }), s.services({ cta: false }), s.steps({ bg: c('white') }), s.smileGallery({ bg: c('mist') }), s.faq({ bg: c('white') }), s.cta()],
  },
  {
    slug: 'service-single', title: 'Service – Dental Implants',
    build: () => [s.serviceHero(), s.serviceDetails(), s.pricing(), s.testimonials({ bg: c('white') }), s.faq(), s.cta({ bg: c('mist') })],
  },
  {
    slug: 'blog', title: 'Blog',
    build: () => [s.pageHero({ eyebrow: 'Journal', title: 'Advice for a healthy smile', text: 'Practical tips and answers to common questions from our dental team.' }), s.blogList(), s.cta()],
  },
  {
    slug: 'contact', title: 'Contact',
    build: () => [s.pageHero({ eyebrow: 'Contact', title: 'Book your visit', text: 'Call, email or send us a message. We will find a time that works for you.' }), s.contactMain(), s.map(), s.faq()],
  },
];

/** Theme Builder layouts. */
const THEME = {
  header: { title: 'Perla – Global Header', build: s.header },
  footer: { title: 'Perla – Global Footer', build: s.footer },
  post: { title: 'Perla – Blog Post', build: s.postBody },
  notFound: { title: 'Perla – 404 Page', build: s.notFound },
};

module.exports = { PAGES, THEME };
