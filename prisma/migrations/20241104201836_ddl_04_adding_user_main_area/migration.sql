-- AlterTable
ALTER TABLE "User" ADD COLUMN     "mainAreaId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_mainAreaId_fkey" FOREIGN KEY ("mainAreaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
