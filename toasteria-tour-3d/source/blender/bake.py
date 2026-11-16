"""Join each zone into one mesh, give it a lightmap UV (denser where it matters), bake the diffuse
lighting with Cycles, fill the gaps between islands, denoise with OIDN and save the result.
Every zone ends up in its own files (outdir/LM_<zone>.blend with the joined mesh and
outdir/lm_<zone>.exr with the light), so a single zone can be baked again after a change.

blender -b toasteria.blend -P bake.py -- outdir samples res [zones]      zones: gf,st,ufa,ufb
"""
import bpy, sys, os, math, json, time
import numpy as np
from bpy_extras import mesh_utils

args = sys.argv[sys.argv.index('--') + 1:]
OUT = args[0]
SAMPLES = int(args[1]) if len(args) > 1 else 96
RES = int(args[2]) if len(args) > 2 else 2048
GROUPS = args[3].split(',') if len(args) > 3 else ['gf', 'st', 'ufa', 'ufb']
RES_OF = {'st': max(512, RES // 2)}
os.makedirs(OUT, exist_ok=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = SAMPLES
scene.cycles.use_adaptive_sampling = False
scene.cycles.max_bounces = 8
scene.cycles.diffuse_bounces = 6
scene.cycles.glossy_bounces = 3
scene.cycles.transmission_bounces = 6
scene.cycles.transparent_max_bounces = 12
scene.cycles.sample_clamp_indirect = 12.0
scene.cycles.caustics_reflective = False
scene.cycles.caustics_refractive = False

for o in bpy.data.objects:                       # window panes add nothing to the diffuse light
    if o.type == 'MESH' and o.name.startswith('GLASS_'):
        o.hide_render = True
# relief only matters for reflections: bake the light on the smooth surface
RELIEF = {}
for m in bpy.data.materials:
    if m.node_tree and 'RELIEF' in m.node_tree.nodes:
        RELIEF[m.name] = m.node_tree.nodes['RELIEF'].inputs['Strength'].default_value
        m.node_tree.nodes['RELIEF'].inputs['Strength'].default_value = 0.0


def select_only(objs):
    for o in bpy.context.view_layer.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]


def join_group(g):
    objs = [o for o in bpy.data.collections[g].objects if o.type == 'MESH']
    select_only(objs)
    bpy.ops.object.join()
    o = bpy.context.view_layer.objects.active
    o.name = f'LM_{g}'
    o.data.name = f'LM_{g}'
    return o


def weight_islands(o):
    """Scale every UV island by the lightmap weight of its materials (floors and tables get more texels)."""
    me = o.data
    islands = mesh_utils.mesh_linked_uv_islands(me)
    n_loops = len(me.loops)
    uv = np.empty(n_loops * 2, np.float32)
    me.uv_layers.active.data.foreach_get('uv', uv)
    uv = uv.reshape(-1, 2)
    n_poly = len(me.polygons)
    start = np.empty(n_poly, np.int32); total = np.empty(n_poly, np.int32)
    mat = np.empty(n_poly, np.int32); area = np.empty(n_poly, np.float32)
    me.polygons.foreach_get('loop_start', start); me.polygons.foreach_get('loop_total', total)
    me.polygons.foreach_get('material_index', mat); me.polygons.foreach_get('area', area)
    w_mat = np.array([float(s.material.get('lmw', 1.0)) if s.material else 1.0 for s in o.material_slots], np.float32)
    for isl in islands:
        idx = np.asarray(isl, np.int32)
        a = area[idx]
        w = float((a * w_mat[mat[idx]]).sum() / max(1e-12, a.sum()))
        if abs(w - 1.0) < 1e-3:
            continue
        loops = np.concatenate([np.arange(start[i], start[i] + total[i]) for i in idx])
        c = uv[loops].mean(0)
        uv[loops] = (uv[loops] - c) * w + c
    me.uv_layers.active.data.foreach_set('uv', uv.ravel())
    me.update()
    return len(islands)


def lightmap_uv(o, res):
    me = o.data
    lm = me.uv_layers.get('lightmap') or me.uv_layers.new(name='lightmap')
    me.uv_layers.active = lm
    me.uv_layers['UVMap'].active_render = True
    select_only([o])
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.0, area_weight=0.0,
                             correct_aspect=True, scale_to_bounds=False)
    bpy.ops.object.mode_set(mode='OBJECT')
    n = weight_islands(o)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.select_all(action='SELECT')
    t = time.time()
    bpy.ops.uv.pack_islands(rotate=True, margin_method='FRACTION', margin=2.5 / res, shape_method='AABB')
    bpy.ops.object.mode_set(mode='OBJECT')
    print(f'UV {o.name}: {n} islands, packed in {time.time() - t:.0f}s', flush=True)


def fill_gaps(a, passes=24):
    """Spread the baked colours into the empty texels around the islands, so that neither the
    denoiser nor the texture filter can pull black into them."""
    valid = (a.max(-1) > 0)
    out = a.copy()
    for _ in range(passes):
        if valid.all():
            break
        acc = np.zeros_like(out); cnt = np.zeros(valid.shape, np.float32)
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
            v = np.roll(valid, (dy, dx), (0, 1))
            acc += np.roll(out, (dy, dx), (0, 1)) * v[..., None]
            cnt += v
        new = (~valid) & (cnt > 0)
        out[new] = acc[new] / cnt[new][:, None]
        valid = valid | new
    return out


def bake(o, g):
    res = RES_OF.get(g, RES)
    img = bpy.data.images.new(f'lm_{g}', res, res, float_buffer=True, alpha=False)
    for slot in o.material_slots:
        nt = slot.material.node_tree
        n = nt.nodes.get('LM_BAKE') or nt.nodes.new('ShaderNodeTexImage')
        n.name = 'LM_BAKE'
        n.image = img
        nt.nodes.active = n
    select_only([o])
    t = time.time()
    bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT'}, margin=3, margin_type='EXTEND',
                        use_clear=True, target='IMAGE_TEXTURES')
    print(f'BAKED {g} {res}px in {time.time() - t:.0f}s', flush=True)
    px = np.empty(res * res * 4, np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(res, res, 4)
    cover = float((px[..., :3].max(-1) > 0).mean())
    px[..., :3] = fill_gaps(px[..., :3])
    px[..., 3] = 1.0
    img.pixels.foreach_set(px.ravel())
    img.filepath_raw = os.path.join(OUT, f'lm_{g}_raw.exr')
    img.file_format = 'OPEN_EXR'
    img.save()
    return img, cover


def denoise(img, g):
    """OIDN through the compositor."""
    sc = bpy.data.scenes.new('denoise_' + g)
    sc.render.engine = 'BLENDER_WORKBENCH'
    sc.render.resolution_x = img.size[0]
    sc.render.resolution_y = img.size[1]
    sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = 'Standard'
    sc.use_nodes = True
    tree = sc.node_tree
    for n in list(tree.nodes):
        tree.nodes.remove(n)
    src = bpy.data.images.load(os.path.join(OUT, f'lm_{g}_raw.exr'))
    src.colorspace_settings.name = 'Linear Rec.709'
    a = tree.nodes.new('CompositorNodeImage'); a.image = src
    d = tree.nodes.new('CompositorNodeDenoise'); d.prefilter = 'NONE'
    try:
        d.quality = 'HIGH'
    except Exception:
        pass
    c = tree.nodes.new('CompositorNodeComposite')
    tree.links.new(a.outputs['Image'], d.inputs['Image'])
    tree.links.new(d.outputs['Image'], c.inputs['Image'])
    cam = bpy.data.objects.new('dn_cam_' + g, bpy.data.cameras.new('dn_cam_' + g))
    sc.collection.objects.link(cam)
    sc.camera = cam
    sc.render.filepath = os.path.join(OUT, f'lm_{g}.exr')
    sc.render.image_settings.file_format = 'OPEN_EXR'
    sc.render.image_settings.color_depth = '16'
    bpy.ops.render.render(write_still=True, scene=sc.name)
    print('DENOISED', g, flush=True)


def clean_materials():
    for m in bpy.data.materials:
        if m.node_tree:
            if 'LM_BAKE' in m.node_tree.nodes:
                m.node_tree.nodes.remove(m.node_tree.nodes['LM_BAKE'])
            if 'RELIEF' in m.node_tree.nodes:
                m.node_tree.nodes['RELIEF'].inputs['Strength'].default_value = RELIEF.get(m.name, 1.0)


stats_file = os.path.join(OUT, 'bake_stats.json')
stats = json.load(open(stats_file)) if os.path.exists(stats_file) else {}
done = []
for g in GROUPS:
    o = join_group(g)
    lightmap_uv(o, RES_OF.get(g, RES))
    img, cover = bake(o, g)
    try:
        denoise(img, g)
    except Exception as e:
        print('DENOISE FAILED', g, e, flush=True)
    stats[g] = {'faces': len(o.data.polygons), 'coverage': round(cover, 3), 'samples': SAMPLES, 'res': RES_OF.get(g, RES)}
    print('STATS', g, stats[g], flush=True)
    done.append(o)

clean_materials()
for o in done:
    g = o.name[3:]
    o.data.uv_layers.active = o.data.uv_layers['UVMap']
    o['lightmap'] = f'lm_{g}'
    bpy.data.libraries.write(os.path.join(OUT, f'{o.name}.blend'), {o}, fake_user=True)
json.dump(stats, open(stats_file, 'w'), indent=1)
print('DONE', stats)
