-- CreateTable
CREATE TABLE "public"."EmiDone" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EmiDone_pkey" PRIMARY KEY ("id")
);
