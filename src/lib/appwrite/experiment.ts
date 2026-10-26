"use server";

import { tablesDB } from "./appwrite";
import { ExperimentRequest, ExperimentResponse } from "@/types/experiment";
import { ParameterRequest } from "@/types";
import { AppwriteException, ID, Permission, Role } from "node-appwrite";

const databaseId = process.env.NEXT_PUBLIC_DATABASE_ID;
const experimentTableId = process.env.NEXT_PUBLIC_EXPERIMENT_TABLE_ID;
const parameterTableId = process.env.NEXT_PUBLIC_PARAMETER_TABLE_ID;

if (!databaseId || !experimentTableId || !parameterTableId) {
  throw new Error(
    "You must set NEXT_PUBLIC_DATABASE_ID, NEXT_PUBLIC_EXPERIMENT_TABLE_ID and NEXT_PUBLIC_PARAMETER_TABLE_ID"
  );
}

export const createExperiment = async (request: ExperimentRequest) => {
  const row = await tablesDB.createRow({
    databaseId,
    tableId: experimentTableId,
    rowId: ID.unique(),
    data: request,
    permissions: [Permission.read(Role.users())],
  });

  return { id: row.$id };
};

export const createExperimentParameters = async (
  request: ParameterRequest,
  experimentId: string
) => {
  await tablesDB.createRow({
    databaseId,
    tableId: parameterTableId,
    rowId: ID.unique(),
    data: { ...request, experimentId },
    permissions: [Permission.read(Role.users())],
  });

  return { ok: true };
};

export const getExperiments = async () => {
  try {
    const result = await tablesDB.listRows<ExperimentResponse>({
      databaseId,
      tableId: experimentTableId,
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

export const getExperimentById = async (id: string) => {
  try {
    const row = await tablesDB.getRow<ExperimentResponse>({
      databaseId,
      tableId: experimentTableId,
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
};