import * as THREE from "three";
import { AvatarModel, type AvatarMood } from "./avatarModel";
import { audio } from "../audio";

export interface AvatarStageOptions {
  onProgress?: (ratio: number) => void;
  onMoodChange?: (mood: AvatarMood) => void;
}

export class AvatarStage {
  readonly canvas: HTMLCanvasElement;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly model: AvatarModel;

  private running: boolean = true;
  private lastTime: number = performance.now();
  private pointer = new THREE.Vector2(0, 0);
  private targetLookAt = new THREE.Vector2(0, 0);
  private currentLookAt = new THREE.Vector2(0, 0);

  // Scroll tracking target positions
  private scrollProgress: number = 0;
  private targetBotPos = new THREE.Vector3(0, 0, 0);
  private currentBotPos = new THREE.Vector3(0, 0, 0);

  private resizeObserver: ResizeObserver | null = null;
  private options: AvatarStageOptions;

  static async create(canvas: HTMLCanvasElement, options: AvatarStageOptions = {}): Promise<AvatarStage> {
    const model = await AvatarModel.load(options.onProgress);
    return new AvatarStage(canvas, model, options);
  }

  private constructor(canvas: HTMLCanvasElement, model: AvatarModel, options: AvatarStageOptions) {
    this.canvas = canvas;
    this.model = model;
    this.options = options;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 10);
    this.camera.position.set(0, 0.05, 0.72);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(w, h, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.setupLighting();
    this.scene.add(this.model.root);
    this.bindEvents();

    requestAnimationFrame(this.tick);
  }

  private setupLighting() {
    // Ambient dark cyber bounce
    const hemi = new THREE.HemisphereLight(0x06b6d4, 0x090a0f, 1.2);
    this.scene.add(hemi);

    // Key Light (crisp cool white)
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(0.8, 1.2, 1.0);
    this.scene.add(key);

    // Rim light for cyber silhouette
    const rim = new THREE.DirectionalLight(0x00f0ff, 2.5);
    rim.position.set(-0.8, 0.6, -0.6);
    this.scene.add(rim);

    // Accent light from bottom
    const bottomLight = new THREE.PointLight(0x06b6d4, 1.8, 2);
    bottomLight.position.set(0, -0.4, 0.2);
    this.scene.add(bottomLight);
  }

  private bindEvents() {
    const onPointerMove = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.pointer.set(x, y);

      // Target head turn
      this.targetLookAt.x = x * 0.45;
      this.targetLookAt.y = y * 0.35;
    };

    const onClick = () => {
      this.model.triggerChirp();
      this.options.onMoodChange?.(this.model.mood);
    };

    window.addEventListener("pointermove", onPointerMove);
    this.canvas.addEventListener("click", onClick);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvas);
  }

  public setScrollProgress(progress: number, activeSection?: string) {
    this.scrollProgress = progress;

    if (activeSection === "infrastructure") {
      this.model.setMood("fortified");
      this.targetBotPos.set(0.04, 0.02, 0);
    } else if (activeSection === "forensics") {
      this.model.setMood("scanning");
      this.targetBotPos.set(-0.04, 0.03, 0);
    } else if (activeSection === "creative") {
      this.model.setMood("playful");
      this.targetBotPos.set(0.02, -0.02, 0);
    } else if (activeSection === "contact") {
      this.model.setMood("alert");
      this.targetBotPos.set(0, 0.04, 0);
    } else {
      this.model.setMood("neutral");
      this.targetBotPos.set(0, 0, 0);
    }

    this.options.onMoodChange?.(this.model.mood);
  }

  private onResize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private tick = (time: number) => {
    if (!this.running) return;
    const delta = (time - this.lastTime) * 0.001;
    this.lastTime = time;

    // Smooth head look-at interpolation
    this.currentLookAt.x += (this.targetLookAt.x - this.currentLookAt.x) * 0.08;
    this.currentLookAt.y += (this.targetLookAt.y - this.currentLookAt.y) * 0.08;

    this.model.root.rotation.y = this.currentLookAt.x;
    this.model.root.rotation.x = -this.currentLookAt.y;

    // Smooth position shift
    this.currentBotPos.lerp(this.targetBotPos, 0.06);
    this.model.root.position.copy(this.currentBotPos);

    // Update animations
    this.model.update(delta);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  };

  public dispose() {
    this.running = false;
    this.resizeObserver?.disconnect();
    this.model.dispose();
    this.renderer.dispose();
  }
}
