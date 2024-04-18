import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import NavBar from "~/components/navbar";
import { TeamProvider } from "~/providers/TeamProvider";
import TeamSignUp from "~/components/TeamSignUp/TeamSignUp";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Gregoria AI",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAuthSession();
  const userTeams = await api.team.getUserTeams.query().catch(() => null);
  const team = userTeams?.[0]?.team;
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-main text-text`}>
        <TRPCReactProvider>
          <NavBar />
          {!user ? (
            <div>Landing page, please sign in</div>
          ) : (
            <div>
              {team ? (
                <TeamProvider initialValue={userTeams}>{children}</TeamProvider>
              ) : (
                <TeamSignUp />
              )}
            </div>
          )}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
