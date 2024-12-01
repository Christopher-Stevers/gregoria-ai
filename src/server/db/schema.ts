import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gregoria-ai_${name}`);

export const posts = createTable("posts", {
  id: serial("id").primaryKey(),
  content: text("content"),
  authorId: varchar("id", { length: 255 }),
});

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));

export const teams = createTable("team", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }),
  plan: varchar("plan", { length: 255 }),
  expires: timestamp("expires", { mode: "date" }),
  active: boolean("active").default(false),
});

export const teamsToUsers = createTable("teamToUser", {
  teamId: bigint("teamId", { mode: "number" })
    .notNull()
    .references(() => teams.id),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  role: varchar("role", { length: 255 }).notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
  statues: many(statuses),
}));

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const usersToTeams = createTable("userToTeam", {
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id),
  teamId: bigint("teamId", { mode: "number" })
    .notNull()
    .references(() => teams.id),
  role: varchar("role", { length: 255 }).notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  teams: many(teams),
  posts: many(posts),
  statuses: many(statuses),
}));

export const funnelTemplates = createTable(
  "funnelTemplate",
  {
    id: serial("id").primaryKey(),
    creatorThreadId: varchar("creatorThreadId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    teamId: bigint("teamId", { mode: "number" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
  },
  (ft) => ({
    creatorThreadIdIdx: index("funnelTemplate_creatorThreadId_idx").on(
      ft.creatorThreadId,
    ),
    userIdIdx: index("funnelTemplate_userId_idx").on(ft.userId),
    teamIdIdx: index("funnelTemplate_teamId_idx").on(ft.teamId),
  }),
);

export const funnelTemplateRelations = relations(
  funnelTemplates,
  ({ many }) => ({
    stepTemplates: many(stepTemplates),
    funnelTemplateViews: many(funnelTemplateViews),
  }),
);
export const funnelTemplateViews = createTable(
  "funnelTemplateView",
  {
    id: serial("id").primaryKey(),
    funnelTemplateId: bigint("funnelTemplateId", { mode: "number" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
  },
  (ft) => ({
    funnelTemplateIdIdx: index("funnelTemplateView_funnelTemplateId_idx").on(
      ft.funnelTemplateId,
    ),
  }),
);

export const funnelTemplateViewRelations = relations(
  funnelTemplateViews,
  ({ many, one }) => ({
    funnelTemplate: one(funnelTemplates, {
      fields: [funnelTemplateViews.funnelTemplateId],
      references: [funnelTemplates.id],
    }),
    funnelTemplateViewsRows: many(funnelTemplateViewRows),
  }),
);

export const funnelTemplateViewRows = createTable(
  "funnelTemplateViewRow",
  {
    id: serial("id").primaryKey(),
    funnelTemplateViewId: bigint("funnelTemplateViewId", {
      mode: "number",
    }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    baseStep: varchar("baseStep", { length: 255 }),
    secondStep: varchar("secondStep", { length: 255 }),
    firstStep: varchar("firstStep", { length: 255 }),
    stage: varchar("stage", { length: 255 }),
    index: integer("index").notNull(),
  },
  (ft) => ({
    funnelTemplateViewIdIdx: index(
      "funnelTemplateViewRow_funnelTemplateViewId_idx",
    ).on(ft.funnelTemplateViewId),
  }),
);
export const funnelTemplateViewRowsRelations = relations(
  funnelTemplateViewRows,
  ({ many, one }) => ({
    actionTemplates: many(actionTemplates),
    funnelTemplateView: one(funnelTemplateViews, {
      fields: [funnelTemplateViewRows.funnelTemplateViewId],
      references: [funnelTemplateViews.id],
    }),
  }),
);

export const stepTemplates = createTable(
  "stepTemplate",
  {
    id: serial("id").primaryKey(),
    funnelTemplateId: bigint("funnelTemplateId", { mode: "number" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    index: integer("index").notNull(),
  },
  (st) => ({
    funnelTemplateIdIdx: index("stepTemplate_funnelTemplateId_idx").on(
      st.funnelTemplateId,
    ),
  }),
);

export const stepTemplateRelations = relations(
  stepTemplates,
  ({ many, one }) => ({
    actionTemplates: many(actionTemplates),
    funnelTemplates: one(funnelTemplates, {
      fields: [stepTemplates.funnelTemplateId],
      references: [funnelTemplates.id],
    }),
  }),
);

export const actionTemplates = createTable(
  "actionTemplate",
  {
    id: serial("id").primaryKey(),
    stepTemplateId: bigint("stepTemplateId", { mode: "number" }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    index: integer("index").notNull(),
  },
  (at) => ({
    stepTemplateIdIdx: index("actionTemplate_stepTemplateId_idx").on(
      at.stepTemplateId,
    ),
  }),
);

export const actionTemplateRelations = relations(
  actionTemplates,
  ({ many, one }) => ({
    statusTemplates: many(statusTemplates),

    stepTemplate: one(stepTemplates, {
      fields: [actionTemplates.stepTemplateId],
      references: [stepTemplates.id],
    }),
  }),
);

// create status object that is related to one statusTemplate, one user, one team, and has a created at time
export const statuses = createTable(
  "status",
  {
    id: serial("id").primaryKey(),
    statusTemplateId: bigint("statusTemplateId", { mode: "number" }).notNull(),
    userId: varchar("userId", { length: 255 }).notNull(),
    teamId: bigint("teamId", { mode: "number" }).notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    parentActionId: bigint("parentActionId", { mode: "number" }),
  },
  (st) => ({
    statusTemplateIdIdx: index("status_statusTemplateId_idx").on(
      st.statusTemplateId,
    ),
    userIdIdx: index("status_userId_idx").on(st.userId),
    teamIdIdx: index("status_teamId_idx").on(st.teamId),
  }),
);

export const statusRelations = relations(statuses, ({ one }) => ({
  statusTemplate: one(statusTemplates, {
    fields: [statuses.statusTemplateId],
    references: [statusTemplates.id],
  }),
  user: one(users, { fields: [statuses.userId], references: [users.id] }),
  team: one(teams, { fields: [statuses.teamId], references: [teams.id] }),
}));

export const statusTemplates = createTable(
  "statusTemplate",
  {
    id: serial("id").primaryKey(),
    actionTemplateId: bigint("actionTemplateId", { mode: "number" }).notNull(),
    trackedStep: varchar("trackedStep", { length: 255 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    index: integer("index").notNull(),
  },
  (st) => ({
    actionTemplateIdIdx: index("statusTemplate_actionTemplateId_idx").on(
      st.actionTemplateId,
    ),
  }),
);

export const statusTemplateRelations = relations(
  statusTemplates,
  ({ one, many }) => ({
    actionTemplate: one(actionTemplates, {
      fields: [statusTemplates.actionTemplateId],
      references: [actionTemplates.id],
    }),
    statuses: many(statuses),
  }),
);

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("accounts_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

const schema = {
  accounts,
  funnelTemplates,
  funnelTemplateRelations,
  posts,
  postsRelations,
  sessions,
  actionTemplates,
  actionTemplateRelations,
  stepTemplates,
  stepTemplateRelations,
  statusTemplates,
  statusTemplateRelations,
  statusRelations,
  statuses,
  teams,
  teamsToUsers,
  users,
  usersRelations,
  usersToTeams,
  verificationTokens,
};
export default schema;
