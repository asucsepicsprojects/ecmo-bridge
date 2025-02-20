import { type Config } from "drizzle-kit";
import { env } from "./src/env";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
    ssl: true,  // Enable SSL for Supabase
  },
  verbose: true,
  strict: true,
} satisfies Config;
