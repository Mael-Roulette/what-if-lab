"use client";

import Loading from "@/app/loading";
import ExperimentPlayer from "@/components/experiments/simulations/experiment-player";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useQuestions } from "@/hooks/questions/use-questions";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

export default function ExperimentPage() {
  const { id } = useParams<{ id: string }>();

  const {
    experiment,
    isLoading: experimentLoading,
    error: experimentError,
    getExperimentById,
  } = useExperiment();

  const { experimentQuestions, isLoading: questionLoading, error: questionError, getExperimentQuestions } = useQuestions();

  useEffect(() => {
    getExperimentById(id);
    getExperimentQuestions(id);
  }, [id, getExperimentById, getExperimentQuestions]);

  if (experimentLoading || questionLoading) return <Loading />;

  const error = experimentError ?? questionError;
  if (error) return <p role="alert">{error}</p>;

  if (!experiment || experiment.status !== "published") notFound();
  if (!experimentQuestions) return <p>This experiment has no questions yet.</p>;

  return (
    <section className="flex flex-col">
      <h1 className="text-center">{experiment.title}</h1>
      <ExperimentPlayer experimentType={experiment.type} questions={experimentQuestions} />
    </section>
  );
}