/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("x", "y", "whenOpened");
