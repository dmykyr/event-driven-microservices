-- CreateEnum
CREATE TYPE "public"."funnel_stage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "public"."facebook_event_type" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view', 'ad_click', 'form_submission', 'checkout_complete');

-- CreateEnum
CREATE TYPE "public"."gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "public"."referrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "public"."click_position" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "public"."facebook_device" AS ENUM ('mobile', 'desktop');

-- CreateEnum
CREATE TYPE "public"."browser" AS ENUM ('chrome', 'firefox', 'safari');

-- CreateTable
CREATE TABLE "public"."facebook_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnel_stage" "public"."funnel_stage" NOT NULL,
    "event_type" "public"."facebook_event_type" NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_age" INTEGER NOT NULL,
    "user_gender" "public"."gender" NOT NULL,
    "user_country" TEXT NOT NULL,
    "user_city" TEXT NOT NULL,
    "action_time" TIMESTAMP(3) NOT NULL,
    "referrer" "public"."referrer" NOT NULL,
    "video_id" TEXT,
    "ad_id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "click_position" "public"."click_position" NOT NULL,
    "device" "public"."facebook_device" NOT NULL,
    "browser" "public"."browser" NOT NULL,
    "purchase_amount" DECIMAL(65,30),

    CONSTRAINT "facebook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "facebook_events_timestamp_idx" ON "public"."facebook_events"("timestamp");

-- CreateIndex
CREATE INDEX "facebook_events_event_type_idx" ON "public"."facebook_events"("event_type");

-- CreateIndex
CREATE INDEX "facebook_events_campaign_id_idx" ON "public"."facebook_events"("campaign_id");

-- CreateIndex
CREATE INDEX "facebook_events_user_country_idx" ON "public"."facebook_events"("user_country");

-- CreateIndex
CREATE INDEX "facebook_events_user_age_idx" ON "public"."facebook_events"("user_age");

-- CreateIndex
CREATE INDEX "facebook_events_funnel_stage_idx" ON "public"."facebook_events"("funnel_stage");
