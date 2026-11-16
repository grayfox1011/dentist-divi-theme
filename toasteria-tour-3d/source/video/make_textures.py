"""Textures that come from the video (murals, small posters, the street outside) and the eight
posters of the landing, redrawn from the texts read in the frames.
The materials (parquet, wood, carpet, boxes, leaves...) are made by make_textures_pbr.py."""
import numpy as np, cv2, os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SP = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(SP, '..', 'blender', 'tex')
rng = np.random.default_rng(7); random.seed(7)
FONT = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
FONT_B = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'

def noise2(h, w, scale, octaves=4, seed=0):
    r = np.random.default_rng(seed); out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0
    for o in range(octaves):
        sh, sw = max(2, int(h / scale * 2 ** o)), max(2, int(w / scale * 2 ** o))
        n = r.random((sh + 1, sw + 1)).astype(np.float32)
        n[-1, :] = n[0, :]; n[:, -1] = n[:, 0]          # tileable
        up = cv2.resize(n, (w + w // sw, h + h // sh), interpolation=cv2.INTER_CUBIC)[:h, :w]
        out += up * amp; tot += amp; amp *= 0.5
    return out / tot

# ---------------------------------------------------------------- posters
def condensed_text(draw_img, xy, text, size, fill, squeeze=0.62, font=FONT, spacing=1.0):
    f = ImageFont.truetype(font, size)
    x, y = xy
    for line in text.split('\n'):
        parts = line.split('|')   # '|' toggles colour for brown words
        bbox = f.getbbox(line.replace('|', ''))
        tw, th = bbox[2] + 10, int(size * 1.25)
        tmp = Image.new('RGBA', (tw, th), (0, 0, 0, 0)); d = ImageDraw.Draw(tmp)
        cx = 0; col = fill
        for k, p in enumerate(parts):
            d.text((cx, 0), p, font=f, fill=col)
            cx += f.getlength(p)
            col = (122, 74, 52) if col == fill else fill
        tmp = tmp.resize((max(1, int(tw * squeeze)), th), Image.LANCZOS)
        draw_img.alpha_composite(tmp, (int(x), int(y)))
        y += size * spacing
    return y

def brush(img, x, y, w, col=(110, 62, 40)):
    d = ImageDraw.Draw(img)
    for k in range(18):
        yy = y + rng.normal(0, 3); t = rng.uniform(1.5, 4)
        x0 = x + rng.uniform(0, 12); x1 = x + w - rng.uniform(0, 18)
        d.line([(x0, yy + (x1 - x0) * -0.03), (x1, yy - 6)], fill=col + (int(rng.uniform(120, 230)),), width=int(t))

def poster(name, text, icon, size=None):
    W, H = 600, 800
    img = Image.new('RGBA', (W, H), (244, 242, 236, 255))
    fs = size or 92
    y = condensed_text(img, (70, 120), text, fs, (24, 22, 22, 255), spacing=1.02)
    d = ImageDraw.Draw(img)
    if icon == 'brush':
        brush(img, 70, y + 70, 230)
    elif icon == 'heart':
        cx, cy, s = 430, y + 90, 46
        pts = [(cx + s * 16 * math.sin(t) ** 3 / 16, cy - s * (13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)) / 16) for t in np.linspace(0, 2 * math.pi, 200)]
        d.line(pts + [pts[0]], fill=(150, 40, 50, 255), width=4)
    elif icon == 'toast':
        x0, y0 = 90, y + 60
        d.rounded_rectangle([x0, y0, x0 + 300, y0 + 36], 18, outline=(30, 30, 30, 255), width=4)
        d.line([(x0 + 10, y0 + 48), (x0 + 290, y0 + 48)], fill=(30, 30, 30, 255), width=4)
        for k in range(8): d.arc([x0 + 14 + k * 34, y0 + 36, x0 + 46 + k * 34, y0 + 58], 0, 180, fill=(30, 30, 30, 255), width=3)
        d.rounded_rectangle([x0, y0 + 56, x0 + 300, y0 + 86], 14, outline=(30, 30, 30, 255), width=4)
        d.line([(x0 + 200, y0 + 10), (x0 + 330, y0 - 50)], fill=(30, 30, 30, 255), width=6)
        d.line([(x0 + 300, y0 - 36), (x0 + 345, y0 - 58)], fill=(30, 30, 30, 255), width=12)
    elif icon == 'clock':
        cx, cy = 140, y + 90
        d.ellipse([cx - 45, cy - 45, cx + 45, cy + 45], outline=(30, 30, 30, 255), width=4)
        d.line([(cx, cy), (cx, cy - 30)], fill=(30, 30, 30, 255), width=4); d.line([(cx, cy), (cx + 22, cy + 8)], fill=(30, 30, 30, 255), width=4)
    elif icon == 'hands':
        x0, y0 = 300, y + 20
        d.rounded_rectangle([x0, y0 + 40, x0 + 150, y0 + 100], 20, outline=(30, 30, 30, 255), width=4)
        d.line([(x0 - 60, y0 + 160), (x0 + 10, y0 + 90), (x0 + 30, y0 + 60)], fill=(30, 30, 30, 255), width=4)
        d.line([(x0 + 210, y0 + 170), (x0 + 150, y0 + 100), (x0 + 130, y0 + 50)], fill=(30, 30, 30, 255), width=4)
        for k in range(3): d.arc([x0 + 5 + k * 14, y0 + 70, x0 + 35 + k * 14, y0 + 110], 200, 340, fill=(30, 30, 30, 255), width=3)
    # subtle paper grain
    a = np.array(img).astype(np.float32)
    a[..., :3] *= (0.97 + 0.03 * noise2(H, W, 40, 3, seed=sum(map(ord, name)) % 1000))[..., None]
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).convert('RGB').save(f'{OUT}/{name}.jpg', quality=90)

POSTERS = [
    ('poster_1', 'BUONO.\nSEMPLICE.\nITALIANO.', 'brush', 100),
    ('poster_2', 'NON È UN\nPANINO.\nÈ UN TOAST\nITALIANO.', 'brush', 92),
    ('poster_3', 'DENTRO\nÈ MORBIDO,\nFUORI È\nTOSTATO.', 'brush', 92),
    ('poster_4', 'RIGOROSAMENTE\nCON LE\n|MANI|', 'hands', 84),
    ('poster_5', 'IL TOAST\nPER OGNI\nMOMENTO.', 'clock', 100),
    ('poster_6', 'QUALITÀ\nCHE SI\nSENTE,\nAD OGNI\nMORSO.', 'brush', 88),
    ('poster_7', 'QUI IL TOAST\nNON SI\nTAGLIA.\nSI VIVE.', 'toast', 92),
    ('poster_8', 'TOASTALO.\nMORDILO.\nAMALO.\nRIPETI.', 'heart', 100),
]
for p in POSTERS: poster(*p)

# ---------------------------------------------------------------- crops from the video
F, K1, W, H = 610.0, 0.048, 478, 850
Km = np.array([[F, 0, W / 2], [0, F, H / 2], [0, 0, 1]])
def frame(i):
    return cv2.imread(f'{SP}/frames10/f_{i:04d}.jpg')
def quad_crop(i, quad, size, name, undist=False):
    im = frame(i)
    if undist: im = cv2.undistort(im, Km, np.array([K1, 0, 0, 0]))
    w, h = size
    M = cv2.getPerspectiveTransform(np.float32(quad), np.float32([[0, 0], [w, 0], [0, h], [w, h]]))
    out = cv2.warpPerspective(im, M, (w, h), flags=cv2.INTER_CUBIC)
    cv2.imwrite(f'{OUT}/{name}.jpg', out, [cv2.IMWRITE_JPEG_QUALITY, 90])
    return out
quad_crop(606, [[318, 362], [418, 376], [306, 446], [410, 462]], (300, 400), 'poster_coppia')
quad_crop(626, [[19, 420], [148, 422], [22, 565], [147, 560]], (300, 400), 'poster_drink1')
quad_crop(626, [[191, 423], [299, 421], [192, 556], [299, 552]], (300, 400), 'poster_drink2')
quad_crop(331, [[18, 168], [112, 166], [20, 252], [113, 250]], (360, 300), 'pictures_grid')
# street views seen through the windows (cropped above the chairs)
im = cv2.GaussianBlur(cv2.resize(frame(655)[194:385, 96:236], (700, 955), interpolation=cv2.INTER_LANCZOS4), (5, 5), 0)
lab = cv2.cvtColor(im, cv2.COLOR_BGR2LAB).astype(np.float32)
lab[..., 0] = np.clip((lab[..., 0] - 128) * 1.15 + 120, 0, 255)
im = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2BGR)
side = im[:, ::-1].copy()   # mirrored copies widen the view; their shop sign is blurred so no text reads backwards
ramp = np.clip((np.arange(side.shape[0]) - int(side.shape[0] * 0.6)) / 60.0, 0, 1)[:, None, None]
side = (side * (1 - ramp) + cv2.GaussianBlur(side, (0, 0), 25) * ramp).astype(np.uint8)
im = np.hstack([side, im, side])
h = im.shape[0]; big = cv2.copyMakeBorder(im, 330, 330, 0, 0, cv2.BORDER_REFLECT); H = big.shape[0]   # taller: sky above, street below
ramp = np.clip(np.maximum((370 - np.arange(H)) / 80.0, (np.arange(H) - (290 + h)) / 80.0), 0, 1)[:, None, None]
big = big * (1 - ramp) + cv2.GaussianBlur(big, (0, 0), 30) * ramp
shade = np.ones(H); shade[330 + h:] = np.linspace(1.0, 0.75, H - 330 - h); shade[:330] = np.linspace(1.08, 1.0, 330)
cv2.imwrite(f'{OUT}/street_b.jpg', np.clip(big * shade[:, None, None], 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])
# murals at web resolution
for n, w in (('venus', 3000), ('primavera', 2600)):
    m = cv2.imread(f'{SP}/tex/{n}_rect.png')   # output of rectify.py (run with width 3000 / 2600)
    if n == 'venus':
        m = m[6:-6, 6:-14]
    m = cv2.resize(m, (2048, int(2048 * m.shape[0] / m.shape[1])), interpolation=cv2.INTER_AREA).astype(np.float32)
    m = np.clip(m + (m - cv2.GaussianBlur(m, (0, 0), 2.0)) * 0.6, 0, 255)   # mild sharpening: the video frames are soft
    cv2.imwrite(f'{OUT}/mural_{n}.jpg', m.astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 91])
print(sorted(os.listdir(OUT)))
