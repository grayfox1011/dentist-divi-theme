"""Turn the float lightmaps into 8-bit sRGB WebP files plus lightmaps.json (which holds the scale)."""
import numpy as np, json, sys, os, glob
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
maps = {os.path.basename(f)[3:-4]: np.load(f) for f in sorted(glob.glob(os.path.join(src, 'lm_*.npy')))}
vals = np.concatenate([m.reshape(-1, 3).max(-1) for m in maps.values()])
vals = vals[vals > 0.002]
lmax = float(min(12.0, np.ceil(np.percentile(vals, 99.9) * 2) / 2))
print('lmax', lmax, 'p50 %.2f p99 %.2f p99.9 %.2f max %.1f' % tuple(np.percentile(vals, [50, 99, 99.9, 100])))


def oetf(x):
    return np.where(x <= 0.0031308, 12.92 * x, 1.055 * np.power(np.maximum(x, 1e-9), 1 / 2.4) - 0.055)


def degrain(v):
    """Edge-preserving smoothing: takes away the fine grain the denoiser leaves in dim areas,
    keeps the shadow edges (they differ by much more than the 3.5% tolerance)."""
    try:
        import cv2
    except ImportError:
        return v
    v = v.astype(np.float32)
    for _ in range(2):
        v = cv2.bilateralFilter(v, 5, 0.035, 1.6)
    return v


out = {}
for g, m in maps.items():
    v = degrain(oetf(np.clip(m / lmax, 0, 1)))
    fn = f'lm_{g}.webp'
    Image.fromarray((v * 255 + 0.5).astype(np.uint8)).save(os.path.join(dst, fn), quality=92, method=6)
    out[f'lm_{g}'] = fn
    print(g, m.shape, os.path.getsize(os.path.join(dst, fn)))
json.dump({'lmax': lmax, 'maps': out}, open(os.path.join(dst, 'lightmaps.json'), 'w'), indent=1)
