"use server";

import type { QuestionResponse, UserScoreResponse } from "@/types";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import { AppwriteException, Permission, Query, Role } from "node-appwrite";
import { tablesDB } from "./appwrite";
import { appwrite } from "./config";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const scoreTableId = process.env.NEXT_PUBLIC_SCORE_TABLE_ID;
const questionTableId = process.env.NEXT_PUBLIC_QUESTION_TABLE_ID;

if (!databaseId || !scoreTableId || !questionTableId) {
  throw new Error(
    "You must set NEXT_PUBLIC_DATABASE_ID, NEXT_PUBLIC_SCORE_TABLE_ID and NEXT_PUBLIC_QUESTION_TABLE_ID"
  );
}

function isSameAnswer(given: string, expected: string) {
  const a = Number(given.replace(",", "."));
  const b = Number(expected.replace(",", "."));

  if (given.trim() !== "" && !Number.isNaN(a) && !Number.isNaN(b)) {
    return Math.abs(a - b) <= Math.abs(b) * 0.01; // 1% tolerance
  }
  return given.trim().toLowerCase() === expected.trim().toLowerCase();
}

const isNotFound = (error: unknown) =>
  error instanceof AppwriteException &&
  (error.type === "row_not_found" || Number(error.code) === 404);

export const submitAnswer = async (questionId: string, answer: string) => {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();
  if (!user) throw new Error("Not authenticated");

  const question = await tablesDB.getRow<QuestionResponse>({
    databaseId,
    tableId: questionTableId,
    rowId: questionId,
  });

  const isCorrect = isSameAnswer(answer, question.correctAnswer);
  let newScore: number | null = null;

  if (isCorrect) {
    try {
      const row = await tablesDB.getRow<UserScoreResponse>({
        databaseId,
        tableId: scoreTableId,
        rowId: user.$id,
      });
      const updated = await tablesDB.updateRow<UserScoreResponse>({
        databaseId,
        tableId: scoreTableId,
        rowId: user.$id,
        data: { score: (row.score ?? 0) + question.points },
      });
      newScore = updated.score;
    } catch (error) {
      if (isNotFound(error)) {
        await tablesDB.createRow({
          databaseId,
          tableId: scoreTableId,
          rowId: user.$id,
          data: { userId: user.$id, score: question.points },
          permissions: [Permission.read(Role.user(user.$id))],
        });
        newScore = question.points;
      } else {
        throw error;
      }
    }
  }

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    pointsAwarded: isCorrect ? question.points : 0,
    newScore,
  };
};

export const getUserScore = async () => {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();
  if (!user) throw new Error("Not authenticated");

  try {
    const row = await tablesDB.getRow<UserScoreResponse>({
      databaseId,
      tableId: scoreTableId,
      rowId: user.$id,
    });
    return JSON.parse(JSON.stringify(row)) as typeof row;
  } catch (error: unknown) {
    if (isNotFound(error)) return null; // no points yet
    console.error(error);
    throw error;
  }
};

export const getUserRank = async (score: number) => {
  try {
    const result = await tablesDB.listRows({
      databaseId,
      tableId: scoreTableId,
      queries: [Query.greaterThan("score", score), Query.limit(1)],
      ttl: 0,
    });
    return result.total + 1;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const getScores = async ({
  limit = 10,
  cursor,
  ttl = 0,
}: { limit?: number; cursor?: string | null; ttl?: number } = {}) => {
  try {
    const queries = [
      Query.orderDesc("score"),
      Query.limit(limit + 1), // fetch one extra to know if there's a next page
    ];
    if (cursor) queries.push(Query.cursorAfter(cursor));

    const result = await tablesDB.listRows<UserScoreResponse>({
      databaseId,
      tableId: scoreTableId,
      queries,
      ttl,
      total: false,
    });

    const plain = JSON.parse(JSON.stringify(result)) as typeof result;
    const hasMore = plain.rows.length > limit;

    return {
      rows: hasMore ? plain.rows.slice(0, limit) : plain.rows,
      hasMore,
    };
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

async function addPoints(userId: string, userName: string, delta: number) {
  try {
    const row = await tablesDB.getRow<UserScoreResponse>({
      databaseId: databaseId!,
      tableId: scoreTableId!,
      rowId: userId,
    });
    const previous = row.score ?? 0;
    const next = Math.max(0, previous + delta);

    if (next !== previous) {
      await tablesDB.updateRow<UserScoreResponse>({
        databaseId: databaseId!,
        tableId: scoreTableId!,
        rowId: userId,
        data: { userName, score: next },
      });
    }
    return { score: next, applied: next - previous };
  } catch (error) {
    if (!isNotFound(error)) throw error;

    const initial = Math.max(0, delta);
    await tablesDB.createRow({
      databaseId: databaseId!,
      tableId: scoreTableId!,
      rowId: userId,
      data: { userId, userName, score: initial },
      permissions: [Permission.read(Role.user(userId))],
    });
    return { score: initial, applied: initial };
  }
}

export const submitAnswers = async (
  answers: { questionId: string; answer: string }[]
) => {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();
  if (!user) throw new Error("Not authenticated");

  const results = await Promise.all(
    answers.map(async ({ questionId, answer }) => {
      const q = await tablesDB.getRow<QuestionResponse>({
        databaseId: databaseId!,
        tableId: questionTableId!,
        rowId: questionId,
      });
      const isCorrect = isSameAnswer(answer, q.correctAnswer);
      return {
        questionId,
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        pointsAwarded: isCorrect ? q.points : -5,
      };
    })
  );

  const delta = results.reduce((sum, r) => sum + r.pointsAwarded, 0);

  let newScore: number | null = null;
  let pointsAwarded = 0;

  if (delta !== 0) {
    const res = await addPoints(user.$id, user.name, delta);
    newScore = res.score;
    pointsAwarded = res.applied;
  }

  return { results, pointsAwarded, newScore };
};