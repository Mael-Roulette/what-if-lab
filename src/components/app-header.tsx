import Link from "next/link";
import { SignOutButton } from "./sign-out-button";

export function AppHeader() {
  return (
    <header className="border-b border-foreground/10 bg-background/75 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/dashboard"
          className="rounded px-3 py-1.5 text-lg font-bold transition-all hover:bg-foreground/20"
          aria-label="What If Lab"
        >
          What if <span className="text-blue">lab.</span>
        </Link>

        <div className="flex items-center gap-6 font-medium">
          <Link href="/dashboard" className="transition hover:text-blue">
            Dashboard
          </Link>
          <Link href="/experiments" className="transition hover:text-blue">
            Experiments
          </Link>
          <Link href="/profile" className="transition hover:text-blue">
            Profile
          </Link>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}