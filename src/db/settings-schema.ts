import { sql } from "drizzle-orm";
import { check, integer, pgTable, text } from "drizzle-orm/pg-core";

// One row only: the site has one set of settings.
export const SiteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    name: text("name").notNull(),
    tagline: text("tagline").notNull().default(""),
    description: text("description").notNull().default(""),
    email: text("email"),
  },
  (t) => [check("site_settings_single_row", sql`${t.id} = 1`)],
);
