"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuestions } from "@/hooks/questions/use-questions";

export default function StandaloneQuestionsPage() {
  const { standaloneQuestions, isLoading, error, getStandaloneQuestions } = useQuestions();

  useEffect(() => {
    getStandaloneQuestions();
  }, [getStandaloneQuestions]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (standaloneQuestions.length === 0) return <p>No questions yet.</p>;

  return (
    <section className="flex flex-col">
      <h1 className="text-center">Questions</h1>
      <p className="text-foreground/60 text-center mb-6">Pick a question to answer.</p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {standaloneQuestions.map((q) => (
          <li key={q.id}>
            <Link
              href={`/questions/${q.id}`}
              className="flex h-full flex-col gap-2 rounded-lg border border-blue p-4 transition hover:bg-blue/20"
            >
              <span className="font-semibold">{q.question}</span>
              <span className="mt-auto text-sm text-foreground/60">{q.points} pts</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}