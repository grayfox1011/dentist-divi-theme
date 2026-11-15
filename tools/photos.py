#!/usr/bin/env python3
"""Builds the demo photographs of the theme from src/photos.json.

    python3 tools/photos.py             every file
    python3 tools/photos.py hero.jpg    only the files named

To swap a picture, change its entry in src/photos.json and run this script for
that file. "photo" is the number of a CC0 photo from wordpress.org/photos, "page"
its page there and "source" the full size file. "focus" is the point of the
original, as x and y from 0 to 1 counted from the top left, that goes to the
middle of the crop. "zoom" 1 is the widest crop that fits, 1.5 is one and a half
times closer. "quality" is optional (72 when missing). Write a new "alt" too.

The originals are kept in .photos-cache/<photo>.jpg and are downloaded when
missing. Needs Pillow and NumPy.
"""
import io
import json
import sys
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image, ImageCms, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
LIST = ROOT / 'src' / 'photos.json'
CACHE = ROOT / '.photos-cache'
OUT = ROOT / 'theme' / 'dimora' / 'assets' / 'images'

QUALITY = 72
PAPER = (0xF5, 0xF2, 0xEC)
GRAPHITE = (0x3A, 0x37, 0x33)


def original(entry):
    path = CACHE / f"{entry['photo']}.jpg"
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(entry['source'], headers={'User-Agent': 'photos.py'})
        with urllib.request.urlopen(request, timeout=120) as response:
            path.write_bytes(response.read())
    picture = ImageOps.exif_transpose(Image.open(path))
    profile = picture.info.get('icc_profile')
    picture = picture.convert('RGB')
    if profile:
        # phones save Display P3, the theme ships plain sRGB
        profile = ImageCms.ImageCmsProfile(io.BytesIO(profile))
        if not ImageCms.getProfileDescription(profile).startswith('sRGB'):
            picture = ImageCms.profileToProfile(picture, profile, ImageCms.createProfile('sRGB'), outputMode='RGB')
    return picture


def crop(picture, size, focus, zoom):
    width, height = size
    full_w, full_h = picture.size
    crop_w = min(full_w, full_h * width / height) / zoom
    crop_h = crop_w * height / width
    left = min(max(focus[0] * full_w - crop_w / 2, 0), full_w - crop_w)
    top = min(max(focus[1] * full_h - crop_h / 2, 0), full_h - crop_h)
    return picture.resize((width, height), Image.LANCZOS, box=(left, top, left + crop_w, top + crop_h))


def sketch(picture):
    """The same picture as a pencil drawing: graphite lines on paper, no colour."""
    grey = picture.convert('L').filter(ImageFilter.GaussianBlur(picture.width / 1600))
    blurred = ImageOps.invert(grey).filter(ImageFilter.GaussianBlur(picture.width / 400))
    base = np.asarray(grey, dtype=np.float32)
    # colour dodge: flat areas turn white, edges stay
    dodge = np.minimum(base / (256 - np.asarray(blurred, dtype=np.float32)), 1)
    # more contrast: walls go to paper, the lines get darker
    lines = np.clip((dodge - 0.62) / 0.36, 0, 1) ** 1.6
    paper = np.array(PAPER, dtype=np.float32)
    graphite = np.array(GRAPHITE, dtype=np.float32)
    drawing = graphite + (paper - graphite) * lines[..., None]
    return Image.fromarray(drawing.round().astype(np.uint8))


def save(picture, name, quality):
    target = OUT / name
    picture.save(target, 'JPEG', quality=quality, optimize=True, progressive=True, subsampling='4:2:0')
    return target.stat().st_size


def main():
    photos = json.loads(LIST.read_text(encoding='utf-8'))
    names = sys.argv[1:] or list(photos)
    unknown = [name for name in names if name not in photos]
    if unknown:
        raise SystemExit(f"Not in {LIST.name}: {', '.join(unknown)}")
    OUT.mkdir(parents=True, exist_ok=True)
    opened = {}
    total = 0
    for name in names:
        entry = photos[name]
        if entry['photo'] not in opened:
            opened.clear()
            opened[entry['photo']] = original(entry)
        picture = crop(opened[entry['photo']], entry['size'], entry['focus'], entry['zoom'])
        if entry.get('filter') == 'sketch':
            picture = sketch(picture)
        weight = save(picture, name, entry.get('quality', QUALITY))
        total += weight
        print(f'{name:28} {picture.width}x{picture.height}  {weight / 1024:6.0f} KB')
    print(f'{len(names)} files, {total / 1048576:.2f} MB')


if __name__ == '__main__':
    main()
