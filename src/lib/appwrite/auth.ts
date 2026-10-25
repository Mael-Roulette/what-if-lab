import { redirect } from "next/navigation";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import { appwrite } from "@/lib/appwrite/config";
import { cache } from "react";

/**
 * Use in server components of protected pages.
 * Returns the logged-in user or redirects to /auth.
 */
export const requireUser = cache( async () => {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
})

export const requireAdmin = cache( async () => {
  const user = await requireUser();

  if ( !user.labels.find( label => label === "admin" ) ) {
    redirect("/dashboard");
  }

  return user;
})