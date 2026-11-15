const { b, t, th, ta, url, img, space, section, flow, row, grid, columns, column, heading, paragraph, label, lead, small, buttons, button, arrowLink, dashes, image } = require('./blocks');
const C = require('./content');

const S = C.STUDIO;
const CONTACT = '/contact/';
const project = p => `/projects/${p.slug}/`;
const no = i => String(i + 1).padStart(2, '0');
const alt = file => (C.IMAGES[file] ? ta(C.IMAGES[file]) : '');
const photo = (file, o = {}) => image(file, { alt: alt(file), ...o });

const title = (html, o = {}) => heading(th(html), { className: 'dimora-split', ...o });
const sectionHead = (tag, html, o = {}) => flow({ name: 'Heading', align: o.wide ? 'wide' : undefined, className: 'dimora-stagger', gap: space('40') }, [label(t(tag)), title(html, { color: o.color })]);
const statement = (html, o = {}) => paragraph(th(html), { size: 'xx-large', color: 'ink', ...o, className: ['dimora-statement dimora-split', o.className].filter(Boolean).join(' ') });

// home

function hero() {
  return section({ name: 'Hero', bg: 'base', className: 'dimora-hero', top: space('60'), bottom: '0px', gap: space('70') }, [
    flow({ align: 'wide', gap: space('70') }, [
      row({ name: 'Details', justify: 'space-between', gap: space('40'), className: 'dimora-meta dimora-reveal' }, [label(t('Interior architecture studio')), label(t('London, since 2013'))]),
      title('Homes with a <em>quiet</em> kind of character.', { level: 1, size: 'display' }),
      columns({ align: null, valign: 'bottom', className: 'dimora-stagger' }, [
        column({ width: '50%', valign: 'bottom', className: 'dimora-hide-small' }, [label(t('(Selected work, 2022 – 2025)'))]),
        column({ width: '50%', valign: 'bottom', gap: space('50') }, [
          lead(t('We plan the rooms, draw the joinery and choose the last lamp, for people who would rather live in their home than show it off.'), { className: 'dimora-measure' }),
          arrowLink(t('See the projects'), url('/projects/')),
        ]),
      ]),
    ]),
    photo('hero.jpg', { align: 'full', ratio: '16/9', className: 'dimora-image dimora-parallax' }),
  ]);
}

function heroSplit() {
  return section({ name: 'Hero with photo', bg: 'base', className: 'dimora-hero', top: space('70'), bottom: space('80') }, [
    columns({ valign: 'bottom' }, [
      column({ width: '58%', valign: 'bottom', gap: space('60') }, [
        label(t('Interior architecture studio'), { className: 'dimora-reveal' }),
        title('Rooms that feel like <em>you</em> on a good day.', { level: 1, size: 'huge' }),
        lead(t('A small studio for considered homes, hotels and cafés. We work across Britain and, now and then, a little further.'), { className: 'dimora-measure dimora-reveal' }),
        buttons({ className: 'dimora-reveal' }, [button(t('Start a project'), url(CONTACT)), button(t('See the projects'), url('/projects/'), { variant: 'outline' })]),
      ]),
      column({ width: '42%', valign: 'bottom' }, [photo('studio-2.jpg', { ratio: '4/5', className: 'dimora-image dimora-parallax' })]),
    ]),
  ]);
}

function intro() {
  return section({ name: 'Statement', bg: 'base' }, [
    columns({}, [
      column({ width: '25%' }, [label(t('(About)'), { className: 'dimora-reveal' })]),
      column({ width: '75%', gap: space('60') }, [
        statement('A good room is mostly proportion, light and where the door goes. We start there. The sofa comes <em>much</em> later.'),
        arrowLink(t('About the studio'), url('/studio/'), { className: 'dimora-reveal' }),
      ]),
    ]),
  ]);
}

// One link per card: the title. Its ::after covers the whole card, so the picture is clickable too.
const projectCard = (p, i, o = {}) => flow({ name: p.title, className: ['dimora-card dimora-cursor', o.className].filter(Boolean).join(' '), gap: space('40') }, [
  photo(`${p.slug}-cover.jpg`, { ratio: o.ratio || '4/5' }),
  row({ justify: 'space-between', valign: 'top', wrap: false, gap: space('40') }, [
    flow({ gap: '4px' }, [heading(`<a href="${url(project(p))}">${t(p.title)}</a>`, { level: o.level || 3, size: o.level ? 'x-large' : undefined }), small(t(`${p.kind}, ${p.place}`), { color: 'muted' })]),
    label(`(${no(i)})`),
  ]),
]);

function projectsRail() {
  return b('core/group', { metadata: { name: 'Projects rail' }, align: 'full', className: 'dimora-rail', backgroundColor: 'base', style: { spacing: { margin: { top: '0', bottom: '0' } } }, layout: { type: 'default' } }, [
    b('core/group', { className: 'dimora-rail-pin', style: { spacing: { blockGap: space('60'), padding: { top: space('80'), bottom: space('80') } } }, layout: { type: 'default' } }, [
      row({ name: 'Heading', className: 'dimora-rail-head', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
        flow({ gap: space('40') }, [label(t('(Selected work)')), heading(th('Six places we are <em>proud</em> of'), { className: 'dimora-split' })]),
        arrowLink(t('All projects'), url('/projects/')),
      ]),
      b('core/group', { className: 'dimora-rail-track', style: { spacing: { blockGap: space('50') } }, layout: { type: 'flex', flexWrap: 'nowrap', verticalAlignment: 'top' } }, C.PROJECTS.map((p, i) => projectCard(p, i))),
    ]),
  ]);
}

const serviceRows = (items, open = 0) => items.map((sv, i) => b('core/details', { summary: t(sv.title), showContent: i === open, className: 'is-style-dimora-row' }, [
  columns({ align: null, gap: space('60'), rowGap: space('40') }, [
    column({ width: '58%' }, [paragraph(t(sv.text))]),
    column({ width: '42%' }, [dashes(sv.points.map(point => t(point)))]),
  ]),
]));

function services() {
  return section({ name: 'Services', bg: 'dark', text: 'base', className: 'dimora-dark' }, [
    columns({}, [
      column({ width: '34%', gap: space('50') }, [
        sectionHead('(Services)', 'What we <em>do</em>', { color: 'base' }),
        paragraph(t('From a single room to a whole hotel. Take one service or all of them.'), { className: 'dimora-reveal dimora-soft' }),
        arrowLink(t('How we work'), url('/services/'), { className: 'dimora-reveal' }),
      ]),
      column({ width: '66%', gap: '0', className: 'dimora-stagger dimora-rows' }, serviceRows(C.SERVICES)),
    ]),
  ]);
}

const statsGrid = (o = {}) => grid({ name: 'Numbers', align: o.align === undefined ? null : o.align, min: o.min || '150px', gap: space('50'), className: ['dimora-stagger', o.className].filter(Boolean).join(' ') }, C.STATS.map(s => flow({ gap: '4px', className: 'dimora-stat' }, [
  paragraph(s.number, { className: 'dimora-number', color: 'ink' }),
  small(t(s.label), { color: 'muted' }),
])));

function studio() {
  return section({ name: 'Studio', bg: 'surface' }, [
    columns({ valign: 'center' }, [
      column({ valign: 'center', width: '44%' }, [photo('studio.jpg', { ratio: '4/5', className: 'dimora-image dimora-parallax' })]),
      column({ valign: 'center', width: '56%', gap: space('60') }, [
        sectionHead('(The studio)', 'Nine people, one long table, 2,000 <em>samples</em>'),
        paragraph(t('The studio was started in 2013 by Marta Lind, after eight years of designing other people’s houses under other people’s names. We are still small on purpose: the person you meet is the person who draws your kitchen.'), { className: 'dimora-reveal dimora-measure' }),
        statsGrid(),
        arrowLink(t('Meet the studio'), url('/studio/'), { className: 'dimora-reveal' }),
      ]),
    ]),
  ]);
}

function process() {
  return section({ name: 'Process', bg: 'base' }, [
    columns({}, [
      column({ width: '38%' }, [
        flow({ className: 'dimora-sticky', gap: space('50') }, [
          sectionHead('(Process)', 'Five steps, <em>no</em> surprises'),
          paragraph(t('Every project follows the same path, whether it is one bookcase or fourteen bedrooms.'), { className: 'dimora-reveal dimora-measure' }),
        ]),
      ]),
      column({ width: '62%', gap: '0', className: 'dimora-stagger dimora-rows' }, C.PROCESS.map(step => row({ name: step.title, className: 'dimora-step', wrap: false, valign: 'top', gap: space('60'), padding: { top: space('60'), bottom: space('60') } }, [
        label(step.n),
        flow({ gap: space('30') }, [heading(t(step.title), { level: 3 }), paragraph(t(step.text))]),
      ]))),
    ]),
  ]);
}

function quote(o = {}) {
  const q = C.TESTIMONIALS[o.index || 0];
  return section({ name: 'Quote', bg: o.bg || 'surface' }, [
    flow({ align: 'wide', gap: space('60'), contentSize: '1040px', className: 'dimora-stagger' }, [
      label(t('(In their words)'), { align: 'center' }),
      paragraph(t(`“${q.quote}”`), { align: 'center', className: 'dimora-quote', color: 'ink' }),
      small(`${t(q.name)} · <a href="${url('/projects/')}">${t(q.detail)}</a>`, { align: 'center', color: 'muted' }),
    ]),
    o.press !== false && row({ name: 'Press', align: 'wide', justify: 'center', gap: '12px 40px', className: 'dimora-press dimora-reveal' }, [small(t('As featured in'), { color: 'muted' }), ...C.PRESS.map(name => paragraph(t(name), { className: 'dimora-press-name' }))]),
  ]);
}

const postCard = (level = 3) => flow({ className: 'dimora-post', gap: space('40') }, [
  b('core/post-featured-image', { isLink: true, aspectRatio: '3/2' }),
  flow({ gap: space('30') }, [
    b('core/post-date', { className: 'is-style-dimora-label' }),
    b('core/post-title', { level, isLink: true }),
    b('core/post-excerpt', { excerptLength: 20, moreText: ta('Read the article') }),
  ]),
]);

const postsGrid = (queryId, query, inner = [], level = 3) => b('core/query', { queryId, query, align: 'wide' }, [
  b('core/post-template', { className: 'dimora-reveal', style: { spacing: { blockGap: space('60') } }, layout: { type: 'grid', minimumColumnWidth: '320px' } }, [postCard(level)]),
  ...inner,
]);

function journal() {
  return section({ name: 'Journal', bg: 'base' }, [
    row({ name: 'Heading', align: 'wide', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
      sectionHead('(Journal)', 'Notes on <em>living</em> well'),
      arrowLink(t('All articles'), url('/journal/'), { className: 'dimora-reveal' }),
    ]),
    postsGrid(21, { perPage: 3, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: 'exclude', inherit: false }, [
      b('core/query-no-results', {}, [paragraph(t('Your latest articles will be shown here.'))]),
    ]),
  ]);
}

function cta() {
  return section({ name: 'Call to action', bg: 'base', top: space('80'), bottom: space('80'), gap: space('60'), className: 'dimora-cta' }, [
    flow({ name: 'Running line', align: 'full' }, [paragraph(`<a href="${url(CONTACT)}">${t('Tell us about your home')}</a>`, { align: 'center', className: 'dimora-marquee' })]),
    buttons({ justify: 'center', className: 'dimora-reveal' }, [button(t('Start a project'), url(CONTACT)), button(S.phone, S.phoneLink, { variant: 'outline' })]),
  ]);
}

// projects

function projectsGrid() {
  return section({ name: 'Projects', bg: 'base', top: space('70') }, [
    grid({ name: 'Projects grid', min: '420px', gap: space('70'), className: 'dimora-stagger dimora-offset-grid' }, C.PROJECTS.map((p, i) => projectCard(p, i, { level: 2, ratio: [0, 3].includes(i % 4) ? '4/5' : '1' }))),
  ]);
}

function projectsList() {
  return section({ name: 'Projects index', bg: 'base' }, [
    sectionHead('(Index)', 'Every project, <em>at a glance</em>', { wide: true }),
    flow({ name: 'List', align: 'wide', gap: '0', className: 'dimora-list dimora-stagger' }, C.PROJECTS.map((p, i) => row({ name: p.title, className: 'dimora-list-row', justify: 'space-between', wrap: false, gap: space('50'), padding: { top: space('50'), bottom: space('50') } }, [
      row({ wrap: false, valign: 'top', gap: space('50') }, [label(`(${no(i)})`), heading(`<a href="${url(project(p))}">${t(p.title)}</a>`, { level: 3 })]),
      row({ wrap: false, gap: space('60') }, [small(t(`${p.kind}, ${p.place}`), { color: 'muted', className: 'dimora-hide-small' }), label(t(p.area))]),
      photo(`${p.slug}-cover.jpg`, { alt: '', ratio: '4/5', className: 'dimora-list-image' }),
    ]))),
  ]);
}

const CHAPTERS = ['The brief', 'What we did', 'The detail'];

function projectPage(p, i) {
  const next = C.PROJECTS[(i + 1) % C.PROJECTS.length];
  const facts = [['Location', p.place], ['Year', p.year], ['Size', p.area], ['Scope', p.scope]];
  return {
    hero: section({ name: 'Project', bg: 'base', className: 'dimora-hero', top: space('60'), bottom: '0px', gap: space('70') }, [
      flow({ align: 'wide', gap: space('60') }, [
        label(`<a href="${url('/projects/')}">${t('Projects')}</a> / ${t(p.kind)}`, { className: 'dimora-reveal' }),
        heading(t(p.title), { level: 1, size: 'display', className: 'dimora-split' }),
        columns({ align: null, valign: 'bottom', className: 'dimora-stagger' }, [
          column({ width: '50%', valign: 'bottom' }, [lead(t(p.line), { className: 'dimora-measure' })]),
          column({ width: '50%', valign: 'bottom' }, [
            grid({ name: 'Facts', align: null, min: '240px', gap: space('50'), className: 'dimora-facts' }, facts.map(([k, v]) => flow({ gap: '6px', className: 'dimora-fact' }, [label(t(k)), paragraph(t(v), { color: 'ink' })]))),
          ]),
        ]),
      ]),
      photo(`${p.slug}-cover.jpg`, { align: 'wide', ratio: '16/9', className: 'dimora-image dimora-parallax' }),
    ]),
    story: section({ name: 'Story', bg: 'base', gap: '0' }, p.story.map((text, n) => columns({ className: 'dimora-chapter dimora-reveal', padding: { top: space('60'), bottom: space('60') }, rowGap: space('40') }, [
      column({ width: '25%' }, [label(`(${no(n)}) ${t(CHAPTERS[n])}`)]),
      column({ width: '75%' }, [n ? paragraph(t(text), { size: 'large', className: 'dimora-measure' }) : paragraph(t(text), { size: 'xx-large', color: 'ink', className: 'dimora-statement' })]),
    ]))),
    gallery: section({ name: 'Gallery', bg: 'base', top: '0px' }, [
      columns({ className: 'dimora-pair' }, [
        column({ width: '46%' }, [photo(`${p.slug}-1.jpg`, { ratio: '4/5', className: 'dimora-image' })]),
        column({ width: '54%', className: 'dimora-drop' }, [photo(`${p.slug}-2.jpg`, { ratio: '4/5', className: 'dimora-image dimora-parallax' })]),
      ]),
      photo(`${p.slug}-3.jpg`, { align: 'wide', ratio: '16/9', className: 'dimora-image dimora-parallax' }),
    ]),
    materials: section({ name: 'Materials', bg: 'surface' }, [
      columns({ valign: 'center' }, [
        column({ width: '34%', valign: 'center', gap: space('50') }, [
          sectionHead('(Materials)', 'The <em>palette</em>'),
          paragraph(t('Four materials do most of the work. Everything else stays quiet.'), { className: 'dimora-reveal dimora-measure' }),
        ]),
        column({ width: '66%', valign: 'center' }, [
          grid({ name: 'Swatches', align: null, min: '190px', gap: space('40'), className: 'dimora-stagger dimora-quads' }, p.materials.map(([name, hex]) => flow({ gap: space('30') }, [
            b('core/group', { className: 'dimora-swatch', style: { color: { background: hex } }, layout: { type: 'default' } }, []),
            small(t(name), { color: 'ink' }),
          ]))),
        ]),
      ]),
    ]),
    quote: section({ name: 'Client', bg: 'base' }, [
      flow({ align: 'wide', gap: space('60'), contentSize: '1040px', className: 'dimora-stagger' }, [
        label(t('(In their words)'), { align: 'center' }),
        paragraph(t(`“${p.quote}”`), { align: 'center', className: 'dimora-quote', color: 'ink' }),
        small(t(p.client), { align: 'center', color: 'muted' }),
      ]),
    ]),
    next: section({ name: 'Next project', bg: 'surface', className: 'dimora-next dimora-cursor' }, [
      columns({ valign: 'center' }, [
        column({ width: '58%', valign: 'center', gap: space('40'), className: 'dimora-stagger' }, [
          label(t('(Next project)')),
          heading(`<a href="${url(project(next))}">${t(next.title)}</a>`, { level: 2, size: 'huge' }),
          small(t(`${next.kind}, ${next.place}`), { color: 'muted' }),
        ]),
        column({ width: '42%', valign: 'center' }, [photo(`${next.slug}-cover.jpg`, { alt: '', ratio: '4/3', className: 'dimora-image' })]),
      ]),
    ]),
  };
}

// studio, services, contact

function studioStory() {
  return section({ name: 'Story', bg: 'base', top: space('70') }, [
    columns({}, [
      column({ width: '54%', gap: space('60') }, [
        statement('We design homes, and a few hotels and cafés, for people who notice how a door handle feels. The work is slow, detailed and <em>worth it</em>.'),
        flow({ gap: space('40'), className: 'dimora-stagger' }, [
          paragraph(t('Marta Lind started the studio in 2013 at a kitchen table in Hackney. The table is now in our meeting room, with more coffee rings and the same wobble.'), { className: 'dimora-measure' }),
          paragraph(t('We take on about eight projects a year. That is few enough for the same designer to stay with you from the first sketch to the day the pictures are hung.'), { className: 'dimora-measure' }),
        ]),
      ]),
      column({ width: '46%' }, [photo('studio-2.jpg', { ratio: '4/5', className: 'dimora-image dimora-parallax' })]),
    ]),
  ]);
}

function values() {
  return section({ name: 'Principles', bg: 'surface' }, [
    sectionHead('(Principles)', 'Three things we will <em>not</em> bend on', { wide: true }),
    grid({ name: 'Principles', min: '360px', gap: space('60'), className: 'dimora-stagger' }, C.VALUES.map((v, i) => flow({ className: 'dimora-value', gap: space('40'), padding: { top: space('50') } }, [
      label(`(${no(i)})`),
      heading(t(v.title), { level: 3 }),
      paragraph(t(v.text)),
    ]))),
  ]);
}

function team() {
  return section({ name: 'Team', bg: 'base' }, [
    row({ name: 'Heading', align: 'wide', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
      sectionHead('(People)', 'Who you will <em>meet</em>'),
      paragraph(t('Four of the nine. The others are shy, or on site.'), { className: 'dimora-reveal', color: 'muted' }),
    ]),
    grid({ name: 'People', min: '270px', gap: space('60'), className: 'dimora-stagger dimora-quads' }, C.TEAM.map(m => flow({ gap: space('30') }, [
      image('portrait.svg', { alt: '', ratio: '4/5', className: 'dimora-portrait' }),
      heading(t(m.name), { level: 3 }),
      label(t(m.role)),
      small(t(m.bio), { color: 'body' }),
    ]))),
  ]);
}

function numbers() {
  return section({ name: 'Numbers', bg: 'base', top: '0px' }, [statsGrid({ align: 'wide', min: '290px', className: 'dimora-quads' })]);
}

function servicesDetail() {
  return section({ name: 'Services in detail', bg: 'base', top: space('70') }, [
    columns({}, [
      column({ width: '40%' }, [
        flow({ className: 'dimora-sticky', gap: space('60') }, [
          statement('Take one service or all of them. Either way you get one team, one budget and one person to <em>call</em>.'),
          photo('services.jpg', { ratio: '4/3', className: 'dimora-image' }),
        ]),
      ]),
      column({ width: '60%', gap: '0', className: 'dimora-stagger dimora-rows' }, serviceRows(C.SERVICES, -1)),
    ]),
  ]);
}

function packages() {
  const ways = [
    ['A day of advice', 'One designer, one day, in your home. You keep the sketches and a written list of what to do next.', 'From £650', ['A visit of six hours', 'Sketches and a shopping list', 'No obligation to go further']],
    ['One room', 'A full design for a single room: layout, lighting, joinery, furniture and a schedule your builder can price.', 'From £3,800', ['Two design meetings', 'Drawings and specifications', 'Sourcing and ordering']],
    ['The whole house', 'From the first survey to hanging the pictures, with one person in charge throughout.', '10 to 14% of the build cost', ['Concept, detail and site visits', 'Tenders and contractor management', 'Furniture, art and styling']],
  ];
  return section({ name: 'Ways to work', bg: 'base' }, [
    row({ name: 'Heading', align: 'wide', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
      sectionHead('(Ways to work)', 'Three ways to <em>begin</em>'),
      paragraph(t('Fees are agreed in writing before any work starts.'), { className: 'dimora-reveal', color: 'muted' }),
    ]),
    grid({ name: 'Ways', min: '360px', gap: space('60'), className: 'dimora-stagger' }, ways.map(([name, text, price, points], i) => flow({ name, className: 'dimora-value', gap: space('50'), padding: { top: space('50') } }, [
      label(`(${no(i)})`),
      flow({ gap: space('30') }, [heading(t(name), { level: 3 }), paragraph(t(text))]),
      paragraph(t(price), { className: 'dimora-price', color: 'ink' }),
      dashes(points.map(point => t(point))),
      arrowLink(t('Ask about this'), url(CONTACT)),
    ]))),
  ]);
}

function testimonials() {
  return section({ name: 'Clients', bg: 'surface' }, [
    sectionHead('(Clients)', 'Said after the dust had <em>settled</em>', { wide: true }),
    grid({ name: 'Quotes', min: '360px', gap: space('60'), className: 'dimora-stagger' }, C.TESTIMONIALS.map(q => flow({ className: 'dimora-value', gap: space('50'), padding: { top: space('50') } }, [
      paragraph(t(`“${q.quote}”`), { size: 'x-large', color: 'ink', className: 'dimora-statement' }),
      small(`${t(q.name)} · ${t(q.detail)}`, { color: 'muted' }),
    ]))),
  ]);
}

function compare() {
  const shot = (file, text) => b('core/image', { url: img(file), alt: alt(file), caption: t(text), sizeSlug: 'full', aspectRatio: '4/3', scale: 'cover' });
  return section({ name: 'Drawing and room', bg: 'surface' }, [
    columns({ valign: 'center' }, [
      column({ width: '38%', valign: 'center', gap: space('50') }, [
        sectionHead('(From drawing to room)', 'What we draw is what gets <em>built</em>'),
        paragraph(t('Drag the handle. Every project is drawn in full before a builder is asked for a price, so the room you approve on paper is the room you walk into.'), { className: 'dimora-reveal dimora-measure' }),
      ]),
      column({ width: '62%', valign: 'center' }, [
        flow({ name: 'Drag to compare', className: 'dimora-compare dimora-reveal' }, [shot('compare-sketch.jpg', 'Drawing'), shot('compare-built.jpg', 'Built')]),
      ]),
    ]),
  ]);
}

function materialsBoard() {
  const fallback = ['Stone', 'Plaster', 'Timber', 'Concrete'];
  const tiles = [1, 2, 3, 4].map(n => `material-${n}.jpg`).map((file, i) => [file, (C.MATERIALS.find(m => m.file === file) || {}).name || fallback[i]]);
  return section({ name: 'Material library', bg: 'base' }, [
    row({ name: 'Heading', align: 'wide', justify: 'space-between', valign: 'bottom', gap: space('50') }, [
      sectionHead('(Material library)', 'Things you can <em>touch</em>'),
      paragraph(t('Samples live in the studio. Come and handle them.'), { className: 'dimora-reveal', color: 'muted' }),
    ]),
    grid({ name: 'Materials', min: '280px', gap: space('50'), className: 'dimora-stagger dimora-quads' }, tiles.map(([file, name], i) => flow({ gap: space('30') }, [
      photo(file, { ratio: '1', className: 'dimora-image' }),
      row({ justify: 'space-between', wrap: false }, [small(t(name), { color: 'ink' }), label(`(${no(i)})`)]),
    ]))),
  ]);
}

function faq(o = {}) {
  return section({ name: 'Questions', bg: o.bg || 'surface' }, [
    columns({}, [
      column({ width: '34%', gap: space('50') }, [
        sectionHead('(Questions)', 'Asked at every <em>first</em> meeting'),
        arrowLink(t('Ask us something else'), url(CONTACT), { className: 'dimora-reveal' }),
      ]),
      column({ width: '66%', gap: '0', className: 'dimora-stagger dimora-rows' }, C.FAQ.map((item, i) => b('core/details', { summary: t(item.q), showContent: i === 0, className: 'is-style-dimora-row' }, [paragraph(t(item.a), { className: 'dimora-measure' })]))),
    ]),
  ]);
}

function contact() {
  const line = (name, value) => flow({ gap: '6px', className: 'dimora-fact' }, [label(t(name)), paragraph(value, { color: 'ink', size: 'large' })]);
  return section({ name: 'Contact', bg: 'base', top: space('70') }, [
    columns({}, [
      column({ width: '56%', gap: space('70') }, [
        statement('Tell us about the place, the people who use it and what is <em>not</em> working. A few lines are enough to start.'),
        grid({ name: 'Details', align: null, min: '280px', gap: space('60'), className: 'dimora-stagger' }, [
          line('Write', `<a href="mailto:${S.email}">${S.email}</a>`),
          line('Call', `<a href="${S.phoneLink}">${S.phone}</a>`),
          line('Visit', t(S.address)),
          line('Hours', t(S.hours)),
        ]),
        flow({ name: 'Brief', gap: space('50'), className: 'dimora-reveal dimora-brief', padding: { top: space('60') } }, [
          label(t('(Useful to know)')),
          dashes([t('What kind of place it is, and roughly how big'), t('Where it is'), t('When you would like to start'), t('A budget, even a rough one')]),
          buttons({}, [button(t('Write to us'), `mailto:${S.email}`), button(t('Call the studio'), S.phoneLink, { variant: 'outline' })]),
          small(t('Would you rather have a form here? Put the form block of your favourite form plugin in place of these buttons.'), { color: 'muted' }),
        ]),
      ]),
      column({ width: '44%' }, [photo('contact.jpg', { ratio: '4/5', className: 'dimora-image dimora-parallax' })]),
    ]),
  ]);
}

// header, footer, templates

const navBar = (o = {}) => section({ name: 'Header', tagName: 'div', bg: 'base', className: 'dimora-navbar', top: '18px', bottom: '18px' }, [
  row({ align: 'wide', justify: 'space-between', wrap: false, gap: space('50') }, [
    b('core/site-title', { level: 0 }),
    row({ name: 'Menu', wrap: false, gap: space('60') }, [
      b('core/navigation', { overlayMenu: o.overlay || 'mobile', icon: 'menu', layout: { type: 'flex', justifyContent: 'right' }, style: { spacing: { blockGap: space('60') } } }),
      arrowLink(t('Start a project'), url(CONTACT), { className: o.overlay ? 'dimora-hide-small' : 'dimora-hide-medium' }),
    ]),
  ]),
]);

function footer(o = {}) {
  const col = (name, lines) => flow({ gap: space('30') }, [label(t(name)), ...lines.map(line => paragraph(line, { className: 'dimora-soft' }))]);
  const link = (text, path) => `<a href="${url(path)}">${t(text)}</a>`;
  return [
    section({ name: 'Footer', bg: 'dark', text: 'base', className: 'dimora-dark dimora-footer', top: space('80'), bottom: space('50'), gap: space('80') }, [
      !o.compact && columns({}, [
        column({ width: '56%', gap: space('50') }, [
          heading(th('Let’s make a <em>home</em> of it.'), { level: 2, size: 'huge', color: 'base', className: 'dimora-split' }),
          arrowLink(S.email, `mailto:${S.email}`, { size: 'x-large', className: 'dimora-reveal' }),
        ]),
        column({ width: '44%' }, [
          grid({ name: 'Details', align: null, min: '220px', gap: space('60'), className: 'dimora-stagger' }, [
            col('Studio', [t(S.address), t(S.hours)]),
            col('Contact', [`<a href="${S.phoneLink}">${S.phone}</a>`, `<a href="mailto:${S.email}">${S.email}</a>`]),
            col('Explore', [link('Projects', '/projects/'), link('Studio', '/studio/'), link('Services', '/services/'), link('Journal', '/journal/')]),
            col('Follow', [`<a href="#">${t('Instagram')}</a>`, `<a href="#">${t('Pinterest')}</a>`, `<a href="#">${t('LinkedIn')}</a>`]),
          ]),
        ]),
      ]),
      !o.compact && b('core/site-title', { level: 0, isLink: false, align: 'wide', className: 'dimora-wordmark' }),
      row({ name: 'Legal', align: 'wide', justify: 'space-between', gap: '12px 32px', className: 'dimora-legal' }, [
        row({ gap: '6px' }, [small(t('©'), { className: 'dimora-soft' }), b('core/site-title', { level: 0, isLink: false, className: 'dimora-site-title-plain' })]),
        o.compact && small(`${link('Projects', '/projects/')} · ${link('Studio', '/studio/')} · ${link('Contact', CONTACT)}`, { className: 'dimora-soft' }),
        small(`${link('Privacy policy', '/privacy-policy/')} · ${link('Terms', '/terms/')} · <a href="#top">${t('Back to top')}</a>`, { className: 'dimora-soft' }),
      ]),
    ]),
  ];
}

const pageHead = inner => section({ name: 'Page title', bg: 'base', className: 'dimora-hero dimora-page-head', top: space('70'), bottom: space('60') }, [flow({ align: 'wide', gap: space('50'), className: 'dimora-stagger' }, inner)]);

const blogHeader = () => pageHead([label(t('(Journal)')), heading(th('Notes on <em>living</em> well'), { level: 1, size: 'huge', className: 'dimora-split' }), lead(t('Short, practical pieces on paint, budgets, builders and the questions clients ask us most.'), { className: 'dimora-measure' })]);

const pagination = () => b('core/query-pagination', { paginationArrow: 'arrow', layout: { type: 'flex', justifyContent: 'space-between' }, style: { spacing: { margin: { top: space('80') } } } }, [b('core/query-pagination-previous'), b('core/query-pagination-numbers'), b('core/query-pagination-next')]);

const postsLoop = () => section({ name: 'Posts', bg: 'base', top: space('60') }, [
  postsGrid(1, { perPage: 9, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: '', inherit: true }, [
    pagination(),
    b('core/query-no-results', {}, [paragraph(t('Nothing was found here. Try another search, or go back to the home page.'))]),
  ], 2),
]);

// the journal of a front page set to "Your latest posts": the posts of the site, with their pages
const journalPaged = () => section({ name: 'Journal', bg: 'base' }, [
  sectionHead('(Journal)', 'Notes on <em>living</em> well', { wide: true }),
  postsGrid(1, { perPage: 9, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: '', inherit: true }, [
    pagination(),
    b('core/query-no-results', {}, [paragraph(t('Your latest articles will be shown here.'))]),
  ]),
]);

const postFooter = () => [
  section({ name: 'Post navigation', bg: 'base', top: '0px', bottom: space('80') }, [
    row({ name: 'Previous and next', align: 'wide', justify: 'space-between', gap: space('50'), className: 'dimora-post-nav', padding: { top: space('50') } }, [
      b('core/post-navigation-link', { type: 'previous', label: ta('Previous article'), arrow: 'arrow' }),
      b('core/post-navigation-link', { label: ta('Next article'), arrow: 'arrow' }),
    ]),
  ]),
  section({ name: 'More articles', bg: 'surface' }, [
    sectionHead('(Keep reading)', 'More from the <em>journal</em>', { wide: true }),
    postsGrid(22, { perPage: 3, pages: 0, offset: 0, postType: 'post', order: 'desc', orderBy: 'date', author: '', search: '', exclude: [], sticky: 'exclude', inherit: false }),
  ]),
];

const notFound = () => section({ name: 'Not found', tagName: 'div', bg: 'base', className: 'dimora-hero', top: space('80'), bottom: space('90') }, [
  flow({ align: 'wide', gap: space('60'), className: 'dimora-stagger' }, [
    label(t('(404)')),
    heading(th('This room does <em>not</em> exist.'), { level: 1, size: 'display', className: 'dimora-split' }),
    lead(t('The page may have moved, or the address may be mistyped.'), { className: 'dimora-measure' }),
    buttons({}, [button(t('Back to the home page'), url('/')), button(t('See the projects'), url('/projects/'), { variant: 'outline' })]),
  ]),
]);

const searchHeader = () => pageHead([label(t('(Search)')), b('core/query-title', { type: 'search', level: 1, fontSize: 'huge' }), b('core/search', { label: ta('Search'), showLabel: false, placeholder: ta('Search the site…'), buttonText: ta('Search'), className: 'dimora-search' })]);

const FRONT_PAGE = ['hero', 'statement', 'projects-rail', 'services', 'studio', 'process', 'quote', 'journal', 'cta'];

const ref = slug => b('core/pattern', { slug: `dimora/${slug}` });
const sectionPattern = (slug, name, build, keywords = '', coreCategory = '') => ({ slug, title: name, categories: ['dimora', coreCategory].filter(Boolean).join(', '), keywords, blocks: [].concat(build()) });
const pagePattern = (slug, name, blocks, keywords = '') => ({ slug, title: name, categories: 'dimora-pages', keywords, blockTypes: 'core/post-content', postTypes: 'page', blocks });
const hidden = (slug, name, blocks) => ({ slug, title: name, inserter: false, blocks: [].concat(blocks) });

const first = projectPage(C.PROJECTS[0], 0);
const PROJECT_PARTS = [
  ['hero', 'Project: title, facts and photo', 'project, case study, facts'],
  ['story', 'Project: story in three chapters', 'project, case study, text'],
  ['gallery', 'Project: gallery of three photos', 'project, gallery, images'],
  ['materials', 'Project: palette of materials', 'project, materials, colours, swatches'],
  ['quote', 'Project: words of the client', 'project, testimonial, quote'],
  ['next', 'Project: link to the next project', 'project, next, navigation'],
];

const PATTERNS = [
  sectionPattern('hero', 'Hero with large title and photo', hero, 'header, intro, banner', 'banner'),
  sectionPattern('hero-split', 'Hero with photo beside the title', heroSplit, 'header, intro, banner', 'banner'),
  sectionPattern('statement', 'Statement in large type', intro, 'intro, about, text', 'text'),
  sectionPattern('projects-rail', 'Projects in a sideways gallery', projectsRail, 'portfolio, gallery, horizontal, work', 'portfolio'),
  sectionPattern('projects-grid', 'Projects in a staggered grid', projectsGrid, 'portfolio, grid, work', 'portfolio'),
  sectionPattern('projects-list', 'Projects as an index with pictures on hover', projectsList, 'portfolio, list, index', 'portfolio'),
  ...PROJECT_PARTS.map(([key, name, keywords]) => sectionPattern(`project-${key}`, name, () => first[key], keywords, 'portfolio')),
  sectionPattern('services', 'Services that open', services, 'services, accordion, list', 'services'),
  sectionPattern('services-detail', 'Services with photo', servicesDetail, 'services, accordion, list', 'services'),
  sectionPattern('studio', 'Studio with photo and numbers', studio, 'about, numbers, image', 'about'),
  sectionPattern('studio-story', 'Story with tall photo', studioStory, 'about, story, text', 'about'),
  sectionPattern('process', 'Process in steps', process, 'process, steps, how it works'),
  sectionPattern('values', 'Three principles', values, 'values, features, text'),
  sectionPattern('team', 'Team', team, 'people, staff, team', 'team'),
  sectionPattern('numbers', 'Numbers', numbers, 'stats, counters, figures'),
  sectionPattern('quote', 'Large quote with press names', quote, 'testimonial, quote, press', 'testimonials'),
  sectionPattern('testimonials', 'Three client quotes', testimonials, 'testimonials, reviews, quotes', 'testimonials'),
  sectionPattern('packages', 'Three ways to work together, with fees', packages, 'pricing, fees, packages, services', 'services'),
  sectionPattern('compare', 'Drawing and room slider', compare, 'before, after, compare, slider', 'gallery'),
  sectionPattern('materials', 'Material library', materialsBoard, 'materials, swatches, gallery', 'gallery'),
  sectionPattern('journal', 'Latest articles', journal, 'blog, news, query', 'posts'),
  sectionPattern('faq', 'Questions and answers', faq, 'faq, accordion, details'),
  sectionPattern('contact', 'Contact details and brief', contact, 'contact, address, phone', 'contact'),
  sectionPattern('cta', 'Running call to action', cta, 'cta, marquee, banner', 'call-to-action'),

  pagePattern('page-home', 'Home', FRONT_PAGE.map(slug => ref(slug)), 'home, front page, landing'),
  pagePattern('page-projects', 'Projects', [ref('projects-grid'), ref('projects-list'), ref('cta')], 'portfolio, projects, work'),
  ...C.PROJECTS.map((p, i) => pagePattern(`page-project-${p.slug}`, `Project: ${p.title}`, i ? Object.values(projectPage(p, i)) : PROJECT_PARTS.map(([key]) => ref(`project-${key}`)), 'project, case study, portfolio')),
  pagePattern('page-studio', 'Studio', [ref('studio-story'), ref('numbers'), ref('values'), ref('team'), quote({ index: 2, press: false }), ref('cta')], 'about, studio, team'),
  pagePattern('page-services', 'Services', [ref('services-detail'), ref('process'), ref('packages'), ref('compare'), ref('materials'), ref('faq'), ref('cta')], 'services, process'),
  pagePattern('page-contact', 'Contact', [ref('contact'), faq({ bg: 'surface' }), ref('cta')], 'contact'),

  { slug: 'header', title: 'Header with menu', categories: 'header', blockTypes: 'core/template-part/header', blocks: [navBar()] },
  { slug: 'header-overlay', title: 'Header with full-screen menu', categories: 'header', blockTypes: 'core/template-part/header', blocks: [navBar({ overlay: 'always' })] },
  { slug: 'footer', title: 'Footer with large call and wordmark', categories: 'footer', blockTypes: 'core/template-part/footer', blocks: footer() },
  { slug: 'footer-compact', title: 'Footer on one line', categories: 'footer', blockTypes: 'core/template-part/footer', blocks: footer({ compact: true }) },
  {
    slug: 'front-page',
    title: 'Front page',
    inserter: false,
    when: 'dimora_big_boss()',
    blocks: [b('core/post-content', { align: 'full', className: 'dimora-content', layout: { type: 'constrained' } })],
    branches: [
      { when: 'is_home() && is_paged()', blocks: [ref('blog-header'), ref('posts-loop')] },
      { when: 'is_home()', blocks: FRONT_PAGE.map(slug => (slug === 'journal' ? journalPaged() : ref(slug))) },
    ],
    otherwise: FRONT_PAGE.map(slug => ref(slug)),
  },
  hidden('blog-header', 'Journal header', blogHeader()),
  hidden('posts-loop', 'Posts of the current page', postsLoop()),
  hidden('post-footer', 'After an article', postFooter()),
  hidden('search-header', 'Search header', searchHeader()),
  hidden('not-found', 'Page not found', notFound()),
];

module.exports = { PATTERNS, FRONT_PAGE, pageHead };
