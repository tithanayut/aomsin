/*
  Warnings:

  - A unique constraint covering the columns `[provider,provider_uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `provider` ENUM('LOCAL', 'LDAP', 'LINE', 'AZURE_AD') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_provider_provider_uid_key` ON `User`(`provider`, `provider_uid`);
