/*
  Warnings:

  - Added the required column `contactId` to the `interactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `interactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `interactions` ADD COLUMN `contactId` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
