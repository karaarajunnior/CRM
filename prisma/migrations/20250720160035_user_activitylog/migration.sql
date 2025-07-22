/*
  Warnings:

  - Made the column `userId` on table `activity_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `activity_logs` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `activity_logs` ADD CONSTRAINT `activity_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
