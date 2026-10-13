CREATE TABLE "about_section" (
	"id" integer PRIMARY KEY DEFAULT 1,
	"heading" text NOT NULL,
	"body" text NOT NULL,
	"photo_id" uuid,
	CONSTRAINT "about_section_single_row" CHECK ("id" = 1)
);
--> statement-breakpoint
ALTER TABLE "about_section" ADD CONSTRAINT "about_section_photo_id_photos_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE SET NULL;