/*
  Warnings:

  - Added the required column `isUserInput` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cell" ADD COLUMN     "isUserInput" BOOLEAN NOT NULL;
