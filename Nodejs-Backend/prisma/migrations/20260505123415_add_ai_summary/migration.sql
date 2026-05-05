-- CreateEnum
CREATE TYPE "AiSummaryType" AS ENUM ('Channel', 'VIDEO', 'DIRECT_MESSAGE');

-- CreateTable
CREATE TABLE "AiSummary" (
    "id" TEXT NOT NULL,
    "type" "AiSummaryType" NOT NULL,
    "channelId" TEXT,
    "recordingUrl" TEXT,
    "conversationId" TEXT,
    "content" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiSummary_channelId_idx" ON "AiSummary"("channelId");

-- CreateIndex
CREATE INDEX "AiSummary_conversationId_idx" ON "AiSummary"("conversationId");

-- AddForeignKey
ALTER TABLE "AiSummary" ADD CONSTRAINT "AiSummary_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSummary" ADD CONSTRAINT "AiSummary_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSummary" ADD CONSTRAINT "AiSummary_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
