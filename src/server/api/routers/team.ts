import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { teams, teamsToUsers, users, usersToTeams } from "~/server/db/schema";

export const teamRouter = createTRPCRouter({
  getUserTeams: protectedProcedure
    .query(async ({ ctx: { db, session } }) => {
      const userId = session?.user?.id;
      if (!userId) if(!userId) return null
      const result = await db
        .select()
        .from(usersToTeams)
        .leftJoin(users, eq(usersToTeams.userId, users.id))
        .leftJoin(teams, eq(usersToTeams.teamId, teams.id))
        .where(eq(users.id, userId))
        .execute();
      return result;
    }),

  create: protectedProcedure
    .input(z.object({ userId: z.string().optional(), name: z.string().min(1) }))
    .mutation(async ({ ctx: { db }, input }) => {
      if (!input.userId) throw new Error("userId is required");
      const userId = (
        await db
          .select()
          .from(users)
          .where(eq(users.id, input.userId))
          .limit(1)
          .execute()
      )[0]?.id;
      const teamId = (
        await db
          .insert(teams)
          .values({ name: input.name })
          .returning({ teamId: teams.id })
          .execute()
      )[0]?.teamId;
      if (!teamId || !userId) throw new Error("Failed to link to team");
      await db
        .insert(usersToTeams)
        .values({ userId, teamId, role: "owner" })
        .execute();
      await db
        .insert(usersToTeams)
        .values({ userId, teamId, role: "owner" })
        .execute();
      return await db
        .insert(teamsToUsers)
        .values({ userId, teamId, role: "owner" })
        .returning({ teamId: teamsToUsers.teamId })
        .execute();
    }),
  //
});
