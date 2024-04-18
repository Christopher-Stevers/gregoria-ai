import { createContext } from "react";
import type { RouterOutputs } from "~/trpc/shared";
export type TeamResponse = RouterOutputs["team"]["getUserTeams"];

export type Team = NonNullable<TeamResponse>[number]["team"];
export const TeamContext = createContext<TeamResponse>(null);
