import { redirect } from "next/navigation";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import { appwrite } from "@/lib/appwrite/config";
import { cache } from "react";
import { SessionUser } from "@/types/user";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  if (!user) return null;

  return {
    $id: user.$id,
    name: user.name,
    email: user.email,
    labels: [...user.labels],
    $createdAt: user.$createdAt,
    $updatedAt: user.$updatedAt,
  };
});

export const requireUser = cache(async (): Promise<SessionUser> => {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");
  return user;
});

export const requireAdmin = cache(async (): Promise<SessionUser> => {
  const user = await requireUser();
  if (!user.labels.includes("admin")) redirect("/dashboard");
  return user;
});