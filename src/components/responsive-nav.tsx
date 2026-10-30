"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavItem = {
  href: string;
  label: string;
  variant?: "link" | "button";
};

type ResponsiveNavProps = {
  homeHref: string;
  links?: NavItem[];
  actions?: NavItem[];
  headerClassName?: string;
};

export function ResponsiveNav({
  homeHref,
  links = [],
  actions = [],
  headerClassName = "",
}: ResponsiveNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const itemClass = (item: NavItem, mobile = false) => {
    const base = item.variant === "button" ? "btn-primary" : "link";
    return mobile
      ? `${base} ${item.variant === "button" ? "text-center" : "py-2"} block`
      : base;
  };

  return (
    <header
      className={`border-b border-foreground/10 backdrop-blur-md shadow-lg ${headerClassName}`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-0"
        aria-label="Main"
      >
        <Link
          href={homeHref}
          className="rounded px-3 py-1.5 text-lg font-bold transition-all hover:bg-foreground/20"
          aria-label="What If Lab"
        >
          What if <span className="text-blue">lab.</span>
        </Link>

        <div className="hidden items-center gap-6 font-medium md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={itemClass(item)}>
              {item.label}
            </Link>
          ))}
          {actions.map((item) => (
            <Link key={item.href} href={item.href} className={itemClass(item)}>
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="rounded p-2 transition-all hover:bg-foreground/20 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-foreground/10 px-6 pb-6 pt-4 md:hidden"
        >
          <div className="flex flex-col gap-2 font-medium">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={itemClass(item, true)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {actions.length > 0 && (
              <div className="mt-2 flex flex-col gap-2 border-t border-foreground/10 pt-4">
                {actions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={itemClass(item, true)}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}