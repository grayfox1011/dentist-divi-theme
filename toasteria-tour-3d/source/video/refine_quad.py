import cv2, numpy as np, json, sys
quad = json.loads(sys.argv[1]); aspect = float(sys.argv[2]); width = int(sys.argv[3]); margin = float(sys.argv[4])
newpts = json.loads(sys.argv[5])
Wt = width; Ht = int(round(width / aspect)); mx, my = margin * Wt, margin * Ht
dst = np.float32([[mx, my], [Wt - mx, my], [mx, Ht - my], [Wt - mx, Ht - my]])
Hr = cv2.getPerspectiveTransform(np.float32(quad), dst)
p = cv2.perspectiveTransform(np.float32(newpts).reshape(-1, 1, 2), np.linalg.inv(Hr)).reshape(-1, 2)
print(json.dumps([[round(float(a), 1), round(float(b), 1)] for a, b in p]))
