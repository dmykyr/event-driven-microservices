-- CreateEnum
CREATE TYPE "public"."tiktok_event_type" AS ENUM ('video_view', 'page_like', 'share', 'comment', 'profile_visit', 'purchase', 'follow');

-- CreateEnum
CREATE TYPE "public"."tiktok_device" AS ENUM ('android', 'ios', 'desktop');

-- CreateTable
CREATE TABLE "public"."tiktok_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnel_stage" "public"."funnel_stage" NOT NULL,
    "event_type" "public"."tiktok_event_type" NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,
    "watchTime" INTEGER,
    "percentageWatched" INTEGER,
    "device" "public"."tiktok_device",
    "country" TEXT,
    "videoId" TEXT,
    "action_time" TIMESTAMP(3),
    "profile_id" TEXT,
    "purchased_item" TEXT,
    "purchase_amount" DECIMAL(65,30),

    CONSTRAINT "tiktok_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tiktok_events_timestamp_idx" ON "public"."tiktok_events"("timestamp");

-- CreateIndex
CREATE INDEX "tiktok_events_event_type_idx" ON "public"."tiktok_events"("event_type");

-- CreateIndex
CREATE INDEX "tiktok_events_funnel_stage_idx" ON "public"."tiktok_events"("funnel_stage");

-- CreateIndex
CREATE INDEX "tiktok_events_followers_idx" ON "public"."tiktok_events"("followers");

-- CreateIndex
CREATE INDEX "tiktok_events_watchTime_idx" ON "public"."tiktok_events"("watchTime");
