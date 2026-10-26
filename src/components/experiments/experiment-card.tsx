import { ExperimentResponse } from "@/types/experiment";
import { ExperimentStatus } from "@/types/experiment";
import { formatDate } from "@/utils/date";
import Link from "next/link";

const STATUS_STYLES: Record<ExperimentStatus, { dot: string; badge: string }> = {
  [ExperimentStatus.DRAFT]: {
    dot: "bg-zinc-400",
    badge: "border-zinc-500/50 bg-zinc-100",
  },
  [ExperimentStatus.PUBLISHED]: {
    dot: "bg-emerald-500",
    badge: "border-emerald-500/50 bg-emerald-100",
  },
};

export default function ExperimentCard({
  experiment,
}: {
  experiment: ExperimentResponse;
}) {
  const style = STATUS_STYLES[experiment.status as ExperimentStatus];

  return (
    <Link href={`/admin/experiments/${experiment.$id}`} className="flex h-full flex-col rounded-xl border border-blue/30 bg-blue/10 p-4 transition-all hover:border-blue/60 hover:bg-blue/20">
      <div className="flex items-center justify-between gap-3">
        <h3 className="line-clamp-1 font-bold text-lg">{experiment.title}</h3>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm capitalize ${style?.badge ?? ""}`}
        >
          <span className={`size-1.5 rounded-full ${style?.dot ?? ""}`} />
          {experiment.status}
        </span>
      </div>

      <p className="line-clamp-3 flex-1 opacity-80 mt-2">
        {experiment.description || "No description yet."}
      </p>

      <p className="border-t border-blue/20 pt-2 text-xs opacity-60 mt-6">
        Updated {formatDate(experiment.$updatedAt)}
      </p>
    </Link>
  );
}