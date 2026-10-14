"""Independent educational reference checks for the IRIS optical fixtures.

Derivation deliberately differs from the application (which uses power matrices and eigen
decomposition): here every lens is reduced to its sampled meridional power profile
F(theta) = S + C*sin^2(theta - A) on a dense grid, and equivalence / principal powers are found
by brute-force comparison and search. Not a clinical prescribing system.

Run:  python -I reference/reference_checks.py
"""
import json
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
GRID = [i * 0.05 for i in range(int(180 / 0.05))]  # 0..179.95 degrees
TOL = 1e-6
failures = []


def F(S, C, A, theta):
    if C == 0 or A is None:
        return S
    return S + C * math.sin(math.radians(theta - A)) ** 2


def profile(lens):
    return [F(lens["S"], lens["C"], lens["A"], t) for t in GRID]


def same(a, b):
    return max(abs(x - y) for x, y in zip(profile(a), profile(b))) < TOL


def principal(lens):
    p = profile(lens)
    hi, lo = max(p), min(p)
    return hi, lo


def classify(lens):
    hi, lo = principal(lens)
    hi = 0.0 if abs(hi) < TOL else hi
    lo = 0.0 if abs(lo) < TOL else lo
    if abs(hi - lo) < TOL:
        return "emmetropic" if hi == 0 else ("spherical-myopia" if hi < 0 else "spherical-hyperopia")
    if hi > 0 and lo < 0:
        return "mixed-astigmatism"
    if hi == 0 or lo == 0:
        nz = lo if hi == 0 else hi
        return "simple-myopic-astigmatism" if nz < 0 else "simple-hyperopic-astigmatism"
    return "compound-myopic-astigmatism" if hi < 0 else "compound-hyperopic-astigmatism"


def check(name, cond, detail=""):
    if cond:
        print(f"PASS  {name}")
    else:
        print(f"FAIL  {name} {detail}")
        failures.append(name)


fx = json.load(open(os.path.join(HERE, "optics_fixtures.json"), encoding="utf-8"))

img = fx["image_lens"]
for m in img["meridians"]:
    v = F(img["lens"]["S"], img["lens"]["C"], img["lens"]["A"], m["theta"])
    check(f"image lens power at {m['theta']}", abs(v - m["power"]) < TOL, v)
check("image lens plus-cyl form is the same power field", same(img["lens"], img["plus_form"]))
hi, lo = principal(img["lens"])
check("image lens spherical equivalent", abs((hi + lo) / 2 - img["spherical_equivalent"]) < TOL)
check("spherical equivalent is NOT an equivalent correction", not same(img["lens"], {"S": -2, "C": 0, "A": None}))

for c in fx["classification"]:
    lens = {"S": c["S"], "C": c["C"], "A": c["A"]}
    check(f"classify {lens}", classify(lens) == c["cls"], classify(lens))
    if "T" in c:
        check(f"transposition {lens}", same(lens, c["T"]))
        # round trip with 0/180 equivalence and -0 tolerance
        t = c["T"]
        back = {"S": t["S"] + t["C"], "C": -t["C"], "A": (t["A"] + 90) % 180}
        check(f"round trip {lens}", same(lens, back))

ap = fx["alias_pair"]
for s in ap["shared"]:
    check(f"alias shared at {s['theta']}", abs(F(**ap["a"], theta=s["theta"]) - s["power"]) < TOL and abs(F(**ap["b"], theta=s["theta"]) - s["power"]) < TOL)
check("alias at 45 a", abs(F(**ap["a"], theta=45) - ap["at45"]["a"]) < TOL)
check("alias at 45 b", abs(F(**ap["b"], theta=45) - ap["at45"]["b"]) < TOL)
check("alias pair NOT equivalent", same(ap["a"], ap["b"]) == ap["equivalent"])

cp = fx["confusion_pair"]
check("confusion rx at 90", abs(F(**cp["rx"], theta=90) - cp["rx_at90"]) < TOL)
check("confusion rx at 180", abs(F(**cp["rx"], theta=180) - cp["rx_at180"]) < TOL)
x = cp["cross"]
built = {"S": x["p1"], "C": x["p2"] - x["p1"], "A": x["m1"]}
check("power cross reconstruction", same(built, cp["cross_rx"]))
check("confusion pair differs", not same(cp["rx"], cp["cross_rx"]))

r0 = fx["retinoscopy"][0]
net = {"S": r0["gross"]["S"] - 1 / r0["w"], "C": r0["gross"]["C"], "A": r0["gross"]["A"]}
check("WD 0.50 m = +2.00", abs(1 / r0["w"] - r0["wd_power"]) < TOL)
check("gross -> net", same(net, r0["net"]))
r1 = fx["retinoscopy"][1]
check("0.67 m reciprocal", abs(1 / r1["w"] - r1["wd_power_approx"]) < 1e-6, 1 / r1["w"])
check("2/3 m reciprocal exact", abs(1 / r1["w_exact"] - r1["wd_power_exact"]) < 1e-12)

j = fx["jcc"]
jl = {"S": j["p"], "C": -2 * j["p"], "A": 90}
hi, lo = principal(jl)
check("JCC principal powers", abs(hi - j["principal"][0]) < TOL and abs(lo - j["principal"][1]) < TOL)
check("JCC zero SE", abs((hi + lo) / 2 - j["SE"]) < TOL)

c = fx["colc"]
z = 2 * c["n"] / (c["lambda1"] + c["lambda2"])
mid = (c["n"] / c["lambda1"] + c["n"] / c["lambda2"]) / 2
check("COLC vergence midpoint", abs(z - c["z_colc"]) < 1e-12)
check("COLC differs from arithmetic midpoint", abs(mid - c["z_arith_mid"]) < 1e-12 and abs(z - mid) > 1e-6)

print(f"\n{('ALL PASSED' if not failures else str(len(failures)) + ' FAILED')}")
sys.exit(1 if failures else 0)
