/*
  Warnings:

  - Added the required column `email` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Invester" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "intrest" TEXT NOT NULL,

    CONSTRAINT "Invester_pkey" PRIMARY KEY ("id")
);
