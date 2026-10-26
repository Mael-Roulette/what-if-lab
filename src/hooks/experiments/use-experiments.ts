"use client";

import { useCallback, useState } from "react";
import { getExperiments, getExperimentById } from "@/lib/appwrite/experiment";
import { ExperimentResponse } from "@/types/experiment";

export function useExperiment() {
  const [experiments, setExperiments] = useState<ExperimentResponse[]>([]);
  const [experiment, setExperiment] = useState<ExperimentResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getAllExperiments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getExperiments();
      setExperiments(result.rows);
      return result.rows;
    } catch (err) {
      console.error(err);
      setError("Failed to load experiments.");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getExperiment = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getExperimentById(id);

      if (!result) {
        setExperiment(null);
        setError("Experiment not found.");
        return null;
      }

      setExperiment(result);
      return result;
    } catch (err) {
      console.error(err);
      setError("Failed to load experiment.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    experiments,
    experiment,
    isLoading,
    error,
    getAllExperiments,
    getExperimentById: getExperiment,
  };
}