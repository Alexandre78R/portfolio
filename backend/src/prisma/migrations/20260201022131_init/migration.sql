/*
  Warnings:

  - You are about to drop the column `createdAt` on the `aboutme` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `aboutme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aboutme` DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`;
