/*
  Warnings:

  - You are about to drop the `EvaluationWeight` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewQuestion" DROP CONSTRAINT "InterviewQuestion_interviewSheetId_fkey";

-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "skillScore" DROP NOT NULL,
ALTER COLUMN "skillScore" DROP DEFAULT,
ALTER COLUMN "cultureScore" DROP NOT NULL,
ALTER COLUMN "cultureScore" DROP DEFAULT,
ALTER COLUMN "achievementScore" DROP NOT NULL,
ALTER COLUMN "achievementScore" DROP DEFAULT,
ALTER COLUMN "potentialScore" DROP NOT NULL,
ALTER COLUMN "potentialScore" DROP DEFAULT,
ALTER COLUMN "totalScore" DROP NOT NULL,
ALTER COLUMN "totalScore" DROP DEFAULT,
ALTER COLUMN "rank" DROP NOT NULL,
ALTER COLUMN "rank" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CustomStatus" ALTER COLUMN "order" SET DEFAULT 0;

-- DropTable
DROP TABLE "EvaluationWeight";

-- DropTable
DROP TABLE "InterviewQuestion";

-- CreateTable
CREATE TABLE "EvaluationWeights" (
    "id" TEXT NOT NULL,
    "skillWeight" DOUBLE PRECISION NOT NULL,
    "cultureWeight" DOUBLE PRECISION NOT NULL,
    "achievementWeight" DOUBLE PRECISION NOT NULL,
    "potentialWeight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationWeights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "goodAnswerExample" TEXT NOT NULL,
    "badAnswerExample" TEXT NOT NULL,
    "rating" INTEGER,
    "note" TEXT,
    "order" INTEGER NOT NULL,
    "interviewSheetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_interviewSheetId_fkey" FOREIGN KEY ("interviewSheetId") REFERENCES "InterviewSheet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
