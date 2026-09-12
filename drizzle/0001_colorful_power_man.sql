CREATE TYPE "public"."campaign_source" AS ENUM('manual', 'ai', 'link', 'team');--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "source" "campaign_source" DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "source_prompt" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "source_url" text;--> statement-breakpoint
ALTER TABLE "collaborations" ADD COLUMN "list_price_cents" integer;--> statement-breakpoint
ALTER TABLE "collaborations" ADD COLUMN "discount_percent" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborations" ADD COLUMN "approve_before_publish" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "collaborations" ADD COLUMN "accept_by" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "collaborations" ADD COLUMN "offer_note" text;