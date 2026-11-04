import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { audio } from "../audio";

const MODEL_PATH = "/models/unit01.glb?v=1";

export type PartHit =
  | { type: "knob_main" }
  | { type: "knob_aux" }
  | { type: "key"; index: number }
  | { type: "cartridge"; id: "lab" | "filo" | "nemue" }
  | { type: "screen" }
  | { type: "switch" }
  | null;

export class UnitModel {
  readonly root = new THREE.Group();
  readonly meshes: Map<string, THREE.Mesh> = new Map();
  private originalPositions: Map<string, THREE.Vector3> = new Map();
  private originalRotations: Map<string, THREE.Euler> = new Map();

  // Interactive states
  public explodeFactor: number = 0; // 0 = assembled, 1 = fully exploded
  public knobAngleMain: number = 0;
  public knobAngleAux: number = 0;
  public keyPressed: [number, number, number, number] = [0, 0, 0, 0]; // key 1..4 press depth
  public activeCartridge: "lab" | "filo" | "nemue" | null = null;
  public switchState: boolean = true;

  static async load(onProgress?: (ratio: number) => void): Promise<UnitModel> {
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);

    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        MODEL_PATH,
        resolve,
        (evt) => {
          if (evt.total) onProgress?.(evt.loaded / evt.total);
        },
        reject
      );
    });

    return new UnitModel(gltf);
  }

  private constructor(gltf: GLTF) {
    this.root.name = "Unit01_Root";

    gltf.scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Clean name (Blender prefix often attaches 'sc_')
        const name = mesh.name.replace(/^sc_/, "");
        this.meshes.set(name, mesh);
        this.originalPositions.set(name, mesh.position.clone());
        this.originalRotations.set(name, mesh.rotation.clone());

        // Material enhancement
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone();
          mat.roughness = Math.max(mat.roughness, 0.25);
          mesh.material = mat;
        }
      }
    });

    this.root.add(gltf.scene);

    // Initial scale and centering
    this.root.scale.set(1.4, 1.4, 1.4);
    this.root.position.set(0, -0.04, 0);
  }

  /**
   * Updates animations per frame (smoothing springs, explode interpolation, knob rotation)
   */
  public update(delta: number) {
    const d = Math.min(delta, 0.05);

    // 1. Knob rotations
    const knobMain = this.meshes.get("knob_main");
    const knobMainIndex = this.meshes.get("knob_main_index");
    if (knobMain) {
      knobMain.rotation.y = this.knobAngleMain;
      if (knobMainIndex) knobMainIndex.rotation.y = this.knobAngleMain;
    }

    const knobAux = this.meshes.get("knob_aux");
    if (knobAux) {
      knobAux.rotation.y = this.knobAngleAux;
    }

    // 2. Key presses (spring back to 0)
    for (let i = 1; i <= 4; i++) {
      const keyMesh = this.meshes.get(`key_${i}`);
      const orig = this.originalPositions.get(`key_${i}`);
      if (keyMesh && orig) {
        const targetDepth = this.keyPressed[i - 1] * 0.006;
        keyMesh.position.y = orig.y - targetDepth + (this.explodeFactor * 0.06);
        // decay press
        this.keyPressed[i - 1] = Math.max(0, this.keyPressed[i - 1] - d * 12);
      }
    }

    // 3. Exploded View offsets
    // Top shell & bezel components lift upwards
    const topLift = this.explodeFactor * 0.04;
    const controlsLift = this.explodeFactor * 0.07;
    const heatsinkPush = this.explodeFactor * 0.05;

    const topParts = ["chassis_top", "display_bezel", "display_screen", "vent_grille"];
    topParts.forEach((name) => {
      const mesh = this.meshes.get(name);
      const orig = this.originalPositions.get(name);
      if (mesh && orig) {
        mesh.position.y = orig.y + topLift;
      }
    });

    const controlParts = ["knob_main", "knob_main_index", "knob_aux", "switch_toggle"];
    controlParts.forEach((name) => {
      const mesh = this.meshes.get(name);
      const orig = this.originalPositions.get(name);
      if (mesh && orig) {
        mesh.position.y = orig.y + controlsLift;
      }
    });

    const heatsink = this.meshes.get("heatsink_rear");
    const hsOrig = this.originalPositions.get("heatsink_rear");
    if (heatsink && hsOrig) {
      heatsink.position.z = hsOrig.z - heatsinkPush;
    }

    // Cartridges lift and slide forward when selected or exploded
    const carts = [
      { id: "lab", names: ["cartridge_lab", "led_lab_green", "led_lab_amber", "led_lab_blue"] },
      { id: "filo", names: ["cartridge_filo"] },
      { id: "nemue", names: ["cartridge_nemue"] },
    ] as const;

    carts.forEach(({ id, names }) => {
      const isSelected = this.activeCartridge === id;
      const cartPop = isSelected ? 0.025 : 0;
      const cartZ = isSelected ? 0.035 : 0;

      names.forEach((name) => {
        const mesh = this.meshes.get(name);
        const orig = this.originalPositions.get(name);
        if (mesh && orig) {
          mesh.position.y = orig.y + controlsLift + cartPop;
          mesh.position.z = orig.z + cartZ;
        }
      });
    });
  }

  /**
   * Interact with part
   */
  public interactWith(hit: PartHit) {
    if (!hit) return;

    if (hit.type === "key") {
      this.keyPressed[hit.index] = 1.0;
      audio.click();
    } else if (hit.type === "knob_main") {
      this.knobAngleMain += Math.PI / 6;
      audio.dialTick();
    } else if (hit.type === "knob_aux") {
      this.knobAngleAux -= Math.PI / 8;
      audio.dialTick();
    } else if (hit.type === "switch") {
      this.switchState = !this.switchState;
      const toggle = this.meshes.get("switch_toggle");
      if (toggle) {
        toggle.rotation.x = this.switchState ? 0.2 : -0.2;
      }
      audio.switchSnap();
    } else if (hit.type === "cartridge") {
      this.activeCartridge = this.activeCartridge === hit.id ? null : hit.id;
      audio.chime();
    } else if (hit.type === "screen") {
      audio.click();
    }
  }

  /**
   * Raycast from mouse coordinate (NDC -1..1)
   */
  public raycast(raycaster: THREE.Raycaster): PartHit {
    const hits = raycaster.intersectObjects(Array.from(this.meshes.values()), false);
    if (!hits.length) return null;

    const hitName = hits[0].object.name.replace(/^sc_/, "");

    if (hitName.includes("knob_main")) return { type: "knob_main" };
    if (hitName.includes("knob_aux")) return { type: "knob_aux" };
    if (hitName.startsWith("key_")) {
      const idx = parseInt(hitName.replace("key_", ""), 10) - 1;
      return { type: "key", index: Math.max(0, Math.min(3, idx)) };
    }
    if (hitName.includes("lab")) return { type: "cartridge", id: "lab" };
    if (hitName.includes("filo")) return { type: "cartridge", id: "filo" };
    if (hitName.includes("nemue")) return { type: "cartridge", id: "nemue" };
    if (hitName.includes("display")) return { type: "screen" };
    if (hitName.includes("switch")) return { type: "switch" };

    return null;
  }

  public dispose() {
    this.meshes.forEach((mesh) => {
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material?.dispose();
      }
    });
    this.root.clear();
  }
}
