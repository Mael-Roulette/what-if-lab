"use client";

import Loading from "@/app/loading";
import { useExperiment } from "@/hooks/experiments/use-experiments";
import { ExperimentStatus } from "@/types/experiment";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";

const BACK_HREF = "/admin";

const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm opacity-70">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export default function ExperimentPage() {
  const { id } = useParams<{ id: string }>();
  const { experiment, isLoading, error, getExperimentById } = useExperiment();

  useEffect(() => {
    getExperimentById(id);
  }, [id, getExperimentById]);

  if (isLoading) return <Loading />;
  if (error) return <p role="alert">{error}</p>;
  if (!experiment) notFound();

  const isPublished = experiment.status === ExperimentStatus.PUBLISHED;

  return (
    <div>
      <Link href={BACK_HREF} className="link">
        Back to experiments
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span
            className={`w-fit rounded-full border px-2 py-0.5 text-sm capitalize ${
              isPublished
                ? "border-blue bg-blue/10"
                : "border-blue/30 bg-blue/5 opacity-80"
            }`}
          >
            {experiment.status}
          </span>
          <h1 className="leading-none">{experiment.title}</h1>
        </div>

        <Link href={`/admin/experiments/${experiment.$id}/edit`} className="btn-primary">
          Edit experiment
        </Link>
      </header>

      <section className="mt-6 rounded-xl border border-blue/30 bg-blue/10 p-6">
        <h2 className="mb-2">Description</h2>
        <p className="whitespace-pre-wrap">
          {experiment.description || (
            <span className="opacity-70">No description provided.</span>
          )}
        </p>
      </section>

      <section className="mt-3 rounded-xl border border-blue/30 bg-blue/10 p-6">
        <h2 className="mb-4">Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Info label="Status">
            <span className="capitalize">{experiment.status}</span>
          </Info>
          <Info label="Created">
            {dateFormatter.format(new Date(experiment.$createdAt))}
          </Info>
          <Info label="Last updated">
            {dateFormatter.format(new Date(experiment.$updatedAt))}
          </Info>
        </dl>
      </section>
    </div>
  );
}