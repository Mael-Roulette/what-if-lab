import HomeHeader from "@/components/home-header";
import { appwrite } from "@/lib/appwrite";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import Link from "next/link";

export default async function Home() {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(59,130,246,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="absolute left-1/2 top-[-180px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-300/15 blur-[120px]" />
      </div>

      <HomeHeader user={ user } />

      <section className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 lg:px-0 pt-28 pb-16 text-center">
        <h1 className="max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
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
      </section>
    </main>
  );
}
