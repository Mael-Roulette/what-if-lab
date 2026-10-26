export default function Loading() {
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
        <p className="text-3xl font-bold uppercase tracking-widest text-blue lg:text-5xl">
          In progress<span className="animate-pulse">...</span>
        </p>

        <h1 className="mt-4 max-w-4xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-8xl">
          The page is{" "}
          <span className="text-blue">loading</span>
          <br />
        </h1>
      </section>
    </main>
  );
}