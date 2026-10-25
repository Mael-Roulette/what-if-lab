import { Models } from "appwrite";

export type ExperimentRequest = {
  title: string;
  description: string;
  status: ExperimentStatus;
}

export enum ExperimentStatus {
  DRAFT = "draft",
  PUBLISHED = "published"
}

export interface ExperimentResponse extends Models.Row {
  title: string;
  description: string;
  status: ExperimentStatus;
}