import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set SITES_D1_BINDING=DB for local builds or let your control plane inject the real binding before using the database."
    );
  }

  return drizzle(env.DB, { schema });
}
