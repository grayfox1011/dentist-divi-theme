"""Turn the float lightmaps into 8-bit sRGB WebP files plus lightmaps.json (lmax scale)."""
import numpy as np, json, sys, os
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
maps = {g: np.load(os.path.join(src, f'lm_{g}.npy')) for g in ('gf', 'st', 'uf')}
vals = np.concatenate([m[m.max(-1) > 0.002].reshape(-1, 3).max(-1) for m in maps.values()])
lmax = float(np.ceil(np.percentile(vals, 99.8) * 4) / 4)
print('lmax', lmax, 'p50', np.percentile(vals, 50), 'p99', np.percentile(vals, 99))
def oetf(x):
    return np.where(x <= 0.0031308, 12.92 * x, 1.055 * np.power(np.maximum(x, 1e-9), 1 / 2.4) - 0.055)
out = {}
for g, m in maps.items():
    v = oetf(np.clip(m / lmax, 0, 1))
    Image.fromarray((v * 255 + 0.5).astype(np.uint8)).save(os.path.join(dst, f'lm_{g}.webp'), quality=90, method=6)
    out[f'lm_{g}'] = f'lm_{g}.webp'
    print(g, m.shape, os.path.getsize(os.path.join(dst, f'lm_{g}.webp')))
json.dump({'lmax': lmax, 'maps': out}, open(os.path.join(dst, 'lightmaps.json'), 'w'), indent=1)
