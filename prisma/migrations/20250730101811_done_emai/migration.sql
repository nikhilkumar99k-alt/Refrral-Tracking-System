/*
  Warnings:

  - A unique constraint covering the columns `[cust_id]` on the table `EmiDone` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."EmiDone" ADD COLUMN     "cust_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "EmiDone_cust_id_key" ON "public"."EmiDone"("cust_id");

-- AddForeignKey
ALTER TABLE "public"."EmiDone" ADD CONSTRAINT "EmiDone_cust_id_fkey" FOREIGN KEY ("cust_id") REFERENCES "public"."Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
