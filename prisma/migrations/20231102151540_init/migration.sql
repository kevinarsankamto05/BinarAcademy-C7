/*
  Warnings:

  - You are about to drop the column `createdAt` on the `movie` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `movie` table. All the data in the column will be lost.
  - Made the column `director` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `actor` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `writer` on table `movie` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "movie" DROP COLUMN "createdAt",
DROP COLUMN "updateAt",
ALTER COLUMN "director" SET NOT NULL,
ALTER COLUMN "actor" SET NOT NULL,
ALTER COLUMN "writer" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
