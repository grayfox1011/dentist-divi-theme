"""Render check views of the scene with Cycles.  blender -b toasteria.blend -P preview.py -- outdir [names...]"""
import bpy, sys, os, math
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
only = set(args[1:])
os.makedirs(out, exist_ok=True)
Z1 = 3.42
VIEWS = {
    'gf_entrance': ((3.1, 0.35, 1.6), (1.6, 5.0, 1.2)),
    'gf_venus': ((2.7, 2.9, 1.5), (0.0, 2.85, 1.75)),
    'gf_stairs': ((2.9, 1.4, 1.6), (2.3, 6.5, 2.2)),
    'st_posters': ((2.45, 7.0, 2.95), (2.0, 10.05, 4.5)),
    'uf_arrival': ((1.35, 8.2, Z1 + 1.55), (1.6, 0.0, Z1 + 1.1)),
    'uf_primavera': ((2.5, 4.6, Z1 + 1.55), (0.0, 4.6, Z1 + 1.9)),
    'uf_roomB': ((3.7, 1.5, Z1 + 1.6), (6.3, 8.0, Z1 + 1.3)),
    'uf_windowB': ((6.2, 5.8, Z1 + 1.6), (6.4, 0.0, Z1 + 1.2)),
}
scene = bpy.context.scene
cam = scene.camera
cam.data.lens = 15
cam.data.sensor_width = 36
scene.render.resolution_x = int(os.environ.get('RES_X', 960))
scene.render.resolution_y = int(os.environ.get('RES_Y', 540))
scene.cycles.samples = int(os.environ.get('SAMPLES', 48))
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 88
for name, (p, t) in VIEWS.items():
    if only and name not in only:
        continue
    cam.location = p
    cam.rotation_mode = 'QUATERNION'
    cam.rotation_quaternion = (Vector(t) - Vector(p)).to_track_quat('-Z', 'Y')
    scene.render.filepath = os.path.join(out, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', name, flush=True)
