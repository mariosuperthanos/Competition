/*
  Warnings:

  - You are about to drop the column `requestedAt` on the `EventRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventRequest" DROP COLUMN "requestedAt",
ALTER COLUMN "buttonState" SET DEFAULT 'notClicked';
