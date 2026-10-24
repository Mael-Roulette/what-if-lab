"use client";

import type { ProjectileParams } from "@/lib/physics/projectileMotion";

type Props = {
  params: ProjectileParams;
  onChange: (params: ProjectileParams) => void;
};

type SliderProps = {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

function Slider({ label, unit, value, min, max, step, onChange }: SliderProps) {
  return (
    <label className="flex flex-col text-sm">
      <span className="flex items-center gap-1">
        <span>{label} : </span>
        <span className="font-bold">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export default function ProjectileParameters({ params, onChange }: Props) {
  const set = (patch: Partial<ProjectileParams>) => onChange({ ...params, ...patch });

  return (
    <div className="grid gap-4 rounded-lg border border-foreground p-4 sm:grid-cols-3">
      <Slider label="Speed" unit="m/s" value={params.speed} min={1} max={50} step={1}
        onChange={(speed) => set({ speed })} />
      <Slider label="Angle" unit="°" value={params.angle} min={5} max={85} step={1}
        onChange={(angle) => set({ angle })} />
      <Slider label="Gravity" unit="m/s²" value={params.gravity} min={1} max={25} step={0.1}
        onChange={(gravity) => set({ gravity })} />
    </div>
  );
}