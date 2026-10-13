CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1,
	"name" text NOT NULL,
	"tagline" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"email" text,
	CONSTRAINT "site_settings_single_row" CHECK ("id" = 1)
);
