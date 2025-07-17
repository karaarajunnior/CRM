-- AlterTable
ALTER TABLE `activity_logs` MODIFY `action` VARCHAR(191) NULL,
    MODIFY `entity` VARCHAR(191) NULL,
    MODIFY `entityId` VARCHAR(191) NULL;
