"""Join each floor into one mesh, give it a lightmap UV, bake Cycles diffuse lighting,
denoise it with OIDN and export the web GLB.

blender -b toasteria.blend -P bake.py -- outdir samples res
"""
import bpy, sys, os, math, json, time
args = sys.argv[sys.argv.index('--') + 1:]
OUT = args[0]
SAMPLES = int(args[1]) if len(args) > 1 else 256
RES = int(args[2]) if len(args) > 2 else 2048
GROUPS = args[3].split(',') if len(args) > 3 else ['gf', 'st', 'uf']
RES_OF = {'st': max(512, RES // 2)}
os.makedirs(OUT, exist_ok=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = SAMPLES
scene.cycles.max_bounces = 8
scene.cycles.diffuse_bounces = 6
scene.cycles.glossy_bounces = 2
scene.cycles.transparent_max_bounces = 8
scene.render.bake.margin = 8
scene.render.bake.margin_type = 'EXTEND'
scene.render.bake.use_pass_direct = True
scene.render.bake.use_pass_indirect = True
scene.render.bake.use_pass_color = False

for o in bpy.data.objects:
    if o.type == 'MESH' and o.name.startswith('GLASS_'):
        o.hide_render = True


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


def lightmap_uv(o):
    me = o.data
    lm = me.uv_layers.get('lightmap') or me.uv_layers.new(name='lightmap')
    me.uv_layers.active = lm
    me.uv_layers['UVMap'].active_render = True
    select_only([o])
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.0, area_weight=0.0,
                             correct_aspect=True, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(margin=0.004, rotate=True, shape_method='AABB')
    bpy.ops.object.mode_set(mode='OBJECT')


def bake(o, g):
    res = RES_OF.get(g, RES)
    img = bpy.data.images.new(f'lm_{g}', res, res, float_buffer=True)
    for slot in o.material_slots:
        nt = slot.material.node_tree
        n = nt.nodes.get('LM_BAKE') or nt.nodes.new('ShaderNodeTexImage')
        n.name = 'LM_BAKE'
        n.image = img
        n.interpolation = 'Linear'
        nt.nodes.active = n
    select_only([o])
    t = time.time()
    bpy.ops.object.bake(type='DIFFUSE', pass_filter={'DIRECT', 'INDIRECT'}, margin=8, use_clear=True,
                        target='IMAGE_TEXTURES')
    print(f'BAKED {g} in {time.time() - t:.0f}s', flush=True)
    img.filepath_raw = os.path.join(OUT, f'lm_{g}_raw.exr')
    img.file_format = 'OPEN_EXR'
    img.save()
    return img


def denoise(img, g):
    """OIDN through the compositor (the scene render itself is made trivial)."""
    sc = bpy.data.scenes.new('denoise')
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
    cam = bpy.data.objects.new('dn_cam', bpy.data.cameras.new('dn_cam'))
    sc.collection.objects.link(cam)
    sc.camera = cam
    sc.render.filepath = os.path.join(OUT, f'lm_{g}.exr')
    sc.render.image_settings.file_format = 'OPEN_EXR'
    sc.render.image_settings.color_depth = '16'
    bpy.ops.render.render(write_still=True, scene=sc.name)
    print('DENOISED', g, flush=True)


stats = {}
for g in GROUPS:
    o = join_group(g)
    lightmap_uv(o)
    img = bake(o, g)
    try:
        denoise(img, g)
    except Exception as e:
        print('DENOISE FAILED', g, e, flush=True)
    stats[g] = {'faces': len(o.data.polygons)}

# clean bake nodes, keep UVMap active for export
for m in bpy.data.materials:
    if m.node_tree and 'LM_BAKE' in m.node_tree.nodes:
        m.node_tree.nodes.remove(m.node_tree.nodes['LM_BAKE'])
for g in GROUPS:
    o = bpy.data.objects[f'LM_{g}']
    o.data.uv_layers.active = o.data.uv_layers['UVMap']
    o['lightmap'] = f'lm_{g}'
for o in bpy.data.objects:
    if o.type == 'MESH' and o.name.startswith('GLASS_'):
        o.hide_render = False
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'toasteria_baked.blend'))
json.dump(stats, open(os.path.join(OUT, 'bake_stats.json'), 'w'))
print('DONE', stats)
