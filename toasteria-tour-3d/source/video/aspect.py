import numpy as np, sys, json
def aspect(name, TL, TR, BL, BR, f=610.0):
    T = np.load(f'tex/{name}_T.npy')
    cx, cy = T @ np.array([239, 425, 1.0])[:3] if False else (239 + T[0, 2], 425 + T[1, 2])
    A = np.array([[f, 0, cx], [0, f, cy], [0, 0, 1.0]])
    m1, m2, m3, m4 = [np.array([p[0], p[1], 1.0]) for p in (TL, TR, BL, BR)]
    k2 = np.dot(np.cross(m1, m4), m3) / np.dot(np.cross(m2, m4), m3)
    k3 = np.dot(np.cross(m1, m4), m2) / np.dot(np.cross(m3, m4), m2)
    n2 = k2 * m2 - m1; n3 = k3 * m3 - m1
    Ai = np.linalg.inv(A); B = Ai.T @ Ai
    r = np.sqrt((n2 @ B @ n2) / (n3 @ B @ n3))
    # also estimate focal from the rectangle itself (if not degenerate)
    n21, n22, n23 = n2; n31, n32, n33 = n3
    try:
        f2 = -((n21 * n31 - (n21 * n33 + n23 * n31) * cx + n23 * n33 * cx * cx) + (n22 * n32 - (n22 * n33 + n23 * n32) * cy + n23 * n33 * cy * cy)) / (n23 * n33)
        fe = np.sqrt(f2) if f2 > 0 else float('nan')
    except Exception:
        fe = float('nan')
    return r, fe
if __name__ == '__main__':
    name = sys.argv[1]; pts = json.loads(sys.argv[2])
    print('aspect w/h = %.3f, focal from rectangle = %.0f' % aspect(name, *pts))
