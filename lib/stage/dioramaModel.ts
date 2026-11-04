import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { audio } from "../audio";

const MODEL_PATH = "/models/diorama.glb?v=2";

export type DioramaHit =
  | { type: "sign_lab"; label: "NIBM Campus Infrastructure // ESXi 34-Container Fleet"; targetId: "lab" }
  | { type: "sign_forensics"; label: "Digital Forensics & Reverse Engineering // Filo Go Engine"; targetId: "forensics" }
  | { type: "sign_creative"; label: "3D Physical Computing & Digital Craft // Supercub Labs"; targetId: "creative" }
  | { type: "sign_contact"; label: "Classified Dossier & Direct Contact // Supun Hewagamage"; targetId: "contact" }
  | { type: "server_rack"; label: "Campus Hypervisor // ESXi 34 Containers, Authentik OIDC, Traefik, Qdrant"; targetId: "lab" }
  | { type: "arcade_cabinet"; label: "Retro Forensic Terminal // Filo (Go 1.23 Fast Binary Analyzer)"; targetId: "forensics" }
  | { type: "desk_workstation"; label: "Cyber Workstation // Ultrawide Terminal & Hardware Prototyping"; targetId: "spec" }
  | { type: "telemetry_dish"; label: "Telemetry Array // Nemue High-Speed Network Recon (Rust)"; targetId: "spec" }
  | { type: "cyber_drone"; label: "Sentinel Drone // ZeroTier Mesh Automated Node Guardian"; targetId: null }
  | { type: "skateboard"; label: "Cyber Skateboard // Crafted in Blender 5.2 bmesh"; targetId: "creative" }
  | null;

export class DioramaModel {
  readonly root = new THREE.Group();
  readonly meshes: Map<string, THREE.Mesh> = new Map();
  private originalMaterials: Map<string, THREE.Material> = new Map();
  private highlightMaterials: Map<string, THREE.Material> = new Map();

  // Animated elements
  private droneGroup: THREE.Object3D | null = null;
  private dishGroup: THREE.Object3D | null = null;
  private rackLedsCyan: THREE.Mesh | null = null;
  private rackLedsAmber: THREE.Mesh | null = null;
  private rackLedsGreen: THREE.Mesh | null = null;

  public hoveredHit: DioramaHit = null;

  static async load(onProgress?: (ratio: number) => void): Promise<DioramaModel> {
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

    return new DioramaModel(gltf);
  }

  private constructor(gltf: GLTF) {
    this.root.name = "Diorama_Root";

    gltf.scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name.replace(/^sc_/, "");
        this.meshes.set(name, mesh);

        if (mesh.material) {
          const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
          this.originalMaterials.set(name, mat);

          // Prepare glow highlight material for interactive targets
          if ((mat as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const std = mat as THREE.MeshStandardMaterial;
            const hMat = std.clone();
            hMat.emissive = new THREE.Color(0x38bdf8);
            hMat.emissiveIntensity = 2.0;
            this.highlightMaterials.set(name, hMat);
          }
        }
      }

      // Track animated parents
      if (node.name === "cyber_drone") this.droneGroup = node;
      if (node.name === "telemetry_dish") this.dishGroup = node;
    });

    this.rackLedsCyan = this.meshes.get("rack_leds_cyan") || null;
    this.rackLedsAmber = this.meshes.get("rack_leds_amber") || null;
    this.rackLedsGreen = this.meshes.get("rack_leds_green") || null;

    this.root.add(gltf.scene);

    // Scale and center the outpost diorama nicely in the stage
    this.root.scale.set(1.5, 1.5, 1.5);
    this.root.position.set(0, -0.65, 0);
  }

  /**
   * Per-frame updates: drone hovering bob, radar dish gentle scan, blinking server LEDs
   */
  public update(timeSeconds: number) {
    // 1. Drone hovering bob
    if (this.droneGroup) {
      this.droneGroup.position.y = 0.95 + Math.sin(timeSeconds * 3.5) * 0.04;
      this.droneGroup.rotation.y = Math.sin(timeSeconds * 1.5) * 0.15;
    }

    // 2. Telemetry Dish gentle tracking
    if (this.dishGroup) {
      this.dishGroup.rotation.y = Math.sin(timeSeconds * 0.6) * 0.18;
    }

    // 3. Server rack blinking LEDs
    const blinkFast = Math.sin(timeSeconds * 14) > 0.1;
    const blinkSlow = Math.sin(timeSeconds * 6) > 0.0;
    if (this.rackLedsCyan && (this.rackLedsCyan.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
      (this.rackLedsCyan.material as THREE.MeshStandardMaterial).emissiveIntensity = blinkFast ? 4.5 : 1.2;
    }
    if (this.rackLedsAmber && (this.rackLedsAmber.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
      (this.rackLedsAmber.material as THREE.MeshStandardMaterial).emissiveIntensity = blinkSlow ? 4.0 : 0.8;
    }
  }

  /**
   * Highlights or unhighlights meshes based on hover
   */
  public setHovered(hit: DioramaHit) {
    if (this.hoveredHit?.type === hit?.type) return;

    // Restore previous
    if (this.hoveredHit) {
      const prevNames = this.getMeshNamesForHit(this.hoveredHit);
      for (const n of prevNames) {
        const mesh = this.meshes.get(n);
        const orig = this.originalMaterials.get(n);
        if (mesh && orig) mesh.material = orig;
      }
    }

    this.hoveredHit = hit;

    // Apply highlight
    if (hit) {
      const nextNames = this.getMeshNamesForHit(hit);
      for (const n of nextNames) {
        const mesh = this.meshes.get(n);
        const hMat = this.highlightMaterials.get(n);
        if (mesh && hMat) mesh.material = hMat;
      }
      audio.tick();
    }
  }

  private getMeshNamesForHit(hit: DioramaHit): string[] {
    if (!hit) return [];
    switch (hit.type) {
      case "sign_lab":
        return ["sign_lab_border", "sign_lab_text"];
      case "sign_forensics":
        return ["sign_forensics_border", "sign_forensics_text"];
      case "sign_creative":
        return ["sign_creative_border", "sign_creative_text"];
      case "sign_contact":
        return ["sign_contact_border", "sign_contact_text"];
      case "server_rack":
        return ["rack_badge_text", "rack_leds_cyan", "rack_leds_amber"];
      case "arcade_cabinet":
        return ["arcade_marquee_text", "arcade_neon_trim", "arcade_crt_screen"];
      case "desk_workstation":
        return ["monitor_screen", "desk_lamp_bulb"];
      case "telemetry_dish":
        return ["satellite_dish", "antenna_beacon", "solar_panel_cells"];
      case "cyber_drone":
        return ["drone_eye"];
      case "skateboard":
        return ["skate_deck", "skate_wheels"];
    }
  }

  /**
   * Maps a Raycaster hit mesh to a DioramaHit
   */
  public resolveHit(meshName: string): DioramaHit {
    const clean = meshName.replace(/^sc_/, "");

    if (clean.includes("sign_lab")) {
      return { type: "sign_lab", label: "NIBM Campus Infrastructure // ESXi 34-Container Fleet", targetId: "lab" };
    }
    if (clean.includes("sign_forensics")) {
      return { type: "sign_forensics", label: "Digital Forensics & Reverse Engineering // Filo Go Engine", targetId: "forensics" };
    }
    if (clean.includes("sign_creative")) {
      return { type: "sign_creative", label: "3D Physical Computing & Digital Craft // Supercub Labs", targetId: "creative" };
    }
    if (clean.includes("sign_contact")) {
      return { type: "sign_contact", label: "Classified Dossier & Direct Contact // Supun Hewagamage", targetId: "contact" };
    }
    if (clean.includes("rack")) {
      return { type: "server_rack", label: "Campus Hypervisor // ESXi 34 Containers, Authentik OIDC, Traefik, Qdrant", targetId: "lab" };
    }
    if (clean.includes("arcade")) {
      return { type: "arcade_cabinet", label: "Retro Forensic Terminal // Filo (Go 1.23 Fast Binary Analyzer)", targetId: "forensics" };
    }
    if (clean.includes("desk") || clean.includes("monitor") || clean.includes("keyboard") || clean.includes("chair")) {
      return { type: "desk_workstation", label: "Cyber Workstation // Ultrawide Terminal & Hardware Prototyping", targetId: "spec" };
    }
    if (clean.includes("dish") || clean.includes("antenna") || clean.includes("solar")) {
      return { type: "telemetry_dish", label: "Telemetry Array // Nemue High-Speed Network Recon (Rust)", targetId: "spec" };
    }
    if (clean.includes("drone")) {
      return { type: "cyber_drone", label: "Sentinel Drone // ZeroTier Mesh Automated Node Guardian", targetId: null };
    }
    if (clean.includes("skate")) {
      return { type: "skateboard", label: "Cyber Skateboard // Crafted in Blender 5.2 bmesh", targetId: "creative" };
    }

    return null;
  }
}
