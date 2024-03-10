"use client";

import React, { type ReactNode } from "react";
import TeamSignUp from "~/components/TeamSignUp/TeamSignUp";
import { getServerAuthSession } from "~/server/auth";

import { api } from "~/trpc/server";
import { Team, TeamContext } from "./TeamContext";

// Define the provider
export const TeamProvider = async ({
  children,
  initialValue,
}: {
  children: ReactNode | ReactNode[];
  initialValue: Team;
}) => {
  return (
    <TeamContext.Provider value={initialValue}>{children}</TeamContext.Provider>
  );
};
