"""Blend registered frames straight into a rectified texture of a planar rectangle."""
import cv2, numpy as np, sys, json
sys.path.insert(0, '.')
from mosaic import load, sharp, W, H
def rectify(name, quad, aspect, width, margin=0.0, power=6, out=None, flip=False):
    Hs = {int(k): np.array(v) for k, v in json.load(open(f'tex/{name}_H.json')).items()}
    T = np.load(f'tex/{name}_T.npy')
    Wt = int(width); Ht = int(round(width / aspect))
    mx, my = margin * Wt, margin * Ht
    dst = np.float32([[mx, my], [Wt - mx, my], [mx, Ht - my], [Wt - mx, Ht - my]])
    Hr = cv2.getPerspectiveTransform(np.float32(quad), dst)
    acc = np.zeros((Ht, Wt, 3)); wsum = np.zeros((Ht, Wt))
    yy, xx = np.mgrid[0:Ht, 0:Wt].astype(np.float64)
    fm = np.ones((H, W), np.uint8); fm[0, :] = fm[-1, :] = fm[:, 0] = fm[:, -1] = 0
    fm = np.clip(cv2.distanceTransform(fm, cv2.DIST_L2, 5) / 40.0, 0, 1).astype(np.float32)
    shs = {i: sharp(load(i)) for i in Hs}; shmax = max(shs.values())
    for i, Hm in Hs.items():
        im = load(i)
        M = Hr @ T @ Hm
        warped = cv2.warpPerspective(im, M, (Wt, Ht), flags=cv2.INTER_LANCZOS4)
        wf = cv2.warpPerspective(fm, M, (Wt, Ht), flags=cv2.INTER_LINEAR)
        Mi = np.linalg.inv(M)
        den = Mi[2, 0] * xx + Mi[2, 1] * yy + Mi[2, 2]
        jac = np.abs(np.linalg.det(Mi)) / np.abs(den) ** 3
        q = wf * np.sqrt(jac) * (shs[i] / shmax) ** 0.5
        w = q ** power
        acc += warped * w[..., None]; wsum += w
    res = (acc / np.maximum(wsum, 1e-30)[..., None]).clip(0, 255).astype(np.uint8)
    res[wsum < 1e-30] = 0
    cov = (wsum > 1e-30).astype(np.uint8) * 255
    if flip: res = res[:, ::-1]
    cv2.imwrite(out or f'tex/{name}_rect.png', res)
    cv2.imwrite(f'tex/{name}_rect_cov.png', cov)
    return res
if __name__ == '__main__':
    name = sys.argv[1]; quad = json.loads(sys.argv[2]); aspect = float(sys.argv[3]); width = int(sys.argv[4])
    margin = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0
    r = rectify(name, quad, aspect, width, margin)
    s = 1400 / max(r.shape[:2]); cv2.imwrite(f'tex/{name}_rect_small.jpg', cv2.resize(r, None, fx=s, fy=s, interpolation=cv2.INTER_AREA))
    print(r.shape)
