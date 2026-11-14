/**
 * Every pattern of the theme, described with the helpers of blocks.js.
 *
 * Section patterns can be inserted on any page. Page patterns are whole pages (About, Services,
 * Contact, one per treatment) offered when a new page is created. Hidden patterns hold the texts
 * of the templates, which have to be translatable and so cannot live in the .html files.
 */
const { b, t, th, ta, url, img, space, sides, section, flow, stack, row, grid, columns, column, card, heading, paragraph, eyebrow, lead, small, buttons, button, arrowLink, checks, image, icon } = require('./blocks');
const C = require('./content');

const PHONE = '(217) 555-0142';
const PHONE_LINK = 'tel:+12175550142';
const EMAIL = 'smile@example.com';
const ADDRESS = t('128 Harbor Street, Springfield, IL');
const HOURS = t('Mon–Fri 8am–7pm · Sat 9am–2pm');
const BOOK = '/contact/';
const ICONS = { 'general-dentistry': 'tooth', 'cosmetic-dentistry': 'gem', 'dental-implants': 'implant', 'teeth-whitening': 'sparkle', orthodontics: 'braces', 'emergency-care': 'first-aid' };
const STARS = '★★★★★';

/** Eyebrow, title and optional intro centred above a section. */
const intro = o => flow({ name: 'Intro', className: 'perla-stagger', gap: space('40'), contentSize: o.width || '760px' }, [
  o.eyebrow && eyebrow(t(o.eyebrow), { align: 'center', color: o.dark ? 'secondary' : undefined }),
  heading(t(o.title), { align: 'center', className: 'perla-split', color: o.dark ? 'white' : undefined }),
  o.text && lead(t(o.text), { align: 'center' }),
]);

const stars = (o = {}) => paragraph(STARS, { color: 'star', className: 'perla-stars', typography: { fontSize: o.size || '18px', lineHeight: '1', letterSpacing: '2px' } });

// ---------------------------------------------------------------- home sections

function hero() {
  const infoCard = (iconName, title, text) => row({ name: 'Info', bg: 'white', wrap: false, valign: 'top', gap: space('40'), padding: sides('24px', '28px'), border: { radius: 'var(--wp--custom--radius--medium)' }, shadow: 'soft' }, [
    icon(iconName, { small: true }),
    flow({ gap: '4px' }, [heading(t(title), { level: 3, typography: { fontSize: '18px' } }), small(text)]),
  ]);
  return section({ name: 'Hero', bg: 'tint', className: 'perla-hero', top: 'clamp(40px, 6vw, 88px)', bottom: 'clamp(48px, 7vw, 96px)' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center', className: 'perla-stagger', gap: '24px' }, [
        eyebrow(t('Family dentist in Springfield')),
        heading(t('The dentist you won’t put off visiting.'), { level: 1, size: 'display', className: 'perla-split' }),
        lead(t('A small studio on Harbor Street with four clinicians, long appointments and no lectures. Check-ups, whitening, implants and same-day emergency care, all under one roof.')),
        buttons({}, [button(t('Book a visit'), url(BOOK)), button(t('See our treatments'), url('/services/'), { variant: 'outline' })]),
        row({ name: 'Rating', gap: space('30') }, [stars({ size: '20px' }), small(th('<strong>4.9 out of 5</strong> · from 312 patient reviews'), { color: 'heading' })]),
      ]),
      column({ valign: 'center' }, [image('hero.jpg', { alt: ta('A dentist at work in a bright treatment room'), ratio: '12/13', shadow: 'soft', className: 'perla-image' })]),
    ]),
    grid({ name: 'Quick info', min: '280px', className: 'perla-stagger' }, [
      infoCard('clock', 'Opening hours', HOURS),
      infoCard('phone', 'In pain? Call before 3pm', `<a href="${PHONE_LINK}">${PHONE}</a>`),
      infoCard('pin', 'Find us', ADDRESS),
    ]),
  ]);
}

function stats(o = {}) {
  return section({ name: 'Numbers', bg: o.bg || 'white', small: true }, [
    grid({ name: 'Numbers', min: '240px', gap: space('70'), className: 'perla-stagger' }, C.STATS.map(s => flow({ gap: '6px' }, [
      paragraph(s.number, { className: 'perla-number', color: 'heading' }),
      small(t(s.label)),
    ]))),
  ]);
}

function services(o = {}) {
  return section({ name: 'Treatments', bg: o.bg || 'white' }, [
    intro({ eyebrow: 'What we do', title: 'Most things teeth need, we do here', text: 'No trips across town for the everyday treatments. And if we think someone else would do a better job, we will tell you.' }),
    grid({ name: 'Treatment cards', className: 'perla-stagger' }, C.SERVICES.map(s => card({ spread: true, gap: space('40') }, [
      flow({ gap: space('40') }, [icon(ICONS[s.slug]), heading(t(s.title), { level: 3 }), paragraph(t(s.text))]),
      arrowLink(t('Learn more'), url(`/services/${s.slug}/`)),
    ]))),
    o.cta !== false && buttons({ justify: 'center', className: 'perla-reveal' }, [button(t('All treatments and prices'), url('/services/'), { variant: 'outline' })]),
  ]);
}

function about(o = {}) {
  return section({ name: 'How we work', bg: o.bg || 'tint' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center' }, [image('studio.jpg', { alt: ta('One of our treatment rooms'), ratio: '4/3', className: 'perla-image' })]),
      column({ valign: 'center', className: 'perla-stagger', gap: '20px' }, [
        eyebrow(t('How we work')),
        heading(t('Longer appointments, plainer answers'), { className: 'perla-split' }),
        paragraph(t('Most of what makes a dental visit stressful is not knowing what is coming. So we book 45 minutes for a first visit, show you your X-rays on screen and explain what we see in normal words. Nothing gets done until you have seen the price.')),
        checks([t('Numbing gel before every injection'), t('Digital X-rays and a 3D scanner in the studio'), t('A written quote first, and payment plans of up to 12 months'), t('Open until 7pm on weekdays and on Saturday mornings')]),
        buttons({}, [button(t('Meet the team'), url('/about/')), button(t('Our story'), url('/about/'), { variant: 'outline' })]),
      ]),
    ]),
  ]);
}

function steps(o = {}) {
  return section({ name: 'First visit', bg: o.bg || 'white' }, [
    intro({ eyebrow: 'Your first visit', title: 'What happens when you book', text: 'No forms to print and no surprise bills. This is the whole process.' }),
    grid({ name: 'Steps', className: 'perla-stagger' }, C.STEPS.map(s => card({ bg: 'mist', line: false, gap: '14px' }, [
      paragraph(s.n, { className: 'perla-step-number' }),
      heading(t(s.title), { level: 3 }),
      paragraph(t(s.text)),
    ]))),
  ]);
}

function beforeAfter(o = {}) {
  const shot = (file, label, alt) => b('core/image', { url: img(file), alt: ta(alt), caption: t(label), sizeSlug: 'full', aspectRatio: '4/3', scale: 'cover', className: 'perla-compare' });
  return section({ name: 'Before and after', bg: o.bg || 'mist' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center', width: '42%', className: 'perla-stagger', gap: '20px' }, [
        eyebrow(t('Before and after')),
        heading(t('See the difference for yourself'), { className: 'perla-split' }),
        paragraph(t('At your consultation we can show you more cases like yours, so you know what to expect before you decide anything.')),
        checks([t('Whitening'), t('Veneers and bonding'), t('Clear aligners')]),
        buttons({}, [button(t('See all treatments'), url('/services/'), { variant: 'outline' })]),
      ]),
      column({ valign: 'center', width: '58%' }, [
        columns({ align: null, gap: space('40'), rowGap: space('40'), className: 'perla-reveal', stack: false }, [
          column({}, [shot('smile-before.jpg', 'Before', 'A smile before whitening')]),
          column({}, [shot('smile-after.jpg', 'After', 'The same smile after whitening')]),
        ]),
      ]),
    ]),
  ]);
}

function team(o = {}) {
  return section({ name: 'Team', bg: o.bg || 'white' }, [
    intro({ eyebrow: 'The team', title: 'The people you will meet', text: 'Four clinicians and a front desk that knows your name. Most of us have worked together for more than ten years.' }),
    grid({ name: 'Team members', min: '240px', className: 'perla-stagger' }, C.TEAM.map(m => flow({ gap: '6px' }, [
      // A coloured panel with the initials stands in for the portrait: swap it for an Image block.
      stack({ name: 'Portrait', className: 'perla-portrait', bg: 'tint', justify: 'center', valign: 'center', border: { radius: 'var(--wp--custom--radius--medium)' }, margin: { bottom: '12px' } }, [
        paragraph(m.name.replace(/^Dr\. /, '').split(' ').map(w => w[0]).join(''), { className: 'perla-portrait-initials', color: 'primary' }),
      ]),
      heading(t(m.name), { level: 3 }),
      small(t(m.role), { color: 'primary', typography: { fontWeight: '500' } }),
      small(t(m.bio)),
    ]))),
  ]);
}

function testimonials(o = {}) {
  return section({ name: 'Reviews', bg: o.bg || 'tint' }, [
    intro({ eyebrow: 'What patients say', title: 'In our patients’ words' }),
    grid({ name: 'Reviews', className: 'perla-stagger' }, C.TESTIMONIALS.map(q => card({ spread: true, bg: o.bg === 'white' ? 'mist' : 'white', line: false }, [
      flow({ gap: space('40') }, [stars(), lead(t(`“${q.quote}”`), { color: 'heading' })]),
      row({ name: 'Author', wrap: false, gap: '14px' }, [
        paragraph(q.initials, { className: 'perla-initials' }),
        flow({ gap: '2px' }, [paragraph(`<strong>${t(q.name)}</strong>`, { color: 'heading', typography: { lineHeight: '1.3' } }), small(t(q.detail), { typography: { lineHeight: '1.3' } })]),
      ]),
    ]))),
  ]);
}

/** Cards with the latest posts of the site. */
const postCard = () => b('core/group', { className: 'perla-post-card', style: { spacing: { blockGap: '0' }, border: { radius: 'var(--wp--custom--radius--medium)', width: '1px', color: 'var(--wp--preset--color--line)', style: 'solid' } }, backgroundColor: 'white', layout: { type: 'default' } }, [
  b('core/post-featured-image', { isLink: true, aspectRatio: '16/10', style: { border: { radius: '0px' } } }),
  flow({ gap: '8px', padding: sides('20px', '22px', '22px') }, [
    b('core/post-title', { level: 3, isLink: true, style: { typography: { fontSize: '20px', lineHeight: '1.3' } } }),
    row({ gap: '8px' }, [b('core/post-date'), b('core/post-terms', { term: 'category' })]),
    b('core/post-excerpt', { excerptLength: 22, moreText: ta('Read more') }),
  ]),
]);

const postsGrid = (queryId, query, inner = []) => b('core/query', { queryId, query, align: 'wide' }, [
  b('core/post-template', { className: 'perla-reveal', style: { spacing: { blockGap: space('50') } }, layout: { type: 'grid', minimumColumnWidth: '300px' } }, [postCard()]),
  ...inner,
]);

function latestPosts(o = {}) {
  return section({ name: 'Journal', bg: o.bg || 'white' }, [
    row({ name: 'Journal intro', align: 'wide', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
      flow({ gap: space('40'), className: 'perla-stagger' }, [eyebrow(t('From our journal')), heading(t('Things patients ask us'), { className: 'perla-split' })]),
      buttons({ className: 'perla-reveal' }, [button(t('All articles'), url('/blog/'), { variant: 'outline' })]),
    ]),
    postsGrid(11, { perPage: 3, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: 'exclude', inherit: false }, [
      b('core/query-no-results', {}, [paragraph(t('Your latest posts will be shown here.'), { align: 'center' })]),
    ]),
  ]);
}

function faq(o = {}) {
  return section({ name: 'Questions', bg: o.bg || 'mist' }, [
    columns({}, [
      column({ width: '40%', className: 'perla-stagger', gap: '20px' }, [
        eyebrow(t('Good to know')),
        heading(t('Questions we hear every day'), { className: 'perla-split' }),
        paragraph(t('Can’t find yours? Call the front desk. A real person picks up.')),
        arrowLink(t('Contact us'), url('/contact/')),
      ]),
      column({ width: '60%', className: 'perla-stagger', gap: '12px' }, C.FAQ.map((item, i) => b('core/details', { summary: t(item.q), showContent: i === 0, className: 'is-style-perla-faq' }, [paragraph(t(item.a))]))),
    ]),
  ]);
}

function cta(o = {}) {
  return section({ name: 'Call to action', bg: o.bg || 'mist', small: true, bottom: space('90') }, [
    columns({ valign: 'center', className: 'perla-pop perla-panel', bg: 'dark', padding: sides('clamp(36px, 5vw, 72px)'), border: { radius: 'var(--wp--custom--radius--large)' } }, [
      column({ valign: 'center', width: '66%', className: 'perla-stagger', gap: space('40') }, [
        heading(t(o.title || 'Overdue for a check-up?'), { color: 'white', className: 'perla-split' }),
        lead(t(o.text || 'Most people are. Book online in about a minute, or call and we will find a time that suits you.'), { className: 'perla-on-dark' }),
      ]),
      column({ valign: 'center', width: '34%' }, [
        buttons({ className: 'perla-stagger perla-panel-buttons', gap: '14px' }, [button(t('Book a visit'), url(BOOK), { variant: 'perla-light' }), button(PHONE, PHONE_LINK, { variant: 'perla-ghost' })]),
      ]),
    ]),
  ]);
}

// ---------------------------------------------------------------- inner pages

function story() {
  return section({ name: 'Our story', bg: 'white' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center', className: 'perla-stagger', gap: '20px' }, [
        eyebrow(t('Our story')),
        heading(t('It started with one chair'), { className: 'perla-split' }),
        paragraph(t('Dr. Elena Marsh opened Perla in 2010, in a single rented room above the pharmacy on Harbor Street. The idea was simple: book enough time to actually talk to people.')),
        paragraph(t('We have since moved downstairs and grown to four treatment rooms. Appointments are still longer than they strictly need to be, and the person who answers the phone still knows who you are.')),
        b('core/quote', { citation: t('Dr. Elena Marsh, founder') }, [paragraph(t('“I would rather run ten minutes late than hurry someone out of the chair.”'))]),
        buttons({}, [button(t('Book a visit'), url(BOOK))]),
      ]),
      column({ valign: 'center' }, [image('founder.jpg', { alt: ta('A dentist with a face mask and protective glasses at work'), ratio: '4/3', className: 'perla-image' })]),
    ]),
  ]);
}

function values() {
  const ICON = ['clock', 'bulb', 'award'];
  return section({ name: 'Values', bg: 'mist' }, [
    intro({ eyebrow: 'What guides us', title: 'What we won’t compromise on' }),
    grid({ name: 'Values', className: 'perla-stagger' }, C.VALUES.map((v, i) => card({ line: false }, [icon(ICON[i]), heading(t(v.title), { level: 3 }), paragraph(t(v.text))]))),
  ]);
}

function contact() {
  const line = (iconName, title, text) => row({ name: 'Detail', bg: 'mist', wrap: false, valign: 'top', gap: space('40'), padding: sides('22px', '24px'), border: { radius: 'var(--wp--custom--radius--medium)' } }, [
    icon(iconName, { small: true }),
    flow({ gap: '4px' }, [heading(t(title), { level: 3, typography: { fontSize: '18px' } }), small(text)]),
  ]);
  return section({ name: 'Contact', bg: 'white' }, [
    columns({}, [
      column({ width: '42%', className: 'perla-stagger', gap: space('40') }, [
        line('pin', 'Visit us', ADDRESS),
        line('phone', 'Call us', `<a href="${PHONE_LINK}">${PHONE}</a>`),
        line('mail', 'Email us', `<a href="mailto:${EMAIL}">${EMAIL}</a>`),
        line('clock', 'Opening hours', HOURS),
        small(t('In pain? Call before 3pm and we will see you today. We are closed on Sundays, and there is free parking behind the building.')),
      ]),
      column({ width: '58%' }, [
        card({ name: 'Appointment', line: false, shadow: 'soft', className: 'perla-reveal', padding: sides('clamp(24px, 3.4vw, 44px)'), gap: space('40') }, [
          heading(t('Request an appointment'), { level: 2, typography: { fontSize: 'clamp(24px, 2.2vw, 30px)' } }),
          paragraph(t('Tell us what you need and when you are free. We will call you back to confirm a time.')),
          buttons({}, [button(t('Call the studio'), PHONE_LINK), button(t('Write to us'), `mailto:${EMAIL}`, { variant: 'outline' })]),
          small(t('Would you rather have a form here? Add the form block of your favourite form plugin in place of these buttons.')),
        ]),
      ]),
    ]),
  ]);
}

const treatment = sv => ({
  intro: () => section({ name: 'Treatment', bg: 'white' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center', className: 'perla-stagger', gap: '20px' }, [
        eyebrow(t('Treatments')),
        heading(t(sv.headline), { className: 'perla-split' }),
        lead(t(sv.lead)),
        buttons({}, [button(t('Book a consultation'), url(BOOK)), button(sv.plans ? t('See prices') : t('All treatments'), sv.plans ? '#prices' : url('/services/'), { variant: 'outline' })]),
      ]),
      column({ valign: 'center' }, [image(`${sv.slug}.jpg`, { alt: ta(sv.alt), ratio: '4/3', shadow: 'soft', className: 'perla-image' })]),
    ]),
  ]),
  details: () => section({ name: 'What to expect', bg: 'mist' }, [
    columns({}, [
      column({ width: '60%', className: 'perla-stagger', gap: '20px' }, [
        heading(t('What to expect'), { className: 'perla-split' }),
        ...sv.expect.map(p => paragraph(t(p))),
        heading(t('Common reasons to book'), { level: 3 }),
        checks(sv.reasons.map(r => t(r))),
      ]),
      column({ width: '40%' }, [
        card({ name: 'At a glance', line: false, className: 'perla-reveal', gap: '0' }, [
          heading(t('At a glance'), { level: 3, margin: { bottom: '8px' } }),
          ...sv.facts.map(([k, val]) => row({ className: 'perla-fact', justify: 'space-between', wrap: false, gap: space('40'), padding: { top: '16px', bottom: '16px' } }, [paragraph(t(k)), paragraph(`<strong>${t(val)}</strong>`, { color: 'heading' })])),
          buttons({ margin: { top: '20px' } }, [button(t('Book a consultation'), url(BOOK))]),
        ]),
      ]),
    ]),
  ]),
  pricing: () => section({ name: 'Prices', bg: 'white', anchor: 'prices' }, [
    intro({ eyebrow: 'Prices', title: 'No surprises on your bill', text: 'These are our usual prices. Yours is confirmed in writing after the scan, before any treatment starts.' }),
    grid({ name: 'Plans', className: 'perla-stagger' }, sv.plans.map(pl => card({ spread: true, bg: pl.featured ? 'dark' : 'mist', line: false, shadow: pl.featured ? 'lift' : undefined, className: pl.featured ? 'perla-panel' : undefined }, [
      flow({ gap: space('40') }, [
        heading(t(pl.name), { level: 3, color: pl.featured ? 'white' : undefined }),
        row({ valign: 'bottom', gap: '8px' }, [paragraph(pl.price, { className: 'perla-price', color: pl.featured ? 'white' : 'heading' }), small(t(pl.note), { className: pl.featured ? 'perla-on-dark' : undefined })]),
        checks(pl.items.map(i => t(i)), { color: pl.featured ? 'white' : 'heading' }),
      ]),
      buttons({}, [button(t('Book a visit'), url(BOOK), { variant: pl.featured ? 'perla-light' : 'outline' })]),
    ]))),
  ]),
});

// ---------------------------------------------------------------- header, footer, templates

function header() {
  const light = { size: 'x-small', className: 'perla-on-dark' };
  return [
    section({ name: 'Top bar', tagName: 'div', bg: 'dark', className: 'perla-topbar', top: '9px', bottom: '9px' }, [
      row({ align: 'wide', justify: 'space-between', gap: '6px 24px' }, [
        row({ gap: '6px 24px' }, [paragraph(HOURS, light), paragraph(ADDRESS, { ...light, className: 'perla-on-dark perla-hide-small' })]),
        row({ gap: '6px 24px' }, [paragraph(`<a href="mailto:${EMAIL}">${EMAIL}</a>`, { ...light, className: 'perla-on-dark perla-hide-small' }), paragraph(`<a href="${PHONE_LINK}"><strong>${PHONE}</strong></a>`, light)]),
      ]),
    ]),
    section({ name: 'Navigation bar', tagName: 'div', bg: 'white', className: 'perla-navbar', top: '14px', bottom: '14px' }, [
      row({ align: 'wide', justify: 'space-between', gap: '12px 24px' }, [
        row({ name: 'Logo', wrap: false, gap: '10px' }, [icon('tooth', { className: 'perla-logo-mark' }), b('core/site-title', { level: 0 })]),
        row({ name: 'Menu', wrap: false, gap: '28px' }, [
          b('core/navigation', { overlayMenu: 'mobile', icon: 'menu', layout: { type: 'flex', justifyContent: 'right' }, style: { spacing: { blockGap: '28px' } } }),
          buttons({ className: 'perla-hide-medium' }, [button(t('Book a visit'), url(BOOK))]),
        ]),
      ]),
    ]),
  ];
}

function footer() {
  const title = text => heading(t(text), { level: 2, color: 'white', typography: { fontSize: '15px', letterSpacing: '0.04em', lineHeight: '1.4' } });
  const links = list => flow({ gap: '10px' }, list.map(([label, href]) => small(`<a href="${href}">${label}</a>`, { className: 'perla-on-dark' })));
  return [
    section({ name: 'Footer', bg: 'dark', top: 'clamp(56px, 7vw, 96px)', bottom: '28px', gap: space('80'), className: 'perla-footer' }, [
      grid({ name: 'Footer columns', min: '240px', gap: space('70'), className: 'perla-stagger' }, [
        flow({ gap: '18px' }, [
          row({ name: 'Logo', wrap: false, gap: '10px' }, [icon('tooth', { className: 'perla-logo-mark' }), b('core/site-title', { level: 0, className: 'perla-site-title-light' })]),
          small(t('A small dental studio on Harbor Street, looking after Springfield families since 2010.'), { className: 'perla-on-dark' }),
          b('core/social-links', { className: 'is-style-perla-social', size: 'has-small-icon-size', iconColor: 'white', iconColorValue: '#ffffff', style: { spacing: { blockGap: { left: '10px' } } } }, ['facebook', 'instagram', 'youtube'].map(service => b('core/social-link', { service, url: '#' }))),
        ]),
        flow({ gap: '14px' }, [title('Explore'), links([[t('Home'), url('/')], [t('About us'), url('/about/')], [t('Treatments'), url('/services/')], [t('Journal'), url('/blog/')], [t('Contact'), url('/contact/')]])]),
        flow({ gap: '14px' }, [title('Treatments'), links(C.SERVICES.slice(0, 5).map(sv => [t(sv.title), url(`/services/${sv.slug}/`)]))]),
        flow({ gap: '10px' }, [
          title('Visit us'),
          small(ADDRESS, { className: 'perla-on-dark' }),
          small(HOURS, { className: 'perla-on-dark' }),
          paragraph(`<a href="${PHONE_LINK}"><strong>${PHONE}</strong></a>`, { className: 'perla-footer-phone' }),
          small(`<a href="mailto:${EMAIL}">${EMAIL}</a>`, { className: 'perla-on-dark' }),
        ]),
      ]),
      row({ name: 'Legal', align: 'wide', className: 'perla-legal perla-reveal', justify: 'space-between', gap: '24px', padding: { top: '24px' } }, [
        row({ gap: '6px' }, [small(t('©'), { className: 'perla-on-dark' }), b('core/site-title', { level: 0, isLink: false, className: 'perla-site-title-plain' })]),
        small(`<a href="${url('/privacy-policy/')}">${t('Privacy policy')}</a> · <a href="${url('/terms/')}">${t('Terms')}</a>`, { className: 'perla-on-dark' }),
      ]),
    ]),
  ];
}

/** Soft blue band with a small label and a title, at the top of every inner page. */
const band = inner => section({ name: 'Page header', bg: 'tint', className: 'perla-hero', top: 'clamp(48px, 6vw, 88px)', bottom: 'clamp(48px, 6vw, 88px)' }, [flow({ gap: space('40'), className: 'perla-stagger', contentSize: '820px' }, inner)]);

const blogHeader = () => band([eyebrow(t('Journal'), { align: 'center' }), heading(t('Notes from the studio'), { level: 1, align: 'center', className: 'perla-split' }), lead(t('Short answers to the questions we are asked most, written by the team.'), { align: 'center' })]);

const pagination = () => b('core/query-pagination', { paginationArrow: 'arrow', layout: { type: 'flex', justifyContent: 'center' }, style: { spacing: { margin: { top: space('70') } } } }, [b('core/query-pagination-previous'), b('core/query-pagination-numbers'), b('core/query-pagination-next')]);

const postsLoop = () => section({ name: 'Posts', bg: 'white' }, [
  postsGrid(1, { perPage: 9, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: '', inherit: true }, [
    pagination(),
    b('core/query-no-results', {}, [paragraph(t('Nothing was found here. Try another search, or go back to the home page.'), { align: 'center' })]),
  ]),
]);

const postFooter = () => [
  section({ name: 'Post navigation', bg: 'white', small: true, top: '0px' }, [
    row({ name: 'Previous and next', justify: 'space-between', gap: space('50'), className: 'perla-post-nav' }, [
      b('core/post-navigation-link', { type: 'previous', label: ta('Previous article'), arrow: 'arrow' }),
      b('core/post-navigation-link', { label: ta('Next article'), arrow: 'arrow' }),
    ]),
  ]),
  section({ name: 'More posts', bg: 'mist' }, [
    intro({ eyebrow: 'Keep reading', title: 'More from our journal' }),
    postsGrid(12, { perPage: 3, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: 'exclude', inherit: false }),
  ]),
];

const notFound = () => section({ name: 'Not found', tagName: 'div', bg: 'mist', top: 'clamp(72px, 10vw, 160px)', bottom: 'clamp(72px, 10vw, 160px)' }, [
  flow({ gap: '18px', className: 'perla-stagger', contentSize: '640px' }, [
    paragraph('404', { align: 'center', className: 'perla-404' }),
    heading(t('This page has gone missing'), { level: 1, align: 'center', typography: { fontSize: 'clamp(30px, 3.6vw, 44px)' } }),
    lead(t('The link may be out of date, or the page may have moved. Let’s get you back on track.'), { align: 'center' }),
    buttons({ justify: 'center' }, [button(t('Back to home'), url('/')), button(t('Contact us'), url('/contact/'), { variant: 'outline' })]),
  ]),
]);

const searchHeader = () => band([eyebrow(t('Search'), { align: 'center' }), b('core/query-title', { type: 'search', level: 1, textAlign: 'center' }), b('core/search', { label: ta('Search'), showLabel: false, placeholder: ta('Search the site…'), buttonText: ta('Search'), className: 'perla-search' })]);

// ---------------------------------------------------------------- the list

const ref = slug => b('core/pattern', { slug: `perla/${slug}` });
// `more` adds the pattern to one of the categories WordPress already has, next to "Perla sections".
const sectionPattern = (slug, title, build, keywords = '', more = '') => ({ slug, title, categories: ['perla', more].filter(Boolean).join(', '), keywords, blocks: [build()] });
const pagePattern = (slug, title, blocks, keywords = '') => ({ slug, title, categories: 'perla-pages', keywords, blockTypes: 'core/post-content', postTypes: 'page', blocks });
const hidden = (slug, title, blocks) => ({ slug, title, inserter: false, blocks: [].concat(blocks) });

const PATTERNS = [
  sectionPattern('hero', 'Hero with photo and quick info', hero, 'header, intro, banner', 'banner'),
  sectionPattern('stats', 'Numbers', stats, 'stats, counters, figures'),
  sectionPattern('services', 'Treatment cards', services, 'services, features, cards', 'services'),
  sectionPattern('about', 'Photo and text with checklist', about, 'about, features, image', 'about'),
  sectionPattern('steps', 'Three steps', steps, 'process, how it works'),
  sectionPattern('before-after', 'Before and after', beforeAfter, 'gallery, compare, results'),
  sectionPattern('team', 'Team', team, 'people, staff, doctors', 'team'),
  sectionPattern('testimonials', 'Reviews', testimonials, 'testimonials, quotes, rating', 'testimonials'),
  sectionPattern('latest-posts', 'Latest posts', latestPosts, 'blog, news, query', 'posts'),
  sectionPattern('faq', 'Questions and answers', faq, 'faq, accordion, details'),
  sectionPattern('cta', 'Call to action', cta, 'cta, banner, booking', 'call-to-action'),
  sectionPattern('story', 'Story with quote', story, 'about, history, quote', 'about'),
  sectionPattern('values', 'Three values', values, 'features, cards'),
  sectionPattern('contact', 'Contact details', contact, 'contact, address, phone, hours', 'contact'),
  sectionPattern('pricing', 'Price table', () => treatment(C.SERVICES.find(s => s.plans)).pricing(), 'pricing, plans, table'),

  pagePattern('page-about', 'About', [story(), ref('stats'), values(), ref('team'), ref('testimonials'), cta({ bg: 'white' })], 'about, team'),
  pagePattern('page-services', 'Treatments', [services({ cta: false }), steps({ bg: 'mist' }), beforeAfter({ bg: 'white' }), ref('faq'), ref('cta')], 'services'),
  pagePattern('page-contact', 'Contact', [contact(), ref('faq')], 'contact'),
  ...C.SERVICES.map(sv => { const p = treatment(sv); return pagePattern(`page-${sv.slug}`, `Treatment: ${sv.title}`, [p.intro(), p.details(), sv.plans && p.pricing(), testimonials({ bg: 'white' }), ref('faq'), ref('cta')].filter(Boolean), 'treatment, service'); }),

  { slug: 'header', title: 'Header with top bar', categories: 'header', blockTypes: 'core/template-part/header', blocks: header() },
  { slug: 'footer', title: 'Footer with four columns', categories: 'footer', blockTypes: 'core/template-part/footer', blocks: footer() },
  hidden('blog-header', 'Blog header', blogHeader()),
  hidden('posts-loop', 'Posts of the current page', postsLoop()),
  hidden('post-footer', 'After a post', postFooter()),
  hidden('search-header', 'Search header', searchHeader()),
  hidden('not-found', 'Page not found', notFound()),
];

/** The front page: the sections above, in order. */
const FRONT_PAGE = ['hero', 'stats', 'services', 'about', 'steps', 'before-after', 'team', 'testimonials', 'latest-posts', 'faq', 'cta'];

module.exports = { PATTERNS, FRONT_PAGE, band };
