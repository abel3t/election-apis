-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Code" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
