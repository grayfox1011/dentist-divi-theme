"""Export the baked scene as a web GLB and dump the lightmaps as numpy arrays.
blender -b baked/toasteria_baked.blend -P export.py -- outdir
"""
import bpy, sys, os, numpy as np
args = sys.argv[sys.argv.index('--') + 1:]
OUT = args[0]
BAKED = os.path.dirname(bpy.data.filepath)
os.makedirs(OUT, exist_ok=True)

WEB_SIZE = {
    'floor_ground.jpg': (1024, 1024), 'floor_upper.jpg': (1024, 1024), 'table_long.jpg': (1024, 410),
    'table_small.jpg': (512, 512), 'carpet.jpg': (512, 512), 'crate_a.jpg': (256, 200), 'crate_b.jpg': (256, 200),
    'crate_side.jpg': (256, 200), 'leaf_oval.png': (256, 256), 'weave.png': (256, 256), 'railing_iron.png': (512, 256),
    'poster_1.jpg': (450, 600), 'poster_2.jpg': (450, 600), 'poster_3.jpg': (450, 600), 'poster_4.jpg': (450, 600),
    'poster_5.jpg': (450, 600), 'poster_6.jpg': (450, 600), 'poster_7.jpg': (450, 600), 'poster_8.jpg': (450, 600),
}
for img in bpy.data.images:
    if img.name in WEB_SIZE and tuple(img.size) != WEB_SIZE[img.name]:
        img.scale(*WEB_SIZE[img.name])

# autumn leaves: use the orange texture directly (a colour multiply node does not survive glTF)
m = bpy.data.materials.get('leaf_autumn')
if m:
    nt = m.node_tree
    tex = next(n for n in nt.nodes if n.type == 'TEX_IMAGE' and n.name != 'LM_BAKE')
    tex.image = bpy.data.images.load(os.path.join(os.path.dirname(bpy.data.filepath), '..', 'tex', 'leaf_autumn.png')) \
        if not os.path.exists(os.path.join(os.path.dirname(bpy.data.filepath), 'tex', 'leaf_autumn.png')) \
        else bpy.data.images.load(os.path.join(os.path.dirname(bpy.data.filepath), 'tex', 'leaf_autumn.png'))
    b = nt.nodes['Principled BSDF']
    nt.links.new(tex.outputs['Color'], b.inputs['Base Color'])

for o in bpy.context.view_layer.objects:
    o.select_set(o.type == 'MESH')
bpy.ops.export_scene.gltf(
    filepath=os.path.join(OUT, 'toasteria.glb'), export_format='GLB', use_selection=True,
    export_extras=True, export_image_format='WEBP', export_image_quality=82,
    export_texcoords=True, export_normals=True, export_materials='EXPORT', export_cameras=False,
    export_lights=False, export_apply=True, export_yup=True)
print('GLB', os.path.getsize(os.path.join(OUT, 'toasteria.glb')))

for g in ('gf', 'st', 'uf'):
    fn = os.path.join(BAKED, f'lm_{g}.exr')
    if not os.path.exists(fn):
        fn = os.path.join(BAKED, f'lm_{g}_raw.exr')
    im = bpy.data.images.load(fn)
    w, h = im.size
    a = np.empty(w * h * 4, np.float32)
    im.pixels.foreach_get(a)
    np.save(os.path.join(OUT, f'lm_{g}.npy'), a.reshape(h, w, 4)[::-1, :, :3])
    print('LM', g, w, h, fn)
