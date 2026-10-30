import ExperimentViewer from "@/components/experiments/experiment-viewer";
import HomeHeader from "@/components/home-header";
import { appwrite } from "@/lib/appwrite/config";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";

export default async function GuestPage () {
  const helpers = createNextServerHelpers(appwrite);
  const user = await helpers.getLoggedInUser();

  return (
    <main>
      <HomeHeader user={ user } />

      <section className="max-w-7xl mx-auto min-h-dvh pt-28 px-6 lg:px-0">
        <ExperimentViewer experimentType="projectile_motion" />
      </section>
    </main>
  )
}