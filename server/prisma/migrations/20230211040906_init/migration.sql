-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "upvotescount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "suggestion" (
    "id" TEXT NOT NULL,
    "investerID" TEXT NOT NULL,
    "postID" TEXT NOT NULL,

    CONSTRAINT "suggestion_pkey" PRIMARY KEY ("id")
);
