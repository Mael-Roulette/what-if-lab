import { AppHeader } from "@/components/app-header";
import { requireUser } from "@/lib/appwrite/auth";

export default async function AuthenticatedLayout({ children }: LayoutProps<"/">) {
  await requireUser();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-12 lg:px-0">
        {children}
      </main>
    </div>
  );
}