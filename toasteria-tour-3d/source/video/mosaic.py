"""Planar mosaic: register video frames of a flat surface to a reference frame
with homographies and blend them, preferring sharp, close, frontal views."""
import cv2, numpy as np, sys, json, os, glob

SP = os.path.dirname(os.path.abspath(__file__))
F, K1 = 610.0, 0.048            # focal / radial from SfM (478x850 frames)
W, H = 478, 850
Kmat = np.array([[F, 0, W / 2], [0, F, H / 2], [0, 0, 1]])
dist = np.array([K1, 0, 0, 0])

def load(i):
    im = cv2.imread(f'{SP}/frames10/f_{i:04d}.jpg')
    return cv2.undistort(im, Kmat, dist)

def sharp(im):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    return cv2.Laplacian(g, cv2.CV_64F).var()

sift = cv2.SIFT_create(5000)
FEAT_YMAX = 1.0
def feats(im):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    mask = np.zeros(g.shape, np.uint8); mask[:int(FEAT_YMAX * g.shape[0])] = 255
    return sift.detectAndCompute(g, mask)

def match(fa, fb, ratio=0.75):
    (ka, da), (kb, db) = fa, fb
    if da is None or db is None: return None, 0
    m = cv2.BFMatcher().knnMatch(da, db, k=2)
    good = [a for a, b in (x for x in m if len(x) == 2) if a.distance < ratio * b.distance]
    if len(good) < 15: return None, len(good)
    pa = np.float32([ka[g.queryIdx].pt for g in good]); pb = np.float32([kb[g.trainIdx].pt for g in good])
    Hm, inl = cv2.findHomography(pa, pb, cv2.RANSAC, 3.0)
    if Hm is None: return None, 0
    return Hm, int(inl.sum())

def run(name, idxs, ref, out_scale=1.0, canvas_clip=(-3, 4), power=6):
    ims = {i: load(i) for i in idxs}
    fs = {i: feats(ims[i]) for i in idxs}
    sh = {i: sharp(ims[i]) for i in idxs}
    Hs = {ref: np.eye(3)}
    # sequential registration outward from ref, refined directly to ref when possible
    order = sorted(idxs, key=lambda i: abs(i - ref))
    for i in order:
        if i == ref: continue
        nb = i - 1 if i > ref else i + 1
        while nb not in Hs and nb != ref:
            nb = nb - 1 if i > ref else nb + 1
        best = None
        Hd, nd = match(fs[i], fs[ref])
        if Hd is not None and nd >= 60:
            best = (Hd, nd, 'direct')
        Hn, nn = match(fs[i], fs[nb])
        if Hn is not None and nn >= 40:
            Hc = Hs[nb] @ Hn
            if best is None or nn > best[1] * 1.5:
                best = (Hc, nn, 'chain%d' % nb)
        if best is None:
            print(name, i, 'not registered', nd, nn); continue
        Hs[i] = best[0] / best[0][2, 2]
        print(name, i, best[2], best[1], 'sharp %.0f' % sh[i])
    # canvas bounds
    pts = []
    for i, Hm in Hs.items():
        c = cv2.perspectiveTransform(np.float32([[[0, 0]], [[W, 0]], [[W, H]], [[0, H]]]), Hm).reshape(-1, 2)
        pts.append(c)
    pts = np.concatenate(pts)
    lo = np.maximum(pts.min(0), [canvas_clip[0] * W, canvas_clip[0] * H])
    hi = np.minimum(pts.max(0), [canvas_clip[1] * W, canvas_clip[1] * H])
    T = np.array([[out_scale, 0, -lo[0] * out_scale], [0, out_scale, -lo[1] * out_scale], [0, 0, 1]])
    cw, ch = int((hi[0] - lo[0]) * out_scale), int((hi[1] - lo[1]) * out_scale)
    print('canvas', cw, ch)
    acc = np.zeros((ch, cw, 3), np.float64); wsum = np.zeros((ch, cw), np.float64)
    yy, xx = np.mgrid[0:ch, 0:cw].astype(np.float64)
    # feather mask in source frame
    fm = np.ones((H, W), np.float32)
    fm[0, :] = fm[-1, :] = fm[:, 0] = fm[:, -1] = 0
    fm = cv2.distanceTransform((fm > 0).astype(np.uint8), cv2.DIST_L2, 5)
    fm = np.clip(fm / 40.0, 0, 1)
    shmax = max(sh[i] for i in Hs)
    for i, Hm in Hs.items():
        M = T @ Hm
        warped = cv2.warpPerspective(ims[i], M, (cw, ch), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT)
        wf = cv2.warpPerspective(fm, M, (cw, ch), flags=cv2.INTER_LINEAR)
        Minv = np.linalg.inv(M)
        den = Minv[2, 0] * xx + Minv[2, 1] * yy + Minv[2, 2]
        jac = np.abs(np.linalg.det(Minv)) / np.abs(den) ** 3   # source px per canvas px (area)
        q = wf * np.sqrt(jac) * (sh[i] / shmax) ** 0.5
        w = q ** power
        acc += warped.astype(np.float64) * w[..., None]
        wsum += w
    out = (acc / np.maximum(wsum, 1e-12)[..., None]).clip(0, 255).astype(np.uint8)
    out[wsum < 1e-12] = 0
    cv2.imwrite(f'{SP}/tex/{name}_mosaic.png', out)
    np.save(f'{SP}/tex/{name}_T.npy', T)
    json.dump({str(k): v.tolist() for k, v in Hs.items()}, open(f'{SP}/tex/{name}_H.json', 'w'))
    return out

if __name__ == '__main__':
    name = sys.argv[1]; a, b, step, ref = map(int, sys.argv[2:6])
    scale = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0
    if len(sys.argv) > 7: FEAT_YMAX = float(sys.argv[7])
    run(name, list(range(a, b + 1, step)), ref, scale)
