import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import { generateNKeysBetween } from 'payload/shared'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_messages_status" AS ENUM('new', 'handled');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_large_filename" varchar;
  ALTER TABLE "media_locales" ADD COLUMN "caption" varchar;
  ALTER TABLE "team" ADD COLUMN "_order" varchar;
  ALTER TABLE "team" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "programs" ADD COLUMN "_order" varchar;
  ALTER TABLE "programs" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_programs_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_programs_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_programs_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "children" ADD COLUMN "_order" varchar;
  ALTER TABLE "children" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_children_v" ADD COLUMN "version__order" varchar;
  ALTER TABLE "_children_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_children_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "news" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "albums" ADD COLUMN "_order" varchar;
  ALTER TABLE "albums" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "messages" ADD COLUMN "status" "enum_messages_status" DEFAULT 'new' NOT NULL;
  ALTER TABLE "messages" ADD COLUMN "staff_note" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "home" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_home_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "about" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_about_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_about_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "privacy" ADD COLUMN "updated_by_id" integer;
  ALTER TABLE "_privacy_v" ADD COLUMN "version_updated_by_id" integer;
  ALTER TABLE "_privacy_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  ALTER TABLE "team" ADD CONSTRAINT "team_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "children" ADD CONSTRAINT "children_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_children_v" ADD CONSTRAINT "_children_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v" ADD CONSTRAINT "_home_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "privacy" ADD CONSTRAINT "privacy_updated_by_id_users_id_fk" FOREIGN KEY ("updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_privacy_v" ADD CONSTRAINT "_privacy_v_version_updated_by_id_users_id_fk" FOREIGN KEY ("version_updated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "team__order_idx" ON "team" USING btree ("_order");
  CREATE INDEX "team_updated_by_idx" ON "team" USING btree ("updated_by_id");
  CREATE INDEX "programs__order_idx" ON "programs" USING btree ("_order");
  CREATE INDEX "programs_updated_by_idx" ON "programs" USING btree ("updated_by_id");
  CREATE INDEX "_programs_v_version_version__order_idx" ON "_programs_v" USING btree ("version__order");
  CREATE INDEX "_programs_v_version_version_updated_by_idx" ON "_programs_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_programs_v_autosave_idx" ON "_programs_v" USING btree ("autosave");
  CREATE INDEX "children__order_idx" ON "children" USING btree ("_order");
  CREATE INDEX "children_updated_by_idx" ON "children" USING btree ("updated_by_id");
  CREATE INDEX "_children_v_version_version__order_idx" ON "_children_v" USING btree ("version__order");
  CREATE INDEX "_children_v_version_version_updated_by_idx" ON "_children_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_children_v_autosave_idx" ON "_children_v" USING btree ("autosave");
  CREATE INDEX "news_updated_by_idx" ON "news" USING btree ("updated_by_id");
  CREATE INDEX "_news_v_version_version_updated_by_idx" ON "_news_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_news_v_autosave_idx" ON "_news_v" USING btree ("autosave");
  CREATE INDEX "albums__order_idx" ON "albums" USING btree ("_order");
  CREATE INDEX "albums_updated_by_idx" ON "albums" USING btree ("updated_by_id");
  CREATE INDEX "messages_status_idx" ON "messages" USING btree ("status");
  CREATE INDEX "site_settings_updated_by_idx" ON "site_settings" USING btree ("updated_by_id");
  CREATE INDEX "home_updated_by_idx" ON "home" USING btree ("updated_by_id");
  CREATE INDEX "_home_v_version_version_updated_by_idx" ON "_home_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_home_v_autosave_idx" ON "_home_v" USING btree ("autosave");
  CREATE INDEX "about_updated_by_idx" ON "about" USING btree ("updated_by_id");
  CREATE INDEX "_about_v_version_version_updated_by_idx" ON "_about_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_about_v_autosave_idx" ON "_about_v" USING btree ("autosave");
  CREATE INDEX "privacy_updated_by_idx" ON "privacy" USING btree ("updated_by_id");
  CREATE INDEX "_privacy_v_version_version_updated_by_idx" ON "_privacy_v" USING btree ("version_updated_by_id");
  CREATE INDEX "_privacy_v_autosave_idx" ON "_privacy_v" USING btree ("autosave");
`)

  // Existing staff accounts were all-powerful before roles existed. Keep it that way; admins can demote people later.
  await db.execute(sql`UPDATE "users" SET "role" = 'admin';`)

  // Gallery photos moved from an array (image + caption per album) to a list of photos. Captions now live on the photo.
  await db.execute(sql`
  INSERT INTO "albums_rels" ("order", "parent_id", "path", "media_id")
  SELECT row_number() OVER (PARTITION BY "_parent_id" ORDER BY "_order"), "_parent_id", 'photos', "image_id"
  FROM "albums_photos"
  WHERE "image_id" IS NOT NULL;

  WITH captions AS (
    SELECT DISTINCT ON (p."image_id", l."_locale") p."image_id", l."_locale", l."caption"
    FROM "albums_photos" p
    JOIN "albums_photos_locales" l ON l."_parent_id" = p."id"
    WHERE p."image_id" IS NOT NULL AND coalesce(l."caption", '') <> ''
    ORDER BY p."image_id", l."_locale", p."_parent_id", p."_order"
  )
  UPDATE "media_locales" m SET "caption" = c."caption"
  FROM captions c
  WHERE m."_parent_id" = c."image_id" AND m."_locale" = c."_locale" AND m."caption" IS NULL;

  -- A caption in a language the photo has no alt text for yet: reuse alt text from another language.
  WITH captions AS (
    SELECT DISTINCT ON (p."image_id", l."_locale") p."image_id", l."_locale", l."caption"
    FROM "albums_photos" p
    JOIN "albums_photos_locales" l ON l."_parent_id" = p."id"
    WHERE p."image_id" IS NOT NULL AND coalesce(l."caption", '') <> ''
    ORDER BY p."image_id", l."_locale", p."_parent_id", p."_order"
  )
  INSERT INTO "media_locales" ("alt", "caption", "_locale", "_parent_id")
  SELECT (SELECT o."alt" FROM "media_locales" o WHERE o."_parent_id" = c."image_id" ORDER BY o."_locale" LIMIT 1),
    c."caption", c."_locale", c."image_id"
  FROM captions c
  WHERE NOT EXISTS (
    SELECT 1 FROM "media_locales" m WHERE m."_parent_id" = c."image_id" AND m."_locale" = c."_locale"
  )
  AND EXISTS (SELECT 1 FROM "media_locales" o WHERE o."_parent_id" = c."image_id");

  ALTER TABLE "albums_photos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "albums_photos_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "albums_photos" CASCADE;
  DROP TABLE "albums_photos_locales" CASCADE;`)

  // "Sort order" numbers became drag-and-drop ordering. Keep the order staff had set.
  for (const table of ['team', 'programs', 'children', 'albums']) {
    const { rows } = await db.execute(
      sql.raw(`SELECT "id" FROM "${table}" ORDER BY "sort_order" ASC NULLS LAST, "id" ASC`),
    )
    const keys = generateNKeysBetween(null, null, rows.length)
    for (const [index, row] of rows.entries()) {
      await db.execute(sql`UPDATE ${sql.identifier(table)} SET "_order" = ${keys[index]} WHERE "id" = ${row.id}`)
    }
  }
  for (const table of ['programs', 'children']) {
    await db.execute(
      sql.raw(
        `UPDATE "_${table}_v" v SET "version__order" = t."_order" FROM "${table}" t WHERE v."parent_id" = t."id"`,
      ),
    )
  }

  await db.execute(sql`
  ALTER TABLE "team" DROP COLUMN "sort_order";
  ALTER TABLE "programs" DROP COLUMN "sort_order";
  ALTER TABLE "_programs_v" DROP COLUMN "version_sort_order";
  ALTER TABLE "children" DROP COLUMN "sort_order";
  ALTER TABLE "_children_v" DROP COLUMN "version_sort_order";
  ALTER TABLE "albums" DROP COLUMN "sort_order";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "albums_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "albums_photos_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "news" DROP CONSTRAINT "news_updated_by_id_users_id_fk";
  
  ALTER TABLE "_news_v" DROP CONSTRAINT "_news_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "albums" DROP CONSTRAINT "albums_updated_by_id_users_id_fk";
  
  ALTER TABLE "programs" DROP CONSTRAINT "programs_updated_by_id_users_id_fk";
  
  ALTER TABLE "_programs_v" DROP CONSTRAINT "_programs_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "children" DROP CONSTRAINT "children_updated_by_id_users_id_fk";
  
  ALTER TABLE "_children_v" DROP CONSTRAINT "_children_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "team" DROP CONSTRAINT "team_updated_by_id_users_id_fk";
  
  ALTER TABLE "home" DROP CONSTRAINT "home_updated_by_id_users_id_fk";
  
  ALTER TABLE "_home_v" DROP CONSTRAINT "_home_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "about" DROP CONSTRAINT "about_updated_by_id_users_id_fk";
  
  ALTER TABLE "_about_v" DROP CONSTRAINT "_about_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "privacy" DROP CONSTRAINT "privacy_updated_by_id_users_id_fk";
  
  ALTER TABLE "_privacy_v" DROP CONSTRAINT "_privacy_v_version_updated_by_id_users_id_fk";
  
  ALTER TABLE "site_settings" DROP CONSTRAINT "site_settings_updated_by_id_users_id_fk";
  
  DROP INDEX "news_updated_by_idx";
  DROP INDEX "_news_v_version_version_updated_by_idx";
  DROP INDEX "_news_v_autosave_idx";
  DROP INDEX "albums__order_idx";
  DROP INDEX "albums_updated_by_idx";
  DROP INDEX "programs__order_idx";
  DROP INDEX "programs_updated_by_idx";
  DROP INDEX "_programs_v_version_version__order_idx";
  DROP INDEX "_programs_v_version_version_updated_by_idx";
  DROP INDEX "_programs_v_autosave_idx";
  DROP INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_large_sizes_large_filename_idx";
  DROP INDEX "children__order_idx";
  DROP INDEX "children_updated_by_idx";
  DROP INDEX "_children_v_version_version__order_idx";
  DROP INDEX "_children_v_version_version_updated_by_idx";
  DROP INDEX "_children_v_autosave_idx";
  DROP INDEX "team__order_idx";
  DROP INDEX "team_updated_by_idx";
  DROP INDEX "messages_status_idx";
  DROP INDEX "home_updated_by_idx";
  DROP INDEX "_home_v_version_version_updated_by_idx";
  DROP INDEX "_home_v_autosave_idx";
  DROP INDEX "about_updated_by_idx";
  DROP INDEX "_about_v_version_version_updated_by_idx";
  DROP INDEX "_about_v_autosave_idx";
  DROP INDEX "privacy_updated_by_idx";
  DROP INDEX "_privacy_v_version_version_updated_by_idx";
  DROP INDEX "_privacy_v_autosave_idx";
  DROP INDEX "site_settings_updated_by_idx";
  ALTER TABLE "albums" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "programs" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "_programs_v" ADD COLUMN "version_sort_order" numeric DEFAULT 0;
  ALTER TABLE "children" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "_children_v" ADD COLUMN "version_sort_order" numeric DEFAULT 0;
  ALTER TABLE "team" ADD COLUMN "sort_order" numeric DEFAULT 0;
  ALTER TABLE "albums_photos" ADD CONSTRAINT "albums_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_photos" ADD CONSTRAINT "albums_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_photos_locales" ADD CONSTRAINT "albums_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums_photos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "albums_photos_order_idx" ON "albums_photos" USING btree ("_order");
  CREATE INDEX "albums_photos_parent_id_idx" ON "albums_photos" USING btree ("_parent_id");
  CREATE INDEX "albums_photos_image_idx" ON "albums_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "albums_photos_locales_locale_parent_id_unique" ON "albums_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_photos_locales_parent_id_idx" ON "albums_photos_locales" USING btree ("_parent_id");
  -- Restore "sort order" numbers and gallery photo rows (with captions) before the new columns go away.
  UPDATE "team" t SET "sort_order" = r.n FROM (SELECT "id", row_number() OVER (ORDER BY "_order" NULLS LAST, "id") AS n FROM "team") r WHERE t."id" = r."id";
  UPDATE "programs" t SET "sort_order" = r.n FROM (SELECT "id", row_number() OVER (ORDER BY "_order" NULLS LAST, "id") AS n FROM "programs") r WHERE t."id" = r."id";
  UPDATE "children" t SET "sort_order" = r.n FROM (SELECT "id", row_number() OVER (ORDER BY "_order" NULLS LAST, "id") AS n FROM "children") r WHERE t."id" = r."id";
  UPDATE "albums" t SET "sort_order" = r.n FROM (SELECT "id", row_number() OVER (ORDER BY "_order" NULLS LAST, "id") AS n FROM "albums") r WHERE t."id" = r."id";
  UPDATE "_programs_v" v SET "version_sort_order" = t."sort_order" FROM "programs" t WHERE v."parent_id" = t."id";
  UPDATE "_children_v" v SET "version_sort_order" = t."sort_order" FROM "children" t WHERE v."parent_id" = t."id";
  INSERT INTO "albums_photos" ("_order", "_parent_id", "id", "image_id")
  SELECT "order", "parent_id", md5("parent_id"::text || '-' || "id"::text), "media_id"
  FROM "albums_rels" WHERE "path" = 'photos' AND "media_id" IS NOT NULL;
  INSERT INTO "albums_photos_locales" ("caption", "_locale", "_parent_id")
  SELECT m."caption", m."_locale", md5(r."parent_id"::text || '-' || r."id"::text)
  FROM "albums_rels" r JOIN "media_locales" m ON m."_parent_id" = r."media_id"
  WHERE r."path" = 'photos' AND m."caption" IS NOT NULL;
  ALTER TABLE "albums_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "albums_rels" CASCADE;
  ALTER TABLE "news" DROP COLUMN "updated_by_id";
  ALTER TABLE "_news_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_news_v" DROP COLUMN "autosave";
  ALTER TABLE "albums" DROP COLUMN "_order";
  ALTER TABLE "albums" DROP COLUMN "updated_by_id";
  ALTER TABLE "programs" DROP COLUMN "_order";
  ALTER TABLE "programs" DROP COLUMN "updated_by_id";
  ALTER TABLE "_programs_v" DROP COLUMN "version__order";
  ALTER TABLE "_programs_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_programs_v" DROP COLUMN "autosave";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_large_url";
  ALTER TABLE "media" DROP COLUMN "sizes_large_width";
  ALTER TABLE "media" DROP COLUMN "sizes_large_height";
  ALTER TABLE "media" DROP COLUMN "sizes_large_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_large_filename";
  ALTER TABLE "media_locales" DROP COLUMN "caption";
  ALTER TABLE "children" DROP COLUMN "_order";
  ALTER TABLE "children" DROP COLUMN "updated_by_id";
  ALTER TABLE "_children_v" DROP COLUMN "version__order";
  ALTER TABLE "_children_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_children_v" DROP COLUMN "autosave";
  ALTER TABLE "team" DROP COLUMN "_order";
  ALTER TABLE "team" DROP COLUMN "updated_by_id";
  ALTER TABLE "messages" DROP COLUMN "status";
  ALTER TABLE "messages" DROP COLUMN "staff_note";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "home" DROP COLUMN "updated_by_id";
  ALTER TABLE "_home_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_home_v" DROP COLUMN "autosave";
  ALTER TABLE "about" DROP COLUMN "updated_by_id";
  ALTER TABLE "_about_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_about_v" DROP COLUMN "autosave";
  ALTER TABLE "privacy" DROP COLUMN "updated_by_id";
  ALTER TABLE "_privacy_v" DROP COLUMN "version_updated_by_id";
  ALTER TABLE "_privacy_v" DROP COLUMN "autosave";
  ALTER TABLE "site_settings" DROP COLUMN "updated_by_id";
  DROP TYPE "public"."enum_messages_status";
  DROP TYPE "public"."enum_users_role";`)
}
