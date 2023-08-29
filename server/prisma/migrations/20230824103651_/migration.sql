/*
  Warnings:

  - You are about to drop the column `userInputs` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `isLive` on the `Player` table. All the data in the column will be lost.
  - Added the required column `isAlive` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "userInputs";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "isLive",
ADD COLUMN     "isAlive" BOOLEAN NOT NULL;
