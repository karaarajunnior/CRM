-- DropForeignKey
ALTER TABLE `activity_logs` DROP FOREIGN KEY `activity_logs_userId_fkey`;

-- DropIndex
DROP INDEX `activity_logs_userId_fkey` ON `activity_logs`;
