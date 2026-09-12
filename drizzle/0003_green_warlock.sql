CREATE TYPE "public"."nao_feedback_kind" AS ENUM('up', 'down', 'copy');--> statement-breakpoint
CREATE TABLE "nao_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"brand_id" uuid NOT NULL,
	"prompt" text NOT NULL,
	"kind" "nao_feedback_kind" NOT NULL,
	"creator_ids" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "referred_by_creator_id" uuid;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "x_handle" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "payout_method" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "payout_account_holder" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "payout_iban_last4" text;--> statement-breakpoint
ALTER TABLE "nao_feedback" ADD CONSTRAINT "nao_feedback_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nao_feedback_brand_id_idx" ON "nao_feedback" USING btree ("brand_id");--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_referred_by_creator_id_creators_id_fk" FOREIGN KEY ("referred_by_creator_id") REFERENCES "public"."creators"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brands_referred_by_creator_id_idx" ON "brands" USING btree ("referred_by_creator_id");