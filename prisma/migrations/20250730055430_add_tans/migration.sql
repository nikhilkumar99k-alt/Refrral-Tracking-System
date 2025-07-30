-- CreateEnum
CREATE TYPE "public"."ReferralStatus" AS ENUM ('IN_PROGRESS', 'REJECTED', 'CONVERTED_TO_CUSTOMER');

-- CreateEnum
CREATE TYPE "public"."TransactionSource" AS ENUM ('EMI', 'REFRRAL', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "campaign_id" INTEGER;

-- AlterTable
ALTER TABLE "public"."Lead" ADD COLUMN     "campaign_id" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "referralStatus" "public"."ReferralStatus";

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "source" "public"."TransactionSource" DEFAULT 'OTHER';

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Lead" ADD CONSTRAINT "Lead_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
