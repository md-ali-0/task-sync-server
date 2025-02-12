-- AlterTable
ALTER TABLE `Task` ADD COLUMN `Deleted_at` DATETIME(3) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
