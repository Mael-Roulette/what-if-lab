import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import { createNextServerHelpers } from "@appwrite.io/react/server/next";
import { Providers } from "./providers";
import { appwrite } from "@/lib/appwrite/config";

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: [ "latin" ],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: {
    default: "What If Lab - Appwrite Hackathon 2026",
    template: "%s | What If Lab",
  },
  description: "Discover how things work, explore fascinating questions, and turn your curiosity into knowledge with What If Lab. Made for curious minds, powered by Appwrite.",
  applicationName: "What If Lab",
  authors: [{ name: "Maël Roulette" }],
  creator: "Maël Roulette",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const helpers = createNextServerHelpers(appwrite);
  const session = await helpers.readSessionCookie();
  return (
    <html
      lang="en"
      className={`${ptSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
