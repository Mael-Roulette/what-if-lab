import { Models } from "appwrite";
import Link from "next/link";

type HomeHeaderProps = {
  user: Models.User<Models.Preferences> | null;
};

export default function HomeHeader ( { user }: HomeHeaderProps ) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/75 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between py-4 px-6 lg:px-0">
          <Link
            href="/"
            className="px-3 py-1.5 rounded transition-all hover:bg-foreground/20 font-bold text-lg"
            aria-label="What If Lab"
          >
              What if <span className="text-blue">lab.</span>
          </Link>

          <div className="flex items-center gap-8 font-medium">
            <a href="#about" className="transition hover:text-blue">
              About
            </a>
            <a href="#how-it-works" className="transition hover:text-blue">
              How it works
            </a>
          </div>

          { user ? (
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="link"
              >
                My space
              </Link>
              <Link
                href="/profile"
                className="btn-primary"
              >
                Profile
              </Link>
            </div>
          ) : (
            <Link
              href="/auth"
              className="btn-primary"
            >
              Get started
            </Link>
          )}
        </nav>
      </header>
  )
}