"use server";

import { getCurrentUser } from "@/lib/appwrite/auth";
import { SessionUser } from "@/types/user";

export const getSessionUser = async (): Promise<SessionUser | null> => {
  return getCurrentUser();
};