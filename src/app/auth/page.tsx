"use client";

import { useState, useEffect, SubmitEvent } from "react";
import * as z from "zod";
import { useAuth } from "@appwrite.io/react";
import { useRouter } from "next/navigation";
import {
  userSchema,
  signUpSchema,
  type FieldErrors,
} from "@/lib/validations/user";
import Loading from "../loading";

export default function Auth() {
  const { user, isLoading, signIn, signUp, error } = useAuth();
  const router = useRouter();

  const [formType, setFormType] = useState<"signup" | "signin">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const isSignup = formType === "signup";
  const isPending = isSignup ? signUp.isPending : signIn.isPending;

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = isSignup
      ? signUpSchema.safeParse({ email, password, name })
      : userSchema.safeParse({ email, password });

    if (!result.success) {
      setFieldErrors(z.flattenError(result.error).fieldErrors as FieldErrors);
      return;
    }

    setFieldErrors({});

    if (isSignup) {
      signUp.emailPassword({
        ...(result.data as z.infer<typeof signUpSchema>),
        onSuccess: () => router.refresh(),
      });
    } else {
      signIn.emailPassword({
        ...result.data,
        onSuccess: () => router.refresh(),
      });
    }
  };

  const handleFormTypeChange = () => {
    setFormType(isSignup ? "signin" : "signup");
    setFieldErrors({});
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (isLoading) {
    return <Loading />;
  }

  const inputClass =
    "rounded-lg border border-foreground/15 bg-white px-4 py-3 outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/15 aria-invalid:border-red-600";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-300/15 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            {isSignup ? "Create an account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-foreground/60">
            {isSignup
              ? "Create an account to start exploring."
              : "Sign in to continue exploring."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-white/75 p-6 shadow-xl shadow-blue/5 backdrop-blur-md sm:p-8"
        >
          {isSignup && (
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className={inputClass}
              />
              {fieldErrors.name && (
                <p id="name-error" role="alert" className="text-sm text-red-600">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              className={inputClass}
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="text-sm text-red-600">
                {fieldErrors.email[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? "password-error" : undefined
              }
              className={inputClass}
            />
            {fieldErrors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm text-red-600"
              >
                {fieldErrors.password[0]}
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-red-600">
              {error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary mt-2 w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="link font-semibold"
            onClick={handleFormTypeChange}
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </main>
  );
}