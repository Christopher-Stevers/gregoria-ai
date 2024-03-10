import { createContext } from "react";
import type { RouterOutputs } from "~/trpc/shared";
export type Team = RouterOutputs["team"]["getUserTeams"][number]["team"];
export const TeamContext = createContext<Team>(null);
