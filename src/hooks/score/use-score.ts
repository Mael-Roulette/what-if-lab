"use client";

import { useCallback, useRef, useState } from "react";
import { getScores, getUserRank, getUserScore, submitAnswers } from "@/lib/appwrite/score";
import type { UserScoreResponse } from "@/types";

export type SubmitAnswersResult = Awaited<ReturnType<typeof submitAnswers>>;

export function useScore() {
  const [myEntry, setMyEntry] = useState<UserScoreResponse | null>(null);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [scores, setScores] = useState<UserScoreResponse[]>([]);
  const [score, setScore] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // $id of the last row currently displayed
  const cursorRef = useRef<string | null>(null);

  const getMyStanding = useCallback(async () => {
    try {
      const row = (await getUserScore()) as UserScoreResponse | null;
      if (!row) {
        setMyEntry(null);
        setMyRank(null);
        return;
      }
      const value = row.score ?? 0;
      setMyEntry(row);
      setScore(value);
      setMyRank(await getUserRank(value));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getMyScore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserScore();
      const value = result?.score ?? 0;
      setScore(value);
      return value;
    } catch (err) {
      console.error(err);
      setError("Failed to load your score.");
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // First page
  const getAllScores = useCallback(async (limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const { rows, hasMore } = await getScores({ limit, ttl: 0 });
      setScores(rows);
      setHasMore(hasMore);
      cursorRef.current = rows.at(-1)?.$id ?? null;
      return rows;
    } catch (err) {
      console.error(err);
      setError("Failed to load scores.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Next page
  const loadMoreScores = useCallback(async (limit = 10) => {
    if (!cursorRef.current) return [];
    setIsLoadingMore(true);
    setError(null);
    try {
      const { rows, hasMore } = await getScores({
        limit,
        cursor: cursorRef.current,
        ttl: 0,
      });
      setScores((prev) => {
        const seen = new Set(prev.map((r) => r.$id));
        return [...prev, ...rows.filter((r) => !seen.has(r.$id))];
      });
      setHasMore(hasMore);
      cursorRef.current = rows.at(-1)?.$id ?? cursorRef.current;
      return rows;
    } catch (err) {
      console.error(err);
      setError("Failed to load more scores.");
      return [];
    } finally {
      setIsLoadingMore(false);
    }
  }, []);

  const submit = useCallback(
    async (answers: { questionId: string; answer: string }[]) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await submitAnswers(answers);
        if (result.newScore !== null) {
          setScore(result.newScore);
          void getMyStanding(); // refresh rank + pinned bar
        }
        return result;
      } catch (err) {
        console.error(err);
        setError("Could not check your answers. Please try again.");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [getMyStanding]
  );

  return {
    score,
    scores,
    myEntry,
    myRank,
    hasMore,
    isLoading,
    isLoadingMore,
    isSubmitting,
    error,
    getMyScore,
    getMyStanding,
    getAllScores,
    loadMoreScores,
    submitAnswers: submit,
  };
}