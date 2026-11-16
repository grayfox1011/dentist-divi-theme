"""Small modelling toolkit for the Toasteria scene (Blender 4.5, run headless)."""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix, Euler, Quaternion

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, 'tex')
MATS = {}
COLL = {}


def srgb(h):
    """'#rrggbb' -> linear RGB tuple."""
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)


def collection(name):
    if name in COLL:
        return COLL[name]
    c = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(c)
    COLL[name] = c
    return c


def image(fn):
    im = bpy.data.images.get(fn)
    if im is None:
        im = bpy.data.images.load(os.path.join(TEX, fn))
    return im


def mat(name, color='#cccccc', rough=0.6, metal=0.0, tex=None, alpha=False, emit=0.0,
        spec=0.5, coat=0.0, tex_color_mul=None):
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb(color), 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Specular IOR Level'].default_value = spec
    if coat:
        b.inputs['Coat Weight'].default_value = coat
    tn = None
    if tex:
        tn = nt.nodes.new('ShaderNodeTexImage')
        tn.image = image(tex)
        tn.location = (-400, 200)
        src = tn.outputs['Color']
        if tex_color_mul:
            mix = nt.nodes.new('ShaderNodeMix')
            mix.data_type = 'RGBA'
            mix.blend_type = 'MULTIPLY'
            mix.inputs['Factor'].default_value = 1.0
            nt.links.new(src, mix.inputs[6])
            mix.inputs[7].default_value = (*srgb(tex_color_mul), 1)
            src = mix.outputs[2]
        nt.links.new(src, b.inputs['Base Color'])
        if alpha:
            nt.links.new(tn.outputs['Alpha'], b.inputs['Alpha'])
            m.surface_render_method = 'DITHERED'
    if emit > 0:
        if tn is not None:
            nt.links.new(tn.outputs['Color'], b.inputs['Emission Color'])
        else:
            b.inputs['Emission Color'].default_value = (*srgb(color), 1)
        b.inputs['Emission Strength'].default_value = emit
    m.diffuse_color = (*srgb(color), 1)
    MATS[name] = m
    return m


def _uv_world(bm, tile=1.0, origin=(0, 0, 0)):
    uv = bm.loops.layers.uv.get('UVMap') or bm.loops.layers.uv.new('UVMap')
    ox, oy, oz = origin
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for l in f.loops:
            c = l.vert.co
            if ax == 2:
                u, v = (c.x - ox), (c.y - oy) * (1 if n.z > 0 else -1)
            elif ax == 0:
                u, v = (c.y - oy) * (1 if n.x < 0 else -1), (c.z - oz)
            else:
                u, v = (c.x - ox) * (1 if n.y > 0 else -1), (c.z - oz)
            l[uv].uv = (u / tile, v / tile)


def _finish(name, bm, mats, coll, smooth=False):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    collection(coll).objects.link(ob)
    return ob


FACE_KEYS = ['bottom', 'top', 'front', 'right', 'back', 'left']   # -z +z -y +x +y -x


def box(name, mn, mx, material, coll='misc', tile=1.0, faces=None, skip=(), origin=(0, 0, 0), uv01=()):
    """Axis aligned box. `faces` maps face key -> material to override per side.
    `skip` lists face keys that are never seen (saves lightmap space)."""
    x0, y0, z0 = mn
    x1, y1, z1 = mx
    bm = bmesh.new()
    P = [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]
    v = [bm.verts.new(p) for p in P]
    F = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
    mats = [material]
    for k, idx in zip(FACE_KEYS, F):
        if k in skip:
            continue
        f = bm.faces.new([v[i] for i in idx])
        m = (faces or {}).get(k, material)
        if m not in mats:
            mats.append(m)
        f.material_index = mats.index(m)
    bm.normal_update()
    _uv_world(bm, tile, origin)
    if uv01:
        lay = bm.loops.layers.uv['UVMap']
        keyof = {}
        for f in bm.faces:
            n = f.normal
            k = ('top' if n.z > 0.5 else 'bottom' if n.z < -0.5 else 'right' if n.x > 0.5 else
                 'left' if n.x < -0.5 else 'back' if n.y > 0.5 else 'front')
            if k not in uv01:
                continue
            for l in f.loops:
                c = l.vert.co
                if k in ('front', 'back'):
                    u = (c.x - x0) / (x1 - x0); u = u if k == 'front' else 1 - u
                    l[lay].uv = (u, (c.z - z0) / (z1 - z0))
                elif k in ('left', 'right'):
                    u = (c.y - y0) / (y1 - y0); u = 1 - u if k == 'left' else u
                    l[lay].uv = (u, (c.z - z0) / (z1 - z0))
                else:
                    l[lay].uv = ((c.x - x0) / (x1 - x0), (c.y - y0) / (y1 - y0))
    return _finish(name, bm, mats, coll)


def quad(name, corners, material, coll='misc', uv=((0, 0), (1, 0), (1, 1), (0, 1))):
    """Single quad with explicit UVs (corners counter-clockwise seen from the front)."""
    bm = bmesh.new()
    v = [bm.verts.new(c) for c in corners]
    f = bm.faces.new(v)
    lay = bm.loops.layers.uv.new('UVMap')
    for l, t in zip(f.loops, uv):
        l[lay].uv = t
    bm.normal_update()
    return _finish(name, bm, [material], coll)


def wall_quad(name, plane, a0, a1, z0, z1, material, coll='misc', offset=0.0, tile=None):
    """Picture on a wall. plane = ('x', value, facing +1/-1) or ('y', value, facing)."""
    axis, val, facing = plane
    val = val + offset * facing
    if axis == 'x':
        # facing +1 -> normal +x; quad runs along y
        if facing > 0:
            c = [(val, a1, z0), (val, a0, z0), (val, a0, z1), (val, a1, z1)]
        else:
            c = [(val, a0, z0), (val, a1, z0), (val, a1, z1), (val, a0, z1)]
    else:
        if facing > 0:
            c = [(a0, val, z0), (a1, val, z0), (a1, val, z1), (a0, val, z1)]
        else:
            c = [(a1, val, z0), (a0, val, z0), (a0, val, z1), (a1, val, z1)]
    uv = ((0, 0), (1, 0), (1, 1), (0, 1))
    if tile:
        w = abs(a1 - a0) / tile[0]
        h = abs(z1 - z0) / tile[1]
        uv = ((0, 0), (w, 0), (w, h), (0, h))
    return quad(name, c, material, coll, uv)


def cylinder(name, p0, p1, r, material, coll='misc', seg=12, caps=True, r1=None):
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    L = d.length
    bm = bmesh.new()
    res = bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=seg,
                                radius1=r, radius2=r if r1 is None else r1, depth=L)
    q = d.normalized().to_track_quat('Z', 'Y')
    M = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4()
    bm.transform(M)
    lay = bm.loops.layers.uv.new('UVMap')
    for f in bm.faces:
        for l in f.loops:
            c = l.vert.co
            l[lay].uv = (math.atan2(c.y - p0.y, c.x - p0.x) / (2 * math.pi) * 0.3, (c - p0).dot(d.normalized()))
    bm.normal_update()
    return _finish(name, bm, [material], coll, smooth=True)


def join(objs, name):
    objs = [o for o in objs if o is not None]
    if not objs:
        return None
    ctx = bpy.context
    for o in ctx.view_layer.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    ctx.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = ctx.view_layer.objects.active
    o.name = name
    o.data.name = name
    return o


def transform(obj, loc=(0, 0, 0), rot_z=0.0, rot=None, scale=None):
    M = Matrix.Translation(loc) @ (Euler(rot).to_matrix().to_4x4() if rot else Matrix.Rotation(rot_z, 4, 'Z'))
    if scale:
        M = M @ Matrix.Diagonal((*scale, 1))
    obj.data.transform(M)
    obj.data.update()
    return obj


def duplicate(obj, name):
    o = obj.copy()
    o.data = obj.data.copy()
    o.name = name
    for c in obj.users_collection:
        c.objects.link(o)
    return o


def light(name, kind, loc, energy, color=(1, 1, 1), target=None, size=0.1, spot=60, blend=0.4,
          size_y=None, rot=None, coll='lights'):
    L = bpy.data.lights.new(name, kind)
    L.energy = energy
    L.color = color
    if kind == 'SPOT':
        L.spot_size = math.radians(spot)
        L.spot_blend = blend
        L.shadow_soft_size = size
    elif kind == 'AREA':
        L.shape = 'RECTANGLE'
        L.size = size
        L.size_y = size_y or size
    elif kind == 'POINT':
        L.shadow_soft_size = size
    o = bpy.data.objects.new(name, L)
    o.location = loc
    if target is not None:
        o.rotation_mode = 'QUATERNION'
        o.rotation_quaternion = (Vector(target) - Vector(loc)).to_track_quat('-Z', 'Y')
    elif rot is not None:
        o.rotation_euler = rot
    collection(coll).objects.link(o)
    return o


def kelvin(t):
    """Rough blackbody colour (linear RGB) for 1500-12000 K."""
    t = t / 100.0
    if t <= 66:
        r = 255
        g = 99.4708025861 * math.log(t) - 161.1195681661
        b = 0 if t <= 19 else 138.5177312231 * math.log(t - 10) - 305.0447927307
    else:
        r = 329.698727446 * ((t - 60) ** -0.1332047592)
        g = 288.1221695283 * ((t - 60) ** -0.0755148492)
        b = 255
    c = [max(0, min(255, x)) / 255 for x in (r, g, b)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)
