/*
  Warnings:

  - You are about to drop the `customStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "customStatus";

-- CreateTable
CREATE TABLE "CustomStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomStatus_name_key" ON "CustomStatus"("name");
