import Link from "next/link";

export default function AppFooter () {
  return (
    <footer className="border-t border-foreground/10 bg-background/75 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-0">
        <Link
          href="/admin"
          className="rounded px-3 py-1.5 text-lg font-bold transition-all hover:bg-foreground/20"
          aria-label="What If Lab"
        >
          What if <span className="text-blue">lab.</span>
        </Link>

        <div className="flex items-center justify-end gap-6">
          <Link href="/dashboard" className="link">
            Public
          </Link>
        </div>
      </nav>
    </footer>
  )
}