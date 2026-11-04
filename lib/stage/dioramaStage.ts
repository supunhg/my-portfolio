import * as THREE from "three";
import { DioramaModel, type DioramaHit } from "./dioramaModel";
import { audio } from "../audio";

export type CameraPreset = "overview" | "server" | "workstation" | "arcade" | "telemetry";

export interface DioramaStageOptions {
  onProgress?: (ratio: number) => void;
  onHoverHit?: (hit: DioramaHit) => void;
  onClickHit?: (hit: DioramaHit) => void;
}

interface PresetTransform {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

export class DioramaStage {
  readonly canvas: HTMLCanvasElement;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly model: DioramaModel;

  private running: boolean = true;
  private pointer = new THREE.Vector2(-999, -999);
  private raycaster = new THREE.Raycaster();
  private isPointerDown: boolean = false;
  private pointerDownCoord = new THREE.Vector2();
  private isDragging: boolean = false;

  // Camera preset positions
  private readonly presets: Record<CameraPreset, PresetTransform> = {
    overview: {
      pos: new THREE.Vector3(4.2, 3.4, 4.2),
      target: new THREE.Vector3(0.0, -0.05, 0.0),
    },
    server: {
      pos: new THREE.Vector3(-1.0, 1.6, 2.2),
      target: new THREE.Vector3(-0.65, 0.65, 0.15),
    },
    workstation: {
      pos: new THREE.Vector3(1.6, 1.3, 1.8),
      target: new THREE.Vector3(0.38, 0.45, 0.15),
    },
    arcade: {
      pos: new THREE.Vector3(-0.1, 1.2, 1.6),
      target: new THREE.Vector3(-0.58, 0.40, -0.38),
    },
    telemetry: {
      pos: new THREE.Vector3(-0.3, 2.6, 2.8),
      target: new THREE.Vector3(-0.62, 1.55, 0.65),
    },
  };

  private currentPreset: CameraPreset = "overview";
  private currentCamPos: THREE.Vector3;
  private currentCamTarget: THREE.Vector3;
  private targetCamPos: THREE.Vector3;
  private targetCamTarget: THREE.Vector3;

  // Orbit drag angles
  private orbitAngle = new THREE.Vector2(0, 0);
  private orbitVelocity = new THREE.Vector2(0, 0);
  private autoRotate: boolean = true;
  private autoRotateSpeed: number = 0.0015;

  private resizeObserver: ResizeObserver | null = null;
  private options: DioramaStageOptions;

  static async create(canvas: HTMLCanvasElement, options: DioramaStageOptions = {}): Promise<DioramaStage> {
    const model = await DioramaModel.load(options.onProgress);
    return new DioramaStage(canvas, model, options);
  }

  private constructor(canvas: HTMLCanvasElement, model: DioramaModel, options: DioramaStageOptions) {
    this.canvas = canvas;
    this.model = model;
    this.options = options;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    // 1. Camera setup (Isometric perspective)
    this.camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 30);
    this.currentCamPos = this.presets.overview.pos.clone();
    this.currentCamTarget = this.presets.overview.target.clone();
    this.targetCamPos = this.presets.overview.pos.clone();
    this.targetCamTarget = this.presets.overview.target.clone();
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentCamTarget);

    // 2. Renderer setup
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lighting setup
    this.setupLighting();

    // 4. Ground Shadow Plane
    this.setupGroundShadow();

    // 5. Add model to scene
    this.scene.add(this.model.root);

    // 6. Bind events
    this.bindEvents();

    // 7. Start render loop
    requestAnimationFrame(this.tick);
  }

  private setupLighting() {
    // Soft sky hemisphere bounce
    const hemi = new THREE.HemisphereLight(0xf1f5f9, 0x0f172a, 1.8);
    this.scene.add(hemi);

    // Main Warm Key Light
    const key = new THREE.DirectionalLight(0xfff7ed, 3.2);
    key.position.set(4.0, 5.0, 4.5);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    key.shadow.bias = -0.0004;
    key.shadow.radius = 2.5;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 15;
    key.shadow.camera.left = -2.5;
    key.shadow.camera.right = 2.5;
    key.shadow.camera.top = 2.5;
    key.shadow.camera.bottom = -2.5;
    this.scene.add(key);

    // Cool Cyber Blue Fill Light
    const fill = new THREE.DirectionalLight(0x38bdf8, 1.6);
    fill.position.set(-4.0, 4.0, -3.5);
    this.scene.add(fill);

    // Subtle Front Low Rim Light
    const rim = new THREE.DirectionalLight(0xf97316, 0.8);
    rim.position.set(0.0, 1.5, 4.0);
    this.scene.add(rim);
  }

  private setupGroundShadow() {
    const geo = new THREE.PlaneGeometry(8, 8);
    const mat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const plane = new THREE.Mesh(geo, mat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.66;
    plane.receiveShadow = true;
    this.scene.add(plane);
  }

  private bindEvents() {
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.canvas);

    this.canvas.addEventListener("pointerdown", this.onPointerDown);
    window.addEventListener("pointermove", this.onPointerMove);
    window.addEventListener("pointerup", this.onPointerUp);
    this.canvas.addEventListener("wheel", this.onWheel, { passive: false });
  }

  private handleResize() {
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  private onPointerDown = (e: PointerEvent) => {
    this.isPointerDown = true;
    this.isDragging = false;
    this.pointerDownCoord.set(e.clientX, e.clientY);
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.pointer.set(x, y);

    if (this.isPointerDown) {
      const dx = e.clientX - this.pointerDownCoord.x;
      const dy = e.clientY - this.pointerDownCoord.y;
      if (Math.hypot(dx, dy) > 4) {
        this.isDragging = true;
        this.autoRotate = false;
      }

      this.orbitVelocity.x = dx * 0.003;
      this.orbitVelocity.y = dy * 0.002;
      this.pointerDownCoord.set(e.clientX, e.clientY);
    }

    // Raycast hover check
    this.checkHover();
  };

  private onPointerUp = (e: PointerEvent) => {
    if (!this.isDragging && this.isPointerDown) {
      this.checkClick();
    }
    this.isPointerDown = false;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.002;
    this.targetCamPos.multiplyScalar(1 + zoomFactor);
    // Clamp zoom distance
    const dist = this.targetCamPos.length();
    if (dist < 2.0) this.targetCamPos.setLength(2.0);
    if (dist > 8.0) this.targetCamPos.setLength(8.0);
  };

  private checkHover() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.model.root.children, true);

    if (hits.length > 0) {
      const first = hits[0].object;
      const hitInfo = this.model.resolveHit(first.name);
      if (hitInfo) {
        this.canvas.style.cursor = "pointer";
        this.model.setHovered(hitInfo);
        this.options.onHoverHit?.(hitInfo);
        return;
      }
    }

    this.canvas.style.cursor = "default";
    this.model.setHovered(null);
    this.options.onHoverHit?.(null);
  }

  private checkClick() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.model.root.children, true);

    if (hits.length > 0) {
      const first = hits[0].object;
      const hitInfo = this.model.resolveHit(first.name);
      if (hitInfo) {
        audio.select();
        this.options.onClickHit?.(hitInfo);

        if (hitInfo.targetId) {
          const el = document.getElementById(hitInfo.targetId);
          el?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }

  public setPreset(preset: CameraPreset) {
    this.currentPreset = preset;
    const target = this.presets[preset];
    if (target) {
      this.targetCamPos.copy(target.pos);
      this.targetCamTarget.copy(target.target);
      this.autoRotate = preset === "overview";
      audio.click();
    }
  }

  public resetCamera() {
    this.setPreset("overview");
    this.orbitAngle.set(0, 0);
    this.orbitVelocity.set(0, 0);
  }

  private tick = (timeMs: number) => {
    if (!this.running) return;

    const timeSec = timeMs * 0.001;

    // 1. Update model animations
    this.model.update(timeSec);

    // 2. Auto-rotate or Orbit velocity damping
    if (this.autoRotate && !this.isPointerDown) {
      this.orbitAngle.x += this.autoRotateSpeed;
    } else {
      this.orbitAngle.x += this.orbitVelocity.x;
      this.orbitAngle.y = Math.max(-0.4, Math.min(0.5, this.orbitAngle.y + this.orbitVelocity.y));
      this.orbitVelocity.multiplyScalar(0.92);
    }

    // 3. Smooth camera interpolation to target preset
    this.currentCamPos.lerp(this.targetCamPos, 0.08);
    this.currentCamTarget.lerp(this.targetCamTarget, 0.08);

    // Apply orbit rotation around target
    const radius = this.currentCamPos.distanceTo(this.currentCamTarget);
    const camOffset = new THREE.Vector3(
      radius * Math.sin(this.orbitAngle.x) * Math.cos(this.orbitAngle.y),
      radius * Math.sin(this.orbitAngle.y) + this.currentCamPos.y,
      radius * Math.cos(this.orbitAngle.x) * Math.cos(this.orbitAngle.y)
    );

    this.camera.position.copy(this.currentCamTarget).add(camOffset);
    this.camera.lookAt(this.currentCamTarget);

    // 4. Render
    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.tick);
  };

  public dispose() {
    this.running = false;
    this.resizeObserver?.disconnect();
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerup", this.onPointerUp);
    this.canvas.removeEventListener("wheel", this.onWheel);
    this.renderer.dispose();
  }
}
