CREATE TYPE "layout" AS ENUM('grid', 'masonry', 'column');--> statement-breakpoint
CREATE TYPE "span" AS ENUM('normal', 'wide', 'full');--> statement-breakpoint
CREATE TABLE "galleries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"description" text,
	"cover_photo_id" uuid,
	"layout" "layout" DEFAULT 'grid'::"layout" NOT NULL,
	"position" text COLLATE "C" NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_photos" (
	"gallery_id" uuid,
	"photo_id" uuid,
	"position" text COLLATE "C" NOT NULL,
	"span" "span" DEFAULT 'normal'::"span" NOT NULL,
	CONSTRAINT "gallery_photos_pkey" PRIMARY KEY("gallery_id","photo_id")
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"key" text NOT NULL UNIQUE,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"placeholder" text NOT NULL,
	"alt" text DEFAULT '' NOT NULL,
	"caption" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "gallery_photos_photo_id_idx" ON "gallery_photos" ("photo_id");--> statement-breakpoint
ALTER TABLE "galleries" ADD CONSTRAINT "galleries_cover_photo_id_photos_id_fkey" FOREIGN KEY ("cover_photo_id") REFERENCES "photos"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_gallery_id_galleries_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "galleries"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_photo_id_photos_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE;