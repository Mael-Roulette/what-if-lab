import { AdminHeader } from "@/components/admin-header";
import { requireAdmin } from "@/lib/appwrite/auth";

export default async function AdminLayout({ children }: LayoutProps<"/">) {
  await requireAdmin();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AdminHeader />

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:px-0">
        {children}
      </main>
    </div>
  );
}