#!/usr/bin/env python3
"""Prepares the photographs of the theme: theme/perla/assets/images/*.jpg.

Every photograph comes from PxHere and is released under Creative Commons CC0, so it can be
shipped with a GPL theme. The page of each one is https://pxhere.com/en/photo/<id>; the list
with the licences is in theme/perla/readme.txt.

Put the downloaded originals in .photos-cache/<id>.jpg and run:  python3 tools/photos.py
(needs Pillow and NumPy)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.photos-cache'
OUT = ROOT / 'theme' / 'perla' / 'assets' / 'images'

# file: (PxHere id, shape as width / height, focus point as fractions of the original, zoom, longest width)
PHOTOS = {
    'hero': (917219, 12 / 13, (0.70, 0.50), 1.0, 880),
    'founder': (917219, 4 / 3, (0.66, 0.62), 0.78, 1200),
    'studio': (1276386, 4 / 3, (0.45, 0.50), 1.0, 1200),
    'general-dentistry': (783408, 4 / 3, (0.50, 0.50), 1.0, 1200),
    'cosmetic-dentistry': (496715, 4 / 3, (0.50, 0.50), 1.0, 1200),
    'dental-implants': (1126242, 4 / 3, (0.50, 0.30), 1.0, 1200),
    'teeth-whitening': (496715, 4 / 3, (0.50, 0.44), 0.6, 1200),
    'orthodontics': (921710, 4 / 3, (0.50, 0.50), 1.0, 1200),
    'emergency-care': (1095804, 4 / 3, (0.50, 0.50), 1.0, 1200),
    'smile-after': (496715, 4 / 3, (0.50, 0.52), 0.9, 900),
}


def crop(picture, ratio, focus, zoom, longest):
    """Cuts the largest area of the wanted shape around the focus point. Never enlarges."""
    full_w, full_h = picture.size
    crop_w = min(full_w, full_h * ratio) * zoom
    crop_h = crop_w / ratio
    left = min(max(focus[0] * full_w - crop_w / 2, 0), full_w - crop_w)
    top = min(max(focus[1] * full_h - crop_h / 2, 0), full_h - crop_h)
    part = picture.crop(tuple(int(round(v)) for v in (left, top, left + crop_w, top + crop_h)))
    if part.width > longest:
        part = part.resize((longest, int(round(longest / ratio))), Image.LANCZOS)
    return part


def stained_teeth(picture):
    """The "before" of the before / after pair: the same smile with darker, yellower teeth.

    A demo illustration, not a clinical case. The numbers fit this smile photo only.
    """
    rgb = np.asarray(picture).astype(np.float32) / 255.0
    hsv = np.asarray(picture.convert('HSV')).astype(np.float32) / 255.0
    saturation, value = hsv[..., 1], hsv[..., 2]
    height, width = saturation.shape
    ys, xs = np.mgrid[0:height, 0:width]

    # Teeth are bright and almost colourless; the lips and the skin are not.
    mouth = (xs > width * 0.06) & (xs < width * 0.94) & (ys > height * 0.12) & (ys < height * 0.57)
    neutral = (rgb[..., 0] - rgb[..., 1]) < 0.10
    mask = ((value > 0.50) & (saturation < 0.24) & neutral & mouth).astype(np.uint8) * 255
    # Grown a little so the edges of the teeth are covered, then held back where the lips begin.
    mask = Image.fromarray(mask).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3))
    mask = np.asarray(mask).astype(np.float32) / 255.0 * np.clip((0.42 - saturation) / 0.16, 0, 1)
    mask = np.clip(mask, 0, 1)[..., None]

    tint = np.array([0.96, 0.915, 0.79], dtype=np.float32)
    result = rgb * (1 - mask) + rgb * tint * mask
    return Image.fromarray((np.clip(result, 0, 1) * 255).astype(np.uint8))


def save(picture, name):
    target = OUT / f'{name}.jpg'
    picture.save(target, 'JPEG', quality=80, optimize=True, progressive=True)
    print(f'{target.name:28} {picture.width}x{picture.height}  {target.stat().st_size // 1024} KB')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (pxhere_id, ratio, focus, zoom, longest) in PHOTOS.items():
        source = CACHE / f'{pxhere_id}.jpg'
        if not source.exists():
            raise SystemExit(f'Missing {source}: download it from https://pxhere.com/en/photo/{pxhere_id}')
        picture = crop(Image.open(source).convert('RGB'), ratio, focus, zoom, longest)
        save(picture, name)
        if name == 'smile-after':
            save(stained_teeth(picture), 'smile-before')


if __name__ == '__main__':
    main()
