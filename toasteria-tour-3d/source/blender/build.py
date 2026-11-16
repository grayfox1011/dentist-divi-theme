"""Build the Toasteria interior in Blender from the measurements taken off the video.

Coordinates in metres: x to the right when you walk in from the street, y from the
street front (y=0) towards the back, z up. Ground floor at z=0, first floor at z=3.42.
Run:  blender -b -P build.py -- out.blend
"""
import bpy, bmesh, math, random, sys, os
from mathutils import Vector, Matrix, Euler
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import importlib, lib
importlib.reload(lib)
from lib import *

OUT = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else os.path.join(HERE, 'toasteria.blend')

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
SPLIT_X = 3.1                        # line between the two first-floor rooms
FLOOR_TILE = 1.92                    # metres covered by one repeat of the parquet texture
G, S, UA, UB = 'gf', 'st', 'ufa', 'ufb'   # groups that get their own lightmap

# ------------------------------------------------------------------ materials
M = dict(
    red=mat('wall_red', '#8a1019', 0.82, spec=0.35),
    black=mat('wall_black', '#1b1919', 0.85, spec=0.35),
    white=mat('wall_white', '#ece8e0', 0.9, spec=0.3),
    ceiling=mat('ceiling_white', '#f1eee8', 0.95, spec=0.2, lmw=0.6),
    grey_niche=mat('niche_grey', '#d6d3ce', 0.9, spec=0.2),
    floor=mat('floor_parquet', '#c9a273', 0.36, tex='floor_parquet.jpg', normal='floor_parquet_n.png', normal_strength=0.6,
              rough_tex='floor_parquet_r.jpg', lmw=1.7),
    carpet=mat('stair_tread', '#555250', 0.95, tex='carpet.jpg', normal='carpet_n.png', normal_strength=0.5, spec=0.2, lmw=1.3),
    strip=mat('stair_strip', '#2a2928', 0.8),
    riser=mat('stair_riser', '#efede8', 0.6),
    skirting=mat('skirting', '#f2f0ec', 0.5, lmw=0.5),
    venus=mat('mural_venus', '#ffffff', 0.62, tex='mural_venus.jpg', spec=0.35, lmw=1.3),
    primavera=mat('mural_primavera', '#ffffff', 0.62, tex='mural_primavera.jpg', spec=0.35, lmw=1.3),
    rail_white=mat('railing_white', '#f0efeb', 0.35, lmw=0.5),
    steel=mat('steel', '#c4c4c2', 0.22, metal=1.0, lmw=0.5),
    cable=mat('steel_cable', '#9c9c9a', 0.3, metal=1.0, lmw=0.15),
    galv=mat('galvanised', '#aeb2b4', 0.42, metal=1.0, lmw=0.5),
    chair=mat('chair_white', '#f1efe8', 0.35, lmw=0.7),
    cushion=mat('cushion_red', '#8a1622', 0.5, spec=0.5, lmw=0.8),
    iron=mat('cast_iron', '#141313', 0.5, lmw=0.7),
    table_long=mat('table_long', '#c98f4c', 0.24, tex='table_long.jpg', normal='table_long_n.png', normal_strength=0.5, lmw=1.5),
    table_small=mat('table_small', '#c98f4c', 0.24, tex='table_small.jpg', normal='table_small_n.png', normal_strength=0.5, lmw=1.5),
    table_mid=mat('table_mid', '#c98f4c', 0.24, tex='table_mid.jpg', normal='table_mid_n.png', normal_strength=0.5, lmw=1.5),
    table_edge=mat('table_edge', '#181515', 0.4),
    frame_brown=mat('window_frame', '#4b2e20', 0.45),
    frame_black=mat('frame_black', '#131313', 0.4),
    alu=mat('aluminium', '#b6b6b4', 0.3, metal=1.0),
    door_white=mat('door_white', '#efede7', 0.4),
    leather=mat('banquette_red', '#86121c', 0.42, spec=0.55, normal='leather_n.png', normal_strength=0.35),
    piping=mat('piping_white', '#f0eee8', 0.5, lmw=0.25),
    acap=mat('acapulco_black', '#131313', 0.4, lmw=0.3),
    cord=mat('acapulco_cord', '#161616', 0.5, lmw=0.25),
    pillow_red=mat('pillow_red', '#8c1226', 0.9, spec=0.2),
    pillow_black=mat('pillow_black', '#1b1b1d', 0.9, spec=0.2),
    pot=mat('pot_black', '#181818', 0.45),
    soil=mat('soil', '#2b2119', 1.0, lmw=0.4),
    stem=mat('stem_green', '#4a7a3c', 0.6, lmw=0.15),
    twig=mat('twig_brown', '#4a3524', 0.8, lmw=0.12),
    leaf=mat('leaf_monstera', '#2e6a2f', 0.42, tex='leaf_monstera.png', alpha=True, lmw=0.6),
    leaf_oval=mat('leaf_oval', '#2a6030', 0.38, tex='leaf_oval.png', alpha=True, lmw=0.5),
    leaf_long=mat('leaf_long', '#2c6634', 0.45, tex='leaf_long.png', alpha=True, lmw=0.5),
    leaf_bract=mat('leaf_bract', '#d04a6e', 0.6, tex='leaf_bract.png', alpha=True, lmw=0.5),
    leaf_dry=mat('leaf_dry', '#96303e', 0.8, tex='leaf_dry.png', alpha=True, lmw=0.4),
    leaf_aut=mat('leaf_autumn', '#de7024', 0.7, tex='leaf_autumn.png', alpha=True, lmw=0.5),
    leaf_aut2=mat('leaf_autumn2', '#c44a1c', 0.7, tex='leaf_autumn2.png', alpha=True, lmw=0.5),
    crate_a=mat('crate_front_a', '#b5895c', 0.85, tex='crate_a.jpg'),
    crate_b=mat('crate_front_b', '#b5895c', 0.85, tex='crate_b.jpg'),
    crate_s=mat('crate_side', '#a67c52', 0.9, tex='crate_side.jpg'),
    wood_light=mat('wood_light', '#c8a676', 0.6),
    fire=mat('extinguisher_red', '#b0141a', 0.3),
    sign_red=mat('sign_red', '#c0262b', 0.5),
    ac=mat('ac_white', '#ecece8', 0.35),
    vent=mat('vent_grey', '#bdbab3', 0.5),
    dark=mat('slot_dark', '#0d0d0d', 0.6, lmw=0.3),
    track_w=mat('track_white', '#ecebe7', 0.4, lmw=0.4),
    track_b=mat('track_black', '#141414', 0.4, lmw=0.4),
    lens=mat('EMIT_lens', '#ffedc8', 0.3, emit=30.0, lmw=0.05),
    paper=mat('menu_white', '#f3f0e9', 0.6),
    menu_cover=mat('menu_cover', '#ffffff', 0.5, tex='menu_cover.jpg', lmw=0.7),
    menu_sheet=mat('menu_sheet', '#ffffff', 0.4, tex='menu_sheet.jpg', lmw=0.5),
    menu_board=mat('menu_board', '#ffffff', 0.45, tex='menu_board.jpg'),
    no_smoking=mat('no_smoking', '#ffffff', 0.4, tex='no_smoking.jpg', lmw=0.6),
    beer=mat('beer_crate_blue', '#1d3b78', 0.5),
    cardboard=mat('cardboard', '#a97f53', 0.9),
    orange=mat('pumpkin_orange', '#d86f1d', 0.5),
    lid=mat('jar_lid', '#c9a13a', 0.35, metal=1.0, lmw=0.3),
    label=mat('bottle_label', '#ece6d6', 0.6, lmw=0.3),
    doormat=mat('doormat', '#4c4946', 0.98),
    glass=glass_mat('GLASS_window', '#ffffff', thin=True, ior=1.5),
    glass_clear=glass_mat('GLASS_clear', '#eef4f2', ior=1.5),
    glass_green=glass_mat('GLASS_green', '#7e9c5e', ior=1.5),
    glass_dark=glass_mat('GLASS_dark', '#4a3524', ior=1.5),
    street_a=mat('EMIT_street_a', '#ffffff', 1.0, tex='street_a.jpg', emit=1.1, lmw=0.05),
    cobbles=mat('EMIT_cobbles', '#ffffff', 1.0, tex='cobbles.jpg', emit=0.75, lmw=0.05),
    street_b=mat('EMIT_street_b', '#ffffff', 1.0, tex='street_b.jpg', emit=1.25, lmw=0.05),
    rail_out=mat('EMIT_rail', '#8f8a84', 0.6, emit=0.55, lmw=0.05),
    logo=mat('logo_sign', '#ffffff', 0.6, tex='logo_sign.jpg'),
    pictures=mat('pictures_grid', '#ffffff', 0.5, tex='pictures_grid.jpg'),
)
for i in range(1, 9):
    M[f'poster_{i}'] = mat(f'poster_{i}', '#ffffff', 0.35, tex=f'poster_{i}.jpg')
for n in ('coppia', 'drink1', 'drink2'):
    M[f'poster_{n}'] = mat(f'poster_{n}', '#ffffff', 0.35, tex=f'poster_{n}.jpg')

RND = random.Random(4)


# ------------------------------------------------------------------ furniture builders
def chair(name, coll, loc, face_deg):
    """White folding bistro chair with a red cushion. face_deg: where the sitter looks
    (0 = +y, 90 = -x, 180 = -y, 270 = +x). Built facing -y, backrest at +y."""
    W = M['chair']
    p = []
    for s in (-1, 1):
        p.append(tube(f'{name}_rear{s}', [(s * 0.197, 0.305, 0.0), (s * 0.192, 0.238, 0.44), (s * 0.187, 0.215, 0.87)], 0.0095, W, coll, 6))
        p.append(tube(f'{name}_front{s}', [(s * 0.207, -0.24, 0.0), (s * 0.197, 0.135, 0.445)], 0.0095, W, coll, 6))
        p.append(box(f'{name}_rail{s}', (s * 0.197 - 0.008, -0.2, 0.428), (s * 0.197 + 0.008, 0.2, 0.444), W, coll))
    for k, z in enumerate((0.69, 0.795)):          # two curved back slats
        rings = []
        y_at = 0.224 - (z - 0.69) * 0.06
        for j in range(5):
            x = -0.187 + j * 0.0935
            bow = 0.016 * (1 - (x / 0.187) ** 2)
            rings.append([(x, y_at + bow, z), (x, y_at + bow + 0.013, z), (x, y_at + bow + 0.013, z + 0.062), (x, y_at + bow, z + 0.062)])
        p.append(loft(f'{name}_back{k}', rings, W, coll))
    p.append(box(f'{name}_plate', (-0.195, -0.195, 0.444), (0.195, 0.185, 0.456), W, coll))
    p.append(tube(f'{name}_bar', [(-0.197, 0.275, 0.17), (0.197, 0.275, 0.17)], 0.007, W, coll, 6))
    p.append(box(f'{name}_cushion', (-0.19, -0.19, 0.456), (0.19, 0.178, 0.498), M['cushion'], coll, bevel=0.014, bevel_seg=2, soft=True))
    o = join(p, name)
    transform(o, loc, math.radians(face_deg) + math.pi)
    return o


def pedestal(name, coll, x, y, h, reach_x, reach_y):
    """Cast-iron bistro base: turned column on four curved feet."""
    prof = [(0.058, 0.165), (0.062, 0.2), (0.042, 0.235), (0.03, 0.3), (0.027, h * 0.55), (0.033, h * 0.58), (0.027, h * 0.61),
            (0.027, h - 0.13), (0.04, h - 0.1), (0.03, h - 0.07), (0.052, h - 0.03), (0.052, h)]
    p = [lathe(f'{name}_col', prof, (x, y, 0), M['iron'], coll, seg=12, sharp=50)]
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        R = reach_x if dx else reach_y
        pts = [(x + dx * 0.03, y + dy * 0.03, 0.215), (x + dx * R * 0.38, y + dy * R * 0.38, 0.2),
               (x + dx * R * 0.72, y + dy * R * 0.72, 0.115), (x + dx * R, y + dy * R, 0.032)]
        p.append(tube(f'{name}_foot{dx}{dy}', pts, 0.026, M['iron'], coll, 6, r_end=0.017))
        p.append(cylinder(f'{name}_pad{dx}{dy}', (x + dx * R, y + dy * R, 0), (x + dx * R, y + dy * R, 0.03), 0.024, M['iron'], coll, 8))
    p.append(box(f'{name}_spider', (x - 0.13, y - 0.13, h - 0.006), (x + 0.13, y + 0.13, h), M['iron'], coll))
    return p


def table(name, coll, cx, cy, sx, sy, rot=0.0, top_mat=None, pedestals=1, z=0.75, z0=0.0):
    top_mat = top_mat or M['table_small']
    p = [box(f'{name}_top', (-sx / 2, -sy / 2, z - 0.04), (sx / 2, sy / 2, z), M['table_edge'], coll,
             faces={'top': top_mat}, uv01=('top',), bevel=0.004),
         box(f'{name}_apron', (-sx / 2 + 0.07, -sy / 2 + 0.07, z - 0.075), (sx / 2 - 0.07, sy / 2 - 0.07, z - 0.04), M['iron'], coll)]
    if pedestals == 1:
        r = min(sx, sy) * 0.42
        p += pedestal(f'{name}_p', coll, 0, 0, z - 0.075, r, r)
    else:
        for s in (-1, 1):
            p += pedestal(f'{name}_p{s}', coll, s * sx * 0.29, 0, z - 0.075, 0.2, sy * 0.4)
    o = join(p, name)
    transform(o, (cx, cy, z0), rot)
    return o


def side_table(name, coll, cx, cy, z0, s=0.4, h=0.5):
    """Small black wire-frame side table."""
    p = [box(f'{name}_top', (-s / 2, -s / 2, h - 0.012), (s / 2, s / 2, h), M['frame_black'], coll)]
    for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        p.append(tube(f'{name}_l{sx}{sy}', [(sx * (s / 2 - 0.008), sy * (s / 2 - 0.008), 0), (sx * (s / 2 - 0.008), sy * (s / 2 - 0.008), h - 0.012)], 0.006, M['frame_black'], coll, 4))
    ring = [(-s / 2 + 0.008, -s / 2 + 0.008, 0.008), (s / 2 - 0.008, -s / 2 + 0.008, 0.008), (s / 2 - 0.008, s / 2 - 0.008, 0.008), (-s / 2 + 0.008, s / 2 - 0.008, 0.008)]
    for a, b in zip(ring, ring[1:] + ring[:1]):
        p.append(tube(f'{name}_r', [a, b], 0.006, M['frame_black'], coll, 4))
    o = join(p, name)
    transform(o, (cx, cy, z0))
    return o


def booklet(name, coll, x, y, z, rot):
    o = box(name, (-0.105, -0.148, 0), (0.105, 0.148, 0.007), M['paper'], coll, faces={'top': M['menu_cover']}, uv01=('top',))
    transform(o, (x, y, z), rot)
    return o


def menu_stand(name, coll, x, y, z, rot=0.0):
    p = [box(f'{name}_base', (-0.06, -0.03, 0), (0.06, 0.03, 0.012), M['frame_black'], coll),
         box(f'{name}_sheet', (-0.052, -0.004, 0.012), (0.052, 0.004, 0.165), M['paper'], coll,
             faces={'front': M['menu_sheet'], 'back': M['menu_sheet']}, uv01=('front', 'back'))]
    o = join(p, name)
    transform(o, (x, y, z), rot)
    return o


def bud_vase(name, coll, x, y, z, seed):
    """Small glass bottle with a dried twig, as on the real tables."""
    r = random.Random(seed)
    prof = [(0.0, 0.0), (0.026, 0.0), (0.028, 0.012), (0.028, 0.105), (0.02, 0.13), (0.011, 0.15), (0.011, 0.185), (0.013, 0.19)]
    p = [lathe(f'{name}_b', prof, (x, y, z), M['glass_clear'], coll, seg=10)]
    lean = Vector((r.uniform(-0.08, 0.08), r.uniform(-0.08, 0.08), 1)).normalized()
    top = Vector((x, y, z + 0.02)) + lean * 0.36
    p.append(tube(f'{name}_s', [(x, y, z + 0.02), Vector((x, y, z + 0.02)) + lean * 0.2, top], 0.0014, M['twig'], coll, 4, caps=False))
    for k in range(5):
        t = 0.55 + 0.1 * k
        base = Vector((x, y, z + 0.02)) + lean * (0.36 * t)
        a = r.uniform(0, 2 * math.pi)
        d = Vector((math.cos(a) * 0.5, math.sin(a) * 0.5, 0.85))
        p.append(leaf(f'{name}_l{k}', base, d, (math.cos(a), math.sin(a), 0), r.uniform(0.045, 0.07), 0.022, M['leaf_dry'], coll, nu=1, nv=2, fold=0.2, droop=0.2))
    return join(p, name)


def acapulco(name, coll, loc, face_deg, pillow):
    """Acapulco chair: steel hoop, cords running to a small hub, four thin legs."""
    lean = math.radians(38)
    U = Vector((1, 0, 0))
    V = Vector((0, math.sin(lean), math.cos(lean)))
    N = U.cross(V)                       # points to the front and up
    C = Vector((0, 0.06, 0.66))
    a, b = 0.37, 0.38
    def ring_pt(t):
        return C + U * (a * (1 + 0.10 * math.sin(t)) * math.cos(t)) + V * (b * math.sin(t))
    H = C - N * 0.30 - V * 0.10
    def hub_pt(t):
        return H + U * (0.055 * math.cos(t)) + V * (0.055 * math.sin(t))
    p = [tube(f'{name}_ring', [ring_pt(2 * math.pi * k / 40) for k in range(40)], 0.011, M['acap'], coll, 6, closed=True),
         tube(f'{name}_hub', [hub_pt(2 * math.pi * k / 12) for k in range(12)], 0.008, M['acap'], coll, 5, closed=True)]
    NC = 64
    cords = []
    for k in range(NC):
        t = 2 * math.pi * k / NC
        cords.append(cylinder(f'{name}_c{k}', ring_pt(t), hub_pt(t), 0.0045, M['cord'], coll, 4, caps=False))
    p.append(join(cords, f'{name}_cords'))
    for s in (-1, 1):
        t = math.radians(270 + s * 52)
        p.append(tube(f'{name}_lf{s}', [ring_pt(t), (s * 0.30, -0.30, 0.0)], 0.009, M['acap'], coll, 5))
        p.append(tube(f'{name}_lb{s}', [H + U * (s * 0.05), (s * 0.28, 0.36, 0.0)], 0.009, M['acap'], coll, 5))
        p.append(tube(f'{name}_br{s}', [(s * 0.297, -0.27, 0.06), (s * 0.282, 0.33, 0.06)], 0.006, M['acap'], coll, 4))
    pm = M['pillow_red'] if pillow == 'red' else M['pillow_black']
    pil = box(f'{name}_pillow', (-0.19, -0.055, -0.19), (0.19, 0.055, 0.19), pm, coll, bevel=0.05, bevel_seg=3, soft=True)
    transform(pil, (0, 0, 0), rot=(0, 0.22, 0))
    transform(pil, C - N * 0.085 - V * 0.08, rot=(-lean, 0, 0))
    p.append(pil)
    o = join(p, name)
    transform(o, loc, math.radians(face_deg) + math.pi)
    return o


def pot(name, coll, x, y, z, r, h, stand=0.0):
    p = [lathe(f'{name}_pot', [(0, 0), (r * 0.78, 0), (r * 0.82, 0.01), (r, h - 0.01), (r, h), (r * 0.93, h), (r * 0.9, h - 0.035)], (x, y, z + stand), M['pot'], coll, seg=18, sharp=35),
         lathe(f'{name}_soil', [(r * 0.9, h - 0.035), (0, h - 0.035)], (x, y, z + stand), M['soil'], coll, seg=18)]
    if stand:
        for k in range(4):
            a = math.pi / 4 + k * math.pi / 2
            p.append(tube(f'{name}_sl{k}', [(x + math.cos(a) * r * 0.95, y + math.sin(a) * r * 0.95, z), (x + math.cos(a) * r * 0.8, y + math.sin(a) * r * 0.8, z + stand + 0.01)], 0.007, M['frame_black'], coll, 5))
        p.append(tube(f'{name}_sr', [(x + math.cos(2 * math.pi * k / 16) * r * 0.84, y + math.sin(2 * math.pi * k / 16) * r * 0.84, z + stand - 0.005) for k in range(16)], 0.006, M['frame_black'], coll, 4, closed=True))
    return p


def monstera(name, coll, loc, height=1.3, pot_r=0.2, pot_h=0.38, stand=0.0, n=11, seed=1, spread=1.0, arc=None):
    """Monstera: long arching stalks, each ending in a big split leaf that hangs outwards."""
    x, y, z = loc
    r = random.Random(seed)
    p = pot(name, coll, x, y, z, pot_r, pot_h, stand)
    base0 = Vector((x, y, z + stand + pot_h - 0.04))
    for k in range(n):
        ang = 2 * math.pi * (k + r.uniform(-0.3, 0.3)) / n
        if arc is not None:                         # only grow inside this arc (radians), away from the walls
            lo, hi = arc
            ang = lo + (ang % (2 * math.pi)) / (2 * math.pi) * (hi - lo)
        rad = Vector((math.cos(ang), math.sin(ang), 0))
        hgt = height * r.uniform(0.45, 1.0)
        out = (0.16 + 0.34 * r.random()) * spread * (0.6 + 0.4 * hgt / height)
        b = base0 + rad * (pot_r * 0.35 * r.random())
        tip = b + rad * out + Vector((0, 0, hgt))
        ctrl = b + rad * out * 0.15 + Vector((0, 0, hgt * 1.05))
        pts = bezier(b, ctrl, tip, 6)
        p.append(tube(f'{name}_st{k}', pts, 0.0075, M['stem'], coll, 5, caps=False, r_end=0.004))
        L = r.uniform(0.26, 0.42) * (0.75 + 0.35 * hgt / height)
        d = (rad * 0.85 + Vector((0, 0, -r.uniform(0.25, 0.75)))).normalized()
        p.append(leaf(f'{name}_lf{k}', tip - d * (L * 0.12), d, (0, 0, 1), L, L * 0.95, M['leaf'], coll, nu=4, nv=5, fold=0.1, droop=0.35))
    return join(p, name)


def zz_plant(name, coll, loc, height=0.8, pot_r=0.15, pot_h=0.26, stand=0.0, n=9, seed=2):
    """Zamioculcas: upright arching stems with glossy leaflets in two ranks."""
    x, y, z = loc
    r = random.Random(seed)
    p = pot(name, coll, x, y, z, pot_r, pot_h, stand)
    base0 = Vector((x, y, z + stand + pot_h - 0.04))
    for k in range(n):
        ang = 2 * math.pi * (k + r.uniform(-0.3, 0.3)) / n
        rad = Vector((math.cos(ang), math.sin(ang), 0))
        hgt = height * r.uniform(0.6, 1.0)
        out = r.uniform(0.08, 0.3) * height
        b = base0 + rad * (pot_r * 0.4 * r.random())
        tip = b + rad * out + Vector((0, 0, hgt))
        ctrl = b + rad * out * 0.1 + Vector((0, 0, hgt * 0.7))
        pts = bezier(b, ctrl, tip, 8)
        p.append(tube(f'{name}_st{k}', pts, 0.0065, M['stem'], coll, 5, caps=False, r_end=0.0025))
        side = rad.cross(Vector((0, 0, 1))).normalized()
        m = 9
        for j in range(m):
            t = 0.28 + 0.72 * j / (m - 1)
            i0 = min(len(pts) - 2, int(t * (len(pts) - 1)))
            f = t * (len(pts) - 1) - i0
            q = pts[i0].lerp(pts[i0 + 1], f)
            tan = (pts[i0 + 1] - pts[i0]).normalized()
            sgn = 1 if j % 2 else -1
            d = (side * sgn * 0.8 + tan * 0.55 + rad * 0.15).normalized()
            L = 0.085 * (1.05 - 0.45 * abs(t - 0.6)) * (height / 0.8) ** 0.5
            p.append(leaf(f'{name}_l{k}_{j}', q, d, rad * 0.6 + Vector((0, 0, 0.8)), L, L * 0.5, M['leaf_oval'], coll, nu=1, nv=2, fold=0.25, droop=0.15))
    return join(p, name)


def strap_plant(name, coll, loc, height=0.9, pot_r=0.2, pot_h=0.34, n=18, seed=3):
    """Entrance plant: long arching green leaves with a cluster of pink bracts on top."""
    x, y, z = loc
    r = random.Random(seed)
    p = pot(name, coll, x, y, z, pot_r, pot_h)
    base0 = Vector((x, y, z + pot_h - 0.04))
    for k in range(n):
        ang = 2 * math.pi * (k + r.uniform(-0.4, 0.4)) / n
        rad = Vector((math.cos(ang), math.sin(ang), 0))
        up = r.uniform(0.55, 1.5)
        d = (rad + Vector((0, 0, up))).normalized()
        L = height * r.uniform(0.55, 0.95)
        p.append(leaf(f'{name}_l{k}', base0 + rad * 0.03, d, (0, 0, 1) if up < 1.4 else rad, L, 0.075, M['leaf_long'], coll, nu=1, nv=6, fold=0.25, droop=0.55 * (1.2 - up / 2)))
    top = base0 + Vector((0, 0, height * 0.62))
    p.append(tube(f'{name}_stalk', [base0, top], 0.006, M['stem'], coll, 5, caps=False))
    for k in range(9):
        ang = 2 * math.pi * k / 9 + r.uniform(-0.2, 0.2)
        d = Vector((math.cos(ang), math.sin(ang), r.uniform(0.15, 0.7))).normalized()
        p.append(leaf(f'{name}_b{k}', top, d, (0, 0, 1), r.uniform(0.13, 0.19), 0.07, M['leaf_bract'], coll, nu=1, nv=3, fold=0.2, droop=0.25))
    return join(p, name)


def autumn_bouquet(name, coll, x, y, z, seed=5):
    """Glass vase with branches of orange maple leaves (the autumn decoration on the console)."""
    r = random.Random(seed)
    prof = [(0, 0), (0.05, 0), (0.075, 0.03), (0.085, 0.11), (0.07, 0.19), (0.05, 0.235), (0.058, 0.25)]
    p = [lathe(f'{name}_vase', prof, (x, y, z), M['glass_clear'], coll, seg=14)]
    base = Vector((x, y, z + 0.03))
    for k in range(8):
        ang = 2 * math.pi * k / 8 + r.uniform(-0.3, 0.3)
        rad = Vector((math.cos(ang), math.sin(ang), 0))
        tip = base + rad * r.uniform(0.18, 0.38) + Vector((0, 0, r.uniform(0.42, 0.68)))
        pts = bezier(base, base + Vector((0, 0, 0.3)) + rad * 0.03, tip, 5)
        p.append(tube(f'{name}_br{k}', pts, 0.0032, M['twig'], coll, 4, caps=False, r_end=0.0015))
        for j in range(6):
            t = 0.45 + 0.55 * j / 5
            q = pts[min(len(pts) - 1, int(t * (len(pts) - 1)))]
            a2 = r.uniform(0, 2 * math.pi)
            d = Vector((math.cos(a2), math.sin(a2), r.uniform(-0.5, 0.5))).normalized()
            m = M['leaf_aut'] if r.random() < 0.6 else M['leaf_aut2']
            s = r.uniform(0.075, 0.115)
            p.append(leaf(f'{name}_l{k}_{j}', q, d, (r.uniform(-1, 1), r.uniform(-1, 1), 1), s, s, m, coll, nu=1, nv=2, fold=0.15, droop=0.25))
    return join(p, name)


def bottle(name, coll, x, y, z, kind='dark', h=0.3, r=0.037):
    m = {'dark': M['glass_dark'], 'green': M['glass_green'], 'clear': M['glass_clear']}[kind]
    prof = [(0, 0), (r * 0.92, 0), (r, 0.01), (r, h * 0.58), (r * 0.5, h * 0.75), (r * 0.36, h * 0.8), (r * 0.36, h * 0.97), (r * 0.42, h)]
    p = [lathe(f'{name}_g', prof, (x, y, z), m, coll, seg=10),
         lathe(f'{name}_lab', [(r * 1.02, h * 0.18), (r * 1.02, h * 0.46)], (x, y, z), M['label'], coll, seg=10)]
    return join(p, name)


def jar(name, coll, x, y, z, r=0.04, h=0.09):
    p = [lathe(f'{name}_g', [(0, 0), (r * 0.9, 0), (r, 0.008), (r, h * 0.82), (r * 0.86, h * 0.9)], (x, y, z), M['glass_clear'], coll, seg=10),
         lathe(f'{name}_fill', [(0, 0.004), (r * 0.9, 0.006), (r * 0.9, h * 0.7), (0, h * 0.7)], (x, y, z), M['orange'], coll, seg=10),
         lathe(f'{name}_lid', [(r * 0.9, h * 0.88), (r * 0.92, h), (0, h)], (x, y, z), M['lid'], coll, seg=10, sharp=30)]
    return join(p, name)


def crate(name, coll, x, y, z, w=0.38, h=0.27, d=0.3, rot=0.0, front=None):
    """Kraft cardboard box with the printed seal on the front."""
    o = box(name, (-w / 2, -d / 2, 0), (w / 2, d / 2, h), M['crate_s'], coll, tile=0.5,
            faces={'front': front or M['crate_a']}, uv01=('front',), bevel=0.004, bevel_seg=1)
    transform(o, (x, y, z), rot)
    return o


def picture(name, coll, plane, a0, a1, z0, z1, material, frame=0.025, depth=0.022, uv=None, frame_mat=None):
    """Framed print: a0 is the edge that gets the left side of the image."""
    axis, val, facing = plane
    fm = frame_mat or M['frame_black']
    lo, hi = min(a0, a1), max(a0, a1)
    parts = []
    def bar(u0, u1, w0, w1):
        if axis == 'x':
            xa, xb = sorted((val, val + depth * facing))
            return box(f'{name}_fr', (xa, u0, w0), (xb, u1, w1), fm, coll)
        ya, yb = sorted((val, val + depth * facing))
        return box(f'{name}_fr', (u0, ya, w0), (u1, yb, w1), fm, coll)
    parts.append(bar(lo - frame, hi + frame, z0 - frame, z0))
    parts.append(bar(lo - frame, hi + frame, z1, z1 + frame))
    parts.append(bar(lo - frame, lo, z0, z1))
    parts.append(bar(hi, hi + frame, z0, z1))
    parts.append(wall_quad(f'{name}_pr', plane, a0, a1, z0, z1, material, coll, offset=depth * 0.45, uv=uv))
    return join(parts, name)


def track(name, coll, p0, p1, z, heads, energy=130, temp=3000, spot=50, white=False, blend=0.7):
    """Ceiling track with spot heads. heads: list of (t along track, target xyz[, energy])."""
    tm = M['track_w'] if white else M['track_b']
    a = Vector((*p0, z)); b = Vector((*p1, z))
    axis = (b - a).normalized()
    side = axis.cross(Vector((0, 0, 1)))
    parts = [box(f'{name}_tr', (min(a.x, b.x) - 0.017, min(a.y, b.y) - 0.017, z - 0.034), (max(a.x, b.x) + 0.017, max(a.y, b.y) + 0.017, z), tm, coll)]
    for k, hd in enumerate(heads):
        t, tgt = hd[0], hd[1]
        en = hd[2] if len(hd) > 2 else energy
        hp = a.lerp(b, t) - Vector((0, 0, 0.11))
        d = (Vector(tgt) - hp).normalized()
        parts.append(box(f'{name}_ad{k}', (hp.x - 0.022, hp.y - 0.022, z - 0.06), (hp.x + 0.022, hp.y + 0.022, z - 0.034), tm, coll))
        parts.append(tube(f'{name}_arm{k}', [(hp.x, hp.y, z - 0.06), hp], 0.007, tm, coll, 5))
        parts.append(cylinder(f'{name}_h{k}', hp - d * 0.045, hp + d * 0.085, 0.03, tm, coll, 14))
        parts.append(cylinder(f'{name}_l{k}', hp + d * 0.085, hp + d * 0.088, 0.024, M['lens'], coll, 14))
        light(f'{name}_spot{k}', 'SPOT', hp + d * 0.1, en, kelvin(temp), tgt, size=0.025, spot=spot, blend=blend)
    return join(parts, name)


def french_window(name, coll, x0, x1, y, z0, z1, panels=3):
    fw, fd = 0.075, 0.085
    fb = M['frame_brown']
    p = [box(f'{name}_l', (x0, y - fd, z0), (x0 + fw, y, z1), fb, coll),
         box(f'{name}_r', (x1 - fw, y - fd, z0), (x1, y, z1), fb, coll),
         box(f'{name}_t', (x0, y - fd, z1 - fw), (x1, y, z1), fb, coll),
         box(f'{name}_b', (x0, y - fd, z0), (x1, y, z0 + 0.09), fb, coll)]
    pw = (x1 - x0 - 2 * fw) / panels
    for k in range(1, panels):
        xm = x0 + fw + k * pw
        p.append(box(f'{name}_m{k}', (xm - 0.055, y - fd, z0), (xm + 0.055, y, z1), fb, coll))
    for k in range(panels):
        xa = x0 + fw + k * pw + (0.055 if k else 0)
        xb = x0 + fw + (k + 1) * pw - (0.055 if k < panels - 1 else 0)
        p.append(box(f'{name}_s{k}', (xa, y - fd + 0.012, z0 + 0.09), (xb, y - 0.012, z0 + 0.17), fb, coll))       # bottom rail of the sash
        p.append(box(f'{name}_u{k}', (xa, y - fd + 0.012, z1 - fw - 0.06), (xb, y - 0.012, z1 - fw), fb, coll))    # top rail
        if k < panels - 1:
            p.append(box(f'{name}_hb{k}', (xb + 0.03, y, z0 + 1.02), (xb + 0.05, y + 0.012, z0 + 1.1), M['alu'], coll))
            p.append(tube(f'{name}_hh{k}', [(xb + 0.04, y + 0.012, z0 + 1.06), (xb + 0.04, y + 0.045, z0 + 1.06), (xb + 0.04, y + 0.045, z0 + 0.94)], 0.008, M['alu'], coll, 6))
    frame = join(p, name)
    g = wall_quad(f'GLASS_{name}', ('y', y - fd / 2, 1), x1 - fw, x0 + fw, z0 + 0.09, z1 - fw, M['glass'], 'glass')
    g['kind'] = 'glass'
    return frame


def door(name, coll, plane, a0, a1, z0, h=2.1, handle_side=1):
    """White door leaf with architrave, seen from the room. plane as for wall_quad."""
    axis, val, facing = plane
    lo, hi = min(a0, a1), max(a0, a1)
    p = []
    def slab(u0, u1, w0, w1, t0, t1, m):
        if axis == 'x':
            xa, xb = sorted((val + t0 * facing, val + t1 * facing))
            return box(f'{name}_p', (xa, u0, w0), (xb, u1, w1), m, coll, bevel=0.0)
        ya, yb = sorted((val + t0 * facing, val + t1 * facing))
        return box(f'{name}_p', (u0, ya, w0), (u1, yb, w1), m, coll, bevel=0.0)
    p.append(slab(lo, hi, z0 + 0.005, z0 + h, 0.0, 0.012, M['door_white']))
    p.append(slab(lo - 0.07, lo, z0, z0 + h + 0.07, 0.0, 0.03, M['door_white']))
    p.append(slab(hi, hi + 0.07, z0, z0 + h + 0.07, 0.0, 0.03, M['door_white']))
    p.append(slab(lo, hi, z0 + h, z0 + h + 0.07, 0.0, 0.03, M['door_white']))
    hu = hi - 0.09 if handle_side > 0 else lo + 0.09
    if axis == 'x':
        p.append(tube(f'{name}_h', [(val + 0.012 * facing, hu, z0 + 1.02), (val + 0.055 * facing, hu, z0 + 1.02), (val + 0.055 * facing, hu - 0.11 * handle_side, z0 + 1.02)], 0.009, M['steel'], coll, 6))
    else:
        p.append(tube(f'{name}_h', [(hu, val + 0.012 * facing, z0 + 1.02), (hu, val + 0.055 * facing, z0 + 1.02), (hu - 0.11 * handle_side, val + 0.055 * facing, z0 + 1.02)], 0.009, M['steel'], coll, 6))
    return join(p, name)


def extinguisher(name, coll, x, y, z):
    p = [lathe(f'{name}_b', [(0, 0.03), (0.07, 0.03), (0.075, 0.06), (0.075, 0.5), (0.05, 0.57), (0.022, 0.6), (0.022, 0.63)], (x, y, z), M['fire'], coll, seg=14),
         cylinder(f'{name}_v', (x, y, z + 0.63), (x, y, z + 0.68), 0.02, M['iron'], coll, 8),
         box(f'{name}_h', (x - 0.012, y - 0.07, z + 0.68), (x + 0.012, y + 0.05, z + 0.7), M['iron'], coll),
         tube(f'{name}_hose', [(x, y + 0.02, z + 0.66), (x + 0.07, y + 0.05, z + 0.6), (x + 0.085, y + 0.03, z + 0.36), (x + 0.08, y + 0.02, z + 0.26)], 0.009, M['iron'], coll, 5),
         box(f'{name}_lab', (x - 0.05, y - 0.077, z + 0.26), (x + 0.05, y - 0.07, z + 0.42), M['label'], coll)]
    return join(p, name)


def vent(name, coll, plane, a0, a1, z0, z1):
    axis, val, facing = plane
    p = []
    def slab(u0, u1, w0, w1, t0, t1, m):
        if axis == 'x':
            xa, xb = sorted((val + t0 * facing, val + t1 * facing))
            return box(f'{name}_p', (xa, u0, w0), (xb, u1, w1), m, coll)
        ya, yb = sorted((val + t0 * facing, val + t1 * facing))
        return box(f'{name}_p', (u0, ya, w0), (u1, yb, w1), m, coll)
    lo, hi = min(a0, a1), max(a0, a1)
    p.append(slab(lo, hi, z0, z1, 0.0, 0.004, M['dark']))
    for u0, u1, w0, w1 in ((lo - 0.02, hi + 0.02, z0 - 0.02, z0), (lo - 0.02, hi + 0.02, z1, z1 + 0.02), (lo - 0.02, lo, z0, z1), (hi, hi + 0.02, z0, z1)):
        p.append(slab(u0, u1, w0, w1, 0.0, 0.014, M['vent']))
    n = max(3, int((z1 - z0) / 0.028))
    for k in range(n):
        zz = z0 + (k + 0.5) * (z1 - z0) / n
        p.append(slab(lo, hi, zz - 0.006, zz + 0.006, 0.004, 0.012, M['vent']))
    return join(p, name)


def railing(name, coll, pts, h=0.95, cables=5):
    """Stair guard: white posts, steel cables and a stainless handrail."""
    parts = []
    for a, b in zip(pts[:-1], pts[1:]):
        a, b = Vector(a), Vector(b)
        parts.append(tube(f'{name}_hr', [a + Vector((0, 0, h)), b + Vector((0, 0, h))], 0.021, M['steel'], coll, 10))
        for k in range(cables):
            dz = 0.12 + k * (h - 0.25) / max(1, cables - 1)
            parts.append(cylinder(f'{name}_c{k}', a + Vector((0, 0, dz)), b + Vector((0, 0, dz)), 0.003, M['cable'], coll, 4, caps=False))
        L = (b - a).length
        n = max(1, int(L / 0.9))
        for j in range(n + 1):
            q = a.lerp(b, j / n)
            parts.append(box(f'{name}_p{j}', (q.x - 0.02, q.y - 0.02, q.z), (q.x + 0.02, q.y + 0.02, q.z + h - 0.045), M['rail_white'], coll))
            parts.append(cylinder(f'{name}_n{j}', (q.x, q.y, q.z + h - 0.045), (q.x, q.y, q.z + h - 0.02), 0.008, M['steel'], coll, 6))
    return join(parts, name)


def banquette(name, coll, xw, y0, y1, z0, panels=5):
    """Red upholstered bench along the wall at x = xw, with white piping."""
    L = M['leather']
    p = [box(f'{name}_plinth', (xw - 0.5, y0 + 0.02, z0), (xw, y1 - 0.02, z0 + 0.08), M['frame_black'], coll),
         box(f'{name}_base', (xw - 0.55, y0, z0 + 0.08), (xw, y1, z0 + 0.33), L, coll, bevel=0.012),
         box(f'{name}_seat', (xw - 0.57, y0, z0 + 0.33), (xw - 0.02, y1, z0 + 0.455), L, coll, bevel=0.035, bevel_seg=3, soft=True),
         tube(f'{name}_pipe_f', [(xw - 0.565, y0 + 0.02, z0 + 0.425), (xw - 0.565, y1 - 0.02, z0 + 0.425)], 0.006, M['piping'], coll, 5),
         tube(f'{name}_pipe_b', [(xw - 0.565, y0 + 0.02, z0 + 0.345), (xw - 0.565, y1 - 0.02, z0 + 0.345)], 0.006, M['piping'], coll, 5)]
    w = (y1 - y0) / panels
    for k in range(panels):
        a, b = y0 + k * w + 0.012, y0 + (k + 1) * w - 0.012
        p.append(box(f'{name}_back{k}', (xw - 0.115, a, z0 + 0.47), (xw - 0.005, b, z0 + 1.03), L, coll, bevel=0.03, bevel_seg=3, soft=True))
        xf = xw - 0.112
        loop = [(xf, a + 0.028, z0 + 0.495), (xf, b - 0.028, z0 + 0.495), (xf, b - 0.028, z0 + 1.005), (xf, a + 0.028, z0 + 1.005)]
        p.append(tube(f'{name}_pipe{k}', loop, 0.0055, M['piping'], coll, 5, closed=True))
    return join(p, name)


def balcony(name, x0, x1, y, z0, h=1.0):
    """Wrought-iron balcony railing outside a window: rails, bars and a row of loops."""
    m = M['rail_out']
    p = [tube(f'{name}_top', [(x0, y, z0 + h), (x1, y, z0 + h)], 0.02, m, 'emit', 6),
         tube(f'{name}_mid', [(x0, y, z0 + h - 0.12), (x1, y, z0 + h - 0.12)], 0.008, m, 'emit', 4),
         tube(f'{name}_bot', [(x0, y, z0 + 0.08), (x1, y, z0 + 0.08)], 0.012, m, 'emit', 4)]
    n = max(2, round((x1 - x0) / 0.26))
    step = (x1 - x0) / n
    for k in range(n + 1):
        x = x0 + k * step
        p.append(tube(f'{name}_bar{k}', [(x, y, z0 + 0.08), (x, y, z0 + h - 0.12)], 0.006, m, 'emit', 4, caps=False))
    for k in range(n):
        cx = x0 + (k + 0.5) * step
        cz = z0 + 0.08 + (h - 0.2) / 2
        ring = [(cx + step * 0.5 * math.cos(t), y, cz + (h - 0.2) * 0.5 * math.sin(t)) for t in [2 * math.pi * j / 14 for j in range(14)]]
        p.append(tube(f'{name}_loop{k}', ring, 0.005, m, 'emit', 4, closed=True))
    o = join(p, 'EMIT_' + name)
    return o


def set_table(tag, coll, cx, cy, z, sx, sy, seed, n_menus=1, vase=True, stand=True):
    """Things on a table: menu booklets, a menu stand and the little bottle with a dried twig."""
    r = random.Random(seed)
    out = []
    if stand:
        out.append(menu_stand(f'{tag}_stand', coll, cx + r.uniform(-0.1, 0.1) * sx, cy + r.uniform(0.18, 0.3) * sy * r.choice((-1, 1)), z, r.uniform(-0.5, 0.5)))
    if vase:
        out.append(bud_vase(f'{tag}_vase', coll, cx + r.uniform(-0.28, 0.28) * sx, cy + r.uniform(-0.12, 0.12) * sy, z, seed * 7 + 1))
    for k in range(n_menus):
        out.append(booklet(f'{tag}_menu{k}', coll, cx + (r.uniform(0.12, 0.3) * (1 if k % 2 else -1)) * sx, cy + r.uniform(-0.18, 0.18) * sy, z + 0.001 + 0.008 * k, r.uniform(-0.6, 0.6)))
    return out


# ================================================================== GROUND FLOOR
gf = []
gf.append(box('gf_floor', (0, -0.3, -0.2), (5.2, 5.5, 0), M['white'], G, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
gf.append(box('gf_floor_back', (3.0, 5.5, -0.2), (4.6, 8.2, 0), M['white'], G, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
gf.append(box('gf_ceiling', (-0.15, -0.3, CZ0), (5.35, 5.1, CZ0 + 0.06), M['ceiling'], G, skip=('top',)))
gf.append(box('gf_ceiling_stair', (1.9, 5.5, CZ0), (3.0, VOID_Y0, CZ0 + 0.06), M['ceiling'], G, skip=('top',)))
gf.append(box('gf_beam', (-0.15, 5.1, 2.75), (5.35, 5.5, CZ0 + 0.06), M['red'], G, skip=('top',)))
# left wall: white pier at the entrance, black behind the mural
gf.append(box('gf_wall_l_white', (-0.15, -0.3, 0), (0, 0.6, CZ0), M['white'], G, skip=('left',)))
gf.append(box('gf_wall_l_black', (-0.15, 0.6, 0), (0, 5.5, CZ0), M['black'], G, skip=('left',)))
gf.append(wall_quad('gf_venus', ('x', 0.0, 1), 4.45, 1.15, 0.80, 2.84, M['venus'], G, offset=0.006))
# back walls
gf.append(box('gf_back_red', (-0.15, 5.5, 0), (1.9, 5.65, 2.75), M['red'], G, skip=('back',)))
gf.append(box('gf_stairside_l', (1.75, 5.65, 0), (1.9, LAND_Y0, CZ0), M['white'], G, skip=('left',)))
gf.append(box('gf_back_red_r', (4.75, 5.5, 0), (5.35, 5.65, 2.75), M['red'], G, skip=('back',)))
gf.append(box('gf_wall_r', (5.2, -0.3, 0), (5.35, 5.5, CZ0), M['white'], G, skip=('right',)))
# corridor to the toilet
gf.append(box('gf_corr_r', (4.6, 5.5, 0), (4.75, 8.35, 2.75), M['red'], G, skip=('right',)))
gf.append(box('gf_corr_back', (3.0, 8.2, 0), (4.75, 8.35, 2.75), M['white'], G, skip=('back',)))
gf.append(box('gf_corr_ceil', (3.0, 5.5, 2.75), (4.75, 8.35, 2.88), M['ceiling'], G))
gf.append(door('gf_door_wc', G, ('x', 4.6, -1), 7.4, 6.55, 0.0, handle_side=-1))
gf.append(picture('gf_logo', G, ('y', 8.2, -1), 4.06, 3.54, 1.42, 1.94, M['logo'], frame=0.006, depth=0.012, frame_mat=M['door_white']))
gf.append(picture('gf_corr_poster', G, ('y', 8.2, -1), 3.98, 3.62, 0.75, 1.25, M['poster_coppia'], frame=0.012, depth=0.01, frame_mat=M['door_white']))
gf.append(vent('gf_vent', G, ('y', 8.2, -1), 3.5, 4.0, 2.42, 2.6))
# skirting boards
for nm, a, b in (('gf_sk_l', (0.0, 0.6, 0), (0.012, 5.5, 0.08)), ('gf_sk_r', (5.188, 0, 0), (5.2, 5.5, 0.08)),
                 ('gf_sk_back', (0, 5.488, 0), (1.9, 5.5, 0.08)), ('gf_sk_cb', (3.0, 8.188, 0), (4.6, 8.2, 0.08))):
    gf.append(box(nm, a, b, M['skirting'], G))
gf.append(box('gf_cornice_beam', (0.0, 5.085, 2.75), (5.2, 5.1, 2.78), M['skirting'], G))
# storefront: white piers, lintel, glazing and the door
gf.append(box('gf_front_lintel', (0.6, -0.3, 2.55), (5.2, 0, CZ0), M['white'], G))
gf.append(box('gf_front_pier', (-0.15, -0.3, 0), (0.6, 0, CZ0), M['white'], G))
for k, (a, b) in enumerate(((0.6, 0.68), (2.42, 2.5), (3.6, 3.68), (5.12, 5.2))):
    gf.append(box(f'gf_front_mullion{k}', (a, -0.12, 0), (b, -0.04, 2.55), M['alu'], G))
gf.append(box('gf_front_sill', (0.6, -0.12, 0), (2.42, -0.04, 0.08), M['alu'], G))
gf.append(box('gf_front_sill2', (3.68, -0.12, 0), (5.2, -0.04, 0.08), M['alu'], G))
gf.append(box('gf_front_head', (0.6, -0.12, 2.47), (5.2, -0.04, 2.55), M['alu'], G))
gf.append(box('gf_door_head', (2.5, -0.11, 2.12), (3.6, -0.05, 2.2), M['alu'], G))
gf.append(box('gf_door_rail', (2.5, -0.1, 0.0), (3.6, -0.06, 0.09), M['alu'], G))
gf.append(tube('gf_door_handle', [(3.42, -0.06, 0.82), (3.42, 0.0, 0.82), (3.42, 0.0, 1.5), (3.42, -0.06, 1.5)], 0.017, M['steel'], G, 10))
for k, (a, b) in enumerate(((0.68, 2.42), (2.5, 3.6), (3.68, 5.12))):
    g = wall_quad(f'GLASS_gf_front{k}', ('y', -0.08, 1), b, a, 0.08, 2.47, M['glass'], 'glass')
wall_quad('EMIT_gf_street', ('y', -5.5, 1), 7.1, -1.9, 0.0, 7.0, M['street_a'], 'emit')
quad('EMIT_gf_pavement', [(-1.9, -5.5, -0.02), (7.1, -5.5, -0.02), (7.1, -0.3, -0.02), (-1.9, -0.3, -0.02)], M['cobbles'], 'emit',
     uv=((0, 0), (6, 0), (6, 3.5), (0, 3.5)))
gf.append(box('gf_mat', (2.45, 0.03, 0.0), (3.65, 0.95, 0.008), M['doormat'], G))
gf.append(picture('gf_menu_board', G, ('x', 5.2, -1), 1.08, 0.58, 0.95, 1.89, M['menu_board'], frame=0.02, depth=0.02))

# tables along the Venus wall and the small one by the stairs
for k, (y, tag) in enumerate(((1.25, 'a'), (2.6, 'b'), (3.95, 'c'))):
    gf.append(table(f'gf_table_{tag}', G, 0.64, y, 1.1, 0.7, 0.0, M['table_mid'], 1))
    for cx in (0.37, 0.92):
        gf.append(chair(f'gf_ch_{tag}_{cx}a', G, (cx + RND.uniform(-0.02, 0.02), y - 0.54, 0), RND.uniform(-6, 6)))
        gf.append(chair(f'gf_ch_{tag}_{cx}b', G, (cx + RND.uniform(-0.02, 0.02), y + 0.54, 0), 180 + RND.uniform(-6, 6)))
    gf += set_table(f'gf_set_{tag}', G, 0.64, y, 0.75, 1.1, 0.7, 20 + k, n_menus=1)
gf.append(table('gf_table_d', G, 1.3, 4.95, 0.7, 0.7, 0.0, M['table_small'], 1))
gf.append(chair('gf_ch_d1', G, (1.3, 4.42, 0), 4))
gf.append(chair('gf_ch_d2', G, (1.82, 4.97, 0), 96))
gf += set_table('gf_set_d', G, 1.3, 4.95, 0.75, 0.7, 0.7, 31, n_menus=0)
gf.append(monstera('gf_monstera', G, (0.42, 5.12, 0), 1.55, 0.2, 0.44, n=12, seed=3, spread=0.85, arc=(math.radians(245), math.radians(385))))
for k in range(3):
    gf.append(box(f'gf_beer{k}', (0.74 + k * 0.015, 5.1, k * 0.262), (1.14 + k * 0.015, 5.4, k * 0.262 + 0.255), M['beer'], G, bevel=0.006, bevel_seg=1))
for k, (yy, h) in enumerate(((7.75, 0.34), (7.3, 0.42), (6.86, 0.3))):
    gf.append(box(f'gf_box{k}', (3.12, yy - 0.2, 0), (3.52, yy + 0.2, h), M['cardboard'], G, bevel=0.005, bevel_seg=1))
gf.append(strap_plant('gf_entrance_plant', G, (0.78, 0.42, 0), 0.95, 0.19, 0.36, seed=6))
for k, (y, pp) in enumerate(((2.3, 1), (3.3, 5), (4.3, 8))):
    gf.append(picture(f'gf_rpic{k}', G, ('x', 5.2, -1), y + 0.21, y - 0.21, 1.35, 1.91, M[f'poster_{pp}']))
# white track lights, as downstairs in the video
gf.append(track('gf_track1', G, (1.65, 0.5), (1.65, 4.8), CZ0, white=True, heads=[
    (0.1, (0.7, 1.2, 0.75)), (0.3, (0.0, 1.9, 1.75)), (0.52, (0.0, 2.9, 1.75)), (0.74, (0.0, 3.9, 1.75)), (0.97, (0.7, 5.2, 1.0))]))
gf.append(track('gf_track2', G, (3.7, 0.5), (3.7, 4.8), CZ0, white=True, heads=[
    (0.12, (3.1, 1.0, 0.0)), (0.5, (5.2, 3.3, 1.6)), (0.95, (2.6, 5.6, 0.9))]))
gf.append(cylinder('gf_corr_lamp', (3.8, 6.9, 2.75), (3.8, 6.9, 2.735), 0.06, M['lens'], G, 16))
light('gf_corr_light', 'SPOT', (3.8, 6.9, 2.72), 110, kelvin(3000), target=(3.8, 6.9, 0), size=0.05, spot=120, blend=0.8)
light('gf_storefront', 'AREA', (2.9, -0.2, 1.4), 260, (0.82, 0.9, 1.0), target=(2.9, 3, 1.2), size=4.3, size_y=2.3)

# ================================================================== STAIRS + LANDING
st = []
ONLY = lambda *keep: tuple(k for k in FACE_KEYS if k not in keep)       # build just the faces you can see
for i in range(N1):
    y0 = STAIR_Y0 + i * TREAD
    z1 = (i + 1) * RISE
    last = i == N1 - 1
    y1 = LAND_Y1 if last else y0 + TREAD + 0.02
    st.append(box(f'st_riser{i}', (STAIR_X[0], y0 + 0.02, z1 - RISE), (STAIR_X[1], y0 + 0.03, z1 - 0.03), M['riser'], S, skip=ONLY('front')))
    if i <= 12:                      # the side you see from the corridor; further up it is behind the corridor wall
        st.append(box(f'st_side{i}', (STAIR_X[1] - 0.01, y0 + 0.02, 0), (STAIR_X[1], min(y1, 8.35), z1 - 0.03), M['riser'], S, skip=ONLY('right')))
    st.append(box(f'st_tread{i}', (STAIR_X[0], y0, z1 - 0.03), (STAIR_X[1], y1, z1), M['riser'], S,
                  faces={'top': M['carpet']}, skip=('bottom', 'back')))
    st.append(box(f'st_strip{i}', (STAIR_X[0] + 0.02, y0 + 0.008, z1), (STAIR_X[1] - 0.02, y0 + 0.05, z1 + 0.002), M['strip'], S, skip=('bottom',)))
# landing extension to the left and the short flight up to the first floor
st.append(box('st_landing_l', (F2_X[0] - 0.15, LAND_Y0, LAND_Z - 0.03), (F2_X[1], LAND_Y1, LAND_Z), M['riser'], S, faces={'top': M['carpet']}, skip=ONLY('top')))
for i in range(2):
    y0 = LAND_Y0 - (i + 1) * TREAD
    zt = LAND_Z + (i + 1) * RISE
    st.append(box(f'st_f2_{i}', (F2_X[0] - 0.15, y0 + TREAD - 0.03, zt - RISE), (F2_X[1], y0 + TREAD - 0.02, zt - 0.03), M['riser'], S, skip=ONLY('back')))
    if zt - 0.03 > CZ0:              # the wall beside the main flight stops at the ceiling of the ground floor
        st.append(box(f'st_f2side_{i}', (F2_X[1] - 0.01, y0, CZ0), (F2_X[1], y0 + TREAD, zt - 0.03), M['riser'], S, skip=ONLY('right')))
    st.append(box(f'st_f2t_{i}', (F2_X[0] - 0.15, y0, zt - 0.03), (F2_X[1], y0 + TREAD, zt), M['riser'], S, faces={'top': M['carpet']}, skip=('bottom', 'front')))
    st.append(box(f'st_f2s_{i}', (F2_X[0] - 0.13, y0 + TREAD - 0.05, zt), (F2_X[1] - 0.02, y0 + TREAD - 0.008, zt + 0.002), M['strip'], S, skip=('bottom',)))
st.append(box('st_f2s_top', (F2_X[0] - 0.13, F2_TOP_Y - 0.05, Z1), (F2_X[1] - 0.02, F2_TOP_Y - 0.008, Z1 + 0.002), M['strip'], S, skip=('bottom',)))
# poster wall and the side walls of the landing
st.append(box('st_poster_wall', (0.5, LAND_Y1, LAND_Z - 0.05), (3.2, LAND_Y1 + 0.15, CZ1), M['red'], S, skip=ONLY('front')))
st.append(box('st_wall_l', (0.5, F2_TOP_Y, LAND_Z), (F2_X[0] - 0.15, LAND_Y1, CZ1), M['white'], S, skip=('left',)))
st.append(box('st_wall_r', (3.0, VOID_Y0, 2.88), (3.2, LAND_Y1 + 0.15, CZ1), M['white'], S))
st.append(box('st_wall_r_low', (3.0, 8.35, 0), (3.2, LAND_Y1 + 0.15, 2.88), M['white'], S, skip=ONLY('left')))
# left wall of the stairwell as seen from the steps, with a sloping skirting board along the flight
st.append(box('st_wall_l_low', (1.9, 5.65, 0), (1.905, LAND_Y0, CZ0), M['white'], S, skip=ONLY('right')))
nose = lambda y: ((y - STAIR_Y0) / TREAD + 1) * RISE
for nm, x0, x1, ya, yb in (('st_skirt_l', 1.905, 1.92, 5.67, LAND_Y0), ('st_skirt_r', 2.985, 3.0, 8.36, LAND_Y0)):
    st.append(loft(nm, [[(x, ya, nose(ya) - 0.22), (x, yb, nose(yb) - 0.22), (x, yb, nose(yb) + 0.07), (x, ya, nose(ya) + 0.07)] for x in (x0, x1)], M['skirting'], S))
st.append(box('st_ceiling', (0.5, F2_TOP_Y, CZ1), (3.2, LAND_Y1 + 0.15, CZ1 + 0.06), M['ceiling'], S, skip=('top',)))
st.append(box('st_sk', (0.65, LAND_Y1 - 0.012, LAND_Z), (3.0, LAND_Y1, LAND_Z + 0.08), M['skirting'], S))
# eight framed posters, 4 x 2
pw, ph, gap = 0.42, 0.56, 0.12
x_start = (0.8 + 3.0) / 2 - (4 * pw + 3 * gap) / 2
for r_, row in enumerate([[1, 2, 3, 4], [5, 6, 7, 8]]):
    z0 = 4.73 - r_ * (ph + gap)
    for c_, pp in enumerate(row):
        xa = x_start + c_ * (pw + gap)
        st.append(picture(f'st_poster{pp}', S, ('y', LAND_Y1, -1), xa + pw - 0.03, xa + 0.03, z0 + 0.03, z0 + ph - 0.03, M[f'poster_{pp}'], frame=0.03))
y_end = STAIR_Y0 + (N1 - 1) * TREAD
st.append(railing('st_rail_r', S, [(STAIR_X[1] - 0.03, STAIR_Y0 + 0.1, RISE), (STAIR_X[1] - 0.03, y_end, N1 * RISE)]))
st.append(railing('st_rail_l', S, [(STAIR_X[0] + 0.05, STAIR_Y0 + 0.1, RISE), (STAIR_X[0] + 0.05, 5.55, RISE + (5.55 - STAIR_Y0 - 0.1) / TREAD * RISE)]))
st.append(tube('st_wallrail', [(STAIR_X[0] + 0.05, 5.7, RISE + (5.7 - STAIR_Y0 - 0.1) / TREAD * RISE + 0.95), (STAIR_X[0] + 0.05, y_end - 0.3, N1 * RISE - 0.2 + 0.95)], 0.021, M['steel'], S, 10))
st.append(railing('st_rail_void', S, [(STAIR_X[0], LAND_Y0, LAND_Z + 0.02), (STAIR_X[0], F2_TOP_Y, Z1), (STAIR_X[0], VOID_Y0 + 0.02, Z1), (STAIR_X[1], VOID_Y0 + 0.02, Z1)]))
for nm, pos, tgt, en, ang in (('st_spot1', (2.3, 9.15, CZ1), (1.9, LAND_Y1, 4.45), 170, 62), ('st_spot2', (2.45, 8.5, CZ1), (2.45, 7.2, 1.6), 150, 70)):
    st.append(cylinder(f'{nm}_body', pos, (pos[0], pos[1], pos[2] - 0.07), 0.045, M['track_w'], S, 14))
    st.append(cylinder(f'{nm}_lens', (pos[0], pos[1], pos[2] - 0.07), (pos[0], pos[1], pos[2] - 0.073), 0.036, M['lens'], S, 14))
    light(nm, 'SPOT', (pos[0], pos[1], pos[2] - 0.09), en, kelvin(3000), target=tgt, size=0.03, spot=ang, blend=0.7)

# ================================================================== FIRST FLOOR, ROOM A (Primavera)
ua = []
ua.append(box('ua_floor_front', (0, 0, CZ0), (SPLIT_X, VOID_Y0, Z1), M['white'], UA, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
ua.append(box('ua_floor_back', (0, VOID_Y0, CZ0), (STAIR_X[0], F2_TOP_Y, Z1), M['white'], UA, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
ua.append(box('ua_ceiling', (-0.15, -0.3, CZ1), (SPLIT_X, F2_TOP_Y, CZ1 + 0.06), M['ceiling'], UA, skip=('top',)))
ua.append(box('ua_wall_l', (-0.15, 0.8, Z1), (0, 8.1, CZ1), M['red'], UA, skip=('left',)))
ua.append(wall_quad('ua_primavera', ('x', 0.0, 1), 6.16, 3.0, Z1 + 0.92, Z1 + 3.10, M['primavera'], UA, offset=0.006))
ua.append(box('ua_pillar', (-0.15, 8.1, Z1), (0.8, F2_TOP_Y, CZ1), M['black'], UA))
ua.append(box('ua_facade_l', (-0.15, -0.3, Z1), (0.55, 0.8, CZ1), M['white'], UA))
ua.append(box('ua_facade_m', (3.15, -0.3, Z1), (3.95, 0.8, CZ1), M['white'], UA))
ua.append(box('ua_bay_soffit', (0.55, -0.3, Z1 + 2.53), (3.15, 0.8, CZ1), M['white'], UA))
ua.append(box('ua_bay_wall_l', (0.55, -0.3, Z1), (0.65, 0.0, Z1 + 2.53), M['white'], UA))
ua.append(box('ua_bay_wall_r', (3.05, -0.3, Z1), (3.15, 0.0, Z1 + 2.53), M['white'], UA))
ua.append(french_window('ua_win', UA, 0.65, 3.05, 0.0, Z1, Z1 + 2.53, 3))
balcony('ua_balcony', 0.4, 3.3, -0.5, Z1 - 0.05)
wall_quad('EMIT_ua_street', ('y', -2.6, 1), 5.15, -1.45, Z1 - 1.8, Z1 + 3.6, M['street_b'], 'emit')
ua.append(box('ua_partition', (3.0, 2.4, Z1), (3.2, VOID_Y0, CZ1), M['white'], UA))
gy = [(4.3, 3.98), (3.88, 3.56), (3.46, 3.14)]
for r_ in range(2):
    for c_ in range(3):
        u0, u1 = c_ / 3 + 0.045, (c_ + 1) / 3 - 0.045
        v0, v1 = (1 - r_) / 2 + 0.06, (2 - r_) / 2 - 0.06
        zb = Z1 + 1.95 - r_ * 0.5
        ua.append(picture(f'ua_pic{r_}{c_}', UA, ('x', 3.0, -1), gy[c_][0], gy[c_][1], zb, zb + 0.4, M['pictures'], frame=0.022,
                          uv=((u0, v0 - 0.5), (u1, v0 - 0.5), (u1, v1 - 0.5), (u0, v1 - 0.5)) if False else ((u0, 1 - (r_ + 1) / 2 + 0.06), (u1, 1 - (r_ + 1) / 2 + 0.06), (u1, 1 - r_ / 2 - 0.06), (u0, 1 - r_ / 2 - 0.06))))
ua.append(box('ua_ac', (2.76, 3.1, Z1 + 2.62), (3.0, 4.12, Z1 + 2.93), M['ac'], UA, bevel=0.02, bevel_seg=2))
ua.append(box('ua_ac_slot', (2.775, 3.16, Z1 + 2.612), (2.93, 4.06, Z1 + 2.622), M['dark'], UA))
for nm, a, b in (('ua_sk_l', (0.0, 0.8, Z1), (0.012, 8.1, Z1 + 0.07)), ('ua_corn_l', (0.0, 0.8, CZ1 - 0.045), (0.025, 8.1, CZ1)),
                 ('ua_sk_p', (2.988, 2.4, Z1), (3.0, VOID_Y0, Z1 + 0.07))):
    ua.append(box(nm, a, b, M['skirting'], UA))
ua.append(extinguisher('ua_ext', UA, 0.76, 0.2, Z1))
ua.append(box('ua_sign', (0.552, 0.28, Z1 + 2.02), (0.558, 0.52, Z1 + 2.26), M['sign_red'], UA))
ua.append(picture('ua_nosmoke', UA, ('y', 8.1, -1), 0.62, 0.3, Z1 + 0.02, Z1 + 0.45, M['no_smoking'], frame=0.02, depth=0.025))
# three long tables against the Primavera wall
for k, y in enumerate((2.0, 3.6, 5.2)):
    ua.append(table(f'ua_long{k}', UA, 1.08, y, 2.0, 0.8, 0.0, M['table_long'], 2, z0=Z1))
    for j, x in enumerate((0.47, 1.08, 1.69)):
        ua.append(chair(f'ua_lc{k}_{j}a', UA, (x + RND.uniform(-0.03, 0.03), y - 0.61, Z1), RND.uniform(-7, 7)))
        ua.append(chair(f'ua_lc{k}_{j}b', UA, (x + RND.uniform(-0.03, 0.03), y + 0.61, Z1), 180 + RND.uniform(-7, 7)))
    ua += set_table(f'ua_set{k}', UA, 1.0, y, Z1 + 0.75, 2.0, 0.8, 40 + k, n_menus=2)
ua.append(table('ua_sq', UA, 2.66, 1.05, 0.7, 0.7, 0.0, M['table_small'], 1, z0=Z1))
ua.append(chair('ua_sq1', UA, (2.66, 0.53, Z1), 5))
ua.append(chair('ua_sq2', UA, (2.66, 1.57, Z1), 176))
ua += set_table('ua_setsq', UA, 2.66, 1.05, Z1 + 0.75, 0.7, 0.7, 47, n_menus=0)
ua.append(acapulco('ua_acap', UA, (1.15, 0.52, Z1), 14, 'red'))
ua.append(side_table('ua_side', UA, 1.98, 0.36, Z1))
ua.append(lathe('ua_side_deco', [(0, 0), (0.05, 0.005), (0.075, 0.05), (0.06, 0.1), (0.015, 0.12), (0.012, 0.14)], (1.98, 0.36, Z1 + 0.5), M['pillow_red'], UA, seg=12, sharp=60))
ua.append(track('ua_track', UA, (1.55, 1.3), (1.55, 7.5), CZ1, heads=[
    (0.06, (1.3, 0.5, Z1 + 0.4)), (0.3, (0.0, 3.4, Z1 + 2.0)), (0.5, (0.0, 4.6, Z1 + 2.0)), (0.7, (0.0, 5.8, Z1 + 2.0)), (0.95, (1.0, 7.3, Z1))]))
ua.append(track('ua_track2', UA, (2.55, 2.6), (2.55, 5.6), CZ1, heads=[(0.2, (3.0, 3.75, Z1 + 2.0)), (0.8, (1.6, 5.2, Z1 + 0.75))]))
light('ua_day', 'AREA', (1.85, 0.06, Z1 + 1.32), 420, (0.82, 0.9, 1.0), target=(1.85, 4.0, Z1 + 0.9), size=2.3, size_y=2.25)

# ================================================================== FIRST FLOOR, ROOM B (banquette and boxes)
ub = []
ub.append(box('ub_floor_front', (SPLIT_X, 0, CZ0), (8.4, VOID_Y0, Z1), M['white'], UB, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
ub.append(box('ub_floor_back', (3.2, VOID_Y0, CZ0), (8.4, 8.0, Z1), M['white'], UB, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
ub.append(box('ub_niche_floor', (4.9, 8.0, CZ0), (7.7, 8.35, Z1), M['white'], UB, tile=FLOOR_TILE, skip=('bottom',), faces={'top': M['floor']}))
ub.append(box('ub_ceiling', (SPLIT_X, -0.3, CZ1), (8.55, 8.5, CZ1 + 0.06), M['ceiling'], UB, skip=('top',)))
ub.append(box('ub_wall_r', (8.4, 0.8, Z1), (8.55, 8.15, CZ1), M['red'], UB, skip=('right',)))
ub.append(box('ub_facade_m', (3.95, -0.3, Z1), (4.75, 0.8, CZ1), M['white'], UB))
ub.append(box('ub_facade_r', (7.85, -0.3, Z1), (8.55, 0.8, CZ1), M['white'], UB))
ub.append(box('ub_bay_soffit', (4.75, -0.3, Z1 + 2.53), (7.85, 0.8, CZ1), M['white'], UB))
ub.append(box('ub_bay_wall_l', (4.75, -0.3, Z1), (4.85, 0.0, Z1 + 2.53), M['white'], UB))
ub.append(box('ub_bay_wall_r', (7.75, -0.3, Z1), (7.85, 0.0, Z1 + 2.53), M['white'], UB))
ub.append(french_window('ub_win', UB, 4.85, 7.75, 0.0, Z1, Z1 + 2.53, 3))
balcony('ub_balcony', 4.6, 8.0, -0.5, Z1 - 0.05)
wall_quad('EMIT_ub_street', ('y', -2.6, 1), 9.85, 2.75, Z1 - 1.8, Z1 + 3.6, M['street_b'], 'emit')
ub.append(box('ub_back_white', (3.2, 8.0, Z1), (4.45, 8.15, CZ1), M['white'], UB, skip=('back',)))
ub.append(box('ub_back_black_l', (4.45, 8.0, Z1), (4.9, 8.15, CZ1), M['black'], UB))
ub.append(box('ub_back_black_r', (7.7, 8.0, Z1), (8.4, 8.15, CZ1), M['black'], UB))
ub.append(box('ub_niche_back', (4.9, 8.35, Z1), (7.7, 8.5, CZ1), M['grey_niche'], UB, skip=('back',)))
ub.append(box('ub_niche_l', (4.9, 8.0, Z1), (4.95, 8.35, CZ1), M['black'], UB))
ub.append(box('ub_niche_r', (7.65, 8.0, Z1), (7.7, 8.35, CZ1), M['black'], UB))
ub.append(box('ub_niche_head', (4.9, 8.0, Z1 + 2.62), (7.7, 8.35, CZ1), M['black'], UB))
ub.append(door('ub_door_priv', UB, ('y', 8.0, -1), 4.27, 3.47, Z1, handle_side=1))
for nm, a, b in (('ub_sk_r', (8.388, 0.8, Z1), (8.4, 1.05, Z1 + 0.07)), ('ub_corn_r', (8.375, 0.8, CZ1 - 0.045), (8.4, 8.0, CZ1)),
                 ('ub_sk_b', (3.2, 7.988, Z1), (3.4, 8.0, Z1 + 0.07)), ('ub_sk_p', (3.2, 2.4, Z1), (3.212, VOID_Y0, Z1 + 0.07))):
    ub.append(box(nm, a, b, M['skirting'], UB))
ub.append(extinguisher('ub_ext', UB, 7.68, 0.22, Z1))
# banquette with its tables
ub.append(banquette('ub_banquette', UB, 8.4, 1.05, 7.88, Z1, panels=5))
for k, (y, n) in enumerate(((6.85, 'coppia'), (4.85, 'drink1'), (3.75, 'drink2'), (2.45, 'drink1'))):
    fm = None if n == 'coppia' else M['door_white']
    ub.append(picture(f'ub_bqposter{k}', UB, ('x', 8.39, -1), y + 0.17, y - 0.17, Z1 + 1.045, Z1 + 1.5, M[f'poster_{n}'], frame=0.004 if fm is None else 0.02, depth=0.012, frame_mat=fm))
for k, y in enumerate((1.85, 3.45, 5.05, 6.65)):
    ub.append(table(f'ub_bt{k}', UB, 7.36, y, 1.1, 0.7, math.pi / 2, M['table_mid'], 1, z0=Z1))
    for j, dy in enumerate((-0.28, 0.28)):
        ub.append(chair(f'ub_bc{k}{j}', UB, (6.74 + RND.uniform(-0.03, 0.03), y + dy, Z1), 270 + RND.uniform(-8, 8)))
    ub += set_table(f'ub_set{k}', UB, 7.36, y, Z1 + 0.75, 0.7, 1.1, 60 + k, n_menus=2)
for k, y in enumerate((3.7, 5.35)):
    ub.append(table(f'ub_lt{k}', UB, 3.78, y, 0.7, 0.7, 0.0, M['table_small'], 1, z0=Z1))
    ub.append(chair(f'ub_ltc{k}a', UB, (3.78, y - 0.52, Z1), RND.uniform(-6, 6)))
    ub.append(chair(f'ub_ltc{k}b', UB, (3.78, y + 0.52, Z1), 180 + RND.uniform(-6, 6)))
    ub.append(chair(f'ub_ltc{k}c', UB, (4.3, y, Z1), 90 + RND.uniform(-6, 6)))
    ub += set_table(f'ub_setl{k}', UB, 3.78, y, Z1 + 0.75, 0.7, 0.7, 70 + k, n_menus=1)
ub.append(monstera('ub_monstera', UB, (5.45, 2.75, Z1), 1.0, 0.19, 0.36, stand=0.26, n=10, seed=9, spread=1.0))
# the niche: console table, wall of printed boxes, products and the autumn bouquet
ub.append(box('ub_console_top', (5.0, 7.52, Z1 + 0.8), (7.6, 8.02, Z1 + 0.87), M['frame_black'], UB, bevel=0.004))
for x in (5.06, 7.54):
    for y in (7.58, 7.96):
        ub.append(box(f'ub_console_leg{x}{y}', (x - 0.035, y - 0.035, Z1), (x + 0.035, y + 0.035, Z1 + 0.8), M['frame_black'], UB))
cr = []
rnd = random.Random(11)
for k in range(6):
    for j in range(2):
        cr.append(crate(f'ub_low{j}_{k}', UB, 5.34 + k * 0.4 + rnd.uniform(-0.01, 0.01), 7.82 + rnd.uniform(-0.02, 0.02), Z1 + j * 0.272, 0.38, 0.27, 0.3,
                        rnd.uniform(-0.04, 0.04), M['crate_a' if (k + j) % 2 else 'crate_b']))
row_n = [6, 7, 6, 7, 6, 5, 2]
for r_, n in enumerate(row_n):
    z = Z1 + 0.875 + r_ * 0.272
    x0 = 6.3 - n * 0.4 / 2 + 0.2
    for k in range(n):
        xx = x0 + k * 0.4
        if rnd.random() < 0.13 and 0 < r_ < 6:
            cr.append(bottle(f'ub_wallbottle{r_}_{k}', UB, xx, 8.2, z, rnd.choice(('dark', 'green', 'dark')), h=0.25, r=0.032))
            continue
        cr.append(crate(f'ub_crate{r_}_{k}', UB, xx + rnd.uniform(-0.015, 0.015), 8.2 + rnd.uniform(-0.04, 0.02), z, 0.38, 0.27, 0.28,
                        rnd.uniform(-0.05, 0.05), M['crate_a' if (r_ + k) % 3 else 'crate_b']))
ub.append(join(cr, 'ub_crates'))
ub.append(lathe('ub_bucket', [(0, 0), (0.085, 0), (0.115, 0.2), (0.12, 0.2), (0.105, 0.19), (0.08, 0.012), (0, 0.012)], (6.02, 8.2, Z1 + 0.875 + 6 * 0.272), M['galv'], UB, seg=16, sharp=35))
for k, (xx, yy) in enumerate(((5.2, 7.7), (5.33, 7.82), (5.46, 7.68), (6.95, 7.66), (7.08, 7.78), (7.22, 7.66))):
    ub.append(jar(f'ub_jar{k}', UB, xx, yy, Z1 + 0.87))
for k, (xx, yy, kind) in enumerate(((5.72, 7.72, 'dark'), (5.84, 7.8, 'green'), (5.96, 7.7, 'dark'))):
    ub.append(bottle(f'ub_bottle{k}', UB, xx, yy, Z1 + 0.87, kind))
for k, (xx, w) in enumerate(((7.33, 0.2), (7.42, 0.14))):
    ub.append(box(f'ub_smallbox{k}', (xx - w / 2, 7.82 - w * 0.4, Z1 + 0.87), (xx + w / 2, 7.82 + w * 0.4, Z1 + 0.87 + w * 0.7), M['cardboard'], UB, bevel=0.003, bevel_seg=1))
ub.append(autumn_bouquet('ub_bouquet', UB, 6.6, 7.76, Z1 + 0.87))
ub.append(lathe('ub_pumpkin', [(0, 0), (0.05, 0.004), (0.085, 0.04), (0.08, 0.085), (0.04, 0.11), (0.008, 0.108), (0.008, 0.13)], (6.36, 7.68, Z1 + 0.87), M['orange'], UB, seg=14, sharp=60))
for k, xx in enumerate((5.06, 7.54)):
    ub.append(box(f'ub_speaker{k}', (xx - 0.07, 8.2, Z1 + 2.2), (xx + 0.07, 8.33, Z1 + 2.42), M['ac'], UB, bevel=0.012))
# crate stool on the left of the console
for k in range(2):
    zc = Z1 + k * 0.26
    for j in range(3):
        ub.append(box(f'ub_stool{k}_{j}', (4.42, 7.42, zc + j * 0.085), (4.86, 7.82, zc + j * 0.085 + 0.065), M['wood_light'], UB, bevel=0.004, bevel_seg=1))
# second window bay: two acapulco chairs, plant on a stand, side table
ub.append(acapulco('ub_acap1', UB, (5.62, 0.52, Z1), -12, 'black'))
ub.append(acapulco('ub_acap2', UB, (6.62, 0.5, Z1), 10, 'black'))
ub.append(zz_plant('ub_zz', UB, (7.45, 0.36, Z1), 0.72, 0.15, 0.25, stand=0.46, seed=4))
ub.append(side_table('ub_side', UB, 7.3, 0.98, Z1))
ub.append(lathe('ub_side_deco', [(0, 0), (0.05, 0.005), (0.075, 0.05), (0.06, 0.1), (0.015, 0.12), (0.012, 0.14)], (7.3, 0.98, Z1 + 0.5), M['pillow_red'], UB, seg=12, sharp=60))
ub.append(track('ub_track', UB, (6.2, 1.3), (6.2, 7.5), CZ1, heads=[
    (0.05, (6.2, 0.5, Z1 + 0.4)), (0.26, (8.4, 2.5, Z1 + 1.3)), (0.5, (8.4, 4.4, Z1 + 1.3)), (0.74, (8.4, 6.3, Z1 + 1.3)), (0.97, (6.3, 8.3, Z1 + 1.7))]))
ub.append(track('ub_track2', UB, (4.4, 2.8), (4.4, 7.0), CZ1, heads=[(0.18, (3.8, 3.7, Z1 + 0.75)), (0.6, (3.8, 5.35, Z1 + 0.75)), (0.98, (5.6, 8.3, Z1 + 1.4))]))
light('ub_day', 'AREA', (6.3, 0.06, Z1 + 1.32), 480, (0.82, 0.9, 1.0), target=(6.3, 4.0, Z1 + 0.9), size=2.8, size_y=2.25)

# ------------------------------------------------------------------ tags
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
bg.inputs['Color'].default_value = (0.5, 0.56, 0.62, 1)
bg.inputs['Strength'].default_value = 0.0
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 64
scene.cycles.use_denoising = True
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.render.resolution_x = 960
scene.render.resolution_y = 540
cam = bpy.data.objects.new('Camera', bpy.data.cameras.new('Camera'))
scene.collection.objects.link(cam)
scene.camera = cam
cam.data.lens = 18
bpy.ops.wm.save_as_mainfile(filepath=OUT, relative_remap=True)
bpy.ops.file.make_paths_relative()
bpy.ops.wm.save_mainfile()
n_polys = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
print('SAVED', OUT, 'objects', len(bpy.data.objects), 'polys', n_polys)
