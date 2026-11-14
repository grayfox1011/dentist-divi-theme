/** Reusable page sections, composed from the module factories in ui.js. */
const u = require('./ui');
const { color: c, v, fontRef, dynamic } = require('./tokens');
const ph = require('./placeholders');
const { photo } = require('./photos');
const C = require('./content');

const { resp, box } = u;
const STARS = '<p>★★★★★</p>';

/** Centered "eyebrow + title + intro" block used at the top of most sections. */
function intro(o) {
  const align = o.align || 'center';
  return u.row({ cols: 1, label: 'Section intro', maxWidth: o.maxWidth || '760px' }, [
    u.col({ gap: '16px', align: align === 'center' ? 'center' : undefined, motion: 'stagger' }, [
      o.eyebrow && u.eyebrow(o.eyebrow, { align, color: o.dark ? c('secondary') : undefined }),
      u.heading(o.title, { align, color: o.dark ? c('white') : undefined }),
      o.text && u.lead(`<p>${o.text}</p>`, { align, color: o.dark ? c('white', 78) : undefined }),
    ]),
  ]);
}

function hero() {
  return u.section({ label: 'Hero', bg: c('tint'), motion: 'hero', padding: { top: 'clamp(40px, 6vw, 88px)', bottom: 'clamp(48px, 7vw, 96px)' } }, [
    u.row({ cols: 2, align: 'center', tablet: 'keep', label: 'Hero content' }, [
      u.col({ gap: '24px', justify: 'center', motion: 'stagger' }, [
        u.eyebrow('Family dentist in Springfield'),
        u.display('The dentist you won’t put off visiting.'),
        u.lead('<p>A small studio on Harbor Street with four clinicians, long appointments and no lectures. Check-ups, whitening, implants and same-day emergency care, all under one roof.</p>', { mod: { maxWidth: '540px' } }),
        u.group({ direction: 'row', wrap: 'wrap', gap: '12px', label: 'Buttons', mod: { margin: { top: '8px' } } }, [
          u.button(v('bookLabel'), v('bookUrl')),
          u.button('See our treatments', '/services/', { variant: 'outline' }),
        ]),
        u.group({ direction: 'row', align: 'center', gap: '12px', label: 'Rating', mod: { margin: { top: '12px' } } }, [
          u.text(STARS, { size: '20px', color: c('star'), lineHeight: '1em' }),
          u.small('<p><strong>4.9 out of 5</strong> · from 312 Google reviews</p>', { color: c('heading') }),
        ]),
      ]),
      u.col({}, [u.image(photo('hero'), { alt: 'Dr. Marsh showing a patient his X-ray on a tablet', shadow: 'soft', motion: 'image' })]),
    ]),
    u.grid({ count: resp('3', '1', '1'), label: 'Quick info' }, [
      // Each card shows one variable of the Variable Manager, so the details are changed in one place.
      infoCard('&#xf017;', 'Opening hours', v('hours')),
      infoCard('&#xf095;', 'In pain? Call before 3pm', v('phone')),
      infoCard('&#xf3c5;', 'Find us', v('address')),
    ]),
  ]);
}

function infoCard(icon, title, text) {
  return u.card({ mod: { shadow: 'soft', border: { width: '0px', color: c('white') }, padding: box('24px', '28px') } }, [
    u.blurb({ icon, title, text, placement: 'left', titleSize: '18px', textSize: v('small'), iconPad: '14px', iconSize: '20px' }),
  ]);
}

/** Round badge with the initials of a reviewer: no photo to find, nobody's face to ask for. */
function avatar(initials) {
  return u.text(`<p>${initials}</p>`, { family: fontRef('heading'), size: '15px', weight: '700', color: c('primary'), lineHeight: '52px', align: 'center', mod: { bg: c('tint'), radius: '100px', width: '52px', height: '52px' } });
}

function stats(o = {}) {
  return u.section({ label: 'Stats', bg: o.bg || c('white'), padding: { top: v('sectionYSmall'), bottom: v('sectionYSmall') } }, [
    u.grid({ count: resp('4', '2', '2'), label: 'Numbers', gap: 'clamp(24px, 4vw, 56px)' }, C.STATS.map(s =>
      u.col({ gap: '0px' }, [u.counter(s.number, s.label)]))),
  ]);
}

function services(o = {}) {
  const list = o.limit ? C.SERVICES.slice(0, o.limit) : C.SERVICES;
  return u.section({ label: 'Services', bg: o.bg || c('white') }, [
    intro({ eyebrow: 'What we do', title: 'Most things teeth need, we do here', text: 'No trips across town for the everyday treatments. And if we think someone else would do a better job, we will tell you.' }),
    u.grid({ count: resp('3', '2', '1'), label: 'Service cards' }, list.map(s =>
      u.card({ gap: '18px', mod: { bg: c('white'), shadowHover: 'soft' } }, [
        u.blurb({ icon: s.icon, title: s.title, text: s.text }),
        u.linkButton('Learn more', `/services/${s.slug}/`),
      ]))),
    o.cta !== false && u.row({ cols: 1, label: 'All services', motion: 'reveal' }, [u.col({ align: 'center' }, [u.button('All treatments and prices', '/services/', { variant: 'outline', align: 'center' })])]),
  ]);
}

function about(o = {}) {
  const media = u.col({}, [u.image(photo('studio'), { alt: 'One of our four treatment rooms', motion: 'image' })]);
  const copy = u.col({ gap: '20px', justify: 'center', motion: 'stagger' }, [
    u.eyebrow('How we work'),
    u.heading('Longer appointments, plainer answers'),
    u.text('<p>Most of what makes a dental visit stressful is not knowing what is coming. So we book 45 minutes for a first visit, show you your X-rays on screen and explain what we see in normal words. Nothing gets done until you have seen the price.</p>'),
    u.iconList(['Numbing gel before every injection', 'Digital X-rays and a 3D scanner in the studio', 'A written quote first, and payment plans of up to 12 months', 'Open until 7pm on weekdays and on Saturday mornings']),
    u.group({ direction: 'row', wrap: 'wrap', align: 'center', gap: '20px', mod: { margin: { top: '8px' } } }, [u.button('Meet the team', '/about/'), u.linkButton('Our story', '/about/')]),
  ]);
  return u.section({ label: 'About', bg: o.bg || c('tint') }, [u.row({ cols: 2, align: 'center', tablet: 'keep', label: 'About content' }, o.reverse ? [copy, media] : [media, copy])]);
}

function steps(o = {}) {
  return u.section({ label: 'How it works', bg: o.bg || c('white') }, [
    intro({ eyebrow: 'Your first visit', title: 'What happens when you book', text: 'No forms to print and no surprise bills. This is the whole process.' }),
    u.grid({ count: resp('3', '1', '1'), label: 'Steps' }, C.STEPS.map(s =>
      u.card({ gap: '14px', mod: { bg: c('mist'), border: { width: '0px', color: c('mist') } } }, [
        u.heading(s.n, { level: 'h3', size: '44px', weight: '800', color: c('primary', 30), lineHeight: '1em' }),
        u.h3(s.title),
        u.text(`<p>${s.text}</p>`),
      ]))),
  ]);
}

function team(o = {}) {
  return u.section({ label: 'Team', bg: o.bg || c('white') }, [
    intro({ eyebrow: 'The team', title: 'The people you will meet', text: 'Four clinicians and a front desk that knows your name. Most of us have worked together for more than ten years.' }),
    u.grid({ count: resp('4', '2', '2'), label: 'Team members' }, C.TEAM.map(m =>
      u.col({ gap: '6px' }, [
        u.image(photo(m.photo), { alt: `${m.name}, ${m.role.toLowerCase()}`, radius: v('radiusM'), margin: { bottom: '12px' } }),
        u.h3(m.name),
        u.small(`<p>${m.role}</p>`, { color: c('primary'), weight: '500' }),
        u.small(`<p>${m.bio}</p>`, { mod: { margin: { top: '6px' } } }),
      ]))),
  ]);
}

function testimonials(o = {}) {
  return u.section({ label: 'Testimonials', bg: o.bg || c('tint') }, [
    intro({ eyebrow: 'What patients say', title: 'In our patients’ words' }),
    u.grid({ count: resp('3', '1', '1'), label: 'Reviews' }, C.TESTIMONIALS.map(t =>
      u.card({ gap: '16px', justify: 'space-between', mod: o.bg ? { bg: c('mist'), border: { width: '0px', color: c('mist') } } : { border: { width: '0px', color: c('white') } } }, [
        u.text(STARS, { size: '18px', color: c('star'), lineHeight: '1em' }),
        u.text(`<p>“${t.quote}”</p>`, { color: c('heading'), size: v('lead'), lineHeight: '1.6em' }),
        u.group({ direction: 'row', align: 'center', gap: '14px', mod: { margin: { top: '8px' } } }, [
          avatar(t.initials),
          u.group({ gap: '2px' }, [u.text(`<p><strong>${t.name}</strong></p>`, { color: c('heading'), lineHeight: '1.3em' }), u.small(`<p>${t.detail}</p>`, { lineHeight: '1.3em' })]),
        ]),
      ]))),
  ]);
}

function smileGallery(o = {}) {
  return u.section({ label: 'Smile gallery', bg: o.bg || c('white') }, [
    u.row({ cols: 2, align: 'center', tablet: 'keep', label: 'Before and after' }, [
      u.col({ gap: '20px', justify: 'center', motion: 'stagger' }, [
        u.eyebrow('Before and after'),
        u.heading('See the difference for yourself'),
        u.text('<p>Drag the slider to compare. At your consultation we can show you more cases like yours, so you know what to expect before you decide anything.</p>'),
        u.iconList(['Whitening', 'Veneers and bonding', 'Clear aligners']),
        u.button('See all treatments', '/services/', { variant: 'outline', mod: { margin: { top: '8px' } } }),
      ]),
      u.col({}, [u.beforeAfter(photo('smileBefore'), photo('smileAfter'), { motion: 'reveal', beforeAlt: 'A smile before whitening', afterAlt: 'The same smile after whitening' })]),
    ]),
  ]);
}

function latestPosts(o = {}) {
  return u.section({ label: 'Blog', bg: o.bg || c('white') }, [
    u.row({ cols: '2_3,1_3', align: 'flex-end', tablet: 'keep', tabletTypes: ['16_24', '8_24'], label: 'Blog intro' }, [
      u.col({ gap: '16px', motion: 'stagger' }, [u.eyebrow('From our journal'), u.heading('Things patients ask us')]),
      u.col({ align: 'flex-end', motion: 'reveal' }, [u.button('All articles', '/blog/', { variant: 'outline', align: resp('right', 'right', 'left') })]),
    ]),
    u.row({ cols: 1, label: 'Posts' }, [u.col({}, [u.blog({ number: 3, motion: 'reveal' })])]),
  ]);
}

function faq(o = {}) {
  return u.section({ label: 'FAQ', bg: o.bg || c('mist') }, [
    u.row({ cols: '2_5,3_5', label: 'FAQ content' }, [
      u.col({ gap: '20px', motion: 'stagger' }, [
        u.eyebrow('Good to know'),
        u.heading('Questions we hear every day'),
        u.text('<p>Can’t find yours? Call the front desk. A real person picks up.</p>'),
        u.linkButton('Contact us', '/contact/'),
      ]),
      u.col({}, [u.accordion(o.items || C.FAQ, { motion: 'stagger' })]),
    ]),
  ]);
}

/** Dark call-to-action panel that closes most pages. */
function cta(o = {}) {
  return u.section({ label: 'Call to action', bg: o.bg || c('white'), padding: { top: v('sectionYSmall'), bottom: v('sectionY') } }, [
    u.row({ cols: '2_3,1_3', align: 'center', label: 'CTA panel', motion: 'pop', mod: { bg: c('dark'), radius: v('radiusL'), padding: box('clamp(36px, 5vw, 72px)') } }, [
      u.col({ gap: '16px', motion: 'stagger' }, [
        u.heading(o.title || 'Overdue for a check-up?', { color: c('white') }),
        u.lead(`<p>${o.text || 'Most people are. Book online in about a minute, or call and we will find a time that suits you.'}</p>`, { color: c('white', 78) }),
      ]),
      u.col({ gap: '14px', align: resp('flex-end', 'flex-start', 'flex-start'), motion: 'stagger' }, [
        u.button(v('bookLabel'), v('bookUrl'), { variant: 'light' }),
        u.button(v('phone'), v('phoneUrl'), { variant: 'ghost' }),
      ]),
    ]),
  ]);
}


// ---------------------------------------------------------------- inner pages

/** Compact page header used on every inner page. */
function pageHero(o) {
  return u.section({ label: 'Page header', bg: c('tint'), motion: 'hero', padding: { top: 'clamp(48px, 6vw, 88px)', bottom: 'clamp(48px, 6vw, 88px)' } }, [
    u.row({ cols: 1, label: 'Page title', maxWidth: '820px' }, [
      u.col({ gap: '16px', align: 'center', motion: 'stagger' }, [
        u.eyebrow(o.eyebrow, { align: 'center' }),
        u.display(o.title, { size: 'clamp(34px, 4.6vw, 58px)', align: 'center' }),
        o.text && u.lead(`<p>${o.text}</p>`, { align: 'center' }),
      ]),
    ]),
  ]);
}

function story() {
  return u.section({ label: 'Our story', bg: c('white') }, [
    u.row({ cols: 2, align: 'center', tablet: 'keep', label: 'Story' }, [
      u.col({ gap: '20px', justify: 'center', motion: 'stagger' }, [
        u.eyebrow('Our story'),
        u.heading('It started with one chair'),
        u.text('<p>Dr. Elena Marsh opened Perla in 2010, in a single rented room above the pharmacy on Harbor Street. The idea was simple: book enough time to actually talk to people.</p><p>We have since moved downstairs and grown to four treatment rooms. Appointments are still longer than they strictly need to be, and the person who answers the phone still knows who you are.</p>'),
        u.group({ gap: '8px', label: 'Quote', mod: { padding: { left: '20px' }, border: { left: { width: '3px', color: c('secondary') } }, margin: { top: '4px' } } }, [
          u.text('<p>“I would rather run ten minutes late than hurry someone out of the chair.”</p>', { family: fontRef('heading'), size: v('lead'), weight: '600', color: c('heading'), lineHeight: '1.5em' }),
          u.small('<p>Dr. Elena Marsh, founder</p>'),
        ]),
        u.button(v('bookLabel'), v('bookUrl'), { mod: { margin: { top: '8px' } } }),
      ]),
      u.col({}, [u.image(photo('team'), { alt: 'Dr. Okafor and Dr. Marsh looking at a treatment plan', motion: 'image' })]),
    ]),
  ]);
}

function values() {
  return u.section({ label: 'Values', bg: c('mist') }, [
    intro({ eyebrow: 'What guides us', title: 'What we won’t compromise on' }),
    u.grid({ count: resp('3', '1', '1'), label: 'Values' }, C.VALUES.map(i => u.card({ mod: { border: { width: '0px', color: c('white') } } }, [u.blurb(i)]))),
  ]);
}

function contactMain() {
  const info = [
    { icon: '&#xf3c5;', title: 'Visit us', text: v('address') },
    { icon: '&#xf095;', title: 'Call us', text: v('phone') },
    { icon: '&#xf0e0;', title: 'Email us', text: v('email') },
    { icon: '&#xf017;', title: 'Opening hours', text: v('hours') },
  ];
  return u.section({ label: 'Contact', bg: c('white') }, [
    u.row({ cols: '2_5,3_5', label: 'Contact content' }, [
      u.col({ gap: '16px', motion: 'stagger' }, [
        ...info.map(i => u.blurb({ ...i, placement: 'left', titleSize: '18px', textSize: v('small'), iconPad: '14px', iconSize: '20px', mod: { bg: c('mist'), radius: v('radiusM'), padding: box('22px', '24px') } })),
        u.small('<p>In pain? Call before 3pm and we will see you today. We are closed on Sundays, and there is free parking behind the building.</p>', { mod: { margin: { top: '8px' } } }),
      ]),
      u.card({ gap: '8px', label: 'Appointment form', motion: 'reveal', mod: { shadow: 'soft', border: { width: '0px', color: c('white') }, padding: box('clamp(24px, 3.4vw, 44px)') } }, [
        u.h3('Request an appointment', { size: 'clamp(24px, 2.2vw, 30px)' }),
        u.text('<p>Tell us what you need and when you are free. We will call you back to confirm a time.</p>', { mod: { margin: { bottom: '12px' } } }),
        u.contactForm([
          { id: 'name', label: 'Full name', half: true },
          { id: 'phone', label: 'Phone number', half: true },
          { id: 'email', label: 'Email address', type: 'email' },
          { id: 'preferred_time', label: 'Preferred day and time', required: false },
          { id: 'message', label: 'How can we help?', type: 'text', required: false },
        ], { button: 'Request appointment' }),
      ]),
    ]),
  ]);
}

/** Keyless Google Maps embed. Change the address in the "q=" parameter. */
function map() {
  const iframe = '<iframe src="https://www.google.com/maps?q=Springfield,+IL&z=13&output=embed" width="100%" height="440" style="border:0;display:block;border-radius:28px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map showing our location"></iframe>';
  return u.section({ label: 'Map', bg: c('white'), padding: { top: '0px', bottom: v('sectionY') } }, [
    u.row({ cols: 1, label: 'Map' }, [u.col({ motion: 'reveal', mod: { radius: v('radiusL'), overflow: 'hidden' } }, [u.code(iframe)])]),
  ]);
}

function blogList() {
  return u.section({ label: 'Articles', bg: c('white') }, [
    u.row({ cols: 1, label: 'Posts' }, [u.col({}, [u.blog({ number: 9, pagination: true, motion: 'reveal' })])]),
  ]);
}

// ---------------------------------------------------------------- single service

function serviceHero(sv) {
  return u.section({ label: 'Service header', bg: c('tint'), motion: 'hero', padding: { top: 'clamp(40px, 6vw, 88px)', bottom: 'clamp(48px, 6vw, 88px)' } }, [
    u.row({ cols: 2, align: 'center', tablet: 'keep', label: 'Service intro' }, [
      u.col({ gap: '20px', justify: 'center', motion: 'stagger' }, [
        u.eyebrow(`Treatments · ${sv.title}`),
        u.display(sv.headline, { size: 'clamp(34px, 4.6vw, 58px)' }),
        u.lead(`<p>${sv.lead}</p>`),
        u.group({ direction: 'row', wrap: 'wrap', align: 'center', gap: '20px', mod: { margin: { top: '8px' } } }, [
          u.button('Book a consultation', v('bookUrl')),
          sv.plans ? u.linkButton('See pricing', '#pricing') : u.linkButton('All treatments', '/services/'),
        ]),
      ]),
      u.col({}, [u.image(photo(sv.photo), { alt: sv.alt, shadow: 'soft', motion: 'image' })]),
    ]),
  ]);
}

function serviceDetails(sv) {
  return u.section({ label: 'Service details', bg: c('white') }, [
    u.row({ cols: '3_5,2_5', label: 'Details' }, [
      u.col({ gap: '20px', motion: 'stagger' }, [
        u.heading('What to expect'),
        u.text(sv.expect.map(p => `<p>${p}</p>`).join('')),
        u.h3('Common reasons to book', { mod: { margin: { top: '12px' } } }),
        u.iconList(sv.reasons),
      ]),
      u.card({ gap: '0px', label: 'At a glance', motion: 'reveal', mod: { bg: c('mist'), border: { width: '0px', color: c('mist') }, padding: box('clamp(24px, 3vw, 40px)') } }, [
        u.h3('At a glance', { mod: { margin: { bottom: '8px' } } }),
        ...sv.facts.map(([k, val], i) => u.group({ direction: 'row', justify: 'space-between', align: 'center', gap: '16px', mod: { width: '100%', padding: { top: '16px', bottom: '16px' }, border: i < sv.facts.length - 1 ? { bottom: { width: '1px', color: c('line') } } : undefined } }, [
          u.text(`<p>${k}</p>`), u.text(`<p><strong>${val}</strong></p>`, { color: c('heading') }),
        ])),
        u.button('Book a consultation', v('bookUrl'), { mod: { margin: { top: '20px' } } }),
      ]),
    ]),
  ]);
}

function pricing(sv) {
  return u.section({ label: 'Pricing', bg: c('mist'), anchor: 'pricing' }, [
    intro({ eyebrow: 'Prices', title: 'No surprises on your bill', text: 'These are our usual prices. Yours is confirmed in writing after the scan, before any treatment starts.' }),
    u.grid({ count: resp('3', '1', '1'), label: 'Plans', align: 'stretch' }, sv.plans.map(pl =>
      u.card({ gap: '16px', mod: pl.featured ? { bg: c('dark'), border: { width: '0px', color: c('dark') }, shadow: 'lift' } : { border: { width: '0px', color: c('white') } } }, [
        u.h3(pl.name, { color: pl.featured ? c('white') : undefined }),
        u.group({ direction: 'row', align: 'baseline', gap: '8px' }, [
          u.heading(pl.price, { level: 'h4', size: 'clamp(34px, 3.4vw, 44px)', weight: '800', color: pl.featured ? c('white') : undefined }),
          u.small(`<p>${pl.note}</p>`, { color: pl.featured ? c('white', 70) : undefined }),
        ]),
        u.iconList(pl.items, { color: pl.featured ? c('white') : undefined, weight: '400', mod: { margin: { top: '4px', bottom: '8px' } } }),
        u.button(v('bookLabel'), v('bookUrl'), { variant: pl.featured ? 'light' : 'outline' }),
      ]))),
  ]);
}

// ---------------------------------------------------------------- theme builder

function logo(o = {}) {
  return u.group({ direction: 'row', align: 'center', gap: '10px', label: 'Logo', link: dynamic('home_url') }, [
    u.icon('&#xf5c9;', { color: c('white'), size: '18px', badge: c('primary'), badgePad: '11px', badgeRadius: '12px', alignSelf: 'center' }),
    u.text(v('clinicName'), { family: fontRef('heading'), size: '20px', weight: '800', color: o.dark ? c('white') : c('heading'), lineHeight: '1.2em' }),
  ]);
}

function header() {
  const light = { color: c('white', 82), size: '14px', lineHeight: '1.4em' };
  return [
    u.section({ label: 'Top bar', bg: c('dark'), padding: { top: '9px', bottom: '9px' }, rowGap: '0px', mod: { hideOn: ['phone'] } }, [
      u.row({ cols: 2, tablet: 'keep', align: 'center', gap: '24px', label: 'Top bar' }, [
        u.col({ direction: 'row', align: 'center', columnGap: '24px', gap: '4px', wrap: 'wrap' }, [u.text(v('hours'), light), u.text(v('address'), { ...light, mod: { hideOn: ['tablet'] } })]),
        u.col({ direction: 'row', align: 'center', justify: 'flex-end', columnGap: '24px', gap: '4px', wrap: 'wrap' }, [u.text(v('email'), { ...light, link: v('emailUrl') }), u.text(v('phone'), { ...light, color: c('white'), weight: '600', link: v('phoneUrl') })]),
      ]),
    ]),
    u.section({ label: 'Header', bg: c('white'), padding: { top: '14px', bottom: '14px' }, rowGap: '0px', mod: { sticky: 'top', zIndex: '99', shadow: { style: 'preset1', horizontal: '0px', vertical: '1px', blur: '0px', spread: '0px', color: 'rgba(11,27,63,0.08)', position: 'outer' } } }, [
      u.row({ cols: 1, label: 'Navigation' }, [
        // The logo sits inside the Menu module, so on phones the module spans the whole row and
        // its dropdown opens full width.
        u.col({ direction: 'row', align: 'center', justify: 'space-between', columnGap: '24px', gap: '12px', wrap: 'nowrap' }, [
          u.menu({ logo: ph.logo(), logoAlt: 'Perla Dental Studio', logoLink: dynamic('home_url'), mod: { size: ['flexGrow', 'flexShrink'] } }),
          u.button(v('bookLabel'), v('bookUrl'), { padding: box('12px', '22px'), size: '15px', mod: { hideOn: ['phone'] } }),
        ]),
      ]),
    ]),
  ];
}

function footer() {
  const linkStyle = { color: c('white', 74), linkColor: c('white', 74), linkHover: c('white'), size: v('small'), lineHeight: '2.1em' };
  const title = t => u.heading(t, { level: 'h4', size: '15px', weight: '700', color: c('white'), letterSpacing: '0.04em', mod: { margin: { bottom: '6px' } } });
  const links = list => u.text(list.map(([label, url]) => `<p><a href="${url}">${label}</a></p>`).join(''), linkStyle);
  return [
    u.section({ label: 'Footer', bg: c('dark'), padding: { top: 'clamp(56px, 7vw, 96px)', bottom: '28px' }, rowGap: 'clamp(40px, 5vw, 64px)' }, [
      u.row({ cols: 4, tablet: 'keep', tabletTypes: ['12_24', '12_24', '12_24', '12_24'], gap: 'clamp(24px, 4vw, 56px)', label: 'Footer columns', motion: 'stagger', mod: { layout: { flexWrap: resp('nowrap', 'wrap', 'wrap') } } }, [
        u.col({ gap: '18px' }, [
          logo({ dark: true }),
          u.small('<p>A small dental studio on Harbor Street, looking after Springfield families since 2010.</p>', { color: c('white', 74) }),
          u.social(C.SOCIAL),
        ]),
        u.col({ gap: '8px' }, [title('Explore'), links([['Home', '/'], ['About us', '/about/'], ['Treatments', '/services/'], ['Journal', '/blog/'], ['Contact', '/contact/']])]),
        u.col({ gap: '8px' }, [title('Treatments'), links(C.SERVICES.slice(0, 5).map(sv => [sv.title, `/services/${sv.slug}/`]))]),
        u.col({ gap: '8px' }, [
          title('Visit us'),
          u.small(v('address'), { color: c('white', 74) }),
          u.small(v('hours'), { color: c('white', 74) }),
          u.text(v('phone'), { color: c('white'), weight: '600', size: '18px', link: v('phoneUrl'), mod: { margin: { top: '6px' } } }),
          u.small(v('email'), { color: c('white', 74), link: v('emailUrl') }),
        ]),
      ]),
      u.row({ cols: 2, tablet: 'keep', align: 'center', gap: '24px', label: 'Legal', motion: 'reveal', mod: { padding: { top: '24px', right: '0px', bottom: '0px', left: '0px' }, border: { top: { width: '1px', color: c('white', 14) } } } }, [
        u.col({}, [u.small('<p>© 2026 Perla Dental Studio. All rights reserved.</p>', { color: c('white', 60) })]),
        u.col({}, [u.small('<p><a href="/privacy-policy/">Privacy policy</a> &nbsp;·&nbsp; <a href="/terms/">Terms</a></p>', { color: c('white', 60), linkColor: c('white', 60), linkHover: c('white'), align: resp('right', 'right', 'left') })]),
      ]),
    ]),
  ];
}

function postBody() {
  return [
    u.section({ label: 'Post header', bg: c('tint'), motion: 'hero', padding: { top: 'clamp(48px, 6vw, 88px)', bottom: 'clamp(48px, 6vw, 88px)' } }, [
      u.row({ cols: 1, maxWidth: '860px', label: 'Post title' }, [u.col({ gap: '16px', align: 'center', motion: 'stagger' }, [u.eyebrow('Journal', { align: 'center' }), u.postTitle()])]),
    ]),
    u.section({ label: 'Post content', bg: c('white'), padding: { top: v('sectionYSmall'), bottom: v('sectionYSmall') } }, [
      u.row({ cols: 1, maxWidth: '760px', label: 'Article' }, [u.col({ gap: '32px' }, [u.postContent(), u.postNav()])]),
    ]),
    u.section({ label: 'Related posts', bg: c('mist') }, [
      intro({ eyebrow: 'Keep reading', title: 'More from our journal' }),
      u.row({ cols: 1, label: 'Posts' }, [u.col({}, [u.blog({ number: 3, motion: 'reveal' })])]),
    ]),
    u.section({ label: 'Comments', bg: c('white'), padding: { top: v('sectionYSmall'), bottom: v('sectionY') } }, [
      u.row({ cols: 1, maxWidth: '760px', label: 'Comments' }, [u.col({}, [u.comments()])]),
    ]),
  ];
}

function notFound() {
  return [
    u.section({ label: '404', bg: c('mist'), padding: { top: 'clamp(72px, 10vw, 160px)', bottom: 'clamp(72px, 10vw, 160px)' } }, [
      u.row({ cols: 1, maxWidth: '640px', label: 'Not found' }, [
        u.col({ gap: '18px', align: 'center', motion: 'stagger' }, [
          u.heading('404', { level: 'h2', size: 'clamp(72px, 12vw, 140px)', weight: '800', color: c('primary', 26), lineHeight: '1em', align: 'center' }),
          u.display('This page has gone missing', { size: 'clamp(30px, 3.6vw, 44px)', align: 'center' }),
          u.lead('<p>The link may be out of date, or the page may have moved. Let’s get you back on track.</p>', { align: 'center' }),
          u.group({ direction: 'row', wrap: 'wrap', justify: 'center', gap: '12px', mod: { margin: { top: '8px' } } }, [u.button('Back to home', dynamic('home_url')), u.button('Contact us', '/contact/', { variant: 'outline' })]),
        ]),
      ]),
    ]),
  ];
}

module.exports = { intro, hero, stats, services, about, steps, team, testimonials, smileGallery, latestPosts, faq, cta, pageHero, story, values, contactMain, map, blogList, serviceHero, serviceDetails, pricing, header, footer, postBody, notFound };
