import { requireUser } from "@/lib/appwrite/auth";

export default async function DashboardPage () {
  const user = await requireUser();

  return (
    <section>
      <h1>Hi { user.name } !</h1>
      <p className="italic text-foreground/60 font-bold">Let&apos;s try new things today.</p>
    </section>
  )
}