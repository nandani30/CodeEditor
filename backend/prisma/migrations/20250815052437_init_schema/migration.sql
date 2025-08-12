/*
  Warnings:

  - You are about to drop the column `framework` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AiMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Challenge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Flashcard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionInvite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Whiteboard` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."AiSender" AS ENUM ('user', 'ai', 'system');

-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Activity" DROP CONSTRAINT "Activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AiMessage" DROP CONSTRAINT "AiMessage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AiMessage" DROP CONSTRAINT "AiMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flashcard" DROP CONSTRAINT "Flashcard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Flashcard" DROP CONSTRAINT "Flashcard_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectFile" DROP CONSTRAINT "ProjectFile_parentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ProjectFile" DROP CONSTRAINT "ProjectFile_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SessionInvite" DROP CONSTRAINT "SessionInvite_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Submission" DROP CONSTRAINT "Submission_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Whiteboard" DROP CONSTRAINT "Whiteboard_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Whiteboard" DROP CONSTRAINT "Whiteboard_sessionId_fkey";

-- DropIndex
DROP INDEX "public"."Project_slug_key";

-- AlterTable
ALTER TABLE "public"."CollabSession" ADD COLUMN     "whiteboardData" JSONB;

-- AlterTable
ALTER TABLE "public"."Project" DROP COLUMN "framework",
DROP COLUMN "language",
DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."SessionParticipant" ADD COLUMN     "canEdit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "passwordHash",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Activity";

-- DropTable
DROP TABLE "public"."AiMessage";

-- DropTable
DROP TABLE "public"."Challenge";

-- DropTable
DROP TABLE "public"."Flashcard";

-- DropTable
DROP TABLE "public"."ProjectFile";

-- DropTable
DROP TABLE "public"."SessionInvite";

-- DropTable
DROP TABLE "public"."Submission";

-- DropTable
DROP TABLE "public"."UserStats";

-- DropTable
DROP TABLE "public"."Whiteboard";

-- DropEnum
DROP TYPE "public"."ActivityType";

-- DropEnum
DROP TYPE "public"."AiRole";

-- DropEnum
DROP TYPE "public"."Difficulty";

-- DropEnum
DROP TYPE "public"."FileType";

-- DropEnum
DROP TYPE "public"."SubmissionStatus";

-- CreateTable
CREATE TABLE "public"."Folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "parentFolderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT,
    "projectId" TEXT NOT NULL,
    "folderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIMessage" (
    "id" TEXT NOT NULL,
    "sender" "public"."AiSender" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,

    CONSTRAINT "AIMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Folder_projectId_idx" ON "public"."Folder"("projectId");

-- CreateIndex
CREATE INDEX "Folder_projectId_parentFolderId_name_idx" ON "public"."Folder"("projectId", "parentFolderId", "name");

-- CreateIndex
CREATE INDEX "File_projectId_idx" ON "public"."File"("projectId");

-- CreateIndex
CREATE INDEX "File_folderId_idx" ON "public"."File"("folderId");

-- CreateIndex
CREATE INDEX "AIMessage_projectId_createdAt_idx" ON "public"."AIMessage"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "AIMessage_sessionId_idx" ON "public"."AIMessage"("sessionId");

-- CreateIndex
CREATE INDEX "AIMessage_userId_idx" ON "public"."AIMessage"("userId");

-- CreateIndex
CREATE INDEX "Project_ownerId_idx" ON "public"."Project"("ownerId");

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIMessage" ADD CONSTRAINT "AIMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIMessage" ADD CONSTRAINT "AIMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIMessage" ADD CONSTRAINT "AIMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."CollabSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
