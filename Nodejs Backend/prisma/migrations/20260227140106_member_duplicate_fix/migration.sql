/*
  Warnings:

  - A unique constraint covering the columns `[profileId,serverId]` on the table `Member` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Member_profileId_serverId_key" ON "Member"("profileId", "serverId");
