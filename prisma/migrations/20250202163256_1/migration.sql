/*
  Warnings:

  - You are about to drop the `_Attendees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Attendees" DROP CONSTRAINT "_Attendees_A_fkey";

-- DropForeignKey
ALTER TABLE "_Attendees" DROP CONSTRAINT "_Attendees_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserEvents" DROP CONSTRAINT "_UserEvents_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserEvents" DROP CONSTRAINT "_UserEvents_B_fkey";

-- DropTable
DROP TABLE "_Attendees";

-- DropTable
DROP TABLE "_UserEvents";
