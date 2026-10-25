"use client";

import {
  animateProjectile,
  DEFAULT_PARAMS,
  type ProjectileParams,
} from "@/lib/physics/projectile-motion";
import { useEffect, useRef, useState } from "react";
import ProjectileParameters from "./projectile-parameters";

export default function ProjectileMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [params, setParams] = useState<ProjectileParams>(DEFAULT_PARAMS);
  const [run, setRun] = useState<{ params: ProjectileParams; id: number }>({
    params: DEFAULT_PARAMS,
    id: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    return animateProjectile(
      ctx,
      canvas.width,
      canvas.height,
      canvas.height * 0.8,
      run.params,
      { autoplay: run.id > 0 }
    );
  }, [run]);

  return (
    <div className="flex flex-col gap-4">
      <ProjectileParameters params={params} onChange={setParams} />

      <button
        type="button"
        onClick={() => setRun((r) => ({ params: { ...params }, id: r.id + 1 }))}
        className="btn-primary w-fit"
      >
        Play
      </button>

      <canvas ref={canvasRef} width={1200} height={600} className="w-full rounded-lg" />
    </div>
  );
}