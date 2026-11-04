"""
Cyber Security & Infrastructure Diorama for Supun Hewagamage (supunhg).
Inspired by Jesse Zhou (kiosk/signpost/solar/cables) and Bruno Simon (stylized isometric room).

Procedural generation with Blender 5.2 bmesh and vertex ambient occlusion.
Interactive targets:
  - sign_lab: Directional arrow to Campus Lab (ESXi infrastructure)
  - sign_forensics: Directional arrow to Digital Forensics & Filo
  - sign_creative: Directional arrow to 3D Craft (Supercub)
  - sign_contact: Directional arrow to Contact / Dossier
  - server_rack: 19" Campus ESXi Hypervisor with 34 containers & Authentik
  - desk_workstation: Operator cyber desk with ultrawide terminal
  - arcade_cabinet: Filo-Go forensic retro arcade
  - telemetry_dish: Nemue high-speed recon dish & solar array
  - cyber_drone: Mini floating security sentinel
  - skateboard: Cyber skateboard on the floor

Run:
  blender -b -P build_diorama.py
Writes:
  ../out/diorama.raw.glb
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
L.setup("SC Diorama Cyber Outpost", CACHE)

# ---------------------------------------------------------------- Palette & Materials
MAT_BASE = material("diorama_base", color="#1c2128", rough=0.55, metal=0.1)
MAT_FLOOR = material("diorama_floor", color="#242b35", rough=0.45, metal=0.15)
MAT_FLOOR_TILES = material("floor_tiles", color="#181e26", rough=0.5, metal=0.2)
MAT_STEPS = material("steps", color="#e2e8f0", rough=0.35, metal=0.05)
MAT_GRAPHITE = material("graphite_metal", color="#13171f", rough=0.35, metal=0.7)
MAT_ALU = material("brushed_alu", color="#cbd5e1", rough=0.22, metal=0.88)
MAT_BRASS = material("machined_brass", color="#d4a359", rough=0.2, metal=0.85)
MAT_WOOD_DESK = material("wood_desk", color="#2a323d", rough=0.4, metal=0.05)
MAT_SCREEN_GLASS = material("screen_glass", color="#090d12", rough=0.08, metal=0.2, coat=0.8)
MAT_WHITE_CERAMIC = material("white_ceramic", color="#f8fafc", rough=0.25, metal=0.02)
MAT_RUBBER = material("rubber_trim", color="#0f1217", rough=0.75, metal=0.0)
MAT_SOLAR_BLUE = material("solar_cell", color="#1e3a8a", rough=0.15, metal=0.4, coat=0.5)
MAT_PURPLE = material("purple_matte", color="#8b5cf6", rough=0.35, metal=0.1)

# Emissive cyber accents
MAT_EMIT_CYAN = material("emit_cyan", color="#06b6d4", rough=0.2, emit="#06b6d4", emit_strength=3.8)
MAT_EMIT_ORANGE = material("emit_orange", color="#f97316", rough=0.2, emit="#f97316", emit_strength=3.8)
MAT_EMIT_GREEN = material("emit_green", color="#10b981", rough=0.2, emit="#10b981", emit_strength=3.5)
MAT_EMIT_MAGENTA = material("emit_magenta", color="#d946ef", rough=0.2, emit="#d946ef", emit_strength=3.8)
MAT_EMIT_WARM = material("emit_warm_lantern", color="#ffedd5", rough=0.2, emit="#fff7ed", emit_strength=4.2)
MAT_EMIT_TERMINAL = material("emit_terminal", color="#022c22", rough=0.3, emit="#10b981", emit_strength=2.2)

root = L.empty("diorama_outpost")

# ---------------------------------------------------------------- Helpers
def box_bm(size, center=(0, 0, 0), bevel=0.005, segs=2):
    return L.box(size, center, bevel=bevel, segs=segs)

def cylinder_bm(r, height, center=(0, 0, 0), ns=20):
    prof = [(0.0, height / 2), (r, height / 2), (r, -height / 2), (0.0, -height / 2)]
    b = L.lathe(prof, ns, uv=False)
    L.transform_bm(b, Matrix.Translation(center))
    return b

def finish_mesh(name, bm, mat, parent=root):
    ob = L.new_obj(name, bm, mat, parent)
    L.set_col(ob, lambda p: hexc("#ffffff"))
    return ob

def text_bm(text, size=0.06, depth=0.008, align='CENTER'):
    t = bpy.data.curves.new(f"tmp_font_{text}", 'FONT')
    t.body = text
    t.size = size
    t.extrude = depth
    t.resolution_u = 1
    t.align_x = align
    t.align_y = 'CENTER'
    o = bpy.data.objects.new("tmp_txt_ob", t)
    bpy.context.scene.collection.objects.link(o)
    me = bpy.data.meshes.new_from_object(o)
    bm = bmesh.new()
    bm.from_mesh(me)
    bpy.data.objects.remove(o)
    bpy.data.curves.remove(t)
    bpy.data.meshes.remove(me)
    return bm

# ================================================================
# 1. BASE PLATFORM & ENTRANCE STAIRS (Isometric Room Foundation)
# ================================================================
print("Generating Base Platform...")
bm_base = bmesh.new()
L.append_bm(bm_base, box_bm((2.40, 2.40, 0.14), center=(0, 0, 0.07), bevel=0.012, segs=3))
L.append_bm(bm_base, box_bm((2.48, 2.48, 0.03), center=(0, 0, 0.015), bevel=0.006, segs=2))
finish_mesh("base_foundation", bm_base, MAT_BASE)

bm_floor = box_bm((2.32, 2.32, 0.02), center=(0, 0, 0.145), bevel=0.004, segs=2)
finish_mesh("floor_surface", bm_floor, MAT_FLOOR)

bm_tiles = bmesh.new()
L.append_bm(bm_tiles, box_bm((0.85, 0.95, 0.004), center=(-0.58, 0.45, 0.157), bevel=0.003))
L.append_bm(bm_tiles, box_bm((1.05, 0.95, 0.004), center=(0.42, 0.25, 0.157), bevel=0.003))
L.append_bm(bm_tiles, box_bm((0.65, 0.65, 0.004), center=(-0.55, -0.45, 0.157), bevel=0.003))
finish_mesh("floor_tiles", bm_tiles, MAT_FLOOR_TILES)

bm_floor_circuit = bmesh.new()
L.append_bm(bm_floor_circuit, box_bm((2.26, 0.012, 0.003), center=(0, 1.08, 0.157), bevel=0.001))
L.append_bm(bm_floor_circuit, box_bm((0.012, 2.16, 0.003), center=(-1.08, 0, 0.157), bevel=0.001))
L.append_bm(bm_floor_circuit, box_bm((0.012, 1.30, 0.003), center=(1.08, 0.42, 0.157), bevel=0.001))
finish_mesh("floor_circuit_glow", bm_floor_circuit, MAT_EMIT_CYAN)

bm_steps = bmesh.new()
step_w = 0.52
step_d = 0.16
for i in range(4):
    sz = 0.155 - i * 0.038
    sy = -0.92 - i * step_d
    step = box_bm((step_w, step_d + 0.01, sz), center=(0.78, sy, sz / 2), bevel=0.004, segs=2)
    L.append_bm(bm_steps, step)
finish_mesh("stairs_entrance", bm_steps, MAT_STEPS)

bm_step_leds = bmesh.new()
for i in range(4):
    sz = 0.155 - i * 0.038
    sy = -0.92 - i * step_d
    led_strip = box_bm((step_w * 0.85, 0.008, 0.004), center=(0.78, sy + step_d * 0.45, sz + 0.001), bevel=0.001)
    L.append_bm(bm_step_leds, led_strip)
finish_mesh("stairs_leds", bm_step_leds, MAT_EMIT_CYAN)

# ================================================================
# 2. CAMPUS ESXi HYPERVISOR SERVER RACK (NIBM Infrastructure)
# ================================================================
print("Generating Campus ESXi Hypervisor Rack...")
rack_parent = L.empty("server_rack", root, loc=(-0.65, 0.55, 0.155))

bm_rack_frame = bmesh.new()
rw, rd, rh = 0.48, 0.58, 0.98
for cx in (-rw/2, rw/2):
    for cy in (-rd/2, rd/2):
        col = box_bm((0.032, 0.032, rh), center=(cx, cy, rh/2), bevel=0.003)
        L.append_bm(bm_rack_frame, col)
L.append_bm(bm_rack_frame, box_bm((rw + 0.03, rd + 0.03, 0.035), center=(0, 0, rh + 0.015), bevel=0.004))
L.append_bm(bm_rack_frame, box_bm((rw + 0.02, rd + 0.02, 0.03), center=(0, 0, 0.015), bevel=0.003))
for sx in (-rw/2 - 0.005, rw/2 + 0.005):
    panel = box_bm((0.006, rd - 0.04, rh - 0.08), center=(sx, 0, rh/2), bevel=0.002)
    L.append_bm(bm_rack_frame, panel)
finish_mesh("rack_enclosure", bm_rack_frame, MAT_GRAPHITE, rack_parent)

bm_blades = bmesh.new()
bm_blade_accents = bmesh.new()
bm_blade_leds_g = bmesh.new()
bm_blade_leds_a = bmesh.new()
bm_blade_leds_c = bmesh.new()

blade_heights = [0.08, 0.08, 0.06, 0.06, 0.06, 0.05, 0.05, 0.08]
curr_z = 0.06
for bi, bh in enumerate(blade_heights):
    cz = curr_z + bh / 2
    blade = box_bm((rw - 0.06, rd - 0.04, bh - 0.008), center=(0, 0, cz), bevel=0.002)
    L.append_bm(bm_blades, blade)
    faceplate = box_bm((rw - 0.07, 0.008, bh - 0.012), center=(0, -rd/2 + 0.008, cz), bevel=0.001)
    L.append_bm(bm_blade_accents, faceplate)
    for ex in (-rw/2 + 0.025, rw/2 - 0.025):
        ear = box_bm((0.012, 0.018, bh - 0.014), center=(ex, -rd/2 + 0.01, cz), bevel=0.001)
        L.append_bm(bm_blade_accents, ear)
    L.append_bm(bm_blade_leds_g, box_bm((0.006, 0.003, 0.006), center=(-0.14, -rd/2 + 0.002, cz + 0.01), bevel=0.0005))
    L.append_bm(bm_blade_leds_g, box_bm((0.006, 0.003, 0.006), center=(-0.12, -rd/2 + 0.002, cz + 0.01), bevel=0.0005))
    L.append_bm(bm_blade_leds_c, box_bm((0.006, 0.003, 0.006), center=(-0.10, -rd/2 + 0.002, cz + 0.01), bevel=0.0005))
    if bi % 2 == 1:
        L.append_bm(bm_blade_leds_a, box_bm((0.006, 0.003, 0.006), center=(-0.08, -rd/2 + 0.002, cz + 0.01), bevel=0.0005))
    curr_z += bh + 0.015

finish_mesh("rack_blades", bm_blades, MAT_GRAPHITE, rack_parent)
finish_mesh("rack_blade_trim", bm_blade_accents, MAT_ALU, rack_parent)
finish_mesh("rack_leds_green", bm_blade_leds_g, MAT_EMIT_GREEN, rack_parent)
finish_mesh("rack_leds_amber", bm_blade_leds_a, MAT_EMIT_ORANGE, rack_parent)
finish_mesh("rack_leds_cyan", bm_blade_leds_c, MAT_EMIT_CYAN, rack_parent)

patch_z = curr_z + 0.03
bm_patch_panel = box_bm((rw - 0.06, rd - 0.06, 0.045), center=(0, 0, patch_z), bevel=0.002)
finish_mesh("rack_patch_switch", bm_patch_panel, MAT_GRAPHITE, rack_parent)

bm_cables_cyan = bmesh.new()
bm_cables_orange = bmesh.new()
for pi in range(8):
    px = -0.16 + pi * 0.045
    pts = [
        Vector((px, -rd/2 + 0.005, patch_z)),
        Vector((px + 0.015, -rd/2 - 0.05 - (pi % 3) * 0.02, patch_z - 0.04 - (pi % 2) * 0.03)),
        Vector((px + 0.03, -rd/2 + 0.005, patch_z - 0.08 - (pi % 2) * 0.04)),
    ]
    target_bm = bm_cables_cyan if pi % 2 == 0 else bm_cables_orange
    L.rod(target_bm, pts, r=0.0035, ns=8, caps=True)

finish_mesh("rack_cables_cyan", bm_cables_cyan, MAT_EMIT_CYAN, rack_parent)
finish_mesh("rack_cables_orange", bm_cables_orange, MAT_EMIT_ORANGE, rack_parent)

bm_rack_badge = box_bm((0.36, 0.02, 0.06), center=(0, -rd/2 - 0.005, rh + 0.05), bevel=0.002)
finish_mesh("rack_badge_housing", bm_rack_badge, MAT_GRAPHITE, rack_parent)

bm_rack_text = text_bm("ESXi 34c // AUTHENTIK", size=0.028, depth=0.006)
L.transform_bm(bm_rack_text, Matrix.Rotation(math.radians(90), 4, 'X'))
L.transform_bm(bm_rack_text, Matrix.Translation(Vector((0, -rd/2 - 0.018, rh + 0.045))))
finish_mesh("rack_badge_text", bm_rack_text, MAT_EMIT_CYAN, rack_parent)

bm_fans = bmesh.new()
for fx in (-0.12, 0.12):
    fan_housing = cylinder_bm(0.065, 0.015, center=(fx, 0, rh + 0.035), ns=20)
    L.append_bm(bm_fans, fan_housing)
finish_mesh("rack_fans", bm_fans, MAT_ALU, rack_parent)

drone_parent = L.empty("cyber_drone", root, loc=(-0.18, 0.45, 0.95))
bm_drone = cylinder_bm(0.048, 0.048, center=(0, 0, 0), ns=16)
finish_mesh("drone_chassis", bm_drone, MAT_ALU, drone_parent)
bm_drone_eye = cylinder_bm(0.024, 0.012, center=(0, -0.045, 0), ns=14)
L.transform_bm(bm_drone_eye, Matrix.Rotation(math.radians(90), 4, 'X'))
finish_mesh("drone_eye", bm_drone_eye, MAT_EMIT_CYAN, drone_parent)

# ================================================================
# 3. OPERATOR CYBER WORKSTATION & TERMINAL
# ================================================================
print("Generating Operator Cyber Desk...")
desk_parent = L.empty("desk_workstation", root, loc=(0.38, 0.28, 0.155))

bm_desk = bmesh.new()
dw, dd, dh = 0.96, 0.54, 0.44
L.append_bm(bm_desk, box_bm((dw, dd, 0.032), center=(0, 0, dh), bevel=0.006, segs=2))
finish_mesh("desk_top", bm_desk, MAT_WOOD_DESK, desk_parent)

bm_legs = bmesh.new()
for lx in (-dw/2 + 0.06, dw/2 - 0.06):
    pts = [
        Vector((lx, -dd/2 + 0.05, dh - 0.016)),
        Vector((lx, -dd/2 + 0.05, 0.01)),
        Vector((lx, dd/2 - 0.05, 0.01)),
        Vector((lx, dd/2 - 0.05, dh - 0.016)),
    ]
    L.rod(bm_legs, pts, r=0.012, ns=12, caps=True)
finish_mesh("desk_legs", bm_legs, MAT_ALU, desk_parent)

bm_mon_body = bmesh.new()
bm_mon_screen = bmesh.new()
mon_w, mon_h = 0.56, 0.24
num_segs = 12
curve_rad = 1.10
th_half = (mon_w / curve_rad) / 2
for s in range(num_segs):
    t0 = -th_half + (s / num_segs) * (2 * th_half)
    t1 = -th_half + ((s + 1) / num_segs) * (2 * th_half)
    tm = (t0 + t1) / 2
    px = curve_rad * math.sin(tm)
    py = -curve_rad * (1.0 - math.cos(tm))
    seg_len = curve_rad * (t1 - t0)
    
    b_seg = box_bm((seg_len + 0.004, 0.022, mon_h), center=(px, py + 0.08, dh + 0.22), bevel=0.002)
    L.append_bm(bm_mon_body, b_seg)
    s_seg = box_bm((seg_len + 0.002, 0.004, mon_h - 0.016), center=(px, py + 0.066, dh + 0.22), bevel=0.001)
    L.append_bm(bm_mon_screen, s_seg)

bm_mon_arm = bmesh.new()
arm_pts = [
    Vector((0, 0.18, dh + 0.016)),
    Vector((0, 0.18, dh + 0.16)),
    Vector((0, 0.10, dh + 0.22)),
]
L.rod(bm_mon_arm, arm_pts, r=0.014, ns=12, caps=True)
L.append_bm(bm_mon_arm, box_bm((0.08, 0.08, 0.02), center=(0, 0.18, dh + 0.02), bevel=0.002))
finish_mesh("monitor_chassis", bm_mon_body, MAT_GRAPHITE, desk_parent)
finish_mesh("monitor_screen", bm_mon_screen, MAT_EMIT_TERMINAL, desk_parent)
finish_mesh("monitor_arm", bm_mon_arm, MAT_ALU, desk_parent)

bm_keyboard = box_bm((0.26, 0.10, 0.014), center=(0, -0.08, dh + 0.023), bevel=0.003)
finish_mesh("keyboard_base", bm_keyboard, MAT_GRAPHITE, desk_parent)

bm_keycaps = bmesh.new()
bm_keycaps_orange = bmesh.new()
for row in range(4):
    ky = -0.115 + row * 0.022
    for col in range(10):
        kx = -0.105 + col * 0.023
        key = box_bm((0.018, 0.018, 0.008), center=(kx, ky, dh + 0.034), bevel=0.001)
        if (row == 0 and col == 0) or (row == 3 and col in (4, 5)):
            L.append_bm(bm_keycaps_orange, key)
        else:
            L.append_bm(bm_keycaps, key)
finish_mesh("keyboard_keys", bm_keycaps, MAT_WHITE_CERAMIC, desk_parent)
finish_mesh("keyboard_accents", bm_keycaps_orange, MAT_EMIT_ORANGE, desk_parent)

bm_mat = box_bm((0.55, 0.25, 0.004), center=(0.04, -0.07, dh + 0.018), bevel=0.002)
finish_mesh("desk_mat", bm_mat, MAT_RUBBER, desk_parent)

bm_mouse = box_bm((0.05, 0.08, 0.024), center=(0.19, -0.07, dh + 0.03), bevel=0.006)
finish_mesh("mouse_body", bm_mouse, MAT_GRAPHITE, desk_parent)

bm_lamp = bmesh.new()
lamp_base = cylinder_bm(0.045, 0.012, center=(-0.36, 0.12, dh + 0.022), ns=16)
L.append_bm(bm_lamp, lamp_base)
lamp_stem = [
    Vector((-0.36, 0.12, dh + 0.022)),
    Vector((-0.34, 0.10, dh + 0.20)),
    Vector((-0.26, 0.04, dh + 0.28)),
]
L.rod(bm_lamp, lamp_stem, r=0.007, ns=10, caps=True)
finish_mesh("desk_lamp_arm", bm_lamp, MAT_ALU, desk_parent)

bm_shade = cylinder_bm(0.038, 0.05, center=(-0.25, 0.03, dh + 0.27), ns=16)
finish_mesh("desk_lamp_shade", bm_shade, MAT_GRAPHITE, desk_parent)

bm_bulb = cylinder_bm(0.028, 0.008, center=(-0.25, 0.03, dh + 0.25), ns=16)
finish_mesh("desk_lamp_bulb", bm_bulb, MAT_EMIT_WARM, desk_parent)

bm_mug = bmesh.new()
L.append_bm(bm_mug, cylinder_bm(0.032, 0.065, center=(0.34, 0.08, dh + 0.048), ns=16))
handle_pts = [
    Vector((0.37, 0.08, dh + 0.07)),
    Vector((0.40, 0.08, dh + 0.05)),
    Vector((0.37, 0.08, dh + 0.03)),
]
L.rod(bm_mug, handle_pts, r=0.005, ns=8, caps=True)
finish_mesh("coffee_mug", bm_mug, MAT_WHITE_CERAMIC, desk_parent)

# Modern Ergonomic Swivel Chair
bm_chair = bmesh.new()
chair_c = Vector((0.0, -0.28, 0.0))
for a in range(5):
    ang = a * (2 * math.pi / 5)
    pts = [
        chair_c + Vector((0, 0, 0.05)),
        chair_c + Vector((0.24 * math.cos(ang), 0.24 * math.sin(ang), 0.03)),
    ]
    L.rod(bm_chair, pts, r=0.012, ns=8, caps=True)
    L.append_bm(bm_chair, cylinder_bm(0.015, 0.015, center=(chair_c.x + 0.24 * math.cos(ang), chair_c.y + 0.24 * math.sin(ang), 0.015), ns=8))
L.append_bm(bm_chair, cylinder_bm(0.02, 0.22, center=(chair_c.x, chair_c.y, 0.16), ns=12))
finish_mesh("chair_base", bm_chair, MAT_ALU, desk_parent)

bm_seat = bmesh.new()
L.append_bm(bm_seat, box_bm((0.36, 0.36, 0.045), center=(chair_c.x, chair_c.y, 0.27), bevel=0.01, segs=2))
L.append_bm(bm_seat, box_bm((0.34, 0.04, 0.38), center=(chair_c.x, chair_c.y - 0.16, 0.46), bevel=0.008, segs=2))
for ax in (-0.18, 0.18):
    L.append_bm(bm_seat, box_bm((0.04, 0.18, 0.016), center=(chair_c.x + ax, chair_c.y - 0.02, 0.36), bevel=0.003))
finish_mesh("chair_seat", bm_seat, MAT_GRAPHITE, desk_parent)

bm_skate = bmesh.new()
skate_c = Vector((0.15, -0.45, 0.17))
deck = box_bm((0.38, 0.12, 0.014), center=(0, 0, 0.035), bevel=0.004)
L.transform_bm(deck, Matrix.Rotation(math.radians(-15), 4, 'Z'))
L.transform_bm(deck, Matrix.Translation(skate_c))
L.append_bm(bm_skate, deck)
finish_mesh("skate_deck", bm_skate, MAT_PURPLE)

bm_wheels = bmesh.new()
for wx in (-0.12, 0.12):
    for wy in (-0.05, 0.05):
        w = cylinder_bm(0.016, 0.014, center=(wx, wy, 0.018), ns=10)
        L.transform_bm(w, Matrix.Rotation(math.radians(90), 4, 'X'))
        L.transform_bm(w, Matrix.Rotation(math.radians(-15), 4, 'Z'))
        L.transform_bm(w, Matrix.Translation(skate_c))
        L.append_bm(bm_wheels, w)
finish_mesh("skate_wheels", bm_wheels, MAT_EMIT_ORANGE)

# ================================================================
# 4. FORENSIC RETRO ARCADE CABINET (FILO-GO)
# Authentic stepped silhouette with visible CRT & Marquee!
# ================================================================
print("Generating Forensic Arcade Cabinet...")
arcade_parent = L.empty("arcade_cabinet", root, loc=(-0.58, -0.38, 0.155))
# Face towards camera at (+X, -Y): rotate +45 degrees
arcade_parent.rotation_euler = (0, 0, math.radians(45))

bm_arcade_body = bmesh.new()
aw = 0.44

# Lower cabinet base
L.append_bm(bm_arcade_body, box_bm((aw, 0.42, 0.48), center=(0, 0.05, 0.24), bevel=0.006, segs=2))
# Upper back canopy
L.append_bm(bm_arcade_body, box_bm((aw, 0.28, 0.42), center=(0, 0.12, 0.69), bevel=0.006, segs=2))
# Overhang marquee roof
L.append_bm(bm_arcade_body, box_bm((aw, 0.36, 0.10), center=(0, 0.04, 0.85), bevel=0.004, segs=2))
finish_mesh("arcade_body", bm_arcade_body, MAT_GRAPHITE, arcade_parent)

# Two Side Profile Wings with Glowing T-Molding
bm_t_molding = bmesh.new()
for sx in (-aw/2 - 0.003, aw/2 + 0.003):
    pts = [
        Vector((sx, -0.16, 0.02)),
        Vector((sx, -0.16, 0.48)),
        Vector((sx, -0.06, 0.50)),
        Vector((sx, 0.02, 0.72)),
        Vector((sx, -0.14, 0.82)),
        Vector((sx, -0.14, 0.90)),
        Vector((sx, 0.26, 0.90)),
        Vector((sx, 0.26, 0.02)),
        Vector((sx, -0.16, 0.02)),
    ]
    L.rod(bm_t_molding, pts, r=0.0045, ns=8, caps=False)
finish_mesh("arcade_neon_trim", bm_t_molding, MAT_EMIT_CYAN, arcade_parent)

# Protruding Angled Control Deck
bm_control_deck = box_bm((aw - 0.02, 0.16, 0.035), center=(0, -0.10, 0.49), bevel=0.003)
finish_mesh("arcade_deck", bm_control_deck, MAT_BASE, arcade_parent)

bm_sticks = bmesh.new()
bm_balls = bmesh.new()
for jx in (-0.11, 0.11):
    pts = [Vector((jx, -0.11, 0.51)), Vector((jx, -0.11, 0.57))]
    L.rod(bm_sticks, pts, r=0.003, ns=8, caps=True)
    L.append_bm(bm_balls, cylinder_bm(0.012, 0.016, center=(jx, -0.11, 0.575), ns=12))
finish_mesh("arcade_joystick_stems", bm_sticks, MAT_ALU, arcade_parent)
finish_mesh("arcade_joystick_balls", bm_balls, MAT_EMIT_ORANGE, arcade_parent)

bm_buttons = bmesh.new()
for p in (-1, 1):
    bx_base = p * 0.11 + 0.04
    for bi in range(3):
        btn = cylinder_bm(0.007, 0.006, center=(bx_base + (bi % 2) * 0.018, -0.12 + (bi // 2) * 0.02, 0.51), ns=10)
        L.append_bm(bm_buttons, btn)
finish_mesh("arcade_buttons", bm_buttons, MAT_EMIT_CYAN, arcade_parent)

# Highly Visible Recessed CRT Screen (Angled backwards at 25°)
bm_crt = box_bm((aw - 0.06, 0.02, 0.22), center=(0, 0, 0), bevel=0.004)
L.transform_bm(bm_crt, Matrix.Rotation(math.radians(-25), 4, 'X'))
L.transform_bm(bm_crt, Matrix.Translation(Vector((0, -0.02, 0.64))))
finish_mesh("arcade_crt_screen", bm_crt, MAT_EMIT_TERMINAL, arcade_parent)

# Backlit Front Marquee: "FILO-GO"
bm_marquee_housing = box_bm((aw - 0.02, 0.05, 0.08), center=(0, -0.11, 0.84), bevel=0.003)
finish_mesh("arcade_marquee_box", bm_marquee_housing, MAT_GRAPHITE, arcade_parent)

bm_marquee_txt = text_bm("FILO-GO", size=0.042, depth=0.008)
L.transform_bm(bm_marquee_txt, Matrix.Rotation(math.radians(90), 4, 'X'))
L.transform_bm(bm_marquee_txt, Matrix.Translation(Vector((0, -0.14, 0.84))))
finish_mesh("arcade_marquee_text", bm_marquee_txt, MAT_EMIT_ORANGE, arcade_parent)

bm_coin_door = box_bm((0.18, 0.012, 0.20), center=(0, -0.16, 0.24), bevel=0.002)
finish_mesh("arcade_coin_door", bm_coin_door, MAT_GRAPHITE, arcade_parent)

bm_coin_slots = bmesh.new()
for cx in (-0.038, 0.038):
    slot = box_bm((0.006, 0.004, 0.032), center=(cx, -0.17, 0.26), bevel=0.0005)
    L.append_bm(bm_coin_slots, slot)
finish_mesh("arcade_coin_slots", bm_coin_slots, MAT_EMIT_ORANGE, arcade_parent)

# ================================================================
# 5. ROOFTOP TELEMETRY & SATELLITE DISH (NEMUE Network Recon)
# ================================================================
print("Generating Rooftop Telemetry & Satellite Mast...")
tele_parent = L.empty("telemetry_dish", root, loc=(-0.62, 0.65, 1.15))

bm_mast = bmesh.new()
mast_h = 0.95
L.append_bm(bm_mast, cylinder_bm(0.022, mast_h, center=(0, 0, mast_h / 2), ns=14))
for ri in range(6):
    rz = 0.15 + ri * 0.14
    rung = cylinder_bm(0.006, 0.14, center=(0, 0, rz), ns=8)
    L.transform_bm(rung, Matrix.Rotation(math.radians(90), 4, 'Y'))
    L.append_bm(bm_mast, rung)
finish_mesh("antenna_mast", bm_mast, MAT_GRAPHITE, tele_parent)

bm_beacon = cylinder_bm(0.016, 0.035, center=(0, 0, mast_h + 0.02), ns=12)
finish_mesh("antenna_beacon", bm_beacon, MAT_EMIT_ORANGE, tele_parent)

bm_dish = bmesh.new()
dish_r = 0.24
prof = [(0.0, 0.0)]
for di in range(1, 14):
    u = di / 13.0
    r = u * dish_r
    z = (r * r) / (4.0 * 0.18)
    prof.append((r, z))
prof.append((dish_r + 0.008, prof[-1][1]))
prof.append((dish_r + 0.008, prof[-1][1] - 0.006))
prof.append((dish_r - 0.004, prof[-2][1] - 0.006))
prof.append((0.0, -0.01))

b_dish_mesh = L.lathe(prof, 24, uv=False)
L.transform_bm(b_dish_mesh, Matrix.Rotation(math.radians(40), 4, 'Y'))
L.transform_bm(b_dish_mesh, Matrix.Rotation(math.radians(-30), 4, 'Z'))
L.transform_bm(b_dish_mesh, Matrix.Translation(Vector((0.18, -0.15, 0.45))))
L.append_bm(bm_dish, b_dish_mesh)

horn_pts = [
    Vector((0.18, -0.15, 0.45)),
    Vector((0.30, -0.25, 0.58)),
]
L.rod(bm_dish, horn_pts, r=0.006, ns=8, caps=True)
finish_mesh("satellite_dish", bm_dish, MAT_ALU, tele_parent)

bm_feed = cylinder_bm(0.022, 0.025, center=(0.30, -0.25, 0.58), ns=12)
finish_mesh("dish_feed_horn", bm_feed, MAT_BRASS, tele_parent)

bm_solar_frames = bmesh.new()
bm_solar_cells = bmesh.new()
for sp, ang_y in ((-1, -0.16), (1, 0.16)):
    panel_c = Vector((ang_y, 0.14, 0.38))
    frame = box_bm((0.26, 0.36, 0.018), center=(0, 0, 0), bevel=0.003)
    L.transform_bm(frame, Matrix.Rotation(math.radians(35), 4, 'X'))
    L.transform_bm(frame, Matrix.Translation(panel_c))
    L.append_bm(bm_solar_frames, frame)
    cells = box_bm((0.24, 0.34, 0.004), center=(0, 0, 0.011), bevel=0.001)
    L.transform_bm(cells, Matrix.Rotation(math.radians(35), 4, 'X'))
    L.transform_bm(cells, Matrix.Translation(panel_c))
    L.append_bm(bm_solar_cells, cells)

finish_mesh("solar_panel_frames", bm_solar_frames, MAT_ALU, tele_parent)
finish_mesh("solar_panel_cells", bm_solar_cells, MAT_SOLAR_BLUE, tele_parent)

bm_droop_cables = bmesh.new()
cable_paths = [
    [Vector((-0.62, 0.65, 1.85)), Vector((-0.50, 0.50, 1.35)), Vector((-0.42, 0.40, 1.18))],
    [Vector((-0.62, 0.65, 1.65)), Vector((-0.40, 0.30, 1.10)), Vector((-0.18, 0.20, 0.95))],
    [Vector((-0.62, 0.65, 1.45)), Vector((-0.75, 0.40, 0.90)), Vector((-0.68, 0.10, 0.70))],
    [Vector((-0.42, 0.40, 1.18)), Vector((-0.10, 0.10, 0.75)), Vector((0.15, 0.18, 0.60))],
]
for cp in cable_paths:
    L.rod(bm_droop_cables, cp, r=0.0045, ns=8, caps=True, step=0.03)
finish_mesh("draped_cables", bm_droop_cables, MAT_GRAPHITE)

# ================================================================
# 6. CYBERPUNK DIRECTIONAL STREET SIGNPOST (Jesse Zhou Inspired)
# Positioned proudly at front-left perimeter (-0.95, -0.65)
# ================================================================
print("Generating Cyberpunk Directional Street Signpost...")
signpost_parent = L.empty("signpost_rig", root, loc=(-0.96, -0.65, 0.155))

bm_pole = bmesh.new()
pole_h = 1.38
L.append_bm(bm_pole, cylinder_bm(0.048, 0.06, center=(0, 0, 0.03), ns=14))
L.append_bm(bm_pole, box_bm((0.045, 0.045, pole_h), center=(0, 0, pole_h / 2), bevel=0.003))
L.append_bm(bm_pole, box_bm((0.40, 0.035, 0.035), center=(0, 0, pole_h - 0.06), bevel=0.002))
L.append_bm(bm_pole, box_bm((0.09, 0.09, 0.04), center=(0, 0, pole_h + 0.02), bevel=0.004))
finish_mesh("signpost_pole", bm_pole, MAT_GRAPHITE, signpost_parent)

bm_lanterns = bmesh.new()
for lx in (-0.18, 0.18):
    globe = cylinder_bm(0.048, 0.075, center=(lx, 0, pole_h - 0.12), ns=16)
    L.append_bm(bm_lanterns, globe)
finish_mesh("signpost_lanterns", bm_lanterns, MAT_EMIT_WARM, signpost_parent)

# 4 Interactive Directional Arrow Signs pointing across the scene
sign_defs = [
    {
        "id": "sign_lab",
        "text": "// CAMPUS LAB",
        "z": 0.92,
        "rot_z": 55,       # Points towards Server Rack
        "color": MAT_EMIT_CYAN,
        "dir": 1
    },
    {
        "id": "sign_forensics",
        "text": "// FORENSICS",
        "z": 0.74,
        "rot_z": 20,       # Points towards Arcade
        "color": MAT_EMIT_ORANGE,
        "dir": 1
    },
    {
        "id": "sign_creative",
        "text": "// 3D CRAFT",
        "z": 0.56,
        "rot_z": -15,      # Points towards Workstation
        "color": MAT_EMIT_GREEN,
        "dir": 1
    },
    {
        "id": "sign_contact",
        "text": "// DOSSIER",
        "z": 0.38,
        "rot_z": -50,      # Points towards Entrance / Stairs
        "color": MAT_EMIT_MAGENTA,
        "dir": 1
    },
]

for s in sign_defs:
    s_obj = L.empty(s["id"], signpost_parent, loc=(0, 0, s["z"]))
    s_obj.rotation_euler = (0, 0, math.radians(s["rot_z"]))
    
    bm_arrow_plate = bmesh.new()
    sw, sh, sd = 0.34, 0.082, 0.018
    arrow_offset = 0.17 * s["dir"]
    L.append_bm(bm_arrow_plate, box_bm((sw, sh, sd), center=(arrow_offset, 0, 0), bevel=0.003))
    tip = cylinder_bm(0.042, sd, center=(arrow_offset + 0.17 * s["dir"], 0, 0), ns=3)
    L.transform_bm(tip, Matrix.Rotation(math.radians(90 if s["dir"] > 0 else -90), 4, 'Z'))
    L.append_bm(bm_arrow_plate, tip)
    finish_mesh(f"{s['id']}_plate", bm_arrow_plate, MAT_GRAPHITE, s_obj)
    
    bm_arrow_border = bmesh.new()
    border_pts = [
        Vector((arrow_offset - 0.17 * s["dir"], -sh/2, 0)),
        Vector((arrow_offset + 0.16 * s["dir"], -sh/2, 0)),
        Vector((arrow_offset + 0.21 * s["dir"], 0, 0)),
        Vector((arrow_offset + 0.16 * s["dir"], sh/2, 0)),
        Vector((arrow_offset - 0.17 * s["dir"], sh/2, 0)),
        Vector((arrow_offset - 0.17 * s["dir"], -sh/2, 0)),
    ]
    L.rod(bm_arrow_border, border_pts, r=0.0035, ns=8, caps=False)
    finish_mesh(f"{s['id']}_border", bm_arrow_border, s["color"], s_obj)
    
    bm_label = text_bm(s["text"], size=0.030, depth=0.006)
    L.transform_bm(bm_label, Matrix.Rotation(math.radians(90), 4, 'X'))
    L.transform_bm(bm_label, Matrix.Translation(Vector((arrow_offset, -sd/2 - 0.004, 0))))
    finish_mesh(f"{s['id']}_text", bm_label, s["color"], s_obj)

# ================================================================
# 7. MAIN REAR NEON MARQUEE & TELEMETRY TICKER
# ================================================================
print("Generating Rear Neon Marquee & Outpost Canopy...")
canopy_parent = L.empty("canopy_rig", root, loc=(0.0, 1.08, 0.155))

bm_truss = bmesh.new()
tw, th_frame = 2.1, 1.25
L.append_bm(bm_truss, box_bm((tw, 0.06, 0.06), center=(0, 0, th_frame), bevel=0.004))
for vx in (-tw/2 + 0.1, tw/2 - 0.1):
    stanchion = box_bm((0.06, 0.06, th_frame), center=(vx, 0, th_frame / 2), bevel=0.004)
    L.append_bm(bm_truss, stanchion)
finish_mesh("canopy_truss", bm_truss, MAT_GRAPHITE, canopy_parent)

bm_neon_backing = box_bm((0.96, 0.03, 0.16), center=(0, -0.04, th_frame + 0.11), bevel=0.004)
finish_mesh("neon_sign_housing", bm_neon_backing, MAT_BASE, canopy_parent)

bm_neon_text = text_bm("SUPUN // SEC-LAB 01", size=0.054, depth=0.012)
L.transform_bm(bm_neon_text, Matrix.Rotation(math.radians(90), 4, 'X'))
L.transform_bm(bm_neon_text, Matrix.Translation(Vector((0, -0.06, th_frame + 0.10))))
finish_mesh("neon_sign_text", bm_neon_text, MAT_EMIT_CYAN, canopy_parent)

bm_neon_tube = bmesh.new()
tube_pts = [
    Vector((-0.46, -0.06, th_frame + 0.04)),
    Vector((0.46, -0.06, th_frame + 0.04)),
    Vector((0.46, -0.06, th_frame + 0.18)),
    Vector((-0.46, -0.06, th_frame + 0.18)),
    Vector((-0.46, -0.06, th_frame + 0.04)),
]
L.rod(bm_neon_tube, tube_pts, r=0.004, ns=8, caps=False)
finish_mesh("neon_sign_tube", bm_neon_tube, MAT_EMIT_ORANGE, canopy_parent)

bm_ticker_bar = box_bm((1.46, 0.024, 0.055), center=(0, -0.03, th_frame - 0.14), bevel=0.002)
finish_mesh("ticker_bar_housing", bm_ticker_bar, MAT_GRAPHITE, canopy_parent)

bm_ticker_txt = text_bm("SYS:ONLINE // ETH0:10GbE // PKTS:2.4M/s // OIDC:LOCKED", size=0.024, depth=0.004)
L.transform_bm(bm_ticker_txt, Matrix.Rotation(math.radians(90), 4, 'X'))
L.transform_bm(bm_ticker_txt, Matrix.Translation(Vector((0, -0.045, th_frame - 0.14))))
finish_mesh("ticker_bar_text", bm_ticker_txt, MAT_EMIT_GREEN, canopy_parent)

bm_conduit_box = bmesh.new()
L.append_bm(bm_conduit_box, box_bm((0.24, 0.14, 0.32), center=(0.68, -0.02, 0.55), bevel=0.006))
finish_mesh("conduit_transformer_box", bm_conduit_box, MAT_GRAPHITE, canopy_parent)

bm_conduit_pipes = bmesh.new()
pipe_pts = [
    Vector((0.68, -0.02, 0.39)),
    Vector((0.68, -0.02, 0.08)),
    Vector((0.35, -0.02, 0.08)),
]
L.rod(bm_conduit_pipes, pipe_pts, r=0.012, ns=10, caps=True)
finish_mesh("conduit_pipes", bm_conduit_pipes, MAT_ALU, canopy_parent)

# ================================================================
# 8. RAYTRACED VERTEX AMBIENT OCCLUSION BAKING & EXPORT
# ================================================================
all_meshes = L.meshes_under(root)
print(f"Total objects created: {len(all_meshes)} meshes ({L.tris(all_meshes)} triangles)")

print("Baking ray-traced ambient occlusion into vertex colours...")
L.bake_ao(all_meshes, rays=24, dist=0.35, strength=0.82)
print("Ambient occlusion baking complete!")

raw_path = os.path.join(OUT, "diorama.raw.glb")
print(f"Exporting raw GLB to {raw_path}...")
size = L.export_glb(raw_path)
print(f"Successfully exported raw GLB: {size / 1024:.1f} KB")
