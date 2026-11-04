"""
Supercub Blender toolkit: shared helpers for the procedural asset scripts.

Import from a build script that lives next to this file:
    import sys, importlib; sys.path.insert(0, HERE); import sclib; importlib.reload(sclib)
    sclib.setup("SC Mise ramen", CACHE)
Works inside a live Blender session (MCP add-on) and headless (blender -b -P ...).
"""

import bmesh
import bpy
import contextlib
import math
import os

import numpy as np
from mathutils import Matrix, Vector, noise
from mathutils.bvhtree import BVHTree

P = "sc_"  # prefix for every datablock the scripts own
SC = None
CACHE = None
TEX_STATS = {}


# ---------------------------------------------------------------- scene


def setup(scene_name, cache_dir):
    """Fresh, empty scene for this build (the user's own scenes are left alone)."""
    global SC, CACHE
    CACHE = cache_dir
    os.makedirs(CACHE, exist_ok=True)
    if bpy.app.background:
        SC = bpy.context.scene
    else:
        SC = bpy.data.scenes.get(scene_name) or bpy.data.scenes.new(scene_name)
        bpy.context.window_manager.windows[0].scene = SC
    for o in list(SC.collection.all_objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.lights, bpy.data.cameras, bpy.data.worlds):
        for b in list(coll):
            if b.name.startswith(P) and b.users == 0:
                coll.remove(b)
    TEX_STATS.clear()
    return SC


def ctx():
    if bpy.app.background:
        return contextlib.nullcontext()
    return bpy.context.temp_override(window=bpy.context.window_manager.windows[0], scene=SC)


def three(x, y, z):
    """three.js / glTF (Y-up) coordinates -> Blender (Z-up). The exporter maps them back."""
    return Vector((x, -z, y))


# ---------------------------------------------------------------- colour + noise


def hexc(h):
    return np.array([int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)], np.float32)


def lin(c):
    c = np.asarray(c, np.float32)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def mix(a, b, t):
    """Lerp colours; a scalar or per-pixel/per-vertex t broadcasts over RGB."""
    a = np.asarray(a, np.float32)
    b = np.asarray(b, np.float32)
    t = np.asarray(t, np.float32)
    if t.ndim >= 1 and (a.shape[-1:] == (3,) or b.shape[-1:] == (3,)) and t.shape[-1:] != (3,):
        t = t[..., None]
    return a + (b - a) * t


def clamp01(x):
    return np.clip(x, 0.0, 1.0)


def smooth(a, b, x):
    t = clamp01((np.asarray(x, np.float32) - a) / (b - a))
    return t * t * (3 - 2 * t)


def _hash(i, j, seed):
    n = (i * 374761393 + j * 668265263 + seed * 1442695041) & 0xFFFFFFFF
    n = ((n ^ (n >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((n ^ (n >> 16)) & 0xFFFF) / 65535.0


def vnoise(x, y, seed=0):
    """Smooth value noise on numpy arrays, 0..1."""
    xi = np.floor(x).astype(np.int64)
    yi = np.floor(y).astype(np.int64)
    xf = x - xi
    yf = y - yi
    u = xf * xf * (3 - 2 * xf)
    v = yf * yf * (3 - 2 * yf)
    a = _hash(xi, yi, seed)
    b = _hash(xi + 1, yi, seed)
    c = _hash(xi, yi + 1, seed)
    d = _hash(xi + 1, yi + 1, seed)
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v


def fbm(x, y, octaves=4, seed=0):
    total, amp, freq, norm = 0.0, 0.5, 1.0, 0.0
    for o in range(octaves):
        total = total + amp * vnoise(x * freq, y * freq, seed + o * 31)
        norm += amp
        amp *= 0.5
        freq *= 2.0
    return total / norm


def n3(p, scale=1.0):
    """Blender Perlin noise at a point, -1..1."""
    return noise.noise(Vector(tuple(float(c) * scale for c in p)))


def normal_map(H, strength):
    """Tangent-space (OpenGL, +Y up) normal map from a height field whose rows run along +V."""
    gy, gx = np.gradient(H.astype(np.float32))
    n = np.stack([-gx * strength, -gy * strength, np.ones_like(H)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return n * 0.5 + 0.5


def grid_uv(w, h):
    """Pixel-centre UV coordinates (U right, V up) for a w x h texture."""
    u = (np.arange(w) + 0.5) / w
    v = (np.arange(h) + 0.5) / h
    return np.meshgrid(u, v)


def save_image(name, rgb, srgb=True):
    h, w = rgb.shape[:2]
    TEX_STATS[name] = [w, h, round(float(np.nanmean(rgb)), 3), int(np.isnan(rgb).sum())]
    old = bpy.data.images.get(P + name)
    if old:
        bpy.data.images.remove(old)
    img = bpy.data.images.new(P + name, w, h, alpha=False)
    # colour space first: changing it later makes Blender regenerate a blank buffer
    img.colorspace_settings.name = "sRGB" if srgb else "Non-Color"
    rgba = np.ones((h, w, 4), np.float32)
    rgba[..., :3] = np.clip(np.nan_to_num(rgb), 0, 1)
    img.pixels.foreach_set(rgba.ravel())
    img.filepath_raw = os.path.join(CACHE, name + ".png")
    img.file_format = "PNG"
    img.save()
    return img


# ---------------------------------------------------------------- materials


def material(name, color="#ffffff", rough=0.5, metal=0.0, coat=0.0, coat_rough=0.05, sheen=0.0, sheen_tint="#ffffff",
             base_img=None, normal_img=None, normal_strength=1.0, rough_img=None, double=False, vcol=False,
             emit=None, emit_strength=0.0, vcol_alpha=False):
    m = bpy.data.materials.new(P + name)
    if m.node_tree is None:
        m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = next((n for n in nodes if n.type == "BSDF_PRINCIPLED"), None) or nodes.new("ShaderNodeBsdfPrincipled")
    out = next((n for n in nodes if n.type == "OUTPUT_MATERIAL"), None) or nodes.new("ShaderNodeOutputMaterial")
    if not out.inputs["Surface"].is_linked:
        links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    bsdf.inputs["Base Color"].default_value = (*lin(hexc(color)), 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Coat Weight"].default_value = coat
    bsdf.inputs["Coat Roughness"].default_value = coat_rough
    if sheen:
        bsdf.inputs["Sheen Weight"].default_value = sheen
        bsdf.inputs["Sheen Tint"].default_value = (*lin(hexc(sheen_tint)), 1.0)
    if emit:
        bsdf.inputs["Emission Color"].default_value = (*lin(hexc(emit)), 1.0)
        bsdf.inputs["Emission Strength"].default_value = emit_strength
    if base_img is not None:
        t = nodes.new("ShaderNodeTexImage")
        t.image = base_img
        links.new(t.outputs["Color"], bsdf.inputs["Base Color"])
    elif vcol:
        # colour lives in the "Col" attribute (tint x baked ambient occlusion)
        bsdf.inputs["Base Color"].default_value = (1, 1, 1, 1)
        ca = nodes.new("ShaderNodeVertexColor")
        ca.layer_name = "Col"
        links.new(ca.outputs["Color"], bsdf.inputs["Base Color"])
    if rough_img is not None:
        t = nodes.new("ShaderNodeTexImage")
        t.image = rough_img
        sep = nodes.new("ShaderNodeSeparateColor")
        links.new(t.outputs["Color"], sep.inputs["Color"])
        links.new(sep.outputs["Green"], bsdf.inputs["Roughness"])
    if normal_img is not None:
        t = nodes.new("ShaderNodeTexImage")
        t.image = normal_img
        nm = nodes.new("ShaderNodeNormalMap")
        nm.inputs["Strength"].default_value = normal_strength
        links.new(t.outputs["Color"], nm.inputs["Color"])
        links.new(nm.outputs["Normal"], bsdf.inputs["Normal"])
    if vcol_alpha:  # alpha comes from the colour attribute too (baked shadow decals)
        ca = next((n for n in nodes if n.type == "VERTEX_COLOR"), None) or nodes.new("ShaderNodeVertexColor")
        ca.layer_name = "Col"
        links.new(ca.outputs["Alpha"], bsdf.inputs["Alpha"])
        m.surface_render_method = "BLENDED"
    m.use_backface_culling = not double  # glTF doubleSided
    return m


# ---------------------------------------------------------------- objects + meshes


def link(ob, parent=None):
    SC.collection.objects.link(ob)
    if parent is not None:
        ob.parent = parent
    return ob


def empty(name, parent=None, loc=(0, 0, 0)):
    ob = bpy.data.objects.new(name, None)
    ob.empty_display_type = "PLAIN_AXES"
    ob.empty_display_size = 0.3
    ob.location = loc
    return link(ob, parent)


def new_obj(name, bm, mat, parent=None, smooth=True, recalc=True):
    if recalc:
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(P + name)
    bm.to_mesh(me)
    bm.free()
    if smooth:
        me.shade_smooth()
    me.materials.append(mat)
    return link(bpy.data.objects.new(name, me), parent)


def grid(pts, uv=None, bm=None, merge=True):
    """Quad grid from pts (rows, cols, 3). Coincident points (seams, poles) are welded,
    which turns collapsed rows into clean triangle fans while keeping per-corner UVs."""
    own = bm is None
    bm = bm or bmesh.new()
    uvl = bm.loops.layers.uv.get("UVMap") or (bm.loops.layers.uv.new("UVMap") if uv is not None else None)
    nr, nc = pts.shape[:2]
    vs = [[bm.verts.new(tuple(map(float, pts[i, j]))) for j in range(nc)] for i in range(nr)]
    for i in range(nr - 1):
        for j in range(nc - 1):
            idx = ((i, j), (i, j + 1), (i + 1, j + 1), (i + 1, j))
            try:
                f = bm.faces.new([vs[a][b] for a, b in idx])
            except ValueError:
                continue
            if uvl is not None and uv is not None:
                for loop, (a, b) in zip(f.loops, idx):
                    loop[uvl].uv = (float(uv[a, b, 0]), float(uv[a, b, 1]))
    if merge and own:
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    return bm


def frames(C):
    """Parallel-transport frames along a polyline."""
    T = np.gradient(C, axis=0)
    T /= np.linalg.norm(T, axis=1, keepdims=True)
    ref = np.array([0.0, 0.0, 1.0]) if abs(T[0][2]) < 0.9 else np.array([1.0, 0.0, 0.0])
    n = np.cross(T[0], ref)
    n /= np.linalg.norm(n)
    N = np.zeros_like(C)
    B = np.zeros_like(C)
    for i in range(len(C)):
        if i:
            n = n - np.dot(n, T[i]) * T[i]
            n /= np.linalg.norm(n)
        N[i] = n
        B[i] = np.cross(T[i], n)
    return T, N, B


def tube(center, radius, nt, ns, cap0=0.0, cap1=0.0, uv=True):
    """Tube along center(t), t in 0..1, with radius(t, angle). capN > 0 closes that end
    with a pole pushed out by capN along the tangent (0 = open)."""
    ts = np.linspace(0, 1, nt)
    C = np.array([center(t) for t in ts], np.float64)
    T, N, B = frames(C)
    th = np.linspace(0, 2 * np.pi, ns + 1)
    rows, uvs = [], []
    if cap0:
        rows.append(np.repeat((C[0] - T[0] * cap0)[None], ns + 1, 0))
        uvs.append(np.stack([th / (2 * np.pi), np.zeros(ns + 1)], 1))
    for i, t in enumerate(ts):
        row = np.array([C[i] + radius(t, a % (2 * np.pi)) * (math.cos(a) * N[i] + math.sin(a) * B[i]) for a in th])
        rows.append(row)
        uvs.append(np.stack([th / (2 * np.pi), np.full(ns + 1, t)], 1))
    if cap1:
        rows.append(np.repeat((C[-1] + T[-1] * cap1)[None], ns + 1, 0))
        uvs.append(np.stack([th / (2 * np.pi), np.ones(ns + 1)], 1))
    return grid(np.array(rows), np.array(uvs) if uv else None), C, T, N, B


def path(points):
    """Catmull-Rom curve through points; returns C(t), t in 0..1."""
    P = np.array(points, float)
    n = len(P) - 1

    def C(t):
        x = min(max(t, 0.0) * n, n - 1e-9)
        i = int(x)
        f = x - i
        p0, p1, p2, p3 = P[max(i - 1, 0)], P[i], P[i + 1], P[min(i + 2, n)]
        return 0.5 * (2 * p1 + (-p0 + p2) * f + (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f + (-p0 + 3 * p1 - 3 * p2 + p3) * f ** 3)

    return C


def rod(dst, points, r, ns=10, nt=None, caps=True, step=0.04):
    """Append a round rod along points (a smooth curve for 3+ points) to dst.
    `step` is the length of each segment along a curve (straight rods use one)."""
    P = np.array(points, float)
    length = float(np.sum(np.linalg.norm(np.diff(P, axis=0), axis=1)))
    nt = nt or (2 if len(P) == 2 else max(6, int(length / step)))
    b, *_ = tube(path(P), (lambda t, a: r) if not callable(r) else r, nt, ns, cap0=0.003 if caps else 0, cap1=0.003 if caps else 0, uv=False)
    append_bm(dst, b)


def lathe(profile, ns, uv=True, phase=0.0):
    """Revolve a profile [(r, z), ...] about +Z. V runs along the profile (0..1 by arc length).
    Rows with r == 0 become poles."""
    prof = np.array(profile, np.float64)
    seg = np.r_[0, np.cumsum(np.hypot(*np.diff(prof, axis=0).T))]
    vv = seg / seg[-1]
    th = np.linspace(0, 2 * np.pi, ns + 1) + phase
    pts = np.zeros((len(prof), ns + 1, 3))
    uvs = np.zeros((len(prof), ns + 1, 2))
    for i, (r, z) in enumerate(prof):
        pts[i, :, 0] = r * np.cos(th)
        pts[i, :, 1] = r * np.sin(th)
        pts[i, :, 2] = z
        uvs[i, :, 0] = (th - phase) / (2 * np.pi)
        uvs[i, :, 1] = vv[i]
    return grid(pts, uvs if uv else None)


def box(size, center=(0, 0, 0), bevel=0.0, segs=2):
    """A new bmesh holding one (optionally bevelled) box."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    sx, sy, sz = size
    for v in bm.verts:
        v.co = Vector((v.co.x * sx + center[0], v.co.y * sy + center[1], v.co.z * sz + center[2]))
    if bevel > 0:
        bmesh.ops.bevel(bm, geom=list(bm.edges) + list(bm.verts), offset=bevel, segments=segs, affect="EDGES", profile=0.5)
    return bm


def flip(bm):
    bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
    return bm


def append_bm(dst, src):
    """Append one bmesh into another (via a throwaway mesh)."""
    tmp = bpy.data.meshes.new(P + "tmp")
    src.to_mesh(tmp)
    src.free()
    dst.from_mesh(tmp)
    bpy.data.meshes.remove(tmp)


def transform_bm(bm, mat, verts=None):
    bmesh.ops.transform(bm, matrix=mat, verts=list(verts) if verts is not None else bm.verts[:])


def set_col(ob, fn, alpha=None):
    """Per-vertex sRGB colour from fn(local position) -> stored linear in 'Col'.
    `alpha` (optional) is a per-vertex array for the alpha channel."""
    me = ob.data
    cols = np.array([lin(fn(np.array(v.co))) for v in me.vertices], np.float32)
    attr = me.color_attributes.get("Col") or me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    rgba = np.ones((len(cols), 4), np.float32)
    rgba[:, :3] = cols
    if alpha is not None:
        rgba[:, 3] = alpha
    attr.data.foreach_set("color", rgba.ravel())
    me.color_attributes.active_color = attr
    me.color_attributes.render_color_index = me.color_attributes.active_color_index


def _hemisphere(n):
    i = np.arange(n) + 0.5
    phi = np.arcsin(np.sqrt(i / n))  # cosine-weighted
    th = np.pi * (1 + 5 ** 0.5) * i
    return np.stack([np.cos(th) * np.sin(phi), np.sin(th) * np.sin(phi), np.cos(phi)], 1)


def bvh_of(objs):
    SC.view_layers[0].update()
    verts, polys, off = [], [], 0
    for o in objs:
        mw = o.matrix_world
        verts += [mw @ v.co for v in o.data.vertices]
        polys += [[off + i for i in p.vertices] for p in o.data.polygons]
        off += len(o.data.vertices)
    return BVHTree.FromPolygons(verts, polys)


def bake_ao(objs, rays=32, dist=0.35, strength=0.85, occluders=None):
    """Ray-traced ambient occlusion multiplied into each object's 'Col' attribute.
    `occluders` (default: objs) are the meshes that can shadow them."""
    bvh = bvh_of(occluders or objs)
    D = _hemisphere(rays)
    for o in objs:
        me = o.data
        mw = o.matrix_world
        nmx = mw.to_3x3().inverted().transposed()
        ao = np.ones(len(me.vertices), np.float32)
        for v in me.vertices:
            p = mw @ v.co
            n = (nmx @ v.normal).normalized()
            t = n.orthogonal().normalized()
            b = n.cross(t)
            org = p + n * 0.002
            occ = 0.0
            for d in D:
                hit = bvh.ray_cast(org, t * float(d[0]) + b * float(d[1]) + n * float(d[2]), dist)
                if hit[0] is not None:
                    occ += 1.0 - hit[3] / dist
            ao[v.index] = 1.0 - strength * occ / rays
        attr = me.color_attributes.get("Col")
        cur = np.ones(len(me.vertices) * 4, np.float32)
        if attr:
            attr.data.foreach_get("color", cur)
        cur = cur.reshape(-1, 4)
        cur[:, :3] *= ao[:, None]
        if not attr:
            attr = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
        attr.data.foreach_set("color", cur.ravel())
        me.color_attributes.active_color = attr


def tris(objs):
    total = 0
    for o in objs:
        if o.type == "MESH":
            o.data.calc_loop_triangles()
            total += len(o.data.loop_triangles)
    return total


def meshes_under(root):
    return [o for o in [root, *root.children_recursive] if o.type == "MESH"]


# ---------------------------------------------------------------- export + preview


def export_glb(path):
    with ctx():
        bpy.ops.export_scene.gltf(
            filepath=path, export_format="GLB", use_active_scene=True, export_apply=True, export_yup=True,
            export_cameras=False, export_lights=False, export_extras=False, export_vertex_color="ACTIVE",
            export_materials="EXPORT", export_image_format="AUTO",
        )
    return os.path.getsize(path)


def preview(path, cam_loc, look_at, lens=50, res=(1600, 900), world="#f4eee4", strength=0.9,
            lights=((3.5, -5.0, 6.0, 900, 3.0, "#fff1dc"), (-4.5, 4.0, 3.5, 350, 2.5, "#ffffff")), ortho=0.0):
    """Quick EEVEE render for review (camera, lights and world are not exported)."""
    world_d = bpy.data.worlds.new(P + "world")
    SC.world = world_d
    if world_d.node_tree is None:
        world_d.use_nodes = True
    bg = next(n for n in world_d.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (*lin(hexc(world)), 1)
    bg.inputs["Strength"].default_value = strength
    for i, (x, y, z, energy, size, colr) in enumerate(lights):
        ld = bpy.data.lights.new(P + f"light{i}", "AREA")
        ld.energy, ld.size, ld.color = energy, size, tuple(lin(hexc(colr)))
        lo = link(bpy.data.objects.new(P + f"light{i}", ld))
        lo.location = (x, y, z)
        lo.rotation_euler = (Vector(look_at) - Vector((x, y, z))).to_track_quat("-Z", "Y").to_euler()
    cd = bpy.data.cameras.new(P + "cam")
    if ortho:
        cd.type = "ORTHO"
        cd.ortho_scale = ortho
    else:
        cd.lens = lens
    cam = link(bpy.data.objects.new(P + "cam", cd))
    cam.location = cam_loc
    cam.rotation_euler = (Vector(look_at) - Vector(cam_loc)).to_track_quat("-Z", "Y").to_euler()
    SC.camera = cam
    SC.render.engine = "BLENDER_EEVEE"
    SC.render.resolution_x, SC.render.resolution_y = res
    SC.render.film_transparent = False
    SC.view_settings.view_transform = "Standard"
    SC.render.filepath = path
    with ctx():
        bpy.ops.render.render(write_still=True, scene=SC.name)
    return path
