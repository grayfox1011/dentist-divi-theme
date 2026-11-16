"""Still renders of the venue with Cycles.  blender -b toasteria.blend -P render_stills.py -- outdir"""
import bpy, sys, os
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
only = set(args[1:])
os.makedirs(out, exist_ok=True)
Z1 = 3.42
VIEWS = {
    'piano-terra': ((3.4, 0.25, 1.55), (1.3, 5.2, 1.35), 15),
    'nascita-di-venere': ((2.85, 2.8, 1.45), (0.0, 2.8, 1.8), 17),
    'scala': ((2.75, 3.3, 1.55), (2.4, 8.0, 2.5), 16),
    'primavera': ((2.75, 7.4, Z1 + 1.6), (0.0, 3.6, Z1 + 1.55), 15),
    'sala-divanetto': ((3.75, 1.35, Z1 + 1.6), (6.6, 7.8, Z1 + 1.2), 15),
    'vetrata': ((6.3, 3.4, Z1 + 1.55), (6.0, 0.0, Z1 + 1.1), 17),
}
scene = bpy.context.scene
cam = scene.camera
cam.data.sensor_width = 36
scene.render.resolution_x = int(os.environ.get('RES_X', 1600))
scene.render.resolution_y = int(os.environ.get('RES_Y', 900))
scene.cycles.samples = int(os.environ.get('SAMPLES', 96))
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 90
for o in bpy.data.objects:
    if o.name.startswith('EMIT_') and o.type == 'MESH':
        for s in o.material_slots:
            b = s.material.node_tree.nodes.get('Principled BSDF')
            if b:
                b.inputs['Emission Strength'].default_value = 0.45
for name, (p, t, lens) in VIEWS.items():
    if only and name not in only:
        continue
    cam.data.lens = lens
    cam.location = p
    cam.rotation_mode = 'QUATERNION'
    cam.rotation_quaternion = (Vector(t) - Vector(p)).to_track_quat('-Z', 'Y')
    scene.render.filepath = os.path.join(out, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', name, flush=True)
