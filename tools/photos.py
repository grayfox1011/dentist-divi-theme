#!/usr/bin/env python3
"""Prepares the demo photos of the theme (theme/perla-child/demo/images).

    python3 tools/photos.py            download what is missing, then crop and export every photo
    python3 tools/photos.py hero team  only these photos (keys of src/photos.json)

Each photo in src/photos.json names a picture on Pexels ("pexels": its number in the address of
the photo page), the size the layouts need, the point of the picture to keep in the middle
("focus": 0 to 1 across and down) and how far to zoom in (1 = the largest crop that fits).

To use another picture: change "pexels", "by" and "title", run this script, look at the result
and adjust "focus" and "zoom". Then run `npm run build`, which also rewrites CREDITS.txt.

The originals are kept in .photos-cache/ (not committed). Needs Pillow and NumPy:
    pip install pillow numpy
"""
import json
import os
import sys
import urllib.request

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, '.photos-cache')
OUT = os.path.join(ROOT, 'theme', 'perla-child', 'demo', 'images')
SOURCE = 'https://images.pexels.com/photos/{id}/pexels-photo-{id}.jpeg?cs=srgb&fm=jpg&q=90&w=2600'
QUALITY = 80


def original(pexels_id):
    """Returns the picture as downloaded from Pexels, fetching it the first time."""
    path = os.path.join(CACHE, f'{pexels_id}.jpg')
    if not os.path.exists(path):
        os.makedirs(CACHE, exist_ok=True)
        request = urllib.request.Request(SOURCE.format(id=pexels_id), headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(request, timeout=120) as response, open(path, 'wb') as file:
            file.write(response.read())
    return Image.open(path).convert('RGB')


def crop(picture, size, focus, zoom):
    """Cuts the largest area of the wanted shape around the focus point and resizes it."""
    width, height = size
    full_w, full_h = picture.size
    ratio = width / height
    crop_w = min(full_w, full_h * ratio) * zoom
    crop_h = crop_w / ratio
    left = min(max(focus[0] * full_w - crop_w / 2, 0), full_w - crop_w)
    top = min(max(focus[1] * full_h - crop_h / 2, 0), full_h - crop_h)
    box = tuple(int(round(v)) for v in (left, top, left + crop_w, top + crop_h))
    return picture.crop(box).resize((width, height), Image.LANCZOS)


def stained_teeth(picture):
    """The "before" of the before / after pair: the same smile with darker, yellower teeth.

    A demo illustration, not a clinical case. The numbers fit the smile photo of the demo:
    another picture needs its own mouth area.
    """
    rgb = np.asarray(picture).astype(np.float32) / 255.0
    hsv = np.asarray(picture.convert('HSV')).astype(np.float32) / 255.0
    saturation, value = hsv[..., 1], hsv[..., 2]
    height, width = saturation.shape
    ys, xs = np.mgrid[0:height, 0:width]

    # Teeth are bright and almost colourless. The pink highlights on the lips are left out.
    mouth = (xs > width * 0.14) & (xs < width * 0.62) & (ys > height * 0.38) & (ys < height * 0.545)
    neutral = (rgb[..., 0] - rgb[..., 1]) < 0.07
    mask = ((value > 0.62) & (saturation < 0.22) & neutral & mouth).astype(np.uint8) * 255
    mask = np.asarray(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(2.2))).astype(np.float32) / 255.0
    mask = np.clip(mask * 1.1, 0, 1)[..., None]

    tint = np.array([0.94, 0.875, 0.69], dtype=np.float32)
    result = rgb * (1 - mask) + rgb * tint * mask
    return Image.fromarray((np.clip(result, 0, 1) * 255).astype(np.uint8))


def main():
    with open(os.path.join(ROOT, 'src', 'photos.json'), encoding='utf-8') as file:
        photos = json.load(file)

    wanted = sys.argv[1:] or list(photos)
    total = 0
    for key in wanted:
        photo = photos[key]
        picture = crop(original(photo['pexels']), photo['size'], photo['focus'], photo['zoom'])
        if photo.get('retouch') == 'stained-teeth':
            picture = stained_teeth(picture)
        path = os.path.join(OUT, photo['file'])
        picture.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True, subsampling='4:2:0')
        size = os.path.getsize(path)
        total += size
        print(f"{photo['file']:26} {photo['size'][0]}x{photo['size'][1]}  {size / 1024:4.0f} KB")
    print(f'{len(wanted)} photos, {total / 1024:.0f} KB')


if __name__ == '__main__':
    main()
