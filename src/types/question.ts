import { Models } from "appwrite";

export type QuestionRequest = {
  question: string;
  correctAnswer: string;
  explanation: string;
  points: number;
  experimentId: string | null;
}

export interface QuestionResponse extends Models.Row {
  question: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  points: number;
  experimentId: string;
}

export type PlayerQuestion = {
  id: string;
  question: string;
  points: number;
  options: string[];
};