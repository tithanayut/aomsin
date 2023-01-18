/*
  Warnings:

  - You are about to drop the column `walletFromId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `walletToId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `walletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_walletFromId_fkey`;

-- DropForeignKey
ALTER TABLE `Transaction` DROP FOREIGN KEY `Transaction_walletToId_fkey`;

-- AlterTable
ALTER TABLE `Transaction` DROP COLUMN `walletFromId`,
    DROP COLUMN `walletToId`,
    ADD COLUMN `transferWalletId` VARCHAR(191) NULL,
    ADD COLUMN `walletId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `Wallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaction` ADD CONSTRAINT `Transaction_transferWalletId_fkey` FOREIGN KEY (`transferWalletId`) REFERENCES `Wallet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
