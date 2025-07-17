/*
  Warnings:

  - Added the required column `contactId` to the `deals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deals` ADD COLUMN `contactId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `deals` ADD CONSTRAINT `deals_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
