import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
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

      <section className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-6 py-8 text-center lg:px-0">
        <p className="text-3xl lg:text-5xl font-bold uppercase tracking-widest text-blue">
          Error 404
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
          What if{" "}
          <span className="text-blue">this page</span>
          <br />
          never existed?
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-foreground/65 sm:text-xl">
          We couldn&apos;t find what you were looking for.
        </p>
        <p className="mt-1 max-w-2xl text-lg text-foreground/65 sm:text-xl">
          It may have moved, or the link might be wrong.
        </p>

        <div className="mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to home
          </Link>
          <Link href="/guest" className="btn-secondary">
            Start exploring
          </Link>
        </div>
      </section>
    </main>
  );
}