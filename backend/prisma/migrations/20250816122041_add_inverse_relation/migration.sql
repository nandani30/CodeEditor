/*
  Warnings:

  - You are about to drop the column `language` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "language",
ADD COLUMN     "extension" TEXT;
