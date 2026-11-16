"""Materials for the realistic version: colour, relief (normal map) and gloss (roughness) for the
parquet, the table tops, the stair carpet, the cardboard boxes and the leaves, plus the small
printed props (menus, signs) and the street seen from the shop front.
Run after make_textures.py; output goes to ../blender/tex."""
import numpy as np, cv2, os, math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SP = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SP, '..', 'blender', 'tex')
FONT_XB = '/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf'
FONT_B = '/usr/share/fonts/opentype/inter/Inter-Bold.otf'
FONT_R = '/usr/share/fonts/opentype/inter/Inter-Regular.otf'


def tile_noise(h, w, cells_y, cells_x, seed, octaves=4, persistence=0.5):
    """Tileable value noise in [0,1]."""
    rng = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32); amp = 1.0; tot = 0.0
    for o in range(octaves):
        cy, cx = max(1, cells_y * 2 ** o), max(1, cells_x * 2 ** o)
        g = rng.random((cy, cx)).astype(np.float32)
        g = np.pad(g, ((1, 2), (1, 2)), mode='wrap')
        up = cv2.resize(g, ((cx + 3) * (w // cx + 1), (cy + 3) * (h // cy + 1)), interpolation=cv2.INTER_CUBIC)
        sy, sx = up.shape[0] / (cy + 3), up.shape[1] / (cx + 3)
        ys = ((np.arange(h) + 0.5) / h * cy + 1.0) * sy
        xs = ((np.arange(w) + 0.5) / w * cx + 1.0) * sx
        up = cv2.remap(up, np.tile(xs.astype(np.float32), (h, 1)), np.tile(ys.astype(np.float32)[:, None], (1, w)), cv2.INTER_LINEAR)
        out += up * amp; tot += amp; amp *= persistence
    out /= tot
    return (out - out.min()) / max(1e-6, out.max() - out.min())


def normal_from_height(hgt, strength, wrap=True):
    """Tangent-space normal map (OpenGL convention, +Y up) from a height field."""
    hp = np.pad(hgt, 1, mode='wrap' if wrap else 'edge')
    dx = (hp[1:-1, 2:] - hp[1:-1, :-2]) * 0.5
    dy = (hp[2:, 1:-1] - hp[:-2, 1:-1]) * 0.5
    nx, ny, nz = -dx * strength, dy * strength, np.ones_like(hgt)   # image y runs down -> flip for +Y up
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / ln, ny / ln, nz / ln], -1)
    return ((n * 0.5 + 0.5) * 255 + 0.5).astype(np.uint8)


def save_rgb(name, arr, q=90):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name), quality=q)


def save_png(name, arr):
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(os.path.join(OUT, name))


# ------------------------------------------------------------------ industrial parquet (1.92 m tile)
def parquet(prefix, S=2048, n_rows=200, n_cols=8, seed=5, tint=(1.0, 1.0, 1.0)):
    rng = np.random.default_rng(seed)
    r_idx = (np.arange(S) * n_rows // S)
    palette = np.array([(214, 178, 130), (205, 167, 117), (195, 155, 105), (180, 140, 93), (160, 120, 78), (134, 98, 64)], np.float32)
    weights = np.array([0.28, 0.36, 0.22, 0.09, 0.04, 0.01])
    # every column of lamellae is shifted by a random amount (blocks laid like bricks)
    alb = np.zeros((S, S, 3), np.float32); hgt = np.zeros((S, S), np.float32); rgh = np.zeros((S, S), np.float32)
    col_edges = [round(c * S / n_cols) for c in range(n_cols + 1)]
    for c in range(n_cols):
        x0, x1 = col_edges[c], col_edges[c + 1]
        w = x1 - x0
        shift = int(rng.integers(0, n_rows))
        tone_i = rng.choice(len(palette), size=n_rows, p=weights)
        tone = palette[tone_i] * (1 + rng.normal(0, 0.035, (n_rows, 1)))
        tone = tone * np.array(tint, np.float32)
        ridx = (r_idx + shift) % n_rows
        band = tone[ridx][:, None, :].repeat(w, 1)
        # long fibres: low frequency along the lamella, different for each one
        fib = rng.random((n_rows, 6)).astype(np.float32)
        fib = cv2.resize(fib, (w, n_rows), interpolation=cv2.INTER_CUBIC)[ridx]
        fine = cv2.GaussianBlur(rng.random((S, w)).astype(np.float32), (0, 0), sigmaX=7, sigmaY=0.6)
        fine = (fine - fine.mean()) / (fine.std() + 1e-6)
        band *= (0.93 + 0.14 * fib + 0.035 * fine)[..., None]
        alb[:, x0:x1] = band
        lam_h = rng.normal(0, 1, n_rows).astype(np.float32)[ridx]
        hgt[:, x0:x1] = lam_h[:, None] * 0.25
        rgh[:, x0:x1] = (0.33 + 0.07 * rng.random(n_rows).astype(np.float32)[ridx])[:, None]
        # joints between lamellae of this column
        jr = np.nonzero(np.diff(np.concatenate([ridx[-1:], ridx])) != 0)[0]
        depth = rng.random(len(jr)) ** 2
        for y, d in zip(jr, depth):
            alb[y, x0:x1] *= 1 - 0.30 * d - 0.06
            hgt[y, x0:x1] -= 0.7 * d + 0.25
            rgh[y, x0:x1] += 0.15
    for x in col_edges[:-1]:            # end joints: continuous lines across the floor
        for k, (dark, dep) in enumerate(((0.55, 1.8), (0.74, 1.0), (0.9, 0.3))):
            xx = (x + k) % S
            alb[:, xx] *= dark; hgt[:, xx] -= dep; rgh[:, xx] += 0.2
    big = tile_noise(S, S, 3, 3, seed + 9, 3)
    alb *= (0.96 + 0.08 * big)[..., None]
    save_rgb(prefix + '.jpg', alb, 90)
    save_png(prefix + '_n.png', normal_from_height(cv2.GaussianBlur(hgt, (0, 0), 0.6), 1.1))
    r8 = np.clip(rgh, 0, 1) * 255
    save_rgb(prefix + '_r.jpg', np.stack([r8, r8, r8], -1), 88)


parquet('floor_parquet', seed=5)


# ------------------------------------------------------------------ table tops: varnished planks
def wood_planks(W, H, planks, seed, base=(206, 150, 80), dark=(150, 92, 44), along='x'):
    rng = np.random.default_rng(seed)
    img = np.zeros((H, W, 3), np.float32); hgt = np.zeros((H, W), np.float32)
    edges = [round(k * H / planks) for k in range(planks + 1)]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    for k in range(planks):
        y0, y1 = edges[k], edges[k + 1]
        h = y1 - y0
        s = seed * 31 + k * 17
        warp = cv2.resize(np.random.default_rng(s).random((2, 4)).astype(np.float32), (W, h), interpolation=cv2.INTER_CUBIC)
        centre = rng.uniform(-0.6, 1.6) * h          # where the heart of the trunk runs
        dist = (np.arange(h, dtype=np.float32)[:, None] - centre) + (warp - 0.5) * h * 1.3
        rings = np.sin(np.abs(dist) ** 0.8 * rng.uniform(0.5, 0.8)) * 0.5 + 0.5
        rings = rings ** 2.2
        fibre = cv2.GaussianBlur(np.random.default_rng(s + 1).random((h, W)).astype(np.float32), (0, 0), sigmaX=22, sigmaY=0.7)
        fibre = (fibre - fibre.mean()) / (fibre.std() + 1e-6)
        tone = rng.uniform(0.93, 1.07)
        col = np.array(base, np.float32)[None, None] * (1 - 0.38 * rings[..., None]) + np.array(dark, np.float32)[None, None] * 0.38 * rings[..., None]
        col *= (tone + 0.05 * fibre)[..., None]
        img[y0:y1] = col
        hgt[y0:y1] = -0.25 * rings + 0.05 * fibre
        img[y0:y0 + 2] *= 0.55; hgt[y0:y0 + 2] -= 1.6
    return img, hgt


def table_long():
    W, H = 2048, 820
    img, hgt = wood_planks(W, H, 5, 3)
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    txt = Image.new('L', (760, 120), 0)
    ImageDraw.Draw(txt).text((6, 4), 'Toasteria Italiana', font=ImageFont.truetype(FONT_B, 92), fill=255)
    txt = txt.resize((int(760 * 0.74), 120), Image.LANCZOS).rotate(90, expand=True)
    mask = np.zeros((H, W), np.float32)
    x0, y0 = W - 150, (H - txt.size[1]) // 2
    mask[y0:y0 + txt.size[1], x0:x0 + txt.size[0]] = np.asarray(txt, np.float32) / 255
    a = np.asarray(pil, np.float32)
    burn = np.array((70, 38, 16), np.float32)
    a = a * (1 - 0.82 * mask[..., None]) + burn * 0.82 * mask[..., None]
    hgt = hgt - 2.2 * cv2.GaussianBlur(mask, (0, 0), 1.2)
    save_rgb('table_long.jpg', a, 90)
    save_png('table_long_n.png', normal_from_height(cv2.GaussianBlur(hgt, (0, 0), 0.7), 0.9, wrap=False))


def table_small():
    S = 1024
    img, hgt = wood_planks(S, S, 5, 11)
    pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    txt = Image.new('L', (560, 86), 0)
    ImageDraw.Draw(txt).text((4, 2), 'Toasteria Italiana', font=ImageFont.truetype(FONT_B, 66), fill=255)
    txt = txt.resize((int(560 * 0.74), 86), Image.LANCZOS).rotate(90, expand=True)
    mask = np.zeros((S, S), np.float32)
    x0, y0 = S - 108, (S - txt.size[1]) // 2
    mask[y0:y0 + txt.size[1], x0:x0 + txt.size[0]] = np.asarray(txt, np.float32) / 255
    a = np.asarray(pil, np.float32)
    a = a * (1 - 0.82 * mask[..., None]) + np.array((70, 38, 16), np.float32) * 0.82 * mask[..., None]
    hgt = hgt - 2.2 * cv2.GaussianBlur(mask, (0, 0), 1.0)
    save_rgb('table_small.jpg', a, 90)
    save_png('table_small_n.png', normal_from_height(cv2.GaussianBlur(hgt, (0, 0), 0.7), 0.9, wrap=False))


table_long(); table_small()

# ------------------------------------------------------------------ stair treads: grey needle-felt carpet
S = 512
n1 = tile_noise(S, S, 128, 128, 21, 2)
n2 = tile_noise(S, S, 24, 24, 22, 3)
n3 = tile_noise(S, S, 4, 4, 23, 2)
c = 78 + 46 * (n1 - 0.5) + 22 * (n2 - 0.5) + 14 * (n3 - 0.5)
save_rgb('carpet.jpg', np.stack([c * 1.0, c * 0.985, c * 0.95], -1), 88)
save_png('carpet_n.png', normal_from_height(n1 * 1.0 + n2 * 0.6, 2.2))

# ------------------------------------------------------------------ kraft cardboard boxes with the printed seal
def seal(pil, cx, cy, r, col, font_small, text_top='TOASTERIA', text_bottom='ITALIANA', teeth=28, banner=None, paper=(246, 243, 236, 255)):
    """Round scalloped seal with ring text, drawn on an RGBA image."""
    d = ImageDraw.Draw(pil)
    pts = []
    for k in range(teeth * 2):
        a = math.pi * k / teeth
        rr = r * (1.0 if k % 2 == 0 else 0.93)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.line(pts + [pts[0]], fill=col, width=max(2, int(r * 0.045)))
    d.ellipse([cx - r * 0.80, cy - r * 0.80, cx + r * 0.80, cy + r * 0.80], outline=col, width=max(2, int(r * 0.03)))
    d.ellipse([cx - r * 0.46, cy - r * 0.46, cx + r * 0.46, cy + r * 0.46], outline=col, width=max(2, int(r * 0.03)))
    s = r * 0.24                                         # toast icon in the middle
    d.rounded_rectangle([cx - s, cy - s * 0.95, cx + s, cy + s * 0.85], int(s * 0.3), outline=col, width=max(2, int(r * 0.04)))
    d.line([(cx - s * 0.5, cy - s * 0.1), (cx + s * 0.5, cy - s * 0.1)], fill=col, width=max(2, int(r * 0.03)))
    d.line([(cx - s * 0.5, cy + s * 0.3), (cx + s * 0.5, cy + s * 0.3)], fill=col, width=max(2, int(r * 0.03)))

    def ring(text, a0, a1, rad, flip=False):
        n = len(text)
        for k, ch in enumerate(text):
            a = a0 + (a1 - a0) * (k + 0.5) / n
            x, y = cx + rad * math.cos(a), cy + rad * math.sin(a)
            g = Image.new('RGBA', (int(r * 0.36), int(r * 0.36)), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((g.size[0] / 2, g.size[1] / 2), ch, font=font_small, fill=col, anchor='mm')
            g = g.rotate(-math.degrees(a) - 90 if not flip else -math.degrees(a) + 90, resample=Image.BICUBIC)
            pil.alpha_composite(g, (int(x - g.size[0] / 2), int(y - g.size[1] / 2)))
    ring(text_top, math.radians(205), math.radians(335), r * 0.63)
    ring(text_bottom, math.radians(150), math.radians(30), r * 0.63, flip=True)
    if banner:
        bw, bh = r * 1.12, r * 0.3
        d.rectangle([cx - bw, cy + r * 1.08, cx + bw, cy + r * 1.08 + bh], fill=col)
        d.text((cx, cy + r * 1.08 + bh / 2), banner, font=font_small, fill=paper, anchor='mm')


def cardboard(name, seed, logo=True, W=512, H=380):
    rng = np.random.default_rng(seed)
    base = np.array([178, 136, 90], np.float32) * rng.uniform(0.94, 1.05)
    n = tile_noise(H, W, 6, 8, seed, 4)
    flute = (np.sin(np.arange(W) / W * math.pi * 2 * 46) * 0.5 + 0.5)[None, :]
    a = base[None, None] * (0.9 + 0.16 * n[..., None]) * (0.985 + 0.03 * flute[..., None])
    a[:5] *= 0.72; a[-5:] *= 0.72; a[:, :5] *= 0.72; a[:, -5:] *= 0.72
    pil = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).convert('RGBA')
    d = ImageDraw.Draw(pil)
    if logo:
        seal(pil, W // 2, H // 2, 70, (74, 40, 30, 235), ImageFont.truetype(FONT_B, 19))
    else:
        d.line([(0, H // 2), (W, H // 2)], fill=(120, 88, 56, 255), width=3)      # flap seam
        d.rectangle([W // 2 - 60, H // 2 - 16, W // 2 + 60, H // 2 + 16], fill=(196, 160, 112, 255))   # tape
    pil.convert('RGB').save(os.path.join(OUT, name), quality=88)


cardboard('crate_a.jpg', 1); cardboard('crate_b.jpg', 2); cardboard('crate_side.jpg', 3, logo=False)

# ------------------------------------------------------------------ menu booklet cover, menu sheet, no-smoking sign
def menu_cover():
    W, H = 512, 700
    pil = Image.new('RGBA', (W, H), (246, 243, 236, 255)); d = ImageDraw.Draw(pil)
    red = (132, 22, 34, 255)
    d.rectangle([14, 14, W - 14, H - 14], outline=red, width=5)
    seal(pil, W // 2, 290, 176, red, ImageFont.truetype(FONT_XB, 46))
    d.rectangle([70, 556, W - 70, 628], fill=red)
    d.text((W // 2, 592), 'MENU', font=ImageFont.truetype(FONT_XB, 50), fill=(246, 243, 236, 255), anchor='mm')
    pil.convert('RGB').save(os.path.join(OUT, 'menu_cover.jpg'), quality=90)


def menu_sheet():
    W, H = 420, 600
    rng = np.random.default_rng(4)
    pil = Image.new('RGB', (W, H), (248, 246, 240)); d = ImageDraw.Draw(pil)
    red = (132, 22, 34)
    d.rectangle([0, 0, W, 78], fill=red)
    d.text((W // 2, 40), 'I NOSTRI TOAST', font=ImageFont.truetype(FONT_XB, 34), fill=(248, 246, 240), anchor='mm')
    y = 110
    for k in range(11):          # rows of names and prices, drawn as bars: too small to read at table distance
        w = int(rng.uniform(120, 230))
        d.rectangle([34, y, 34 + w, y + 11], fill=(40, 36, 36))
        d.rectangle([W - 84, y, W - 34, y + 11], fill=red)
        d.rectangle([34, y + 19, 34 + int(w * rng.uniform(1.1, 1.5)), y + 25], fill=(150, 146, 140))
        y += 43
    pil.save(os.path.join(OUT, 'menu_sheet.jpg'), quality=90)


def no_smoking():
    W, H = 360, 480
    pil = Image.new('RGB', (W, H), (250, 250, 248)); d = ImageDraw.Draw(pil)
    red = (206, 24, 30)
    cx, cy, r = W // 2, 190, 118
    d.rectangle([cx - 78, cy - 13, cx + 44, cy + 13], fill=(60, 60, 60))
    d.rectangle([cx + 48, cy - 13, cx + 62, cy + 13], fill=(60, 60, 60))
    d.rectangle([cx + 66, cy - 13, cx + 78, cy + 13], fill=(60, 60, 60))
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=red, width=20)
    d.line([(cx - r * 0.7, cy - r * 0.7), (cx + r * 0.7, cy + r * 0.7)], fill=red, width=20)
    d.text((W // 2, 372), 'VIETATO', font=ImageFont.truetype(FONT_XB, 46), fill=(30, 30, 30), anchor='mm')
    d.text((W // 2, 424), 'FUMARE', font=ImageFont.truetype(FONT_XB, 46), fill=(30, 30, 30), anchor='mm')
    pil.save(os.path.join(OUT, 'no_smoking.jpg'), quality=90)


def menu_board():
    """Cream menu board by the entrance (the real one lists the toasts by Italian city)."""
    W, H = 480, 900
    rng = np.random.default_rng(8)
    pil = Image.new('RGB', (W, H), (238, 226, 176)); d = ImageDraw.Draw(pil)
    red, green = (132, 22, 34), (46, 110, 60)
    d.rectangle([0, 0, W, 96], fill=red)
    d.text((W // 2, 50), 'TOAST', font=ImageFont.truetype(FONT_XB, 58), fill=(238, 226, 176), anchor='mm')
    cities = ['AOSTA', 'BOLOGNA', 'CLASSICO', 'FIRENZE', 'MILANO', 'GENOVA', 'LA SPEZIA', 'MERANO', 'NAPOLI', 'OLBIA', 'PARMA',
              'PERUGIA', 'RICCIONE', 'TRAPANI', 'TRENTO', 'TROPEA', 'VENEZIA', 'VERONA']
    y = 122
    f = ImageFont.truetype(FONT_XB, 24)
    for k, cname in enumerate(cities):
        d.text((30, y), cname, font=f, fill=red if k % 5 else green)
        d.rectangle([200, y + 9, 200 + int(rng.uniform(120, 220)), y + 15], fill=(120, 108, 80))
        y += 36
    d.rectangle([0, y + 8, W, y + 60], fill=green)
    d.text((W // 2, y + 35), 'PIADINA', font=ImageFont.truetype(FONT_XB, 34), fill=(238, 226, 176), anchor='mm')
    pil.save(os.path.join(OUT, 'menu_board.jpg'), quality=90)


menu_cover(); menu_sheet(); no_smoking(); menu_board()

# ------------------------------------------------------------------ leaves with alpha (monstera, zz, maple, bract)
def shade_leaf(img, seed, vein=None):
    a = np.asarray(img, np.float32).copy()
    S = a.shape[0]
    n = tile_noise(S, S, 6, 6, seed, 3)
    a[..., :3] *= (0.86 + 0.26 * n)[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))


def monstera():
    S = 1024
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx = S / 2
    def blade(t):
        r = 0.44 * S * (1 - 0.16 * math.cos(t)) * (1 + 0.04 * math.sin(3 * t))
        return cx + r * math.sin(t), S * 0.47 - r * math.cos(t) * 0.94
    d.polygon([blade(t) for t in np.linspace(0, 2 * math.pi, 360)], fill=(30, 84, 36, 255))
    d.polygon([(cx - 46, S * 0.93), (cx + 46, S * 0.93), (cx, S * 0.79)], fill=(0, 0, 0, 0))
    for side in (-1, 1):
        for k in range(6):
            y = S * (0.19 + 0.112 * k); x_in = cx + side * S * (0.11 + 0.022 * k)
            ang = math.radians(14 + 8 * k); L = S * 0.5
            x2 = x_in + side * L * math.cos(ang); y2 = y + L * math.sin(ang) * 0.6; w = 12 + 4 * k
            d.polygon([(x_in, y), (x2, y2 - w), (x2, y2 + w)], fill=(0, 0, 0, 0))
            hx = cx + side * S * 0.085; hy = y + S * 0.03
            d.ellipse([hx - 9, hy - 17, hx + 9, hy + 17], fill=(0, 0, 0, 0))
    alpha = np.asarray(img)[..., 3].copy()
    d.line([(cx, S * 0.07), (cx, S * 0.86)], fill=(96, 146, 70, 255), width=9)
    for side in (-1, 1):
        for k in range(7):
            y = S * (0.14 + 0.1 * k)
            d.line([(cx, y), (cx + side * S * 0.37, y + S * 0.17)], fill=(62, 118, 56, 255), width=4)
            d.line([(cx, y + 4), (cx + side * S * 0.37, y + S * 0.17 + 5)], fill=(22, 66, 30, 255), width=2)
    a = np.asarray(img, np.float32).copy()
    a[..., 3] = alpha
    yy, xx = np.mgrid[0:S, 0:S] / S
    a[..., :3] *= np.clip(0.82 + 0.3 * (1 - np.hypot(xx - 0.5, yy - 0.45) * 1.5), 0.62, 1.12)[..., None]
    img = shade_leaf(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)), 3).filter(ImageFilter.SMOOTH)
    img.resize((512, 512), Image.LANCZOS).save(os.path.join(OUT, 'leaf_monstera.png'))


def simple_leaf(name, col, vein, seed, pointed=0.3, width=0.44):
    S = 512
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    pts = []
    for t in np.linspace(0, 2 * math.pi, 160):
        w = math.sin(t) * (1 - pointed * math.cos(t))
        pts.append((S / 2 + S * width * w, S / 2 - S * 0.48 * math.cos(t)))
    d.polygon(pts, fill=col + (255,))
    alpha = np.asarray(img)[..., 3].copy()
    d.line([(S / 2, 8), (S / 2, S - 8)], fill=vein + (255,), width=6)
    for k in range(9):
        y = S * (0.14 + 0.085 * k)
        for side in (-1, 1):
            d.line([(S / 2, y), (S / 2 + side * S * 0.36, y - S * 0.07)], fill=vein + (255,), width=2)
    a = np.asarray(img).copy(); a[..., 3] = alpha
    shade_leaf(Image.fromarray(a), seed).filter(ImageFilter.SMOOTH).save(os.path.join(OUT, name))


def maple(name, col, vein, seed):
    S = 512
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    cx, cy = S / 2, S * 0.56
    pts = []
    lobes = [(-90, 0.47), (-150, 0.40), (-30, 0.40), (160, 0.30), (20, 0.30)]
    for t in np.linspace(0, 2 * math.pi, 400):
        deg = math.degrees(t) - 180
        r = 0.16
        for a0, L in lobes:
            dd = abs((deg - a0 + 180) % 360 - 180)
            r = max(r, L * max(0.0, 1 - dd / 30.0) ** 0.8 + 0.12)
        pts.append((cx + S * r * math.cos(math.radians(deg)), cy + S * r * math.sin(math.radians(deg))))
    d.polygon(pts, fill=col + (255,))
    for a0, L in lobes:
        d.line([(cx, cy), (cx + S * L * 0.9 * math.cos(math.radians(a0)), cy + S * L * 0.9 * math.sin(math.radians(a0)))], fill=vein + (255,), width=4)
    d.line([(cx, cy), (cx, S - 6)], fill=vein + (255,), width=5)
    shade_leaf(img, seed).filter(ImageFilter.SMOOTH).save(os.path.join(OUT, name))   # the stalk below the blade is wanted


monstera()
simple_leaf('leaf_oval.png', (30, 88, 38), (78, 132, 62), 2, pointed=0.25, width=0.30)
simple_leaf('leaf_long.png', (36, 92, 44), (92, 142, 74), 6, pointed=0.1, width=0.17)
simple_leaf('leaf_bract.png', (214, 74, 110), (240, 150, 170), 7, pointed=0.45, width=0.26)
simple_leaf('leaf_dry.png', (150, 44, 60), (110, 30, 44), 9, pointed=0.35, width=0.2)
maple('leaf_autumn.png', (222, 112, 36), (150, 62, 20), 5)
maple('leaf_autumn2.png', (196, 74, 28), (128, 44, 18), 8)

# ------------------------------------------------------------------ leather grain (normal) and wall paint (normal)
g = tile_noise(512, 512, 96, 96, 31, 2)
save_png('leather_n.png', normal_from_height(cv2.GaussianBlur(g, (0, 0), 0.8), 1.6))
g = tile_noise(512, 512, 160, 160, 33, 2)
save_png('paint_n.png', normal_from_height(cv2.GaussianBlur(g, (0, 0), 1.0), 0.5))
print('PBR textures written to', OUT)


# ------------------------------------------------------------------ street seen from the ground-floor shop front
def street_ground():
    """The building across the street: its ground floor (door and lit shop window) comes from the
    video frame taken at the first-floor window, the storey above from the frame used upstairs."""
    f1 = cv2.imread(os.path.join(SP, 'frames10', 'f_0506.jpg'))
    f2 = cv2.imread(os.path.join(SP, 'frames10', 'f_0655.jpg'))
    if f1 is None or f2 is None:
        print('video frames not found: street_a.jpg left as it is')
        return
    low = cv2.resize(f1[20:205, 70:478], (1024, 464), interpolation=cv2.INTER_CUBIC)
    up = f2[194:330, 96:236]
    up = np.hstack([up[:, ::-1], up, up[:, ::-1]])
    up = cv2.resize(up, (1024, 330), interpolation=cv2.INTER_CUBIC)
    img = np.vstack([up, low]).astype(np.float32)
    seam = 330
    blur = cv2.GaussianBlur(img, (0, 0), 14)
    ramp = np.clip(1 - np.abs(np.arange(img.shape[0]) - seam) / 40.0, 0, 1)[:, None, None]
    img = img * (1 - ramp) + blur * ramp
    img = cv2.GaussianBlur(img, (0, 0), 2.2)            # out of focus, like a background behind glass
    cv2.imwrite(os.path.join(OUT, 'street_a.jpg'), np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 88])


street_ground()
# cobblestones for the strip of street in front of the door (tileable)
S = 512
n = tile_noise(S, S, 20, 20, 51, 2)
n2 = tile_noise(S, S, 3, 3, 52, 2)
c = 118 + 46 * (n - 0.5) + 20 * (n2 - 0.5)
save_rgb('cobbles.jpg', np.stack([c, c * 0.97, c * 0.92], -1), 86)


# ------------------------------------------------------------------ 110 x 70 cm table top and the round sign
def table_mid():
    W, H = 1024, 652
    img, hgt = wood_planks(W, H, 5, 17)
    txt = Image.new('L', (480, 76), 0)
    ImageDraw.Draw(txt).text((4, 2), 'Toasteria Italiana', font=ImageFont.truetype(FONT_B, 58), fill=255)
    txt = txt.resize((int(480 * 0.74), 76), Image.LANCZOS).rotate(90, expand=True)
    mask = np.zeros((H, W), np.float32)
    x0, y0 = W - 96, (H - txt.size[1]) // 2
    mask[y0:y0 + txt.size[1], x0:x0 + txt.size[0]] = np.asarray(txt, np.float32) / 255
    a = img * (1 - 0.82 * mask[..., None]) + np.array((70, 38, 16), np.float32) * 0.82 * mask[..., None]
    hgt = hgt - 2.2 * cv2.GaussianBlur(mask, (0, 0), 1.0)
    save_rgb('table_mid.jpg', a, 90)
    save_png('table_mid_n.png', normal_from_height(cv2.GaussianBlur(hgt, (0, 0), 0.7), 0.9, wrap=False))


def logo_sign():
    S = 512
    pil = Image.new('RGBA', (S, S), (244, 240, 232, 255))
    red = (140, 24, 34, 255)
    d = ImageDraw.Draw(pil)
    d.ellipse([26, 26, S - 26, S - 26], fill=(250, 247, 240, 255), outline=red, width=10)
    seal(pil, S // 2, S // 2 - 6, 176, red, ImageFont.truetype(FONT_XB, 46))
    pil.convert('RGB').save(os.path.join(OUT, 'logo_sign.jpg'), quality=90)


table_mid(); logo_sign()
