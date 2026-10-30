import { ResponsiveNav } from "@/components/responsive-nav";

export function AppHeader() {
  return (
    <ResponsiveNav
      homeHref="/dashboard"
      headerClassName="bg-background/75"
      links={[
        { href: "/dashboard", label: "Dashboard" },
        { href: "/experiments", label: "Experiments" },
        { href: "/questions", label: "Questions" },
        { href: "/leaderboard", label: "Leaderboard" },
      ]}
      actions={[{ href: "/profile", label: "Profile", variant: "button" }]}
    />
  );
}