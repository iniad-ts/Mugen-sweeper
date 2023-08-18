/*
  Warnings:

  - You are about to drop the column `IsBombCell` on the `Cell` table. All the data in the column will be lost.
  - Added the required column `isBombCell` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cell" DROP COLUMN "IsBombCell",
ADD COLUMN     "isBombCell" BOOLEAN NOT NULL;
