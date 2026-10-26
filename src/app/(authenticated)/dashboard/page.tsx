"use client"

import ExperimentPlayCard from "@/components/experiments/experiment-play-card";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { useAuth } from "@appwrite.io/react";
import { useEffect } from "react";

export default function DashboardPage () {
  const { user, isLoading: authLoading } = useAuth();
  const { experiments, isLoading, error, getAllExperiments } = useExperiment();

  useEffect(() => {
    getAllExperiments();
  }, [getAllExperiments]);

  if (authLoading || !user) return <p>Loading...</p>;

  return (
    <section>
      <h1>Hi { user.name } !</h1>
      <p className="italic text-foreground/60 font-bold">Let&apos;s try new things today.</p>

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