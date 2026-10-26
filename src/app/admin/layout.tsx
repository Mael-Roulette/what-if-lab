import AdminFooter from "@/components/admin/admin-footer";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:px-0">
        {children}
      </main>

      <AdminFooter />
    </div>
  );
}