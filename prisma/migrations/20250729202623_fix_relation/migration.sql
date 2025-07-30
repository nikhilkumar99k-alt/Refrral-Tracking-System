-- DropForeignKey
ALTER TABLE "public"."Customer" DROP CONSTRAINT "Customer_leadId_fkey";

-- DropIndex
DROP INDEX "public"."Customer_leadId_key";

-- AlterTable
ALTER TABLE "public"."Customer" ALTER COLUMN "leadId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Customer" ADD CONSTRAINT "Customer_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;
