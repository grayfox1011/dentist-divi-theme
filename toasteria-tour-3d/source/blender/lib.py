"""Small modelling toolkit for the Toasteria scene (Blender 4.5, run headless)."""
import bpy, bmesh, math, os, random
from mathutils import Vector, Matrix, Euler, Quaternion

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, 'tex')  # textures made by ../video/make_textures*.py
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


def image(fn, non_color=False):
    im = bpy.data.images.get(fn)
    if im is None:
        im = bpy.data.images.load(os.path.join(TEX, fn))
    if non_color:
        im.colorspace_settings.name = 'Non-Color'
    return im


def mat(name, color='#cccccc', rough=0.6, metal=0.0, tex=None, alpha=False, emit=0.0,
        spec=0.5, normal=None, normal_strength=1.0, rough_tex=None, lmw=1.0, backface=True):
    """Principled material. `lmw` is the relative lightmap texel density wanted for it."""
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m['lmw'] = lmw
    nt = m.node_tree
    b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb(color), 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Specular IOR Level'].default_value = spec
    tn = None
    if tex:
        tn = nt.nodes.new('ShaderNodeTexImage')
        tn.image = image(tex)
        tn.location = (-420, 240)
        nt.links.new(tn.outputs['Color'], b.inputs['Base Color'])
        if alpha:
            nt.links.new(tn.outputs['Alpha'], b.inputs['Alpha'])
            m.surface_render_method = 'DITHERED'
    if rough_tex:
        rn = nt.nodes.new('ShaderNodeTexImage')
        rn.image = image(rough_tex, non_color=True)
        rn.location = (-420, -40)
        sep = nt.nodes.new('ShaderNodeSeparateColor')
        sep.location = (-180, -40)
        nt.links.new(rn.outputs['Color'], sep.inputs['Color'])
        nt.links.new(sep.outputs['Green'], b.inputs['Roughness'])
    if normal:
        nn = nt.nodes.new('ShaderNodeTexImage')
        nn.image = image(normal, non_color=True)
        nn.location = (-420, -320)
        nm = nt.nodes.new('ShaderNodeNormalMap')
        nm.name = 'RELIEF'
        nm.location = (-180, -320)
        nm.inputs['Strength'].default_value = normal_strength
        nt.links.new(nn.outputs['Color'], nm.inputs['Color'])
        nt.links.new(nm.outputs['Normal'], b.inputs['Normal'])
    if emit > 0:
        if tn is not None:
            nt.links.new(tn.outputs['Color'], b.inputs['Emission Color'])
        else:
            b.inputs['Emission Color'].default_value = (*srgb(color), 1)
        b.inputs['Emission Strength'].default_value = emit
    m.use_backface_culling = not backface
    m.diffuse_color = (*srgb(color), 1)
    MATS[name] = m
    return m


def glass_mat(name, color='#ffffff', rough=0.0, ior=1.45, lmw=0.1, thin=False):
    """Clear glass that does not block light: shadow and diffuse rays pass straight through.
    thin=True is a window pane (no refraction, only a Fresnel reflection); otherwise solid glass."""
    if name in MATS:
        return MATS[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    m['lmw'] = lmw
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    t = nt.nodes.new('ShaderNodeBsdfTransparent')
    t.inputs['Color'].default_value = (*[0.75 + 0.25 * c for c in srgb(color)], 1)
    if thin:
        gl = nt.nodes.new('ShaderNodeBsdfGlossy')
        gl.inputs['Roughness'].default_value = rough
        fr = nt.nodes.new('ShaderNodeFresnel')
        fr.inputs['IOR'].default_value = ior
        look = nt.nodes.new('ShaderNodeMixShader')
        nt.links.new(fr.outputs[0], look.inputs['Fac'])
        nt.links.new(t.outputs[0], look.inputs[1])
        nt.links.new(gl.outputs[0], look.inputs[2])
        seen = look.outputs[0]
    else:
        g = nt.nodes.new('ShaderNodeBsdfGlass')
        g.inputs['Color'].default_value = (*srgb(color), 1)
        g.inputs['Roughness'].default_value = rough
        g.inputs['IOR'].default_value = ior
        seen = g.outputs[0]
    lp = nt.nodes.new('ShaderNodeLightPath')
    mx = nt.nodes.new('ShaderNodeMath'); mx.operation = 'MAXIMUM'
    nt.links.new(lp.outputs['Is Shadow Ray'], mx.inputs[0])
    nt.links.new(lp.outputs['Is Diffuse Ray'], mx.inputs[1])
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(mx.outputs[0], mix.inputs['Fac'])
    nt.links.new(seen, mix.inputs[1])
    nt.links.new(t.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    m.diffuse_color = (*srgb(color), 0.3)
    MATS[name] = m
    return m


def _uv_world(bm, tile=1.0, origin=(0, 0, 0), rot90=False):
    uv = bm.loops.layers.uv.get('UVMap') or bm.loops.layers.uv.new('UVMap')
    ox, oy, oz = origin
    for f in bm.faces:
        n = f.normal
        ax = max(range(3), key=lambda i: abs(n[i]))
        for l in f.loops:
            c = l.vert.co
            if ax == 2:
                u, v = (c.x - ox), (c.y - oy) * (1 if n.z > 0 else -1)
                if rot90:
                    u, v = v, u
            elif ax == 0:
                u, v = (c.y - oy) * (1 if n.x < 0 else -1), (c.z - oz)
            else:
                u, v = (c.x - ox) * (1 if n.y > 0 else -1), (c.z - oz)
            l[uv].uv = (u / tile, v / tile)


def _finish(name, bm, mats, coll, smooth=False, sharp_angle=None):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    if sharp_angle is not None:
        me.set_sharp_from_angle(angle=math.radians(sharp_angle))
    ob = bpy.data.objects.new(name, me)
    collection(coll).objects.link(ob)
    return ob


FACE_KEYS = ['bottom', 'top', 'front', 'right', 'back', 'left']   # -z +z -y +x +y -x


def box(name, mn, mx, material, coll='misc', tile=1.0, faces=None, skip=(), origin=(0, 0, 0), uv01=(),
        bevel=0.0, bevel_seg=2, soft=False, rot90=False):
    """Axis aligned box. `faces` maps face key -> material to override per side.
    `skip` lists face keys that are never seen. `bevel` rounds the edges (metres);
    `soft` shades the whole thing smooth, for cushions."""
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
    if bevel > 0 and not skip:
        bevel = min(bevel, 0.49 * min(x1 - x0, y1 - y0, z1 - z0))
        bmesh.ops.bevel(bm, geom=list(bm.edges) + list(bm.verts), offset=bevel, offset_type='OFFSET',
                        segments=bevel_seg, profile=0.5, affect='EDGES', clamp_overlap=True, material=-1)
        bm.normal_update()
        for f in bm.faces:
            n = f.normal
            if soft or max(abs(n.x), abs(n.y), abs(n.z)) < 0.999:
                f.smooth = True
    _uv_world(bm, tile, origin, rot90)
    if uv01:
        lay = bm.loops.layers.uv['UVMap']
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


def wall_quad(name, plane, a0, a1, z0, z1, material, coll='misc', offset=0.0, tile=None, uv=None):
    """Picture on a wall. plane = ('x', value, facing +1/-1) or ('y', value, facing).
    a0 is the edge that gets the left side of the image."""
    axis, val, facing = plane
    val = val + offset * facing
    if axis == 'x':
        if facing > 0:
            c = [(val, a1, z0), (val, a0, z0), (val, a0, z1), (val, a1, z1)]
        else:
            c = [(val, a0, z0), (val, a1, z0), (val, a1, z1), (val, a0, z1)]
    else:
        if facing > 0:
            c = [(a0, val, z0), (a1, val, z0), (a1, val, z1), (a0, val, z1)]
        else:
            c = [(a1, val, z0), (a0, val, z0), (a0, val, z1), (a1, val, z1)]
    t = uv or ((0, 0), (1, 0), (1, 1), (0, 1))
    if tile:
        w = abs(a1 - a0) / tile[0]
        h = abs(z1 - z0) / tile[1]
        t = ((0, 0), (w, 0), (w, h), (0, h))
    return quad(name, c, material, coll, t)


def cylinder(name, p0, p1, r, material, coll='misc', seg=12, caps=True, r1=None):
    p0, p1 = Vector(p0), Vector(p1)
    d = p1 - p0
    L = d.length
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=caps, cap_tris=False, segments=seg,
                          radius1=r, radius2=r if r1 is None else r1, depth=L)
    q = d.normalized().to_track_quat('Z', 'Y')
    M = Matrix.Translation((p0 + p1) / 2) @ q.to_matrix().to_4x4()
    bm.transform(M)
    lay = bm.loops.layers.uv.new('UVMap')
    dn = d.normalized()
    for f in bm.faces:
        side = abs(f.normal.dot(dn)) < 0.5
        f.smooth = side
        for l in f.loops:
            c = l.vert.co
            l[lay].uv = (math.atan2(c.y - p0.y, c.x - p0.x) / (2 * math.pi) * 0.3, (c - p0).dot(dn))
    bm.normal_update()
    return _finish(name, bm, [material], coll)


def lathe(name, profile, center, material, coll='misc', seg=16, sharp=40, caps=(False, False)):
    """Surface of revolution around the vertical axis. profile = [(radius, height), ...] bottom to top."""
    cx, cy = center[0], center[1]
    cz = center[2] if len(center) > 2 else 0.0
    bm = bmesh.new()
    rings = []
    for r, z in profile:
        if r <= 1e-6:
            rings.append([bm.verts.new((cx, cy, cz + z))])
        else:
            rings.append([bm.verts.new((cx + r * math.cos(2 * math.pi * k / seg), cy + r * math.sin(2 * math.pi * k / seg), cz + z))
                          for k in range(seg)])
    lay = bm.loops.layers.uv.new('UVMap')
    for i in range(len(rings) - 1):
        a, b = rings[i], rings[i + 1]
        for k in range(seg):
            k2 = (k + 1) % seg
            if len(a) == 1 and len(b) == 1:
                continue
            if len(a) == 1:
                f = bm.faces.new([a[0], b[k2], b[k]])
            elif len(b) == 1:
                f = bm.faces.new([a[k], a[k2], b[0]])
            else:
                f = bm.faces.new([a[k], a[k2], b[k2], b[k]])
            f.smooth = True
    if caps[0] and len(rings[0]) > 1:
        bm.faces.new(list(reversed(rings[0])))
    if caps[1] and len(rings[-1]) > 1:
        bm.faces.new(rings[-1])
    bm.normal_update()
    for f in bm.faces:
        for l in f.loops:
            c = l.vert.co
            l[lay].uv = (math.atan2(c.y - cy, c.x - cx) / (2 * math.pi), c.z - cz)
    return _finish(name, bm, [material], coll, sharp_angle=sharp)


def tube(name, pts, r, material, coll='misc', seg=8, caps=True, closed=False, r_end=None):
    """Round tube along a polyline (parallel-transported frames)."""
    pts = [Vector(p) for p in pts]
    n = len(pts)
    tang = []
    for i in range(n):
        a = pts[(i - 1) % n] if (closed or i > 0) else pts[i]
        b = pts[(i + 1) % n] if (closed or i < n - 1) else pts[i]
        t = (b - a)
        tang.append(t.normalized() if t.length > 1e-9 else Vector((0, 0, 1)))
    ref = Vector((0, 0, 1)) if abs(tang[0].z) < 0.9 else Vector((1, 0, 0))
    nrm = (ref - tang[0] * ref.dot(tang[0])).normalized()
    bm = bmesh.new()
    lay = bm.loops.layers.uv.new('UVMap')
    rings = []
    dist = 0.0
    dists = []
    for i in range(n):
        if i > 0:
            q = tang[i - 1].rotation_difference(tang[i])
            nrm = (q @ nrm).normalized()
            dist += (pts[i] - pts[i - 1]).length
        dists.append(dist)
        bi = tang[i].cross(nrm).normalized()
        rr = r if r_end is None else r + (r_end - r) * (i / max(1, n - 1))
        rings.append([bm.verts.new(pts[i] + (nrm * math.cos(2 * math.pi * k / seg) + bi * math.sin(2 * math.pi * k / seg)) * rr)
                      for k in range(seg)])
    last = n if closed else n - 1
    for i in range(last):
        a, b = rings[i], rings[(i + 1) % n]
        for k in range(seg):
            k2 = (k + 1) % seg
            f = bm.faces.new([a[k], a[k2], b[k2], b[k]])
            f.smooth = True
            uvs = [(k / seg, dists[i]), ((k + 1) / seg, dists[i]), ((k + 1) / seg, dists[min(i + 1, n - 1)]), (k / seg, dists[min(i + 1, n - 1)])]
            for l, t in zip(f.loops, uvs):
                l[lay].uv = t
    if caps and not closed:
        bm.faces.new(list(reversed(rings[0])))
        bm.faces.new(rings[-1])
    bm.normal_update()
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    return _finish(name, bm, [material], coll)


def loft(name, rings, material, coll='misc', caps=True, smooth=False, sharp=None, tile=1.0):
    """Skin a list of rings (each a list of points, all the same length)."""
    bm = bmesh.new()
    vr = [[bm.verts.new(p) for p in ring] for ring in rings]
    n = len(vr[0])
    for i in range(len(vr) - 1):
        for k in range(n):
            k2 = (k + 1) % n
            f = bm.faces.new([vr[i][k], vr[i][k2], vr[i + 1][k2], vr[i + 1][k]])
            f.smooth = smooth
    if caps:
        bm.faces.new(list(reversed(vr[0])))
        bm.faces.new(vr[-1])
    bm.normal_update()
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    _uv_world(bm, tile)
    return _finish(name, bm, [material], coll, sharp_angle=sharp)


def bezier(p0, p1, p2, n=6):
    """Points of a quadratic curve."""
    p0, p1, p2 = Vector(p0), Vector(p1), Vector(p2)
    return [(p0 * (1 - t) ** 2 + p1 * 2 * t * (1 - t) + p2 * t ** 2) for t in [k / n for k in range(n + 1)]]


def leaf(name, base, direction, up_hint, length, width, material, coll='misc', nu=2, nv=5,
         fold=0.12, droop=0.3, flip=False):
    """Bent leaf blade: a small grid that starts at `base` and grows along `direction`."""
    Y = Vector(direction).normalized()
    X = Y.cross(Vector(up_hint))
    if X.length < 1e-6:
        X = Y.cross(Vector((1, 0, 0)))
    X.normalize()
    Z = X.cross(Y).normalized()
    base = Vector(base)
    bm = bmesh.new()
    lay = bm.loops.layers.uv.new('UVMap')
    grid = []
    for j in range(nv + 1):
        v = j / nv
        row = []
        for i in range(nu + 1):
            u = i / nu - 0.5
            p = base + X * (u * width) + Y * (v * length * (1 - 0.25 * droop * v)) + Z * (fold * abs(u) * width * 2 - droop * length * v * v * 0.6)
            row.append((bm.verts.new(p), (i / nu, v)))
        grid.append(row)
    for j in range(nv):
        for i in range(nu):
            q = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]]
            if flip:
                q = q[::-1]
            f = bm.faces.new([a[0] for a in q])
            f.smooth = True
            for l, a in zip(f.loops, q):
                l[lay].uv = a[1]
    bm.normal_update()
    return _finish(name, bm, [material], coll)


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


def duplicate(obj, name, coll=None):
    o = obj.copy()
    o.data = obj.data.copy()
    o.name = name
    if coll:
        collection(coll).objects.link(o)
    else:
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
