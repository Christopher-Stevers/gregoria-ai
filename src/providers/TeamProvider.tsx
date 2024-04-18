"use client";

import React, { useContext, type ReactNode } from "react";
import TeamSignUp from "~/components/TeamSignUp/TeamSignUp";
import { getServerAuthSession } from "~/server/auth";

import { api } from "~/trpc/react";
import { TeamContext, TeamResponse } from "./TeamContext";

export const useTeam = () => {
  const teamResponse = useContext(TeamContext);

  const team = teamResponse?.[0]?.team;

  if (!team) {
    throw new Error("No team found");
  }
  return team;
};

export const useUser = () => {
  const teamResponse = useContext(TeamContext);
  const user = teamResponse?.[0]?.user;
  if (!user) {
    throw new Error("No user found");
  }
  return user;
};
// Define the provider
export const TeamProvider = async ({
  children,
  initialValue,
}: {
  children: ReactNode | ReactNode[];
  initialValue: TeamResponse;
}) => {
  const { data: teamResponse } = api.team.getUserTeams.useQuery(undefined, {
    initialData: initialValue,
  });
  const team = teamResponse?.[0]?.team;
  if (!team) {
    throw new Error("No team found");
  }
  return (
    <TeamContext.Provider value={teamResponse}>{children}</TeamContext.Provider>
  );
};
