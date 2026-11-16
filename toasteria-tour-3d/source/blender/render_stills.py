"""Still renders of the venue with Cycles (path tracing, real reflections and glass).
blender -b toasteria.blend -P render_stills.py -- outdir [names...]     (env: SAMPLES, RES_X, RES_Y)"""
import bpy, sys, os
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out = args[0]
only = set(args[1:])
os.makedirs(out, exist_ok=True)
Z1 = 3.42
# name: (camera position, point looked at, focal length in mm, exposure in stops)
VIEWS = {
    'piano-terra': ((3.4, 0.3, 1.5), (1.3, 5.2, 1.3), 15, 0.25),
    'nascita-di-venere': ((2.9, 2.8, 1.4), (0.0, 2.8, 1.75), 17, 0.25),
    'scala': ((2.75, 3.3, 1.5), (2.4, 8.0, 2.5), 16, 0.25),
    'primavera': ((2.75, 7.5, Z1 + 1.55), (0.0, 3.5, Z1 + 1.45), 15, 0.0),
    'dettaglio-tavolo': ((2.1, 3.0, Z1 + 1.22), (0.9, 3.65, Z1 + 0.78), 24, 0.0),
    'sala-divanetto': ((3.75, 1.35, Z1 + 1.55), (6.6, 7.8, Z1 + 1.1), 15, 0.0),
    'muro-di-cassette': ((5.9, 5.3, Z1 + 1.45), (6.3, 8.3, Z1 + 1.25), 20, 0.1),
    'vetrata': ((6.95, 3.2, Z1 + 1.45), (6.0, 0.0, Z1 + 1.05), 17, -0.2),
}
scene = bpy.context.scene
cam = scene.camera
cam.data.sensor_width = 36
scene.render.resolution_x = int(os.environ.get('RES_X', 1600))
scene.render.resolution_y = int(os.environ.get('RES_Y', 900))
scene.cycles.samples = int(os.environ.get('SAMPLES', 96))
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 10
scene.cycles.sample_clamp_indirect = 12.0
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 92
for o in bpy.data.objects:            # the window fill lights light the room but must not show as white panels
    if o.type == 'LIGHT' and o.data.type == 'AREA':
        o.visible_camera = False
for name, (p, t, lens, ev) in VIEWS.items():
    if only and name not in only:
        continue
    cam.data.lens = lens
    cam.location = p
    cam.rotation_mode = 'QUATERNION'
    cam.rotation_quaternion = (Vector(t) - Vector(p)).to_track_quat('-Z', 'Y')
    scene.view_settings.exposure = ev
    scene.render.filepath = os.path.join(out, name + '.jpg')
    bpy.ops.render.render(write_still=True)
    print('RENDERED', name, flush=True)
