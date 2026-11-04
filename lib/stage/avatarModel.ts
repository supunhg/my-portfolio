import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { audio } from "../audio";

const MODEL_PATH = "/models/avatar.glb?v=1";

export type AvatarMood = "neutral" | "scanning" | "fortified" | "playful" | "alert";

export class AvatarModel {
  readonly root = new THREE.Group();
  readonly meshes: Map<string, THREE.Mesh> = new Map();
  private originalPositions: Map<string, THREE.Vector3> = new Map();

  // Dynamic emotional / animation states
  public mood: AvatarMood = "neutral";
  public hoverTime: number = 0;
  public blinkTimer: number = 0;
  public isBlinking: boolean = false;
  public ringRotation: number = 0;
  public spinImpulse: number = 0;
  public bounceOffset: number = 0;

  // Eye materials for color switching
  private eyeLeftMat: THREE.MeshStandardMaterial | null = null;
  private eyeRightMat: THREE.MeshStandardMaterial | null = null;
  private thrusterMat: THREE.MeshStandardMaterial | null = null;

  static async load(onProgress?: (ratio: number) => void): Promise<AvatarModel> {
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

    return new AvatarModel(gltf);
  }

  private constructor(gltf: GLTF) {
    this.root.name = "Sentinel_Avatar_Root";

    gltf.scene.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const name = mesh.name.replace(/^sc_/, "");
        this.meshes.set(name, mesh);
        this.originalPositions.set(name, mesh.position.clone());

        if (name === "eye_left" || name === "eye_right") {
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#06b6d4"),
            emissive: new THREE.Color("#06b6d4"),
            emissiveIntensity: 3.5,
            roughness: 0.1,
          });
          mesh.material = mat;
          if (name === "eye_left") this.eyeLeftMat = mat;
          if (name === "eye_right") this.eyeRightMat = mat;
        }

        if (name === "thruster_core") {
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#06b6d4"),
            emissive: new THREE.Color("#06b6d4"),
            emissiveIntensity: 4.0,
            roughness: 0.2,
          });
          mesh.material = mat;
          this.thrusterMat = mat;
        }
      }
    });

    this.root.add(gltf.scene);
    this.root.scale.set(1.6, 1.6, 1.6);
  }

  public setMood(newMood: AvatarMood) {
    if (this.mood === newMood) return;
    this.mood = newMood;

    let eyeColor = "#06b6d4"; // default cyber cyan
    let thrusterColor = "#06b6d4";

    if (newMood === "scanning") {
      eyeColor = "#00f0ff";
      thrusterColor = "#00f0ff";
    } else if (newMood === "fortified") {
      eyeColor = "#10b981"; // Defense emerald
      thrusterColor = "#10b981";
    } else if (newMood === "alert") {
      eyeColor = "#ff5a1f"; // Signal orange
      thrusterColor = "#ff5a1f";
    } else if (newMood === "playful") {
      eyeColor = "#ec4899"; // Cyber pink/violet
      thrusterColor = "#8b5cf6";
    }

    if (this.eyeLeftMat) {
      this.eyeLeftMat.color.set(eyeColor);
      this.eyeLeftMat.emissive.set(eyeColor);
    }
    if (this.eyeRightMat) {
      this.eyeRightMat.color.set(eyeColor);
      this.eyeRightMat.emissive.set(eyeColor);
    }
    if (this.thrusterMat) {
      this.thrusterMat.color.set(thrusterColor);
      this.thrusterMat.emissive.set(thrusterColor);
    }
  }

  public triggerChirp() {
    this.spinImpulse = Math.PI * 2;
    audio.chime();
    this.setMood("playful");
    setTimeout(() => {
      this.setMood("neutral");
    }, 2400);
  }

  public update(delta: number) {
    const d = Math.min(delta, 0.05);
    this.hoverTime += d;

    // 1. Gentle floating / breathing hover physics
    const floatY = Math.sin(this.hoverTime * 2.2) * 0.025;
    const floatRoll = Math.sin(this.hoverTime * 1.4) * 0.04;
    const floatPitch = Math.cos(this.hoverTime * 1.8) * 0.03;

    // 2. Spin impulse decay (on click / chirp)
    if (this.spinImpulse > 0) {
      this.root.rotation.y += this.spinImpulse * d * 3.5;
      this.spinImpulse = Math.max(0, this.spinImpulse - d * 6);
    }

    // 3. Body base positioning
    const body = this.meshes.get("body_chassis");
    if (body) {
      body.position.y = (this.originalPositions.get("body_chassis")?.y || 0) + floatY;
      body.rotation.z = floatRoll;
      body.rotation.x = floatPitch;
    }

    // 4. Face Visor follows head
    const visor = this.meshes.get("face_visor");
    if (visor) {
      visor.position.y = (this.originalPositions.get("face_visor")?.y || 0) + floatY;
      visor.rotation.z = floatRoll;
      visor.rotation.x = floatPitch;
    }

    // 5. Magnetic Ring Rotation (perpetual smooth spin)
    const ring = this.meshes.get("propulsion_ring");
    if (ring) {
      this.ringRotation += d * 1.8;
      ring.rotation.z = this.ringRotation;
      ring.position.y = (this.originalPositions.get("propulsion_ring")?.y || 0) + floatY * 0.5;
    }

    // 6. Thruster core pulsing
    const thruster = this.meshes.get("thruster_core");
    if (thruster) {
      thruster.position.y = (this.originalPositions.get("thruster_core")?.y || 0) + floatY;
      if (this.thrusterMat) {
        this.thrusterMat.emissiveIntensity = 3.5 + Math.sin(this.hoverTime * 8) * 1.2;
      }
    }

    // 7. Blinking eyes logic
    this.blinkTimer += d;
    if (this.blinkTimer > 3.8) {
      this.isBlinking = true;
      if (this.blinkTimer > 4.0) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    }

    const eyeScaleY = this.isBlinking ? 0.08 : 1.0;
    const eyeL = this.meshes.get("eye_left");
    const eyeR = this.meshes.get("eye_right");

    if (eyeL) {
      eyeL.scale.y = eyeScaleY;
      eyeL.position.y = (this.originalPositions.get("eye_left")?.y || 0) + floatY;
    }
    if (eyeR) {
      eyeR.scale.y = eyeScaleY;
      eyeR.position.y = (this.originalPositions.get("eye_right")?.y || 0) + floatY;
    }

    // 8. Ears and shoulder pods lag/react slightly
    const earL = this.meshes.get("ear_antenna_l");
    const earR = this.meshes.get("ear_antenna_r");
    if (earL) earL.position.y = (this.originalPositions.get("ear_antenna_l")?.y || 0) + floatY * 1.1;
    if (earR) earR.position.y = (this.originalPositions.get("ear_antenna_r")?.y || 0) + floatY * 1.1;

    const podL = this.meshes.get("shoulder_pod_l");
    const podR = this.meshes.get("shoulder_pod_r");
    if (podL) podL.position.y = (this.originalPositions.get("shoulder_pod_l")?.y || 0) + floatY * 0.8;
    if (podR) podR.position.y = (this.originalPositions.get("shoulder_pod_r")?.y || 0) + floatY * 0.8;
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
