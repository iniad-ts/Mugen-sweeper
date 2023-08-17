/*
  Warnings:

  - Made the column `whenOpened` on table `Cell` required. This step will fail if there are existing NULL values in that column.
  - Made the column `whoOpened` on table `Cell` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cell" ALTER COLUMN "whenOpened" SET NOT NULL,
ALTER COLUMN "whoOpened" SET NOT NULL,
ALTER COLUMN "whoOpened" SET DATA TYPE TEXT;
