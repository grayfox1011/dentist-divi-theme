/**
 * Demo photos (theme/perla-child/demo/images).
 *
 * The layouts point to the copy inside the theme folder, so they show a photo wherever they
 * are imported. When the child theme installs the demo site it adds the photos to the Media
 * Library and points the pages to those copies instead (inc/demo-import.php).
 *
 * All photos come from Pexels (https://www.pexels.com/license/). To change one, replace the
 * file (same name, same size), or edit photos.json and run tools/photos.py.
 */
const DIR = '/wp-content/themes/perla-child/demo/images/';

/**
 * The list of photos: file, size in pixels, Pexels id, photographer, title in the Media Library
 * and how the picture is cropped (see tools/photos.py).
 */
const PHOTOS = require('./photos.json');

/** Image settings for a Divi module: address plus the size of the file, as Divi stores them. */
function photo(key) {
  const p = PHOTOS[key];
  if (!p) throw new Error(`Unknown photo: ${key}`);
  return { src: DIR + p.file, width: String(p.size[0]), height: String(p.size[1]) };
}

const source = p => `https://www.pexels.com/photo/${p.pexels}/`;

/** What the child theme needs to add the photos to the Media Library. */
const manifest = () => Object.values(PHOTOS).map(p => ({ file: p.file, title: p.title, credit: `Photo by ${p.by} on Pexels` }));

/** The list of sources shipped next to the files. */
function credits() {
  const rows = Object.values(PHOTOS).map(p => `${p.file.padEnd(24)} ${p.by.padEnd(22)} ${source(p)}`);
  return [
    'Demo photos of the Perla theme',
    '==============================',
    '',
    'These pictures are placeholders. Replace them with photos of your own clinic and team.',
    '',
    'They come from Pexels and are used under the Pexels licence (https://www.pexels.com/license/):',
    'free to use, attribution not required. They have been cropped and resized. Read the licence',
    'before you use them anywhere else. They are not covered by the GPL licence of the theme code.',
    '',
    'smile-before.jpg is the same photo as smile-after.jpg with the teeth retouched to look',
    'darker. It only shows how the before / after slider works: it is not a real clinical case.',
    '',
    'The people shown are models. Do not present them as members of your team or as your patients.',
    '',
    `${'File'.padEnd(24)} ${'Photographer'.padEnd(22)} Source`,
    ...rows,
    '',
  ].join('\n');
}

module.exports = { PHOTOS, DIR, photo, manifest, credits };
