-- AlterTable
ALTER TABLE "public"."facebook_events" ALTER COLUMN "action_time" DROP NOT NULL,
ALTER COLUMN "referrer" DROP NOT NULL,
ALTER COLUMN "ad_id" DROP NOT NULL,
ALTER COLUMN "campaign_id" DROP NOT NULL,
ALTER COLUMN "click_position" DROP NOT NULL,
ALTER COLUMN "device" DROP NOT NULL,
ALTER COLUMN "browser" DROP NOT NULL;
