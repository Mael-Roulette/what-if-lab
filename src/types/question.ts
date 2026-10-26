import { Models } from "appwrite";

export type QuestionRequest = {
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
  experimentId: string;
}

export interface QuestionResponse extends Models.Row {
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
  experimentId: string;
}