-- CreateTable
CREATE TABLE `Ticket` (
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Todo',
    `priority` VARCHAR(191) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `helpfulNotes` VARCHAR(191) NOT NULL,
    `relatedSkills` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByEmail` VARCHAR(191) NOT NULL,
    `assignedToEmail` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ticket_title_key`(`title`),
    PRIMARY KEY (`title`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `use` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `skills` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user', 'manager') NOT NULL DEFAULT 'admin',

    UNIQUE INDEX `use_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_createdByEmail_fkey` FOREIGN KEY (`createdByEmail`) REFERENCES `use`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assignedToEmail_fkey` FOREIGN KEY (`assignedToEmail`) REFERENCES `use`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
