-- DropForeignKey
ALTER TABLE `activity_logs` DROP FOREIGN KEY `activity_logs_userId_fkey`;

-- DropIndex
DROP INDEX `activity_logs_userId_fkey` ON `activity_logs`;

-- AlterTable
ALTER TABLE `activity_logs` MODIFY `userId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
