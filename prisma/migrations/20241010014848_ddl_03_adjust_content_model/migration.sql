/*
  Warnings:

  - Added the required column `areaId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "areaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "QuizzAnswer" ADD COLUMN     "answer" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
