/*
  Warnings:

  - The primary key for the `Cell` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `where` on the `Cell` table. All the data in the column will be lost.
  - The `whoOpened` column on the `Cell` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `IsBombCell` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellValue` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `x` to the `Cell` table without a default value. This is not possible if the table is not empty.
  - Added the required column `y` to the `Cell` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cell" DROP CONSTRAINT "Cell_pkey",
DROP COLUMN "where",
ADD COLUMN     "IsBombCell" BOOLEAN NOT NULL,
ADD COLUMN     "cellValue" INTEGER NOT NULL,
ADD COLUMN     "x" INTEGER NOT NULL,
ADD COLUMN     "y" INTEGER NOT NULL,
DROP COLUMN "whoOpened",
ADD COLUMN     "whoOpened" JSONB,
ADD CONSTRAINT "Cell_pkey" PRIMARY KEY ("x", "y");

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "isLive" BOOLEAN NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
