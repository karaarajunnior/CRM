/*
  Warnings:

  - Added the required column `noteId` to the `interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` ADD COLUMN `interactionId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `interactions` ADD COLUMN `completed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `noteId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_interactionId_fkey` FOREIGN KEY (`interactionId`) REFERENCES `interactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `interactions` ADD CONSTRAINT `interactions_noteId_fkey` FOREIGN KEY (`noteId`) REFERENCES `notes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
