import { ResponsiveNav } from "@/components/responsive-nav";

export function AdminHeader() {
  return (
    <ResponsiveNav
      homeHref="/admin"
      headerClassName="bg-background/75"
      links={[
        { href: "/admin/questions", label: "Questions" },
        { href: "/admin/experiments", label: "Experiments" },
      ]}
      actions={[{ href: "/profile", label: "Profile", variant: "button" }]}
    />
  );
}