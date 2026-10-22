import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshStandardMaterial,
  Mesh,
  HemisphereLight,
  DirectionalLight,
} from "three";
import { createMotion } from "./index";
/** A short, on-demand 3D celebration. No renderer or GPU allocation during normal play. */
export function victory(host: HTMLElement): () => void {
  const motion = createMotion(host);
  if (!motion.enabled()) {
    motion.destroy();
    return () => {};
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
  });
  if (!context) {
    motion.destroy();
    return () => {};
  }
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: false,
    });
  } catch {
    motion.destroy();
    return () => {};
  }
  canvas.className = "victory-scene";
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.renderer = "three";
  host.append(canvas);
  const width = host.clientWidth,
    height = host.clientHeight,
    aspect = width / Math.max(height, 1);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setSize(width, height, false);
  const scene = new Scene();
  const camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 20);
  camera.position.z = 5;
  scene.add(new HemisphereLight(0xffffff, 0x577787, 2));
  const light = new DirectionalLight(0xffffff, 3);
  light.position.set(2, 3, 4);
  scene.add(light);
  const geometry = new BoxGeometry(0.035, 0.07, 0.015);
  const materials = [0xa7f0e6, 0xffad94, 0xf2ca67].map(
    (color) =>
      new MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.35,
        transparent: true,
      }),
  );
  const chips = Array.from({ length: 36 }, (_, i) => {
    const mesh = new Mesh(geometry, materials[i % 3]!);
    scene.add(mesh);
    return mesh;
  });
  let disposed = false;
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener("webglcontextlost", lost);
    window.removeEventListener("resize", stop);
    geometry.dispose();
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
  const stop = () => {
    motion.destroy();
    cleanup();
  };
  const lost = (event: Event) => {
    event.preventDefault();
    stop();
  };
  canvas.addEventListener("webglcontextlost", lost);
  window.addEventListener("resize", stop);
  const time = { value: 0 };
  motion.run(
    (timeline) => {
      timeline.to(time, {
        value: 1,
        duration: 1.35,
        ease: "none",
        onUpdate: () => {
          if (disposed) return;
          const t = time.value;
          chips.forEach((mesh, i) => {
            const direction = i % 2 ? 1 : -1;
            mesh.position.set(
              direction * aspect * 0.8 +
                direction * -t * (0.3 + (i % 9) * 0.13),
              -0.55 + t * (2.5 + (i % 7) * 0.12) - 2.3 * t * t,
              (i % 5) * 0.08,
            );
            mesh.rotation.set(
              t * ((i % 5) + 2),
              t * ((i % 7) + 2),
              t * direction * 5,
            );
          });
          materials.forEach(
            (material) => (material.opacity = Math.min(1, (1 - t) * 4)),
          );
          renderer.render(scene, camera);
        },
      });
    },
    () => {
      cleanup();
      motion.destroy();
    },
  );
  return stop;
}
