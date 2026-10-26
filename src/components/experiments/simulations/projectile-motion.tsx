"use client";

import {
  animateProjectile,
  DEFAULT_PARAMS,
  type ProjectileParams,
} from "@/lib/physics/projectile-motion";
import { useEffect, useRef, useState } from "react";
import ProjectileParameters from "./projectile-parameters";

type Props = {
  initialParams?: ProjectileParams;
  editable?: boolean;
  autoStart?: boolean;
  onFinish?: () => void;
};

export default function ProjectileMotion({
  initialParams = DEFAULT_PARAMS,
  editable = true,
  autoStart = false,
  onFinish,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onFinishRef = useRef(onFinish);
  // eslint-disable-next-line react-hooks/refs
  onFinishRef.current = onFinish;

  const [params, setParams] = useState<ProjectileParams>(initialParams);
  const [run, setRun] = useState<{ params: ProjectileParams; id: number }>({
    params: initialParams,
    id: autoStart ? 1 : 0,
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
      { autoplay: run.id > 0, onFinish: () => onFinishRef.current?.() }
    );
  }, [run]);

  return (
    <div className="flex flex-col gap-4">
      {editable && (
        <>
          <ProjectileParameters params={params} onChange={setParams} />
          <button
            type="button"
            onClick={() => setRun((r) => ({ params: { ...params }, id: r.id + 1 }))}
            className="btn-primary w-fit"
          >
            Play
          </button>
        </>
      )}
      <canvas ref={canvasRef} width={1200} height={600} className="w-full rounded-lg" />
    </div>
  );
}