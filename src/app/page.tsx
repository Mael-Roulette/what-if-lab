"use client"

import AppFooter from "@/components/app-footer";
import HomeHeader from "@/components/home-header";
import { useAuth } from "@/hooks/auth/use-auth";
import Link from "next/link";
import Loading from "./loading";

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) return <Loading />;

  return (
    <>
      <HomeHeader user={ user } />
      <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.16),transparent_65%)]" />
          <div className="absolute inset-0 bg-grid opacity-60" />
          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[120px]" />
        </div>

        <section className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center  px-6 lg:px-0 pt-22 pb-8 text-center">
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight mt-auto sm:text-6xl lg:text-8xl">
            What if{" "}
            <span className="text-blue">you could</span>
            <br />
            understand everything?
          </h1>

          <p className="mt-8 max-w-2xl text-lg text-foreground/65 sm:text-xl">Discover how simple things work and increase your knowledge.</p>
          <p className="mt-1 max-w-2xl text-lg text-foreground/65 sm:text-xl">The world is full of what ifs. Let&apos;s explore them.</p>

          <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href="/guest"
              className="btn-primary"
            >
              Start exploring
            </Link>
            { user ? (
              <Link
                href="/dashboard"
                className="btn-secondary"
              >
                My space
              </Link>
            ) : (
              <Link
                href="/auth"
                className="btn-secondary"
              >
                Sign in to your account
              </Link>
            )}
          </div>
          <p className="mt-auto text-sm text-foreground/50 font-bold">Built for the Appwrite Hackathon with 💜 by Maël Roulette</p>
        </section>

        <section
          id="about"
          className="relative z-10 mx-auto w-full max-w-5xl px-6 py-18"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue">
              About What-If Lab
            </span>

            <h2 className="mt-2 text-3xl font-bold text-foreground tracking-tight sm:text-5xl ">
              Explore questions. <br /><span className="text-blue">Discover answers.</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-foreground/65">
              What-If Lab is an interactive learning platform that makes science
              accessible through curiosity and exploration.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-foreground/65">
              Whether you want to explore scientific phenomena through simulations
              or simply challenge your knowledge with questions, What-If Lab helps
              you understand the world around you, one discovery at a time.
            </p>
          </div>
        </section>


        <section
          id="how-it-works"
          className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24"
        >
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue">
              How it works
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
              Two ways to <span className="text-blue">discover.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/65">
              Learn at your own pace through interactive experiments or
              standalone questions.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 bg-background/60 p-8 flex flex-col">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl">🧪</div>
                <h3 className="text-2xl font-bold">
                  Interactive experiments
                </h3>
              </div>
              <p className="mt-3 mb-8 leading-relaxed text-foreground/60">
                Make predictions, explore scientific phenomena through
                simulations, and discover whether your assumptions were correct.
              </p>
              <div className="mt-auto space-y-4">
                {[
                  ["01", "Choose an experiment"],
                  ["02", "Answer a question and make a prediction"],
                  ["03", "Watch the simulation"],
                  ["04", "Discover the answer and understand why"],
                ].map(([number, title]) => (
                  <div key={number} className="flex items-start gap-4">
                    <span className="font-bold text-blue">{number}</span>
                    <span className="text-foreground/80">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-background/60 p-8 flex flex-col">
              <div className="flex items-baseline gap-2">
                <div className="text-3xl">💡</div>
                <h3 className="text-2xl font-bold">
                  Knowledge questions
                </h3>
              </div>
              <p className="mt-3 mb-8 leading-relaxed text-foreground/60">
                Explore a collection of scientific questions, test your
                knowledge, and learn something new with every answer.
              </p>
              <div className="mt-auto space-y-4">
                {[
                  ["01", "Browse available questions"],
                  ["02", "Choose a question"],
                  ["03", "Submit your answer"],
                  ["04", "Discover the correct answer and its explanation"],
                ].map(([number, title]) => (
                  <div key={number} className="flex items-start gap-4">
                    <span className="font-bold text-blue">{number}</span>
                    <span className="text-foreground/80">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
