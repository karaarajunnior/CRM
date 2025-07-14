/*
  Warnings:

  - Added the required column `contactId` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks` ADD COLUMN `contactId` VARCHAR(191) NOT NULL;
