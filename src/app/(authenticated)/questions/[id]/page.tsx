"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ExperimentPlayer from "@/components/experiments/simulations/experiment-player";
import { useQuestions } from "@/hooks/questions/use-questions";

export default function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const { playerQuestion, isLoading, error, getPlayerQuestion } = useQuestions();

  useEffect(() => {
    getPlayerQuestion(id);
  }, [id, getPlayerQuestion]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!playerQuestion) return null;

  return (
    <section className="flex flex-col gap-4">
      <Link href="/questions" className="w-fit text-sm text-foreground/60 hover:underline">
        ← Back to all questions
      </Link>
      <ExperimentPlayer questions={[playerQuestion]} backHref="/questions" backLabel="Back to questions" />
    </section>
  );
}