-- CreateTable
CREATE TABLE "EvaluationWeight" (
    "id" TEXT NOT NULL,
    "skillWeight" INTEGER NOT NULL,
    "cultureWeight" INTEGER NOT NULL,
    "achievementWeight" INTEGER NOT NULL,
    "potentialWeight" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EvaluationWeight_pkey" PRIMARY KEY ("id")
);
