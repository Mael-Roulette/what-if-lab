"use client"

import ExperimentPlayCard from "@/components/experiments/experiment-play-card";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useEffect } from "react";

export default function ExperimentsPage () {
  const { experiments, isLoading, error, getAllExperiments } = useExperiment();

  useEffect(() => {
    getAllExperiments();
  }, [getAllExperiments]);

  return (
    <section className="flex flex-col">
      <h1 className="text-center">Experiments</h1>
      <p className="text-foreground/60 text-center mb-6">Pick an experiments.</p>

      {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : experiments.length === 0 ? (
          <p>We don&apos;t have any experiments sorry.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mt-4">
            {experiments.map((experiment) => (
              <li key={experiment.$id}>
                <ExperimentPlayCard experiment={experiment} />
              </li>
            ))}
          </ul>
        )}
    </section>
  )
}