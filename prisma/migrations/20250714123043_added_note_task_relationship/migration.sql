-- AlterTable
ALTER TABLE `notes` ADD COLUMN `taskId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `notes` ADD CONSTRAINT `notes_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
