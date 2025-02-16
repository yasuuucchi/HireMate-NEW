/*
  Warnings:

  - You are about to drop the `CustomStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CustomStatus";

-- CreateTable
CREATE TABLE "customStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customStatus_name_key" ON "customStatus"("name");
