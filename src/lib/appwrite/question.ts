"use server";

import { tablesDB } from "./appwrite";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";
import { QuestionRequest, QuestionResponse } from "@/types";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const questionTableId = process.env.NEXT_PUBLIC_QUESTION_TABLE_ID;


if (!databaseId || !questionTableId) {
  throw new Error(
    "You must set NEXT_PUBLIC_DATABASE_ID and NEXT_PUBLIC_QUESTION_TABLE_ID"
  );
}

export const createQuestion = async (
  request: QuestionRequest,
  experimentId: string
) => {
  await tablesDB.createRow({
    databaseId,
    tableId: questionTableId,
    rowId: ID.unique(),
    data: { ...request, experimentId },
    permissions: [Permission.read(Role.users())],
  });

  return { ok: true };
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
