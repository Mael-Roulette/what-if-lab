import { ResponsiveNav, type NavItem } from "@/components/responsive-nav";
import { SessionUser } from "@/types/user";

export default function HomeHeader({ user }: { user: SessionUser | null }) {
  const actions: NavItem[] = user
    ? [
        { href: "/dashboard", label: "My space" },
        { href: "/profile", label: "Profile", variant: "button" },
      ]
    : [{ href: "/auth", label: "Get started", variant: "button" }];

  return (
    <ResponsiveNav
      homeHref="/"
      headerClassName="fixed inset-x-0 top-0 z-50 bg-background/80"
      links={[
        { href: "#about", label: "About" },
        { href: "#how-it-works", label: "How it works" },
      ]}
      actions={actions}
    />
  );
}