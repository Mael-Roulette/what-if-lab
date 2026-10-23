"use client";

import { useSignOut } from "@appwrite.io/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useSignOut();

  return (
    <button
      type="button"
      className="btn-danger"
      onClick={() =>
        signOut({
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        })
      }
    >
      Sign out
    </button>
  );
}