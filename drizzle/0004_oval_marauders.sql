CREATE TABLE "newsletter_signups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"source" text DEFAULT 'landing-footer' NOT NULL
);
--> statement-breakpoint
CREATE INDEX "newsletter_signups_email_idx" ON "newsletter_signups" USING btree ("email");