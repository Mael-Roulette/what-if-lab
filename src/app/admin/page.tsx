"use client";

import ExperimentCard from "@/components/experiments/experiment-card";
import { useAuth } from "@/hooks/auth/use-auth";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { ExperimentStatus } from "@/types/experiment";
import { countByStatus } from "@/utils/experiment";
import Link from "next/link";
import { useEffect } from "react";
import Loading from "../loading";

const CREATE_HREF = "/admin/experiments/new";

const STATS = [
  { label: "Drafts", status: ExperimentStatus.DRAFT },
  { label: "Published", status: ExperimentStatus.PUBLISHED },
];

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-blue/30 bg-blue/10 px-4 py-3">
      <p className="text-2xl font-semibold leading-none">{value}</p>
      <p className="mt-1.5 text-sm capitalize opacity-70">{label}</p>
    </div>
  );
}

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth({ admin: true });
  const { experiments, isLoading, error, getAllExperiments } = useExperiment();

  useEffect(() => {
    getAllExperiments();
  }, [getAllExperiments]);

  if (authLoading || !user) return <Loading />;

  const ready = !isLoading && !error;

  return (
    <div>
      <div className="mb-6 flex flex-col">
        <div className="mb-2 flex flex-wrap gap-2">
          {user.labels.map((label) => (
            <p
              key={label}
              className="w-fit rounded-full border border-blue bg-blue/10 px-2 py-0.5 text-sm capitalize"
            >
              {label}
            </p>
          ))}
        </div>
        <h1 className="leading-none">Welcome {user.name}!</h1>
      </div>

      <section className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Total" value={experiments.length} />
        {STATS.map(({ label, status }) => (
          <Stat key={status} label={label} value={countByStatus(experiments, status)} />
        ))}
      </section>

      <section className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2>Experiments</h2>
            {ready && (
              <span className="rounded-full border border-blue/30 bg-blue/10 px-2 py-0.5 text-sm">
                {experiments.length}
              </span>
            )}
          </div>
          <Link href={CREATE_HREF} className="btn-primary">
            Create experiment
          </Link>
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p role="alert">{error}</p>
        ) : experiments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-blue/40 px-6 py-14 text-center">
            <p className="font-medium">No experiments yet</p>
            <p className="max-w-xs text-sm opacity-70">
              Create your first experiment to start collecting results.
            </p>
            <Link href={CREATE_HREF} className="btn-primary">
              Create experiment
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {experiments.map((experiment) => (
              <li key={experiment.$id}>
                <ExperimentCard experiment={experiment} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}