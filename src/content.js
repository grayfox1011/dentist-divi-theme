/** Demo copy for the theme. Edit here (or directly in Divi after importing). */
/**
 * Treatments. Each one gets a card on the Home and Services pages and its own page
 * (/services/<slug>/). `facts` fill the "At a glance" box; `plans` add a pricing section.
 */
const SERVICES = [
  {
    slug: 'general-dentistry', icon: '&#xf5c9;', title: 'General Dentistry',
    text: 'Check-ups, cleanings and fillings that keep your teeth healthy for life.',
    headline: 'Healthy teeth, one check-up at a time',
    lead: 'Regular examinations, professional cleaning and gentle fillings. Preventive care is the simplest way to avoid bigger treatments later.',
    facts: [['Appointment', '30–45 minutes'], ['Recommended', 'Every 6 months'], ['Suitable for', 'All ages'], ['From', '$80']],
  },
  {
    slug: 'cosmetic-dentistry', icon: '&#xf3a5;', title: 'Cosmetic Dentistry',
    text: 'Veneers, bonding and smile design tailored to the shape of your face.',
    headline: 'A smile designed around you',
    lead: 'Veneers, bonding and contouring planned with digital previews, so you can see your new smile before treatment begins.',
    facts: [['Treatment time', '1–3 visits'], ['Recovery', 'None'], ['Results last', '10+ years'], ['From', '$350']],
  },
  {
    slug: 'dental-implants', icon: '&#xf62e;', title: 'Dental Implants',
    text: 'Permanent, natural-looking replacements for one or several missing teeth.',
    headline: 'A permanent fix for missing teeth',
    lead: 'Dental implants look, feel and work like natural teeth. Placed in our studio by an implant specialist, they are designed to last for decades.',
    facts: [['Treatment time', '2–3 visits'], ['Recovery', '2–5 days'], ['Results last', '20+ years'], ['From', '$1,900']],
    plans: [
      { name: 'Single implant', price: '$1,900', note: 'per tooth', items: ['3D scan and treatment plan', 'Titanium implant', 'Custom ceramic crown', 'Two follow-up visits'] },
      { name: 'Implant bridge', price: '$4,800', note: 'from', items: ['Replaces 3–4 teeth', 'Two implants', 'Fixed ceramic bridge', 'Five-year guarantee'], featured: true },
      { name: 'Full arch', price: '$12,500', note: 'from', items: ['Complete upper or lower arch', 'Four to six implants', 'Same-day temporary teeth', 'Interest-free plans'] },
    ],
  },
  {
    slug: 'teeth-whitening', icon: '&#xf0d0;', title: 'Teeth Whitening',
    text: 'Safe in-studio whitening that brightens your smile in a single visit.',
    headline: 'A brighter smile in a single visit',
    lead: 'Professional whitening that lifts years of staining in about an hour, with products chosen to protect your enamel.',
    facts: [['Treatment time', '60 minutes'], ['Recovery', 'None'], ['Results last', '1–2 years'], ['From', '$290']],
  },
  {
    slug: 'orthodontics', icon: '&#xf62f;', title: 'Orthodontics',
    text: 'Clear aligners and modern braces for teens and adults, without the fuss.',
    headline: 'Straighter teeth, without the fuss',
    lead: 'Clear aligners and discreet braces for teens and adults, planned with a 3D scan and checked at short, regular visits.',
    facts: [['Treatment time', '6–18 months'], ['Check-ups', 'Every 6–8 weeks'], ['Suitable for', 'Teens and adults'], ['From', '$2,400']],
  },
  {
    slug: 'emergency-care', icon: '&#xf479;', title: 'Emergency Care',
    text: 'Toothache or a chipped tooth? We keep same-day slots free for urgent care.',
    headline: 'In pain? We will see you today',
    lead: 'Severe toothache, swelling or a broken tooth should not wait. Call us and we will find you a same-day appointment.',
    facts: [['Response', 'Same day'], ['Open', 'Mon–Sat'], ['Suitable for', 'All ages'], ['From', '$120']],
  },
];

const TEAM = [
  { name: 'Dr. Elena Marsh', role: 'Lead Dentist & Founder', tone: 'blue' },
  { name: 'Dr. Daniel Okafor', role: 'Implant Specialist', tone: 'mint' },
  { name: 'Dr. Sofia Lindqvist', role: 'Orthodontist', tone: 'blue' },
  { name: 'Maya Chen', role: 'Dental Hygienist', tone: 'mint' },
];

const TESTIMONIALS = [
  { quote: 'I used to dread the dentist. The team here explained every step and I felt at ease from the moment I walked in.', name: 'Hannah R.', detail: 'Patient since 2019' },
  { quote: 'My implant looks and feels exactly like a real tooth. The whole process was far easier than I expected.', name: 'Marcus T.', detail: 'Dental implant' },
  { quote: 'Our kids actually look forward to their check-ups. Friendly, patient and always on time.', name: 'Priya & Sam K.', detail: 'Family care' },
];

const FAQ = [
  { q: 'Do you accept new patients?', a: 'Yes, we are always happy to welcome new patients of all ages. You can book your first visit online or by phone, and we will send you a short form to complete before you arrive.' },
  { q: 'Which insurance plans do you work with?', a: 'We work with most major dental insurance providers and file claims on your behalf. Not insured? Ask us about our in-house membership plan and interest-free payment options.' },
  { q: 'What should I do in a dental emergency?', a: 'Call us straight away. We keep same-day appointments available for urgent cases such as severe toothache, swelling or a broken tooth.' },
  { q: 'How often should I have a check-up?', a: 'For most people we recommend a check-up and professional cleaning every six months. Your dentist will suggest a schedule based on your oral health.' },
  { q: 'Is teeth whitening safe?', a: 'Professional whitening is safe when carried out by a dental team. We check your teeth and gums first and use products that protect your enamel.' },
];

const STEPS = [
  { n: '01', title: 'Book your visit', text: 'Choose a time online or call us. New patients are usually seen within the week.' },
  { n: '02', title: 'Meet your dentist', text: 'A relaxed first appointment with a full examination and digital X-rays if needed.' },
  { n: '03', title: 'Get your plan', text: 'A clear treatment plan with costs explained up front. No surprises, no pressure.' },
];

const STATS = [
  { number: '15+', label: 'Years caring for local families' },
  { number: '12k', label: 'Smiles treated and counting' },
  { number: '4.9', label: 'Average rating from our patients' },
  { number: '98%', label: 'Would recommend us to a friend' },
];

const SOCIAL = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'youtube', label: 'YouTube' },
];

module.exports = { SERVICES, TEAM, TESTIMONIALS, FAQ, STEPS, STATS, SOCIAL };
