CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."actor" AS ENUM('brand', 'creator', 'system');--> statement-breakpoint
CREATE TYPE "public"."collaboration_origin" AS ENUM('invitation', 'application');--> statement-breakpoint
CREATE TYPE "public"."collaboration_status" AS ENUM('invited', 'applied', 'accepted', 'declined', 'draft_submitted', 'changes_requested', 'approved', 'scheduled', 'live', 'paid');--> statement-breakpoint
CREATE TYPE "public"."ledger_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."ledger_type" AS ENUM('topup', 'booking', 'payout', 'withdrawal');--> statement-breakpoint
CREATE TYPE "public"."pixel_event_type" AS ENUM('visit', 'signup', 'purchase');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('brand', 'creator');--> statement-breakpoint
CREATE TABLE "brands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"owner_user_id" uuid NOT NULL,
	"slug" text NOT NULL,
	"company" text NOT NULL,
	"website" text,
	"value_prop" text,
	"icps" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"target_industries" text[] DEFAULT '{}' NOT NULL,
	"target_regions" text[] DEFAULT '{}' NOT NULL,
	"wallet_cents" integer DEFAULT 0 NOT NULL,
	"pixel_site_key" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"brand_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"open_to_applications" boolean DEFAULT true NOT NULL,
	"post_deadline" timestamp with time zone,
	"default_fee_cents" integer DEFAULT 0 NOT NULL,
	"brief" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"brand_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collaboration_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"collaboration_id" uuid NOT NULL,
	"from_status" "collaboration_status",
	"to_status" "collaboration_status" NOT NULL,
	"event" text NOT NULL,
	"actor" "actor" NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "collaborations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"creator_id" uuid NOT NULL,
	"origin" "collaboration_origin" NOT NULL,
	"status" "collaboration_status" NOT NULL,
	"fee_cents" integer NOT NULL,
	"due_date" timestamp with time zone,
	"revision_round" integer DEFAULT 0 NOT NULL,
	"draft_text" text,
	"review_note" text,
	"post_url" text,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"paid_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"collaboration_id" uuid NOT NULL,
	"sender_user_id" uuid NOT NULL,
	"body" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"creator_id" uuid NOT NULL,
	"url" text NOT NULL,
	"body" text NOT NULL,
	"impressions" integer DEFAULT 0 NOT NULL,
	"reactions" integer DEFAULT 0 NOT NULL,
	"comments" integer DEFAULT 0 NOT NULL,
	"reposts" integer DEFAULT 0 NOT NULL,
	"posted_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"handle" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"headline" text NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"country" text NOT NULL,
	"industries" text[] DEFAULT '{}' NOT NULL,
	"followers" integer DEFAULT 0 NOT NULL,
	"price_cents" integer NOT NULL,
	"bundles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"median_views" integer DEFAULT 0 NOT NULL,
	"engagement_rate" real DEFAULT 0 NOT NULL,
	"posts_per_month" real DEFAULT 0 NOT NULL,
	"audience_job_titles" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"audience_seniority" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"avatar_url" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"brand_id" uuid,
	"creator_id" uuid,
	"collaboration_id" uuid,
	"type" "ledger_type" NOT NULL,
	"status" "ledger_status" DEFAULT 'completed' NOT NULL,
	"amount_cents" integer NOT NULL,
	"reference" text NOT NULL,
	"description" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"tracking_link_id" uuid NOT NULL,
	"clicked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_hash" text,
	"user_agent" text,
	"referrer" text,
	"country" text
);
--> statement-breakpoint
CREATE TABLE "pixel_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"brand_id" uuid NOT NULL,
	"click_id" uuid,
	"type" "pixel_event_type" NOT NULL,
	"value_cents" integer DEFAULT 0 NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"visitor_id" text
);
--> statement-breakpoint
CREATE TABLE "tracking_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"collaboration_id" uuid NOT NULL,
	"code" text NOT NULL,
	"destination" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"csrf_token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"heard_about" text
);
--> statement-breakpoint
ALTER TABLE "brands" ADD CONSTRAINT "brands_owner_user_id_users_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlist" ADD CONSTRAINT "shortlist_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlist" ADD CONSTRAINT "shortlist_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaboration_events" ADD CONSTRAINT "collaboration_events_collaboration_id_collaborations_id_fk" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_collaboration_id_collaborations_id_fk" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_posts" ADD CONSTRAINT "creator_posts_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creators" ADD CONSTRAINT "creators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_creator_id_creators_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creators"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_collaboration_id_collaborations_id_fk" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_tracking_link_id_tracking_links_id_fk" FOREIGN KEY ("tracking_link_id") REFERENCES "public"."tracking_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pixel_events" ADD CONSTRAINT "pixel_events_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pixel_events" ADD CONSTRAINT "pixel_events_click_id_clicks_id_fk" FOREIGN KEY ("click_id") REFERENCES "public"."clicks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_links" ADD CONSTRAINT "tracking_links_collaboration_id_collaborations_id_fk" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_pixel_site_key_idx" ON "brands" USING btree ("pixel_site_key");--> statement-breakpoint
CREATE INDEX "brands_owner_user_id_idx" ON "brands" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "campaigns_brand_id_idx" ON "campaigns" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "campaigns_status_idx" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "shortlist_brand_creator_idx" ON "shortlist" USING btree ("brand_id","creator_id");--> statement-breakpoint
CREATE INDEX "shortlist_creator_id_idx" ON "shortlist" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "collaboration_events_collaboration_id_idx" ON "collaboration_events" USING btree ("collaboration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "collaborations_campaign_creator_idx" ON "collaborations" USING btree ("campaign_id","creator_id");--> statement-breakpoint
CREATE INDEX "collaborations_creator_id_idx" ON "collaborations" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "collaborations_status_idx" ON "collaborations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "messages_collaboration_id_idx" ON "messages" USING btree ("collaboration_id");--> statement-breakpoint
CREATE INDEX "messages_sender_user_id_idx" ON "messages" USING btree ("sender_user_id");--> statement-breakpoint
CREATE INDEX "creator_posts_creator_id_idx" ON "creator_posts" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "creators_user_id_idx" ON "creators" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "creators_handle_idx" ON "creators" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "creators_followers_idx" ON "creators" USING btree ("followers");--> statement-breakpoint
CREATE INDEX "ledger_entries_brand_id_idx" ON "ledger_entries" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_creator_id_idx" ON "ledger_entries" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "ledger_entries_collaboration_id_idx" ON "ledger_entries" USING btree ("collaboration_id");--> statement-breakpoint
CREATE INDEX "clicks_tracking_link_id_clicked_at_idx" ON "clicks" USING btree ("tracking_link_id","clicked_at");--> statement-breakpoint
CREATE INDEX "pixel_events_brand_id_occurred_at_idx" ON "pixel_events" USING btree ("brand_id","occurred_at");--> statement-breakpoint
CREATE INDEX "pixel_events_click_id_idx" ON "pixel_events" USING btree ("click_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tracking_links_code_idx" ON "tracking_links" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "tracking_links_collaboration_id_idx" ON "tracking_links" USING btree ("collaboration_id");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_idx" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");