CREATE TABLE "homepage_photos" (
	"photo_id" uuid PRIMARY KEY,
	"position" text COLLATE "C" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "homepage_photos" ADD CONSTRAINT "homepage_photos_photo_id_photos_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE;