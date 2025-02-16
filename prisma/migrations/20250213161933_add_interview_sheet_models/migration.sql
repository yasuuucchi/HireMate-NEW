-- DropForeignKey
ALTER TABLE "StatusHistory" DROP CONSTRAINT "StatusHistory_candidateId_fkey";

-- Update existing NULL values to defaults
UPDATE "Candidate"
SET "skillScore" = 0,
    "cultureScore" = 0,
    "achievementScore" = 0,
    "potentialScore" = 0,
    "totalScore" = 0,
    "rank" = 'C'
WHERE "skillScore" IS NULL
   OR "cultureScore" IS NULL
   OR "achievementScore" IS NULL
   OR "potentialScore" IS NULL
   OR "totalScore" IS NULL
   OR "rank" IS NULL;

-- AlterTable
ALTER TABLE "Candidate" 
ALTER COLUMN "skillScore" SET NOT NULL,
ALTER COLUMN "skillScore" SET DEFAULT 0,
ALTER COLUMN "cultureScore" SET NOT NULL,
ALTER COLUMN "cultureScore" SET DEFAULT 0,
ALTER COLUMN "achievementScore" SET NOT NULL,
ALTER COLUMN "achievementScore" SET DEFAULT 0,
ALTER COLUMN "potentialScore" SET NOT NULL,
ALTER COLUMN "potentialScore" SET DEFAULT 0,
ALTER COLUMN "totalScore" SET NOT NULL,
ALTER COLUMN "totalScore" SET DEFAULT 0,
ALTER COLUMN "rank" SET NOT NULL,
ALTER COLUMN "rank" SET DEFAULT 'C';

-- AlterTable
ALTER TABLE "CultureValue" ALTER COLUMN "importance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "InterviewSheet" DROP COLUMN "notes",
DROP COLUMN "questions",
DROP COLUMN "ratings";

-- DropTable
DROP TABLE "StatusHistory";

-- CreateTable
CREATE TABLE "InterviewQuestion" (
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

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_interviewSheetId_fkey" FOREIGN KEY ("interviewSheetId") REFERENCES "InterviewSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
