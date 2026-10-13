import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { position } from "@/db/position";

export const PricingPackages = pgTable("pricing_packages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  // Free text, so a package can say "From $2,400".
  price: text("price").notNull(),
  description: text("description"),
  // One line each, shown as a list.
  features: text("features").array().notNull().default([]),
  isHighlighted: boolean("is_highlighted").notNull().default(false),
  position: position("position").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
