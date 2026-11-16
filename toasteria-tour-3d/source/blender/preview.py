"""Render check views of the scene with Cycles.
blender -b toasteria.blend -P preview.py -- outdir [names...]     (env: SAMPLES, RES_X, RES_Y, EXPOSURE)"""
import bpy, sys, os, math
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
only = set(args[1:])
os.makedirs(out, exist_ok=True)
Z1 = 3.42
E = 1.6
VIEWS = {
    'ingresso': ((3.0, 0.75, E), (1.0, 4.2, 1.3)),
    'venere': ((2.55, 2.8, E), (0, 2.8, 1.75)),
    'piedi-scala': ((2.6, 4.35, E), (2.45, 9.5, 3.0)),
    'scala': ((2.45, 6.9, 1.44 + E), (2.2, 10.05, 4.4)),
    'pianerottolo': ((2.0, 9.02, 2.88 + E), (1.9, 10.05, 4.75)),
    'arrivo': ((1.35, 7.75, Z1 + E), (1.6, 0, Z1 + 0.9)),
    'primavera': ((2.45, 4.5, Z1 + E), (0, 4.55, Z1 + 1.8)),
    'vetrata': ((1.9, 1.75, Z1 + E), (1.85, -2, Z1 + 1.0)),
    'passaggio': ((3.95, 1.55, Z1 + E), (6.4, 8.0, Z1 + 1.0)),
    'divanetto': ((5.45, 4.3, Z1 + E), (8.4, 4.4, Z1 + 0.8)),
    'cassette': ((5.95, 5.5, Z1 + E), (6.3, 8.3, Z1 + 1.3)),
    'vetrata-2': ((6.2, 1.7, Z1 + E), (6.3, -2, Z1 + 0.9)),
    'retro': ((1.2, 5.0, 1.5), (3.6, 0.0, 1.3)),
    'tavolo': ((2.0, 2.9, Z1 + 1.25), (0.9, 3.6, Z1 + 0.75)),
    'acapulco': ((6.1, 2.2, Z1 + 1.3), (6.1, 0.4, Z1 + 0.55)),
}
scene = bpy.context.scene
cam = scene.camera
cam.data.lens = float(os.environ.get('LENS', 15))
cam.data.sensor_width = 36
scene.render.resolution_x = int(os.environ.get('RES_X', 960))
scene.render.resolution_y = int(os.environ.get('RES_Y', 540))
scene.cycles.samples = int(os.environ.get('SAMPLES', 48))
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.view_settings.exposure = float(os.environ.get('EXPOSURE', 0.0))
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 88
for o in bpy.data.objects:
    if o.type == 'LIGHT' and o.data.type == 'AREA':
        o.visible_camera = False
for name, (p, t) in VIEWS.items():
    if only and name not in only:
        continue
    cam.location = p
    cam.rotation_mode = 'QUATERNION'
    cam.rotation_quaternion = (Vector(t) - Vector(p)).to_track_quat('-Z', 'Y')
    scene.render.filepath = os.path.join(out, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', name, flush=True)
