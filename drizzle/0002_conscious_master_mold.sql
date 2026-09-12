ALTER TABLE "brands" ADD COLUMN "website_summary" jsonb;--> statement-breakpoint
ALTER TABLE "brands" ADD COLUMN "onboarding_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "legal_country" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "registered_business" boolean;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "legal_name" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "legal_address" text;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "tax_acknowledged" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "invoicing_authorized" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "creators" ADD COLUMN "onboarding_completed_at" timestamp with time zone;