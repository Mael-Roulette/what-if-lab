"use server";

import { tablesDB } from "./appwrite";
import { AppwriteException, ID, Permission, Query, Role } from "node-appwrite";
import { PlayerQuestion, QuestionRequest, QuestionResponse } from "@/types";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const questionTableId = process.env.NEXT_PUBLIC_QUESTION_TABLE_ID;


if (!databaseId || !questionTableId) {
  throw new Error(
    "You must set NEXT_PUBLIC_DATABASE_ID and NEXT_PUBLIC_QUESTION_TABLE_ID"
  );
}

export const createQuestion = async (
  request: QuestionRequest
) => {
  await tablesDB.createRow({
    databaseId,
    tableId: questionTableId,
    rowId: ID.unique(),
    data: request,
    permissions: [Permission.read(Role.users())],
  });

  return { ok: true };
}

export const updateQuestion = async (
  questionId: string,
  request: QuestionRequest
) => {
  await tablesDB.updateRow({
    databaseId,
    tableId: questionTableId,
    rowId: questionId,
    data: request
  })
}

export const deleteQuestion = async (
  questionId: string
) => {
  await tablesDB.deleteRow({
    databaseId,
    tableId: questionTableId,
    rowId: questionId
  })
}

export const getQuestions = async () => {
  try {
    const result = await tablesDB.listRows<QuestionResponse>({
      databaseId,
      tableId: questionTableId,
    });

    return JSON.parse(JSON.stringify(result)) as typeof result;
  } catch (error: unknown) {
    if (error instanceof AppwriteException) {
      console.error(error.code, error.message, error.response);
    } else {
      console.error(error);
    }
    throw error;
  }
};

export const getQuestionById = async (id: string) => {
  try {
    const row = await tablesDB.getRow<QuestionResponse>({
      databaseId,
      tableId: questionTableId,
      rowId: id,
    });

    return JSON.parse(JSON.stringify(row)) as typeof row;
  } catch (error: unknown) {
    if (
      error instanceof AppwriteException &&
      (error.type === "row_not_found" || Number(error.code) === 404)
    ) {
      return null;
    }

    if (error instanceof AppwriteException) {
      console.error(error.code, error.message, error.response);
    } else {
      console.error(error);
    }
    throw error;
  }
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const getQuestionsForExperiment = async (
  experimentId: string
): Promise<PlayerQuestion[]> => {
  const result = await tablesDB.listRows<QuestionResponse>({
    databaseId,
    tableId: questionTableId,
    queries: [Query.equal("experimentId", experimentId), Query.limit(25)],
  });

  // No correctAnswer, no explanation. Shuffled so the right one isn't always first.
  return result.rows.map((q) => ({
    id: q.$id,
    question: q.question,
    points: q.points,
    options: shuffle(q.options),
  }));
};

export const getStandaloneQuestions = async (): Promise<PlayerQuestion[]> => {
  const result = await tablesDB.listRows<QuestionResponse>({
    databaseId,
    tableId: questionTableId,
    queries: [Query.isNull("experimentId"), Query.limit(25)],
  });

  return result.rows.map((q) => ({
    id: q.$id,
    question: q.question,
    points: q.points,
    options: shuffle(q.options),
  }));
};

export const getPlayerQuestionById = async (
  id: string
): Promise<PlayerQuestion | null> => {
  try {
    const row = await tablesDB.getRow<QuestionResponse>({
      databaseId,
      tableId: questionTableId,
      rowId: id,
    });

    // Only standalone questions are playable here.
    // Questions linked to an experiment go through /experiments/[id].
    if (row.experimentId) return null;

    return {
      id: row.$id,
      question: row.question,
      points: row.points,
      options: shuffle(row.options),
    };
  } catch (error: unknown) {
    if (
      error instanceof AppwriteException &&
      (error.type === "row_not_found" || Number(error.code) === 404)
    ) {
      return null;
    }
    console.error(error);
    throw error;
  }
};