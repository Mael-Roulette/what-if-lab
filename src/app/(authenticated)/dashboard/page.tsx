"use client"

import ExperimentPlayCard from "@/components/experiments/experiment-play-card";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useQuestions } from "@/hooks/questions/use-questions";
import { useAuth } from "@appwrite.io/react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardPage () {
  const { user, isLoading: authLoading } = useAuth();
  const { experiments, isLoading: experimentsLoading, error: experimentsError, getAllExperiments } = useExperiment();
  const { standaloneQuestions, isLoading: questionsLoading, error: questionsError, getStandaloneQuestions } = useQuestions();

  useEffect(() => {
    getAllExperiments();
    getStandaloneQuestions();
  }, [getAllExperiments, getStandaloneQuestions]);

  if (authLoading || !user) return <p>Loading...</p>;

  return (
    <section>
      <h1>Hi { user.name } !</h1>
      <p className="italic text-foreground/60 font-bold mb-8">Let&apos;s try new things today.</p>

      <div className="flex flex-col gap-3 mb-8">
        <h2>Experiments</h2>
        {experimentsLoading ? (
            <p>Loading experiments...</p>
          ) : experimentsError ? (
            <p role="alert">{experimentsError}</p>
          ) : experiments.length === 0 ? (
            <p>We don&apos;t have any experiments sorry.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {experiments.slice(0, 3).map((experiment) => (
                <li key={experiment.$id}>
                  <ExperimentPlayCard experiment={experiment} />
                </li>
              ))}
            </ul>
          )}
      </div>

      <div className="flex flex-col gap-3">
        <h2>Questions</h2>
        {questionsLoading ? (
            <p>Loading questions...</p>
          ) : questionsError ? (
            <p role="alert">{questionsError}</p>
          ) : standaloneQuestions.length === 0 ? (
            <p>We don&apos;t have any questions sorry.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {standaloneQuestions.slice(0, 3).map((question) => (
                <li key={question.id}>
                  <Link
                    href={`/questions/${question.id}`}
                    className="flex h-full flex-col gap-2 rounded-lg border border-blue p-4 transition hover:bg-blue/20"
                  >
                    <span className="font-semibold">{question.question}</span>
                    <span className="mt-auto text-sm text-foreground/60">{question.points} pts</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </div>
    </section>
  )
}