/**
 * Demo images. The layouts ship with lightweight, licence-free SVG placeholders (inlined as
 * data URIs, so nothing has to be uploaded on import). Replace them with real photos in Divi.
 */
const TOOTH = 'M50 14C39 14 31 5 20 7 8 9 3 22 5 35c2 14 6 23 8 37 2 14 6 24 12 24 9 0 7-25 15-33 5-5 15-5 20 0 8 8 6 33 15 33 6 0 10-10 12-24 2-14 6-23 8-37 2-13-3-26-15-28-11-2-19 7-30 7z';

const uri = svg => `data:image/svg+xml;base64,${Buffer.from(svg.replace(/\n\s*/g, '')).toString('base64')}`;

const PALETTES = {
  blue: ['#dbe9ff', '#b9d4ff', '#1a66e8'],
  mint: ['#d9f5f1', '#b4ebe3', '#12b5a5'],
  navy: ['#1c3566', '#0b1b3f', '#7fb0ff'],
  sand: ['#f3eee6', '#e6dccb', '#b08a55'],
};

/** Photo placeholder: soft gradient, abstract shapes and a discreet "replace me" label. */
function photo(w, h, label = 'Your photo here', tone = 'blue') {
  const [a, b, ink] = PALETTES[tone];
  const m = Math.min(w, h);
  const id = `g${w}x${h}${tone}`;
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${id})"/>
    <circle cx="${w * 0.82}" cy="${h * 0.2}" r="${m * 0.34}" fill="#ffffff" fill-opacity="0.28"/>
    <circle cx="${w * 0.12}" cy="${h * 0.9}" r="${m * 0.42}" fill="#ffffff" fill-opacity="0.2"/>
    <g transform="translate(${w / 2 - m * 0.16} ${h / 2 - m * 0.19}) scale(${(m * 0.32) / 100})"><path d="${TOOTH}" fill="#ffffff" fill-opacity="0.85"/></g>
    <text x="${w / 2}" y="${h / 2 + m * 0.2 + 26}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(13, Math.round(m * 0.035))}" font-weight="600" fill="${ink}" fill-opacity="0.75">${label} · ${w} × ${h}</text>
  </svg>`);
}

/** Portrait placeholder for team members and testimonials. */
function portrait(w, h, tone = 'blue') {
  const [a, b] = PALETTES[tone];
  const id = `p${w}x${h}${tone}`;
  return uri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="${w}" height="${h}" fill="url(#${id})"/>
    <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.17}" fill="#ffffff" fill-opacity="0.9"/>
    <path d="M${w * 0.16} ${h}c0-${h * 0.3} ${w * 0.14}-${h * 0.36} ${w * 0.34}-${h * 0.36}s${w * 0.34} ${h * 0.06} ${w * 0.34} ${h * 0.36}z" fill="#ffffff" fill-opacity="0.9"/>
  </svg>`);
}

module.exports = { photo, portrait, TOOTH, uri };
