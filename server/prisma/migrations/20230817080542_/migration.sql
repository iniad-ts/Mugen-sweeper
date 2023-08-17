-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "bombMap" JSONB NOT NULL,
    "userInputs" JSONB NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "where" JSONB NOT NULL,
    "whoOpened" TEXT NOT NULL,
    "whenOpened" TIMESTAMP(3),

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("where")
);
