"use client";

import { getSessionUser } from "@/lib/appwrite/session";
import { SessionUser } from "@/types/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth({ admin = false }: { admin?: boolean } = {}) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await getSessionUser();
        if (cancelled) return;

        if (!result) {
          return;
        }
        if (admin && !result.labels.includes("admin")) {
          router.replace("/dashboard");
          return;
        }
        setUser(result);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Failed to load user.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [admin, router]);

  return { user, isLoading, error, isAdmin: !!user?.labels.includes("admin") };
}