import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { env } from "~/env";
import schema from "./schema";

type SchemaType = typeof schema;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const client = new Client({ connectionString: env.DATABASE_URL });
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
await client.connect();
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument

export const db = drizzle<SchemaType>(client, { schema });
