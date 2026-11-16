"""Build the Toasteria interior in Blender from the measurements taken off the video.

Coordinates in metres: x to the right when you walk in from the street, y from the
street front (y=0) towards the back, z up. Ground floor at z=0, first floor at z=3.42.
Run:  blender -b -P build.py -- out.blend
"""
import bpy, math, random, sys, os
from mathutils import Vector, Matrix, Euler
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, lib
importlib.reload(lib)
from lib import *

random.seed(4)
OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.join(HERE, 'toasteria.blend')

# start empty
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ------------------------------------------------------------------ dimensions
Z1 = 3.42          # first floor level
CZ0 = 3.05         # ground floor ceiling
CZ1 = Z1 + 3.20    # first floor ceiling
RISE, TREAD = 0.18, 0.27
STAIR_X = (1.9, 3.0)
STAIR_Y0 = 4.9                       # first riser of flight 1
N1 = 16                              # risers to the landing
LAND_Z = N1 * RISE                   # 2.88
LAND_Y0 = STAIR_Y0 + (N1 - 1) * TREAD   # 8.95
LAND_Y1 = LAND_Y0 + 1.10             # poster wall face
F2_X = (0.8, 1.9)
F2_TOP_Y = LAND_Y0 - 2 * TREAD       # 8.41, top of the short flight
VOID_Y0 = 6.0

# ------------------------------------------------------------------ materials
M = dict(
    red=mat('wall_red', '#7a0e18', 0.85, spec=0.3),
    red_ceil=mat('beam_red', '#780e18', 0.85, spec=0.3),
    black=mat('wall_black', '#1d1a1a', 0.85, spec=0.3),
    white=mat('wall_white', '#efebe4', 0.9, spec=0.3),
    ceiling=mat('ceiling_white', '#f3f0ea', 0.95, spec=0.2),
    grey_niche=mat('niche_grey', '#d7d4cf', 0.9, spec=0.2),
    floor_gf=mat('floor_ground', '#d6b280', 0.55, tex='floor_ground.jpg', spec=0.45),
    floor_uf=mat('floor_upper', '#ddb884', 0.5, tex='floor_upper.jpg', spec=0.45),
    carpet=mat('stair_tread', '#777370', 0.95, tex='carpet.jpg', spec=0.2),
    riser=mat('stair_riser', '#f1efea', 0.6),
    skirting=mat('skirting', '#f4f2ee', 0.5),
    venus=mat('mural_venus', '#ffffff', 0.75, tex='mural_venus.jpg', spec=0.3),
    primavera=mat('mural_primavera', '#ffffff', 0.75, tex='mural_primavera.jpg', spec=0.3),
    rail_white=mat('railing_white', '#f2f1ed', 0.35),
    steel=mat('steel', '#b9b9b6', 0.25, metal=0.0, spec=0.9),
    cable=mat('steel_cable', '#8e8e8e', 0.35, metal=0.0),
    chair=mat('chair_white', '#f3f1ea', 0.35),
    cushion=mat('cushion_red', '#8c1823', 0.55, spec=0.4),
    iron=mat('cast_iron', '#151414', 0.45, metal=0.4),
    table_long=mat('table_long', '#c48a46', 0.32, tex='table_long.jpg', coat=0.3),
    table_small=mat('table_small', '#c48a46', 0.32, tex='table_small.jpg', coat=0.3),
    table_edge=mat('table_edge', '#1b1716', 0.4),
    frame_brown=mat('window_frame', '#4a2d1f', 0.45),
    frame_black=mat('frame_black', '#121212', 0.4),
    alu=mat('aluminium', '#b4b4b2', 0.3, metal=0.0, spec=0.8),
    door_white=mat('door_white', '#f1efe9', 0.45),
    leather=mat('banquette_red', '#7c111b', 0.42, spec=0.5),
    piping=mat('piping_white', '#f2f0ea', 0.5),
    acap=mat('acapulco_black', '#141414', 0.45),
    weave=mat('acapulco_weave', '#141414', 0.45, tex='weave.png', alpha=True),
    pillow_red=mat('pillow_red', '#8a1324', 0.8),
    pillow_black=mat('pillow_black', '#1a1a1c', 0.85),
    pot=mat('pot_black', '#191919', 0.6),
    soil=mat('soil', '#2b2119', 1.0),
    stem=mat('stem_green', '#3c6b33', 0.7),
    leaf=mat('leaf_monstera', '#2e6a2f', 0.5, tex='leaf_monstera.png', alpha=True),
    leaf2=mat('leaf_oval', '#2a6030', 0.45, tex='leaf_oval.png', alpha=True),
    crate_a=mat('crate_front_a', '#b5895c', 0.85, tex='crate_a.jpg'),
    crate_b=mat('crate_front_b', '#b5895c', 0.85, tex='crate_b.jpg'),
    crate_s=mat('crate_side', '#a67c52', 0.9, tex='crate_side.jpg'),
    bottle=mat('bottle_dark', '#2a1a12', 0.15, spec=0.8),
    fire=mat('extinguisher_red', '#b0141a', 0.35),
    sign_red=mat('sign_red', '#c0262b', 0.5),
    ac=mat('ac_white', '#eeeeea', 0.4),
    vent=mat('vent_grey', '#bdbab3', 0.6),
    track=mat('track_black', '#141414', 0.35, metal=0.3),
    lens=mat('EMIT_lens', '#fff2d6', 0.3, emit=25.0),
    menu=mat('menu_white', '#f4f1ea', 0.6),
    beer=mat('beer_crate_blue', '#1d3b78', 0.5),
    cardboard=mat('cardboard', '#a97f53', 0.9),
    orange=mat('pumpkin_orange', '#d86f1d', 0.5),
    autumn=mat('autumn_leaves', '#c0561c', 0.6),
    glass=mat('GLASS_window', '#d8e4e8', 0.05, spec=0.5),
    street_a=mat('EMIT_street_a', '#ffffff', 1.0, tex='street_a.jpg', emit=0.6),
    street_b=mat('EMIT_street_b', '#ffffff', 1.0, tex='street_b.jpg', emit=0.6),
    iron_rail=mat('balcony_railing', '#c9c5be', 0.5, tex='railing_iron.png', alpha=True),
    logo=mat('logo_sign', '#ffffff', 0.6, tex='logo_sign.jpg'),
    pictures=mat('pictures_grid', '#ffffff', 0.6, tex='pictures_grid.jpg'),
    mat_paper=mat('poster_mat', '#f4f2ee', 0.7),
)
for i in range(1, 9):
    M[f'poster_{i}'] = mat(f'poster_{i}', '#ffffff', 0.6, tex=f'poster_{i}.jpg')
for n in ('coppia', 'drink1', 'drink2'):
    M[f'poster_{n}'] = mat(f'poster_{n}', '#ffffff', 0.6, tex=f'poster_{n}.jpg')

# ------------------------------------------------------------------ furniture builders
def chair(name, coll, loc, face_deg, cushion=True):
    """White folding bistro chair with red cushion. face_deg: direction the sitter looks
    (0 = +y, 90 = -x, 180 = -y, 270 = +x)."""
    parts = []
    W = M['chair']
    for s in (-1, 1):
        parts.append(cylinder(f'{name}_rear{s}', (s * 0.19, 0.29, 0), (s * 0.18, 0.20, 0.86), 0.011, W, coll, 8))
        parts.append(cylinder(f'{name}_front{s}', (s * 0.20, -0.23, 0), (s * 0.19, 0.12, 0.445), 0.011, W, coll, 8))
        parts.append(box(f'{name}_rail{s}', (s * 0.19 - 0.01, -0.20, 0.425), (s * 0.19 + 0.01, 0.19, 0.44), W, coll))
    for k, z in enumerate((0.69, 0.79)):
        parts.append(box(f'{name}_back{k}', (-0.185, 0.205 - (z - 0.69) * 0.1, z), (0.185, 0.22 - (z - 0.69) * 0.1, z + 0.065), W, coll))
    for k in range(5):
        y = -0.19 + k * 0.077
        parts.append(box(f'{name}_seat{k}', (-0.19, y, 0.44), (0.19, y + 0.065, 0.452), W, coll))
    parts.append(cylinder(f'{name}_bar', (-0.19, 0.27, 0.16), (0.19, 0.27, 0.16), 0.008, W, coll, 6))
    if cushion:
        parts.append(box(f'{name}_cushion', (-0.185, -0.19, 0.452), (0.185, 0.17, 0.49), M['cushion'], coll))
    o = join(parts, name)
    transform(o, loc, math.radians(face_deg) + math.pi)
    return o


def pedestal(name, coll, x, y, h=0.70, foot=0.62):
    p = [cylinder(f'{name}_col', (x, y, 0.05), (x, y, h), 0.035, M['iron'], coll, 10),
         cylinder(f'{name}_neck', (x, y, 0.05), (x, y, 0.22), 0.06, M['iron'], coll, 10, r1=0.035),
         box(f'{name}_f1', (x - foot / 2, y - 0.035, 0), (x + foot / 2, y + 0.035, 0.05), M['iron'], coll),
         box(f'{name}_f2', (x - 0.035, y - foot / 2, 0), (x + 0.035, y + foot / 2, 0.05), M['iron'], coll),
         box(f'{name}_top', (x - 0.24, y - 0.03, h - 0.03), (x + 0.24, y + 0.03, h), M['iron'], coll)]
    return p


def table(name, coll, cx, cy, sx, sy, rot=0.0, top_mat=None, pedestals=1, z=0.75):
    top_mat = top_mat or M['table_small']
    parts = [box(f'{name}_top', (-sx / 2, -sy / 2, z - 0.035), (sx / 2, sy / 2, z), M['table_edge'], coll,
                 faces={'top': top_mat}, uv01=('top',)),
             box(f'{name}_apron', (-sx / 2 + 0.05, -sy / 2 + 0.05, z - 0.09), (sx / 2 - 0.05, sy / 2 - 0.05, z - 0.035), M['iron'], coll)]
    if pedestals == 1:
        parts += pedestal(f'{name}_p', coll, 0, 0, z - 0.09, min(sx, sy) * 0.85)
    else:
        for s in (-1, 1):
            parts += pedestal(f'{name}_p{s}', coll, s * sx * 0.3, 0, z - 0.09, sy * 0.8)
    o = join(parts, name)
    transform(o, (cx, cy, 0), rot)
    return o


def menu_stand(name, coll, x, y, rot=0.0):
    p = [box(f'{name}_a', (-0.05, -0.012, 0.75), (0.05, 0.012, 0.92), M['menu'], coll),
         box(f'{name}_b', (-0.06, -0.035, 0.75), (0.06, 0.035, 0.765), M['frame_black'], coll)]
    o = join(p, name)
    transform(o, (x, y, 0), rot)
    return o


def acapulco(name, coll, loc, face_deg, pillow):
    parts = []
    a, b = 0.36, 0.40            # half width / half height of the oval
    tilt = math.radians(28)
    def P(t, r=1.0):
        x = a * r * math.cos(t); h = b * r * math.sin(t)
        return Vector((x, h * math.sin(tilt) * 1.0 + 0.02, 0.62 + h * math.cos(tilt)))
    N = 28
    for k in range(N):
        t0, t1 = 2 * math.pi * k / N, 2 * math.pi * (k + 1) / N
        parts.append(cylinder(f'{name}_r{k}', P(t0), P(t1), 0.017, M['acap'], coll, 6, caps=False))
    # weave disc
    import bmesh
    bm = bmesh.new()
    c = bm.verts.new(P(0, 0))
    ring = [bm.verts.new(P(2 * math.pi * k / N, 0.98)) for k in range(N)]
    lay = bm.loops.layers.uv.new('UVMap')
    for k in range(N):
        f = bm.faces.new([c, ring[k], ring[(k + 1) % N]])
        for l in f.loops:
            co = l.vert.co
            l[lay].uv = ((co.x + a) / (2 * a) * 3, (co.z - 0.2) * 3)
    bm.normal_update()
    parts.append(lib._finish(f'{name}_weave', bm, [M['weave']], coll))
    for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        top = Vector((sx * 0.22, sy * 0.12 + 0.02, 0.45))
        parts.append(cylinder(f'{name}_leg{sx}{sy}', (sx * 0.30, sy * 0.33, 0), top, 0.01, M['acap'], coll, 6))
    pm = M['pillow_red'] if pillow == 'red' else M['pillow_black']
    pil = box(f'{name}_pillow', (-0.21, -0.07, -0.21), (0.21, 0.07, 0.21), pm, coll)
    transform(pil, (0, 0.10, 0.62), rot=(-(math.pi / 2 - tilt) + 0.25, 0, 0))
    parts.append(pil)
    o = join(parts, name)
    transform(o, loc, math.radians(face_deg) + math.pi)
    return o


def plant(name, coll, loc, kind='monstera', height=1.3, pot_r=0.2, pot_h=0.38, stand=0.0):
    x, y, z0 = loc
    parts = [cylinder(f'{name}_pot', (x, y, z0 + stand), (x, y, z0 + stand + pot_h), pot_r, M['pot'], coll, 16, r1=pot_r * 0.9),
             cylinder(f'{name}_soil', (x, y, z0 + stand + pot_h - 0.04), (x, y, z0 + stand + pot_h - 0.02), pot_r * 0.92, M['soil'], coll, 16)]
    if stand:
        for sx, sy in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
            parts.append(cylinder(f'{name}_sl{sx}{sy}', (x + sx * pot_r * 0.7, y + sy * pot_r * 0.7, z0), (x + sx * pot_r * 0.6, y + sy * pot_r * 0.6, z0 + stand + 0.02), 0.008, M['iron'], coll, 6))
    base = Vector((x, y, z0 + stand + pot_h - 0.03))
    rnd = random.Random(hash(name) % 10000)
    n = 9 if kind == 'monstera' else 26
    for k in range(n):
        ang = rnd.uniform(0, 2 * math.pi)
        hgt = rnd.uniform(0.45, 1.0) * height
        out = rnd.uniform(0.15, 0.45) * (height if kind == 'monstera' else height * 0.5)
        tip = base + Vector((math.cos(ang) * out, math.sin(ang) * out, hgt))
        parts.append(cylinder(f'{name}_st{k}', base, tip, 0.008 if kind == 'monstera' else 0.006, M['stem'], coll, 5))
        if kind == 'monstera':
            s = rnd.uniform(0.32, 0.5)
            q = quad(f'{name}_lf{k}', [(-s / 2, 0, 0), (s / 2, 0, 0), (s / 2, s, 0), (-s / 2, s, 0)], M['leaf'], coll)
            transform(q, tip, rot=(rnd.uniform(0.35, 1.05), rnd.uniform(-0.35, 0.35), ang - math.pi / 2))
            parts.append(q)
        else:
            for j in range(5):
                t = 0.35 + j * 0.15
                p = base.lerp(tip, t)
                for sd in (-1, 1):
                    s = 0.11
                    q = quad(f'{name}_lf{k}_{j}{sd}', [(-s * 0.3, 0, 0), (s * 0.3, 0, 0), (s * 0.3, s, 0), (-s * 0.3, s, 0)], M['leaf2'], coll)
                    transform(q, p, rot=(0.9, 0, ang + sd * 1.2))
                    parts.append(q)
    return join(parts, name)


def track(name, coll, p0, p1, z, heads, lights_on=True, energy=55, temp=3300, spot=45):
    """Ceiling track with spot heads. heads: list of (t along track, target xyz)."""
    p0 = Vector((*p0, z)); p1 = Vector((*p1, z))
    parts = [cylinder(f'{name}_tr', p0 - Vector((0, 0, 0.02)), p1 - Vector((0, 0, 0.02)), 0.018, M['track'], coll, 6)]
    parts[0].name = f'{name}_tr'
    lights = []
    for k, (t, tgt) in enumerate(heads):
        hp = p0.lerp(p1, t) - Vector((0, 0, 0.05))
        d = (Vector(tgt) - hp).normalized()
        head0 = hp + Vector((0, 0, 0.0))
        parts.append(cylinder(f'{name}_stem{k}', hp + Vector((0, 0, 0.03)), hp, 0.008, M['track'], coll, 6))
        parts.append(cylinder(f'{name}_h{k}', head0 - d * 0.04, head0 + d * 0.11, 0.032, M['track'], coll, 12))
        parts.append(cylinder(f'{name}_l{k}', head0 + d * 0.11, head0 + d * 0.114, 0.026, M['lens'], coll, 12))
        if lights_on:
            lights.append(light(f'{name}_spot{k}', 'SPOT', head0 + d * 0.13, energy, kelvin(temp), tgt, size=0.03, spot=spot, blend=0.6))
    return join(parts, name), lights


def french_window(name, coll, x0, x1, y, z0, z1, panels=3):
    fw, fd = 0.07, 0.08
    p = [box(f'{name}_l', (x0, y - fd, z0), (x0 + fw, y, z1), M['frame_brown'], coll),
         box(f'{name}_r', (x1 - fw, y - fd, z0), (x1, y, z1), M['frame_brown'], coll),
         box(f'{name}_t', (x0, y - fd, z1 - fw), (x1, y, z1), M['frame_brown'], coll),
         box(f'{name}_b', (x0, y - fd, z0), (x1, y, z0 + 0.10), M['frame_brown'], coll)]
    pw = (x1 - x0 - 2 * fw) / panels
    for k in range(1, panels):
        xm = x0 + fw + k * pw
        p.append(box(f'{name}_m{k}', (xm - 0.05, y - fd, z0), (xm + 0.05, y, z1), M['frame_brown'], coll))
    for k in range(panels):
        xa = x0 + fw + k * pw + 0.05
        xb = x0 + fw + (k + 1) * pw - 0.05
        p.append(box(f'{name}_s{k}', (xa, y - fd + 0.01, z0 + 0.10), (xb, y - 0.01, z0 + 0.16), M['frame_brown'], coll))
        p.append(box(f'{name}_h{k}', (xb - 0.04, y + 0.0, z0 + 1.0), (xb - 0.02, y + 0.05, z0 + 1.18), M['alu'], coll))
    frame = join(p, name)
    g = wall_quad(f'GLASS_{name}', ('y', y - fd / 2, 1), x1 - fw, x0 + fw, z0 + 0.10, z1 - fw, M['glass'], 'glass')
    g['kind'] = 'glass'
    return frame, g


def crate(name, coll, x, y, z, w=0.40, h=0.30, d=0.30, rot=0.0, front=None):
    o = box(name, (-w / 2, -d / 2, 0), (w / 2, d / 2, h), M['crate_s'], coll, tile=0.5,
            faces={'front': front or M['crate_a']}, uv01=('front',))
    transform(o, (x, y, z), rot)
    return o


def picture(name, coll, plane, a0, a1, z0, z1, material, frame=0.025):
    """Framed picture: black frame box slightly proud of the wall + print."""
    axis, val, facing = plane
    parts = []
    if axis == 'x':
        x0, x1 = sorted((val, val + 0.02 * facing))
        parts.append(box(f'{name}_fr', (x0, min(a0, a1) - frame, z0 - frame), (x1, max(a0, a1) + frame, z1 + frame), M['frame_black'], coll))
    else:
        y0, y1 = sorted((val, val + 0.02 * facing))
        parts.append(box(f'{name}_fr', (min(a0, a1) - frame, y0, z0 - frame), (max(a0, a1) + frame, y1, z1 + frame), M['frame_black'], coll))
    parts.append(wall_quad(f'{name}_pr', plane, a0, a1, z0, z1, material, coll, offset=0.021))
    return join(parts, name)


# ================================================================== GROUND FLOOR
G = 'gf'
gf = []
gf.append(box('gf_floor', (0, -0.3, -0.2), (5.2, 5.5, 0), M['white'], G, tile=2.0, skip=('bottom',), faces={'top': M['floor_gf']}))
gf.append(box('gf_floor_back', (3.0, 5.5, -0.2), (4.6, 8.2, 0), M['white'], G, tile=2.0, skip=('bottom',), faces={'top': M['floor_gf']}))
gf.append(box('gf_ceiling', (-0.15, -0.3, CZ0), (5.35, 5.1, Z1), M['ceiling'], G, skip=('top',)))
gf.append(box('gf_beam', (-0.15, 5.1, 2.75), (5.35, 5.5, Z1), M['red_ceil'], G, skip=('top',)))
# left wall: white pier at the entrance, black behind the mural
gf.append(box('gf_wall_l_white', (-0.15, -0.3, 0), (0, 0.6, CZ0), M['white'], G, skip=('left',)))
gf.append(box('gf_wall_l_black', (-0.15, 0.6, 0), (0, 5.5, CZ0), M['black'], G, skip=('left',)))
gf.append(wall_quad('gf_venus', ('x', 0.0, 1), 4.45, 1.15, 0.80, 2.84, M['venus'], G, offset=0.006))
# back walls
gf.append(box('gf_back_red', (-0.15, 5.5, 0), (1.9, 5.65, 2.75), M['red'], G, skip=('back',)))
gf.append(box('gf_stairside_l', (1.75, 5.65, 0), (1.9, LAND_Y0, CZ0), M['white'], G, skip=('left',)))
gf.append(box('gf_back_red_r', (4.75, 5.5, 0), (5.35, 5.65, 2.75), M['red'], G, skip=('back',)))
# right wall
gf.append(box('gf_wall_r', (5.2, -0.3, 0), (5.35, 5.5, CZ0), M['white'], G, skip=('right',)))
# corridor to the toilet
gf.append(box('gf_corr_r', (4.6, 5.5, 0), (4.75, 8.35, 2.75), M['red'], G, skip=('right',)))
gf.append(box('gf_corr_back', (3.0, 8.2, 0), (4.75, 8.35, 2.75), M['white'], G, skip=('back',)))
gf.append(box('gf_corr_ceil', (3.0, 5.5, 2.75), (4.75, 8.35, 2.88), M['ceiling'], G))
gf.append(box('gf_door_wc', (4.585, 6.55, 0), (4.6, 7.4, 2.1), M['door_white'], G, skip=('right',)))
gf.append(cylinder('gf_door_wc_h', (4.57, 7.28, 1.0), (4.57, 7.36, 1.0), 0.01, M['steel'], G, 6))
gf.append(wall_quad('gf_logo', ('y', 8.2, -1), 4.05, 3.55, 1.35, 1.85, M['logo'], G, offset=0.004))
gf.append(box('gf_vent', (3.5, 8.18, 2.45), (4.0, 8.2, 2.62), M['vent'], G))
# skirting boards
for nm, a, b in (('gf_sk_l', (0.0, 0.6, 0), (0.012, 5.5, 0.08)), ('gf_sk_r', (5.188, 0, 0), (5.2, 5.5, 0.08)),
                 ('gf_sk_back', (0, 5.488, 0), (1.9, 5.5, 0.08))):
    gf.append(box(nm, a, b, M['skirting'], G))
# storefront: white piers, lintel, glazing and the door
gf.append(box('gf_front_lintel', (0.6, -0.3, 2.55), (5.2, 0, CZ0), M['white'], G))
gf.append(box('gf_front_pier', (-0.15, -0.3, 0), (0.6, 0, CZ0), M['white'], G))
for k, (a, b) in enumerate(((0.6, 0.68), (2.42, 2.5), (3.6, 3.68), (5.12, 5.2))):
    gf.append(box(f'gf_front_mullion{k}', (a, -0.12, 0), (b, -0.04, 2.55), M['alu'], G))
gf.append(box('gf_front_sill', (0.6, -0.12, 0), (5.2, -0.04, 0.08), M['alu'], G))
gf.append(box('gf_front_head', (0.6, -0.12, 2.47), (5.2, -0.04, 2.55), M['alu'], G))
gf.append(box('gf_door_frame', (2.5, -0.1, 0.0), (3.6, -0.05, 0.06), M['alu'], G))
gf.append(cylinder('gf_door_handle', (3.45, -0.02, 0.7), (3.45, -0.02, 1.6), 0.02, M['steel'], G, 10))
for k, (a, b) in enumerate(((0.68, 2.42), (2.5, 3.6), (3.68, 5.12))):
    g = wall_quad(f'GLASS_gf_front{k}', ('y', -0.08, 1), b, a, 0.08, 2.47, M['glass'], 'glass')
    g['kind'] = 'glass'
gf_street = wall_quad('EMIT_gf_street', ('y', -3.0, 1), 6.7, -1.5, -0.3, 4.0, M['street_a'], 'emit')
# hexagonal-tile doormat area near the door
gf.append(box('gf_mat', (2.45, 0.0, 0.0), (3.65, 0.9, 0.006), mat('doormat', '#8a8580', 0.95), G))

# tables along the Venus wall + the small pedestal table by the stairs
gtables = [(1.25, 'a'), (2.6, 'b'), (3.95, 'c')]
for y, tag in gtables:
    gf.append(table(f'gf_table_{tag}', G, 0.62, y, 1.1, 0.7, 0.0, M['table_small'], 1))
    for cx in (0.35, 0.9):
        gf.append(chair(f'gf_ch_{tag}_{cx}a', G, (cx, y - 0.52, 0), 0))
        gf.append(chair(f'gf_ch_{tag}_{cx}b', G, (cx, y + 0.52, 0), 180))
    gf.append(menu_stand(f'gf_menu_{tag}', G, 0.95, y, 0.3))
gf.append(table('gf_table_d', G, 1.25, 4.95, 0.7, 0.7, 0.0, M['table_small'], 1))
gf.append(chair('gf_ch_d1', G, (1.25, 4.45, 0), 0))
gf.append(chair('gf_ch_d2', G, (1.72, 4.95, 0), 90))
gf.append(menu_stand('gf_menu_d', G, 1.25, 4.95, 0.0))
gf.append(plant('gf_monstera', G, (0.45, 5.15, 0), 'monstera', 1.45, 0.22, 0.42))
for k in range(3):
    gf.append(box(f'gf_beer{k}', (0.75 + k * 0.02, 5.1 - k * 0.0, k * 0.27), (1.15 + k * 0.02, 5.4, k * 0.27 + 0.26), M['beer'], G))
for k in range(3):
    gf.append(box(f'gf_box{k}', (3.2, 7.5 - k * 0.45, 0), (3.6, 7.9 - k * 0.45, 0.35 + 0.1 * (k % 2)), M['cardboard'], G))
gf.append(plant('gf_entrance_plant', G, (0.95, 0.45, 0), 'zz', 1.1, 0.2, 0.4))
# framed posters on the (unfilmed) right wall
for k, (y, p) in enumerate(((1.4, 1), (2.6, 5), (3.8, 8))):
    gf.append(picture(f'gf_rpic{k}', G, ('x', 5.2, -1), y + 0.21, y - 0.21, 1.35, 1.91, M[f'poster_{p}']))
# track lights
t1, l1 = track('gf_track1', G, (1.6, 0.5), (1.6, 4.8), CZ0, [(0.12, (0, 1.4, 1.6)), (0.35, (0, 2.4, 1.6)), (0.58, (0, 3.4, 1.6)), (0.8, (0, 4.2, 1.5)), (1.0, (1.2, 5.0, 0.6))], energy=220, spot=55)
t2, l2 = track('gf_track2', G, (3.6, 0.5), (3.6, 4.8), CZ0, [(0.15, (3.6, 1.2, 0)), (0.55, (3.0, 3.0, 0)), (0.95, (2.6, 5.4, 0.8))], energy=200, spot=60)
gf += [t1, t2]
light('gf_corr_light', 'POINT', (3.8, 7.2, 2.6), 14, kelvin(3200), size=0.1)
light('gf_fill1', 'AREA', (1.4, 2.7, CZ0 - 0.02), 140, kelvin(3400), rot=(0, 0, 0), size=1.6, size_y=4.0)
light('gf_fill2', 'AREA', (3.8, 2.7, CZ0 - 0.02), 120, kelvin(3400), rot=(0, 0, 0), size=1.6, size_y=4.0)
light('gf_storefront', 'AREA', (2.9, -0.25, 1.5), 420, (0.9, 0.95, 1.0), target=(2.9, 3, 1.2), size=4.4, size_y=2.4)

# ================================================================== STAIRS + LANDING
S = 'st'
st = []
for i in range(N1):
    y0 = STAIR_Y0 + i * TREAD
    z1 = (i + 1) * RISE
    y1 = y0 + TREAD if i < N1 - 1 else LAND_Y1
    st.append(box(f'st_step{i}', (STAIR_X[0], y0, 0), (STAIR_X[1], y1, z1), M['riser'], S,
                  faces={'top': M['carpet']}, skip=('bottom', 'back') if i < N1 - 1 else ('bottom',), tile=1.0))
# landing extension to the left, under the short flight
st.append(box('st_landing_l', (F2_X[0] - 0.15, LAND_Y0, 0), (F2_X[1], LAND_Y1, LAND_Z), M['riser'], S, faces={'top': M['carpet']}, skip=('bottom',)))
for i in range(2):
    y0 = LAND_Y0 - (i + 1) * TREAD
    st.append(box(f'st_f2_{i}', (F2_X[0] - 0.15, y0, 0), (F2_X[1], y0 + TREAD, LAND_Z + (i + 1) * RISE), M['riser'], S,
                  faces={'top': M['carpet']}, skip=('bottom',)))
# poster wall and the side walls of the landing
st.append(box('st_poster_wall', (0.65, LAND_Y1, 0), (3.15, LAND_Y1 + 0.15, CZ1), M['red'], S, skip=('back',)))
st.append(box('st_wall_l', (0.5, F2_TOP_Y, LAND_Z), (F2_X[0] - 0.15, LAND_Y1, CZ1), M['white'], S, skip=('left',)))
st.append(box('st_wall_r', (3.0, VOID_Y0, 2.88), (3.2, LAND_Y1 + 0.15, CZ1), M['white'], S))
st.append(box('st_shaft_ceiling', (0.65, VOID_Y0, CZ1), (3.2, LAND_Y1 + 0.15, CZ1 + 0.15), M['ceiling'], S, skip=('top',)))
# posters: 4 columns x 2 rows of black frames
pw, ph, gap = 0.42, 0.56, 0.12
x_start = (0.8 + 3.0) / 2 - (4 * pw + 3 * gap) / 2
order = [[1, 2, 3, 4], [5, 6, 7, 8]]
for r, row in enumerate(order):
    z0 = 4.73 - r * (ph + gap)
    for c, p in enumerate(row):
        xa = x_start + c * (pw + gap)
        st.append(picture(f'st_poster{p}', S, ('y', LAND_Y1, -1), xa + pw - 0.03, xa + 0.03, z0 + 0.03, z0 + ph - 0.03, M[f'poster_{p}'], frame=0.03))
# railings: posts, cables and stainless handrail along both sides of flight 1
def railing(name, coll, pts, h=0.95, posts=True, cables=5):
    parts = []
    for a, b in zip(pts[:-1], pts[1:]):
        a, b = Vector(a), Vector(b)
        parts.append(cylinder(f'{name}_hr', a + Vector((0, 0, h)), b + Vector((0, 0, h)), 0.022, M['steel'], coll, 10))
        for k in range(cables):
            dz = 0.12 + k * (h - 0.25) / max(1, cables - 1)
            parts.append(cylinder(f'{name}_c{k}', a + Vector((0, 0, dz)), b + Vector((0, 0, dz)), 0.003, M['cable'], coll, 4, caps=False))
        L = (b - a).length
        n = max(1, int(L / 0.9))
        if posts:
            for j in range(n + 1):
                p = a.lerp(b, j / n)
                parts.append(box(f'{name}_p{j}', (p.x - 0.02, p.y - 0.02, p.z), (p.x + 0.02, p.y + 0.02, p.z + h - 0.02), M['rail_white'], coll))
    return join(parts, name)
y_end = STAIR_Y0 + (N1 - 1) * TREAD
st.append(railing('st_rail_r', S, [(STAIR_X[1] - 0.03, STAIR_Y0 + 0.1, RISE), (STAIR_X[1] - 0.03, y_end, N1 * RISE)]))
st.append(railing('st_rail_l', S, [(STAIR_X[0] + 0.05, STAIR_Y0 + 0.1, RISE), (STAIR_X[0] + 0.05, y_end - 0.3, N1 * RISE - 0.2)]))
# upper-floor guard rail around the void and along the short flight
st.append(railing('st_rail_void', S, [(STAIR_X[0], LAND_Y0, LAND_Z + 0.02), (STAIR_X[0], F2_TOP_Y, Z1), (STAIR_X[0], VOID_Y0 + 0.02, Z1), (STAIR_X[1], VOID_Y0 + 0.02, Z1)]))
light('st_spot1', 'SPOT', (2.45, 9.4, CZ1 - 0.08), 220, kelvin(3300), target=(1.9, LAND_Y1, 4.4), size=0.03, spot=60, blend=0.6)
light('st_spot2', 'SPOT', (2.45, 7.0, CZ1 - 0.08), 180, kelvin(3300), target=(2.45, 6.5, 1.0), size=0.03, spot=70, blend=0.6)
st.append(cylinder('st_spot1_body', (2.45, 9.4, CZ1), (2.45, 9.4, CZ1 - 0.08), 0.04, M['track'], S, 12))
st.append(cylinder('st_spot2_body', (2.45, 7.0, CZ1), (2.45, 7.0, CZ1 - 0.08), 0.04, M['track'], S, 12))
light('st_land_fill', 'POINT', (1.9, 9.5, 5.6), 60, kelvin(3200), size=0.2)
light('st_shaft_fill', 'AREA', (2.0, 8.0, CZ1 - 0.02), 160, kelvin(3400), rot=(0, 0, 0), size=1.8, size_y=3.6)

# ================================================================== FIRST FLOOR
U = 'uf'
uf = []
# slab between floors (as floor of the first floor), leaving the stair openings
uf.append(box('uf_floor_front', (0, 0, CZ0), (8.4, VOID_Y0, Z1), M['white'], U, tile=2.0, skip=('bottom',), faces={'top': M['floor_uf']}))
uf.append(box('uf_floor_a_back', (0, VOID_Y0, CZ0), (STAIR_X[0], F2_TOP_Y, Z1), M['white'], U, tile=2.0, skip=('bottom',), faces={'top': M['floor_uf']}))
uf.append(box('uf_floor_b_back', (3.2, VOID_Y0, CZ0), (8.4, 8.0, Z1), M['white'], U, tile=2.0, skip=('bottom',), faces={'top': M['floor_uf']}))
uf.append(box('uf_ceiling', (-0.15, -0.3, CZ1), (8.55, 8.15, CZ1 + 0.15), M['ceiling'], U, skip=('top',)))
# cornice line under the ceiling (white) on the red walls
# Primavera wall (left), black pillar
uf.append(box('uf_wall_l', (-0.15, 0.8, Z1), (0, 8.1, CZ1), M['red'], U, skip=('left',)))
uf.append(wall_quad('uf_primavera', ('x', 0.0, 1), 6.16, 3.0, Z1 + 0.92, Z1 + 3.10, M['primavera'], U, offset=0.006))
uf.append(box('uf_pillar', (-0.15, 8.1, Z1), (0.8, 8.41, CZ1), M['black'], U))
# facade with two deep window bays
uf.append(box('uf_facade_l', (-0.15, -0.3, Z1), (0.55, 0.8, CZ1), M['white'], U))
uf.append(box('uf_facade_m', (3.15, -0.3, Z1), (4.75, 0.8, CZ1), M['white'], U))
uf.append(box('uf_facade_r', (7.85, -0.3, Z1), (8.55, 0.8, CZ1), M['white'], U))
for nm, a, b in (('A', 0.55, 3.15), ('B', 4.75, 7.85)):
    uf.append(box(f'uf_bay{nm}_soffit', (a, -0.3, Z1 + 2.53), (b, 0.8, CZ1), M['white'], U))
    uf.append(box(f'uf_bay{nm}_wall_l', (a, -0.3, Z1), (a + 0.1, 0.0, Z1 + 2.53), M['white'], U))
    uf.append(box(f'uf_bay{nm}_wall_r', (b - 0.1, -0.3, Z1), (b, 0.0, Z1 + 2.53), M['white'], U))
wa, ga = french_window('uf_winA', U, 0.65, 3.05, 0.0, Z1, Z1 + 2.53, 3)
wb, gb = french_window('uf_winB', U, 4.85, 7.75, 0.0, Z1, Z1 + 2.53, 3)
uf += [wa, wb]
for nm, a, b, m in (('A', 0.55, 3.15, M['street_b']), ('B', 4.75, 7.85, M['street_b'])):
    r = wall_quad(f'uf_balcony{nm}', ('y', -0.55, 1), b + 0.2, a - 0.2, Z1, Z1 + 1.05, M['iron_rail'], U, tile=(1.1, 1.05))
    r['kind'] = 'leaf'
    uf.append(r)
    e = wall_quad(f'EMIT_uf_street{nm}', ('y', -2.6, 1), b + 2.0, a - 2.0, Z1 - 1.8, Z1 + 3.6, m, 'emit')
# partition between the two rooms
uf.append(box('uf_partition', (3.0, 2.4, Z1), (3.2, VOID_Y0, CZ1), M['white'], U))
uf.append(picture('uf_pictures', U, ('x', 3.0, -1), 4.35, 3.15, Z1 + 1.35, Z1 + 2.15, M['pictures'], frame=0.02))
uf.append(box('uf_ac', (2.75, 3.1, Z1 + 2.62), (3.0, 4.15, Z1 + 2.95), M['ac'], U))
# room B walls
uf.append(box('uf_wall_r', (8.4, 0.8, Z1), (8.55, 8.15, CZ1), M['red'], U, skip=('right',)))
uf.append(box('uf_back_white', (3.2, 8.0, Z1), (4.45, 8.15, CZ1), M['white'], U, skip=('back',)))
uf.append(box('uf_back_black_l', (4.45, 8.0, Z1), (4.9, 8.15, CZ1), M['black'], U))
uf.append(box('uf_back_black_r', (7.7, 8.0, Z1), (8.4, 8.15, CZ1), M['black'], U))
uf.append(box('uf_niche_back', (4.9, 8.35, Z1), (7.7, 8.5, CZ1), M['grey_niche'], U, skip=('back',)))
uf.append(box('uf_niche_l', (4.9, 8.0, Z1), (4.95, 8.35, CZ1), M['black'], U))
uf.append(box('uf_niche_r', (7.65, 8.0, Z1), (7.7, 8.35, CZ1), M['black'], U))
uf.append(box('uf_niche_head', (4.9, 8.0, Z1 + 2.55), (7.7, 8.35, CZ1), M['black'], U))
uf.append(box('uf_niche_floor', (4.9, 8.0, CZ0), (7.7, 8.35, Z1), M['floor_uf'], U, tile=2.0, skip=('bottom',)))
uf.append(box('uf_door_priv', (3.45, 7.985, Z1), (4.25, 8.0, Z1 + 2.1), M['door_white'], U, skip=('back',)))
uf.append(cylinder('uf_door_priv_h', (4.12, 7.97, Z1 + 1.0), (4.2, 7.97, Z1 + 1.0), 0.01, M['steel'], U, 6))
# skirting and cornice
for nm, a, b in (('uf_sk_l', (0.0, 0.8, Z1), (0.012, 8.1, Z1 + 0.07)), ('uf_sk_r', (8.388, 0.8, Z1), (8.4, 8.0, Z1 + 0.07)),
                 ('uf_corn_l', (0.0, 0.8, CZ1 - 0.05), (0.03, 8.1, CZ1)), ('uf_corn_r', (8.37, 0.8, CZ1 - 0.05), (8.4, 8.0, CZ1))):
    uf.append(box(nm, a, b, M['skirting'], U))
# fire extinguishers and signs
for nm, x, y in (('A', 0.7, 0.22), ('B', 7.7, 0.95)):
    uf.append(cylinder(f'uf_ext{nm}', (x, y, Z1 + 0.05), (x, y, Z1 + 0.62), 0.075, M['fire'], U, 14))
    uf.append(cylinder(f'uf_ext{nm}_top', (x, y, Z1 + 0.62), (x, y, Z1 + 0.72), 0.03, M['iron'], U, 10))
uf.append(box('uf_signA', (0.552, 0.3, Z1 + 2.05), (0.56, 0.55, Z1 + 2.3), M['sign_red'], U))

# ---- room A furniture: three long tables against the Primavera wall
for k, y in enumerate((2.0, 3.6, 5.2)):
    uf.append(table(f'uf_long{k}', U, 1.06, y, 2.0, 0.8, 0.0, M['table_long'], 2))
    transform(uf[-1], (0, 0, Z1))
    for j, x in enumerate((0.45, 1.06, 1.67)):
        c1 = chair(f'uf_lc{k}_{j}a', U, (x, y - 0.6, Z1), 0)
        c2 = chair(f'uf_lc{k}_{j}b', U, (x, y + 0.6, Z1), 180)
        uf += [c1, c2]
    uf.append(menu_stand(f'uf_menu{k}', U, 0.2, y, math.pi / 2))
    transform(uf[-1], (0, 0, Z1))
uf.append(table('uf_sq_a', U, 2.55, 1.35, 0.7, 0.7, 0.0, M['table_small'], 1))
transform(uf[-1], (0, 0, Z1))
uf.append(chair('uf_sq_a1', U, (2.55, 0.9, Z1), 0))
uf.append(chair('uf_sq_a2', U, (2.55, 1.82, Z1), 180))
uf.append(acapulco('uf_acapA', U, (1.2, 0.45, Z1), 160, 'red'))
uf.append(table('uf_sideA', U, 2.65, 0.35, 0.42, 0.42, 0.0, M['frame_black'], 1, z=0.5))
transform(uf[-1], (0, 0, Z1))
uf.append(cylinder('uf_sideA_deco', (2.65, 0.35, Z1 + 0.5), (2.65, 0.35, Z1 + 0.66), 0.08, M['pillow_red'], U, 12, r1=0.03))
tA, lA = track('uf_trackA', U, (1.5, 1.2), (1.5, 7.6), CZ1, [(0.1, (0.6, 1.0, Z1)), (0.32, (0, 3.6, Z1 + 2.0)), (0.52, (0, 4.6, Z1 + 2.0)), (0.72, (0, 5.6, Z1 + 1.9)), (0.95, (1.0, 7.4, Z1))], energy=200, spot=55)
uf.append(tA)

# ---- room B: banquette along the right wall, crates niche, tables, plants
bq = []
segs = [(1.05, 2.4), (2.42, 3.77), (3.79, 5.14), (5.16, 6.51), (6.53, 7.88)]
bq.append(box('uf_bq_base', (7.88, 1.05, Z1), (8.4, 7.88, Z1 + 0.30), M['leather'], U))
for k, (a, b) in enumerate(segs):
    bq.append(box(f'uf_bq_seat{k}', (7.86, a, Z1 + 0.30), (8.4, b, Z1 + 0.46), M['leather'], U))
    bq.append(box(f'uf_bq_back{k}', (8.22, a, Z1 + 0.46), (8.4, b, Z1 + 0.98), M['leather'], U))
    bq.append(box(f'uf_bq_pipe{k}', (7.855, a, Z1 + 0.452), (7.866, b, Z1 + 0.463), M['piping'], U))
    bq.append(box(f'uf_bq_pipeb{k}', (8.214, a, Z1 + 0.97), (8.225, b, Z1 + 0.981), M['piping'], U))
    bq.append(box(f'uf_bq_pipev{k}', (7.86, b - 0.005, Z1 + 0.30), (8.4, b + 0.005, Z1 + 0.462), M['piping'], U))
bq.append(box('uf_bq_ledge', (8.22, 1.05, Z1 + 0.98), (8.4, 7.88, Z1 + 1.0), M['leather'], U))
uf.append(join(bq, 'uf_banquette'))
for k, (y, n) in enumerate(((6.7, 'coppia'), (4.75, 'drink1'), (3.55, 'drink2'), (2.2, 'drink1'))):
    p = picture(f'uf_bqposter{k}', U, ('x', 8.36, -1), y + 0.18, y - 0.18, Z1 + 1.02, Z1 + 1.5, M[f'poster_{n}'], frame=0.015)
    transform(p, (0, 0, 0), 0.0)
    uf.append(p)
for k, y in enumerate((1.9, 3.2, 4.5, 5.8, 7.1)):
    uf.append(table(f'uf_bt{k}', U, 7.45, y, 0.7, 0.7, 0.0, M['table_small'], 1))
    transform(uf[-1], (0, 0, Z1))
    uf.append(chair(f'uf_bc{k}', U, (6.88, y, Z1), 270))
    uf.append(menu_stand(f'uf_bmenu{k}', U, 7.6, y + 0.15, 1.2))
    transform(uf[-1], (0, 0, Z1))
for k, y in enumerate((3.7, 5.3)):
    uf.append(table(f'uf_lt{k}', U, 3.75, y, 0.7, 0.7, 0.0, M['table_small'], 1))
    transform(uf[-1], (0, 0, Z1))
    uf.append(chair(f'uf_ltc{k}a', U, (3.75, y - 0.5, Z1), 0))
    uf.append(chair(f'uf_ltc{k}b', U, (3.75, y + 0.5, Z1), 180))
    uf.append(chair(f'uf_ltc{k}c', U, (4.25, y, Z1), 90))
uf.append(plant('uf_monstera', U, (5.45, 2.7, Z1), 'monstera', 1.1, 0.2, 0.35, stand=0.25))
# console + crate wall in the niche
uf.append(box('uf_console', (5.0, 7.55, Z1 + 0.82), (7.55, 8.0, Z1 + 0.86), M['frame_black'], U))
for x in (5.05, 7.45):
    for y in (7.6, 7.95):
        uf.append(box(f'uf_console_leg{x}{y}', (x - 0.025, y - 0.025, Z1), (x + 0.025, y + 0.025, Z1 + 0.82), M['frame_black'], U))
cr = []
rnd = random.Random(11)
for k in range(6):
    cr.append(crate(f'uf_crate_low{k}', U, 5.3 + k * 0.4, 7.85, Z1, 0.38, 0.27, 0.28, rnd.uniform(-0.04, 0.04), M['crate_a' if k % 2 else 'crate_b']))
    cr.append(crate(f'uf_crate_low2_{k}', U, 5.3 + k * 0.4, 7.85, Z1 + 0.28, 0.38, 0.27, 0.28, rnd.uniform(-0.05, 0.05), M['crate_b' if k % 2 else 'crate_a']))
rows = 7
for r in range(rows):
    z = Z1 + 0.88 + r * 0.31
    n = [5, 6, 6, 6, 5, 5, 3][r]
    width = n * 0.42
    x0 = 6.3 - width / 2 + (0.1 if r % 2 else -0.05)
    for k in range(n):
        if rnd.random() < 0.12 and r not in (0, 6):
            # gap with a bottle, like the open spots in the real wall
            cr.append(cylinder(f'uf_bottle{r}_{k}', (x0 + k * 0.42 + 0.2, 8.2, z), (x0 + k * 0.42 + 0.2, 8.2, z + 0.26), 0.035, M['bottle'], U, 10))
            continue
        cr.append(crate(f'uf_crate{r}_{k}', U, x0 + k * 0.42 + 0.2 + rnd.uniform(-0.02, 0.02), 8.18 + rnd.uniform(-0.02, 0.02), z,
                        0.38, 0.28, 0.3, rnd.uniform(-0.05, 0.05), M['crate_a' if (r + k) % 3 else 'crate_b']))
uf.append(join(cr, 'uf_crates'))
# autumn decoration on the console
uf.append(cylinder('uf_pumpkin', (6.55, 7.75, Z1 + 0.86), (6.55, 7.75, Z1 + 0.98), 0.08, M['orange'], U, 12, r1=0.05))
uf.append(plant('uf_autumn', U, (6.25, 7.78, Z1 + 0.86), 'zz', 0.6, 0.07, 0.2))
for o in uf[-1:]:
    for s in o.material_slots:
        if s.material == M['leaf2']:
            s.material = mat('leaf_autumn', '#c0561c', 0.6, tex='leaf_oval.png', alpha=True, tex_color_mul='#f08a3a')
# bay B: two acapulco chairs with black pillows, plant on stand, side table
uf.append(acapulco('uf_acapB1', U, (5.55, 0.48, Z1), 170, 'black'))
uf.append(acapulco('uf_acapB2', U, (6.55, 0.42, Z1), 190, 'black'))
uf.append(plant('uf_zz', U, (7.45, 0.35, Z1), 'zz', 0.75, 0.15, 0.25, stand=0.45))
uf.append(table('uf_sideB', U, 7.1, 0.85, 0.4, 0.4, 0.0, M['frame_black'], 1, z=0.5))
transform(uf[-1], (0, 0, Z1))
tB, lB = track('uf_trackB', U, (6.1, 1.2), (6.1, 7.6), CZ1, [(0.08, (6.1, 0.6, Z1)), (0.3, (8.4, 2.4, Z1 + 1.0)), (0.5, (8.4, 4.4, Z1 + 1.0)), (0.7, (8.4, 6.2, Z1 + 1.0)), (0.97, (6.3, 8.3, Z1 + 1.6))], energy=200, spot=55)
uf.append(tB)
tB2, lB2 = track('uf_trackB2', U, (4.3, 2.8), (4.3, 6.4), CZ1, [(0.2, (3.8, 3.7, Z1)), (0.8, (3.8, 5.3, Z1))], energy=150, spot=55)
uf.append(tB2)
# daylight through the two bays (overcast, slightly cool)
for nm, xc in (('A', 1.85), ('B', 6.3)):
    light(f'uf_fill{nm}', 'AREA', (xc, 4.4, CZ1 - 0.02), 160, kelvin(3600), rot=(0, 0, 0), size=2.0, size_y=6.0)
    light(f'uf_day{nm}', 'AREA', (xc, 0.05, Z1 + 1.3), 1300, (0.86, 0.93, 1.0), target=(xc, 4.0, Z1 + 0.6), size=2.5, size_y=2.4)

# ------------------------------------------------------------------ tag collections for the bake
for o in bpy.data.objects:
    if o.type != 'MESH':
        continue
    if o.name.startswith('GLASS_'):
        o['kind'] = 'glass'
    elif o.name.startswith('EMIT_'):
        o['kind'] = 'emit'

# ------------------------------------------------------------------ world, render defaults
world = bpy.data.worlds.new('World')
scene.world = world
world.use_nodes = True
bg = world.node_tree.nodes['Background']
bg.inputs['Color'].default_value = (0.55, 0.6, 0.66, 1)
bg.inputs['Strength'].default_value = 0.6
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64
scene.cycles.use_denoising = True
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'None'
scene.render.resolution_x = 960
scene.render.resolution_y = 540
cam = bpy.data.objects.new('Camera', bpy.data.cameras.new('Camera'))
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 18
bpy.ops.wm.save_as_mainfile(filepath=OUT, relative_remap=True)
bpy.ops.file.make_paths_relative()
bpy.ops.wm.save_mainfile()
n_tris = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
print('SAVED', OUT, 'objects', len(bpy.data.objects), 'polys', n_tris)
