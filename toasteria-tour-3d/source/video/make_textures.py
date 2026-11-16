"""Generate every texture the Blender scene needs: posters, floor, wood, carpet,
crates, leaves, plus crops rectified from the video frames."""
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
    a[..., :3] *= (0.97 + 0.03 * noise2(H, W, 40, 3, seed=hash(name) % 1000))[..., None]
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

# ---------------------------------------------------------------- floor (2 m x 2 m tile, 2048 px)
def floor_tex(name, base, seed, strip_w=0.075, strip_l=0.6, S=2048):
    r = np.random.default_rng(seed)
    img = np.zeros((S, S, 3), np.float32)
    px = S / 2.0
    sw = int(round(strip_w * px)); sl = int(round(strip_l * px))
    rows = S // sw
    fine = noise2(S, S, 6, 3, seed + 1)
    for i in range(rows + 1):
        off = int(r.uniform(0, sl))
        y0 = i * sw
        x = -off
        while x < S:
            tone = r.normal(0, 1)
            col = np.array(base) * (1 + 0.07 * tone) + r.normal(0, 4, 3)
            x0, x1 = max(0, x), min(S, x + sl)
            y1 = min(S, y0 + sw)
            if x1 > x0 and y1 > y0:
                # longitudinal fibre streaks
                streak = noise2(max(2, y1 - y0), max(2, x1 - x0), 3, 2, int(r.integers(1e6)))
                streak = cv2.resize(streak, (x1 - x0, y1 - y0))
                streak = cv2.resize(cv2.resize(streak, (max(1, (x1 - x0) // 40), y1 - y0)), (x1 - x0, y1 - y0), interpolation=cv2.INTER_LINEAR)
                img[y0:y1, x0:x1] = col * (0.88 + 0.24 * streak[..., None])
            x += sl
    # joints
    for i in range(rows + 1):
        img[i * sw:i * sw + 2] *= 0.82
    img *= (0.95 + 0.1 * fine)[..., None]
    img = cv2.GaussianBlur(img, (3, 3), 0)
    cv2.imwrite(f'{OUT}/{name}.jpg', img[..., ::-1].clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])
floor_tex('floor_ground', (214, 178, 128), 11, 0.10, 0.60)
floor_tex('floor_upper', (222, 184, 132), 12, 0.07, 0.45)

# ---------------------------------------------------------------- table top (2.0 x 0.8 m, with engraved name)
def wood(W, H, base, seed, grain=0.25, rings=40):
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    n = noise2(H, W, 60, 4, seed)
    warp = noise2(H, W, 200, 3, seed + 5) * 30
    v = np.sin((yy + warp + n * 25) / H * rings * math.pi) * 0.5 + 0.5
    v = v ** 3
    streak = cv2.resize(noise2(H, max(2, W // 30), 4, 3, seed + 2), (W, H))
    img = np.array(base, np.float32)[None, None] * (1 - grain * v[..., None]) * (0.9 + 0.2 * streak[..., None])
    return img
def table_top(name, W=2048, H=820, engraving=True, planks=4, seed=3):
    img = np.zeros((H, W, 3), np.float32)
    for k in range(planks):
        y0, y1 = k * H // planks, (k + 1) * H // planks
        img[y0:y1] = wood(W, y1 - y0, (198, 140, 72), seed + k * 7, 0.32, 28)[..., ::-1] if False else wood(W, y1 - y0, (196, 138, 70), seed + k * 7, 0.32, 28)
        img[y0:y0 + 3] *= 0.75
    pil = Image.fromarray(img.clip(0, 255).astype(np.uint8))
    if engraving:
        txt = Image.new('RGBA', (900, 140), (0, 0, 0, 0)); d = ImageDraw.Draw(txt)
        d.text((10, 10), 'Toasteria Italiana', font=ImageFont.truetype(FONT_B, 96), fill=(80, 46, 20, 210))
        txt = txt.resize((int(900 * 0.72), 140)).rotate(90, expand=True)
        pil.paste(txt, (W - 170, (H - txt.size[1]) // 2), txt)
    pil.save(f'{OUT}/{name}.jpg', quality=88)
table_top('table_long', 2048, 820, True, 4, 3)
table_top('table_small', 1024, 1024, False, 3, 9)

# ---------------------------------------------------------------- stair tread (grey carpet/stone, tileable 1024)
g = noise2(1024, 1024, 3, 5, 21)
g2 = noise2(1024, 1024, 40, 3, 22)
c = (118 + 60 * (g - 0.5) + 25 * (g2 - 0.5))
img = np.stack([c * 1.0, c * 0.98, c * 0.94], -1)
cv2.imwrite(f'{OUT}/carpet.jpg', img[..., ::-1].clip(0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])

# ---------------------------------------------------------------- kraft crate front (512) and side
def crate(name, seed, label=True):
    r = np.random.default_rng(seed)
    W, H = 512, 400
    base = np.array([176, 136, 92]) * r.uniform(0.92, 1.06)
    n = noise2(H, W, 30, 4, seed)
    img = base[None, None] * (0.9 + 0.2 * n[..., None])
    img[:6] *= 0.7; img[-6:] *= 0.7; img[:, :6] *= 0.7; img[:, -6:] *= 0.7
    pil = Image.fromarray(img.clip(0, 255).astype(np.uint8)); d = ImageDraw.Draw(pil)
    if label:
        d.ellipse([196, 140, 316, 260], outline=(70, 40, 30), width=6)
        d.text((214, 182), 'TOASTERIA', font=ImageFont.truetype(FONT_B, 16), fill=(70, 40, 30))
        d.text((226, 204), 'ITALIANA', font=ImageFont.truetype(FONT_B, 16), fill=(70, 40, 30))
    pil.save(f'{OUT}/{name}.jpg', quality=85)
crate('crate_a', 1); crate('crate_b', 2); crate('crate_side', 3, False)

# ---------------------------------------------------------------- leaves with alpha
def monstera_leaf(path):
    S = 1024
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx = S / 2
    def blade(t):
        r = 0.43 * S * (1 - 0.18 * math.cos(t)) * (1 + 0.05 * math.sin(3 * t))
        return cx + r * math.sin(t), S * 0.47 - r * math.cos(t) * 0.92
    d.polygon([blade(t) for t in np.linspace(0, 2 * math.pi, 300)], fill=(34, 86, 38, 255))
    d.polygon([(cx - 40, S * 0.9), (cx + 40, S * 0.9), (cx, S * 0.78)], fill=(0, 0, 0, 0))
    for side in (-1, 1):
        for k in range(6):
            y = S * (0.20 + 0.11 * k); x_in = cx + side * S * (0.10 + 0.02 * k)
            ang = math.radians(15 + 8 * k); L = S * 0.5
            x2 = x_in + side * L * math.cos(ang); y2 = y + L * math.sin(ang) * 0.6; w = 14 + 4 * k
            d.polygon([(x_in, y), (x2, y2 - w), (x2, y2 + w)], fill=(0, 0, 0, 0))
            hx = cx + side * S * 0.09; hy = y + S * 0.03
            d.ellipse([hx - 10, hy - 18, hx + 10, hy + 18], fill=(0, 0, 0, 0))
    d.line([(cx, S * 0.08), (cx, S * 0.86)], fill=(78, 128, 62, 255), width=8)
    for side in (-1, 1):
        for k in range(7):
            y = S * (0.15 + 0.1 * k)
            d.line([(cx, y), (cx + side * S * 0.36, y + S * 0.16)], fill=(52, 104, 50, 255), width=3)
    a = np.array(img).astype(np.float32)
    yy, xx = np.mgrid[0:S, 0:S] / S
    a[..., :3] *= np.clip(0.85 + 0.25 * (1 - np.hypot(xx - 0.5, yy - 0.45) * 1.6), 0.6, 1.15)[..., None]
    Image.fromarray(a.clip(0, 255).astype(np.uint8)).filter(ImageFilter.SMOOTH).resize((512, 512), Image.LANCZOS).save(path)
monstera_leaf(f'{OUT}/leaf_monstera.png')
S = 512; img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
pts = [(S / 2 + 120 * math.sin(t) * (1 - 0.3 * math.cos(t)), S / 2 - 245 * math.cos(t)) for t in np.linspace(0, 2 * math.pi, 100)]
d.polygon(pts, fill=(28, 84, 34, 255)); d.line([(S / 2, 10), (S / 2, S - 10)], fill=(60, 120, 50, 255), width=5)
img.save(f'{OUT}/leaf_oval.png')

# ---------------------------------------------------------------- acapulco string weave (alpha)
img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
for k in range(0, S, 9):
    d.line([(k, 0), (k, S)], fill=(16, 16, 16, 255), width=5)
for k in range(0, S, 48):
    d.line([(0, k), (S, k)], fill=(16, 16, 16, 255), width=3)
img.save(f'{OUT}/weave.png')

# ---------------------------------------------------------------- wrought-iron balcony railing (alpha)
img = Image.new('RGBA', (1024, 512), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
col = (200, 196, 190, 255)
d.rectangle([0, 0, 1024, 14], fill=col); d.rectangle([0, 498, 1024, 512], fill=col)
for k in range(0, 1025, 128):
    d.line([(k, 0), (k, 512)], fill=col, width=6)
    d.ellipse([k - 64, 40, k + 64, 472], outline=col, width=6)
img.save(f'{OUT}/railing_iron.png')

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
quad_crop(46, [[362, 133], [431, 133], [362, 202], [431, 202]], (256, 256), 'logo_sign')
quad_crop(331, [[18, 168], [112, 166], [20, 252], [113, 250]], (360, 300), 'pictures_grid')
# street views seen through the windows (cropped above the chairs)
im = frame(651)[212:468, 2:302]
cv2.imwrite(f'{OUT}/street_b.jpg', cv2.GaussianBlur(cv2.resize(im, (900, 768), interpolation=cv2.INTER_CUBIC), (3, 3), 0), [cv2.IMWRITE_JPEG_QUALITY, 90])
im = frame(506)[0:300, 60:478]
cv2.imwrite(f'{OUT}/street_a.jpg', cv2.resize(im, (836, 600), interpolation=cv2.INTER_CUBIC), [cv2.IMWRITE_JPEG_QUALITY, 90])
# murals at web resolution
for n, w in (('venus', 3000), ('primavera', 2600)):
    m = cv2.imread(f'{SP}/tex/{n}_rect.png')   # output of rectify.py (run with width 3000 / 2600)
    if n == 'venus':
        m = m[6:-6, 6:-14]
    cv2.imwrite(f'{OUT}/mural_{n}.jpg', cv2.resize(m, (2048, int(2048 * m.shape[0] / m.shape[1])), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 90])
print(sorted(os.listdir(OUT)))
