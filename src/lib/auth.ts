import { redirect } from "next/navigation";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import { appwrite } from "@/lib/appwrite";

/**
 * Use in server components of protected pages.
 * Returns the logged-in user or redirects to /auth.
 */
export async function requireUser() {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
}