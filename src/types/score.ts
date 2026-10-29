import type { Models } from "node-appwrite";

export type UserScoreResponse = Models.Row & {
  userId: string;
  userName: string;
  score: number;
};