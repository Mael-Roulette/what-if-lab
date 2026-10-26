import Link from "next/link";
import { ExperimentResponse } from "@/types/experiment";

export default function ExperimentPlayCard({ experiment }: { experiment: ExperimentResponse }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-lg border p-4">
      <h2 className="font-bold">{experiment.title}</h2>
      <p className="flex-1 text-sm text-foreground/60">{experiment.description}</p>
      <Link href={`/experiments/${experiment.$id}`} className="btn-primary w-fit">
        Play
      </Link>
    </div>
  );
}