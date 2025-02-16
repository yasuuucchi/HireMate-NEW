/*
  Warnings:

  - You are about to drop the `CareerMilestone` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewQuestion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `questions` to the `InterviewSheet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CareerMilestone" DROP CONSTRAINT "CareerMilestone_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewQuestion" DROP CONSTRAINT "InterviewQuestion_interviewSheetId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewSheet" DROP CONSTRAINT "InterviewSheet_candidateId_fkey";

-- AlterTable
ALTER TABLE "CultureValue" ALTER COLUMN "importance" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "EvaluationWeight" ALTER COLUMN "skillWeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cultureWeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "achievementWeight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "potentialWeight" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "InterviewSheet" ADD COLUMN     "notes" JSONB,
ADD COLUMN     "questions" JSONB NOT NULL,
ADD COLUMN     "ratings" JSONB;

-- DropTable
DROP TABLE "CareerMilestone";

-- DropTable
DROP TABLE "InterviewQuestion";

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

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

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSheet" ADD CONSTRAINT "InterviewSheet_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
