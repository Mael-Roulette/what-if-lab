"use client";

import { useEffect, useRef, useState } from "react";

interface EarthRotationProps {
  duration?: number;
  afterStopDuration?: number;
  onComplete?: () => void;
}

export function EarthRotation({
  duration = 4000,
  afterStopDuration = 5000,
  onComplete,
}: EarthRotationProps) {
  const [earthAngle, setEarthAngle] = useState(0);
  const [objectAngle, setObjectAngle] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const animationFrame = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const elapsed = useRef(0);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    if (!isRunning) return;

    const totalDuration = duration + afterStopDuration;

    const animate = (time: number) => {
      if (lastTime.current === null) {
        lastTime.current = time;
      }

      const deltaTime = time - lastTime.current;
      lastTime.current = time;
      onCompleteRef.current = onComplete;

      elapsed.current += deltaTime;

      //PHASE 1 — Earth slows down
      if (elapsed.current <= duration) {
        const progress = Math.min(elapsed.current / duration, 1);

        /*
         * Earth starts at full speed and progressively
         * slows down until it completely stops.
         */
        const rotationSpeed = 1 - progress;
        setEarthAngle((angle) => angle + rotationSpeed * 0.8);

        /*
         * The object continues at constant speed.
         */
        setObjectAngle((angle) => angle + 0.8);
      }

      //PHASE 2 — Earth is stopped
      else if (elapsed.current <= totalDuration) {
        /*
         * EarthAngle is not modified anymore.
         * The Earth remains completely stopped.
         */

        /*
         * The object keeps moving because of inertia.
         */
        setObjectAngle((angle) => angle + 0.8);
      }

      // Simulation complete
      else {
        setIsRunning(false);
        setIsComplete(true);

        lastTime.current = null;
        elapsed.current = 0;

        onCompleteRef.current?.();

        return;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isRunning, duration, afterStopDuration, onComplete]);

  const startSimulation = () => {
    setEarthAngle(0);
    setObjectAngle(0);

    elapsed.current = 0;
    lastTime.current = null;

    setIsComplete(false);
    setIsRunning(true);
  };

  const resetSimulation = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
    }

    setEarthAngle(0);
    setObjectAngle(0);

    elapsed.current = 0;
    lastTime.current = null;

    setIsRunning(false);
    setIsComplete(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[500px] w-full max-w-3xl overflow-hidden rounded-2xl bg-slate-950">
        {/* Stars */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute left-[10%] top-[15%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[25%] top-[30%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[75%] top-[20%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[85%] top-[65%] h-1 w-1 rounded-full bg-white" />
          <div className="absolute left-[15%] top-[75%] h-1 w-1 rounded-full bg-white" />
        </div>

        {/* Earth */}
        <div
          className="absolute left-1/2 top-1/2 h-64 w-64 rounded-full bg-blue-500 shadow-2xl"
          style={{
            transform: `translate(-50%, -50%) rotate(${earthAngle}deg)`,
          }}
        >
          {/* Continents */}
          <div className="absolute left-12 top-10 h-20 w-12 rounded-[50%] bg-green-600" />
          <div className="absolute right-10 top-16 h-16 w-14 rounded-[45%] bg-green-600" />
          <div className="absolute bottom-8 left-20 h-14 w-20 rounded-[50%] bg-green-600" />

          {/* Atmosphere */}
          <div className="absolute inset-0 rounded-full outline-8 outline-blue-300/20" />
        </div>

        {/* Object */}
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{
            transform: `translate(-50%, -50%) rotate(${objectAngle}deg)`,
          }}
        >
          <div className="absolute -translate-x-1/2 -translate-y-[120px]">
            <div className="h-8 w-8 rounded-md bg-red-500 shadow-lg shadow-red-500/30" />

            <div className="mt-2 whitespace-nowrap text-xs text-white">
              Object
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="absolute left-4 top-4 rounded-lg bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
          {isComplete
            ? "Simulation complete"
            : !isRunning
              ? "Ready"
              // eslint-disable-next-line react-hooks/refs
              : elapsed.current < duration
                ? "Earth is slowing down..."
                : "Earth stopped - object continues moving"}
        </div>
      </div>

      {/* Explanation */}
      <div className="max-w-2xl text-center">
        {!isComplete ? (
          <p className="text-sm text-slate-500">
            When Earth stops rotating, the object does not instantly stop with
            the surface. It keeps moving because of inertia.
          </p>
        ) : (
          <p className="text-sm font-medium text-slate-700">
            Earth has stopped rotating, but the object continued moving.
            That&apos;s inertia.
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!isComplete ? (
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? "Simulation running..." : "Play simulation"}
          </button>
        ) : (
          <button
            onClick={resetSimulation}
            className="rounded-lg border border-slate-300 px-5 py-3 font-medium transition hover:bg-slate-100"
          >
            Run again
          </button>
        )}
      </div>
    </div>
  );
}