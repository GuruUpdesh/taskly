import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  out: "./src/migrations"
} satisfies Config;
