import { SignOutButton } from "@/components/sign-out-button";
import { requireUser } from "@/lib/appwrite/auth";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await requireUser();

  const memberSince = new Date(user.$createdAt).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const details = [
    { label: "Name", value: user.name || "—" },
    { label: "Email", value: user.email },
    { label: "Member since", value: memberSince },
  ];

  return (
    <div>
      <h1>Your profile</h1>
      <p className="mt-1 text-foreground/60">
        Your account details.
      </p>

      <dl className="mt-10 divide-y divide-foreground/10 rounded-2xl border border-foreground/10 bg-white/75 shadow-xl shadow-blue/5">
        {details.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <dt className="font-medium text-foreground/60">{item.label}</dt>
            <dd className="font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex justify-end gap-2 mt-4">
        { user.labels.includes("admin") &&
          <Link href="admin" className="btn-secondary">Admin</Link>
        }
        <SignOutButton />
      </div>
    </div>
  );
}