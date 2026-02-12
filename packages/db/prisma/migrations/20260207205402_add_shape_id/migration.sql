/*
  Warnings:

  - A unique constraint covering the columns `[shapeId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "shapeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_shapeId_key" ON "Chat"("shapeId");
