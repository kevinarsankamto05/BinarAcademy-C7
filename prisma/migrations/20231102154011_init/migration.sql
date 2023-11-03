/*
  Warnings:

  - Made the column `title` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `director` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actor` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `writer` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movie" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "director" SET NOT NULL,
ALTER COLUMN "actor" SET NOT NULL,
ALTER COLUMN "writer" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "images" DROP NOT NULL;
