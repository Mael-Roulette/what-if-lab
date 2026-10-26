"use client";

import { useCallback, useState } from "react";
import { getScores, getUserScore, submitAnswers } from "@/lib/appwrite/score";
import type { UserScoreResponse } from "@/types";

export type SubmitAnswersResult = Awaited<ReturnType<typeof submitAnswers>>;

export function useScore() {
  const [scores, setScores] = useState<UserScoreResponse[]>([]);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const getAllScores = useCallback(async (limit = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getScores(limit);
      setScores(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      setError("Failed to load scores.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submit = useCallback(
    async (answers: { questionId: string; answer: string }[]) => {
      setIsSubmitting(true);
      setError(null);
      try {
        const result = await submitAnswers(answers);
        if (result.newScore !== null) setScore(result.newScore);
        return result;
      } catch (err) {
        console.error(err);
        setError("Could not check your answers. Please try again.");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    score,
    scores,
    isLoading,
    isSubmitting,
    error,
    getMyScore,
    getAllScores,
    submitAnswers: submit,
  };
}