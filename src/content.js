// The studio is invented: a small interior architecture practice in London.
// Phone numbers come from the range Ofcom reserves for fiction.
const STUDIO = {
  city: 'London',
  address: '18 Larkspur Yard, London E2',
  phone: '020 7946 0321',
  phoneLink: 'tel:+442079460321',
  email: 'hello@example.com',
  hours: 'Monday to Friday, 9am – 6pm',
  founded: '2013',
};

// cover and gallery are files in assets/images; alt texts describe them.
const PROJECTS = [
  {
    slug: 'canal-house', title: 'Canal House', kind: 'Townhouse renovation', place: 'London', year: '2025', area: '210 m²',
    scope: 'Interior architecture, joinery, furniture',
    line: 'A narrow Victorian house opened up to the water it had turned its back on.',
    story: [
      'The house had four floors, eleven doors and almost no view of the canal behind it. The owners, a couple with two teenagers and a great many books, asked for one thing: to see the water from the kitchen table.',
      'We moved the kitchen to the garden level, took out a wall nobody would miss and lined the new opening in oak. Upstairs, the rooms kept their proportions and their cornices; what changed is the light, the storage and the way one room leads to the next.',
      'Nearly everything fixed was made within thirty miles: the oak joinery in Hackney, the lime plaster by a father and son from Kent, the bathroom stone cut in Bermondsey.',
    ],
    materials: [['Oiled oak', '#b08d63'], ['Lime plaster', '#e9e2d6'], ['Honed limestone', '#cfc8ba'], ['Aged brass', '#9a7b3f']],
    quote: 'We eat every meal at that table now. The canal does the rest.', client: 'The owners, Canal House',
  },
  {
    slug: 'northlight-loft', title: 'Northlight Loft', kind: 'Warehouse apartment', place: 'Manchester', year: '2024', area: '145 m²',
    scope: 'Layout, lighting, furniture and art',
    line: 'One big room, zoned by light and rugs instead of walls.',
    story: [
      'A former textile warehouse with a saw-tooth roof and the best north light in the city. The brief was a home for one person who cooks seriously, works from home twice a week and has friends to stay most weekends.',
      'We resisted the urge to build. Three freestanding pieces do the work of walls: a long kitchen island, a bookcase you can walk around and a bed platform with drawers underneath.',
      'The palette stays close to what was already there: brick, steel and timber, with wool and linen to take the echo out of the room.',
    ],
    materials: [['Reclaimed brick', '#a8674c'], ['Blackened steel', '#2f2d2a'], ['Douglas fir', '#c79f6b'], ['Undyed wool', '#ded6c7']],
    quote: 'It still feels like a warehouse. It just finally feels like mine.', client: 'The owner, Northlight Loft',
  },
  {
    slug: 'the-orchard', title: 'The Orchard', kind: 'Country house', place: 'Somerset', year: '2024', area: '320 m²',
    scope: 'Full renovation, kitchen, bathrooms, furniture',
    line: 'A farmhouse made warm, dry and bright without losing its creak.',
    story: [
      'Three generations use this house, sometimes all at once. It needed to sleep fourteen at Christmas and feel right for two in February.',
      'We insulated from the inside, relaid the flagstones over underfloor heating and rebuilt the kitchen around a table for twelve. The new work is plain on purpose, so the old beams and the deep window seats keep the attention.',
      'Colour came from the orchard itself: lichen green, bark brown, the off-white of blossom on an overcast day.',
    ],
    materials: [['Limewashed pine', '#d8c9a8'], ['Flagstone', '#8f8b82'], ['Lichen green', '#8a8f6a'], ['Unlacquered copper', '#b4764f']],
    quote: 'Fourteen of us at Christmas and nobody queued for a bathroom.', client: 'The family, The Orchard',
  },
  {
    slug: 'casa-arenal', title: 'Casa Arenal', kind: 'Seaside apartment', place: 'Lisbon', year: '2023', area: '95 m²',
    scope: 'Interior design, built-in furniture, styling',
    line: 'A small flat by the river, planned like the cabin of a very calm boat.',
    story: [
      'Ninety-five square metres, two bedrooms and a client who wanted space for a piano. Every wall had to earn its keep.',
      'Storage runs floor to ceiling along one side of the flat, hiding the wardrobe, the washing machine and a fold-down desk. The other side is left almost empty, so the light from the river can cross the whole apartment.',
      'Handmade tiles from Aveiro line the kitchen and the bathroom. Their slightly uneven glaze is the only pattern in the flat.',
    ],
    materials: [['Glazed tile', '#e4e0d4'], ['Ash veneer', '#d9c4a0'], ['Terracotta', '#b8694a'], ['Sea-blue linen', '#7f95a3']],
    quote: 'There is a place for everything, including the piano.', client: 'The owner, Casa Arenal',
  },
  {
    slug: 'reading-rooms', title: 'The Reading Rooms', kind: 'Boutique hotel', place: 'Edinburgh', year: '2023', area: '14 rooms',
    scope: 'Concept, guest rooms, lobby and bar',
    line: 'Fourteen bedrooms, each built around a chair you will not want to leave.',
    story: [
      'The owners inherited a Georgian townhouse and a library of nine thousand books. The hotel was designed around both.',
      'Every room has a reading chair by a window, a lamp at the right height and a shelf chosen by a local bookseller. The bar downstairs is panelled in dark oak and closes when the last guest goes up.',
      'We designed the chairs with a workshop in Fife and have since been asked for them so often that they are now made to order.',
    ],
    materials: [['Smoked oak', '#5b4636'], ['Bottle-green wool', '#3f4f43'], ['Antique brass', '#a5854a'], ['Parchment paint', '#ebe3d1']],
    quote: 'Guests ask where to buy the chairs before they ask about breakfast.', client: 'The owners, The Reading Rooms',
  },
  {
    slug: 'atelier-cafe', title: 'Atelier Café', kind: 'Café and bakery', place: 'Copenhagen', year: '2022', area: '80 m²',
    scope: 'Interior architecture, counter, lighting',
    line: 'Forty seats, one long counter and the smell of cardamom.',
    story: [
      'A bakery that sells out by eleven needed a room people would want to stay in after the buns were gone.',
      'The counter is a single run of pale terrazzo, cast on site. Behind it the ovens are on show; in front, a bench follows the window so that every seat faces either the street or the baking.',
      'Lighting is low, warm and dimmable to the hour: bright for the morning queue, soft for the afternoon laptops.',
    ],
    materials: [['Pale terrazzo', '#d9d3c7'], ['Birch ply', '#dcc59c'], ['Oxblood tile', '#7a3b33'], ['Brushed steel', '#9a9a96']],
    quote: 'People used to take their coffee away. Now we need more chairs.', client: 'The founder, Atelier Café',
  },
];

const SERVICES = [
  { title: 'Interior architecture', text: 'Layouts, structure, light and services: the decisions that are hard to change later. We work alongside your architect or lead the project ourselves.', points: ['Space planning', 'Lighting and electrical layouts', 'Planning and building control drawings'] },
  { title: 'Kitchens and joinery', text: 'Kitchens, wardrobes, libraries and the cupboard under the stairs, drawn to the millimetre and made by workshops we have used for years.', points: ['Bespoke kitchens', 'Fitted storage', 'Workshop drawings'] },
  { title: 'Furniture and styling', text: 'Sofas you can sleep on, tables that outlive you and the right lamp for the corner. We source, order, deliver and place every piece.', points: ['Furniture, fabric and lighting schedules', 'Art and objects', 'Installation day'] },
  { title: 'Project management', text: 'One person who knows the drawings, the budget and the builder. We visit site weekly and send you a short report every Friday.', points: ['Tendering', 'Weekly site visits', 'Budget tracking'] },
  { title: 'Hotels, cafés and shops', text: 'Rooms that have to earn a living. We design for the guest and for the person who cleans at six in the morning.', points: ['Concept and brand fit', 'Durable specifications', 'Phased openings'] },
  { title: 'A day of advice', text: 'Not every home needs a full project. Book a day and we will walk the rooms with you and leave a written plan.', points: ['On-site consultation', 'Written recommendations', 'Supplier list'] },
];

const PROCESS = [
  { n: '01', title: 'Listen', text: 'We visit, measure and ask how you actually live: who cooks, who is up first, where the bags get dropped. You get a written brief and a fee proposal within a week.' },
  { n: '02', title: 'Concept', text: 'Two or three directions with plans, references and materials you can touch. We choose one together and refine it until the budget and the drawings agree.' },
  { n: '03', title: 'Detail', text: 'Every junction, socket and handle is drawn and specified. Builders price the same complete set of information, so quotes can be compared.' },
  { n: '04', title: 'Build', text: 'We are on site every week, solve what the drawings could not foresee and keep you informed with one short report every Friday.' },
  { n: '05', title: 'Settle in', text: 'Furniture arrives, pictures are hung and beds are made. We return after three months to adjust whatever real life has shown us.' },
];

const STATS = [
  { number: '64', label: 'Homes and places completed' },
  { number: '12', label: 'Years of practice' },
  { number: '9', label: 'People in the studio' },
  { number: '4', label: 'Countries we have built in' },
];

const VALUES = [
  { title: 'Rooms before objects', text: 'Proportion, light and where the door goes matter more than any chair. We get those right first.' },
  { title: 'Made nearby', text: 'Most of what we fix to a wall is made within an hour of the site, by people whose workshops we have visited.' },
  { title: 'Honest numbers', text: 'A budget on day one, tracked every month. If something costs more, you hear it from us before you see it on an invoice.' },
];

const TEAM = [
  { name: 'Marta Lind', role: 'Founder, interior architect', bio: 'Trained as an architect in Gothenburg and spent eight years on other people’s houses before starting the studio.' },
  { name: 'Jonas Reed', role: 'Design director', bio: 'Leads concept work and keeps a library of 2,000 material samples in alphabetical order.' },
  { name: 'Aiko Tanaka', role: 'Furniture and styling', bio: 'Finds the chair. Has an unreasonable number of contacts in Danish auction houses.' },
  { name: 'Sam Okoro', role: 'Project lead', bio: 'On site every week. Builders like him, which is rarer than it sounds.' },
];

const TESTIMONIALS = [
  { quote: 'They heard what we could not put into words, and then drew it.', name: 'Hannah and Luke', detail: 'Canal House' },
  { quote: 'On budget, on time, and kinder to our builder than we were.', name: 'Priya', detail: 'Northlight Loft' },
  { quote: 'Two years on, we have not moved a single piece of furniture.', name: 'The Aldous family', detail: 'The Orchard' },
];

// invented titles: no real magazine is named
const PRESS = ['Field & Form', 'Hearth Quarterly', 'The Interior Review', 'Slow Rooms', 'North Light Journal'];

const FAQ = [
  { q: 'What does a project cost?', a: 'For a full renovation our fee is usually between 10 and 14 per cent of the building cost, agreed as a fixed sum once the scope is clear. Furniture-only projects are charged by the room. A day of advice is a flat fee.' },
  { q: 'How long does it take?', a: 'A whole house takes about four months to design and six to nine to build. A single room can be done in ten weeks. We give you a programme with the fee proposal.' },
  { q: 'Do you work outside London?', a: 'Yes. About half our projects are elsewhere in Britain and a few are abroad. Travel is charged at cost.' },
  { q: 'Can you work with my architect or builder?', a: 'Gladly. We often join a team that is already in place, and we can also recommend people we trust.' },
  { q: 'Is my project too small?', a: 'Probably not. We have designed a single bookcase and a hotel in the same year. If we are not the right fit we will say so and suggest someone who is.' },
];

// only for the starter plugin and the local test site
const POSTS = [
  {
    title: 'How to choose a white that isn’t cold', image: 'journal-1.jpg',
    text: 'White paint is never just white. A short guide to undertones, daylight and why the sample card lies.',
    body: [
      ['p', 'Every white has a colour hiding in it. Hold three sample cards against a sheet of printer paper and you will see it at once: one leans yellow, one pink, one green. That hidden colour is the undertone, and it decides whether a room feels warm or like the inside of a fridge.'],
      ['h', 'Start with the light, not the paint'],
      ['p', 'North-facing rooms get cool, bluish daylight all day. A white with a little yellow or red in it will balance that; a pure brilliant white will look grey by mid-afternoon. South-facing rooms are the opposite: they can take cooler whites without feeling cold.'],
      ['h', 'Test it large and test it late'],
      ['p', 'Paint a sheet of lining paper, at least half a metre square, and move it around the room for two days. Look at it at breakfast and again with the lamps on. The white you like at noon is not always the one you like at nine in the evening.'],
      ['h', 'Keep the ceiling in the family'],
      ['p', 'A ceiling in a different white from the walls draws a line where you do not want one. Use the same colour, or the same colour mixed a quarter lighter, and the room will feel taller.'],
    ],
  },
  {
    title: 'What a renovation really costs, and where not to save', image: 'journal-2.jpg',
    text: 'The honest version: where the money goes, what to protect and the three savings people regret.',
    body: [
      ['p', 'Most budgets fail in the same place: the things nobody photographs. Drainage, wiring, insulation and plaster take more than half the cost of a typical renovation and none of them appear on a mood board.'],
      ['h', 'Where the money goes'],
      ['p', 'As a rough guide for an older house: a third on structure and envelope, a third on services and finishes, a fifth on kitchen and bathrooms, and the rest on fees, furniture and the surprise behind the wall. There is always a surprise behind the wall.'],
      ['h', 'Three savings people regret'],
      ['p', 'Cheap windows, too few sockets and no storage. You will touch a window handle every day for thirty years. Sockets cost little now and a great deal later. And a house without cupboards never looks finished, however good the sofa.'],
      ['h', 'Where you can save'],
      ['p', 'Tiles, taps and handles vary enormously in price and far less in quality. Spend on what is fixed and hard to change; be relaxed about what can be swapped in an afternoon.'],
    ],
  },
  {
    title: 'Six questions to ask before you hire an interior designer', image: 'journal-3.jpg',
    text: 'Including the one about money that most people are too polite to ask.',
    body: [
      ['p', 'A good first meeting is a two-way interview. Here is what we would ask if we were on your side of the table.'],
      ['h', 'Who will actually work on my project?'],
      ['p', 'In a small studio the person you meet is the person who draws. In a larger one, ask to meet the team. Either can be right; you just want to know.'],
      ['h', 'How do you charge, and what is not included?'],
      ['p', 'Fixed fee, percentage or hourly: each has its place. The important part is the second half of the question. Ask about travel, revisions and whether there is a mark-up on furniture.'],
      ['h', 'Can I talk to a client whose project went wrong?'],
      ['p', 'Every project has a bad week. How the designer handled it tells you more than any portfolio.'],
      ['h', 'What would you do with our budget if it were your house?'],
      ['p', 'The answer shows you their priorities. If it starts with the sofa, keep looking.'],
    ],
  },
];

// alt texts and material names come with the photos (tools/photos.py)
let PHOTOS = {};
try { PHOTOS = require('./photos.json'); } catch (error) { PHOTOS = {}; }
const IMAGES = Object.fromEntries(Object.entries(PHOTOS).map(([file, photo]) => [file, photo.alt || '']));
const MATERIALS = Object.entries(PHOTOS).filter(([, photo]) => photo.name).map(([file, photo]) => ({ file, name: photo.name }));

module.exports = { STUDIO, PROJECTS, SERVICES, PROCESS, STATS, VALUES, TEAM, TESTIMONIALS, PRESS, FAQ, POSTS, IMAGES, MATERIALS, PHOTOS };
