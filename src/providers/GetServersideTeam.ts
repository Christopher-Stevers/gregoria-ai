import { api } from "~/trpc/server";

export const getServersideTeam = async () => {
  "use server";
  const teamResponse = await api.team.getUserTeams.query();
  const team = teamResponse?.[0]?.team;
  if (!team) throw new Error("No team found");
  return team;
};
