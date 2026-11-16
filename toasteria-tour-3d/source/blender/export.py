"""Put the baked zones back into the scene, export the web GLB and dump the lightmaps as numpy arrays.
blender -b toasteria.blend -P export.py -- bakedir outdir
"""
import bpy, sys, os, re, numpy as np
args = sys.argv[sys.argv.index('--') + 1:]
BAKED, OUT = os.path.abspath(args[0]), args[1]
os.makedirs(OUT, exist_ok=True)
ZONES = ['gf', 'st', 'ufa', 'ufb']

# swap the loose objects of every zone for its baked, joined mesh (which carries the lightmap UVs)
for g in ZONES:
    for o in list(bpy.data.collections[g].objects):
        if o.type == 'MESH':
            bpy.data.objects.remove(o, do_unlink=True)
    with bpy.data.libraries.load(os.path.join(BAKED, f'LM_{g}.blend'), link=False) as (src, dst):
        dst.objects = [n for n in src.objects if n == f'LM_{g}']
    o = dst.objects[0]
    bpy.data.collections[g].objects.link(o)
    for slot in o.material_slots:          # the copy brought its own materials: use the scene's
        base = re.sub(r'\.\d{3}$', '', slot.material.name)
        if base != slot.material.name and base in bpy.data.materials:
            slot.material = bpy.data.materials[base]
    o['lightmap'] = f'lm_{g}'
    print('ZONE', g, len(o.data.polygons), 'faces')

# texture sizes for the web (the source files stay at full size for the Cycles renders)
WEB_SIZE = {
    'floor_parquet.jpg': (1024, 1024), 'floor_parquet_n.png': (1024, 1024), 'floor_parquet_r.jpg': (512, 512),
    'table_long.jpg': (1024, 410), 'table_long_n.png': (1024, 410), 'table_mid.jpg': (768, 489), 'table_mid_n.png': (768, 489),
    'table_small.jpg': (512, 512), 'table_small_n.png': (512, 512), 'carpet.jpg': (512, 512), 'carpet_n.png': (512, 512),
    'leather_n.png': (256, 256), 'crate_a.jpg': (256, 190), 'crate_b.jpg': (256, 190), 'crate_side.jpg': (256, 190),
    'leaf_monstera.png': (512, 512), 'leaf_oval.png': (128, 128), 'leaf_long.png': (128, 256), 'leaf_bract.png': (128, 128),
    'leaf_dry.png': (64, 64), 'leaf_autumn.png': (128, 128), 'leaf_autumn2.png': (128, 128),
    'menu_cover.jpg': (256, 350), 'menu_sheet.jpg': (210, 300), 'menu_board.jpg': (240, 450), 'no_smoking.jpg': (180, 240),
    'logo_sign.jpg': (256, 256), 'cobbles.jpg': (256, 256), 'street_a.jpg': (1024, 794), 'street_b.jpg': (1400, 1077),
    'pictures_grid.jpg': (360, 300),
}
for i in range(1, 9):
    WEB_SIZE[f'poster_{i}.jpg'] = (450, 600)
for img in bpy.data.images:
    if img.name in WEB_SIZE and tuple(img.size) != WEB_SIZE[img.name] and img.size[0] > 0:
        img.scale(*WEB_SIZE[img.name])

for o in bpy.context.view_layer.objects:
    o.select_set(o.type == 'MESH')
bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, 'toasteria.glb'), export_format='GLB', use_selection=True,
    export_extras=True, export_image_format='WEBP', export_image_quality=86,
    export_texcoords=True, export_normals=True, export_materials='EXPORT', export_cameras=False,
    export_lights=False, export_apply=True, export_yup=True)
print('GLB', os.path.getsize(os.path.join(OUT, 'toasteria.glb')))

for o in bpy.data.objects:
    if o.type == 'MESH' and o.name.startswith('LM_'):
        g = o.name[3:]
        fn = os.path.join(BAKED, f'lm_{g}.exr')
        if not os.path.exists(fn):
            fn = os.path.join(BAKED, f'lm_{g}_raw.exr')
        im = bpy.data.images.load(fn)
        w, h = im.size
        a = np.empty(w * h * 4, np.float32)
        im.pixels.foreach_get(a)
        np.save(os.path.join(OUT, f'lm_{g}.npy'), a.reshape(h, w, 4)[::-1, :, :3])
        print('LM', g, w, h, os.path.basename(fn))
