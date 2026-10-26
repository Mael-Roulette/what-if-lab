"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useScore, type SubmitAnswersResult } from "@/hooks/score/use-score";
import type { ExperimentType, PlayerQuestion } from "@/types";
import ProjectileMotion from "./projectile-motion";
import { EarthRotation } from "./earth-rotation";

type Props = {
  experimentType: ExperimentType;
  questions: PlayerQuestion[];
};

type Phase = "questions" | "simulation" | "result";

function Simulation({ type, onFinish }: { type: ExperimentType; onFinish: () => void }) {
  switch (type) {
    case "projectile_motion":
      return <ProjectileMotion editable={false} autoStart onFinish={onFinish} />;
    case "earth_rotation":
      return <EarthRotation duration={10000} onComplete={onFinish} />;
    default:
      return <p>Unknown simulation.</p>;
  }
}

export default function ExperimentPlayer({ experimentType, questions }: Props) {
  const [phase, setPhase] = useState<Phase>("questions");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmitAnswersResult | null>(null);
  const submitted = useRef(false);
  const { submitAnswers, isSubmitting, error } = useScore();

  const allAnswered = questions.every((q) => answers[q.id]);
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleFinish = async () => {
    if (submitted.current) return;
    submitted.current = true;

    const res = await submitAnswers(
      questions.map((q) => ({ questionId: q.id, answer: answers[q.id] }))
    );

    if (res) {
      setResult(res);
      setPhase("result");
    } else {
      submitted.current = false;
    }
  };

  if (phase === "questions") {
    return (
      <div className="flex max-w-3xl mx-auto flex-col gap-6">
        <p className="text-foreground/60 text-center">
          Answer every question, then run the simulation to see if you were right
          (up to {totalPoints} points).
        </p>

        {questions.map((q, i) => (
          <fieldset key={q.id} className="flex flex-col gap-3">
            <legend className="text-lg font-semibold mb-2">
              {i + 1}. {q.question}
              <span className="ml-2 text-sm font-normal text-foreground/60">
                ({q.points} pts)
              </span>
            </legend>

            {q.options.map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border border-blue px-3 py-2 ${
                  answers[q.id] === option ? "bg-blue/20" : ""
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => setAnswers((a) => ({ ...a, [q.id]: option }))}
                  className="focus:outline-none"
                />
                {option}
              </label>
            ))}
          </fieldset>
        ))}

        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => setPhase("simulation")}
          className="btn-primary w-fit disabled:opacity-50"
        >
          Go to the simulation
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      <Simulation type={experimentType} onFinish={handleFinish} />

      {isSubmitting && <p>Checking your answers...</p>}
      {error && <p role="alert">{error}</p>}

      {phase === "result" && result && (
        <div className="flex flex-col gap-4">
          <p className="text-xl font-bold">
            +{result.pointsAwarded} / {totalPoints} points
          </p>

          {questions.map((q, i) => {
            const r = result.results.find((x: { questionId: string; }) => x.questionId === q.id);
            if (!r) return null;
            return (
              <div key={q.id} className="flex flex-col gap-2 rounded-lg border p-4">
                <p className="font-semibold">
                  {i + 1}. {q.question}
                </p>
                <p className={r.isCorrect ? "text-green-600" : "text-red-600"}>
                  {r.isCorrect ? "Correct" : "Not quite"}: you answered &quot;{answers[q.id]}&quot;
                </p>
                {!r.isCorrect && (
                  <p>
                    Correct answer: <strong>{r.correctAnswer}</strong>
                  </p>
                )}
                <p className="text-foreground/80">{r.explanation}</p>
              </div>
            );
          })}

          <Link href="/dashboard" className="btn-primary w-fit">
            Back to dashboard
          </Link>
        </div>
      )}
    </div>
  );
}