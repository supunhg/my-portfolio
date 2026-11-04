import * as THREE from "three";
import { UnitModel, type PartHit } from "./model";

export interface StageOptions {
  onProgress?: (ratio: number) => void;
  onHoverPart?: (hit: PartHit) => void;
  onClickPart?: (hit: PartHit) => void;
}

export class Stage {
  readonly canvas: HTMLCanvasElement;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly model: UnitModel;

  private running: boolean = true;
  private lastTime: number = performance.now();
  private pointer = new THREE.Vector2(-999, -999);
  private raycaster = new THREE.Raycaster();
  private isPointerDown: boolean = false;
  private pointerDownCoord = new THREE.Vector2();

  // Camera targets & smoothing
  private baseCamPos = new THREE.Vector3(0, 0.42, 0.48);
  private targetRot = new THREE.Euler(-0.55, 0, 0, "YXZ");
  private currentRot = new THREE.Vector2(0, 0); // user rotation offset
  private targetRotOffset = new THREE.Vector2(0, 0);
  private pointerParallax = new THREE.Vector2(0, 0);

  // Resize handler
  private resizeObserver: ResizeObserver | null = null;
  private options: StageOptions;

  static async create(canvas: HTMLCanvasElement, options: StageOptions = {}): Promise<Stage> {
    const model = await UnitModel.load(options.onProgress);
    return new Stage(canvas, model, options);
  }

  private constructor(canvas: HTMLCanvasElement, model: UnitModel, options: StageOptions) {
    this.canvas = canvas;
    this.model = model;
    this.options = options;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    // 1. Camera setup (Orthographic-like telephoto perspective)
    this.camera = new THREE.PerspectiveCamera(32, w / h, 0.05, 10);
    this.camera.position.copy(this.baseCamPos);
    this.camera.lookAt(0, 0, 0);

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
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. Lighting
    this.setupLighting();

    // 4. Contact Shadow Plane
    this.setupShadowPlane();

    // 5. Add model to scene
    this.scene.add(this.model.root);

    // 6. Event listeners
    this.bindEvents();

    // 7. Start render loop
    requestAnimationFrame(this.tick);
  }

  private setupLighting() {
    // Ambient soft hemisphere bounce (warm white sky, cool ground)
    const hemi = new THREE.HemisphereLight(0xfffbf5, 0x1f2329, 1.4);
    this.scene.add(hemi);

    // Main Key Light
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(0.6, 1.4, 0.8);
    key.castShadow = true;
    key.shadow.mapSize.width = 1024;
    key.shadow.mapSize.height = 1024;
    key.shadow.bias = -0.0005;
    key.shadow.radius = 3;
    this.scene.add(key);

    // Soft Fill Light
    const fill = new THREE.DirectionalLight(0xbad2e8, 1.1);
    fill.position.set(-0.8, 0.6, -0.4);
    this.scene.add(fill);

    // Subtle Rim Light for bevel sheen
    const rim = new THREE.DirectionalLight(0xffecd6, 1.6);
    rim.position.set(0, 0.9, -1.0);
    this.scene.add(rim);
  }

  private setupShadowPlane() {
    const geo = new THREE.PlaneGeometry(1.6, 1.6);
    const mat = new THREE.ShadowMaterial({
      opacity: 0.22,
    });
    const shadowMesh = new THREE.Mesh(geo, mat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.075;
    shadowMesh.receiveShadow = true;
    this.scene.add(shadowMesh);
  }

  private bindEvents() {
    const onPointerMove = (e: PointerEvent) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.pointer.set(x, y);

      if (this.isPointerDown) {
        const dx = e.clientX - this.pointerDownCoord.x;
        const dy = e.clientY - this.pointerDownCoord.y;
        this.targetRotOffset.y += dx * 0.005;
        this.targetRotOffset.x += dy * 0.005;
        this.pointerDownCoord.set(e.clientX, e.clientY);
      } else {
        // Parallax
        this.pointerParallax.x = x * 0.12;
        this.pointerParallax.y = y * 0.08;

        // Hover raycast
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hit = this.model.raycast(this.raycaster);
        this.options.onHoverPart?.(hit);
        this.canvas.style.cursor = hit ? "pointer" : "default";
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      this.isPointerDown = true;
      this.pointerDownCoord.set(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - this.pointerDownCoord.x, e.clientY - this.pointerDownCoord.y);
      this.isPointerDown = false;

      // Click detected if slight drag
      if (dist < 6) {
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hit = this.model.raycast(this.raycaster);
        if (hit) {
          this.model.interactWith(hit);
          this.options.onClickPart?.(hit);
        }
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    this.canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvas);
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

    // Smooth inertia for orbit and parallax
    this.currentRot.x += (this.targetRotOffset.x + this.pointerParallax.y - this.currentRot.x) * 0.08;
    this.currentRot.y += (this.targetRotOffset.y + this.pointerParallax.x - this.currentRot.y) * 0.08;

    // Rotate unit
    this.model.root.rotation.x = this.currentRot.x;
    this.model.root.rotation.y = this.currentRot.y;

    // Update model animations
    this.model.update(delta);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.tick);
  };

  public setExplode(factor: number) {
    this.model.explodeFactor = factor;
  }

  public resetRotation() {
    this.targetRotOffset.set(0, 0);
  }

  public dispose() {
    this.running = false;
    this.resizeObserver?.disconnect();
    this.model.dispose();
    this.renderer.dispose();
  }
}
