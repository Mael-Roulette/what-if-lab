import { niceCeil } from "./utils";

export type ProjectileParams = {
  speed: number;   // m/s
  angle: number;   // degrés
  gravity: number; // m/s²
};

export const DEFAULT_PARAMS: ProjectileParams = {
  speed: 20,
  angle: 45,
  gravity: 9.81,
};

export function calculatePosition(t: number, { speed, angle, gravity }: ProjectileParams) {
  const rad = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(rad);
  const vy = speed * Math.sin(rad);

  return {
    x: vx * t,
    y: vy * t - 0.5 * gravity * t * t,
  };
}

type AnimateOptions = {
  /** false : affiche seulement la scène (boule au point de départ) sans lancer l'animation */
  autoplay?: boolean;
};

export function animateProjectile(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  skyHeight: number,
  params: ProjectileParams,
  { autoplay = true }: AnimateOptions = {}
): () => void {
  let startTime: number | null = null;
  let animationId = 0;
  let stopped = false;
  const trail: { x: number; y: number }[] = [];

  const { speed, angle, gravity } = params;
  const rad = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(rad);
  const vy = speed * Math.sin(rad);

  const flightTime = (2 * vy) / gravity;
  const range = vx * flightTime;
  const maxHeight = (vy * vy) / (2 * gravity);

  const launchX = 60;
  const marginRight = 80;
  const marginTop = 30;
  const groundY = skyHeight;
  const plotWidth = width - launchX - marginRight;
  const plotHeight = groundY - marginTop;

  // L'échelle est "arrondie" : on arrondit la portée et la hauteur max à
  // 1 / 2 / 5 / 10 × 10^n. L'échelle ne change donc que par paliers
  const pixelsPerMeter = Math.min(
    plotWidth / niceCeil(Math.max(range, 0.001)),
    plotHeight / niceCeil(Math.max(maxHeight, 0.001))
  );

  const maxXMeters = plotWidth / pixelsPerMeter;
  const maxYMeters = groundY / pixelsPerMeter;
  const step = niceCeil(maxXMeters / 8);

  const toCanvas = (x: number, y: number) => ({
    cx: launchX + x * pixelsPerMeter,
    cy: groundY - y * pixelsPerMeter,
  });

  function drawScene() {
    const sky = ctx.createLinearGradient(0, 0, 0, skyHeight);
    sky.addColorStop(0, "#002366");
    sky.addColorStop(1, "#4169e1");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, skyHeight);

    const ground = ctx.createLinearGradient(0, skyHeight, 0, height);
    ground.addColorStop(0, "#014421");
    ground.addColorStop(1, "#123524");
    ctx.fillStyle = ground;
    ctx.fillRect(0, skyHeight, width, height - skyHeight);

    drawGrid();
  }

  function drawGrid() {
    const gridRight = launchX + plotWidth;

    ctx.save();
    ctx.font = "11px sans-serif";
    ctx.lineWidth = 1;

    // Lignes verticales + distances
    ctx.textAlign = "center";
    for (let i = 0; i * step <= maxXMeters; i++) {
      const x = i * step;
      const { cx } = toCanvas(x, 0);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, groundY);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(`${+x.toFixed(2)} m`, cx, groundY + 16);
    }

    // Lignes horizontales + hauteurs
    ctx.textAlign = "right";
    for (let i = 0; i * step <= maxYMeters; i++) {
      const y = i * step;
      const { cy } = toCanvas(0, y);
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(launchX, cy);
      ctx.lineTo(gridRight, cy);
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.fillText(`${+y.toFixed(2)} m`, launchX - 8, cy + 4);
    }

    // Sol
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.beginPath();
    ctx.moveTo(launchX, groundY);
    ctx.lineTo(gridRight, groundY);
    ctx.stroke();
    ctx.restore();
  }

  function drawTrail() {
    if (trail.length < 2) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.stroke();
    ctx.restore();
  }

  // Affiché en haut à gauche
  function drawReadout(t: number, x: number, y: number) {
    ctx.save();
    ctx.font = "12px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(`t = ${t.toFixed(2)} s`, launchX + 10, 18);
    ctx.fillText(`x = ${x.toFixed(1)} m`, launchX + 10, 34);
    ctx.fillText(`y = ${y.toFixed(1)} m`, launchX + 10, 50);
    ctx.restore();
  }

  function drawFrame(elapsed: number) {
    const pos = calculatePosition(elapsed, params);
    const y = Math.max(pos.y, 0);
    const { cx, cy } = toCanvas(pos.x, y);

    trail.push({ x: cx, y: cy });

    drawScene();
    drawTrail();

    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    drawReadout(elapsed, pos.x, y);
  }

  function animate(timestamp: number) {
    if (stopped) return;
    if (startTime === null) startTime = timestamp;

    const elapsed = Math.min((timestamp - startTime) / 1000, flightTime);
    drawFrame(elapsed);

    if (elapsed >= flightTime) return; // atterri
    animationId = requestAnimationFrame(animate);
  }

  if (autoplay) {
    drawScene();
    animationId = requestAnimationFrame(animate);
  } else {
    drawFrame(0);
  }

  return () => {
    stopped = true;
    cancelAnimationFrame(animationId);
  };
}