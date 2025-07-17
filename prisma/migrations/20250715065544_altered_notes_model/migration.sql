/*
  Warnings:

  - Added the required column `noteId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `noteId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
