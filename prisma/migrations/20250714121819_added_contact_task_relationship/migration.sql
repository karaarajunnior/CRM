/*
  Warnings:

  - Added the required column `taskId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `taskId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
