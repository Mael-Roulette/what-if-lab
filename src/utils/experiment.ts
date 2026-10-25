import { ExperimentResponse, ExperimentStatus } from "@/types/experiment";

export const countByStatus = (
  experiments: ExperimentResponse[],
  status: ExperimentStatus,
) => {
  return experiments.filter((e) => e.status === status).length
};