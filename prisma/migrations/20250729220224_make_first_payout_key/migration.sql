-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "first_payout" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "second_payout" BOOLEAN NOT NULL DEFAULT false;
