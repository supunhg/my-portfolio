"""
Unit-01: The Physical System Unit for Supun Hewagamage.
Designed with Teenage Engineering / Dieter Rams / High-Assurance Systems aesthetics.

Run inside Blender or headless:
    blender -b -P build_machine.py
Writes ../out/unit01.raw.glb
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
L.setup("SC Unit-01", CACHE)

# Materials palette: Warm Minimalist Industrial Luxe
MAT_CHALK = material("chalk", color="#ebe9e1", rough=0.35, metal=0.05, coat=0.1)
MAT_CHASSIS_BASE = material("base", color="#24262b", rough=0.45, metal=0.2)
MAT_ALU = material("alu", color="#d4d7db", rough=0.25, metal=0.85)
MAT_DARK_METAL = material("dark_metal", color="#1a1c20", rough=0.3, metal=0.75)
MAT_ORANGE = material("orange", color="#ff5a1f", rough=0.35, metal=0.1, coat=0.2)
MAT_BRASS = material("brass", color="#d8a858", rough=0.2, metal=0.88)
MAT_GLASS = material("glass", color="#0e1114", rough=0.08, metal=0.1, coat=0.8)
MAT_RUBBER = material("rubber", color="#121315", rough=0.8, metal=0.0)
MAT_EMIT_GREEN = material("emit_green", color="#10b981", rough=0.2, emit="#10b981", emit_strength=2.5)
MAT_EMIT_AMBER = material("emit_amber", color="#f59e0b", rough=0.2, emit="#f59e0b", emit_strength=2.5)
MAT_EMIT_BLUE = material("emit_blue", color="#3b82f6", rough=0.2, emit="#3b82f6", emit_strength=2.5)

root = L.empty("unit01")

# Helper functions
def box_bm(size, center=(0, 0, 0), bevel=0.004, segs=2):
    return L.box(size, center, bevel=bevel, segs=segs)

def disc_bm(r, thick, center=(0, 0, 0), ns=24):
    prof = [(0.0, thick / 2), (r - 0.002, thick / 2), (r, thick / 2 - 0.002), (r, -thick / 2 + 0.002), (r - 0.002, -thick / 2), (0.0, -thick / 2)]
    b = L.lathe(prof, ns, uv=False)
    L.transform_bm(b, Matrix.Translation(center))
    return b

def finish_mesh(name, bm, mat, parent=root):
    ob = L.new_obj(name, bm, mat, parent)
    L.set_col(ob, lambda p: hexc("#ffffff"))
    return ob

# 1. Chassis Base (Dark alloy subframe with rubber feet)
bm_base = box_bm((0.34, 0.22, 0.024), center=(0, 0, 0.012), bevel=0.005)
finish_mesh("chassis_base", bm_base, MAT_CHASSIS_BASE)

# Rubber feet
bm_feet = bmesh.new()
for fx in (-0.14, 0.14):
    for fy in (-0.085, 0.085):
        f = disc_bm(0.012, 0.005, center=(fx, fy, -0.002), ns=16)
        L.append_bm(bm_feet, f)
finish_mesh("feet", bm_feet, MAT_RUBBER)

# 2. Chassis Top Shell (Premium chalk / bone-white unibody enclosure)
bm_top = box_bm((0.336, 0.216, 0.038), center=(0, 0, 0.043), bevel=0.006)
finish_mesh("chassis_top", bm_top, MAT_CHALK)

# 3. Rear Heatsink Fins (Machined architectural cooling block)
bm_heatsink = bmesh.new()
for i in range(14):
    hx = -0.13 + i * 0.02
    fin = box_bm((0.004, 0.018, 0.026), center=(hx, 0.116, 0.038), bevel=0.001)
    L.append_bm(bm_heatsink, fin)
finish_mesh("heatsink_rear", bm_heatsink, MAT_DARK_METAL)

# 4. Display Bezel & High-Contrast OLED Screen
# The recessed display housing
bm_disp_bezel = box_bm((0.14, 0.09, 0.004), center=(-0.08, 0.045, 0.063), bevel=0.002)
finish_mesh("display_bezel", bm_disp_bezel, MAT_DARK_METAL)

bm_disp_screen = box_bm((0.132, 0.082, 0.002), center=(-0.08, 0.045, 0.065), bevel=0.001)
finish_mesh("display_screen", bm_disp_screen, MAT_GLASS)

# 5. Precision Milled Ventilation Slots (Right panel top)
bm_vents = bmesh.new()
for row in range(5):
    vy = 0.025 + row * 0.016
    vent = box_bm((0.085, 0.005, 0.002), center=(0.09, vy, 0.063), bevel=0.001)
    L.append_bm(bm_vents, vent)
finish_mesh("vent_grille", bm_vents, MAT_DARK_METAL)

# 6. Rotary Control Dials
# Main Dial (Knurled aluminum with orange index notch)
bm_dial_main = disc_bm(0.026, 0.018, center=(0.11, -0.045, 0.071), ns=32)
finish_mesh("knob_main", bm_dial_main, MAT_ALU)

bm_dial_notch = box_bm((0.004, 0.014, 0.003), center=(0.11, -0.038, 0.081), bevel=0.0005)
finish_mesh("knob_main_index", bm_dial_notch, MAT_ORANGE)

# Auxiliary Dial (Machined brass fine-adjustment dial)
bm_dial_aux = disc_bm(0.016, 0.014, center=(0.045, -0.045, 0.069), ns=24)
finish_mesh("knob_aux", bm_dial_aux, MAT_BRASS)

# 7. Tactile Chiclet Keys (Key 1..4)
key_x = [-0.13, -0.095, -0.06, -0.025]
key_mats = [MAT_CHALK, MAT_DARK_METAL, MAT_ALU, MAT_ORANGE]

for i, (kx, km) in enumerate(zip(key_x, key_mats)):
    bm_key = box_bm((0.026, 0.026, 0.012), center=(kx, -0.045, 0.068), bevel=0.002)
    finish_mesh(f"key_{i+1}", bm_key, km)

# 8. Metal Toggle Switch
bm_toggle_base = disc_bm(0.008, 0.006, center=(0.13, 0.03, 0.065), ns=16)
L.append_bm(bm_toggle_base, box_bm((0.004, 0.004, 0.018), center=(0.13, 0.03, 0.074), bevel=0.001))
finish_mesh("switch_toggle", bm_toggle_base, MAT_DARK_METAL)

# 9. Modular Project Cartridges (NIBM Lab, Filo, Nemue)
# Cartridge 01: NIBM Campus Lab (with status LEDs)
bm_cart_lab = box_bm((0.065, 0.032, 0.016), center=(-0.09, -0.085, 0.066), bevel=0.002)
# Handle bar on the cartridge
L.append_bm(bm_cart_lab, box_bm((0.045, 0.006, 0.006), center=(-0.09, -0.097, 0.072), bevel=0.001))
finish_mesh("cartridge_lab", bm_cart_lab, MAT_DARK_METAL)

# Micro status LEDs on Cartridge 01
bm_leds = bmesh.new()
L.append_bm(bm_leds, disc_bm(0.002, 0.002, center=(-0.105, -0.076, 0.075), ns=10))
finish_mesh("led_lab_green", bm_leds, MAT_EMIT_GREEN)

bm_leds_a = bmesh.new()
L.append_bm(bm_leds_a, disc_bm(0.002, 0.002, center=(-0.09, -0.076, 0.075), ns=10))
finish_mesh("led_lab_amber", bm_leds_a, MAT_EMIT_AMBER)

bm_leds_b = bmesh.new()
L.append_bm(bm_leds_b, disc_bm(0.002, 0.002, center=(-0.075, -0.076, 0.075), ns=10))
finish_mesh("led_lab_blue", bm_leds_b, MAT_EMIT_BLUE)

# Cartridge 02: Filo (Go Forensic Core)
bm_cart_filo = box_bm((0.065, 0.032, 0.016), center=(-0.015, -0.085, 0.066), bevel=0.002)
# Window track
L.append_bm(bm_cart_filo, box_bm((0.04, 0.012, 0.002), center=(-0.015, -0.085, 0.075), bevel=0.001))
finish_mesh("cartridge_filo", bm_cart_filo, MAT_ALU)

# Cartridge 03: Nemue (Rust Recon Suite with brass waveguide)
bm_cart_nemue = box_bm((0.065, 0.032, 0.016), center=(0.06, -0.085, 0.066), bevel=0.002)
# Mini brass ring antenna
L.append_bm(bm_cart_nemue, disc_bm(0.008, 0.004, center=(0.06, -0.085, 0.076), ns=16))
finish_mesh("cartridge_nemue", bm_cart_nemue, MAT_BRASS)

# 10. Ambient Occlusion Baking onto Vertex Colours
all_meshes = L.meshes_under(root)
print(f"Baking ambient occlusion across {len(all_meshes)} meshes ({L.tris(all_meshes)} triangles)...")
L.bake_ao(all_meshes, rays=24, dist=0.15, strength=0.75)

# 11. GLB Export
raw_path = os.path.join(OUT, "unit01.raw.glb")
size = L.export_glb(raw_path)
print(f"Exported raw GLB to {raw_path} ({size / 1024:.1f} KB)")
