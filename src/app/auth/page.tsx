"use client";

import { useState } from "react";
import { useAuth } from "@appwrite.io/react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const { user, isLoading, signIn, signUp, signOut, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (isLoading) return <p>Loading...</p>;

  if (user) {
    return (
      <div>
        <p>Welcome, {user.name || user.email}</p>
        <button onClick={() => signOut.signOut({ onSuccess: () => router.refresh() })}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={() =>
          signUp.emailPassword({
            email,
            password,
            name,
            onSuccess: () => router.refresh(),
          })
        }
        disabled={signUp.isPending}
      >
        Sign up
      </button>
      <button
        onClick={() =>
          signIn.emailPassword({
            email,
            password,
            onSuccess: () => router.refresh(),
          })
        }
        disabled={signIn.isPending}
      >
        Sign in
      </button>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
}