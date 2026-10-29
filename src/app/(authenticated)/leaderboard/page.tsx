"use client";

import { useEffect } from "react";
import { useScore } from "@/hooks/score/use-score";

const PAGE_SIZE = 10;

const podium = [
  {
    badge: "bg-linear-to-br from-yellow-300 to-amber-500 text-amber-950",
    row: "from-amber-400/20",
  },
  {
    badge: "bg-linear-to-br from-slate-200 to-slate-400 text-slate-900",
    row: "from-slate-300/25",
  },
  {
    badge: "bg-linear-to-br from-orange-300 to-orange-600 text-orange-950",
    row: "from-orange-400/20",
  },
];

function RankBadge({ rank }: { rank: number }) {
  const style = podium[rank - 1]?.badge ?? "bg-blue/10 text-blue";
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold tabular-nums ${style}`}
    >
      {rank}
    </span>
  );
}

function SkeletonRows() {
  return (
    <ul className="divide-y divide-foreground/5">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i} className="flex animate-pulse items-center gap-4 px-4 py-3">
          <div className="size-9 rounded-lg bg-foreground/10" />
          <div className="size-10 rounded-full bg-foreground/10" />
          <div className="h-4 w-32 rounded bg-foreground/10" />
          <div className="ml-auto h-4 w-16 rounded bg-foreground/10" />
        </li>
      ))}
    </ul>
  );
}

export default function LeaderboardPage() {
  const {
    scores,
    hasMore,
    isLoading,
    isLoadingMore,
    error,
    myEntry,
    myRank,
    getAllScores,
    loadMoreScores,
    getMyStanding,
  } = useScore();

  const refresh = () => {
    getAllScores(PAGE_SIZE);
    getMyStanding();
  };

  useEffect(() => {
    getAllScores(PAGE_SIZE);
    getMyStanding();
  }, [getAllScores, getMyStanding]);

  const myUserId = myEntry?.userId ?? null;
  const myName = myEntry?.userName || "You";

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <section className="overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-linear-to-r from-blue to-blue/80 px-5 py-4 text-background">
          <h1>Leaderboard</h1>
          <button
            onClick={refresh}
            disabled={isLoading || isLoadingMore}
            className="rounded-lg bg-background/15 px-3 py-1.5 text-sm font-bold transition hover:bg-background/25 disabled:opacity-50"
          >
            {isLoading ? "Loading…" : "Refresh"}
          </button>
        </header>

        <div className="flex items-center gap-4 border-b border-foreground/5 bg-blue/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground/75">
          <span className="w-9 text-center">Rank</span>
          <span>Player</span>
          <span className="ml-auto">Score</span>
        </div>

        {error && (
          <p role="alert" className="m-4 rounded-lg bg-red-700/10 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {isLoading && scores.length === 0 ? (
          <SkeletonRows />
        ) : scores.length === 0 ? (
          <p className="px-4 py-10 text-center text-foreground/60">
            No scores yet. Be the first to answer a question!
          </p>
        ) : (
          <ol className="divide-y divide-foreground/5">
            {scores.map((entry, index) => {
              const isMe = entry.userId === myUserId;
              const name = entry.userName || `Player ${entry.userId.slice(0, 6)}`;
              const tint = isMe
                ? "from-blue/10"
                : (podium[index]?.row ?? "from-transparent");

              return (
                <li
                  key={entry.$id}
                  className={`relative flex items-center gap-4 bg-linear-to-r to-transparent px-4 py-3 ${tint}`}
                >
                  {isMe && <span className="absolute inset-y-0 left-0 w-1 bg-blue" />}
                  <RankBadge rank={index + 1} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{name}</p>
                    {isMe && (
                      <span className="rounded bg-blue px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide text-background">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-extrabold tabular-nums">
                    {entry.score.toLocaleString()}
                    <span className="ml-1 text-sm font-medium text-foreground/75">pts</span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {hasMore && (
          <div className="border-t border-foreground/5 p-4">
            <button
              onClick={() => loadMoreScores(PAGE_SIZE)}
              disabled={isLoadingMore}
              className="btn-secondary w-full disabled:opacity-50"
            >
              {isLoadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </section>

      <div className="sticky bottom-4 mt-4">
        <div className="flex items-center gap-4 rounded-2xl bg-blue px-4 py-3 text-background">
          {myEntry && myRank !== null ? (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background/20 text-lg font-extrabold tabular-nums">
                {myRank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-background/70">
                  Your position
                </p>
                <p className="truncate font-bold">{myName}</p>
              </div>
              <span className="text-xl font-extrabold tabular-nums">
                {myEntry.score.toLocaleString()}
                <span className="ml-1 text-sm text-background/75">pts</span>
              </span>
            </>
          ) : (
            <p className="w-full text-center text-sm font-medium">
              Answer a question to get on the board!
            </p>
          )}
        </div>
      </div>
    </main>
  );
}