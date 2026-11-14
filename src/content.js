/**
 * Demo copy for the theme. Edit here and run `npm run build`, or change the texts in the Site Editor.
 *
 * The clinic is invented: a small studio in Springfield with four clinicians. The texts are
 * written the way a real practice would write them, so the pages read well before the buyer
 * has changed a word.
 */

/**
 * Treatments. Each one gets a card on the Home and Services pages and its own page
 * (/services/<slug>/). `expect` and `reasons` fill the page, `facts` the "At a glance" box,
 * `plans` add a pricing section. `alt` describes assets/images/<slug>.jpg.
 */
const SERVICES = [
  {
    slug: 'general-dentistry', title: 'General Dentistry', alt: 'A toothbrush with a stripe of blue toothpaste',
    text: 'Check-ups, cleanings and fillings: the unglamorous visits that save you from the expensive ones.',
    headline: 'The check-up that keeps the rest simple',
    lead: 'A thorough exam, a professional cleaning and small repairs before they turn into big ones. Most people need us twice a year, for well under an hour.',
    expect: [
      'We start by asking what has changed since last time. Then your dentist checks every tooth, your gums and your bite, and takes X-rays only when there is a reason to.',
      'Your hygienist removes the plaque and tartar that brushing can’t reach and shows you the spots you are missing. If you need a small filling, we can often do it in the same visit.',
    ],
    reasons: ['It has been more than six months since your last visit', 'Your gums bleed when you brush', 'A tooth is sensitive to hot or cold', 'You simply want to know everything is fine'],
    facts: [['Appointment', '45 minutes'], ['How often', 'Every 6 months'], ['Suitable for', 'All ages'], ['From', '$95']],
  },
  {
    slug: 'cosmetic-dentistry', title: 'Cosmetic Dentistry', alt: 'Close-up of a bright, even smile',
    text: 'Veneers, bonding and reshaping, planned on photos of your own face so you see the result before we start.',
    headline: 'Change what bothers you, keep what’s yours',
    lead: 'Chipped edges, gaps, stains that whitening can’t shift. We plan every change on photos of your own face first, so nothing comes as a surprise.',
    expect: [
      'The first appointment is a conversation. We take photos and a scan, you tell us what you would change, and we show you a preview on screen. Sometimes the answer is one small repair rather than eight veneers, and we will say so.',
      'Bonding is usually finished in a single visit, with no drilling. Veneers take two or three: one to prepare the teeth and fit temporaries, one to fit the final ceramic.',
    ],
    reasons: ['A chipped or worn front tooth', 'Small gaps you have never liked', 'Stains that whitening does not remove', 'Teeth that look uneven in photos'],
    facts: [['Visits', '1 to 3'], ['Time off needed', 'None'], ['Results last', '10 years or more'], ['From', '$350 per tooth']],
  },
  {
    slug: 'dental-implants', title: 'Dental Implants', alt: 'Dental instruments laid out before a treatment',
    text: 'A fixed replacement for a missing tooth. It looks natural and you brush it like any other.',
    headline: 'A missing tooth, replaced for good',
    lead: 'An implant is a small titanium post that takes the place of the root, with a ceramic crown on top. Done well, it is the closest thing to getting your own tooth back.',
    expect: [
      'We begin with a 3D scan to measure the bone and plan the exact position. Placing the implant takes about an hour under local anesthetic, and most people are back at work the next day.',
      'The implant then needs three to four months to bond with the bone. You wear a temporary tooth in the meantime and come back for your custom crown once everything has healed.',
    ],
    reasons: ['You have lost one or more teeth', 'A denture or bridge feels loose', 'You want something fixed, not removable', 'Your gums are healthy, or can be treated first'],
    facts: [['Surgery', 'About 1 hour'], ['Healing', '3 to 4 months'], ['Lasts', '20 years or more'], ['From', '$1,900']],
    plans: [
      { name: 'Single implant', price: '$1,900', note: 'per tooth', items: ['3D scan and treatment plan', 'Titanium implant', 'Custom ceramic crown', 'Two follow-up visits'] },
      { name: 'Implant bridge', price: '$4,800', note: 'from', items: ['Replaces 3 or 4 teeth', 'Two implants', 'Fixed ceramic bridge', 'Five-year guarantee'], featured: true },
      { name: 'Full arch', price: '$12,500', note: 'from', items: ['A complete upper or lower arch', 'Four to six implants', 'Temporary teeth the same day', 'Payments spread over 24 months'] },
    ],
  },
  {
    slug: 'teeth-whitening', title: 'Teeth Whitening', alt: 'Close-up of white teeth',
    text: 'One visit of about an hour. We check your enamel first and tell you honestly how white is realistic.',
    headline: 'A few shades lighter in about an hour',
    lead: 'Coffee, tea, red wine and time all leave their mark. Professional whitening lifts those stains safely, and we tell you beforehand how much difference to expect.',
    expect: [
      'We check your teeth and gums, note your starting shade and protect your gums with a barrier. The whitening gel goes on in three rounds of 15 minutes. Bring headphones.',
      'Some sensitivity for a day or two is normal and passes on its own. You go home with custom trays and a little gel for top-ups, which keeps the result going for a year or two.',
    ],
    reasons: ['Your teeth have yellowed over the years', 'You have an event coming up', 'Whitening toothpaste has not done much', 'You have no untreated cavities or gum problems'],
    facts: [['Appointment', '60 to 75 minutes'], ['Time off needed', 'None'], ['Results last', '1 to 2 years'], ['From', '$290']],
  },
  {
    slug: 'orthodontics', title: 'Orthodontics', alt: 'A retainer on a plaster model of the teeth',
    text: 'Clear aligners and braces for teens and adults, with a quick check every six to eight weeks.',
    headline: 'Straighter teeth, on your schedule',
    lead: 'Clear aligners you take out to eat, or modern fixed braces when they will do a better job. Dr. Marin plans both from a 3D scan and shows you the expected result first.',
    expect: [
      'At the first visit we scan your teeth (no putty), take photos and talk about what you would like to change. A week later you see a step-by-step simulation and a fixed price.',
      'Aligners are worn about 22 hours a day and swapped every one to two weeks. We check progress every six to eight weeks in a 15-minute visit, and fit a retainer at the end so everything stays put.',
    ],
    reasons: ['Crowded or overlapping teeth', 'Gaps between your teeth', 'Teeth that have moved since you had braces', 'An overbite or underbite, in teens or adults'],
    facts: [['Treatment', '6 to 18 months'], ['Check-ups', 'Every 6 to 8 weeks'], ['Suitable for', 'Ages 12 and up'], ['From', '$2,400']],
  },
  {
    slug: 'emergency-care', title: 'Emergency Care', alt: 'The lamp above a dental chair',
    text: 'Toothache, swelling or a broken tooth: call before 3pm and we will see you the same day.',
    headline: 'In pain? We’ll see you today',
    lead: 'We keep appointments free every day for exactly this. Call before 3pm and you will be seen the same day, whether or not you are already a patient.',
    expect: [
      'Tell us on the phone what happened and we will tell you what to do until you get here. In the chair, the first job is to get you out of pain. Then we find the cause and explain your options.',
      'Often we can fix the problem on the spot. If it needs a second visit, you leave comfortable, with a clear plan and a price.',
    ],
    reasons: ['Toothache that keeps you awake', 'A swollen face or gum', 'A broken, cracked or knocked-out tooth', 'A lost filling or crown'],
    facts: [['Response', 'Same day'], ['Call before', '3pm'], ['Open', 'Monday to Saturday'], ['From', '$120']],
  },
];

const TEAM = [
  { name: 'Dr. Elena Marsh', role: 'Lead dentist & founder', bio: 'Opened Perla in 2010. Sees nervous patients first thing in the morning, when the studio is quiet.' },
  { name: 'Dr. Daniel Okafor', role: 'Implant dentist', bio: 'Places and restores implants, and explains every step on a model before he starts.' },
  { name: 'Dr. Sofia Marin', role: 'Orthodontist', bio: 'Aligners and braces for teens and adults. In the studio on Tuesdays and Thursdays.' },
  { name: 'Maya Chen', role: 'Dental hygienist', bio: 'Cleanings and gum care. Her regulars say she has the lightest hands in Springfield.' },
];

const TESTIMONIALS = [
  { quote: 'I hadn’t seen a dentist in nine years and expected a lecture. Dr. Marsh just asked what had kept me away, and we went from there. Three visits later, I’m all caught up.', name: 'Hannah R.', initials: 'HR', detail: 'Patient since 2019' },
  { quote: 'Chipped a front tooth on a Friday afternoon. They saw me at 4:30 and I walked out an hour later with it fixed.', name: 'Marcus T.', initials: 'MT', detail: 'Emergency visit' },
  { quote: 'Our two kids ask when they are going back. I don’t fully understand it, but I’ll take it.', name: 'Priya K.', initials: 'PK', detail: 'Family of four' },
];

const FAQ = [
  { q: 'Are you taking new patients?', a: 'Yes. Book online or call us and we will send you a short health form you can fill in on your phone. A first visit takes about 45 minutes.' },
  { q: 'Do you take my insurance?', a: 'We are in network with most major dental plans and file the claim for you. No insurance? Our membership plan covers two check-ups and two cleanings a year for a flat fee.' },
  { q: 'I’m in pain. How fast can you see me?', a: 'Call as soon as we open. If you call before 3pm we will see you the same day, even if you are not a patient yet.' },
  { q: 'How often do I really need a check-up?', a: 'Every six months suits most people. If your teeth and gums are in good shape we may suggest once a year; if you have gum disease, more often.' },
  { q: 'Is whitening safe?', a: 'Done by a dental team, yes. We check your teeth and gums first, and we will tell you if whitening won’t work on a crown or a filling.' },
  { q: 'What if I’m nervous?', a: 'Tell us when you book. We will give you a longer appointment, explain everything before we touch anything, and stop whenever you raise a hand.' },
];

const STEPS = [
  { n: '01', title: 'Book a time', text: 'Online or by phone. New patients usually get an appointment within the week, and we text you a reminder the day before.' },
  { n: '02', title: 'Meet your dentist', text: '45 minutes for a full check, X-rays if you need them and time for your questions. Bring a list.' },
  { n: '03', title: 'Get a written plan', text: 'You leave knowing what we found, what we would do about it and what it costs. Then you decide.' },
];

const STATS = [
  { number: '16', label: 'Years on Harbor Street' },
  { number: '4', label: 'Clinicians, the same faces every visit' },
  { number: '4.9', label: 'Average of 312 patient reviews' },
  { number: '45', label: 'Minutes for a first visit, never rushed' },
];

const VALUES = [
  { title: 'Time', text: 'First visits are 45 minutes and nobody is double-booked. If we run late, it is because someone needed us.' },
  { title: 'Straight answers', text: 'You see your X-rays, hear the options, including doing nothing, and get the price in writing.' },
  { title: 'Skills kept current', text: 'Every clinician here does at least 40 hours of training a year. Dentistry moves fast and so do we.' },
];

const SOCIAL = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
];

/**
 * Sample articles for the local test site (bin/setup.sh), so the blog sections have something to show.
 * `body` is a list of [type, text] pairs: 'p' for a paragraph, 'h' for a heading.
 */
const POSTS = [
  {
    title: 'How often should you really see the dentist?', image: 'blog-1.jpg',
    text: 'Every six months is a good rule, but it is not right for everyone. Here is how we decide what to recommend.',
    body: [
      ['p', '“Every six months” is the answer most of us grew up with. It is a sensible default, but it is a default: the right gap between check-ups depends on your mouth, not on the calendar.'],
      ['h', 'Why six months is the usual advice'],
      ['p', 'Tooth decay and gum disease are slow and mostly painless at first. Twice a year is often enough to catch a small cavity while it still needs a small filling, and to remove the tartar that brushing can’t shift.'],
      ['h', 'When you may need to come more often'],
      ['p', 'Some mouths need closer attention: if you have had gum disease, if you smoke or have diabetes (both raise the risk of gum problems), if you get new cavities most years, or while you wear braces or aligners. In these cases we usually suggest a visit every three or four months, at least for a while.'],
      ['h', 'When once a year can be enough'],
      ['p', 'If you haven’t needed a filling in years, your gums don’t bleed and you clean between your teeth every day, an annual check-up may be all you need. We will tell you if that is you.'],
      ['h', 'Don’t wait for your next appointment if…'],
      ['p', 'Pain that lasts more than a day or two, bleeding gums, a broken tooth or a mouth ulcer that hasn’t healed after three weeks are all reasons to call us now rather than at your next check-up.'],
    ],
  },
  {
    title: 'Teeth whitening: what actually happens in the chair', image: 'blog-2.jpg',
    text: 'How whitening at the dentist works, how long it lasts and what it can’t do. No sales pitch.',
    body: [
      ['p', 'Whitening is the cosmetic treatment we are asked about most, and the one with the most myths attached. Here is what an appointment really involves.'],
      ['h', 'Before we start'],
      ['p', 'We check your teeth and gums first. A cavity or inflamed gums need treating before whitening, otherwise the gel can sting. We also note your starting shade, so you can compare afterwards.'],
      ['h', 'The appointment'],
      ['p', 'We protect your gums, then apply a whitening gel to the front of your teeth for about 15 minutes. That is repeated two or three times. The whole visit takes a little over an hour, and most people spend it with headphones on.'],
      ['h', 'What it can’t do'],
      ['p', 'Whitening lightens natural enamel. It does not change the color of crowns, veneers or fillings, so if you have one on a front tooth we will talk about that beforehand. Gray or very dark stains respond less than yellow ones.'],
      ['h', 'Afterwards'],
      ['p', 'Teeth can feel sensitive to cold for a day or two. For the first 48 hours, go easy on coffee, tea, red wine and anything else that would stain a white shirt. With good brushing and an occasional top-up at home, results usually last one to two years.'],
    ],
  },
  {
    title: 'Five small habits for healthier gums', image: 'blog-3.jpg',
    text: 'Bleeding when you brush is not normal, but it is usually fixable. These five habits make the biggest difference.',
    body: [
      ['p', 'Gum disease is one of the main reasons adults lose teeth, and in its early stage it rarely hurts. The good news: early gum disease can be reversed, and most of the fix is what you do at home.'],
      ['h', '1. Brush for two minutes, twice a day'],
      ['p', 'Use a soft brush or an electric one and angle the bristles toward the gum line. Scrubbing harder does not clean better. It just wears the gums away.'],
      ['h', '2. Clean between your teeth every day'],
      ['p', 'Floss or interdental brushes reach the part of each tooth your toothbrush misses. Most people find the little brushes easier: ask us which size fits.'],
      ['h', '3. Spit, don’t rinse'],
      ['p', 'Rinsing with water straight after brushing washes the fluoride away. Spit out the extra toothpaste and leave the rest to do its work.'],
      ['h', '4. Don’t ignore bleeding'],
      ['p', 'Gums that bleed need more cleaning, not less. If they still bleed after two weeks of careful brushing, book a visit.'],
      ['h', '5. Keep your hygiene appointments'],
      ['p', 'Once plaque hardens into tartar, only a professional cleaning removes it. For most people that means every six months.'],
      ['p', 'And if you smoke, quitting is the single best thing you can do for your gums. We are happy to point you to local support.'],
    ],
  },
];

module.exports = { SERVICES, TEAM, TESTIMONIALS, FAQ, STEPS, STATS, VALUES, SOCIAL, POSTS };
