#!/usr/bin/env python3
"""Crops the photographs of the theme into theme/perla/assets/images.

The originals go in .photos-cache/<original>.jpg. Where each one comes from, and its
licence, is listed in theme/perla/readme.txt. Needs Pillow and NumPy.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.photos-cache'
OUT = ROOT / 'theme' / 'perla' / 'assets' / 'images'

# file: (original, width / height, focus point, zoom, widest)
PHOTOS = {
    'hero': ('pxhere-917219', 5 / 4, (0.68, 0.50), 1.0, 1200),
    'studio': ('stocksnap-3J10QN5PTS', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'chair': ('rawpixel-5927111', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'general-dentistry': ('rawpixel-5921240', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'cosmetic-dentistry': ('rawpixel-5971640', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'dental-implants': ('rawpixel-5904418', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'teeth-whitening': ('pxhere-496715', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'orthodontics': ('rawpixel-6039077', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'emergency-care': ('rawpixel-5925133', 3 / 2, (0.50, 0.50), 1.0, 1200),
    'smile-after': ('pxhere-496715', 4 / 3, (0.50, 0.52), 0.9, 900),
}


def crop(picture, ratio, focus, zoom, widest):
    full_w, full_h = picture.size
    crop_w = min(full_w, full_h * ratio) * zoom
    crop_h = crop_w / ratio
    left = min(max(focus[0] * full_w - crop_w / 2, 0), full_w - crop_w)
    top = min(max(focus[1] * full_h - crop_h / 2, 0), full_h - crop_h)
    part = picture.crop(tuple(int(round(v)) for v in (left, top, left + crop_w, top + crop_h)))
    if part.width > widest:
        part = part.resize((widest, int(round(widest / ratio))), Image.LANCZOS)
    return part


def stained_teeth(picture):
    """The "before" picture: the same smile with darker teeth. The numbers fit this photo only."""
    rgb = np.asarray(picture).astype(np.float32) / 255.0
    hsv = np.asarray(picture.convert('HSV')).astype(np.float32) / 255.0
    saturation, value = hsv[..., 1], hsv[..., 2]
    height, width = saturation.shape
    ys, xs = np.mgrid[0:height, 0:width]

    mouth = (xs > width * 0.06) & (xs < width * 0.94) & (ys > height * 0.12) & (ys < height * 0.57)
    neutral = (rgb[..., 0] - rgb[..., 1]) < 0.10
    mask = ((value > 0.50) & (saturation < 0.24) & neutral & mouth).astype(np.uint8) * 255
    mask = Image.fromarray(mask).filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(3))
    # fades out where the lips begin
    mask = np.asarray(mask).astype(np.float32) / 255.0 * np.clip((0.42 - saturation) / 0.16, 0, 1)
    mask = np.clip(mask, 0, 1)[..., None]

    tint = np.array([0.96, 0.915, 0.79], dtype=np.float32)
    result = rgb * (1 - mask) + rgb * tint * mask
    return Image.fromarray((np.clip(result, 0, 1) * 255).astype(np.uint8))


def save(picture, name):
    target = OUT / f'{name}.jpg'
    picture.save(target, 'JPEG', quality=82, optimize=True, progressive=True)
    print(f'{target.name:28} {picture.width}x{picture.height}  {target.stat().st_size // 1024} KB')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (original, ratio, focus, zoom, widest) in PHOTOS.items():
        source = CACHE / f'{original}.jpg'
        if not source.exists():
            raise SystemExit(f'Missing {source} (see theme/perla/readme.txt for where to get it)')
        picture = crop(Image.open(source).convert('RGB'), ratio, focus, zoom, widest)
        save(picture, name)
        if name == 'smile-after':
            save(stained_teeth(picture), 'smile-before')


if __name__ == '__main__':
    main()
