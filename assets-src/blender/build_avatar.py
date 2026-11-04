"""
Sentinel-01: An interactive, expressive 3D Cyber Companion Bot for Supun Hewagamage.
Designed with sleek defense-grade industrial curves & expressive OLED face.

Run inside Blender or headless:
    blender -b -P build_avatar.py
Writes ../out/avatar.raw.glb
"""

import importlib
import math
import os
import sys

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import sclib as L  # noqa: E402

importlib.reload(L)
from sclib import hexc, material  # noqa: E402

OUT = os.path.normpath(os.path.join(HERE, "..", "out"))
os.makedirs(OUT, exist_ok=True)
CACHE = os.path.normpath(os.path.join(HERE, "..", ".cache"))
L.setup("SC Sentinel Avatar", CACHE)

# High-Tech Cyber Defense Palette
MAT_SHELL = material("shell", color="#1c2029", rough=0.25, metal=0.15, coat=0.3)
MAT_CHEST_ACCENT = material("accent", color="#252b38", rough=0.3, metal=0.4)
MAT_VISOR = material("visor", color="#06070a", rough=0.08, metal=0.1, coat=0.9)
MAT_BRASS = material("brass", color="#d4a359", rough=0.2, metal=0.85)
MAT_CHROME = material("chrome", color="#c8cdd4", rough=0.15, metal=0.9)
MAT_ORANGE = material("orange", color="#ff5a1f", rough=0.3, metal=0.1, coat=0.2)
MAT_EMIT_CYAN = material("emit_cyan", color="#06b6d4", rough=0.2, emit="#06b6d4", emit_strength=4.0)
MAT_EMIT_EMERALD = material("emit_emerald", color="#10b981", rough=0.2, emit="#10b981", emit_strength=3.5)

root = L.empty("sentinel")

def finish_mesh(name, bm, mat, parent=root):
    ob = L.new_obj(name, bm, mat, parent)
    L.set_col(ob, lambda p: hexc("#ffffff"))
    return ob

# 1. Main Head / Torso Body Chassis (Smooth aerodynamic egg-sphere profile)
def make_body_bm():
    # Lathe profile for a sleek, modern droid head
    # Profile: (r, z) pairs from top pole to bottom
    profile = [
        (0.000, 0.160),
        (0.045, 0.155),
        (0.085, 0.140),
        (0.120, 0.110),
        (0.145, 0.065),
        (0.155, 0.010),
        (0.150, -0.045),
        (0.130, -0.095),
        (0.095, -0.135),
        (0.050, -0.155),
        (0.000, -0.160),
    ]
    bm = L.lathe(profile, ns=36, uv=True)
    # Scale slightly in Y to make it slightly squoval / ergonomic
    scale_m = Matrix.Diagonal((1.0, 0.90, 1.0, 1.0))
    L.transform_bm(bm, scale_m)
    return bm

finish_mesh("body_chassis", make_body_bm(), MAT_SHELL)

# 2. Recessed Dark Visor Face Screen (Front curved face for digital eyes)
def make_visor_bm():
    # Front-facing curved visor plate
    profile = [
        (0.000, 0.075),
        (0.050, 0.072),
        (0.090, 0.060),
        (0.115, 0.035),
        (0.125, 0.000),
        (0.115, -0.035),
        (0.090, -0.060),
        (0.050, -0.072),
        (0.000, -0.075),
    ]
    bm = L.lathe(profile, ns=28, uv=True)
    # Flatted in Y and pushed to the front (+Y in three.js space / -Y in blender)
    scale_m = Matrix.Diagonal((0.92, 0.40, 0.85, 1.0))
    L.transform_bm(bm, Matrix.Translation((0, -0.068, 0.02)) @ scale_m)
    return bm

finish_mesh("face_visor", make_visor_bm(), MAT_VISOR)

# 3. Expressive OLED Digital Eyes (Twin floating luminous pill eyes)
def make_eye_bm(center):
    bm = bmesh.new()
    # Pill / oval shape
    prof = [(0.0, 0.012), (0.012, 0.012), (0.016, 0.008), (0.016, -0.008), (0.012, -0.012), (0.0, -0.012)]
    eye = L.lathe(prof, ns=16, uv=False)
    L.transform_bm(eye, Matrix.Translation(center))
    return eye

bm_eye_l = make_eye_bm((-0.045, -0.125, 0.025))
finish_mesh("eye_left", bm_eye_l, MAT_EMIT_CYAN)

bm_eye_r = make_eye_bm((0.045, -0.125, 0.025))
finish_mesh("eye_right", bm_eye_r, MAT_EMIT_CYAN)

# 4. Articulated Brass Antenna Ears
def make_ear_bm(side=1):
    bm = bmesh.new()
    # Base disc
    base_prof = [(0.0, 0.005), (0.022, 0.005), (0.025, 0.000), (0.022, -0.005), (0.0, -0.005)]
    base = L.lathe(base_prof, ns=20, uv=False)
    rot = Matrix.Rotation(math.pi / 2 * side, 4, "Y")
    L.transform_bm(base, Matrix.Translation((0.155 * side, 0, 0.04)) @ rot)
    L.append_bm(bm, base)

    # Antenna rod extending slightly upwards and back
    p0 = Vector((0.165 * side, 0, 0.04))
    p1 = Vector((0.195 * side, 0.015, 0.085))
    p2 = Vector((0.210 * side, 0.025, 0.125))
    L.rod(bm, [p0, p1, p2], r=0.0035, ns=10, caps=True)
    return bm

finish_mesh("ear_antenna_l", make_ear_bm(-1), MAT_BRASS)
finish_mesh("ear_antenna_r", make_ear_bm(1), MAT_BRASS)

# 5. Floating Magnetic Propulsion Ring (Orbiting under the body)
def make_ring_bm():
    bm = bmesh.new()
    # Torus ring profile
    r_outer = 0.145
    r_tube = 0.010
    th = np.linspace(0, 2 * np.pi, 36)
    pts = []
    for a in th:
        cx, cy = math.cos(a) * r_outer, math.sin(a) * r_outer
        pts.append((cx, cy, -0.185))
    L.rod(bm, pts, r=r_tube, ns=16, caps=False)

    # 4 Magnetic emitter brackets on the ring
    for angle in (0, math.pi / 2, math.pi, 3 * math.pi / 2):
        bx = math.cos(angle) * r_outer
        by = math.sin(angle) * r_outer
        bracket = L.box((0.025, 0.025, 0.018), center=(bx, by, -0.185), bevel=0.002)
        L.append_bm(bm, bracket)
    return bm

finish_mesh("propulsion_ring", make_ring_bm(), MAT_CHROME)

# 6. Lower Ion Thruster Core (Emits radiant cyber glow)
def make_thruster_bm():
    bm = bmesh.new()
    prof = [(0.0, 0.0), (0.035, -0.015), (0.045, -0.035), (0.035, -0.045), (0.0, -0.045)]
    thruster = L.lathe(prof, ns=24, uv=False)
    L.transform_bm(thruster, Matrix.Translation((0, 0, -0.145)))
    return thruster

finish_mesh("thruster_core", make_thruster_bm(), MAT_EMIT_CYAN)

# 7. Floating Shoulder Aero Pods (Left & Right)
def make_pod_bm(side=1):
    bm = bmesh.new()
    pod = L.box((0.035, 0.075, 0.045), center=(0.175 * side, 0, -0.04), bevel=0.006)
    # Fin / stripe accent
    stripe = L.box((0.006, 0.065, 0.004), center=(0.192 * side, 0, -0.04), bevel=0.001)
    L.append_bm(bm, pod)
    return bm

finish_mesh("shoulder_pod_l", make_pod_bm(-1), MAT_CHEST_ACCENT)
finish_mesh("shoulder_pod_r", make_pod_bm(1), MAT_CHEST_ACCENT)

# 8. Ambient Occlusion Baking
all_meshes = L.meshes_under(root)
print(f"Baking ambient occlusion across {len(all_meshes)} meshes ({L.tris(all_meshes)} triangles)...")
L.bake_ao(all_meshes, rays=24, dist=0.20, strength=0.70)

# 9. GLB Export
raw_path = os.path.join(OUT, "avatar.raw.glb")
size = L.export_glb(raw_path)
print(f"Exported raw Avatar GLB to {raw_path} ({size / 1024:.1f} KB)")
